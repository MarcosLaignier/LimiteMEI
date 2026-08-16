package com.limiteMEI.limiteMEI.dto.categoria;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.enums.ExigenciaPessoaEnum;
import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDTO {

    private Long id;

    private String nome;

    private TipoMovimentoEnum tipo;

    private NaturezaReceitaEnum naturezaReceita;

    private ExigenciaPessoaEnum exigenciaPessoa;

    private PapelPessoaEnum papelPessoa;

    private Boolean compoeFaturamentoMei;

    private Boolean exigeDocumentoFiscal;

    private Boolean ativo;

}
