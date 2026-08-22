package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.DocumentoFiscal;
import com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum;
import com.limiteMEI.limiteMEI.enums.TipoDocumentoFiscalEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;
import java.time.LocalDate;

public interface DocumentoFiscalRepository extends JpaRepository<DocumentoFiscal, Long> {
    List<DocumentoFiscal> findByEmpresaIdAndExcluidoFalseOrderByDataEmissaoDescIdDesc(Long empresaId);
    List<DocumentoFiscal> findByEmpresaIdAndDataEmissaoBetweenAndExcluidoFalseOrderByDataEmissaoAscIdAsc(
            Long empresaId, java.time.LocalDate inicio, java.time.LocalDate fim);
    @Query("""
            select d from DocumentoFiscal d
            left join d.cliente c
            where d.empresa.id = :empresaId
              and d.excluido = false
              and (:inicio is null or d.dataEmissao >= :inicio)
              and (:fim is null or d.dataEmissao <= :fim)
              and (:tipo is null or d.tipo = :tipo)
              and (:situacao is null or d.situacao = :situacao)
              and (:cliente is null or lower(c.nomeRazaoSocial) like lower(concat('%', :cliente, '%')))
            order by d.dataEmissao desc, d.id desc
            """)
    List<DocumentoFiscal> relatorioDocumentos(@Param("empresaId") Long empresaId,
                                               @Param("inicio") LocalDate inicio,
                                               @Param("fim") LocalDate fim,
                                               @Param("tipo") TipoDocumentoFiscalEnum tipo,
                                               @Param("situacao") SituacaoDocumentoFiscalEnum situacao,
                                               @Param("cliente") String cliente);
    Optional<DocumentoFiscal> findByIdAndEmpresaIdAndExcluidoFalse(Long id, Long empresaId);
    boolean existsByEmpresaIdAndNumeroIgnoreCaseAndSerieIgnoreCaseAndExcluidoFalseAndIdNot(
            Long empresaId, String numero, String serie, Long id);
    boolean existsByEmpresaIdAndChaveAcessoIgnoreCaseAndExcluidoFalse(Long empresaId, String chaveAcesso);
}
