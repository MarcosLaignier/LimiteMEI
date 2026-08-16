package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.*;
import com.limiteMEI.limiteMEI.dto.lancamento.*;
import com.limiteMEI.limiteMEI.enums.*;
import com.limiteMEI.limiteMEI.repository.*;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@Transactional
public class LancamentoFinanceiroService {
    private final LancamentoFinanceiroRepository repository;
    private final BaixaFinanceiraRepository baixas;
    private final EmpresaAtualService empresaAtual;
    private final CategoriaService categorias;
    private final PessoaService pessoas;
    private final PessoaPapelService papeis;
    private final ContaFinanceiraService contas;
    private final MovimentoFinanceiroService movimentos;
    private final HistoricoFinanceiroService historico;

    public LancamentoFinanceiroService(LancamentoFinanceiroRepository repository, BaixaFinanceiraRepository baixas,
                                       EmpresaAtualService empresaAtual, CategoriaService categorias,
                                       PessoaService pessoas, PessoaPapelService papeis, ContaFinanceiraService contas,
                                       MovimentoFinanceiroService movimentos, HistoricoFinanceiroService historico) {
        this.repository = repository;
        this.baixas = baixas;
        this.empresaAtual = empresaAtual;
        this.categorias = categorias;
        this.pessoas = pessoas;
        this.papeis = papeis;
        this.contas = contas;
        this.movimentos = movimentos;
        this.historico = historico;
    }

    public List<LancamentoFinanceiroDTO> findAll() {
        return repository.findByEmpresaIdAndExcluidoFalseOrderByDataVencimentoDesc(empresaAtual.get().getId()).stream().map(this::toDTO).toList();
    }

    public LancamentoFinanceiroDTO getById(Long id) {
        return toDTO(findOwned(id));
    }

    public LancamentoFinanceiroDTO create(LancamentoFinanceiroCreateDTO dto) {
        LancamentoFinanceiro entity = LancamentoFinanceiro.builder().empresa(empresaAtual.get())
                .situacao(SituacaoLancamentoEnum.ABERTO).build();
        apply(entity, dto);
        entity = repository.save(entity);
        historico.registrar(entity, null, EventoFinanceiroEnum.CRIACAO_LANCAMENTO, "Lançamento criado");
        if (Boolean.TRUE.equals(dto.getBaixarAutomaticamente())) {
            if (dto.getDataLiquidacao() == null || dto.getFormaPagamento() == null || dto.getContaFinanceiraId() == null) {
                throw new ApplicationException("Informe a data, a forma de pagamento e a conta da baixa automática");
            }
            ContaFinanceira conta = contas.findOwnedEntity(dto.getContaFinanceiraId());
            if (!Boolean.TRUE.equals(conta.getAtivo())) throw new ApplicationException("A conta financeira selecionada está inativa");
            BaixaFinanceira baixa = baixas.save(BaixaFinanceira.builder()
                    .lancamento(entity)
                    .contaFinanceira(conta)
                    .valorPrincipal(entity.getValor())
                    .juros(BigDecimal.ZERO)
                    .multa(BigDecimal.ZERO)
                    .desconto(BigDecimal.ZERO)
                    .valorPago(entity.getValor())
                    .dataLiquidacao(dto.getDataLiquidacao())
                    .formaPagamento(dto.getFormaPagamento())
                    .observacao("Baixa automática realizada no cadastro do lançamento")
                    .build());
            movimentos.gerarPorBaixa(baixa);
            historico.registrar(entity, baixa, EventoFinanceiroEnum.BAIXA_REALIZADA,
                    "Baixa automática realizada: principal e valor pago " + baixa.getValorPago());
            entity.setSituacao(SituacaoLancamentoEnum.LIQUIDADO);
            repository.save(entity);
        }
        return toDTO(entity);
    }

    public LancamentoFinanceiroDTO update(Long id, LancamentoFinanceiroCreateDTO dto) {
        LancamentoFinanceiro entity = findOwned(id);
        if (entity.getSituacao() == SituacaoLancamentoEnum.CANCELADO) {
            throw new ApplicationException("Um lançamento cancelado não pode ser alterado");
        }
        apply(entity, dto);
        BigDecimal total = total(id);
        if (entity.getValor().compareTo(total) < 0) {
            throw new ApplicationException("O valor não pode ser menor que o total já baixado");
        }
        atualizarSituacao(entity, total);
        entity = repository.save(entity);
        historico.registrar(entity, null, EventoFinanceiroEnum.ALTERACAO_LANCAMENTO, "Lançamento alterado");
        return toDTO(entity);
    }

    public void delete(Long id) {
        LancamentoFinanceiro entity = findOwned(id);
        if (baixas.existsByLancamentoIdAndAtivoTrue(id)) {
            throw new ApplicationException("Exclua as baixas antes de excluir o lançamento");
        }
        entity.setExcluido(true);
        entity.setDataExclusao(LocalDateTime.now());
        entity.setMotivoExclusao("Exclusão solicitada pelo usuário");
        entity.setUsuarioExclusao(usuarioAtual());
        repository.save(entity);
        historico.registrar(entity, null, EventoFinanceiroEnum.EXCLUSAO_LANCAMENTO, entity.getMotivoExclusao());
    }

