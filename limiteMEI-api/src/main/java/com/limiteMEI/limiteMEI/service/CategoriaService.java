package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaCreateDTO;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaDTO;
import com.limiteMEI.limiteMEI.mapper.CategoriaMapper;
import com.limiteMEI.limiteMEI.repository.CategoriaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService extends BaseService<Categoria, Long, CategoriaCreateDTO, CategoriaDTO> {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;

    public CategoriaService(
            CategoriaRepository repository,
            CategoriaMapper mapper,
            GenericUniqueValidator validator
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    protected CategoriaRepository getRepository() {
        return repository;
    }

    @Override
    protected CategoriaMapper getMapper() {
        return mapper;
    }
}