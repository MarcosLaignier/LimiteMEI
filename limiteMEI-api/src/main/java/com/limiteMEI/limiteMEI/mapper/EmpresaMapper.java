package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaDTO;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaCreateDTO;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;

@Component
public class EmpresaMapper implements BaseMapper<Empresa, EmpresaDTO, EmpresaCreateDTO> {

    @Override
    public EmpresaDTO toDTO(Empresa empresa) {
        if (empresa == null) return null;
        return EmpresaDTO.builder()
                .id(empresa.getId())
                .usuarioId(empresa.getUsuario().getId())
                .cnpj(empresa.getCnpj())
                .razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia())
                .dataAbertura(empresa.getDataAbertura())
                .limiteAnual(empresa.getLimiteAnual())
                .ativo(empresa.getAtivo())
                .build();
    }

    @Override
    public Empresa toEntity(EmpresaCreateDTO dto) {
        if (dto == null) return null;
        Empresa empresa = new Empresa();
        empresa.setCnpj(dto.getCnpj());
        empresa.setRazaoSocial(dto.getRazaoSocial());
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setDataAbertura(dto.getDataAbertura());
        empresa.setLimiteAnual(dto.getLimiteAnual());
        empresa.setAtivo(true);
        // usuario deve ser setado no service ou via DTO com ID do usuário
        return empresa;
    }
}