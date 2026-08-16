package com.limiteMEI.limiteMEI.dto.movimento;

import com.limiteMEI.limiteMEI.enums.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoFinanceiroDTO {
    private Long id;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;
    private TipoFluxoCaixaEnum tipo;
    private OrigemMovimentoEnum origem;
    private FormaPagamentoEnum formaPagamento;
    private Long contaFinanceiraId;
    private String contaFinanceiraNome;
    private Long categoriaId;
    private String categoriaNome;
    private Long baixaFinanceiraId;
    private String transferenciaId;
    private String observacao;
    private Boolean editavel;
    private Boolean estornado;
    private Long movimentoOrigemId;
}
