package com.limiteMEI.limiteMEI.service;


import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.repository.EmpresaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;

import org.springframework.stereotype.Service;

@Service
public class EmpresaService extends BaseService<Empresa, Long> {

    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository,
                          GenericUniqueValidator genericUniqueValidator) {
        super(genericUniqueValidator);
        this.repository = repository;
    }

    @Override
    protected EmpresaRepository getRepository() {
        return repository;
    }
}
