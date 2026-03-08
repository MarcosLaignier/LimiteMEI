package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaCreateDTO;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaDTO;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper implements BaseMapper<Categoria, CategoriaDTO, CategoriaCreateDTO> {

    @Override
    public CategoriaDTO toDTO(Categoria categoria) {
        if (categoria == null) return null;

        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .tipo(categoria.getTipo())
                .build();
    }

    @Override
    public Categoria toEntity(CategoriaCreateDTO createDTO) {
        if (createDTO == null) return null;

        return Categoria.builder()
                .nome(createDTO.getNome())
                .tipo(createDTO.getTipo())
                .build();
    }
}