package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.BancoEnum;
import com.limiteMEI.limiteMEI.enums.TipoContaFinanceiraEnum;
import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
import com.limiteMEI.limiteMEI.enums.UfEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "pessoa",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_pessoa_empresa_documento",
                columnNames = {"empresa_id", "cpf_cnpj"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPessoaEnum tipoPessoa;

    @Column(name = "nome_razao_social", nullable = false)
    private String nomeRazaoSocial;

    private String nomeFantasia;

    @Column(name = "cpf_cnpj")
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

    @Enumerated(EnumType.STRING)
    @Column(length = 2)
    private UfEnum uf;

    @Column(length = 1000)
    private String observacoesComerciais;

    @Enumerated(EnumType.STRING)
    private BancoEnum banco;

    private String agencia;

    private String conta;

    @Enumerated(EnumType.STRING)
    private TipoContaFinanceiraEnum tipoConta;

    private String chavePix;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;
}
