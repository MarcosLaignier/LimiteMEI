package com.limiteMEI.limiteMEI.dto.mei;

import com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum;
import com.limiteMEI.limiteMEI.enums.TipoDocumentoFiscalEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalApuracaoDTO {
    private Long id;
    private TipoDocumentoFiscalEnum tipo;
    private String numero;
    private LocalDate dataEmissao;
    private String cliente;
    private SituacaoDocumentoFiscalEnum situacao;
    private BigDecimal valorTotal;
    private BigDecimal valorVinculado;
    private BigDecimal diferenca;
}
