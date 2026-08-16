package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.dto.lancamento.RecorrenciaLancamentoCreateDTO;
import com.limiteMEI.limiteMEI.enums.PeriodicidadeRecorrenciaEnum;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RecorrenciaValidatorTest {
    private final RecorrenciaValidator validator = new RecorrenciaValidator();

    @Test
    void deveAceitarDuasOuMaisOcorrencias() {
        assertDoesNotThrow(() -> validator.validar(PeriodicidadeRecorrenciaEnum.MENSAL,
                List.of(ocorrencia(), ocorrencia())));
    }

    @Test
    void deveExigirPeriodicidade() {
        assertThrows(ApplicationException.class, () -> validator.validar(null,
                List.of(ocorrencia(), ocorrencia())));
    }

    @Test
    void deveExigirAoMenosDuasOcorrencias() {
        assertThrows(ApplicationException.class, () -> validator.validar(
                PeriodicidadeRecorrenciaEnum.MENSAL, List.of(ocorrencia())));
    }

    private RecorrenciaLancamentoCreateDTO ocorrencia() {
        return RecorrenciaLancamentoCreateDTO.builder()
                .valor(new BigDecimal("100.00"))
                .dataCompetencia(LocalDate.of(2026, 8, 1))
                .dataVencimento(LocalDate.of(2026, 8, 10))
                .build();
    }
}
