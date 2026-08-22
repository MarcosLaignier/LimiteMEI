package com.limiteMEI.limiteMEI.dto.relatorio;

import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioFluxoCaixaDTO {
    private String empresa;
    private String cnpj;
    private LocalDate inicio;
    private LocalDate fim;
    private Long contaFinanceiraId;
    private String contaFinanceiraNome;
    private BigDecimal totalEntradas;
    private BigDecimal totalSaidas;
    private BigDecimal saldoPeriodo;
    private List<MovimentoFinanceiroDTO> movimentos;
}
