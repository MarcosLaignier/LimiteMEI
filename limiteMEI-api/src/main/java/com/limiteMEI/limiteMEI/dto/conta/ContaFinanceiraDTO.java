package com.limiteMEI.limiteMEI.dto.conta;

import com.limiteMEI.limiteMEI.enums.BancoEnum;
import com.limiteMEI.limiteMEI.enums.TipoContaFinanceiraEnum;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContaFinanceiraDTO {
    private Long id;
    private String nome;
    private TipoContaFinanceiraEnum tipo;
    private BancoEnum instituicao;
    private String agencia;
    private String numeroConta;
    private BigDecimal saldoInicial;
    private Boolean ativo;
}
