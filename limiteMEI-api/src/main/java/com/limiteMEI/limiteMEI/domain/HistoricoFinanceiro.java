package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.EventoFinanceiroEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_financeiro")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(name = "lancamento_id", nullable = false)
    private Long lancamentoId;

    @Column(name = "baixa_id")
    private Long baixaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private EventoFinanceiroEnum evento;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false, length = 150)
    private String usuario;

    @Column(nullable = false, length = 500)
    private String descricao;
}
