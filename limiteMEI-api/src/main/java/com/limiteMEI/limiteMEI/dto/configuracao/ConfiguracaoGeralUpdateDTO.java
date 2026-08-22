package com.limiteMEI.limiteMEI.dto.configuracao;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoGeralUpdateDTO {
    private Long contaPadraoBaixaId;
    private FormaPagamentoEnum formaPagamentoPadrao;
    private BigDecimal valorPadraoDas;
}
