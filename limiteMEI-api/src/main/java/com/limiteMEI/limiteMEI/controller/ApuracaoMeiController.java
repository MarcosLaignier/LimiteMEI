package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.mei.ApuracaoMeiDTO;
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
}
