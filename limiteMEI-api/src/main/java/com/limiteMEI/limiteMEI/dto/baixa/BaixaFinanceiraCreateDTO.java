package com.limiteMEI.limiteMEI.dto.baixa;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaixaFinanceiraCreateDTO {
    @NotNull
    private Long contaFinanceiraId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal valorPrincipal;

    @DecimalMin(value = "0.00")
    private BigDecimal juros;

    @DecimalMin(value = "0.00")
    private BigDecimal multa;

    @DecimalMin(value = "0.00")
    private BigDecimal desconto;
    @NotNull
    private LocalDate dataLiquidacao;
    @NotNull
    private FormaPagamentoEnum formaPagamento;
    private String observacao;
}
