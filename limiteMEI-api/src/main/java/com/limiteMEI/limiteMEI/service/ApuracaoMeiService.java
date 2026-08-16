package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.mei.*;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.repository.LancamentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.repository.FechamentoApuracaoMeiRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import com.limiteMEI.limiteMEI.dto.lancamento.MotivoOperacaoDTO;
import com.limiteMEI.limiteMEI.enums.SituacaoApuracaoMeiEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import java.math.*;
import java.time.*;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ApuracaoMeiService {
    private static final BigDecimal CEM = new BigDecimal("100");
    private final LancamentoFinanceiroRepository lancamentos;
    private final EmpresaAtualService empresaAtual;
    private final FechamentoApuracaoMeiRepository fechamentos;

    public ApuracaoMeiService(LancamentoFinanceiroRepository lancamentos, EmpresaAtualService empresaAtual,
                              FechamentoApuracaoMeiRepository fechamentos) {
        this.lancamentos = lancamentos;
        this.empresaAtual = empresaAtual;
        this.fechamentos = fechamentos;
    }

    public ApuracaoMeiDTO apurar(int ano, int mesReferencia) {
        if (ano < 2000 || mesReferencia < 1 || mesReferencia > 12) {
            throw new ApplicationException("Período de apuração inválido");
        }
        Empresa empresa = empresaAtual.get();
        List<LancamentoFinanceiro> todos = lancamentos.findReceitasParaApuracaoMei(
                empresa.getId(), LocalDate.of(ano, 1, 1), YearMonth.of(ano, mesReferencia).atEndOfMonth());
        List<LancamentoFinanceiro> receitas = todos.stream().filter(this::incluido).toList();
        List<ResumoMensalMeiDTO> meses = new ArrayList<>();
        for (int mes = 1; mes <= mesReferencia; mes++) {
            meses.add(resumirMes(receitas, mes));
        }
        ResumoMensalMeiDTO referencia = meses.get(mesReferencia - 1);
        BigDecimal acumulado = meses.stream().map(ResumoMensalMeiDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int mesesLimite = mesesLimite(empresa, ano);
        BigDecimal limite = empresa.getLimiteAnual().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(mesesLimite));
        BigDecimal percentual = limite.signum() == 0 ? BigDecimal.ZERO
                : acumulado.multiply(CEM).divide(limite, 2, RoundingMode.HALF_UP);
        int primeiroMes = empresa.getDataAbertura().getYear() == ano ? empresa.getDataAbertura().getMonthValue() : 1;
        int mesesDecorridos = Math.max(0, mesReferencia - primeiroMes + 1);
        BigDecimal projecao = mesesDecorridos == 0 ? BigDecimal.ZERO
                : acumulado.divide(BigDecimal.valueOf(mesesDecorridos), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(mesesLimite));
        List<DetalheApuracaoMeiDTO> detalhes = todos.stream()
                .filter(item -> item.getDataCompetencia().getMonthValue() == mesReferencia)
                .map(this::detalhar).toList();
        Optional<FechamentoApuracaoMei> fechamento = fechamentos
                .findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mesReferencia);
        return ApuracaoMeiDTO.builder().ano(ano).mesReferencia(mesReferencia)
                .comercioMes(referencia.getComercio()).industriaMes(referencia.getIndustria())
                .servicosMes(referencia.getServicos()).totalMes(referencia.getTotal())
                .comDocumentoFiscalMes(referencia.getComDocumentoFiscal())
                .semDocumentoFiscalMes(referencia.getSemDocumentoFiscal())
                .acumuladoAno(acumulado).limiteAplicavel(limite)
                .saldoDisponivel(limite.subtract(acumulado)).percentualUtilizado(percentual)
                .projecaoAnual(projecao).mesesLimite(mesesLimite)
                .quantidadePendencias((int) detalhes.stream().filter(DetalheApuracaoMeiDTO::getPendenciaFiscal).count())
                .meses(meses).detalhes(detalhes)
                .situacaoFechamento(fechamento.map(FechamentoApuracaoMei::getSituacao).orElse(null))
                .dataFechamento(fechamento.map(FechamentoApuracaoMei::getDataFechamento).orElse(null))
                .usuarioFechamento(fechamento.map(FechamentoApuracaoMei::getUsuarioFechamento).orElse(null))
                .motivoReabertura(fechamento.map(FechamentoApuracaoMei::getMotivoReabertura).orElse(null))
                .build();
    }

    @Transactional
    public ApuracaoMeiDTO fechar(int ano, int mes) {
        ApuracaoMeiDTO apuracao = apurar(ano, mes);
        if (apuracao.getQuantidadePendencias() > 0) {
            throw new ApplicationException("Resolva as pendências fiscais antes de fechar a apuração");
        }
        Empresa empresa = empresaAtual.get();
        FechamentoApuracaoMei fechamento = fechamentos.findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mes)
                .orElseGet(() -> FechamentoApuracaoMei.builder().empresa(empresa).ano(ano).mes(mes).build());
        preencherFotografia(fechamento, receitasDoMes(empresa, ano, mes));
        fechamento.setSituacao(SituacaoApuracaoMeiEnum.FECHADA);
        fechamento.setDataFechamento(LocalDateTime.now());
        fechamento.setUsuarioFechamento(usuarioAtual());
        fechamento.setDataReabertura(null);
        fechamento.setUsuarioReabertura(null);
        fechamento.setMotivoReabertura(null);
        fechamentos.save(fechamento);
        return apurar(ano, mes);
    }

    @Transactional
    public ApuracaoMeiDTO reabrir(int ano, int mes, MotivoOperacaoDTO dto) {
        Empresa empresa = empresaAtual.get();
        FechamentoApuracaoMei fechamento = fechamentos.findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mes)
                .orElseThrow(() -> new ApplicationException("A apuração ainda não foi fechada"));
        if (fechamento.getSituacao() != SituacaoApuracaoMeiEnum.FECHADA) {
            throw new ApplicationException("A apuração já está aberta");
        }
        fechamento.setSituacao(SituacaoApuracaoMeiEnum.REABERTA);
        fechamento.setDataReabertura(LocalDateTime.now());
        fechamento.setUsuarioReabertura(usuarioAtual());
        fechamento.setMotivoReabertura(dto.getMotivo().trim());
        fechamentos.save(fechamento);
        return apurar(ano, mes);
    }

    public RelatorioMensalMeiDTO relatorio(int ano, int mes) {
        Empresa empresa = empresaAtual.get();
        Optional<FechamentoApuracaoMei> fechamento = fechamentos
                .findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mes)
                .filter(item -> item.getSituacao() == SituacaoApuracaoMeiEnum.FECHADA);
        FechamentoApuracaoMei valores = fechamento.orElseGet(() -> {
            FechamentoApuracaoMei preview = new FechamentoApuracaoMei();
            preencherFotografia(preview, receitasDoMes(empresa, ano, mes));
            return preview;
        });
        return RelatorioMensalMeiDTO.builder().cnpj(empresa.getCnpj()).razaoSocial(empresa.getRazaoSocial())
                .ano(ano).mes(mes).situacao(fechamento.map(FechamentoApuracaoMei::getSituacao).orElse(null))
                .comercioComDocumento(valores.getComercioComDocumento())
                .comercioSemDocumento(valores.getComercioSemDocumento())
                .industriaComDocumento(valores.getIndustriaComDocumento())
                .industriaSemDocumento(valores.getIndustriaSemDocumento())
                .servicosComDocumento(valores.getServicosComDocumento())
                .servicosSemDocumento(valores.getServicosSemDocumento()).total(valores.getTotal())
                .dataFechamento(valores.getDataFechamento()).usuarioFechamento(valores.getUsuarioFechamento()).build();
    }

    private ResumoMensalMeiDTO resumirMes(List<LancamentoFinanceiro> receitas, int mes) {
        BigDecimal comercio = total(receitas, mes, NaturezaReceitaEnum.COMERCIO);
        BigDecimal industria = total(receitas, mes, NaturezaReceitaEnum.INDUSTRIA);
        BigDecimal servicos = total(receitas, mes, NaturezaReceitaEnum.SERVICOS);
        BigDecimal comDocumento = totalDocumento(receitas, mes, true);
        BigDecimal semDocumento = totalDocumento(receitas, mes, false);
        return ResumoMensalMeiDTO.builder().mes(mes).comercio(comercio).industria(industria)
                .servicos(servicos).comDocumentoFiscal(comDocumento).semDocumentoFiscal(semDocumento)
                .total(comercio.add(industria).add(servicos)).build();
    }

    private BigDecimal totalDocumento(List<LancamentoFinanceiro> receitas, int mes, boolean emitido) {
        return receitas.stream().filter(item -> item.getDataCompetencia().getMonthValue() == mes)
                .filter(item -> Boolean.TRUE.equals(item.getDocumentoFiscalEmitido()) == emitido)
                .map(LancamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal total(List<LancamentoFinanceiro> receitas, int mes, NaturezaReceitaEnum natureza) {
        return receitas.stream().filter(item -> item.getDataCompetencia().getMonthValue() == mes)
                .filter(item -> item.getCategoria().getNaturezaReceita() == natureza)
                .map(LancamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private int mesesLimite(Empresa empresa, int ano) {
        if (empresa.getDataAbertura().getYear() > ano) return 0;
        return empresa.getDataAbertura().getYear() == ano
                ? 13 - empresa.getDataAbertura().getMonthValue() : 12;
    }

    private boolean incluido(LancamentoFinanceiro item) {
        return motivoNaoInclusao(item) == null;
    }

    private String motivoNaoInclusao(LancamentoFinanceiro item) {
        if (Boolean.TRUE.equals(item.getExcluido())) return "Lançamento excluído";
        if (item.getSituacao() == com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.CANCELADO)
            return "Lançamento cancelado";
        if (!Boolean.TRUE.equals(item.getAtivo())) return "Lançamento inativo";
        if (!Boolean.TRUE.equals(item.getCategoria().getCompoeFaturamentoMei()))
            return "Categoria não compõe o faturamento do MEI";
        if (item.getCategoria().getNaturezaReceita() == null) return "Categoria sem natureza da receita";
        return null;
    }

    private DetalheApuracaoMeiDTO detalhar(LancamentoFinanceiro item) {
        String motivo = motivoNaoInclusao(item);
        boolean pendenciaDocumento = motivo == null
                && Boolean.TRUE.equals(item.getCategoria().getExigeDocumentoFiscal())
                && !Boolean.TRUE.equals(item.getDocumentoFiscalEmitido());
        return DetalheApuracaoMeiDTO.builder().lancamentoId(item.getId()).descricao(item.getDescricao())
                .categoria(item.getCategoria().getNome()).natureza(item.getCategoria().getNaturezaReceita())
                .competencia(item.getDataCompetencia()).valor(item.getValor())
                .documentoFiscalEmitido(Boolean.TRUE.equals(item.getDocumentoFiscalEmitido()))
                .incluido(motivo == null).motivoNaoInclusao(motivo).pendenciaFiscal(pendenciaDocumento)
                .descricaoPendencia(pendenciaDocumento ? "A categoria exige documento fiscal, mas a emissão não foi informada" : null)
                .build();
    }

    private List<LancamentoFinanceiro> receitasDoMes(Empresa empresa, int ano, int mes) {
        return lancamentos.findReceitasParaApuracaoMei(empresa.getId(), YearMonth.of(ano, mes).atDay(1),
                YearMonth.of(ano, mes).atEndOfMonth()).stream().filter(this::incluido).toList();
    }

    private void preencherFotografia(FechamentoApuracaoMei fechamento, List<LancamentoFinanceiro> receitas) {
        fechamento.setComercioComDocumento(total(receitas, NaturezaReceitaEnum.COMERCIO, true));
        fechamento.setComercioSemDocumento(total(receitas, NaturezaReceitaEnum.COMERCIO, false));
        fechamento.setIndustriaComDocumento(total(receitas, NaturezaReceitaEnum.INDUSTRIA, true));
        fechamento.setIndustriaSemDocumento(total(receitas, NaturezaReceitaEnum.INDUSTRIA, false));
        fechamento.setServicosComDocumento(total(receitas, NaturezaReceitaEnum.SERVICOS, true));
        fechamento.setServicosSemDocumento(total(receitas, NaturezaReceitaEnum.SERVICOS, false));
        fechamento.setTotal(receitas.stream().map(LancamentoFinanceiro::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private BigDecimal total(List<LancamentoFinanceiro> receitas, NaturezaReceitaEnum natureza, boolean documento) {
        return receitas.stream().filter(item -> item.getCategoria().getNaturezaReceita() == natureza)
                .filter(item -> Boolean.TRUE.equals(item.getDocumentoFiscalEmitido()) == documento)
                .map(LancamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String usuarioAtual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
