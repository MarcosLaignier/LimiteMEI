package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.enums.FormaPagamentoEnum;
import com.limiteMEI.limiteMEI.enums.OrigemMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.TipoFluxoCaixaEnum;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public interface MovimentoFinanceiroRepository extends BaseRepository<MovimentoFinanceiro, Long> {
    List<MovimentoFinanceiro> findByEmpresaIdOrderByDataDescIdDesc(Long empresaId);
    List<MovimentoFinanceiro> findTop8ByEmpresaIdOrderByDataDescIdDesc(Long empresaId);
    List<MovimentoFinanceiro> findByContaFinanceiraIdAndEmpresaIdOrderByDataDescIdDesc(Long contaId, Long empresaId);
    Optional<MovimentoFinanceiro> findByIdAndEmpresaId(Long id, Long empresaId);
    Optional<MovimentoFinanceiro> findByBaixaFinanceiraId(Long baixaId);
    List<MovimentoFinanceiro> findByTransferenciaIdAndEmpresaId(String transferenciaId, Long empresaId);

    @Query("select coalesce(sum(case when m.tipo = :entrada then m.valor else -m.valor end), 0) " +
            "from MovimentoFinanceiro m where m.contaFinanceira.id = :contaId and m.empresa.id = :empresaId")
    BigDecimal saldoMovimentado(@Param("contaId") Long contaId, @Param("empresaId") Long empresaId,
                                @Param("entrada") TipoFluxoCaixaEnum entrada);

    @Query("select m from MovimentoFinanceiro m where m.contaFinanceira.id = :contaId and m.empresa.id = :empresaId " +
            "and (:inicio is null or m.data >= :inicio) and (:fim is null or m.data <= :fim) order by m.data desc, m.id desc")
    List<MovimentoFinanceiro> extrato(@Param("contaId") Long contaId, @Param("empresaId") Long empresaId,
                                      @Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("select coalesce(sum(m.valor), 0) from MovimentoFinanceiro m where m.empresa.id = :empresaId " +
            "and m.tipo = :tipo and m.data between :inicio and :fim")
    BigDecimal totalPeriodo(@Param("empresaId") Long empresaId, @Param("tipo") TipoFluxoCaixaEnum tipo,
                            @Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("select m from MovimentoFinanceiro m where m.empresa.id = :empresaId " +
            "and (:contaId is null or m.contaFinanceira.id = :contaId) " +
            "and m.data between :inicio and :fim " +
            "and (:tipo is null or m.tipo = :tipo) " +
            "and (:origem is null or m.origem = :origem) " +
            "and (:formaPagamento is null or m.formaPagamento = :formaPagamento) " +
            "and (:categoriaId is null or m.categoria.id = :categoriaId) " +
            "order by m.data asc, m.id asc")
    List<MovimentoFinanceiro> relatorioFluxoCaixa(@Param("empresaId") Long empresaId,
                                                  @Param("contaId") Long contaId,
                                                  @Param("inicio") LocalDate inicio,
                                                  @Param("fim") LocalDate fim,
                                                  @Param("tipo") TipoFluxoCaixaEnum tipo,
                                                  @Param("origem") OrigemMovimentoEnum origem,
                                                  @Param("formaPagamento") FormaPagamentoEnum formaPagamento,
                                                  @Param("categoriaId") Long categoriaId);
}
