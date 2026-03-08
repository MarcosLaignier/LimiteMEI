package com.limiteMEI.limiteMEI.utils;

import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import com.limiteMEI.limiteMEI.utils.validate.ValidateMetodsUtils;

import java.util.List;

public abstract class BaseService<T, ID, C, D> {

    protected final GenericUniqueValidator validator;

    protected BaseService(GenericUniqueValidator validator) {
        this.validator = validator;
    }

    protected abstract com.limiteMEI.limiteMEI.utils.BaseRepository<T, ID> getRepository();
    protected abstract BaseMapper<T, D, C> getMapper();

    public D save(C createDTO) {

        T entity = getMapper().toEntity(createDTO);

        validate(entity);
        beforeSave(entity);

        entity = getRepository().save(entity);

        afterSave(entity);

        return getMapper().toDTO(entity);
    }

    public D update(ID id, C dto) {

        getRepository().findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        T entity = getMapper().toEntity(dto);

        validate(entity);
        beforeUpdate(entity);

        entity = getRepository().save(entity);

        afterUpdate(entity);

        return getMapper().toDTO(entity);
    }

    public void delete(ID id) {

        T entity = getRepository()
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        validateDelete(entity);
        beforeDelete(entity);

        getRepository().delete(entity);

        afterDelete(entity);
    }

    public D getById(ID id) {

        T entity = getRepository()
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        return getMapper().toDTO(entity);
    }

    public List<D> findAll() {

        return getRepository()
                .findAll()
                .stream()
                .map(getMapper()::toDTO)
                .toList();
    }

    protected void validate(T entity) {
        ValidateMetodsUtils.validate(entity, validator);
    }

    protected void validateDelete(T entity) {}
    protected void beforeSave(T entity) {}
    protected void afterSave(T entity) {}
    protected void beforeUpdate(T entity) {}
    protected void afterUpdate(T entity) {}
    protected void beforeDelete(T entity) {}
    protected void afterDelete(T entity) {}
}