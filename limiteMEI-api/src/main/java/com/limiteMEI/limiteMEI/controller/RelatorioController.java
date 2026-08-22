package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.relatorio.RelatorioFluxoCaixaDTO;
import com.limiteMEI.limiteMEI.dto.relatorio.RelatorioFluxoCaixaFiltroDTO;
import com.limiteMEI.limiteMEI.service.RelatorioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {
    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @PostMapping("/fluxo-caixa")
    public RelatorioFluxoCaixaDTO fluxoCaixa(@RequestBody RelatorioFluxoCaixaFiltroDTO filtro) {
        return service.fluxoCaixa(filtro);
    }
}
