package com.limiteMEI.limiteMEI.dto.pessoa;

import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import com.limiteMEI.limiteMEI.enums.BancoEnum;
import com.limiteMEI.limiteMEI.enums.TipoContaFinanceiraEnum;
import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
import com.limiteMEI.limiteMEI.enums.UfEnum;
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
    private String telefoneAlternativo;
    private String responsavel;
    private String cep;
    private String endereco;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private UfEnum uf;
    private String observacoesComerciais;
    private BancoEnum banco;
    private String agencia;
    private String conta;
    private TipoContaFinanceiraEnum tipoConta;
    private String chavePix;
    private Boolean ativo;
    private Set<PapelPessoaEnum> papeis;
}
