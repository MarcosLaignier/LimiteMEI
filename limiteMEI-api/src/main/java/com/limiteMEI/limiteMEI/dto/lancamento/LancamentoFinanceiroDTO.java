package com.limiteMEI.limiteMEI.dto.lancamento;

import com.limiteMEI.limiteMEI.enums.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoFinanceiroDTO {
    private Long id;
    private String descricao;
    private TipoLancamentoEnum tipo;
    private Long categoriaId;
    private String categoriaNome;
    private Long pessoaId;
    private String pessoaNome;
    private BigDecimal valor;
    private BigDecimal valorLiquidado;
    private BigDecimal saldoAberto;
    private LocalDate dataCompetencia;
    private LocalDate dataVencimento;
    private SituacaoLancamentoEnum situacao;
    private Boolean ativo;
    private String observacao;
    private LocalDateTime dataCancelamento;
    private String motivoCancelamento;
    private String usuarioCancelamento;
}
