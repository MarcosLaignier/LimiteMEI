package com.limiteMEI.limiteMEI.dto.lancamento;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoFinanceiroCreateDTO {
    @NotBlank
    private String descricao;
    @NotNull
    private TipoLancamentoEnum tipo;
    @NotNull
    private Long categoriaId;
    private Long pessoaId;
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal valor;
    @NotNull
    private LocalDate dataCompetencia;
    @NotNull
    private LocalDate dataVencimento;
    private Boolean ativo;
    private String observacao;

    private Boolean baixarAutomaticamente;

    private LocalDate dataLiquidacao;

    private FormaPagamentoEnum formaPagamento;

    private Long contaFinanceiraId;
}
