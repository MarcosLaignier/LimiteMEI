package com.limiteMEI.limiteMEI.dto.empresa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import com.limiteMEI.limiteMEI.enums.TipoEmpresaEnum;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaCreateDTO {

    private Long usuarioId;

    @NotBlank(message = "O CNPJ é obrigatório")
    @Pattern(regexp = "(?i)^[A-Z0-9]{12}[0-9]{2}$",
            message = "O CNPJ deve ter 12 caracteres alfanuméricos e 2 dígitos verificadores numéricos")
    private String cnpj;

    @NotBlank
    private String razaoSocial;

    private String nomeFantasia;

    @NotNull(message = "A data de abertura é obrigatória")
    private LocalDate dataAbertura;

    @NotNull(message = "O tipo da empresa é obrigatório")
    private TipoEmpresaEnum tipoEmpresa;

}
