package com.limiteMEI.limiteMEI.dto.relatorio;

import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelatorioPessoaFiltroDTO {
    private String nome;
    private String documento;
    private TipoPessoaEnum tipoPessoa;
}
