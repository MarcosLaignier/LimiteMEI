package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.enums.SituacaoApuracaoMeiEnum;
import com.limiteMEI.limiteMEI.repository.FechamentoApuracaoMeiRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PeriodoOperacionalService {
    private final FechamentoApuracaoMeiRepository fechamentos;

    public PeriodoOperacionalService(FechamentoApuracaoMeiRepository fechamentos) {
        this.fechamentos = fechamentos;
    }

    public void validarAberto(Empresa empresa, LocalDate competencia, String contexto) {
        if (empresa == null || competencia == null) {
            return;
        }
        boolean fechado = fechamentos.findByEmpresaIdAndAnoAndMes(
                        empresa.getId(),
                        competencia.getYear(),
                        competencia.getMonthValue())
                .map(item -> item.getSituacao() == SituacaoApuracaoMeiEnum.FECHADA)
                .orElse(false);
        if (fechado) {
            throw new ApplicationException("A competência " + formatarCompetencia(competencia)
                    + " está fechada. Reabra a apuração antes de " + contexto + ".");
        }
    }

    private String formatarCompetencia(LocalDate competencia) {
        return String.format("%02d/%d", competencia.getMonthValue(), competencia.getYear());
    }
}
