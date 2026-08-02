package com.limiteMEI.limiteMEI.repository;
import com.limiteMEI.limiteMEI.domain.Funcionario; import com.limiteMEI.limiteMEI.utils.BaseRepository; import java.util.*;
public interface FuncionarioRepository extends BaseRepository<Funcionario,Long> {
 List<Funcionario> findByPessoaEmpresaId(Long empresaId); Optional<Funcionario> findByIdAndPessoaEmpresaId(Long id,Long empresaId); boolean existsByPessoaId(Long pessoaId);
}
