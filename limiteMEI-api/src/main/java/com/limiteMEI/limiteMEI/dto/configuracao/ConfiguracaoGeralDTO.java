package com.limiteMEI.limiteMEI.dto.configuracao;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoGeralDTO {
    private Long id;
    private Long contaPadraoBaixaId;
    private String contaPadraoBaixaNome;
    private FormaPagamentoEnum formaPagamentoPadrao;
    private BigDecimal valorPadraoDas;
}
