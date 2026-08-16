package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.*;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {
    List<LancamentoFinanceiro> findByEmpresaIdAndExcluidoFalseOrderByDataVencimentoDesc(Long empresaId);
    Optional<LancamentoFinanceiro> findByIdAndEmpresaId(Long id, Long empresaId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<LancamentoFinanceiro> findLockedByIdAndEmpresaId(Long id, Long empresaId);

    List<LancamentoFinanceiro> findByParcelamentoIdAndEmpresaIdAndExcluidoFalseOrderByNumeroParcela(
            String parcelamentoId, Long empresaId);

    List<LancamentoFinanceiro> findByRecorrenciaIdAndEmpresaIdAndExcluidoFalseOrderByNumeroRecorrencia(
            String recorrenciaId, Long empresaId);

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
}
