package com.limiteMEI.limiteMEI.dto.relatorio;

import com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum;
import com.limiteMEI.limiteMEI.enums.TipoDocumentoFiscalEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RelatorioDocumentoFiscalFiltroDTO {
    private LocalDate inicio;
    private LocalDate fim;
    private TipoDocumentoFiscalEnum tipo;
    private SituacaoDocumentoFiscalEnum situacao;
    private String cliente;
}
