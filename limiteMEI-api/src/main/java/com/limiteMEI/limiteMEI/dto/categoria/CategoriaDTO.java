package com.limiteMEI.limiteMEI.dto.categoria;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDTO {

    private Long id;

    private String nome;

    private TipoMovimentoEnum tipo;

}