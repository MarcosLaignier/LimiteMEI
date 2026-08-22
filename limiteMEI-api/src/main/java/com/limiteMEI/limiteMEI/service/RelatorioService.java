package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.dto.relatorio.RelatorioFluxoCaixaDTO;
import com.limiteMEI.limiteMEI.enums.TipoFluxoCaixaEnum;
import com.limiteMEI.limiteMEI.mapper.MovimentoFinanceiroMapper;
import com.limiteMEI.limiteMEI.repository.MovimentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class RelatorioService {
    private final EmpresaAtualService empresaAtual;
    private final ContaFinanceiraService contas;
    private final MovimentoFinanceiroRepository movimentos;
    private final MovimentoFinanceiroMapper movimentoMapper;

    public RelatorioService(EmpresaAtualService empresaAtual,
                            ContaFinanceiraService contas,
                            MovimentoFinanceiroRepository movimentos,
                            MovimentoFinanceiroMapper movimentoMapper) {
        this.empresaAtual = empresaAtual;
        this.contas = contas;
        this.movimentos = movimentos;
        this.movimentoMapper = movimentoMapper;
    }

    public RelatorioFluxoCaixaDTO fluxoCaixa(LocalDate inicio, LocalDate fim, Long contaFinanceiraId) {
        if (inicio == null || fim == null) {
            throw new ApplicationException("Informe o período do relatório");
        }
        if (fim.isBefore(inicio)) {
            throw new ApplicationException("A data final não pode ser anterior à data inicial");
        }
        Empresa empresa = empresaAtual.get();
        ContaFinanceira conta = contaFinanceiraId == null ? null : contas.findOwnedEntity(contaFinanceiraId);
        List<MovimentoFinanceiro> itens = movimentos.relatorioFluxoCaixa(empresa.getId(),
                Optional.ofNullable(conta).map(ContaFinanceira::getId).orElse(null), inicio, fim);
        BigDecimal entradas = total(itens, TipoFluxoCaixaEnum.ENTRADA);
        BigDecimal saidas = total(itens, TipoFluxoCaixaEnum.SAIDA);
        return RelatorioFluxoCaixaDTO.builder()
                .empresa(Optional.ofNullable(empresa.getNomeFantasia()).filter(nome -> !nome.isBlank()).orElse(empresa.getRazaoSocial()))
                .cnpj(empresa.getCnpj())
                .inicio(inicio)
                .fim(fim)
                .contaFinanceiraId(conta == null ? null : conta.getId())
                .contaFinanceiraNome(conta == null ? "Todas as contas" : conta.getNome())
                .totalEntradas(entradas)
                .totalSaidas(saidas)
                .saldoPeriodo(entradas.subtract(saidas))
                .movimentos(itens.stream().map(movimentoMapper::toDTO).toList())
                .build();
    }

    private BigDecimal total(List<MovimentoFinanceiro> itens, TipoFluxoCaixaEnum tipo) {
        return itens.stream()
                .filter(item -> item.getTipo() == tipo)
                .map(MovimentoFinanceiro::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
