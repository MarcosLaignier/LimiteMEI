package com.limiteMEI.limiteMEI.utils;

public interface BaseMapper<E, D, C> {
    D toDTO(E entity);      // Para GET
    E toEntity(C createDTO); // Para POST/PUT
}