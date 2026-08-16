package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.mei.*;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.repository.LancamentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.*;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ApuracaoMeiService {
    private static final BigDecimal CEM = new BigDecimal("100");
    private final LancamentoFinanceiroRepository lancamentos;
    private final EmpresaAtualService empresaAtual;

    public ApuracaoMeiService(LancamentoFinanceiroRepository lancamentos, EmpresaAtualService empresaAtual) {
        this.lancamentos = lancamentos;
        this.empresaAtual = empresaAtual;
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
        return ApuracaoMeiDTO.builder().ano(ano).mesReferencia(mesReferencia)
                .comercioMes(referencia.getComercio()).industriaMes(referencia.getIndustria())
                .servicosMes(referencia.getServicos()).totalMes(referencia.getTotal())
                .comDocumentoFiscalMes(referencia.getComDocumentoFiscal())
                .semDocumentoFiscalMes(referencia.getSemDocumentoFiscal())
                .acumuladoAno(acumulado).limiteAplicavel(limite)
                .saldoDisponivel(limite.subtract(acumulado)).percentualUtilizado(percentual)
                .projecaoAnual(projecao).mesesLimite(mesesLimite)
                .quantidadePendencias((int) detalhes.stream().filter(DetalheApuracaoMeiDTO::getPendenciaFiscal).count())
                .meses(meses).detalhes(detalhes).build();
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
}
