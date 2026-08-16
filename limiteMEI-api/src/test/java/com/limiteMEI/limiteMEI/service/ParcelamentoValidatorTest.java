package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.dto.lancamento.ParcelaLancamentoCreateDTO;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ParcelamentoValidatorTest {
    private final ParcelamentoValidator validator = new ParcelamentoValidator();

    @Test
    void deveAceitarEntradaEParcelasComSomaExata() {
        int quantidade = validator.validar(new BigDecimal("1000.00"), List.of(
                parcela("100.00", true), parcela("450.00", false), parcela("450.00", false)));

        assertEquals(2, quantidade);
    }

    @Test
    void deveRejeitarSomaDiferenteDoTotal() {
        assertThrows(ApplicationException.class, () -> validator.validar(new BigDecimal("1000.00"),
                List.of(parcela("400.00", false), parcela("500.00", false))));
    }

    @Test
    void deveRejeitarMaisDeUmaEntrada() {
        assertThrows(ApplicationException.class, () -> validator.validar(new BigDecimal("200.00"),
                List.of(parcela("100.00", true), parcela("100.00", true))));
    }

    private ParcelaLancamentoCreateDTO parcela(String valor, boolean entrada) {
        return ParcelaLancamentoCreateDTO.builder()
                .valor(new BigDecimal(valor))
                .dataCompetencia(LocalDate.of(2026, 8, 1))
                .dataVencimento(LocalDate.of(2026, 8, 10))
                .entrada(entrada)
                .build();
    }
}
