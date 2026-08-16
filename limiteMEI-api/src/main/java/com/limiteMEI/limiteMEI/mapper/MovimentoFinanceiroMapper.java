package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroCreateDTO;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;

@Component
public class MovimentoFinanceiroMapper implements BaseMapper<MovimentoFinanceiro, MovimentoFinanceiroDTO, MovimentoFinanceiroCreateDTO> {

    @Override
    public MovimentoFinanceiroDTO toDTO(MovimentoFinanceiro mov) {
        if (mov == null) return null;
        return MovimentoFinanceiroDTO.builder()
                .id(mov.getId())
                .descricao(mov.getDescricao())
                .valor(mov.getValor())
                .data(mov.getData())
                .tipo(mov.getTipo())
                .origem(mov.getOrigem())
                .formaPagamento(mov.getFormaPagamento())
                .contaFinanceiraId(mov.getContaFinanceira().getId())
                .contaFinanceiraNome(mov.getContaFinanceira().getNome())
                .categoriaId(mov.getCategoria() != null ? mov.getCategoria().getId() : null)
                .categoriaNome(mov.getCategoria() != null ? mov.getCategoria().getNome() : null)
                .baixaFinanceiraId(mov.getBaixaFinanceira() != null ? mov.getBaixaFinanceira().getId() : null)
                .transferenciaId(mov.getTransferenciaId())
                .observacao(mov.getObservacao())
                .editavel(mov.getOrigem() != com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum.BAIXA
                        && mov.getOrigem() != com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum.TRANSFERENCIA
                        && mov.getOrigem() != com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum.ESTORNO
                        && !Boolean.TRUE.equals(mov.getEstornado()))
                .estornado(mov.getEstornado())
                .movimentoOrigemId(mov.getMovimentoOrigem() == null ? null : mov.getMovimentoOrigem().getId())
                .build();
    }

    @Override
    public MovimentoFinanceiro toEntity(MovimentoFinanceiroCreateDTO dto) {
        if (dto == null) return null;
        MovimentoFinanceiro mov = new MovimentoFinanceiro();
        mov.setDescricao(dto.getDescricao());
        mov.setValor(dto.getValor());
        mov.setData(dto.getData());
        mov.setTipo(dto.getTipo());
        mov.setOrigem(dto.getOrigem());
        mov.setFormaPagamento(dto.getFormaPagamento());
        mov.setObservacao(dto.getObservacao());
        return mov;
    }

    @Override
    public void updateEntity(MovimentoFinanceiro mov, MovimentoFinanceiroCreateDTO dto) {
        mov.setDescricao(dto.getDescricao());
        mov.setValor(dto.getValor());
        mov.setData(dto.getData());
        mov.setTipo(dto.getTipo());
        mov.setOrigem(dto.getOrigem());
        mov.setFormaPagamento(dto.getFormaPagamento());
        mov.setObservacao(dto.getObservacao());
    }
}
