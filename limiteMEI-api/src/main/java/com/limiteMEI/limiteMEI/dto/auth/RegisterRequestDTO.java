package com.limiteMEI.limiteMEI.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Email(message = "Informe um e-mail válido")
    @NotBlank(message = "O e-mail é obrigatório")
    private String email;

    @Size(min = 8, message = "A senha deve possuir pelo menos 8 caracteres")
    @NotBlank(message = "A senha é obrigatória")
    private String senha;
}
