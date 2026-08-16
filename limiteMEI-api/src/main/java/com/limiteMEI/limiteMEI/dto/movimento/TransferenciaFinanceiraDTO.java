package com.limiteMEI.limiteMEI.dto.movimento;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferenciaFinanceiraDTO {
    @NotNull
    private Long contaOrigemId;
    @NotNull
    private Long contaDestinoId;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal valor;
    @NotNull
    private LocalDate data;
    private String descricao;
    private String observacao;
}
