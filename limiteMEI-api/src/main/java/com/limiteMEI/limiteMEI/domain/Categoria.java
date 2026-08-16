package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.enums.ExigenciaPessoaEnum;
import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categoria")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoMovimentoEnum tipo;

    @Enumerated(EnumType.STRING)
    private NaturezaReceitaEnum naturezaReceita;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExigenciaPessoaEnum exigenciaPessoa = ExigenciaPessoaEnum.NAO_UTILIZA;

    @Enumerated(EnumType.STRING)
    private PapelPessoaEnum papelPessoa;

    @Builder.Default
    private Boolean compoeFaturamentoMei = false;

    @Builder.Default
    private Boolean exigeDocumentoFiscal = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

}
