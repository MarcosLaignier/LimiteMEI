package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.service.CategoriaService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import com.limiteMEI.limiteMEI.utils.BaseService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categorias")
public class CategoriaController extends BaseController<Categoria, Long> {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @Override
    protected CategoriaService getService() {
        return service;
    }
}