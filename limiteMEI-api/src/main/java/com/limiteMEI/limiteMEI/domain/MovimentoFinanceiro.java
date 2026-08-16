package com.limiteMEI.limiteMEI.domain;


import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoFluxoCaixaEnum;
import com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimentos_financeiros")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimentoFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoFluxoCaixaEnum tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrigemMovimentoEnum origem;

    @Enumerated(EnumType.STRING)
    private FormaPagamentoEnum formaPagamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_financeira_id", nullable = false)
    private ContaFinanceira contaFinanceira;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baixa_financeira_id", unique = true)
    private BaixaFinanceira baixaFinanceira;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimento_origem_id")
    private MovimentoFinanceiro movimentoOrigem;

    @Column(nullable = false)
    @Builder.Default
    private Boolean estornado = false;

    @Column(name = "transferencia_id", length = 36)
    private String transferenciaId;

    @Column(length = 500)
    private String observacao;

}
