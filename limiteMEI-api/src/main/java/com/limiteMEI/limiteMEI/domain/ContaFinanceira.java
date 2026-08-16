package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.TipoContaFinanceiraEnum;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "conta_financeira")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContaFinanceira {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoContaFinanceiraEnum tipo;

    @Column(length = 100)
    private String instituicao;

    @Column(length = 20)
    private String agencia;

    @Column(length = 30)
    private String numeroConta;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal saldoInicial;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;
}
