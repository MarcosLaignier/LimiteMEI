package com.limiteMEI.limiteMEI.dto.lancamento;

import com.limiteMEI.limiteMEI.enums.EventoFinanceiroEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoFinanceiroDTO {
    private Long id;
    private Long lancamentoId;
    private Long baixaId;
    private EventoFinanceiroEnum evento;
    private LocalDateTime dataHora;
    private String usuario;
    private String descricao;
}
