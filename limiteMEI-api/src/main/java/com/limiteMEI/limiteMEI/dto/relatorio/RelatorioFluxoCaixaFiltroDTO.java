package com.limiteMEI.limiteMEI.dto.relatorio;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoFluxoCaixaEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RelatorioFluxoCaixaFiltroDTO {
    private LocalDate inicio;
    private LocalDate fim;
    private Long contaFinanceiraId;
    private TipoFluxoCaixaEnum tipo;
    private OrigemMovimentoEnum origem;
    private FormaPagamentoEnum formaPagamento;
    private Long categoriaId;
}
