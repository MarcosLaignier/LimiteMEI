package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.domain.ObrigacaoMei;
import com.limiteMEI.limiteMEI.dto.dashboard.DashboardObrigacaoMeiDTO;
import com.limiteMEI.limiteMEI.dto.mei.ObrigacaoMeiCreateDTO;
import com.limiteMEI.limiteMEI.dto.mei.ObrigacaoMeiDTO;
import com.limiteMEI.limiteMEI.enums.SituacaoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.enums.TipoObrigacaoMeiEnum;
import com.limiteMEI.limiteMEI.repository.ObrigacaoMeiRepository;
import com.limiteMEI.limiteMEI.repository.ConfiguracaoGeralRepository;
import com.limiteMEI.limiteMEI.utils.BaseRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.Map;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class ObrigacaoMeiService extends BaseService<ObrigacaoMei, Long, ObrigacaoMeiCreateDTO, ObrigacaoMeiDTO> {
    private static final long TAMANHO_MAXIMO_COMPROVANTE = 2 * 1024 * 1024;

    private final ObrigacaoMeiRepository repository;
    private final EmpresaAtualService empresaAtual;
    private final ConfiguracaoGeralRepository configuracoes;

    public ObrigacaoMeiService(ObrigacaoMeiRepository repository,
                               EmpresaAtualService empresaAtual,
                               GenericUniqueValidator validator,
                               ConfiguracaoGeralRepository configuracoes) {
        super(validator);
        this.repository = repository;
        this.empresaAtual = empresaAtual;
        this.configuracoes = configuracoes;
    }

    @Override
    protected BaseRepository<ObrigacaoMei, Long> getRepository() {
        return repository;
    }

    @Override
    protected com.limiteMEI.limiteMEI.utils.BaseMapper<ObrigacaoMei, ObrigacaoMeiDTO, ObrigacaoMeiCreateDTO> getMapper() {
        throw new UnsupportedOperationException("ObrigacaoMeiService usa mapeamento próprio");
    }

    @Override
    public ObrigacaoMeiDTO save(ObrigacaoMeiCreateDTO dto) {
        Empresa empresa = empresaAtual.get();
        ObrigacaoMei entity = ObrigacaoMei.builder().empresa(empresa).build();
        aplicar(entity, dto);
        validarDuplicidade(entity);
        return toDTO(repository.save(entity));
    }

    @Override
    public ObrigacaoMeiDTO update(Long id, ObrigacaoMeiCreateDTO dto) {
        ObrigacaoMei entity = findOwned(id);
        aplicar(entity, dto);
        validarDuplicidade(entity);
        return toDTO(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findOwned(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ObrigacaoMeiDTO getById(Long id) {
        return toDTO(findOwned(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ObrigacaoMeiDTO> findAll() {
        return repository.findByEmpresaIdOrderByCompetenciaDesc(empresaAtual.get().getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ObrigacaoMeiDTO> listarExercicio(Integer ano) {
        if (ano == null || ano < 2000) {
            throw new ApplicationException("Exercício inválido");
        }
        Empresa empresa = empresaAtual.get();
        YearMonth inicioMei = YearMonth.from(empresa.getDataInicioSimei() == null ? empresa.getDataAbertura() : empresa.getDataInicioSimei());
        YearMonth fimMei = empresa.getDataEncerramento() == null ? YearMonth.of(ano, 12) : YearMonth.from(empresa.getDataEncerramento());
        YearMonth inicioAno = YearMonth.of(ano, 1);
        YearMonth fimAno = YearMonth.of(ano, 12);
        YearMonth inicio = inicioAno.isBefore(inicioMei) ? inicioMei : inicioAno;
        YearMonth fim = fimAno.isAfter(fimMei) ? fimMei : fimAno;
        if (inicio.isAfter(fim)) {
            return List.of();
        }

        Map<LocalDate, ObrigacaoMei> existentes = repository
                .findByEmpresaIdAndCompetenciaBetweenOrderByCompetenciaAsc(empresa.getId(), inicio.atDay(1), fim.atDay(1))
                .stream()
                .collect(Collectors.toMap(ObrigacaoMei::getCompetencia, Function.identity()));
        BigDecimal valorPadrao = configuracoes.findByEmpresaId(empresa.getId())
                .map(item -> item.getValorPadraoDas() == null ? BigDecimal.ZERO : item.getValorPadraoDas())
                .orElse(BigDecimal.ZERO);

        List<ObrigacaoMeiDTO> itens = new java.util.ArrayList<>();
        YearMonth cursor = inicio;
        while (!cursor.isAfter(fim)) {
            LocalDate competencia = cursor.atDay(1);
            ObrigacaoMei existente = existentes.get(competencia);
            itens.add(existente == null ? dtoVirtual(competencia, valorPadrao) : toDTO(existente));
            cursor = cursor.plusMonths(1);
        }
        return itens;
    }

    public ObrigacaoMeiDTO salvarComprovante(Long id, MultipartFile arquivo) {
        ObrigacaoMei entity = findOwned(id);
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ApplicationException("Selecione o comprovante");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_COMPROVANTE) {
            throw new ApplicationException("O comprovante deve ter no máximo 2MB");
        }
        try {
            entity.setComprovanteNome(arquivo.getOriginalFilename());
            entity.setComprovanteContentType(arquivo.getContentType());
            entity.setComprovanteConteudo(arquivo.getBytes());
            return toDTO(repository.save(entity));
        } catch (IOException e) {
            throw new ApplicationException("Não foi possível ler o comprovante");
        }
    }

    public void removerComprovante(Long id) {
        ObrigacaoMei entity = findOwned(id);
        entity.setComprovanteNome(null);
        entity.setComprovanteContentType(null);
        entity.setComprovanteConteudo(null);
        repository.save(entity);
    }

    @Transactional(readOnly = true)
    public DashboardObrigacaoMeiDTO dashboard(Integer ano) {
        List<ObrigacaoMeiDTO> referencias = listarExercicio(ano);
        ObrigacaoMeiDTO proxima = referencias.stream()
                .filter(item -> item.getSituacao() != SituacaoObrigacaoMeiEnum.PAGO)
                .min(Comparator.comparing(ObrigacaoMeiDTO::getVencimento))
                .orElse(null);
        long pagas = referencias.stream()
                .filter(item -> item.getSituacao() == SituacaoObrigacaoMeiEnum.PAGO)
                .count();
        long atrasadas = referencias.stream()
                .filter(item -> item.getSituacao() == SituacaoObrigacaoMeiEnum.ATRASADO)
                .count();
        long emAberto = referencias.stream()
                .filter(item -> item.getSituacao() == SituacaoObrigacaoMeiEnum.PENDENTE)
                .count();
        return DashboardObrigacaoMeiDTO.builder()
                .id(proxima == null ? null : proxima.getId())
                .competencia(proxima == null ? null : proxima.getCompetencia())
                .vencimento(proxima == null ? null : proxima.getVencimento())
                .situacao(proxima == null ? null : proxima.getSituacao())
                .valor(proxima == null ? BigDecimal.ZERO : proxima.getValor())
                .quantidadePendentes(Math.toIntExact(emAberto))
                .quantidadeAtrasadas(Math.toIntExact(atrasadas))
                .quantidadePagas(Math.toIntExact(pagas))
                .quantidadeEmAberto(Math.toIntExact(emAberto))
                .build();
    }

    private void aplicar(ObrigacaoMei entity, ObrigacaoMeiCreateDTO dto) {
        TipoObrigacaoMeiEnum tipo = dto.getTipo() == null ? TipoObrigacaoMeiEnum.DAS_MENSAL : dto.getTipo();
        LocalDate competencia = normalizarCompetencia(dto.getCompetencia());
        SituacaoObrigacaoMeiEnum situacao = dto.getSituacao() == null ? SituacaoObrigacaoMeiEnum.PENDENTE : dto.getSituacao();
        BigDecimal valor = dto.getValor() == null ? BigDecimal.ZERO : dto.getValor();
        if (valor.signum() < 0) {
            throw new ApplicationException("O valor da obrigação não pode ser negativo");
        }
        if (situacao != SituacaoObrigacaoMeiEnum.PAGO) {
            throw new ApplicationException("A referência só pode ser salva quando estiver paga");
        }
        if (dto.getDataPagamento() == null) {
            throw new ApplicationException("Informe a data de pagamento");
        }
        entity.setTipo(tipo);
        entity.setCompetencia(competencia);
        entity.setVencimento(vencimento(tipo, competencia));
        entity.setSituacao(situacao == SituacaoObrigacaoMeiEnum.ATRASADO ? SituacaoObrigacaoMeiEnum.PENDENTE : situacao);
        entity.setValor(valor);
        entity.setDataPagamento(situacao == SituacaoObrigacaoMeiEnum.PAGO ? dto.getDataPagamento() : null);
        entity.setObservacao(normalizar(dto.getObservacao()));
    }

    private LocalDate normalizarCompetencia(LocalDate competencia) {
        if (competencia == null) {
            throw new ApplicationException("Informe a competência");
        }
        return YearMonth.from(competencia).atDay(1);
    }

    private LocalDate vencimento(TipoObrigacaoMeiEnum tipo, LocalDate competencia) {
        return YearMonth.from(competencia).atDay(20);
    }

    private void validarDuplicidade(ObrigacaoMei entity) {
        Long id = entity.getId() == null ? 0L : entity.getId();
        if (repository.existsByEmpresaIdAndTipoAndCompetenciaAndIdNot(entity.getEmpresa().getId(),
                entity.getTipo(), entity.getCompetencia(), id)) {
            throw new ApplicationException("Já existe DAS cadastrado para esta competência");
        }
    }

    private ObrigacaoMei findOwned(Long id) {
        return repository.findByIdAndEmpresaId(id, empresaAtual.get().getId())
                .orElseThrow(() -> new ApplicationException("Obrigação MEI não encontrada"));
    }

    private ObrigacaoMeiDTO toDTO(ObrigacaoMei entity) {
        return ObrigacaoMeiDTO.builder()
                .id(entity.getId())
                .tipo(entity.getTipo())
                .competencia(entity.getCompetencia())
                .vencimento(entity.getVencimento())
                .situacao(situacaoAtual(entity))
                .valor(entity.getValor())
                .dataPagamento(entity.getDataPagamento())
                .observacao(entity.getObservacao())
                .possuiComprovante(entity.getComprovanteConteudo() != null && entity.getComprovanteConteudo().length > 0)
                .comprovanteNome(entity.getComprovanteNome())
                .build();
    }

    private ObrigacaoMeiDTO dtoVirtual(LocalDate competencia, BigDecimal valorPadrao) {
        LocalDate vencimento = vencimento(TipoObrigacaoMeiEnum.DAS_MENSAL, competencia);
        SituacaoObrigacaoMeiEnum situacao = vencimento.isBefore(LocalDate.now())
                ? SituacaoObrigacaoMeiEnum.ATRASADO
                : SituacaoObrigacaoMeiEnum.PENDENTE;
        return ObrigacaoMeiDTO.builder()
                .tipo(TipoObrigacaoMeiEnum.DAS_MENSAL)
                .competencia(competencia)
                .vencimento(vencimento)
                .situacao(situacao)
                .valor(valorPadrao)
                .possuiComprovante(false)
                .build();
    }

    private SituacaoObrigacaoMeiEnum situacaoAtual(ObrigacaoMei entity) {
        if (entity.getSituacao() == SituacaoObrigacaoMeiEnum.PAGO) {
            return SituacaoObrigacaoMeiEnum.PAGO;
        }
        return entity.getVencimento().isBefore(LocalDate.now())
                ? SituacaoObrigacaoMeiEnum.ATRASADO
                : SituacaoObrigacaoMeiEnum.PENDENTE;
    }

    private String normalizar(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
