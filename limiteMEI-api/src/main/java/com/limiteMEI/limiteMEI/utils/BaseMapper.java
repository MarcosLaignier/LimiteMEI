package com.limiteMEI.limiteMEI.utils;

public interface BaseMapper<E, D, C> {
    D toDTO(E entity);
    E toEntity(C createDTO);
    void updateEntity(E entity, C dto);
}
