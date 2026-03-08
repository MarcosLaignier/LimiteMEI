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
                .empresaId(mov.getEmpresa() != null ? mov.getEmpresa().getId() : null)
                .categoriaId(mov.getCategoria() != null ? mov.getCategoria().getId() : null)
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
        // empresa e categoria devem ser resolvidos no service via ID
        return mov;
    }
}