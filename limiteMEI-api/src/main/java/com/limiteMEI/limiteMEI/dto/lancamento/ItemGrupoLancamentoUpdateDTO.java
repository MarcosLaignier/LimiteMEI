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
public class ItemGrupoLancamentoUpdateDTO {

    @NotNull(message = "Informe o identificador do item")
    private Long id;

    @NotNull(message = "Informe o valor do item")
    @DecimalMin(value = "0.01", message = "O valor do item deve ser maior que zero")
    private BigDecimal valor;

    @NotNull(message = "Informe a competência do item")
    private LocalDate dataCompetencia;

    @NotNull(message = "Informe a data de vencimento do item")
    private LocalDate dataVencimento;
}
