package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.*;

public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {
    List<LancamentoFinanceiro> findByEmpresaIdAndExcluidoFalseOrderByDataVencimentoDesc(Long empresaId);
    Optional<LancamentoFinanceiro> findByIdAndEmpresaId(Long id, Long empresaId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<LancamentoFinanceiro> findLockedByIdAndEmpresaId(Long id, Long empresaId);
}
