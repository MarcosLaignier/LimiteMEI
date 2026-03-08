package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroCreateDTO;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;
import com.limiteMEI.limiteMEI.service.MovimentoFinanceiroService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/movimentos")
public class MovimentoFinanceiroController extends BaseController<MovimentoFinanceiro, MovimentoFinanceiroDTO, MovimentoFinanceiroCreateDTO, Long> {

    private final MovimentoFinanceiroService service;

    public MovimentoFinanceiroController(MovimentoFinanceiroService service) {
        this.service = service;
    }

    @Override
    protected MovimentoFinanceiroService getService() {
        return service;
    }
}