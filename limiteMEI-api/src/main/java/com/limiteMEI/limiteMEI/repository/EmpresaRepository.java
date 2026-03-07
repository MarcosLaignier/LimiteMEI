package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EmpresaRepository extends BaseRepository<Empresa, Long> {

    Optional<Empresa> findByCnpj(String cnpj);

    List<Empresa> findByUsuarioId(Long usuarioId);

}