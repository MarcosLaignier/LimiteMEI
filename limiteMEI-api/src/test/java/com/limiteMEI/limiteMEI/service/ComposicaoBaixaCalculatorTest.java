package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ComposicaoBaixaCalculatorTest {
    private final ComposicaoBaixaCalculator calculadora = new ComposicaoBaixaCalculator();

    @Test
    void deveCalcularValorEfetivamentePago() {
        ComposicaoBaixaCalculator.Resultado resultado = calculadora.calcular(
                new BigDecimal("1000.00"), new BigDecimal("20.00"),
                new BigDecimal("30.00"), new BigDecimal("10.00"));

        assertEquals(new BigDecimal("1040.00"), resultado.valorPago());
    }

    @Test
    void deveNormalizarAcrescimosENegociacaoNaoInformados() {
        ComposicaoBaixaCalculator.Resultado resultado = calculadora.calcular(
                new BigDecimal("100.00"), null, null, null);

        assertEquals(BigDecimal.ZERO, resultado.juros());
        assertEquals(BigDecimal.ZERO, resultado.multa());
        assertEquals(BigDecimal.ZERO, resultado.desconto());
        assertEquals(new BigDecimal("100.00"), resultado.valorPago());
    }

    @Test
    void deveImpedirValorEfetivamentePagoNaoPositivo() {
        assertThrows(ApplicationException.class, () -> calculadora.calcular(
                new BigDecimal("100.00"), BigDecimal.ZERO, BigDecimal.ZERO,
                new BigDecimal("100.00")));
    }
}
