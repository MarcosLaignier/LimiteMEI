package com.limiteMEI.limiteMEI.dto.documentofiscal;

import com.limiteMEI.limiteMEI.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalCreateDTO {
    @NotNull
    private TipoDocumentoFiscalEnum tipo;
    @NotBlank
    private String numero;
    private String serie;
    private String chaveAcesso;
    @NotNull
    private LocalDate dataEmissao;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal valorTotal;
    @NotNull
    private SituacaoDocumentoFiscalEnum situacao;
    private Long clienteId;
    private String observacao;
    @Valid
    private List<DocumentoFiscalVinculoCreateDTO> vinculos;
}
