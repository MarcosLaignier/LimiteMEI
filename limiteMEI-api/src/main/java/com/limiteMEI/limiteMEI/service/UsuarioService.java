package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioCreateDTO;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioDTO;
import com.limiteMEI.limiteMEI.mapper.UsuarioMapper;
import com.limiteMEI.limiteMEI.repository.UsuarioRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService extends BaseService<Usuario, Long, UsuarioCreateDTO, UsuarioDTO> {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;

    public UsuarioService(
            UsuarioRepository repository,
            UsuarioMapper mapper,
            GenericUniqueValidator validator
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    protected UsuarioRepository getRepository() {
        return repository;
    }

    @Override
    protected UsuarioMapper getMapper() {
        return mapper;
    }
}