package com.limiteMEI.limiteMEI.dto.movimento;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoFinanceiroDTO {

    private Long id;

    private String descricao;

    private BigDecimal valor;

    private LocalDate data;

    private TipoMovimentoEnum tipo;

    private Long empresaId;

    private Long categoriaId;

}