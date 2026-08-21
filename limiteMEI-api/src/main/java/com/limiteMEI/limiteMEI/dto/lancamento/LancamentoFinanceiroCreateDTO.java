package com.limiteMEI.limiteMEI.dto.lancamento;

import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum;
import com.limiteMEI.limiteMEI.enums.PeriodicidadeRecorrenciaEnum;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    private Boolean documentoFiscalEmitido;
    private Long documentoFiscalId;
    private BigDecimal valorDocumentoFiscal;

    private Boolean baixarAutomaticamente;

    private LocalDate dataLiquidacao;

    private FormaPagamentoEnum formaPagamento;

    private Long contaFinanceiraId;

    @Valid
    private List<ParcelaLancamentoCreateDTO> parcelas;

    private PeriodicidadeRecorrenciaEnum periodicidadeRecorrencia;

    @Valid
    private List<RecorrenciaLancamentoCreateDTO> recorrencias;
}
