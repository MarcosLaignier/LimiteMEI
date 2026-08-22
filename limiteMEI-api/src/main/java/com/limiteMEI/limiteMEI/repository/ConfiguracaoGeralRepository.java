package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.ConfiguracaoGeral;
import com.limiteMEI.limiteMEI.utils.BaseRepository;

import java.util.Optional;

public interface ConfiguracaoGeralRepository extends BaseRepository<ConfiguracaoGeral, Long> {
    Optional<ConfiguracaoGeral> findByEmpresaId(Long empresaId);
}
