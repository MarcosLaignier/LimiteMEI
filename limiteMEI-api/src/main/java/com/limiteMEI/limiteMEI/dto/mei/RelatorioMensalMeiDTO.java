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
    private String nomeFantasia;
    private java.time.LocalDate dataAbertura;
    private java.time.LocalDate dataInicioSimei;
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
    private BigDecimal acumuladoAno;
    private LocalDateTime dataFechamento;
    private String usuarioFechamento;
    private ConferenciaFiscalMeiDTO conferenciaFiscal;
}
