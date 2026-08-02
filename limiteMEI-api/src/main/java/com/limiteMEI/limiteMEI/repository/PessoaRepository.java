package com.limiteMEI.limiteMEI.repository;
import com.limiteMEI.limiteMEI.domain.Pessoa; import com.limiteMEI.limiteMEI.utils.BaseRepository;
import java.util.*;
import org.springframework.data.jpa.repository.Query; import org.springframework.data.repository.query.Param;
public interface PessoaRepository extends BaseRepository<Pessoa,Long> {
 List<Pessoa> findByEmpresaIdOrderByNomeRazaoSocial(Long empresaId);
 Optional<Pessoa> findByIdAndEmpresaId(Long id,Long empresaId);
 boolean existsByEmpresaIdAndCpfCnpjIgnoreCaseAndIdNot(Long empresaId,String documento,Long id);
 @Query("select p from Pessoa p where p.empresa.id=:empresaId and p.ativo=true and (lower(p.nomeRazaoSocial) like lower(concat('%',:termo,'%')) or lower(coalesce(p.cpfCnpj,'')) like lower(concat('%',:termo,'%'))) order by p.nomeRazaoSocial")
 List<Pessoa> pesquisar(@Param("empresaId") Long empresaId,@Param("termo") String termo);
}
