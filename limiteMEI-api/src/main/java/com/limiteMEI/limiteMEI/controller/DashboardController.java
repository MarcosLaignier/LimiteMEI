package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.dashboard.DashboardDTO;
import com.limiteMEI.limiteMEI.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardDTO carregar(@RequestParam int ano, @RequestParam int mes) {
        return service.carregar(ano, mes);
    }
}
