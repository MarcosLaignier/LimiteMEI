package com.limiteMEI.limiteMEI.dto.mei;

import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalheApuracaoMeiDTO {
    private Long lancamentoId;
    private String descricao;
    private String categoria;
    private NaturezaReceitaEnum natureza;
    private LocalDate competencia;
    private BigDecimal valor;
    private Boolean documentoFiscalEmitido;
    private Boolean incluido;
    private String motivoNaoInclusao;
    private Boolean pendenciaFiscal;
    private String descricaoPendencia;
}
