package com.limiteMEI.limiteMEI.dto.lancamento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MotivoOperacaoDTO {

    @NotBlank(message = "Informe o motivo")
    @Size(max = 500, message = "O motivo deve possuir no máximo 500 caracteres")
    private String motivo;
}
