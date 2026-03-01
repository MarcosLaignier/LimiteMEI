package com.limiteMEI.limiteMEI.utils;


import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import com.limiteMEI.limiteMEI.utils.validate.ValidateMetodsUtils;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class BaseService<T,ID>  {

    @Autowired
    public GenericUniqueValidator genericUniqueValidator;

    /** Metodo padrao de Save
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo save do repositorio padrao */
    public T save(T entity) {

        Object var2;
        try {
            this.validate(entity);
            this.beforeSave(entity);
            entity = (T) this.getRepository().save(entity);
            this.afterSave(entity);
            var2 = entity;
        } finally {
        }

        return (T) var2;
    }



    /** Metodo padrao de Update
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo update do repositorio padrao */
    public T update(T entity) throws ServiceException {

        Object var2;
        try {
            this.validate(entity);
            this.beforeUpdate(entity);
            entity = (T) this.getRepository().save(entity);
            this.afterUpdate(entity);
            var2 = entity;
        } finally {
        }

        return (T) var2;
    }

    /** Metodo padrao de Delete
     * Nele ha possibilidade de validar ou executar algo antes ou apos a execucao do metodo delete do repositorio padrao */
    public T delete(T entity) throws ServiceException {

        Object var2;
        try {
            this.validateDelete(entity);
            this.beforeDelete(entity);
            this.getRepository().delete(entity);
            this.afterDelete(entity);
            var2 = entity;
        } finally {

        }

        return (T) var2;
    }

    /**
     * Metodo padrao de buscar todos os dados da entity
     */
    public List<T> findAll() {
        return this.getRepository().findAll();
    }

    /** Metodo padrao de buscar por ID da entity */

    public T getById(ID id) {
        return (T) this.getRepository().findById(id).orElseThrow();
    }


    protected void validate(T entity) throws ServiceException {
        ValidateMetodsUtils.validate(entity,  genericUniqueValidator);
    }

    protected void validateDelete(T entity) throws ServiceException {
    }

    protected void beforeSave(T entity) throws ServiceException {
    }

    protected void afterSave(T entity) throws ServiceException {
    }

    protected void beforeUpdate(T entity) throws ServiceException {
    }

    protected void afterUpdate(T entity) throws ServiceException {
    }

    protected void beforeDelete(T entity) throws ServiceException {
    }

    protected void afterDelete(T entity) throws ServiceException {
    }

    public abstract JpaRepository getRepository();

}

