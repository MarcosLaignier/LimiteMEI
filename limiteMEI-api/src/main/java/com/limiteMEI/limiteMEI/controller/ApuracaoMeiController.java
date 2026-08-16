package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.mei.ApuracaoMeiDTO;
import com.limiteMEI.limiteMEI.dto.mei.RelatorioMensalMeiDTO;
import com.limiteMEI.limiteMEI.dto.lancamento.MotivoOperacaoDTO;
import jakarta.validation.Valid;
import com.limiteMEI.limiteMEI.service.ApuracaoMeiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mei/apuracao")
public class ApuracaoMeiController {
    private final ApuracaoMeiService service;

    public ApuracaoMeiController(ApuracaoMeiService service) {
        this.service = service;
    }

    @GetMapping
    public ApuracaoMeiDTO apurar(@RequestParam int ano, @RequestParam int mes) {
        return service.apurar(ano, mes);
    }

    @PostMapping("/fechamento")
    public ApuracaoMeiDTO fechar(@RequestParam int ano, @RequestParam int mes) {
        return service.fechar(ano, mes);
    }

    @PostMapping("/reabertura")
    public ApuracaoMeiDTO reabrir(@RequestParam int ano, @RequestParam int mes,
                                  @Valid @RequestBody MotivoOperacaoDTO dto) {
        return service.reabrir(ano, mes, dto);
    }

    @GetMapping("/relatorio")
    public RelatorioMensalMeiDTO relatorio(@RequestParam int ano, @RequestParam int mes) {
        return service.relatorio(ano, mes);
    }
}
