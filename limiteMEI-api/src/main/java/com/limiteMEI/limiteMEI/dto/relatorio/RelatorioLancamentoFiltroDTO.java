package com.limiteMEI.limiteMEI.dto.relatorio;

import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class RelatorioLancamentoFiltroDTO {
    private LocalDate inicio;
    private LocalDate fim;
    private TipoLancamentoEnum tipo;
    private SituacaoLancamentoEnum situacao;
    private Long categoriaId;
    private Long pessoaId;
    private BigDecimal valorMin;
    private BigDecimal valorMax;
    private String descricao;
}
