package com.limiteMEI.limiteMEI.dto.configuracao;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoAlertaLimiteDTO {
    private Long id;
    private BigDecimal percentual;
    private Boolean ativo;
    private Boolean obrigatorio;
}
