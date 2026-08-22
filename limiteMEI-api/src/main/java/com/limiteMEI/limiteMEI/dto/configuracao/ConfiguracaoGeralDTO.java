package com.limiteMEI.limiteMEI.dto.configuracao;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import lombok.*;

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
}
