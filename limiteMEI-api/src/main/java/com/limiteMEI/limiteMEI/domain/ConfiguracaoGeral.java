package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "configuracao_geral")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoGeral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false, unique = true)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_padrao_baixa_id")
    private ContaFinanceira contaPadraoBaixa;

    @Enumerated(EnumType.STRING)
    private FormaPagamentoEnum formaPagamentoPadrao;

    @Column(precision = 15, scale = 2)
    private BigDecimal valorPadraoDas;
}
