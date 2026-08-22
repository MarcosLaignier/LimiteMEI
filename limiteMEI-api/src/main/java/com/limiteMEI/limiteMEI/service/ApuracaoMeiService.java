package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.mei.*;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteDTO;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import com.limiteMEI.limiteMEI.repository.LancamentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.repository.FechamentoApuracaoMeiRepository;
import com.limiteMEI.limiteMEI.repository.DocumentoFiscalRepository;
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
    private final DocumentoFiscalRepository documentosFiscais;
    private final ConfiguracaoAlertaLimiteService alertasLimite;

    public ApuracaoMeiService(LancamentoFinanceiroRepository lancamentos, EmpresaAtualService empresaAtual,
                              FechamentoApuracaoMeiRepository fechamentos,
                              DocumentoFiscalRepository documentosFiscais,
                              ConfiguracaoAlertaLimiteService alertasLimite) {
        this.lancamentos = lancamentos;
        this.empresaAtual = empresaAtual;
        this.fechamentos = fechamentos;
        this.documentosFiscais = documentosFiscais;
        this.alertasLimite = alertasLimite;
    }

    public ApuracaoMeiDTO apurar(int ano, int mesReferencia) {
        if (ano < 2000 || mesReferencia < 1 || mesReferencia > 12) {
            throw new ApplicationException("Período de apuração inválido");
        }
        Empresa empresa = empresaAtual.get();
        List<LancamentoFinanceiro> todos = lancamentos.findReceitasParaApuracaoMei(
                empresa.getId(), LocalDate.of(ano, 1, 1), YearMonth.of(ano, mesReferencia).atEndOfMonth());
        List<LancamentoFinanceiro> receitas = todos.stream().filter(item -> incluido(item, empresa)).toList();
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
        ConfiguracaoAlertaLimiteDTO alertaLimite = alertasLimite.alertaAtual(percentual);
        LocalDate inicioSimei = inicioSimei(empresa);
        int primeiroMes = inicioSimei.getYear() == ano ? inicioSimei.getMonthValue() : 1;
        int mesesDecorridos = Math.max(0, mesReferencia - primeiroMes + 1);
        BigDecimal projecao = mesesDecorridos == 0 ? BigDecimal.ZERO
                : acumulado.divide(BigDecimal.valueOf(mesesDecorridos), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(mesesLimite));
        int mesesRestantes = Math.max(1, 12 - mesReferencia);
        BigDecimal saldoDisponivel = limite.subtract(acumulado);
        BigDecimal mediaMensalDisponivel = saldoDisponivel.signum() <= 0 ? BigDecimal.ZERO
                : saldoDisponivel.divide(BigDecimal.valueOf(mesesRestantes), 2, RoundingMode.HALF_UP);
        List<DetalheApuracaoMeiDTO> detalhes = todos.stream()
                .filter(item -> item.getDataCompetencia().getMonthValue() == mesReferencia)
                .map(item -> detalhar(item, empresa)).toList();
        Optional<FechamentoApuracaoMei> fechamento = fechamentos
                .findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mesReferencia);
        List<Integer> anterioresAbertas = competenciasAnterioresAbertas(empresa, ano, mesReferencia);
        List<LancamentoFinanceiro> lancamentosMes = lancamentos.findByEmpresaIdAndDataCompetenciaAndExcluidoFalse(
                empresa.getId(), YearMonth.of(ano, mesReferencia).atDay(1));
        int abertos = (int) lancamentosMes.stream().filter(this::lancamentoAberto).count();
        int vencidos = (int) lancamentosMes.stream().filter(this::lancamentoAberto)
                .filter(item -> item.getDataVencimento() != null && item.getDataVencimento().isBefore(LocalDate.now())).count();
        ConferenciaFiscalMeiDTO conferenciaFiscal = conferenciaFiscal(empresa, ano, mesReferencia,
                referencia.getTotal(), detalhes);
        return ApuracaoMeiDTO.builder().ano(ano).mesReferencia(mesReferencia)
                .comercioMes(referencia.getComercio()).industriaMes(referencia.getIndustria())
                .servicosMes(referencia.getServicos()).totalMes(referencia.getTotal())
                .comDocumentoFiscalMes(referencia.getComDocumentoFiscal())
                .semDocumentoFiscalMes(referencia.getSemDocumentoFiscal())
                .acumuladoAno(acumulado).limiteAplicavel(limite)
                .saldoDisponivel(saldoDisponivel).percentualUtilizado(percentual)
                .projecaoAnual(projecao).mediaMensalDisponivel(mediaMensalDisponivel)
                .faixaAlerta(alertasLimite.faixaAlerta(percentual, alertaLimite))
                .alertaLimite(alertaLimite).mesesLimite(mesesLimite)
                .quantidadePendencias((int) detalhes.stream().filter(DetalheApuracaoMeiDTO::getPendenciaFiscal).count())
                .quantidadeLancamentosAbertos(abertos).quantidadeLancamentosVencidos(vencidos)
                .competenciasAnterioresAbertas(anterioresAbertas)
                .meses(meses).detalhes(detalhes)
                .conferenciaFiscal(conferenciaFiscal)
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
        if (!apuracao.getCompetenciasAnterioresAbertas().isEmpty()) {
            throw new ApplicationException("Feche primeiro as competências anteriores: "
                    + apuracao.getCompetenciasAnterioresAbertas().stream()
                    .map(item -> String.format("%02d/%d", item, ano)).reduce((a, b) -> a + ", " + b).orElse(""));
        }
        Empresa empresa = empresaAtual.get();
        FechamentoApuracaoMei fechamento = fechamentos.findByEmpresaIdAndAnoAndMes(empresa.getId(), ano, mes)
                .orElseGet(() -> FechamentoApuracaoMei.builder().empresa(empresa).ano(ano).mes(mes).build());
        preencherFotografia(fechamento, receitasDoMes(empresa, ano, mes));
        fechamento.setAcumuladoAno(apuracao.getAcumuladoAno());
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
        ApuracaoMeiDTO apuracaoAtual = apurar(ano, mes);
        BigDecimal acumulado = fechamento.map(FechamentoApuracaoMei::getAcumuladoAno)
                .orElse(apuracaoAtual.getAcumuladoAno());
        return RelatorioMensalMeiDTO.builder().cnpj(empresa.getCnpj()).razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia()).dataAbertura(empresa.getDataAbertura())
                .dataInicioSimei(inicioSimei(empresa))
                .ano(ano).mes(mes).situacao(fechamento.map(FechamentoApuracaoMei::getSituacao).orElse(null))
                .comercioComDocumento(valores.getComercioComDocumento())
                .comercioSemDocumento(valores.getComercioSemDocumento())
                .industriaComDocumento(valores.getIndustriaComDocumento())
                .industriaSemDocumento(valores.getIndustriaSemDocumento())
                .servicosComDocumento(valores.getServicosComDocumento())
                .servicosSemDocumento(valores.getServicosSemDocumento()).total(valores.getTotal())
                .acumuladoAno(acumulado)
                .dataFechamento(valores.getDataFechamento()).usuarioFechamento(valores.getUsuarioFechamento())
                .conferenciaFiscal(apuracaoAtual.getConferenciaFiscal()).build();
    }

    public HistoricoApuracaoMeiDTO historico(int ano) {
        if (ano < 2000) throw new ApplicationException("Ano de apuração inválido");
        Empresa empresa = empresaAtual.get();
        List<LancamentoFinanceiro> receitas = lancamentos.findReceitasParaApuracaoMei(
                empresa.getId(), LocalDate.of(ano, 1, 1), LocalDate.of(ano, 12, 31)).stream()
                .filter(item -> incluido(item, empresa)).toList();
        Map<Integer, FechamentoApuracaoMei> porMes = new HashMap<>();
        fechamentos.findByEmpresaIdAndAnoOrderByMes(empresa.getId(), ano)
                .forEach(item -> porMes.put(item.getMes(), item));
        BigDecimal limite = empresa.getLimiteAnual().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(mesesLimite(empresa, ano)));
        BigDecimal acumulado = BigDecimal.ZERO;
        List<HistoricoApuracaoMeiItemDTO> itens = new ArrayList<>();
        for (int mes = 1; mes <= 12; mes++) {
            ResumoMensalMeiDTO atual = resumirMes(receitas, mes);
            FechamentoApuracaoMei fechamento = porMes.get(mes);
            BigDecimal totalMes = fechamento != null && fechamento.getSituacao() == SituacaoApuracaoMeiEnum.FECHADA
                    ? fechamento.getTotal() : atual.getTotal();
            acumulado = acumulado.add(totalMes);
            BigDecimal percentual = limite.signum() == 0 ? BigDecimal.ZERO
                    : acumulado.multiply(CEM).divide(limite, 2, RoundingMode.HALF_UP);
            itens.add(HistoricoApuracaoMeiItemDTO.builder().mes(mes).totalMes(totalMes)
                    .acumuladoAno(acumulado).percentualUtilizado(percentual)
                    .situacao(fechamento == null ? null : fechamento.getSituacao())
                    .dataFechamento(fechamento == null ? null : fechamento.getDataFechamento())
                    .usuarioFechamento(fechamento == null ? null : fechamento.getUsuarioFechamento()).build());
        }
        BigDecimal percentual = limite.signum() == 0 ? BigDecimal.ZERO
                : acumulado.multiply(CEM).divide(limite, 2, RoundingMode.HALF_UP);
        ConfiguracaoAlertaLimiteDTO alertaLimite = alertasLimite.alertaAtual(percentual);
        return HistoricoApuracaoMeiDTO.builder().ano(ano).limiteAplicavel(limite).totalAno(acumulado)
                .percentualUtilizado(percentual).alertaLimite(alertaLimite).meses(itens).build();
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
        LocalDate inicioSimei = inicioSimei(empresa);
        if (inicioSimei.getYear() > ano) return 0;
        return inicioSimei.getYear() == ano ? 13 - inicioSimei.getMonthValue() : 12;
    }

    private List<Integer> competenciasAnterioresAbertas(Empresa empresa, int ano, int mesReferencia) {
        LocalDate inicioSimei = inicioSimei(empresa);
        if (inicioSimei.getYear() > ano) return List.of();
        int primeiroMes = inicioSimei.getYear() == ano ? inicioSimei.getMonthValue() : 1;
        Map<Integer, SituacaoApuracaoMeiEnum> situacoes = new HashMap<>();
        fechamentos.findByEmpresaIdAndAnoOrderByMes(empresa.getId(), ano)
                .forEach(item -> situacoes.put(item.getMes(), item.getSituacao()));
        List<Integer> abertas = new ArrayList<>();
        for (int mes = primeiroMes; mes < mesReferencia; mes++) {
            if (situacoes.get(mes) != SituacaoApuracaoMeiEnum.FECHADA) abertas.add(mes);
        }
        return abertas;
    }

    private boolean lancamentoAberto(LancamentoFinanceiro item) {
        return item.getSituacao() == SituacaoLancamentoEnum.ABERTO
                || item.getSituacao() == SituacaoLancamentoEnum.PARCIAL;
    }

    private boolean incluido(LancamentoFinanceiro item, Empresa empresa) {
        return motivoNaoInclusao(item, empresa) == null;
    }

    private String motivoNaoInclusao(LancamentoFinanceiro item, Empresa empresa) {
        if (Boolean.TRUE.equals(item.getExcluido())) return "Lançamento excluído";
        if (item.getSituacao() == com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.CANCELADO)
            return "Lançamento cancelado";
        if (!Boolean.TRUE.equals(item.getAtivo())) return "Lançamento inativo";
        if (!Boolean.TRUE.equals(item.getCategoria().getCompoeFaturamentoMei()))
            return "Categoria não compõe o faturamento do MEI";
        if (item.getCategoria().getNaturezaReceita() == null) return "Categoria sem natureza da receita";
        if (item.getDataCompetencia().isBefore(inicioSimei(empresa)))
            return "Competência anterior ao início no SIMEI";
        return null;
    }

    private DetalheApuracaoMeiDTO detalhar(LancamentoFinanceiro item, Empresa empresa) {
        String motivo = motivoNaoInclusao(item, empresa);
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
                YearMonth.of(ano, mes).atEndOfMonth()).stream().filter(item -> incluido(item, empresa)).toList();
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

    private ConferenciaFiscalMeiDTO conferenciaFiscal(Empresa empresa, int ano, int mes, BigDecimal faturamento,
                                                       List<DetalheApuracaoMeiDTO> detalhes) {
        YearMonth periodo = YearMonth.of(ano, mes);
        List<DocumentoFiscalApuracaoDTO> itens = documentosFiscais
                .findByEmpresaIdAndDataEmissaoBetweenAndExcluidoFalseOrderByDataEmissaoAscIdAsc(
                        empresa.getId(), periodo.atDay(1), periodo.atEndOfMonth())
                .stream().map(documento -> {
                    BigDecimal vinculado = documento.getVinculos().stream()
                            .map(DocumentoFiscalLancamento::getValorVinculado)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return DocumentoFiscalApuracaoDTO.builder().id(documento.getId()).tipo(documento.getTipo())
                            .numero(documento.getNumero()).dataEmissao(documento.getDataEmissao())
                            .cliente(documento.getCliente() == null ? null : documento.getCliente().getNomeRazaoSocial())
                            .situacao(documento.getSituacao()).valorTotal(documento.getValorTotal())
                            .valorVinculado(vinculado).diferenca(documento.getValorTotal().subtract(vinculado)).build();
                }).toList();
        List<DocumentoFiscalApuracaoDTO> emitidos = itens.stream()
                .filter(item -> item.getSituacao() == com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum.EMITIDO)
                .toList();
        List<DocumentoFiscalApuracaoDTO> cancelados = itens.stream()
                .filter(item -> item.getSituacao() == com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum.CANCELADO)
                .toList();
        BigDecimal valorDocumentado = detalhes.stream().filter(DetalheApuracaoMeiDTO::getIncluido)
                .filter(DetalheApuracaoMeiDTO::getDocumentoFiscalEmitido).map(DetalheApuracaoMeiDTO::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal percentual = faturamento == null || faturamento.signum() == 0 ? BigDecimal.ZERO
                : valorDocumentado.multiply(CEM).divide(faturamento, 2, RoundingMode.HALF_UP);
        return ConferenciaFiscalMeiDTO.builder().quantidadeEmitidos(emitidos.size())
                .valorEmitidos(somarDocumentos(emitidos)).quantidadeCancelados(cancelados.size())
                .valorCancelados(somarDocumentos(cancelados)).percentualDocumentado(percentual)
                .quantidadePendencias((int) detalhes.stream().filter(DetalheApuracaoMeiDTO::getPendenciaFiscal).count())
                .quantidadeDivergencias((int) emitidos.stream().filter(item -> item.getDiferenca().signum() != 0).count())
                .documentos(itens).build();
    }

    private BigDecimal somarDocumentos(List<DocumentoFiscalApuracaoDTO> documentos) {
        return documentos.stream().map(DocumentoFiscalApuracaoDTO::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal total(List<LancamentoFinanceiro> receitas, NaturezaReceitaEnum natureza, boolean documento) {
        return receitas.stream().filter(item -> item.getCategoria().getNaturezaReceita() == natureza)
                .filter(item -> Boolean.TRUE.equals(item.getDocumentoFiscalEmitido()) == documento)
                .map(LancamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String usuarioAtual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private LocalDate inicioSimei(Empresa empresa) {
        return empresa.getDataInicioSimei() == null ? empresa.getDataAbertura() : empresa.getDataInicioSimei();
    }
}
