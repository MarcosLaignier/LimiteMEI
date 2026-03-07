package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.repository.CategoriaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;

import org.springframework.stereotype.Service;

@Service
public class CategoriaService extends BaseService<Categoria, Long> {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository,
                            GenericUniqueValidator genericUniqueValidator) {
        super(genericUniqueValidator);
        this.repository = repository;
    }

    @Override
    protected CategoriaRepository getRepository() {
        return repository;
    }
}
