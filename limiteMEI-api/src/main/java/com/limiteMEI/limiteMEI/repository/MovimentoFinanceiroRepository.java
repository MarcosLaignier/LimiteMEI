package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.MovimentoFinanceiro;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimentoFinanceiroRepository extends BaseRepository<MovimentoFinanceiro, Long> {

    List<MovimentoFinanceiro> findByEmpresaId(Long empresaId);

    List<MovimentoFinanceiro> findByCategoriaId(Long categoriaId);

}