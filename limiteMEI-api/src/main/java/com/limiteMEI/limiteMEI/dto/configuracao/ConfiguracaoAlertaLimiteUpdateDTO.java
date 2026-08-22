package com.limiteMEI.limiteMEI.dto.configuracao;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoAlertaLimiteUpdateDTO {
    private Long id;

    @NotNull(message = "Informe o percentual do alerta")
    @DecimalMin(value = "1.00", message = "O percentual do alerta deve ser maior que zero")
    @DecimalMax(value = "999.00", message = "O percentual do alerta deve ser menor que 999%")
    private BigDecimal percentual;

    @NotNull(message = "Informe se o alerta está ativo")
    private Boolean ativo;
}
