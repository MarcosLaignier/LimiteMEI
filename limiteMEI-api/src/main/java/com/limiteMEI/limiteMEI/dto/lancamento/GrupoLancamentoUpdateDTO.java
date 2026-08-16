package com.limiteMEI.limiteMEI.dto.lancamento;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrupoLancamentoUpdateDTO {

    @NotBlank
    private String descricao;

    @NotNull
    private Long categoriaId;

    private Long pessoaId;

    private String observacao;

    private Boolean ativo;

    @NotEmpty
    @Valid
    private List<ItemGrupoLancamentoUpdateDTO> itens;
}
