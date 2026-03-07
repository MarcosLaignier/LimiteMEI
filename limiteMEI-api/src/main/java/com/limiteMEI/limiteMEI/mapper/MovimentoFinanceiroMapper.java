package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroCreateDTO;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;

public class MovimentoFinanceiroMapper {

    public static MovimentoFinanceiroDTO toDTO(MovimentoFinanceiro movimento) {
        if (movimento == null) return null;

        return MovimentoFinanceiroDTO.builder()
                .id(movimento.getId())
                .descricao(movimento.getDescricao())
                .valor(movimento.getValor())
                .data(movimento.getData())
                .tipo(movimento.getTipo())
                .categoriaId(
                        movimento.getCategoria() != null ?
                                movimento.getCategoria().getId() : null
                )
                .build();
    }

    public static MovimentoFinanceiro toEntity(MovimentoFinanceiroCreateDTO dto, Empresa empresa, Categoria categoria) {

        if (dto == null) return null;

        return MovimentoFinanceiro.builder()
                .descricao(dto.getDescricao())
                .valor(dto.getValor())
                .data(dto.getData())
                .tipo(dto.getTipo())
                .empresa(empresa)
                .categoria(categoria)
                .build();
    }

}