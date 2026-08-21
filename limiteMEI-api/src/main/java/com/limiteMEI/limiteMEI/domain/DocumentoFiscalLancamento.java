package com.limiteMEI.limiteMEI.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "documento_fiscal_lancamento", uniqueConstraints =
        @UniqueConstraint(name = "uk_documento_lancamento", columnNames = {"documento_fiscal_id", "lancamento_id"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoFiscalLancamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documento_fiscal_id", nullable = false)
    private DocumentoFiscal documentoFiscal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lancamento_id", nullable = false)
    private LancamentoFinanceiro lancamento;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorVinculado;
}
