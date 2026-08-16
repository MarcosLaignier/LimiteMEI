package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.dto.lancamento.RecorrenciaLancamentoCreateDTO;
import com.limiteMEI.limiteMEI.enums.PeriodicidadeRecorrenciaEnum;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RecorrenciaValidator {

    public void validar(PeriodicidadeRecorrenciaEnum periodicidade,
                        List<RecorrenciaLancamentoCreateDTO> ocorrencias) {
        if (periodicidade == null) {
            throw new ApplicationException("Informe a periodicidade da recorrência");
        }
        if (ocorrencias == null || ocorrencias.size() < 2) {
            throw new ApplicationException("A recorrência deve possuir ao menos duas ocorrências");
        }
        if (ocorrencias.stream().anyMatch(item -> item.getValor() == null || item.getValor().signum() <= 0
                || item.getDataCompetencia() == null || item.getDataVencimento() == null)) {
            throw new ApplicationException("Todas as ocorrências devem possuir valor, competência e vencimento");
        }
    }
}
