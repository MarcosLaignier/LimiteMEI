package com.limiteMEI.limiteMEI.dto.documentofiscal;

import com.limiteMEI.limiteMEI.enums.TipoDocumentoFiscalEnum;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class DocumentoFiscalXmlPreviewDTO {

    private TipoDocumentoFiscalEnum tipo;
    private String numero;
    private String serie;
    private String chaveAcesso;
    private LocalDate dataEmissao;
    private BigDecimal valorTotal;
    private Long clienteId;
    private String clienteNome;
    private String clienteDocumento;
    private boolean clienteEncontrado;
}
