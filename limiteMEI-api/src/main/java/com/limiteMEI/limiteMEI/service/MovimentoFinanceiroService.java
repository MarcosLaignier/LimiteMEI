package com.limiteMEI.limiteMEI.service;


import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.repository.MovimentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;

import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;

@Service
public class MovimentoFinanceiroService extends BaseService<MovimentoFinanceiro, Long> {

    private final MovimentoFinanceiroRepository repository;

    public MovimentoFinanceiroService(MovimentoFinanceiroRepository repository,
                                      GenericUniqueValidator genericUniqueValidator) {
        super(genericUniqueValidator);
        this.repository = repository;
    }

    @Override
    protected MovimentoFinanceiroRepository getRepository() {
        return repository;
    }
}