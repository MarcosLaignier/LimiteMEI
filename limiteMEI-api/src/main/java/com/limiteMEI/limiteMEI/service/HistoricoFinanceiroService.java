package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.lancamento.HistoricoFinanceiroDTO;
import com.limiteMEI.limiteMEI.enums.EventoFinanceiroEnum;
import com.limiteMEI.limiteMEI.repository.HistoricoFinanceiroRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistoricoFinanceiroService {
    private final HistoricoFinanceiroRepository repository;
    private final EmpresaAtualService empresaAtual;

    public HistoricoFinanceiroService(HistoricoFinanceiroRepository repository, EmpresaAtualService empresaAtual) {
        this.repository = repository;
        this.empresaAtual = empresaAtual;
    }

    public void registrar(LancamentoFinanceiro lancamento, BaixaFinanceira baixa,
                          EventoFinanceiroEnum evento, String descricao) {
        repository.save(HistoricoFinanceiro.builder()
                .empresa(lancamento.getEmpresa())
                .lancamentoId(lancamento.getId())
                .baixaId(baixa == null ? null : baixa.getId())
                .evento(evento)
                .dataHora(LocalDateTime.now())
                .usuario(SecurityContextHolder.getContext().getAuthentication().getName())
                .descricao(descricao)
                .build());
    }

    public List<HistoricoFinanceiroDTO> listar(Long lancamentoId) {
        Long empresaId = empresaAtual.get().getId();
        return repository.findByLancamentoIdAndEmpresaIdOrderByDataHoraDesc(lancamentoId, empresaId)
                .stream()
                .map(item -> HistoricoFinanceiroDTO.builder()
                        .id(item.getId())
                        .lancamentoId(item.getLancamentoId())
                        .baixaId(item.getBaixaId())
                        .evento(item.getEvento())
                        .dataHora(item.getDataHora())
                        .usuario(item.getUsuario())
                        .descricao(item.getDescricao())
                        .build())
                .toList();
    }
}
