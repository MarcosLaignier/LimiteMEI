package com.limiteMEI.limiteMEI.dto.documentofiscal;

import com.limiteMEI.limiteMEI.enums.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalDTO {
    private Long id;
    private TipoDocumentoFiscalEnum tipo;
    private String numero;
    private String serie;
    private String chaveAcesso;
    private LocalDate dataEmissao;
    private BigDecimal valorTotal;
    private BigDecimal valorVinculado;
    private BigDecimal saldoVincular;
    private SituacaoDocumentoFiscalEnum situacao;
    private Long clienteId;
    private String clienteNome;
    private String observacao;
    private List<DocumentoFiscalVinculoDTO> vinculos;
}
