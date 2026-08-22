package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.documentofiscal.*;
import com.limiteMEI.limiteMEI.dto.relatorio.RelatorioDocumentoFiscalFiltroDTO;
import com.limiteMEI.limiteMEI.enums.*;
import com.limiteMEI.limiteMEI.repository.*;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class DocumentoFiscalService {
    private final DocumentoFiscalRepository repository;
    private final DocumentoFiscalLancamentoRepository vinculos;
    private final LancamentoFinanceiroRepository lancamentosRepository;
    private final EmpresaAtualService empresaAtual;
    private final PessoaService pessoas;
    private final PeriodoOperacionalService periodos;

    public DocumentoFiscalService(DocumentoFiscalRepository repository,
                                  DocumentoFiscalLancamentoRepository vinculos,
                                  LancamentoFinanceiroRepository lancamentosRepository,
                                  EmpresaAtualService empresaAtual, PessoaService pessoas,
                                  PeriodoOperacionalService periodos) {
        this.repository = repository;
        this.vinculos = vinculos;
        this.lancamentosRepository = lancamentosRepository;
        this.empresaAtual = empresaAtual;
        this.pessoas = pessoas;
        this.periodos = periodos;
    }

    @Transactional(readOnly = true)
    public List<DocumentoFiscalDTO> findAll() {
        return repository.findByEmpresaIdAndExcluidoFalseOrderByDataEmissaoDescIdDesc(empresaAtual.get().getId())
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentoFiscalDTO> relatorio(RelatorioDocumentoFiscalFiltroDTO filtro) {
        String clienteFiltro = filtro.getCliente() == null || filtro.getCliente().isBlank() ? null : filtro.getCliente().trim();
        return repository.relatorioDocumentos(
                        empresaAtual.get().getId(),
                        filtro.getInicio(),
                        filtro.getFim(),
                        filtro.getTipo(),
                        filtro.getSituacao(),
                        clienteFiltro
                )
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public DocumentoFiscalDTO getById(Long id) {
        return toDTO(findOwned(id));
    }

    public DocumentoFiscalDTO create(DocumentoFiscalCreateDTO dto) {
        DocumentoFiscal documento = DocumentoFiscal.builder().empresa(empresaAtual.get()).build();
        aplicar(documento, dto);
        documento = repository.saveAndFlush(documento);
        sincronizarLancamentos(documento.getVinculos().stream().map(v -> v.getLancamento().getId()).toList());
        return toDTO(documento);
    }

    public DocumentoFiscalDTO update(Long id, DocumentoFiscalCreateDTO dto) {
        DocumentoFiscal documento = findOwned(id);
        validarPeriodoAberto(documento.getDataEmissao());
        Set<Long> afetados = new HashSet<>();
        documento.getVinculos().forEach(item -> {
            validarPeriodoAberto(item.getLancamento().getDataCompetencia());
            afetados.add(item.getLancamento().getId());
        });
        aplicar(documento, dto);
        documento.getVinculos().forEach(item -> afetados.add(item.getLancamento().getId()));
        documento = repository.saveAndFlush(documento);
        sincronizarLancamentos(afetados);
        return toDTO(documento);
    }

    public void delete(Long id) {
        DocumentoFiscal documento = findOwned(id);
        validarPeriodoAberto(documento.getDataEmissao());
        List<Long> afetados = documento.getVinculos().stream().map(item -> {
            validarPeriodoAberto(item.getLancamento().getDataCompetencia());
            return item.getLancamento().getId();
        }).toList();
        documento.setExcluido(true);
        repository.saveAndFlush(documento);
        sincronizarLancamentos(afetados);
    }

    private void aplicar(DocumentoFiscal documento, DocumentoFiscalCreateDTO dto) {
        validarPeriodoAberto(dto.getDataEmissao());
        Long idConsulta = documento.getId() == null ? -1L : documento.getId();
        String serie = dto.getSerie() == null ? "" : dto.getSerie().trim();
        if (repository.existsByEmpresaIdAndNumeroIgnoreCaseAndSerieIgnoreCaseAndExcluidoFalseAndIdNot(
                empresaAtual.get().getId(), dto.getNumero().trim(), serie, idConsulta)) {
            throw new ApplicationException("Já existe um documento fiscal com este número e série");
        }
        Pessoa cliente = dto.getClienteId() == null ? null : pessoas.findOwnedEntity(dto.getClienteId());
        documento.setTipo(dto.getTipo());
        documento.setNumero(dto.getNumero().trim());
        documento.setSerie(serie);
        documento.setChaveAcesso(normalizar(dto.getChaveAcesso()));
        documento.setDataEmissao(dto.getDataEmissao());
        documento.setValorTotal(dto.getValorTotal());
        documento.setSituacao(dto.getSituacao());
        documento.setCliente(cliente);
        documento.setObservacao(normalizar(dto.getObservacao()));
        montarVinculos(documento, dto.getVinculos());
    }

    private void montarVinculos(DocumentoFiscal documento, List<DocumentoFiscalVinculoCreateDTO> itens) {
        List<DocumentoFiscalVinculoCreateDTO> informados = itens == null ? List.of() : itens;
        if (informados.stream().map(DocumentoFiscalVinculoCreateDTO::getLancamentoId).distinct().count()
                != informados.size()) throw new ApplicationException("Um lançamento não pode ser vinculado duas vezes ao mesmo documento");
        BigDecimal total = informados.stream().map(DocumentoFiscalVinculoCreateDTO::getValorVinculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.compareTo(documento.getValorTotal()) > 0) {
            throw new ApplicationException("O valor vinculado não pode superar o valor total do documento");
        }
        documento.getVinculos().clear();
        for (DocumentoFiscalVinculoCreateDTO item : informados) {
            LancamentoFinanceiro lancamento = findLancamentoOwned(item.getLancamentoId());
            if (lancamento.getTipo() != TipoLancamentoEnum.RECEBER) {
                throw new ApplicationException("Somente lançamentos a receber podem ser vinculados a documentos fiscais");
            }
            validarPeriodoAberto(lancamento.getDataCompetencia());
            BigDecimal outros = vinculos.totalVinculadoEmOutrosDocumentos(lancamento.getId(),
                    documento.getId() == null ? -1L : documento.getId());
            if (outros.add(item.getValorVinculado()).compareTo(lancamento.getValor()) > 0) {
                throw new ApplicationException("O vínculo supera o saldo fiscal disponível do lançamento: "
                        + lancamento.getDescricao());
            }
            documento.getVinculos().add(DocumentoFiscalLancamento.builder().documentoFiscal(documento)
                    .lancamento(lancamento).valorVinculado(item.getValorVinculado()).build());
        }
    }

    private void sincronizarLancamentos(Collection<Long> ids) {
        for (Long id : new HashSet<>(ids)) {
            lancamentosRepository.findByIdAndEmpresaId(id, empresaAtual.get().getId()).ifPresent(lancamento -> {
                lancamento.setDocumentoFiscalEmitido(vinculos.possuiDocumentoEmitido(id));
                lancamentosRepository.save(lancamento);
            });
        }
    }

    private void validarPeriodoAberto(LocalDate competencia) {
        periodos.validarAberto(empresaAtual.get(), competencia, "alterar documentos fiscais");
    }

    private DocumentoFiscal findOwned(Long id) {
        return repository.findByIdAndEmpresaIdAndExcluidoFalse(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Documento fiscal não encontrado"));
    }

    public void sincronizarVinculoDoLancamento(LancamentoFinanceiro lancamento, Long documentoId, BigDecimal valor) {
        List<DocumentoFiscalLancamento> atuais = vinculos.findByLancamentoId(lancamento.getId());
        for (DocumentoFiscalLancamento atual : atuais) {
            validarPeriodoAberto(atual.getDocumentoFiscal().getDataEmissao());
            atual.getDocumentoFiscal().getVinculos().remove(atual);
        }
        vinculos.deleteAll(atuais);
        vinculos.flush();
        if (documentoId != null) {
            DocumentoFiscal documento = findOwned(documentoId);
            validarPeriodoAberto(documento.getDataEmissao());
            if (documento.getSituacao() != SituacaoDocumentoFiscalEnum.EMITIDO) {
                throw new ApplicationException("Selecione um documento fiscal emitido");
            }
            BigDecimal valorVinculado = valor == null ? lancamento.getValor() : valor;
            BigDecimal totalDocumento = documento.getVinculos().stream().map(DocumentoFiscalLancamento::getValorVinculado)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (totalDocumento.add(valorVinculado).compareTo(documento.getValorTotal()) > 0) {
                throw new ApplicationException("O documento fiscal não possui saldo suficiente para este vínculo");
            }
            if (valorVinculado.compareTo(lancamento.getValor()) > 0 || valorVinculado.signum() <= 0) {
                throw new ApplicationException("O valor fiscal vinculado deve ser positivo e não pode superar o lançamento");
            }
            vinculos.save(DocumentoFiscalLancamento.builder().documentoFiscal(documento).lancamento(lancamento)
                    .valorVinculado(valorVinculado).build());
            vinculos.flush();
        }
        lancamento.setDocumentoFiscalEmitido(vinculos.possuiDocumentoEmitido(lancamento.getId()));
        lancamentosRepository.save(lancamento);
    }

    @Transactional(readOnly = true)
    public Optional<DocumentoFiscalLancamento> vinculoEmitido(Long lancamentoId) {
        return vinculos.findFirstByLancamentoIdAndDocumentoFiscalExcluidoFalseAndDocumentoFiscalSituacaoOrderById(
                lancamentoId, SituacaoDocumentoFiscalEnum.EMITIDO);
    }

    private LancamentoFinanceiro findLancamentoOwned(Long id) {
        return lancamentosRepository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .filter(item -> !Boolean.TRUE.equals(item.getExcluido()))
                .orElseThrow(() -> new ApplicationException("Lançamento financeiro não encontrado"));
    }

    private DocumentoFiscalDTO toDTO(DocumentoFiscal documento) {
        List<DocumentoFiscalVinculoDTO> itens = documento.getVinculos().stream().map(item ->
                DocumentoFiscalVinculoDTO.builder().lancamentoId(item.getLancamento().getId())
                        .descricao(item.getLancamento().getDescricao())
                        .competencia(item.getLancamento().getDataCompetencia())
                        .valorLancamento(item.getLancamento().getValor())
                        .valorVinculado(item.getValorVinculado()).build()).toList();
        BigDecimal total = itens.stream().map(DocumentoFiscalVinculoDTO::getValorVinculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return DocumentoFiscalDTO.builder().id(documento.getId()).tipo(documento.getTipo())
                .numero(documento.getNumero()).serie(documento.getSerie()).chaveAcesso(documento.getChaveAcesso())
                .dataEmissao(documento.getDataEmissao()).valorTotal(documento.getValorTotal())
                .valorVinculado(total).saldoVincular(documento.getValorTotal().subtract(total))
                .situacao(documento.getSituacao()).clienteId(documento.getCliente() == null ? null : documento.getCliente().getId())
                .clienteNome(documento.getCliente() == null ? null : documento.getCliente().getNomeRazaoSocial())
                .observacao(documento.getObservacao()).vinculos(itens).build();
    }

    private String normalizar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
