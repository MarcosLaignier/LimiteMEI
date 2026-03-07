package com.limiteMEI.limiteMEI.enums;

import lombok.Getter;

@Getter
public enum FormaPagamentoEnum {

    PIX("Pix"),
    DINHEIRO("Dinheiro"),
    CARTAO_CREDITO("Cartão de Crédito"),
    CARTAO_DEBITO("Cartão de Débito"),
    BOLETO("Boleto"),
    TRANSFERENCIA("Transferência");

    private final String nome;

    FormaPagamentoEnum(String nome) {
        this.nome = nome;
    }


}