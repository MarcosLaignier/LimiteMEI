package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Pessoa;
import com.limiteMEI.limiteMEI.domain.PessoaPapel;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaCreateDTO;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO;
import com.limiteMEI.limiteMEI.repository.PessoaPapelRepository;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PessoaMapper implements BaseMapper<Pessoa, PessoaDTO, PessoaCreateDTO> {
    private final PessoaPapelRepository papelRepository;

    public PessoaMapper(PessoaPapelRepository papelRepository) {
        this.papelRepository = papelRepository;
    }

    public PessoaDTO toDTO(Pessoa p) {
        if (p == null) {
            return null;
        }
        return PessoaDTO.builder()
                .id(p.getId())
                .tipoPessoa(p.getTipoPessoa())
                .nomeRazaoSocial(p.getNomeRazaoSocial())
                .nomeFantasia(p.getNomeFantasia())
                .cpfCnpj(p.getCpfCnpj())
                .email(p.getEmail())
                .telefone(p.getTelefone())
                .telefoneAlternativo(p.getTelefoneAlternativo())
                .responsavel(p.getResponsavel())
                .cep(p.getCep())
                .endereco(p.getEndereco())
                .numero(p.getNumero())
                .complemento(p.getComplemento())
                .bairro(p.getBairro())
                .cidade(p.getCidade())
                .uf(p.getUf())
                .observacoesComerciais(p.getObservacoesComerciais())
                .banco(p.getBanco())
                .agencia(p.getAgencia())
                .conta(p.getConta())
                .tipoConta(p.getTipoConta())
                .chavePix(p.getChavePix())
                .ativo(p.getAtivo())
                .papeis(papelRepository.findByPessoaId(p.getId()).stream()
                        .filter(x -> Boolean.TRUE.equals(x.getAtivo()))
                        .map(PessoaPapel::getPapel)
                        .collect(Collectors.toSet()))
                .build();
    }

    public Pessoa toEntity(PessoaCreateDTO d) {
        Pessoa p = new Pessoa();
        updateEntity(p, d);
        return p;
    }

    public void updateEntity(Pessoa p, PessoaCreateDTO d) {
        p.setTipoPessoa(d.getTipoPessoa());
        p.setNomeRazaoSocial(d.getNomeRazaoSocial().trim());
        p.setNomeFantasia(normalizeText(d.getNomeFantasia()));
        p.setCpfCnpj(normalizeDocument(d.getCpfCnpj()));
        p.setEmail(normalizeText(d.getEmail()));
        p.setTelefone(normalizeText(d.getTelefone()));
        p.setTelefoneAlternativo(normalizeText(d.getTelefoneAlternativo()));
        p.setResponsavel(normalizeText(d.getResponsavel()));
        p.setCep(normalizeDocument(d.getCep()));
        p.setEndereco(normalizeText(d.getEndereco()));
        p.setNumero(normalizeText(d.getNumero()));
        p.setComplemento(normalizeText(d.getComplemento()));
        p.setBairro(normalizeText(d.getBairro()));
        p.setCidade(normalizeText(d.getCidade()));
        p.setUf(d.getUf());
        p.setObservacoesComerciais(normalizeText(d.getObservacoesComerciais()));
        p.setBanco(d.getBanco());
        p.setAgencia(normalizeText(d.getAgencia()));
        p.setConta(normalizeText(d.getConta()));
        p.setTipoConta(d.getTipoConta());
        p.setChavePix(normalizeText(d.getChavePix()));
        p.setAtivo(d.getAtivo() == null ? p.getAtivo() == null ? true : p.getAtivo() : d.getAtivo());
    }

    private String normalizeDocument(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
    }

    private String normalizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

}
