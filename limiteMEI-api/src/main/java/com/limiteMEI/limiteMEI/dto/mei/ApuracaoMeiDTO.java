package com.limiteMEI.limiteMEI.dto.mei;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
import com.limiteMEI.limiteMEI.enums.SituacaoApuracaoMeiEnum;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApuracaoMeiDTO {
    private Integer ano;
    private Integer mesReferencia;
    private BigDecimal comercioMes;
    private BigDecimal industriaMes;
    private BigDecimal servicosMes;
    private BigDecimal totalMes;
    private BigDecimal comDocumentoFiscalMes;
    private BigDecimal semDocumentoFiscalMes;
    private BigDecimal acumuladoAno;
    private BigDecimal limiteAplicavel;
    private BigDecimal saldoDisponivel;
    private BigDecimal percentualUtilizado;
    private BigDecimal projecaoAnual;
    private Integer mesesLimite;
    private Integer quantidadePendencias;
    private List<ResumoMensalMeiDTO> meses;
    private List<DetalheApuracaoMeiDTO> detalhes;
    private SituacaoApuracaoMeiEnum situacaoFechamento;
    private LocalDateTime dataFechamento;
    private String usuarioFechamento;
    private String motivoReabertura;
}
