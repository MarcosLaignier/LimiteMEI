package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.dashboard.*;
import com.limiteMEI.limiteMEI.enums.*;
import com.limiteMEI.limiteMEI.mapper.MovimentoFinanceiroMapper;
import com.limiteMEI.limiteMEI.repository.*;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final EmpresaAtualService empresaAtual;
    private final ContaFinanceiraRepository contas;
    private final MovimentoFinanceiroRepository movimentos;
    private final LancamentoFinanceiroRepository lancamentos;
    private final MovimentoFinanceiroMapper movimentoMapper;
    private final ApuracaoMeiService apuracaoMei;

    public DashboardService(EmpresaAtualService empresaAtual, ContaFinanceiraRepository contas,
                            MovimentoFinanceiroRepository movimentos, LancamentoFinanceiroRepository lancamentos,
                            MovimentoFinanceiroMapper movimentoMapper, ApuracaoMeiService apuracaoMei) {
        this.empresaAtual = empresaAtual;
        this.contas = contas;
        this.movimentos = movimentos;
        this.lancamentos = lancamentos;
        this.movimentoMapper = movimentoMapper;
        this.apuracaoMei = apuracaoMei;
    }

    public DashboardDTO carregar(int ano, int mes) {
        if (ano < 2000 || mes < 1 || mes > 12) throw new ApplicationException("Período inválido");
        Empresa empresa = empresaAtual.get();
        LocalDate inicio = YearMonth.of(ano, mes).atDay(1);
        LocalDate fim = YearMonth.of(ano, mes).atEndOfMonth();
        List<DashboardContaDTO> saldos = contas.findByEmpresaIdOrderByNome(empresa.getId()).stream()
                .filter(item -> Boolean.TRUE.equals(item.getAtivo())).map(item -> DashboardContaDTO.builder()
                        .id(item.getId()).nome(item.getNome()).saldo(item.getSaldoInicial().add(
                                movimentos.saldoMovimentado(item.getId(), empresa.getId(), TipoFluxoCaixaEnum.ENTRADA)))
                        .build()).toList();
        BigDecimal saldoTotal = saldos.stream().map(DashboardContaDTO::getSaldo)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return DashboardDTO.builder().empresa(Optional.ofNullable(empresa.getNomeFantasia())
                        .filter(nome -> !nome.isBlank()).orElse(empresa.getRazaoSocial()))
                .ano(ano).mes(mes).saldoTotal(saldoTotal)
                .entradasMes(movimentos.totalPeriodo(empresa.getId(), TipoFluxoCaixaEnum.ENTRADA, inicio, fim))
                .saidasMes(movimentos.totalPeriodo(empresa.getId(), TipoFluxoCaixaEnum.SAIDA, inicio, fim))
                .contasReceber(saldoPendente(empresa.getId(), TipoLancamentoEnum.RECEBER, false))
                .contasPagar(saldoPendente(empresa.getId(), TipoLancamentoEnum.PAGAR, false))
                .vencidoReceber(saldoPendente(empresa.getId(), TipoLancamentoEnum.RECEBER, true))
                .vencidoPagar(saldoPendente(empresa.getId(), TipoLancamentoEnum.PAGAR, true))
                .quantidadeVencidos(Math.toIntExact(lancamentos.quantidadeVencidos(empresa.getId(), LocalDate.now())))
                .contas(saldos).ultimasMovimentacoes(movimentos.findTop8ByEmpresaIdOrderByDataDescIdDesc(empresa.getId())
                        .stream().map(movimentoMapper::toDTO).toList())
                .mei(apuracaoMei.apurar(ano, mes)).build();
    }

    private BigDecimal saldoPendente(Long empresaId, TipoLancamentoEnum tipo, boolean vencido) {
        if (vencido) return lancamentos.totalVencidoBruto(empresaId, tipo, LocalDate.now())
                .subtract(lancamentos.totalBaixadoVencido(empresaId, tipo, LocalDate.now()));
        return lancamentos.totalPendenteBruto(empresaId, tipo)
                .subtract(lancamentos.totalBaixadoPendente(empresaId, tipo));
    }
}
