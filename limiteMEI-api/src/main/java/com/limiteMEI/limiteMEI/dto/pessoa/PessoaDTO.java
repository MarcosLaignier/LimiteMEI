package com.limiteMEI.limiteMEI.dto.pessoa;

import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PessoaDTO {
    private Long id;
    private TipoPessoaEnum tipoPessoa;
    private String nomeRazaoSocial;
    private String nomeFantasia;
    private String cpfCnpj;
    private String email;
    private String telefone;
    private Boolean ativo;
    private Set<PapelPessoaEnum> papeis;
}
