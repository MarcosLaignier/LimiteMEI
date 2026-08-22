package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaCreateDTO;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaDTO;
import com.limiteMEI.limiteMEI.mapper.EmpresaMapper;
import com.limiteMEI.limiteMEI.service.EmpresaService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import com.limiteMEI.limiteMEI.utils.BaseService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/empresas")
public class EmpresaController extends BaseController<Empresa, EmpresaDTO, EmpresaCreateDTO, Long> {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }

    @Override
    protected EmpresaService getService() {
        return service;
    }

    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EmpresaDTO salvarLogo(@PathVariable Long id, @RequestPart("arquivo") MultipartFile arquivo) {
        return service.salvarLogo(id, arquivo);
    }

    @DeleteMapping("/{id}/logo")
    public EmpresaDTO removerLogo(@PathVariable Long id) {
        return service.removerLogo(id);
    }
}
