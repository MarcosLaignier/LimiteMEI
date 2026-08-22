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
                .usuarioId(empresa.getUsuario() != null ? empresa.getUsuario().getId() : null)
                .cnpj(empresa.getCnpj())
                .razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia())
                .dataAbertura(empresa.getDataAbertura())
                .dataInicioSimei(empresa.getDataInicioSimei())
                .tipoEmpresa(empresa.getTipoEmpresa())
                .limiteAnual(empresa.getLimiteAnual())
                .ativo(empresa.getAtivo())
                .dataEncerramento(empresa.getDataEncerramento())
                .build();
    }

    @Override
    public Empresa toEntity(EmpresaCreateDTO dto) {
        if (dto == null) return null;
        Empresa empresa = new Empresa();
        empresa.setCnpj(normalizeCnpj(dto.getCnpj()));
        empresa.setRazaoSocial(dto.getRazaoSocial());
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setDataAbertura(dto.getDataAbertura());
        empresa.setDataInicioSimei(dto.getDataInicioSimei());
        empresa.setTipoEmpresa(dto.getTipoEmpresa());
        empresa.setLimiteAnual(dto.getTipoEmpresa() != null ? dto.getTipoEmpresa().getLimiteAnual() : null);
        empresa.setAtivo(dto.getAtivo() == null ? true : dto.getAtivo());
        empresa.setDataEncerramento(Boolean.FALSE.equals(empresa.getAtivo()) ? dto.getDataEncerramento() : null);
        // usuario deve ser setado no service ou via DTO com ID do usuário
        return empresa;
    }

    @Override
    public void updateEntity(Empresa empresa, EmpresaCreateDTO dto) {
        empresa.setCnpj(normalizeCnpj(dto.getCnpj()));
        empresa.setRazaoSocial(dto.getRazaoSocial());
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setDataAbertura(dto.getDataAbertura());
        empresa.setDataInicioSimei(dto.getDataInicioSimei());
        empresa.setTipoEmpresa(dto.getTipoEmpresa());
        empresa.setLimiteAnual(dto.getTipoEmpresa() != null ? dto.getTipoEmpresa().getLimiteAnual() : null);
        empresa.setAtivo(dto.getAtivo() == null ? empresa.getAtivo() : dto.getAtivo());
        empresa.setDataEncerramento(Boolean.FALSE.equals(empresa.getAtivo()) ? dto.getDataEncerramento() : null);
    }

    private String normalizeCnpj(String cnpj) {
        return cnpj == null ? null : cnpj.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
    }
}
