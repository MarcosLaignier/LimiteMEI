package com.limiteMEI.limiteMEI.dto.categoria;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaCreateDTO {

    @NotBlank
    private String nome;

    private TipoMovimentoEnum tipo;

}