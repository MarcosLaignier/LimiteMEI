package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.ConfiguracaoGeral;
import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoGeralDTO;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoGeralUpdateDTO;
import com.limiteMEI.limiteMEI.repository.ConfiguracaoGeralRepository;
import com.limiteMEI.limiteMEI.repository.ContaFinanceiraRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracaoGeralService {
    private final ConfiguracaoGeralRepository repository;
    private final ContaFinanceiraRepository contas;
    private final EmpresaAtualService empresaAtual;

    public ConfiguracaoGeralService(ConfiguracaoGeralRepository repository,
                                    ContaFinanceiraRepository contas,
                                    EmpresaAtualService empresaAtual) {
        this.repository = repository;
        this.contas = contas;
        this.empresaAtual = empresaAtual;
    }

    @Transactional
    public ConfiguracaoGeralDTO carregar() {
        return toDTO(getOrCreate(empresaAtual.get()));
    }

    @Transactional
    public ConfiguracaoGeralDTO atualizar(ConfiguracaoGeralUpdateDTO dto) {
        Empresa empresa = empresaAtual.get();
        ConfiguracaoGeral configuracao = getOrCreate(empresa);
        configuracao.setContaPadraoBaixa(contaPadrao(empresa, dto.getContaPadraoBaixaId()));
        configuracao.setFormaPagamentoPadrao(dto.getFormaPagamentoPadrao());
        return toDTO(repository.save(configuracao));
    }

    private ConfiguracaoGeral getOrCreate(Empresa empresa) {
        return repository.findByEmpresaId(empresa.getId())
                .orElseGet(() -> repository.save(ConfiguracaoGeral.builder().empresa(empresa).build()));
    }

    private ContaFinanceira contaPadrao(Empresa empresa, Long contaId) {
        if (contaId == null) return null;
        ContaFinanceira conta = contas.findByIdAndEmpresaId(contaId, empresa.getId())
                .orElseThrow(() -> new ApplicationException("Conta padrão para baixas não encontrada"));
        if (!Boolean.TRUE.equals(conta.getAtivo())) {
            throw new ApplicationException("A conta padrão para baixas precisa estar ativa");
        }
        return conta;
    }

    private ConfiguracaoGeralDTO toDTO(ConfiguracaoGeral configuracao) {
        ContaFinanceira conta = configuracao.getContaPadraoBaixa();
        return ConfiguracaoGeralDTO.builder()
                .id(configuracao.getId())
                .contaPadraoBaixaId(conta == null ? null : conta.getId())
                .contaPadraoBaixaNome(conta == null ? null : conta.getNome())
                .formaPagamentoPadrao(configuracao.getFormaPagamentoPadrao())
                .build();
    }
}
