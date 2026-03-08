package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioDTO;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioCreateDTO;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper implements BaseMapper<Usuario, UsuarioDTO, UsuarioCreateDTO> {

    @Override
    public UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .roleEnum(usuario.getRoleEnum())
                .ativo(usuario.getAtivo())
                .build();
    }

    @Override
    public Usuario toEntity(UsuarioCreateDTO dto) {
        if (dto == null) return null;
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenhaHash(dto.getSenha());
        usuario.setRoleEnum(dto.getRole());
        usuario.setAtivo(true);
        return usuario;
    }
}