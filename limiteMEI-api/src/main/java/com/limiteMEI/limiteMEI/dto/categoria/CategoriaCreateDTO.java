package com.limiteMEI.limiteMEI.dto.categoria;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.enums.ExigenciaPessoaEnum;
import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaCreateDTO {

    @NotBlank
    private String nome;

    @NotNull(message = "O tipo da categoria é obrigatório")
    private TipoMovimentoEnum tipo;

    private NaturezaReceitaEnum naturezaReceita;

    private ExigenciaPessoaEnum exigenciaPessoa;

    private PapelPessoaEnum papelPessoa;

    private Boolean compoeFaturamentoMei;

    private Boolean exigeDocumentoFiscal;

    private Boolean ativo;

}
