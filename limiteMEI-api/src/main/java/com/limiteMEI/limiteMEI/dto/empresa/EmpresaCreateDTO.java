package com.limiteMEI.limiteMEI.dto.empresa;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaCreateDTO {

    private Long usuarioId;

    @NotBlank
    private String cnpj;

    @NotBlank
    private String razaoSocial;

    private String nomeFantasia;

    private LocalDate dataAbertura;

    private BigDecimal limiteAnual;

}