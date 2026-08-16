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
public class RelatorioMensalMeiDTO {
    private String cnpj;
    private String razaoSocial;
    private Integer ano;
    private Integer mes;
    private SituacaoApuracaoMeiEnum situacao;
    private BigDecimal comercioComDocumento;
    private BigDecimal comercioSemDocumento;
    private BigDecimal industriaComDocumento;
    private BigDecimal industriaSemDocumento;
    private BigDecimal servicosComDocumento;
    private BigDecimal servicosSemDocumento;
    private BigDecimal total;
    private LocalDateTime dataFechamento;
    private String usuarioFechamento;
}
