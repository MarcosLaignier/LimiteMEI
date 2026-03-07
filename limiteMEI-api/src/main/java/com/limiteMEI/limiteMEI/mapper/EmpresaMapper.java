package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaCreateDTO;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaDTO;

public class EmpresaMapper {

    public static EmpresaDTO toDTO(Empresa empresa) {
        if (empresa == null) return null;

        return EmpresaDTO.builder()
                .id(empresa.getId())
                .cnpj(empresa.getCnpj())
                .razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia())
                .dataAbertura(empresa.getDataAbertura())
                .limiteAnual(empresa.getLimiteAnual())
                .build();
    }

    public static Empresa toEntity(EmpresaCreateDTO dto, Usuario usuario) {
        if (dto == null) return null;

        return Empresa.builder()
                .cnpj(dto.getCnpj())
                .razaoSocial(dto.getRazaoSocial())
                .nomeFantasia(dto.getNomeFantasia())
                .dataAbertura(dto.getDataAbertura())
                .limiteAnual(dto.getLimiteAnual())
                .usuario(usuario)
                .ativo(true)
                .build();
    }

}