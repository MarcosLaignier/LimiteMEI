package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.movimento.*;
import com.limiteMEI.limiteMEI.enums.*;
import com.limiteMEI.limiteMEI.mapper.MovimentoFinanceiroMapper;
import com.limiteMEI.limiteMEI.repository.MovimentoFinanceiroRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class MovimentoFinanceiroService extends BaseService<MovimentoFinanceiro, Long, MovimentoFinanceiroCreateDTO, MovimentoFinanceiroDTO> {
    private final MovimentoFinanceiroRepository repository;
    private final MovimentoFinanceiroMapper mapper;
    private final EmpresaAtualService empresaAtual;
    private final ContaFinanceiraService contas;
    private final CategoriaService categorias;

    public MovimentoFinanceiroService(MovimentoFinanceiroRepository repository, MovimentoFinanceiroMapper mapper,
                                      GenericUniqueValidator validator, EmpresaAtualService empresaAtual,
                                      ContaFinanceiraService contas, CategoriaService categorias) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
        this.empresaAtual = empresaAtual;
        this.contas = contas;
        this.categorias = categorias;
    }

    @Override
    protected MovimentoFinanceiroRepository getRepository() { return repository; }
    @Override
    protected MovimentoFinanceiroMapper getMapper() { return mapper; }

    @Override
    public MovimentoFinanceiroDTO save(MovimentoFinanceiroCreateDTO dto) {
        validarOrigemManual(dto.getOrigem());
        MovimentoFinanceiro entity = mapper.toEntity(dto);
        prepararManual(entity, dto);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public MovimentoFinanceiroDTO update(Long id, MovimentoFinanceiroCreateDTO dto) {
        MovimentoFinanceiro entity = findOwned(id);
        validarEditavel(entity);
        validarOrigemManual(dto.getOrigem());
        mapper.updateEntity(entity, dto);
        prepararManual(entity, dto);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        MovimentoFinanceiro entity = findOwned(id);
        validarEditavel(entity);
        repository.delete(entity);
    }

    @Override
    public MovimentoFinanceiroDTO getById(Long id) { return mapper.toDTO(findOwned(id)); }

    @Override
    public List<MovimentoFinanceiroDTO> findAll() {
        return repository.findByEmpresaIdOrderByDataDescIdDesc(empresaAtual.get().getId()).stream().map(mapper::toDTO).toList();
    }

    public List<MovimentoFinanceiroDTO> extrato(Long contaId, LocalDate inicio, LocalDate fim) {
        ContaFinanceira conta = contas.findOwnedEntity(contaId);
        return repository.extrato(conta.getId(), empresaAtual.get().getId(), inicio, fim).stream().map(mapper::toDTO).toList();
    }

    public BigDecimal saldo(Long contaId) {
        ContaFinanceira conta = contas.findOwnedEntity(contaId);
        return conta.getSaldoInicial().add(repository.saldoMovimentado(contaId, empresaAtual.get().getId(), TipoFluxoCaixaEnum.ENTRADA));
    }

    public List<MovimentoFinanceiroDTO> transferir(TransferenciaFinanceiraDTO dto) {
        if (dto.getContaOrigemId().equals(dto.getContaDestinoId()))
            throw new ApplicationException("As contas de origem e destino devem ser diferentes");
        ContaFinanceira origem = contas.findOwnedEntity(dto.getContaOrigemId());
        ContaFinanceira destino = contas.findOwnedEntity(dto.getContaDestinoId());
        if (!Boolean.TRUE.equals(origem.getAtivo()) || !Boolean.TRUE.equals(destino.getAtivo()))
            throw new ApplicationException("As contas da transferência devem estar ativas");
        String transferenciaId = UUID.randomUUID().toString();
        String descricao = dto.getDescricao() == null || dto.getDescricao().isBlank() ? "Transferência entre contas" : dto.getDescricao();
        MovimentoFinanceiro saida = movimentoTransferencia(origem, dto.getValor(), dto.getData(), descricao,
                dto.getObservacao(), TipoFluxoCaixaEnum.SAIDA, transferenciaId);
        MovimentoFinanceiro entrada = movimentoTransferencia(destino, dto.getValor(), dto.getData(), descricao,
                dto.getObservacao(), TipoFluxoCaixaEnum.ENTRADA, transferenciaId);
        return repository.saveAll(List.of(saida, entrada)).stream().map(mapper::toDTO).toList();
    }

    public void excluirTransferencia(String transferenciaId) {
        List<MovimentoFinanceiro> movimentos = repository.findByTransferenciaIdAndEmpresaId(transferenciaId, empresaAtual.get().getId());
        if (movimentos.size() != 2) throw new ApplicationException("Transferência financeira não encontrada");
        repository.deleteAll(movimentos);
    }

    public MovimentoFinanceiro gerarPorBaixa(BaixaFinanceira baixa) {
        TipoFluxoCaixaEnum tipo = baixa.getLancamento().getTipo() == TipoLancamentoEnum.RECEBER
                ? TipoFluxoCaixaEnum.ENTRADA : TipoFluxoCaixaEnum.SAIDA;
        MovimentoFinanceiro movimento = MovimentoFinanceiro.builder()
                .empresa(baixa.getLancamento().getEmpresa())
                .contaFinanceira(baixa.getContaFinanceira())
                .baixaFinanceira(baixa)
                .categoria(baixa.getLancamento().getCategoria())
                .descricao(baixa.getLancamento().getDescricao())
                .valor(baixa.getValorPago())
                .data(baixa.getDataLiquidacao())
                .tipo(tipo)
                .origem(OrigemMovimentoEnum.BAIXA)
                .formaPagamento(baixa.getFormaPagamento())
                .observacao(baixa.getObservacao())
                .build();
        return repository.save(movimento);
    }

    public MovimentoFinanceiro estornarPorBaixa(Long baixaId, String motivo) {
        MovimentoFinanceiro original = repository.findByBaixaFinanceiraId(baixaId)
                .orElseThrow(() -> new ApplicationException("Movimentação da baixa não encontrada"));
        if (Boolean.TRUE.equals(original.getEstornado())) {
            throw new ApplicationException("Esta baixa já foi estornada");
        }
        original.setEstornado(true);
        repository.save(original);
        MovimentoFinanceiro estorno = MovimentoFinanceiro.builder()
                .empresa(original.getEmpresa())
                .contaFinanceira(original.getContaFinanceira())
                .categoria(original.getCategoria())
                .movimentoOrigem(original)
                .descricao("Estorno: " + original.getDescricao())
                .valor(original.getValor())
                .data(LocalDate.now())
                .tipo(original.getTipo() == TipoFluxoCaixaEnum.ENTRADA
                        ? TipoFluxoCaixaEnum.SAIDA : TipoFluxoCaixaEnum.ENTRADA)
                .origem(OrigemMovimentoEnum.ESTORNO)
                .formaPagamento(original.getFormaPagamento())
                .observacao(motivo)
                .build();
        return repository.save(estorno);
    }

    private void prepararManual(MovimentoFinanceiro entity, MovimentoFinanceiroCreateDTO dto) {
        ContaFinanceira conta = contas.findOwnedEntity(dto.getContaFinanceiraId());
        if (!Boolean.TRUE.equals(conta.getAtivo())) throw new ApplicationException("A conta financeira está inativa");
        entity.setEmpresa(empresaAtual.get());
        entity.setContaFinanceira(conta);
        entity.setTipo(tipoDaOrigem(dto.getOrigem(), dto.getTipo()));
        Categoria categoria = dto.getCategoriaId() == null ? null : categorias.findOwnedEntity(dto.getCategoriaId());
        if (categoria != null) {
            TipoMovimentoEnum tipoCategoria = entity.getTipo() == TipoFluxoCaixaEnum.ENTRADA
                    ? TipoMovimentoEnum.RECEITA : TipoMovimentoEnum.DESPESA;
            if (categoria.getTipo() != tipoCategoria)
                throw new ApplicationException("A categoria não corresponde ao tipo da movimentação");
        }
        entity.setCategoria(categoria);
        entity.setBaixaFinanceira(null);
        entity.setTransferenciaId(null);
    }

    private TipoFluxoCaixaEnum tipoDaOrigem(OrigemMovimentoEnum origem, TipoFluxoCaixaEnum informado) {
        return switch (origem) {
            case APORTE, EMPRESTIMO -> TipoFluxoCaixaEnum.ENTRADA;
            case RETIRADA, TARIFA -> TipoFluxoCaixaEnum.SAIDA;
            case AJUSTE -> {
                if (informado == null) throw new ApplicationException("Informe se o ajuste é uma entrada ou saída");
                yield informado;
            }
            default -> throw new ApplicationException("Origem inválida para movimentação manual");
        };
    }

    private void validarOrigemManual(OrigemMovimentoEnum origem) {
        if (origem == null || origem == OrigemMovimentoEnum.BAIXA
                || origem == OrigemMovimentoEnum.TRANSFERENCIA || origem == OrigemMovimentoEnum.ESTORNO)
            throw new ApplicationException("A origem informada não pode ser criada manualmente");
    }

    private void validarEditavel(MovimentoFinanceiro entity) {
        if (entity.getOrigem() == OrigemMovimentoEnum.BAIXA)
            throw new ApplicationException("Movimentações geradas por baixa só podem ser alteradas pela baixa");
        if (entity.getOrigem() == OrigemMovimentoEnum.TRANSFERENCIA)
            throw new ApplicationException("Utilize a operação de transferência para alterar este registro");
        if (entity.getOrigem() == OrigemMovimentoEnum.ESTORNO || Boolean.TRUE.equals(entity.getEstornado()))
            throw new ApplicationException("Movimentações estornadas e seus estornos não podem ser alterados");
    }

    private MovimentoFinanceiro findOwned(Long id) {
        return repository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Movimentação financeira não encontrada"));
    }

    private MovimentoFinanceiro movimentoTransferencia(ContaFinanceira conta, BigDecimal valor, LocalDate data,
            String descricao, String observacao, TipoFluxoCaixaEnum tipo, String transferenciaId) {
        return MovimentoFinanceiro.builder().empresa(empresaAtual.get()).contaFinanceira(conta).descricao(descricao)
                .valor(valor).data(data).tipo(tipo).origem(OrigemMovimentoEnum.TRANSFERENCIA)
                .transferenciaId(transferenciaId).observacao(observacao).build();
    }
}
