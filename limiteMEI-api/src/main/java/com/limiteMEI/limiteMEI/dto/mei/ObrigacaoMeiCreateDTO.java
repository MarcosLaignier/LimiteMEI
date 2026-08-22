package com.limiteMEI.limiteMEI.dto.mei;

import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.enums.TipoObrigacaoMeiEnum;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObrigacaoMeiCreateDTO {
    private TipoObrigacaoMeiEnum tipo;

    @NotNull
    private LocalDate competencia;

    private SituacaoObrigacaoMeiEnum situacao;

    private BigDecimal valor;

    private LocalDate dataPagamento;

    private String observacao;
}
