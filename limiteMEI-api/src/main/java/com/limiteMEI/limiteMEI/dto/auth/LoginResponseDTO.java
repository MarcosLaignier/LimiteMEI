package com.limiteMEI.limiteMEI.dto.auth;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String token;
    private String nome;
    private String email;
    private String role;

}
