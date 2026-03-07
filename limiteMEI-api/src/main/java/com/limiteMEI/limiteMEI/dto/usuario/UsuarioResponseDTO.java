package com.limiteMEI.limiteMEI.dto.usuario;


import com.limiteMEI.limiteMEI.enums.RoleEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;

    private String nome;

    private String email;

    private RoleEnum roleEnum;

    private Boolean ativo;

}