package com.limiteMEI.limiteMEI.repository;
import com.limiteMEI.limiteMEI.domain.PessoaPapel; import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum; import com.limiteMEI.limiteMEI.enums.TipoPessoaEnum; import com.limiteMEI.limiteMEI.utils.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface PessoaPapelRepository extends BaseRepository<PessoaPapel,Long> {
 boolean existsByPessoaIdAndPapel(Long pessoaId,PapelPessoaEnum papel);
 boolean existsByPessoaIdAndPapelAndAtivoTrue(Long pessoaId,PapelPessoaEnum papel);
 List<PessoaPapel> findByPessoaEmpresaIdAndPapelAndAtivoTrue(Long empresaId,PapelPessoaEnum papel);
 @Query("""
        select pp from PessoaPapel pp
        join fetch pp.pessoa p
        where p.empresa.id = :empresaId
          and pp.papel = :papel
          and pp.ativo = true
          and p.ativo = true
          and (:nome is null or lower(p.nomeRazaoSocial) like lower(concat('%', :nome, '%')))
          and (:documento is null or lower(p.cpfCnpj) like lower(concat('%', :documento, '%')))
          and (:tipoPessoa is null or p.tipoPessoa = :tipoPessoa)
        order by p.nomeRazaoSocial
        """)
 List<PessoaPapel> relatorioPessoas(@Param("empresaId") Long empresaId,
                                     @Param("papel") PapelPessoaEnum papel,
                                     @Param("nome") String nome,
                                     @Param("documento") String documento,
                                     @Param("tipoPessoa") TipoPessoaEnum tipoPessoa);
 Set<PessoaPapel> findByPessoaId(Long pessoaId);
}
