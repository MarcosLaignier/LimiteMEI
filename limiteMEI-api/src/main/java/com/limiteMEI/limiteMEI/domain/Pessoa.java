package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum;
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

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;
}
