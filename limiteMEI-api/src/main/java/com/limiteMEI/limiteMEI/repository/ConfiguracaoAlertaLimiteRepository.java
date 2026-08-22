package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.ConfiguracaoAlertaLimite;
import com.limiteMEI.limiteMEI.utils.BaseRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ConfiguracaoAlertaLimiteRepository extends BaseRepository<ConfiguracaoAlertaLimite, Long> {
    List<ConfiguracaoAlertaLimite> findByEmpresaIdOrderByPercentual(Long empresaId);

    Optional<ConfiguracaoAlertaLimite> findByIdAndEmpresaId(Long id, Long empresaId);

    boolean existsByEmpresaIdAndPercentual(Long empresaId, BigDecimal percentual);
}
