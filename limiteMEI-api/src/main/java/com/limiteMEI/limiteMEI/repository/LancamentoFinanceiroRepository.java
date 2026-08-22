package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum;
import com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {
    List<LancamentoFinanceiro> findByEmpresaIdAndExcluidoFalseOrderByDataVencimentoDesc(Long empresaId);
    Optional<LancamentoFinanceiro> findByIdAndEmpresaId(Long id, Long empresaId);
    List<LancamentoFinanceiro> findByEmpresaIdAndDataCompetenciaAndExcluidoFalse(Long empresaId, LocalDate dataCompetencia);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<LancamentoFinanceiro> findLockedByIdAndEmpresaId(Long id, Long empresaId);

    List<LancamentoFinanceiro> findByParcelamentoIdAndEmpresaIdAndExcluidoFalseOrderByNumeroParcela(
            String parcelamentoId, Long empresaId);

    List<LancamentoFinanceiro> findByRecorrenciaIdAndEmpresaIdAndExcluidoFalseOrderByNumeroRecorrencia(
            String recorrenciaId, Long empresaId);

    @Query("""
            select l from LancamentoFinanceiro l
            where l.empresa.id = :empresaId
              and l.excluido = false
              and (:inicio is null or l.dataVencimento >= :inicio)
              and (:fim is null or l.dataVencimento <= :fim)
              and (:tipo is null or l.tipo = :tipo)
              and (:situacao is null or l.situacao = :situacao)
              and (:categoriaId is null or l.categoria.id = :categoriaId)
              and (:pessoaId is null or l.pessoa.id = :pessoaId)
              and (:valorMin is null or l.valor >= :valorMin)
              and (:valorMax is null or l.valor <= :valorMax)
              and (:descricao is null or lower(l.descricao) like lower(concat('%', :descricao, '%')))
            order by l.dataVencimento desc, l.id desc
            """)
    List<LancamentoFinanceiro> relatorioLancamentos(@Param("empresaId") Long empresaId,
                                                     @Param("inicio") LocalDate inicio,
                                                     @Param("fim") LocalDate fim,
                                                     @Param("tipo") TipoLancamentoEnum tipo,
                                                     @Param("situacao") SituacaoLancamentoEnum situacao,
                                                     @Param("categoriaId") Long categoriaId,
                                                     @Param("pessoaId") Long pessoaId,
                                                     @Param("valorMin") BigDecimal valorMin,
                                                     @Param("valorMax") BigDecimal valorMax,
                                                     @Param("descricao") String descricao);

    @Query("""
            select l from LancamentoFinanceiro l
            join fetch l.categoria c
            where l.empresa.id = :empresaId
              and l.tipo = com.limiteMEI.limiteMEI.enums.TipoLancamentoEnum.RECEBER
              and l.dataCompetencia between :inicio and :fim
            order by l.dataCompetencia
            """)
    List<LancamentoFinanceiro> findReceitasParaApuracaoMei(@Param("empresaId") Long empresaId,
                                                            @Param("inicio") LocalDate inicio,
                                                            @Param("fim") LocalDate fim);

    @Query("select coalesce(sum(l.valor), 0) from LancamentoFinanceiro l where l.empresa.id = :empresaId " +
            "and l.tipo = :tipo and l.excluido = false and l.ativo = true " +
            "and l.situacao in (com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.ABERTO, com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.PARCIAL)")
    BigDecimal totalPendenteBruto(@Param("empresaId") Long empresaId, @Param("tipo") TipoLancamentoEnum tipo);

    @Query("select coalesce(sum(b.valorPrincipal), 0) from BaixaFinanceira b join b.lancamento l " +
            "where l.empresa.id = :empresaId and l.tipo = :tipo and l.excluido = false and l.ativo = true " +
            "and l.situacao in (com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.ABERTO, com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.PARCIAL) and b.ativo = true")
    BigDecimal totalBaixadoPendente(@Param("empresaId") Long empresaId, @Param("tipo") TipoLancamentoEnum tipo);

    @Query("select coalesce(sum(l.valor), 0) from LancamentoFinanceiro l where l.empresa.id = :empresaId " +
            "and l.tipo = :tipo and l.excluido = false and l.ativo = true and l.dataVencimento < :hoje " +
            "and l.situacao in (com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.ABERTO, com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.PARCIAL)")
    BigDecimal totalVencidoBruto(@Param("empresaId") Long empresaId, @Param("tipo") TipoLancamentoEnum tipo,
                                 @Param("hoje") LocalDate hoje);

    @Query("select coalesce(sum(b.valorPrincipal), 0) from BaixaFinanceira b join b.lancamento l " +
            "where l.empresa.id = :empresaId and l.tipo = :tipo and l.excluido = false and l.ativo = true " +
            "and l.dataVencimento < :hoje and l.situacao in (com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.ABERTO, com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.PARCIAL) and b.ativo = true")
    BigDecimal totalBaixadoVencido(@Param("empresaId") Long empresaId, @Param("tipo") TipoLancamentoEnum tipo,
                                   @Param("hoje") LocalDate hoje);

    @Query("select count(l) from LancamentoFinanceiro l where l.empresa.id = :empresaId and l.excluido = false " +
            "and l.ativo = true and l.dataVencimento < :hoje and l.situacao in " +
            "(com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.ABERTO, com.limiteMEI.limiteMEI.enums.SituacaoLancamentoEnum.PARCIAL)")
    long quantidadeVencidos(@Param("empresaId") Long empresaId, @Param("hoje") LocalDate hoje);
}
