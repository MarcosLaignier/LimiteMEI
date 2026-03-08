package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioCreateDTO;
import com.limiteMEI.limiteMEI.dto.usuario.UsuarioDTO;
import com.limiteMEI.limiteMEI.service.UsuarioService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController extends BaseController<Usuario, UsuarioDTO, UsuarioCreateDTO, Long> {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @Override
    protected UsuarioService getService() {
        return service;
    }
}