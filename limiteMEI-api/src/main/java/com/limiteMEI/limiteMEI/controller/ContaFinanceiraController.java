package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.dto.conta.*;
import com.limiteMEI.limiteMEI.service.ContaFinanceiraService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas-financeiras")
public class ContaFinanceiraController extends BaseController<ContaFinanceira, ContaFinanceiraDTO, ContaFinanceiraCreateDTO, Long> {
    private final ContaFinanceiraService service;
    public ContaFinanceiraController(ContaFinanceiraService service) { this.service = service; }
    @Override
    protected ContaFinanceiraService getService() { return service; }
}
