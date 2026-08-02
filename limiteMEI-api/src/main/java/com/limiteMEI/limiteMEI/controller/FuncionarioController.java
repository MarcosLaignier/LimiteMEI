package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Funcionario;
import com.limiteMEI.limiteMEI.dto.funcionario.FuncionarioCreateDTO;
import com.limiteMEI.limiteMEI.dto.funcionario.FuncionarioDTO;
import com.limiteMEI.limiteMEI.service.FuncionarioService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController extends BaseController<Funcionario, FuncionarioDTO, FuncionarioCreateDTO, Long> {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @Override
    protected FuncionarioService getService() {
        return service;
    }
}
