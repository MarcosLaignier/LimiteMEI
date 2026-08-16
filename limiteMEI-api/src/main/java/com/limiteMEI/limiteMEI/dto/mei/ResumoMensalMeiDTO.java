package com.limiteMEI.limiteMEI.dto.mei;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumoMensalMeiDTO {
    private Integer mes;
    private BigDecimal comercio;
    private BigDecimal industria;
    private BigDecimal servicos;
    private BigDecimal comDocumentoFiscal;
    private BigDecimal semDocumentoFiscal;
    private BigDecimal total;
}
