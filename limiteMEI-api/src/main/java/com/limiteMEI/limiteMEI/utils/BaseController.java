package com.limiteMEI.limiteMEI.utils;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
public abstract class BaseController<E, D, C, ID> {

    protected abstract BaseService<E, ID, C, D> getService();

    @GetMapping("/{id}")
    public ResponseEntity<D> findById(@PathVariable ID id) {
        D dto = getService().getById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<D>> findAll() {
        List<D> dtos = getService().findAll();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<D> create(@Valid @RequestBody C createDTO) {
        D dto = getService().save(createDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<D> update(@PathVariable ID id, @RequestBody C updateDTO) {
        D dto = getService().update(id, updateDTO);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        getService().delete(id);
        return ResponseEntity.noContent().build();
    }
}