package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.SituacaoApuracaoMeiEnum;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fechamento_apuracao_mei", uniqueConstraints =
        @UniqueConstraint(name = "uk_fechamento_mei_periodo", columnNames = {"empresa_id", "ano", "mes"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FechamentoApuracaoMei {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private Integer mes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SituacaoApuracaoMeiEnum situacao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal comercioComDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal comercioSemDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal industriaComDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal industriaSemDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal servicosComDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal servicosSemDocumento;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal total;

    private LocalDateTime dataFechamento;
    private String usuarioFechamento;
    private LocalDateTime dataReabertura;
    private String usuarioReabertura;
    @Column(length = 500)
    private String motivoReabertura;
}
