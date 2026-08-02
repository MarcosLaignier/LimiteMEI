package com.limiteMEI.limiteMEI.dto.pessoa;

import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PessoaCreateDTO {

    @NotNull
    private TipoPessoaEnum tipoPessoa;

    @NotBlank
    private String nomeRazaoSocial;

    private String nomeFantasia;

    private String cpfCnpj;

    @Email
    private String email;

    private String telefone;

    private Boolean ativo;
}
