package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.baixa.*;
import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import com.limiteMEI.limiteMEI.repository.BaixaFinanceiraRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import com.limiteMEI.limiteMEI.dto.lancamento.MotivoOperacaoDTO;
import com.limiteMEI.limiteMEI.enums.EventoFinanceiroEnum;

@Service
@Transactional
public class BaixaFinanceiraService {
    private final BaixaFinanceiraRepository repository;
    private final LancamentoFinanceiroService lancamentos;
    private final EmpresaAtualService empresaAtual;
    private final ContaFinanceiraService contas;
    private final MovimentoFinanceiroService movimentos;
    private final HistoricoFinanceiroService historico;
    private final ComposicaoBaixaCalculator calculadora;

    public BaixaFinanceiraService(BaixaFinanceiraRepository repository, LancamentoFinanceiroService lancamentos,
                                  EmpresaAtualService empresaAtual, ContaFinanceiraService contas,
                                  MovimentoFinanceiroService movimentos, HistoricoFinanceiroService historico,
                                  ComposicaoBaixaCalculator calculadora) {
        this.repository = repository;
        this.lancamentos = lancamentos;
        this.empresaAtual = empresaAtual;
        this.contas = contas;
        this.movimentos = movimentos;
        this.historico = historico;
        this.calculadora = calculadora;
    }

    public List<BaixaFinanceiraDTO> findAll(Long lancamentoId) {
        lancamentos.findOwned(lancamentoId);
        return repository.findByLancamentoIdOrderByDataLiquidacaoDesc(lancamentoId).stream().map(this::toDTO).toList();
    }

    public BaixaFinanceiraDTO create(Long lancamentoId, BaixaFinanceiraCreateDTO dto) {
        LancamentoFinanceiro lancamento = lancamentos.findOwnedForUpdate(lancamentoId);
        if (!Boolean.TRUE.equals(lancamento.getAtivo())) {
            throw new ApplicationException("Um lançamento inativo não aceita novas baixas");
        }
        if (lancamento.getSituacao() == SituacaoLancamentoEnum.CANCELADO || lancamento.getSituacao() == SituacaoLancamentoEnum.LIQUIDADO)
            throw new ApplicationException("Este lançamento não aceita novas baixas");
        ComposicaoBaixaCalculator.Resultado composicao = calculadora.calcular(dto.getValorPrincipal(),
                dto.getJuros(), dto.getMulta(), dto.getDesconto());
        BigDecimal saldo = lancamento.getValor().subtract(lancamentos.total(lancamentoId));
        if (composicao.valorPrincipal().compareTo(saldo) > 0) {
            throw new ApplicationException("O valor principal da baixa não pode ser maior que o saldo em aberto");
        }
        ContaFinanceira conta = contas.findOwnedEntity(dto.getContaFinanceiraId());
        if (!Boolean.TRUE.equals(conta.getAtivo())) throw new ApplicationException("A conta financeira selecionada está inativa");
        BaixaFinanceira baixa = repository.save(BaixaFinanceira.builder()
                .lancamento(lancamento)
                .contaFinanceira(conta)
                .valorPrincipal(composicao.valorPrincipal())
                .juros(composicao.juros())
                .multa(composicao.multa())
                .desconto(composicao.desconto())
                .valorPago(composicao.valorPago())
                .dataLiquidacao(dto.getDataLiquidacao())
                .formaPagamento(dto.getFormaPagamento())
                .observacao(dto.getObservacao())
                .build());
        movimentos.gerarPorBaixa(baixa);
        historico.registrar(lancamento, baixa, EventoFinanceiroEnum.BAIXA_REALIZADA,
                descricaoComposicao(baixa));
        lancamentos.atualizarSituacao(lancamento, lancamentos.total(lancamentoId));
        return toDTO(baixa);
    }

    public void estornar(Long lancamentoId, Long baixaId, MotivoOperacaoDTO dto) {
        LancamentoFinanceiro lancamento = lancamentos.findOwnedForUpdate(lancamentoId);
        BaixaFinanceira baixa = repository.findByIdAndLancamentoEmpresaId(baixaId, empresaAtual.get().getId())
                .filter(item -> item.getLancamento().getId().equals(lancamentoId))
                .orElseThrow(() -> new ApplicationException("Baixa financeira não encontrada"));
        if (!Boolean.TRUE.equals(baixa.getAtivo())) {
            throw new ApplicationException("Esta baixa já foi estornada");
        }
        baixa.setAtivo(false);
        baixa.setDataEstorno(LocalDateTime.now());
        baixa.setMotivoEstorno(dto.getMotivo().trim());
        baixa.setUsuarioEstorno(SecurityContextHolder.getContext().getAuthentication().getName());
        repository.save(baixa);
        movimentos.estornarPorBaixa(baixa.getId(), baixa.getMotivoEstorno());
        historico.registrar(lancamento, baixa, EventoFinanceiroEnum.BAIXA_ESTORNADA,
                "Baixa estornada: " + baixa.getMotivoEstorno());
        lancamentos.atualizarSituacao(lancamento, lancamentos.total(lancamentoId));
    }

    private BaixaFinanceiraDTO toDTO(BaixaFinanceira entity) {
        return BaixaFinanceiraDTO.builder().id(entity.getId()).lancamentoId(entity.getLancamento().getId())
                .contaFinanceiraId(entity.getContaFinanceira() == null ? null : entity.getContaFinanceira().getId())
                .contaFinanceiraNome(entity.getContaFinanceira() == null ? null : entity.getContaFinanceira().getNome())
                .valorPrincipal(entity.getValorPrincipal()).juros(entity.getJuros()).multa(entity.getMulta())
                .desconto(entity.getDesconto()).valorPago(entity.getValorPago())
                .dataLiquidacao(entity.getDataLiquidacao())
                .formaPagamento(entity.getFormaPagamento()).observacao(entity.getObservacao())
                .ativo(entity.getAtivo()).dataEstorno(entity.getDataEstorno())
                .motivoEstorno(entity.getMotivoEstorno()).usuarioEstorno(entity.getUsuarioEstorno()).build();
    }

    private String descricaoComposicao(BaixaFinanceira baixa) {
        return "Baixa realizada: principal " + baixa.getValorPrincipal()
                + ", juros " + baixa.getJuros()
                + ", multa " + baixa.getMulta()
                + ", desconto " + baixa.getDesconto()
                + ", pago " + baixa.getValorPago();
    }
}
