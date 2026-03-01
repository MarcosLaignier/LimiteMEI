package com.limiteMEI.limiteMEI.utils;

import org.hibernate.service.spi.ServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
public abstract class BaseController<T,ID> {

    public abstract BaseService getService();


    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable("id") Integer id) {
        T entityReturn = (T) getService().getById(id);
        return ResponseEntity.status(HttpStatus.OK).body(entityReturn);
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll( ) {
        List<T> entityReturn = (List<T>) getService().findAll( );
        return ResponseEntity.status(HttpStatus.OK).body(entityReturn);
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T entity) throws ServiceException {
        T entityReturn = (T) getService().save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(entityReturn);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@RequestBody T entity){
        T entityReturn = (T) getService().update(entity);
        return ResponseEntity.status(HttpStatus.OK).body(entityReturn);
    }

    @DeleteMapping
    public ResponseEntity<T> delete(@RequestBody T entity){
        getService().delete(entity);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}