package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.ContaFinanceira;
import com.limiteMEI.limiteMEI.dto.conta.*;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ContaFinanceiraMapper implements BaseMapper<ContaFinanceira, ContaFinanceiraDTO, ContaFinanceiraCreateDTO> {
    @Override
    public ContaFinanceiraDTO toDTO(ContaFinanceira entity) {
        return ContaFinanceiraDTO.builder().id(entity.getId()).nome(entity.getNome()).tipo(entity.getTipo())
                .instituicao(entity.getInstituicao()).agencia(entity.getAgencia()).numeroConta(entity.getNumeroConta())
                .saldoInicial(entity.getSaldoInicial()).ativo(entity.getAtivo()).build();
    }

    @Override
    public ContaFinanceira toEntity(ContaFinanceiraCreateDTO dto) {
        ContaFinanceira entity = new ContaFinanceira();
        updateEntity(entity, dto);
        return entity;
    }

    @Override
    public void updateEntity(ContaFinanceira entity, ContaFinanceiraCreateDTO dto) {
        entity.setNome(dto.getNome());
        entity.setTipo(dto.getTipo());
        entity.setInstituicao(dto.getInstituicao());
        entity.setAgencia(dto.getAgencia());
        entity.setNumeroConta(dto.getNumeroConta());
        entity.setSaldoInicial(dto.getSaldoInicial() == null ? BigDecimal.ZERO : dto.getSaldoInicial());
        entity.setAtivo(dto.getAtivo() == null ? true : dto.getAtivo());
    }
}
