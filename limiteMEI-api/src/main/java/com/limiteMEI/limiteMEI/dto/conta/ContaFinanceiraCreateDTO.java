package com.limiteMEI.limiteMEI.dto.conta;

import com.limiteMEI.limiteMEI.enums.TipoContaFinanceiraEnum;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContaFinanceiraCreateDTO {
    @NotBlank
    private String nome;
    @NotNull
    private TipoContaFinanceiraEnum tipo;
    private String instituicao;
    private String agencia;
    private String numeroConta;
    private BigDecimal saldoInicial;
    private Boolean ativo;
}
