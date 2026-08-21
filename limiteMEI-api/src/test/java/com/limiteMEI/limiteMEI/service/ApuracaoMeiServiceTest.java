package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.mei.ApuracaoMeiDTO;
import com.limiteMEI.limiteMEI.dto.mei.HistoricoApuracaoMeiDTO;
import com.limiteMEI.limiteMEI.enums.*;
import com.limiteMEI.limiteMEI.repository.LancamentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.repository.FechamentoApuracaoMeiRepository;
import com.limiteMEI.limiteMEI.repository.DocumentoFiscalRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ApuracaoMeiServiceTest {

    private final LancamentoFinanceiroRepository repository = mock(LancamentoFinanceiroRepository.class);
    private final EmpresaAtualService empresaAtual = mock(EmpresaAtualService.class);
    private final FechamentoApuracaoMeiRepository fechamentos = mock(FechamentoApuracaoMeiRepository.class);
    private final DocumentoFiscalRepository documentosFiscais = mock(DocumentoFiscalRepository.class);
    private final ApuracaoMeiService service = new ApuracaoMeiService(
            repository, empresaAtual, fechamentos, documentosFiscais);

    @Test
    void deveSepararReceitasPorNaturezaEAcumularAteReferencia() {
        Empresa empresa = empresa(LocalDate.of(2020, 1, 10));
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(eq(1L), any(), any())).thenReturn(List.of(
                receita("1000.00", LocalDate.of(2026, 1, 1), NaturezaReceitaEnum.COMERCIO),
                receita("500.00", LocalDate.of(2026, 2, 1), NaturezaReceitaEnum.SERVICOS, true),
                receita("250.00", LocalDate.of(2026, 2, 1), NaturezaReceitaEnum.INDUSTRIA)));

        ApuracaoMeiDTO resultado = service.apurar(2026, 2);

        assertEquals(0, resultado.getComercioMes().compareTo(BigDecimal.ZERO));
        assertEquals(0, resultado.getIndustriaMes().compareTo(new BigDecimal("250.00")));
        assertEquals(0, resultado.getServicosMes().compareTo(new BigDecimal("500.00")));
        assertEquals(0, resultado.getAcumuladoAno().compareTo(new BigDecimal("1750.00")));
        assertEquals(0, resultado.getLimiteAplicavel().compareTo(new BigDecimal("81000.00")));
        assertEquals(0, resultado.getComDocumentoFiscalMes().compareTo(new BigDecimal("500.00")));
        assertEquals(0, resultado.getSemDocumentoFiscalMes().compareTo(new BigDecimal("250.00")));
    }

    @Test
    void deveAplicarLimiteProporcionalNoAnoDeAbertura() {
        Empresa empresa = empresa(LocalDate.of(2026, 7, 15));
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(anyLong(), any(), any())).thenReturn(List.of());

        ApuracaoMeiDTO resultado = service.apurar(2026, 12);

        assertEquals(6, resultado.getMesesLimite());
        assertEquals(0, resultado.getLimiteAplicavel().compareTo(new BigDecimal("40500.00")));
    }

    @Test
    void deveIdentificarPendenciaFiscalEMotivoDeNaoInclusao() {
        Empresa empresa = empresa(LocalDate.of(2020, 1, 1));
        LancamentoFinanceiro pendente = receita("300.00", LocalDate.of(2026, 8, 1), NaturezaReceitaEnum.SERVICOS);
        pendente.getCategoria().setExigeDocumentoFiscal(true);
        LancamentoFinanceiro inativo = receita("200.00", LocalDate.of(2026, 8, 1), NaturezaReceitaEnum.COMERCIO);
        inativo.setAtivo(false);
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(anyLong(), any(), any())).thenReturn(List.of(pendente, inativo));

        ApuracaoMeiDTO resultado = service.apurar(2026, 8);

        assertEquals(1, resultado.getQuantidadePendencias());
        assertEquals(0, resultado.getTotalMes().compareTo(new BigDecimal("300.00")));
        assertTrue(resultado.getDetalhes().get(0).getPendenciaFiscal());
        assertFalse(resultado.getDetalhes().get(1).getIncluido());
        assertEquals("Lançamento inativo", resultado.getDetalhes().get(1).getMotivoNaoInclusao());
    }

    @Test
    void deveMontarHistoricoAnualPreservandoTotalDoMesFechado() {
        Empresa empresa = empresa(LocalDate.of(2020, 1, 1));
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(anyLong(), any(), any())).thenReturn(List.of(
                receita("900.00", LocalDate.of(2026, 1, 1), NaturezaReceitaEnum.COMERCIO),
                receita("500.00", LocalDate.of(2026, 2, 1), NaturezaReceitaEnum.SERVICOS)));
        when(fechamentos.findByEmpresaIdAndAnoOrderByMes(1L, 2026)).thenReturn(List.of(
                FechamentoApuracaoMei.builder().mes(1).situacao(SituacaoApuracaoMeiEnum.FECHADA)
                        .total(new BigDecimal("700.00")).build()));

        HistoricoApuracaoMeiDTO resultado = service.historico(2026);

        assertEquals(12, resultado.getMeses().size());
        assertEquals(0, resultado.getMeses().get(0).getTotalMes().compareTo(new BigDecimal("700.00")));
        assertEquals(0, resultado.getMeses().get(1).getAcumuladoAno().compareTo(new BigDecimal("1200.00")));
        assertEquals(SituacaoApuracaoMeiEnum.FECHADA, resultado.getMeses().get(0).getSituacao());
    }

    @Test
    void deveSinalizarFaixaDeAtencaoAoAtingirSetentaECincoPorCento() {
        Empresa empresa = empresa(LocalDate.of(2020, 1, 1));
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(anyLong(), any(), any())).thenReturn(List.of(
                receita("60750.00", LocalDate.of(2026, 1, 1), NaturezaReceitaEnum.COMERCIO)));

        ApuracaoMeiDTO resultado = service.apurar(2026, 1);

        assertEquals(FaixaAlertaMeiEnum.ATENCAO_75, resultado.getFaixaAlerta());
        assertEquals(0, resultado.getPercentualUtilizado().compareTo(new BigDecimal("75.00")));
    }

    @Test
    void deveImpedirFechamentoForaDaSequenciaMensal() {
        Empresa empresa = empresa(LocalDate.of(2026, 7, 1));
        when(empresaAtual.get()).thenReturn(empresa);
        when(repository.findReceitasParaApuracaoMei(anyLong(), any(), any())).thenReturn(List.of());
        when(fechamentos.findByEmpresaIdAndAnoOrderByMes(1L, 2026)).thenReturn(List.of());

        ApplicationException erro = assertThrows(ApplicationException.class, () -> service.fechar(2026, 8));

        assertTrue(erro.getMessageException().getMessages().get(0).contains("07/2026"));
    }

    private Empresa empresa(LocalDate abertura) {
        return Empresa.builder().id(1L).dataAbertura(abertura)
                .limiteAnual(new BigDecimal("81000.00")).build();
    }

    private LancamentoFinanceiro receita(String valor, LocalDate competencia, NaturezaReceitaEnum natureza) {
        return receita(valor, competencia, natureza, false);
    }

    private LancamentoFinanceiro receita(String valor, LocalDate competencia, NaturezaReceitaEnum natureza,
                                          boolean documentoFiscalEmitido) {
        Categoria categoria = Categoria.builder().naturezaReceita(natureza).compoeFaturamentoMei(true).build();
        return LancamentoFinanceiro.builder().valor(new BigDecimal(valor)).dataCompetencia(competencia)
                .categoria(categoria).tipo(TipoLancamentoEnum.RECEBER)
                .documentoFiscalEmitido(documentoFiscalEmitido).build();
    }
}
