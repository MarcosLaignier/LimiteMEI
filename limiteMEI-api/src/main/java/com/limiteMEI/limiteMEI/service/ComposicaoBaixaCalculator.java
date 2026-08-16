package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ComposicaoBaixaCalculator {

    public Resultado calcular(BigDecimal valorPrincipal, BigDecimal juros, BigDecimal multa, BigDecimal desconto) {
        if (valorPrincipal == null || valorPrincipal.signum() <= 0) {
            throw new ApplicationException("O valor principal deve ser maior que zero");
        }
        juros = zero(juros);
        multa = zero(multa);
        desconto = zero(desconto);
        if (juros.signum() < 0 || multa.signum() < 0 || desconto.signum() < 0) {
            throw new ApplicationException("Juros, multa e desconto não podem ser negativos");
        }
        BigDecimal valorPago = valorPrincipal.add(juros).add(multa).subtract(desconto);
        if (valorPago.signum() <= 0) {
            throw new ApplicationException("O valor efetivamente pago deve ser maior que zero");
        }
        return new Resultado(valorPrincipal, juros, multa, desconto, valorPago);
    }

    private BigDecimal zero(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }

    public record Resultado(BigDecimal valorPrincipal, BigDecimal juros, BigDecimal multa,
                            BigDecimal desconto, BigDecimal valorPago) {
    }
}
