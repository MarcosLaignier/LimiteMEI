package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioCreateDTO;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioResponseDTO;

public class UsuarioMapper {

    public static UsuarioResponseDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;

        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .roleEnum(usuario.getRoleEnum())
                .ativo(usuario.getAtivo())
                .build();
    }

    public static Usuario toEntity(UsuarioCreateDTO dto, String senhaHash) {
        if (dto == null) return null;

        return Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senhaHash(senhaHash)
                .ativo(true)
                .build();
    }

}