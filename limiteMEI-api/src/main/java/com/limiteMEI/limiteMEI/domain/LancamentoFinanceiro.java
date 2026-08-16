package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lancamento_financeiro")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pessoa_id")
    private Pessoa pessoa;

    @Column(nullable = false, length = 150)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoLancamentoEnum tipo;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataCompetencia;

    @Column(nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SituacaoLancamentoEnum situacao;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean excluido = false;

    @Column(length = 500)
    private String observacao;

    @Column(name = "data_cancelamento")
    private LocalDateTime dataCancelamento;

    @Column(name = "motivo_cancelamento", length = 500)
    private String motivoCancelamento;

    @Column(name = "usuario_cancelamento", length = 150)
    private String usuarioCancelamento;

    @Column(name = "data_exclusao")
    private LocalDateTime dataExclusao;

    @Column(name = "motivo_exclusao", length = 500)
    private String motivoExclusao;

    @Column(name = "usuario_exclusao", length = 150)
    private String usuarioExclusao;
}
