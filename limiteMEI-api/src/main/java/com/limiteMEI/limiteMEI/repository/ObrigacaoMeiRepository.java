package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.ObrigacaoMei;
import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.enums.TipoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ObrigacaoMeiRepository extends BaseRepository<ObrigacaoMei, Long> {
    List<ObrigacaoMei> findByEmpresaIdOrderByCompetenciaDesc(Long empresaId);

    List<ObrigacaoMei> findByEmpresaIdAndCompetenciaBetweenOrderByCompetenciaAsc(Long empresaId,
                                                                                  LocalDate inicio,
                                                                                  LocalDate fim);

    Optional<ObrigacaoMei> findByIdAndEmpresaId(Long id, Long empresaId);

    boolean existsByEmpresaIdAndTipoAndCompetenciaAndIdNot(Long empresaId, TipoObrigacaoMeiEnum tipo,
                                                           LocalDate competencia, Long id);

    @Query("""
            select o from ObrigacaoMei o
            where o.empresa.id = :empresaId
              and o.situacao <> :pago
            order by o.vencimento asc
            """)
    List<ObrigacaoMei> proximasPendentes(@Param("empresaId") Long empresaId,
                                          @Param("pago") SituacaoObrigacaoMeiEnum pago);

    long countByEmpresaIdAndSituacao(Long empresaId, SituacaoObrigacaoMeiEnum situacao);
}
