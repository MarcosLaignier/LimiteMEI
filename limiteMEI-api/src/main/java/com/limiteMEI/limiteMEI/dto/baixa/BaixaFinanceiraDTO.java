package com.limiteMEI.limiteMEI.dto.baixa;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaixaFinanceiraDTO {
    private Long id;
    private Long lancamentoId;
    private Long contaFinanceiraId;
    private String contaFinanceiraNome;
    private BigDecimal valor;
    private LocalDate dataLiquidacao;
    private FormaPagamentoEnum formaPagamento;
    private String observacao;
}
