package com.limiteMEI.limiteMEI.enums;

import lombok.Getter;

@Getter
public enum TipoMovimentoEnum {

    RECEITA("Receita"),
    DESPESA("Despesa");

    private final String nome;

    TipoMovimentoEnum(String nome) {
        this.nome = nome;
    }

}