    public LancamentoFinanceiroDTO cancelar(Long id, MotivoOperacaoDTO dto) {
        LancamentoFinanceiro entity = findOwned(id);
        if (entity.getSituacao() == SituacaoLancamentoEnum.CANCELADO) {
            throw new ApplicationException("O lançamento já está cancelado");
        }
        if (baixas.existsByLancamentoIdAndAtivoTrue(id)) {
            throw new ApplicationException("Estorne as baixas antes de cancelar o lançamento");
        }
        entity.setSituacao(SituacaoLancamentoEnum.CANCELADO);
        entity.setDataCancelamento(LocalDateTime.now());
        entity.setMotivoCancelamento(dto.getMotivo().trim());
        entity.setUsuarioCancelamento(usuarioAtual());
        repository.save(entity);
        historico.registrar(entity, null, EventoFinanceiroEnum.CANCELAMENTO_LANCAMENTO,
                "Lançamento cancelado: " + entity.getMotivoCancelamento());
        return toDTO(entity);
    }

    public List<HistoricoFinanceiroDTO> historico(Long id) {
        findOwned(id);
        return historico.listar(id);
    }

    public LancamentoFinanceiro findOwned(Long id) {
        LancamentoFinanceiro entity = repository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Lançamento financeiro não encontrado"));
        if (Boolean.TRUE.equals(entity.getExcluido())) {
            throw new ApplicationException("Lançamento financeiro excluído");
        }
        return entity;
    }

    public LancamentoFinanceiro findOwnedForUpdate(Long id) {
        LancamentoFinanceiro entity = repository.findLockedByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Lançamento financeiro não encontrado"));
        if (Boolean.TRUE.equals(entity.getExcluido())) {
            throw new ApplicationException("Lançamento financeiro excluído");
        }
        return entity;
    }

    public void atualizarSituacao(LancamentoFinanceiro entity, BigDecimal total) {
        if (entity.getSituacao() == SituacaoLancamentoEnum.CANCELADO) return;
        if (total.signum() == 0) entity.setSituacao(SituacaoLancamentoEnum.ABERTO);
        else if (total.compareTo(entity.getValor()) >= 0) entity.setSituacao(SituacaoLancamentoEnum.LIQUIDADO);
        else entity.setSituacao(SituacaoLancamentoEnum.PARCIAL);
        repository.save(entity);
    }

    public BigDecimal total(Long id) {
        return baixas.totalPorLancamento(id);
    }

    private void apply(LancamentoFinanceiro entity, LancamentoFinanceiroCreateDTO dto) {
        Categoria categoria = categorias.findOwnedEntity(dto.getCategoriaId());
        if (!Boolean.TRUE.equals(categoria.getAtivo())) throw new ApplicationException("A categoria selecionada está inativa");
        TipoMovimentoEnum tipoCategoria = dto.getTipo() == TipoLancamentoEnum.RECEBER ? TipoMovimentoEnum.RECEITA : TipoMovimentoEnum.DESPESA;
        if (categoria.getTipo() != tipoCategoria) throw new ApplicationException("A categoria não corresponde ao tipo do lançamento");

        Pessoa pessoa = null;
        ExigenciaPessoaEnum exigenciaPessoa = categoria.getExigenciaPessoa() == null
                ? ExigenciaPessoaEnum.NAO_UTILIZA : categoria.getExigenciaPessoa();
        if (exigenciaPessoa == ExigenciaPessoaEnum.OBRIGATORIA && dto.getPessoaId() == null)
            throw new ApplicationException("A pessoa é obrigatória para esta categoria");
        if (exigenciaPessoa != ExigenciaPessoaEnum.NAO_UTILIZA && dto.getPessoaId() != null) {
            pessoa = pessoas.findOwnedEntity(dto.getPessoaId());
            if (categoria.getPapelPessoa() != null && !papeis.possuiPapel(pessoa.getId(), categoria.getPapelPessoa()))
                throw new ApplicationException("A pessoa não possui o papel exigido pela categoria");
        }
        entity.setDescricao(dto.getDescricao());
        entity.setTipo(dto.getTipo());
        entity.setCategoria(categoria);
        entity.setPessoa(pessoa);
        entity.setValor(dto.getValor());
        entity.setDataCompetencia(dto.getDataCompetencia().withDayOfMonth(1));
        entity.setDataVencimento(dto.getDataVencimento());
        entity.setAtivo(dto.getAtivo() == null ? true : dto.getAtivo());
        entity.setObservacao(dto.getObservacao());
    }

    private LancamentoFinanceiroDTO toDTO(LancamentoFinanceiro entity) {
        BigDecimal liquidado = total(entity.getId());
        return LancamentoFinanceiroDTO.builder().id(entity.getId()).descricao(entity.getDescricao()).tipo(entity.getTipo())
                .categoriaId(entity.getCategoria().getId()).categoriaNome(entity.getCategoria().getNome())
                .pessoaId(entity.getPessoa() == null ? null : entity.getPessoa().getId())
                .pessoaNome(entity.getPessoa() == null ? null : entity.getPessoa().getNomeRazaoSocial())
                .valor(entity.getValor()).valorLiquidado(liquidado).saldoAberto(entity.getValor().subtract(liquidado))
                .dataCompetencia(entity.getDataCompetencia()).dataVencimento(entity.getDataVencimento())
                .situacao(entity.getSituacao()).ativo(entity.getAtivo()).observacao(entity.getObservacao())
                .dataCancelamento(entity.getDataCancelamento()).motivoCancelamento(entity.getMotivoCancelamento())
                .usuarioCancelamento(entity.getUsuarioCancelamento()).build();
    }

    private String usuarioAtual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
