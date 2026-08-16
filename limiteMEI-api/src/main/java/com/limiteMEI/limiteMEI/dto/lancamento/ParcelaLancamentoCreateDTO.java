package com.limiteMEI.limiteMEI.dto.lancamento;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelaLancamentoCreateDTO {

    private Long id;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal valor;

    @NotNull
    private LocalDate dataCompetencia;

    @NotNull
    private LocalDate dataVencimento;

    private Boolean entrada;
}
