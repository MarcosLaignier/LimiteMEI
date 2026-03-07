package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaCreateDTO;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaDTO;

public class CategoriaMapper {

    public static CategoriaDTO toDTO(Categoria categoria) {
        if (categoria == null) return null;

        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .tipo(categoria.getTipo())
                .build();
    }

    public static Categoria toEntity(CategoriaCreateDTO dto, Empresa empresa) {
        if (dto == null) return null;

        return Categoria.builder()
                .nome(dto.getNome())
                .tipo(dto.getTipo())
                .empresa(empresa)
                .build();
    }

}