package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "baixa_financeira")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaixaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lancamento_id", nullable = false)
    private LancamentoFinanceiro lancamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_financeira_id")
    private ContaFinanceira contaFinanceira;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataLiquidacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormaPagamentoEnum formaPagamento;

    @Column(length = 500)
    private String observacao;
}
