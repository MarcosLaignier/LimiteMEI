package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroCreateDTO;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;
import com.limiteMEI.limiteMEI.mapper.MovimentoFinanceiroMapper;
import com.limiteMEI.limiteMEI.repository.MovimentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;

@Service
public class MovimentoFinanceiroService extends BaseService<MovimentoFinanceiro, Long, MovimentoFinanceiroCreateDTO, MovimentoFinanceiroDTO> {

    private final MovimentoFinanceiroRepository repository;
    private final MovimentoFinanceiroMapper mapper;

    public MovimentoFinanceiroService(
            MovimentoFinanceiroRepository repository,
            MovimentoFinanceiroMapper mapper,
            GenericUniqueValidator validator
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    protected MovimentoFinanceiroRepository getRepository() {
        return repository;
    }

    @Override
    protected MovimentoFinanceiroMapper getMapper() {
        return mapper;
    }
}