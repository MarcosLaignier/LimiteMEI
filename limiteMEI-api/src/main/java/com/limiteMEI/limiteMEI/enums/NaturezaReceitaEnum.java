package com.limiteMEI.limiteMEI.enums;

import lombok.Getter;

@Getter
public enum NaturezaReceitaEnum {
    COMERCIO("Comércio"),
    INDUSTRIA("Indústria"),
    SERVICOS("Serviços");

    private final String nome;

    NaturezaReceitaEnum(String nome) {
        this.nome = nome;
    }
}
