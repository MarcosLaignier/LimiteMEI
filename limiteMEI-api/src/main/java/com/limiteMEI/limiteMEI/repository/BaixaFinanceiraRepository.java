package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.BaixaFinanceira;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.*;

public interface BaixaFinanceiraRepository extends JpaRepository<BaixaFinanceira, Long> {
    List<BaixaFinanceira> findByLancamentoIdOrderByDataLiquidacaoDesc(Long lancamentoId);
    Optional<BaixaFinanceira> findByIdAndLancamentoEmpresaId(Long id, Long empresaId);

    @Query("select coalesce(sum(b.valorPrincipal), 0) from BaixaFinanceira b where b.lancamento.id = :lancamentoId and b.ativo = true")
    BigDecimal totalPorLancamento(@Param("lancamentoId") Long lancamentoId);

    boolean existsByLancamentoIdAndAtivoTrue(Long lancamentoId);
}
