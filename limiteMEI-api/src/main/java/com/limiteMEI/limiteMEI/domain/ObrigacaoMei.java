package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.enums.TipoObrigacaoMeiEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "obrigacao_mei",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_obrigacao_mei_empresa_tipo_competencia",
                columnNames = {"empresa_id", "tipo", "competencia"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObrigacaoMei {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoObrigacaoMeiEnum tipo;

    @Column(nullable = false)
    private LocalDate competencia;

    @Column(nullable = false)
    private LocalDate vencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SituacaoObrigacaoMeiEnum situacao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    private LocalDate dataPagamento;

    @Column(length = 1000)
    private String observacao;

    private String comprovanteNome;

    private String comprovanteContentType;

    @Lob
    private byte[] comprovanteConteudo;
}
