package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.DocumentoFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DocumentoFiscalRepository extends JpaRepository<DocumentoFiscal, Long> {
    List<DocumentoFiscal> findByEmpresaIdAndExcluidoFalseOrderByDataEmissaoDescIdDesc(Long empresaId);
    List<DocumentoFiscal> findByEmpresaIdAndDataEmissaoBetweenAndExcluidoFalseOrderByDataEmissaoAscIdAsc(
            Long empresaId, java.time.LocalDate inicio, java.time.LocalDate fim);
    Optional<DocumentoFiscal> findByIdAndEmpresaIdAndExcluidoFalse(Long id, Long empresaId);
    boolean existsByEmpresaIdAndNumeroIgnoreCaseAndSerieIgnoreCaseAndExcluidoFalseAndIdNot(
            Long empresaId, String numero, String serie, Long id);
    boolean existsByEmpresaIdAndChaveAcessoIgnoreCaseAndExcluidoFalse(Long empresaId, String chaveAcesso);
}
