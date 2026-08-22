package com.limiteMEI.limiteMEI.dto.dashboard;

import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardObrigacaoMeiDTO {
    private Long id;
    private LocalDate competencia;
    private LocalDate vencimento;
    private SituacaoObrigacaoMeiEnum situacao;
    private BigDecimal valor;
    private Integer quantidadePendentes;
    private Integer quantidadeAtrasadas;
    private Integer quantidadePagas;
    private Integer quantidadeEmAberto;
}
