package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.dto.lancamento.ParcelaLancamentoCreateDTO;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ParcelamentoValidator {

    public int validar(BigDecimal valorTotal, List<ParcelaLancamentoCreateDTO> itens) {
        if (itens == null || itens.size() < 2) {
            throw new ApplicationException("O parcelamento deve possuir ao menos duas parcelas ou entrada e parcela");
        }
        long entradas = itens.stream().filter(item -> Boolean.TRUE.equals(item.getEntrada())).count();
        if (entradas > 1) {
            throw new ApplicationException("O parcelamento permite somente uma entrada");
        }
        if (itens.stream().anyMatch(item -> item.getValor() == null || item.getValor().signum() <= 0
                || item.getDataCompetencia() == null || item.getDataVencimento() == null)) {
            throw new ApplicationException("Todas as parcelas devem possuir valor, competência e vencimento");
        }
        BigDecimal total = itens.stream().map(ParcelaLancamentoCreateDTO::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (valorTotal == null || total.compareTo(valorTotal) != 0) {
            throw new ApplicationException("A soma da entrada e das parcelas deve ser igual ao valor total");
        }
        return (int) itens.stream().filter(item -> !Boolean.TRUE.equals(item.getEntrada())).count();
    }
}
