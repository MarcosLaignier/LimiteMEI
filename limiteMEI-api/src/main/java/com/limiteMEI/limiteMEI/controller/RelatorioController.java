package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.relatorio.RelatorioFluxoCaixaDTO;
import com.limiteMEI.limiteMEI.service.RelatorioService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {
    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @GetMapping("/fluxo-caixa")
    public RelatorioFluxoCaixaDTO fluxoCaixa(@RequestParam LocalDate inicio,
                                             @RequestParam LocalDate fim,
                                             @RequestParam(required = false) Long contaFinanceiraId) {
        return service.fluxoCaixa(inicio, fim, contaFinanceiraId);
    }
}
