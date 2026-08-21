package com.limiteMEI.limiteMEI.dto.mei;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConferenciaFiscalMeiDTO {
    private Integer quantidadeEmitidos;
    private BigDecimal valorEmitidos;
    private Integer quantidadeCancelados;
    private BigDecimal valorCancelados;
    private BigDecimal percentualDocumentado;
    private Integer quantidadePendencias;
    private Integer quantidadeDivergencias;
    private List<DocumentoFiscalApuracaoDTO> documentos;
}
