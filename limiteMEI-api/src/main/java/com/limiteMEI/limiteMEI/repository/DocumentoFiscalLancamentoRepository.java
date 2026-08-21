package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.DocumentoFiscalLancamento;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.*;

public interface DocumentoFiscalLancamentoRepository extends JpaRepository<DocumentoFiscalLancamento, Long> {
    @Query("select coalesce(sum(v.valorVinculado), 0) from DocumentoFiscalLancamento v " +
            "where v.lancamento.id = :lancamentoId and v.documentoFiscal.excluido = false " +
            "and v.documentoFiscal.situacao = com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum.EMITIDO " +
            "and v.documentoFiscal.id <> :documentoId")
    BigDecimal totalVinculadoEmOutrosDocumentos(@Param("lancamentoId") Long lancamentoId,
                                                 @Param("documentoId") Long documentoId);

    @Query("select count(v) > 0 from DocumentoFiscalLancamento v where v.lancamento.id = :lancamentoId " +
            "and v.documentoFiscal.excluido = false and v.documentoFiscal.situacao = " +
            "com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum.EMITIDO")
    boolean possuiDocumentoEmitido(@Param("lancamentoId") Long lancamentoId);

    List<DocumentoFiscalLancamento> findByLancamentoId(Long lancamentoId);

    Optional<DocumentoFiscalLancamento> findFirstByLancamentoIdAndDocumentoFiscalExcluidoFalseAndDocumentoFiscalSituacaoOrderById(
            Long lancamentoId, com.limiteMEI.limiteMEI.enums.SituacaoDocumentoFiscalEnum situacao);
}
