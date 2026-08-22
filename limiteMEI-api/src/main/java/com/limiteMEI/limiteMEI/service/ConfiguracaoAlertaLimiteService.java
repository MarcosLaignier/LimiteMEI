package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.ConfiguracaoAlertaLimite;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteDTO;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteUpdateDTO;
import com.limiteMEI.limiteMEI.enums.FaixaAlertaMeiEnum;
import com.limiteMEI.limiteMEI.repository.ConfiguracaoAlertaLimiteRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class ConfiguracaoAlertaLimiteService {
    private static final BigDecimal ALERTA_70 = new BigDecimal("70.00");
    private static final BigDecimal ALERTA_75 = new BigDecimal("75.00");
    private static final BigDecimal ALERTA_80 = new BigDecimal("80.00");
    private static final BigDecimal ALERTA_90 = new BigDecimal("90.00");
    private static final BigDecimal ALERTA_100 = new BigDecimal("100.00");
    private static final BigDecimal ALERTA_120 = new BigDecimal("120.00");
    private static final List<BigDecimal> PADROES = List.of(ALERTA_70, ALERTA_75, ALERTA_80, ALERTA_90, ALERTA_100, ALERTA_120);
    private static final Set<BigDecimal> OBRIGATORIOS = Set.of(ALERTA_100, ALERTA_120);

    private final ConfiguracaoAlertaLimiteRepository repository;
    private final EmpresaAtualService empresaAtual;

    public ConfiguracaoAlertaLimiteService(ConfiguracaoAlertaLimiteRepository repository,
                                           EmpresaAtualService empresaAtual) {
        this.repository = repository;
        this.empresaAtual = empresaAtual;
    }

    @Transactional
    public List<ConfiguracaoAlertaLimiteDTO> listar() {
        Empresa empresa = empresaAtual.get();
        garantirPadroes(empresa);
        return repository.findByEmpresaIdOrderByPercentual(empresa.getId()).stream().map(this::toDTO).toList();
    }

    @Transactional
    public List<ConfiguracaoAlertaLimiteDTO> atualizar(List<ConfiguracaoAlertaLimiteUpdateDTO> dtos) {
        Empresa empresa = empresaAtual.get();
        garantirPadroes(empresa);
        if (dtos == null || dtos.isEmpty()) {
            throw new ApplicationException("Informe ao menos um alerta de limite");
        }
        validarDuplicidade(dtos);

        Map<Long, ConfiguracaoAlertaLimite> existentes = new HashMap<>();
        repository.findByEmpresaIdOrderByPercentual(empresa.getId())
                .forEach(item -> existentes.put(item.getId(), item));

        for (ConfiguracaoAlertaLimiteUpdateDTO dto : dtos) {
            BigDecimal percentual = normalizar(dto.getPercentual());
            boolean obrigatorio = OBRIGATORIOS.contains(percentual);
            ConfiguracaoAlertaLimite alerta = dto.getId() == null ? null : existentes.get(dto.getId());
            if (alerta == null) {
                if (repository.existsByEmpresaIdAndPercentual(empresa.getId(), percentual)) continue;
                alerta = ConfiguracaoAlertaLimite.builder().empresa(empresa).build();
            } else if (Boolean.TRUE.equals(alerta.getObrigatorio())
                    && !alerta.getPercentual().setScale(2, RoundingMode.HALF_UP).equals(percentual)) {
                throw new ApplicationException("Alertas obrigatórios de 100% e 120% não podem ter o percentual alterado");
            }
            alerta.setPercentual(percentual);
            alerta.setObrigatorio(obrigatorio);
            alerta.setAtivo(obrigatorio || Boolean.TRUE.equals(dto.getAtivo()));
            repository.save(alerta);
        }

        garantirObrigatoriosAtivos(empresa);
        return repository.findByEmpresaIdOrderByPercentual(empresa.getId()).stream().map(this::toDTO).toList();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ConfiguracaoAlertaLimiteDTO alertaAtual(BigDecimal percentual) {
        Empresa empresa = empresaAtual.get();
        garantirPadroes(empresa);
        return repository.findByEmpresaIdOrderByPercentual(empresa.getId()).stream()
                .filter(item -> Boolean.TRUE.equals(item.getAtivo()))
                .filter(item -> percentual.compareTo(item.getPercentual()) >= 0)
                .max(Comparator.comparing(ConfiguracaoAlertaLimite::getPercentual))
                .map(this::toDTO).orElse(null);
    }

    public FaixaAlertaMeiEnum faixaAlerta(BigDecimal percentual, ConfiguracaoAlertaLimiteDTO alerta) {
        if (alerta == null) return FaixaAlertaMeiEnum.NORMAL;
        BigDecimal limite = alerta.getPercentual();
        if (limite.compareTo(ALERTA_120) >= 0 && percentual.compareTo(limite) >= 0) return FaixaAlertaMeiEnum.EXCEDIDO_120;
        if (limite.compareTo(ALERTA_100) >= 0 && percentual.compareTo(limite) >= 0) return FaixaAlertaMeiEnum.EXCEDIDO_100;
        if (limite.compareTo(ALERTA_90) >= 0) return FaixaAlertaMeiEnum.CRITICO_90;
        if (limite.compareTo(ALERTA_80) >= 0) return FaixaAlertaMeiEnum.ALERTA_80;
        if (limite.compareTo(ALERTA_75) >= 0) return FaixaAlertaMeiEnum.ATENCAO_75;
        return FaixaAlertaMeiEnum.ATENCAO_70;
    }

    private void garantirPadroes(Empresa empresa) {
        for (BigDecimal percentual : PADROES) {
            if (!repository.existsByEmpresaIdAndPercentual(empresa.getId(), percentual)) {
                repository.save(ConfiguracaoAlertaLimite.builder()
                        .empresa(empresa)
                        .percentual(percentual)
                        .ativo(true)
                        .obrigatorio(OBRIGATORIOS.contains(percentual))
                        .build());
            }
        }
        garantirObrigatoriosAtivos(empresa);
    }

    private void garantirObrigatoriosAtivos(Empresa empresa) {
        repository.findByEmpresaIdOrderByPercentual(empresa.getId()).stream()
                .filter(item -> OBRIGATORIOS.contains(item.getPercentual().setScale(2, RoundingMode.HALF_UP)))
                .forEach(item -> {
                    item.setObrigatorio(true);
                    item.setAtivo(true);
                    repository.save(item);
                });
    }

    private void validarDuplicidade(List<ConfiguracaoAlertaLimiteUpdateDTO> dtos) {
        Set<BigDecimal> percentuais = new HashSet<>();
        for (ConfiguracaoAlertaLimiteUpdateDTO dto : dtos) {
            BigDecimal percentual = normalizar(dto.getPercentual());
            if (!percentuais.add(percentual)) {
                throw new ApplicationException("Existem alertas com percentual duplicado");
            }
        }
    }

    private BigDecimal normalizar(BigDecimal percentual) {
        if (percentual == null) throw new ApplicationException("Informe o percentual do alerta");
        return percentual.setScale(2, RoundingMode.HALF_UP);
    }

    private ConfiguracaoAlertaLimiteDTO toDTO(ConfiguracaoAlertaLimite alerta) {
        return ConfiguracaoAlertaLimiteDTO.builder()
                .id(alerta.getId())
                .percentual(alerta.getPercentual())
                .ativo(alerta.getAtivo())
                .obrigatorio(alerta.getObrigatorio())
                .build();
    }
}
