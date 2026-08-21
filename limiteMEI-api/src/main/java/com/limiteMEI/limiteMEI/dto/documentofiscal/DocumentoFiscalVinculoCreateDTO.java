package com.limiteMEI.limiteMEI.dto.documentofiscal;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalVinculoCreateDTO {
    @NotNull
    private Long lancamentoId;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal valorVinculado;
}
