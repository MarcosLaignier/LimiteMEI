package com.limiteMEI.limiteMEI.dto.documentofiscal;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalVinculoDTO {
    private Long lancamentoId;
    private String descricao;
    private LocalDate competencia;
    private BigDecimal valorLancamento;
    private BigDecimal valorVinculado;
}
