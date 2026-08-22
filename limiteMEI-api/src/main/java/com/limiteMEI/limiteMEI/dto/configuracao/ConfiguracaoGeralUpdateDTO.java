package com.limiteMEI.limiteMEI.dto.configuracao;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoGeralUpdateDTO {
    private Long contaPadraoBaixaId;
    private FormaPagamentoEnum formaPagamentoPadrao;
}
