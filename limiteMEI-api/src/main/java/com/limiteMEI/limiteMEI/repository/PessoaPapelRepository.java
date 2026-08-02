package com.limiteMEI.limiteMEI.repository;
import com.limiteMEI.limiteMEI.domain.PessoaPapel; import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum; import com.limiteMEI.limiteMEI.utils.BaseRepository;
import java.util.*;
public interface PessoaPapelRepository extends BaseRepository<PessoaPapel,Long> {
 boolean existsByPessoaIdAndPapel(Long pessoaId,PapelPessoaEnum papel);
 List<PessoaPapel> findByPessoaEmpresaIdAndPapelAndAtivoTrue(Long empresaId,PapelPessoaEnum papel);
 Set<PessoaPapel> findByPessoaId(Long pessoaId);
}
