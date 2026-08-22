package com.limiteMEI.limiteMEI.dto.mei;

import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.enums.TipoObrigacaoMeiEnum;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObrigacaoMeiDTO {
    private Long id;
    private TipoObrigacaoMeiEnum tipo;
    private LocalDate competencia;
    private LocalDate vencimento;
    private SituacaoObrigacaoMeiEnum situacao;
    private BigDecimal valor;
    private LocalDate dataPagamento;
    private String observacao;
    private Boolean possuiComprovante;
    private String comprovanteNome;
}
