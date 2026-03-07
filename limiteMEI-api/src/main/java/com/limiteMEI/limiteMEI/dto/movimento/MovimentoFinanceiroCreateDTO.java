package com.limiteMEI.limiteMEI.dto.movimento;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoFinanceiroCreateDTO {

    private String descricao;

    @NotNull
    private BigDecimal valor;

    @NotNull
    private LocalDate data;

    @NotNull
    private TipoMovimentoEnum tipo;

    private Long categoriaId;

}