package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import java.util.*;

public interface ContaFinanceiraRepository extends BaseRepository<ContaFinanceira, Long> {
    List<ContaFinanceira> findByEmpresaIdOrderByNome(Long empresaId);
    Optional<ContaFinanceira> findByIdAndEmpresaId(Long id, Long empresaId);
    boolean existsByEmpresaIdAndNomeIgnoreCaseAndIdNot(Long empresaId, String nome, Long id);
}
