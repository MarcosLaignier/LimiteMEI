package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Pessoa;
import com.limiteMEI.limiteMEI.domain.PessoaPapel;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaCreateDTO;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO;
import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import com.limiteMEI.limiteMEI.mapper.PessoaMapper;
import com.limiteMEI.limiteMEI.repository.PessoaPapelRepository;
import com.limiteMEI.limiteMEI.repository.PessoaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class PessoaService extends BaseService<Pessoa, Long, PessoaCreateDTO, PessoaDTO> {
    private static final Set<PapelPessoaEnum> PAPEIS_CADASTRO_PESSOA = EnumSet.of(
            PapelPessoaEnum.CLIENTE,
            PapelPessoaEnum.FORNECEDOR
    );

    private final PessoaRepository repository;
    private final PessoaMapper mapper;
    private final EmpresaAtualService empresaAtual;
    private final PessoaPapelRepository papeisRepository;

    public PessoaService(PessoaRepository repository,
                         PessoaMapper mapper,
                         EmpresaAtualService empresaAtual,
                         GenericUniqueValidator validator,
                         PessoaPapelRepository papeisRepository) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
        this.empresaAtual = empresaAtual;
        this.papeisRepository = papeisRepository;
    }

    protected PessoaRepository getRepository() {
        return repository;
    }

    protected PessoaMapper getMapper() {
        return mapper;
    }

    @Override
    public PessoaDTO save(PessoaCreateDTO dto) {
        Pessoa pessoa = mapper.toEntity(dto);
        pessoa.setEmpresa(empresaAtual.get());
        validate(pessoa);
        validateDocumento(pessoa);
        pessoa = repository.save(pessoa);
        sincronizarPapeisCadastro(pessoa, dto.getPapeis());
        return mapper.toDTO(pessoa);
    }

    @Override
    public PessoaDTO update(Long id, PessoaCreateDTO dto) {
        Pessoa pessoa = findOwnedEntity(id);
        mapper.updateEntity(pessoa, dto);
        validate(pessoa);
        validateDocumento(pessoa);
        pessoa = repository.save(pessoa);
        sincronizarPapeisCadastro(pessoa, dto.getPapeis());
        return mapper.toDTO(pessoa);
    }

    public List<PessoaDTO> findAll() {
        return repository.findByEmpresaIdOrderByNomeRazaoSocial(empresaAtual.get().getId())
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public PessoaDTO getById(Long id) {
        return mapper.toDTO(findOwnedEntity(id));
    }

    public void delete(Long id) {
        repository.delete(findOwnedEntity(id));
    }

    public List<PessoaDTO> pesquisar(String termo) {
        if (termo == null || termo.trim().length() < 2) {
            return List.of();
        }
        return repository.pesquisar(empresaAtual.get().getId(), termo.trim())
                .stream()
                .limit(15)
                .map(mapper::toDTO)
                .toList();
    }

    public Pessoa findOwnedEntity(Long id) {
        return repository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Pessoa não encontrada"));
    }

    private void sincronizarPapeisCadastro(Pessoa pessoa, Set<PapelPessoaEnum> papeisSelecionados) {
        Set<PapelPessoaEnum> selecionados = EnumSet.noneOf(PapelPessoaEnum.class);
        if (papeisSelecionados != null) {
            selecionados.addAll(papeisSelecionados);
        }
        selecionados.retainAll(PAPEIS_CADASTRO_PESSOA);

        Set<PessoaPapel> atuais = papeisRepository.findByPessoaId(pessoa.getId());
        for (PapelPessoaEnum papel : PAPEIS_CADASTRO_PESSOA) {
            PessoaPapel existente = atuais.stream()
                    .filter(item -> item.getPapel() == papel)
                    .findFirst()
                    .orElse(null);
            boolean ativo = selecionados.contains(papel);
            if (existente == null && ativo) {
                papeisRepository.save(PessoaPapel.builder()
                        .pessoa(pessoa)
                        .papel(papel)
                        .ativo(true)
                        .build());
            } else if (existente != null && !Boolean.valueOf(ativo).equals(existente.getAtivo())) {
                existente.setAtivo(ativo);
                papeisRepository.save(existente);
            }
        }
    }

    private void validateDocumento(Pessoa pessoa) {
        if (pessoa.getCpfCnpj() != null && repository.existsByEmpresaIdAndCpfCnpjIgnoreCaseAndIdNot(
                pessoa.getEmpresa().getId(),
                pessoa.getCpfCnpj(),
                pessoa.getId() == null ? 0L : pessoa.getId())) {
            throw new ApplicationException("Já existe uma pessoa com este CPF/CNPJ");
        }
    }
}
