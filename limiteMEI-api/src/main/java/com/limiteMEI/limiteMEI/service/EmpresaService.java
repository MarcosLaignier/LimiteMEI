package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaCreateDTO;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaDTO;
import com.limiteMEI.limiteMEI.mapper.EmpresaMapper;
import com.limiteMEI.limiteMEI.repository.EmpresaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService extends BaseService<Empresa, Long, EmpresaCreateDTO, EmpresaDTO> {

    private final EmpresaRepository repository;
    private final EmpresaMapper mapper;

    public EmpresaService(
            EmpresaRepository repository,
            EmpresaMapper mapper,
            GenericUniqueValidator validator
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    protected EmpresaRepository getRepository() {
        return repository;
    }

    @Override
    protected EmpresaMapper getMapper() {
        return mapper;
    }
}