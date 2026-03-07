package com.limiteMEI.limiteMEI.utils;

import org.hibernate.service.spi.ServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
public abstract class BaseController<T, ID> {

    protected abstract BaseService<T, ID> getService();

    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable ID id) {

        T entity = getService().getById(id);

        return ResponseEntity.ok(entity);
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll() {

        List<T> entities = getService().findAll();

        return ResponseEntity.ok(entities);
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T entity) {

        T saved = getService().save(entity);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T entity) {

        T updated = getService().update(entity);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {

        T entity = getService().getById(id);

        getService().delete(entity);

        return ResponseEntity.noContent().build();
    }
}