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
import java.util.UUID;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
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
    private final ParcelamentoValidator parcelamentoValidator;
    private final RecorrenciaValidator recorrenciaValidator;
    private final FechamentoApuracaoMeiRepository fechamentosMei;

    public LancamentoFinanceiroService(LancamentoFinanceiroRepository repository, BaixaFinanceiraRepository baixas,
                                       EmpresaAtualService empresaAtual, CategoriaService categorias,
                                       PessoaService pessoas, PessoaPapelService papeis, ContaFinanceiraService contas,
                                       MovimentoFinanceiroService movimentos, HistoricoFinanceiroService historico,
                                       ParcelamentoValidator parcelamentoValidator,
                                       RecorrenciaValidator recorrenciaValidator,
                                       FechamentoApuracaoMeiRepository fechamentosMei) {
        this.repository = repository;
        this.baixas = baixas;
        this.empresaAtual = empresaAtual;
        this.categorias = categorias;
        this.pessoas = pessoas;
        this.papeis = papeis;
        this.contas = contas;
        this.movimentos = movimentos;
        this.historico = historico;
        this.parcelamentoValidator = parcelamentoValidator;
        this.recorrenciaValidator = recorrenciaValidator;
        this.fechamentosMei = fechamentosMei;
    }

    public List<LancamentoFinanceiroDTO> findAll() {
        return repository.findByEmpresaIdAndExcluidoFalseOrderByDataVencimentoDesc(empresaAtual.get().getId()).stream().map(this::toDTO).toList();
    }

    public LancamentoFinanceiroDTO getById(Long id) {
        return toDTO(findOwned(id));
    }

    public LancamentoFinanceiroDTO create(LancamentoFinanceiroCreateDTO dto) {
        if (dto.getRecorrencias() != null && !dto.getRecorrencias().isEmpty()) {
            if (dto.getParcelas() != null && !dto.getParcelas().isEmpty()) {
                throw new ApplicationException("Um lançamento não pode ser parcelado e recorrente ao mesmo tempo");
            }
            return criarRecorrencia(dto);
        }
        if (dto.getParcelas() != null && !dto.getParcelas().isEmpty()) {
            return criarParcelamento(dto);
        }
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
        validarPeriodoAberto(entity.getEmpresa(), entity.getDataCompetencia());
        if (entity.getSituacao() == SituacaoLancamentoEnum.CANCELADO) {
            throw new ApplicationException("Um lançamento cancelado não pode ser alterado");
        }
        if (entity.getParcelamentoId() != null || entity.getRecorrenciaId() != null) {
            throw new ApplicationException("Lançamentos vinculados a grupos devem ser alterados pela operação do grupo");
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
        validarPeriodoAberto(entity.getEmpresa(), entity.getDataCompetencia());
        if (entity.getParcelamentoId() != null || entity.getRecorrenciaId() != null) {
            throw new ApplicationException("Utilize a exclusão do grupo para remover todos os lançamentos vinculados");
        }
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
        validarPeriodoAberto(entity.getEmpresa(), entity.getDataCompetencia());
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

    public List<LancamentoFinanceiroDTO> parcelas(String parcelamentoId) {
        return findParcelamentoOwned(parcelamentoId).stream().map(this::toDTO).toList();
    }

    public void cancelarParcelamento(String parcelamentoId, MotivoOperacaoDTO dto) {
        List<LancamentoFinanceiro> parcelas = findParcelamentoOwned(parcelamentoId);
        parcelas.forEach(item -> validarPeriodoAberto(item.getEmpresa(), item.getDataCompetencia()));
        boolean cancelou = false;
        for (LancamentoFinanceiro parcela : parcelas) {
            if (parcela.getSituacao() != SituacaoLancamentoEnum.CANCELADO
                    && !baixas.existsByLancamentoIdAndAtivoTrue(parcela.getId())) {
                parcela.setSituacao(SituacaoLancamentoEnum.CANCELADO);
                parcela.setDataCancelamento(LocalDateTime.now());
                parcela.setMotivoCancelamento(dto.getMotivo().trim());
                parcela.setUsuarioCancelamento(usuarioAtual());
                repository.save(parcela);
                historico.registrar(parcela, null, EventoFinanceiroEnum.CANCELAMENTO_LANCAMENTO,
                        "Parcelamento cancelado: " + dto.getMotivo().trim());
                cancelou = true;
            }
        }
        if (!cancelou) throw new ApplicationException("Não existem parcelas pendentes para cancelar");
    }

    public void excluirParcelamento(String parcelamentoId) {
        List<LancamentoFinanceiro> parcelas = findParcelamentoOwned(parcelamentoId);
        parcelas.forEach(item -> validarPeriodoAberto(item.getEmpresa(), item.getDataCompetencia()));
        if (parcelas.stream().anyMatch(item -> baixas.existsByLancamentoIdAndAtivoTrue(item.getId()))) {
            throw new ApplicationException("Estorne as baixas ativas antes de excluir o parcelamento");
        }
        for (LancamentoFinanceiro parcela : parcelas) {
            parcela.setExcluido(true);
            parcela.setDataExclusao(LocalDateTime.now());
            parcela.setMotivoExclusao("Exclusão do parcelamento solicitada pelo usuário");
            parcela.setUsuarioExclusao(usuarioAtual());
            repository.save(parcela);
            historico.registrar(parcela, null, EventoFinanceiroEnum.EXCLUSAO_LANCAMENTO,
                    parcela.getMotivoExclusao());
        }
    }

    public List<LancamentoFinanceiroDTO> atualizarParcelamento(String parcelamentoId,
                                                                GrupoLancamentoUpdateDTO dto) {
        List<LancamentoFinanceiro> grupo = findParcelamentoOwned(parcelamentoId);
        atualizarGrupo(grupo, dto, "parcela");
        return grupo.stream().map(this::toDTO).toList();
    }

    public List<LancamentoFinanceiroDTO> recorrencias(String recorrenciaId) {
        return findRecorrenciaOwned(recorrenciaId).stream().map(this::toDTO).toList();
    }

    public void cancelarRecorrencia(String recorrenciaId, MotivoOperacaoDTO dto) {
        List<LancamentoFinanceiro> ocorrencias = findRecorrenciaOwned(recorrenciaId);
        ocorrencias.forEach(item -> validarPeriodoAberto(item.getEmpresa(), item.getDataCompetencia()));
        boolean cancelou = false;
        for (LancamentoFinanceiro ocorrencia : ocorrencias) {
            if (ocorrencia.getSituacao() != SituacaoLancamentoEnum.CANCELADO
                    && !baixas.existsByLancamentoIdAndAtivoTrue(ocorrencia.getId())) {
                ocorrencia.setSituacao(SituacaoLancamentoEnum.CANCELADO);
                ocorrencia.setDataCancelamento(LocalDateTime.now());
                ocorrencia.setMotivoCancelamento(dto.getMotivo().trim());
                ocorrencia.setUsuarioCancelamento(usuarioAtual());
                repository.save(ocorrencia);
                historico.registrar(ocorrencia, null, EventoFinanceiroEnum.CANCELAMENTO_LANCAMENTO,
                        "Recorrência cancelada: " + dto.getMotivo().trim());
                cancelou = true;
            }
        }
        if (!cancelou) throw new ApplicationException("Não existem ocorrências pendentes para cancelar");
    }

    public void excluirRecorrencia(String recorrenciaId) {
        List<LancamentoFinanceiro> ocorrencias = findRecorrenciaOwned(recorrenciaId);
        ocorrencias.forEach(item -> validarPeriodoAberto(item.getEmpresa(), item.getDataCompetencia()));
        if (ocorrencias.stream().anyMatch(item -> baixas.existsByLancamentoIdAndAtivoTrue(item.getId()))) {
            throw new ApplicationException("Estorne as baixas ativas antes de excluir a recorrência");
        }
        for (LancamentoFinanceiro ocorrencia : ocorrencias) {
            ocorrencia.setExcluido(true);
            ocorrencia.setDataExclusao(LocalDateTime.now());
            ocorrencia.setMotivoExclusao("Exclusão da recorrência solicitada pelo usuário");
            ocorrencia.setUsuarioExclusao(usuarioAtual());
            repository.save(ocorrencia);
            historico.registrar(ocorrencia, null, EventoFinanceiroEnum.EXCLUSAO_LANCAMENTO,
                    ocorrencia.getMotivoExclusao());
        }
    }

    public List<LancamentoFinanceiroDTO> atualizarRecorrencia(String recorrenciaId,
                                                               GrupoLancamentoUpdateDTO dto) {
        List<LancamentoFinanceiro> grupo = findRecorrenciaOwned(recorrenciaId);
        atualizarGrupo(grupo, dto, "ocorrência");
        return grupo.stream().map(this::toDTO).toList();
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
        Empresa empresa = entity.getEmpresa() == null ? empresaAtual.get() : entity.getEmpresa();
        validarPeriodoAberto(empresa, dto.getDataCompetencia());
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
        entity.setDocumentoFiscalEmitido(entity.getTipo() == TipoLancamentoEnum.RECEBER
                && Boolean.TRUE.equals(dto.getDocumentoFiscalEmitido()));
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
                .documentoFiscalEmitido(Boolean.TRUE.equals(entity.getDocumentoFiscalEmitido()))
                .dataCancelamento(entity.getDataCancelamento()).motivoCancelamento(entity.getMotivoCancelamento())
                .usuarioCancelamento(entity.getUsuarioCancelamento())
                .parcelamentoId(entity.getParcelamentoId()).numeroParcela(entity.getNumeroParcela())
                .totalParcelas(entity.getTotalParcelas()).parcelaEntrada(entity.getParcelaEntrada())
                .recorrenciaId(entity.getRecorrenciaId()).numeroRecorrencia(entity.getNumeroRecorrencia())
                .totalRecorrencias(entity.getTotalRecorrencias())
                .periodicidadeRecorrencia(entity.getPeriodicidadeRecorrencia()).build();
    }

    private LancamentoFinanceiroDTO criarParcelamento(LancamentoFinanceiroCreateDTO dto) {
        if (Boolean.TRUE.equals(dto.getBaixarAutomaticamente())) {
            throw new ApplicationException("A baixa automática não está disponível para parcelamentos");
        }
        List<ParcelaLancamentoCreateDTO> itens = dto.getParcelas();
        String grupoId = UUID.randomUUID().toString();
        int totalParcelas = parcelamentoValidator.validar(dto.getValor(), itens);
        int numero = 0;
        LancamentoFinanceiro primeiro = null;
        for (ParcelaLancamentoCreateDTO item : itens) {
            boolean entrada = Boolean.TRUE.equals(item.getEntrada());
            int numeroParcela = entrada ? 0 : ++numero;
            LancamentoFinanceiro entity = LancamentoFinanceiro.builder()
                    .empresa(empresaAtual.get())
                    .situacao(SituacaoLancamentoEnum.ABERTO)
                    .parcelamentoId(grupoId)
                    .numeroParcela(numeroParcela)
                    .totalParcelas(totalParcelas)
                    .parcelaEntrada(entrada)
                    .build();
            apply(entity, dto);
            entity.setValor(item.getValor());
            entity.setDataCompetencia(item.getDataCompetencia().withDayOfMonth(1));
            entity.setDataVencimento(item.getDataVencimento());
            entity.setDescricao(dto.getDescricao() + (entrada ? " — Entrada" : " — " + numeroParcela + "/" + totalParcelas));
            entity = repository.save(entity);
            historico.registrar(entity, null, EventoFinanceiroEnum.CRIACAO_LANCAMENTO,
                    "Parcela criada no grupo " + grupoId);
            if (primeiro == null) primeiro = entity;
        }
        return toDTO(primeiro);
    }

    private List<LancamentoFinanceiro> findParcelamentoOwned(String parcelamentoId) {
        List<LancamentoFinanceiro> parcelas = repository
                .findByParcelamentoIdAndEmpresaIdAndExcluidoFalseOrderByNumeroParcela(
                        parcelamentoId, empresaAtual.get().getId());
        if (parcelas.isEmpty()) {
            throw new ApplicationException("Parcelamento não encontrado");
        }
        return parcelas;
    }

    private LancamentoFinanceiroDTO criarRecorrencia(LancamentoFinanceiroCreateDTO dto) {
        if (Boolean.TRUE.equals(dto.getBaixarAutomaticamente())) {
            throw new ApplicationException("A baixa automática não está disponível para recorrências");
        }
        recorrenciaValidator.validar(dto.getPeriodicidadeRecorrencia(), dto.getRecorrencias());
        String grupoId = UUID.randomUUID().toString();
        int total = dto.getRecorrencias().size();
        LancamentoFinanceiro primeiro = null;
        for (int indice = 0; indice < total; indice++) {
            RecorrenciaLancamentoCreateDTO item = dto.getRecorrencias().get(indice);
            LancamentoFinanceiro entity = LancamentoFinanceiro.builder()
                    .empresa(empresaAtual.get())
                    .situacao(SituacaoLancamentoEnum.ABERTO)
                    .recorrenciaId(grupoId)
                    .numeroRecorrencia(indice + 1)
                    .totalRecorrencias(total)
                    .periodicidadeRecorrencia(dto.getPeriodicidadeRecorrencia())
                    .build();
            apply(entity, dto);
            entity.setValor(item.getValor());
            entity.setDataCompetencia(item.getDataCompetencia().withDayOfMonth(1));
            entity.setDataVencimento(item.getDataVencimento());
            entity.setDescricao(dto.getDescricao() + " — Recorrência " + (indice + 1) + "/" + total);
            entity = repository.save(entity);
            historico.registrar(entity, null, EventoFinanceiroEnum.CRIACAO_LANCAMENTO,
                    "Ocorrência criada no grupo " + grupoId);
            if (primeiro == null) primeiro = entity;
        }
        return toDTO(primeiro);
    }

    private List<LancamentoFinanceiro> findRecorrenciaOwned(String recorrenciaId) {
        List<LancamentoFinanceiro> ocorrencias = repository
                .findByRecorrenciaIdAndEmpresaIdAndExcluidoFalseOrderByNumeroRecorrencia(
                        recorrenciaId, empresaAtual.get().getId());
        if (ocorrencias.isEmpty()) {
            throw new ApplicationException("Recorrência não encontrada");
        }
        return ocorrencias;
    }

    private void atualizarGrupo(List<LancamentoFinanceiro> grupo, GrupoLancamentoUpdateDTO dto, String nomeItem) {
        for (ItemGrupoLancamentoUpdateDTO item : dto.getItens()) {
            if (item.getDataVencimento() == null) {
                throw new ApplicationException("Informe a data de vencimento de todos os itens do grupo");
            }
            if (item.getDataCompetencia() == null) {
                throw new ApplicationException("Informe a competência de todos os itens do grupo");
            }
            if (item.getValor() == null || item.getValor().signum() <= 0) {
                throw new ApplicationException("Informe um valor maior que zero para todos os itens do grupo");
            }
        }
        Map<Long, ItemGrupoLancamentoUpdateDTO> informados = dto.getItens().stream()
                .collect(Collectors.toMap(ItemGrupoLancamentoUpdateDTO::getId, Function.identity(),
                        (primeiro, segundo) -> primeiro));
        if (informados.size() != grupo.size()
                || grupo.stream().anyMatch(item -> !informados.containsKey(item.getId()))) {
            throw new ApplicationException("Informe todos os lançamentos pertencentes ao grupo");
        }
        for (LancamentoFinanceiro entity : grupo) {
            if (entity.getSituacao() == SituacaoLancamentoEnum.CANCELADO) {
                throw new ApplicationException("Grupos cancelados não podem ser alterados");
            }
            ItemGrupoLancamentoUpdateDTO item = informados.get(entity.getId());
            BigDecimal liquidado = total(entity.getId());
            if (liquidado.signum() > 0) {
                if (item.getValor().compareTo(entity.getValor()) != 0
                        || !item.getDataCompetencia().withDayOfMonth(1).equals(entity.getDataCompetencia())
                        || !item.getDataVencimento().equals(entity.getDataVencimento())) {
                    throw new ApplicationException("A " + nomeItem + " " + entity.getId()
                            + " possui baixa e não pode ter valor ou datas alterados");
                }
                continue;
            }
            LancamentoFinanceiroCreateDTO comum = LancamentoFinanceiroCreateDTO.builder()
                    .descricao(dto.getDescricao())
                    .tipo(entity.getTipo())
                    .categoriaId(dto.getCategoriaId())
                    .pessoaId(dto.getPessoaId())
                    .valor(item.getValor())
                    .dataCompetencia(item.getDataCompetencia())
                    .dataVencimento(item.getDataVencimento())
                    .ativo(dto.getAtivo())
                    .observacao(dto.getObservacao())
                    .documentoFiscalEmitido(dto.getDocumentoFiscalEmitido())
                    .build();
            apply(entity, comum);
            String sufixo = entity.getParcelamentoId() != null
                    ? (Boolean.TRUE.equals(entity.getParcelaEntrada()) ? " — Entrada"
                    : " — " + entity.getNumeroParcela() + "/" + entity.getTotalParcelas())
                    : " — Recorrência " + entity.getNumeroRecorrencia() + "/" + entity.getTotalRecorrencias();
            entity.setDescricao(dto.getDescricao() + sufixo);
            repository.save(entity);
            historico.registrar(entity, null, EventoFinanceiroEnum.ALTERACAO_LANCAMENTO,
                    "Grupo financeiro alterado");
        }
    }

    private String usuarioAtual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void validarPeriodoAberto(Empresa empresa, java.time.LocalDate competencia) {
        if (competencia == null) return;
        boolean fechado = fechamentosMei.findByEmpresaIdAndAnoAndMes(empresa.getId(),
                        competencia.getYear(), competencia.getMonthValue())
                .map(item -> item.getSituacao() == SituacaoApuracaoMeiEnum.FECHADA).orElse(false);
        if (fechado) {
            throw new ApplicationException("A apuração desta competência está fechada. Reabra o mês antes de alterar lançamentos");
        }
    }
}
