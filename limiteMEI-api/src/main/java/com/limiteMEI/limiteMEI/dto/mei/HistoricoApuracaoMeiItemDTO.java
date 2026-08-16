package com.limiteMEI.limiteMEI.dto.mei;

import com.limiteMEI.limiteMEI.enums.SituacaoApuracaoMeiEnum;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoApuracaoMeiItemDTO {
    private Integer mes;
    private BigDecimal totalMes;
    private BigDecimal acumuladoAno;
    private BigDecimal percentualUtilizado;
    private SituacaoApuracaoMeiEnum situacao;
    private LocalDateTime dataFechamento;
    private String usuarioFechamento;
}
