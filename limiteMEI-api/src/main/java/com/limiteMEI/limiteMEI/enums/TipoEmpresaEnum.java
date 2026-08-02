package com.limiteMEI.limiteMEI.enums;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum TipoEmpresaEnum {

    MEI_GERAL("MEI Geral", new BigDecimal("81000.00")),
    MEI_CAMINHONEIRO("MEI Caminhoneiro", new BigDecimal("251600.00"));

    private final String nome;
    private final BigDecimal limiteAnual;

    TipoEmpresaEnum(String nome, BigDecimal limiteAnual) {
        this.nome = nome;
        this.limiteAnual = limiteAnual;
    }
}
