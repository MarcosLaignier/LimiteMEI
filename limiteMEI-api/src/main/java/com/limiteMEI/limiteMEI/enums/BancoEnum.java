package com.limiteMEI.limiteMEI.enums;

import lombok.Getter;

@Getter
public enum BancoEnum {
    BANCO_DO_BRASIL("001", "Banco do Brasil"),
    SANTANDER("033", "Santander"),
    CAIXA("104", "Caixa Econômica Federal"),
    BRADESCO("237", "Bradesco"),
    ITAU("341", "Itaú Unibanco"),
    NUBANK("260", "Nu Pagamentos"),
    INTER("077", "Banco Inter"),
    C6("336", "C6 Bank"),
    MERCADO_PAGO("323", "Mercado Pago"),
    PAGBANK("290", "PagBank"),
    STONE("197", "Stone"),
    SICREDI("748", "Sicredi"),
    SICOOB("756", "Sicoob"),
    BANRISUL("041", "Banrisul"),
    BTG_PACTUAL("208", "BTG Pactual"),
    ORIGINAL("212", "Banco Original"),
    SAFRA("422", "Safra"),
    XP("348", "Banco XP"),
    OUTRO("999", "Outro");

    private final String codigo;
    private final String nome;

    BancoEnum(String codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }

    public String getDescricao() {
        return codigo + " - " + nome;
    }
}
