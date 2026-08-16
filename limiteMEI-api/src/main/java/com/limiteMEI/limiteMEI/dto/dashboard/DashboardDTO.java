package com.limiteMEI.limiteMEI.dto.dashboard;

import com.limiteMEI.limiteMEI.dto.mei.ApuracaoMeiDTO;
import com.limiteMEI.limiteMEI.dto.movimento.MovimentoFinanceiroDTO;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private String empresa;
    private Integer ano;
    private Integer mes;
    private BigDecimal saldoTotal;
    private BigDecimal entradasMes;
    private BigDecimal saidasMes;
    private BigDecimal contasReceber;
    private BigDecimal contasPagar;
    private BigDecimal vencidoReceber;
    private BigDecimal vencidoPagar;
    private Integer quantidadeVencidos;
    private List<DashboardContaDTO> contas;
    private List<MovimentoFinanceiroDTO> ultimasMovimentacoes;
    private ApuracaoMeiDTO mei;
}
