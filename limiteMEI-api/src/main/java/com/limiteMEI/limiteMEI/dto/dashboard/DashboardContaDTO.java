package com.limiteMEI.limiteMEI.dto.dashboard;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardContaDTO {
    private Long id;
    private String nome;
    private BigDecimal saldo;
}
