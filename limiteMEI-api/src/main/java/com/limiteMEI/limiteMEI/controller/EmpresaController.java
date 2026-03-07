package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.service.EmpresaService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import com.limiteMEI.limiteMEI.utils.BaseService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/empresas")
public class EmpresaController extends BaseController<Empresa, Long> {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }

    @Override
    protected EmpresaService getService() {
        return service;
    }
}