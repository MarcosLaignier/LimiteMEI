package com.limiteMEI.limiteMEI.dto.baixa;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private BigDecimal valorPrincipal;
    private BigDecimal juros;
    private BigDecimal multa;
    private BigDecimal desconto;
    private BigDecimal valorPago;
    private LocalDate dataLiquidacao;
    private FormaPagamentoEnum formaPagamento;
    private String observacao;
    private Boolean ativo;
    private LocalDateTime dataEstorno;
    private String motivoEstorno;
    private String usuarioEstorno;
}
