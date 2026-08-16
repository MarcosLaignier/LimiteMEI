package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.dto.conta.*;
import com.limiteMEI.limiteMEI.mapper.ContaFinanceiraMapper;
import com.limiteMEI.limiteMEI.repository.ContaFinanceiraRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContaFinanceiraService extends BaseService<ContaFinanceira, Long, ContaFinanceiraCreateDTO, ContaFinanceiraDTO> {
    private final ContaFinanceiraRepository repository;
    private final ContaFinanceiraMapper mapper;
    private final EmpresaAtualService empresaAtual;

    public ContaFinanceiraService(ContaFinanceiraRepository repository, ContaFinanceiraMapper mapper,
                                  EmpresaAtualService empresaAtual, GenericUniqueValidator validator) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
        this.empresaAtual = empresaAtual;
    }

    @Override
    protected ContaFinanceiraRepository getRepository() { return repository; }
    @Override
    protected ContaFinanceiraMapper getMapper() { return mapper; }
    @Override
    protected void beforeSave(ContaFinanceira entity) { entity.setEmpresa(empresaAtual.get()); }
    @Override
    protected void validate(ContaFinanceira entity) {
        Long id = entity.getId() == null ? -1L : entity.getId();
        if (repository.existsByEmpresaIdAndNomeIgnoreCaseAndIdNot(empresaAtual.get().getId(), entity.getNome(), id))
            throw new ApplicationException("Já existe uma conta financeira com este nome");
        super.validate(entity);
    }

    @Override
    public List<ContaFinanceiraDTO> findAll() {
        return repository.findByEmpresaIdOrderByNome(empresaAtual.get().getId()).stream().map(mapper::toDTO).toList();
    }
    @Override
    public ContaFinanceiraDTO getById(Long id) { return mapper.toDTO(findOwned(id)); }
    @Override
    public ContaFinanceiraDTO update(Long id, ContaFinanceiraCreateDTO dto) {
        ContaFinanceira entity = findOwned(id);
        mapper.updateEntity(entity, dto);
        validate(entity);
        return mapper.toDTO(repository.save(entity));
    }
    @Override
    public void delete(Long id) { repository.delete(findOwned(id)); }

    private ContaFinanceira findOwned(Long id) {
        return repository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Conta financeira não encontrada"));
    }

    public ContaFinanceira findOwnedEntity(Long id) {
        return findOwned(id);
    }
}
