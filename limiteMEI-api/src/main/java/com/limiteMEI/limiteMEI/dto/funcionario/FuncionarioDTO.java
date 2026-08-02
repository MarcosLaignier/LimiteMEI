package com.limiteMEI.limiteMEI.dto.funcionario;

import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDTO {
    private Long id;
    private PessoaDTO pessoa;
    private String cargo;
    private LocalDate dataAdmissao;
    private LocalDate dataDemissao;
    private BigDecimal salario;
    private Boolean ativo;
}
