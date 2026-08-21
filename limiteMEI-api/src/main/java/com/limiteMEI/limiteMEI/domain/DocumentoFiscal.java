package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "documento_fiscal", indexes = {
        @Index(name = "idx_documento_fiscal_empresa_emissao", columnList = "empresa_id, data_emissao")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Pessoa cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoDocumentoFiscalEnum tipo;

    @Column(nullable = false, length = 50)
    private String numero;

    @Column(length = 20)
    private String serie;

    @Column(length = 60)
    private String chaveAcesso;

    @Column(nullable = false)
    private LocalDate dataEmissao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SituacaoDocumentoFiscalEnum situacao;

    @Column(length = 500)
    private String observacao;

    @Column(nullable = false)
    @Builder.Default
    private Boolean excluido = false;

    @OneToMany(mappedBy = "documentoFiscal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DocumentoFiscalLancamento> vinculos = new ArrayList<>();
}
