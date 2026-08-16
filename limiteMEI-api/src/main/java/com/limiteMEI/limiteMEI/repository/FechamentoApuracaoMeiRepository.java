package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.FechamentoApuracaoMei;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface FechamentoApuracaoMeiRepository extends JpaRepository<FechamentoApuracaoMei, Long> {
    Optional<FechamentoApuracaoMei> findByEmpresaIdAndAnoAndMes(Long empresaId, Integer ano, Integer mes);
    List<FechamentoApuracaoMei> findByEmpresaIdAndAnoOrderByMes(Long empresaId, Integer ano);
}
