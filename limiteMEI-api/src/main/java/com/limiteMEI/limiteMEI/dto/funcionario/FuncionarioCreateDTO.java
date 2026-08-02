package com.limiteMEI.limiteMEI.dto.funcionario;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioCreateDTO {
    @NotNull
    private Long pessoaId;

    private String cargo;

    @NotNull
    private LocalDate dataAdmissao;

    private LocalDate dataDemissao;

    @DecimalMin("0.00")
    private BigDecimal salario;

    private Boolean ativo;
}
