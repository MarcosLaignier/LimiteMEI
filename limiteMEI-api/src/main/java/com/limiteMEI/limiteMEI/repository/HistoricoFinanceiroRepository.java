package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.HistoricoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoFinanceiroRepository extends JpaRepository<HistoricoFinanceiro, Long> {
    List<HistoricoFinanceiro> findByLancamentoIdAndEmpresaIdOrderByDataHoraDesc(Long lancamentoId, Long empresaId);
}
