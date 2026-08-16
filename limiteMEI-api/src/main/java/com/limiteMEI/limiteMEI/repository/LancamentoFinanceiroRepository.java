package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {
    List<LancamentoFinanceiro> findByEmpresaIdOrderByDataVencimentoDesc(Long empresaId);
    Optional<LancamentoFinanceiro> findByIdAndEmpresaId(Long id, Long empresaId);
}
