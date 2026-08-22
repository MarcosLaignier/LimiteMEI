package com.limiteMEI.limiteMEI.dto.mei;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteDTO;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoApuracaoMeiDTO {
    private Integer ano;
    private BigDecimal limiteAplicavel;
    private BigDecimal totalAno;
    private BigDecimal percentualUtilizado;
    private ConfiguracaoAlertaLimiteDTO alertaLimite;
    private List<HistoricoApuracaoMeiItemDTO> meses;
}
