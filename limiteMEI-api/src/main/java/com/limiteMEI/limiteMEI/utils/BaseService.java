package com.limiteMEI.limiteMEI.utils;


import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import com.limiteMEI.limiteMEI.utils.validate.ValidateMetodsUtils;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class BaseService<T, ID> {

    protected final GenericUniqueValidator genericUniqueValidator;

    protected BaseService(GenericUniqueValidator genericUniqueValidator) {
        this.genericUniqueValidator = genericUniqueValidator;
    }

    protected abstract JpaRepository<T, ID> getRepository();

    /** Metodo padrao de Save
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo save do repositorio padrao
     */
    public T save(T entity) {

        validate(entity);
        beforeSave(entity);

        entity = getRepository().save(entity);

        afterSave(entity);

        return entity;
    }

    /** Metodo padrao de Update
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo update do repositorio padrao
     */
    public T update(T entity) {

        validate(entity);
        beforeUpdate(entity);

        entity = getRepository().save(entity);

        afterUpdate(entity);

        return entity;
    }

    /** Metodo padrao de Delete
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo delete do repositorio padrao
     */
    public void delete(T entity) {

        validateDelete(entity);
        beforeDelete(entity);

        getRepository().delete(entity);

        afterDelete(entity);
    }

    /**
     * Metodo padrao de buscar todos os dados da entity
     */
    public List<T> findAll() {
        return getRepository().findAll();
    }

    /** Metodo padrao de buscar por ID da entity */

    public T getById(ID id) {
        return getRepository()
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
    }

    protected void validate(T entity) {
        ValidateMetodsUtils.validate(entity, genericUniqueValidator);
    }

    protected void validateDelete(T entity) {
    }

    protected void beforeSave(T entity) {
    }

    protected void afterSave(T entity) {
    }

    protected void beforeUpdate(T entity) {
    }

    protected void afterUpdate(T entity) {
    }

    protected void beforeDelete(T entity) {
    }

    protected void afterDelete(T entity) {
    }
}
