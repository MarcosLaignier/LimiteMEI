package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.baixa.*;
import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import com.limiteMEI.limiteMEI.repository.BaixaFinanceiraRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class BaixaFinanceiraService {
    private final BaixaFinanceiraRepository repository;
    private final LancamentoFinanceiroService lancamentos;
    private final EmpresaAtualService empresaAtual;
    private final ContaFinanceiraService contas;

    public BaixaFinanceiraService(BaixaFinanceiraRepository repository, LancamentoFinanceiroService lancamentos,
                                  EmpresaAtualService empresaAtual, ContaFinanceiraService contas) {
        this.repository = repository;
        this.lancamentos = lancamentos;
        this.empresaAtual = empresaAtual;
        this.contas = contas;
    }

    public List<BaixaFinanceiraDTO> findAll(Long lancamentoId) {
        lancamentos.findOwned(lancamentoId);
        return repository.findByLancamentoIdOrderByDataLiquidacaoDesc(lancamentoId).stream().map(this::toDTO).toList();
    }

    public BaixaFinanceiraDTO create(Long lancamentoId, BaixaFinanceiraCreateDTO dto) {
        LancamentoFinanceiro lancamento = lancamentos.findOwned(lancamentoId);
        if (lancamento.getSituacao() == SituacaoLancamentoEnum.CANCELADO || lancamento.getSituacao() == SituacaoLancamentoEnum.LIQUIDADO)
            throw new ApplicationException("Este lançamento não aceita novas baixas");
        BigDecimal saldo = lancamento.getValor().subtract(lancamentos.total(lancamentoId));
        if (dto.getValor().compareTo(saldo) > 0) throw new ApplicationException("A baixa não pode ser maior que o saldo em aberto");
        ContaFinanceira conta = contas.findOwnedEntity(dto.getContaFinanceiraId());
        if (!Boolean.TRUE.equals(conta.getAtivo())) throw new ApplicationException("A conta financeira selecionada está inativa");
        BaixaFinanceira baixa = repository.save(BaixaFinanceira.builder().lancamento(lancamento).contaFinanceira(conta).valor(dto.getValor())
                .dataLiquidacao(dto.getDataLiquidacao()).formaPagamento(dto.getFormaPagamento())
                .observacao(dto.getObservacao()).build());
        lancamentos.atualizarSituacao(lancamento, lancamentos.total(lancamentoId));
        return toDTO(baixa);
    }

    public void delete(Long lancamentoId, Long baixaId) {
        LancamentoFinanceiro lancamento = lancamentos.findOwned(lancamentoId);
        BaixaFinanceira baixa = repository.findByIdAndLancamentoEmpresaId(baixaId, empresaAtual.get().getId())
                .filter(item -> item.getLancamento().getId().equals(lancamentoId))
                .orElseThrow(() -> new ApplicationException("Baixa financeira não encontrada"));
        repository.delete(baixa);
        repository.flush();
        lancamentos.atualizarSituacao(lancamento, lancamentos.total(lancamentoId));
    }

    private BaixaFinanceiraDTO toDTO(BaixaFinanceira entity) {
        return BaixaFinanceiraDTO.builder().id(entity.getId()).lancamentoId(entity.getLancamento().getId())
                .contaFinanceiraId(entity.getContaFinanceira() == null ? null : entity.getContaFinanceira().getId())
                .contaFinanceiraNome(entity.getContaFinanceira() == null ? null : entity.getContaFinanceira().getNome())
                .valor(entity.getValor()).dataLiquidacao(entity.getDataLiquidacao())
                .formaPagamento(entity.getFormaPagamento()).observacao(entity.getObservacao()).build();
    }
}
