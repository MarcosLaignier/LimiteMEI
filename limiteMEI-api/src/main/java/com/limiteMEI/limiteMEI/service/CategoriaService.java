package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaCreateDTO;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaDTO;
import com.limiteMEI.limiteMEI.mapper.CategoriaMapper;
import com.limiteMEI.limiteMEI.repository.CategoriaRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import com.limiteMEI.limiteMEI.enums.NaturezaReceitaEnum;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import java.util.List;

@Service
public class CategoriaService extends BaseService<Categoria, Long, CategoriaCreateDTO, CategoriaDTO> {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;
    private final EmpresaAtualService empresaAtualService;

    public CategoriaService(
            CategoriaRepository repository,
            CategoriaMapper mapper,
            GenericUniqueValidator validator,
            EmpresaAtualService empresaAtualService
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
        this.empresaAtualService = empresaAtualService;
    }

    @Override
    protected CategoriaRepository getRepository() {
        return repository;
    }

    @Override
    protected CategoriaMapper getMapper() {
        return mapper;
    }

    @Override
    protected void beforeSave(Categoria categoria) {
        categoria.setEmpresa(empresaAtualService.get());
    }

    @Override
    protected void validate(Categoria categoria) {
        if (categoria.getTipo() == TipoMovimentoEnum.RECEITA && categoria.getNaturezaReceita() == null) {
            throw new ApplicationException("A natureza da receita é obrigatória para categorias de receita");
        }
        if (categoria.getTipo() == TipoMovimentoEnum.DESPESA) {
            categoria.setNaturezaReceita(null);
        }
        super.validate(categoria);
    }

    @Override
    public CategoriaDTO getById(Long id) {
        return mapper.toDTO(findOwned(id));
    }

    @Override
    public List<CategoriaDTO> findAll() {
        Empresa empresa = empresaAtualService.get();
        return repository.findByEmpresa(empresa).stream().map(mapper::toDTO).toList();
    }

    @Override
    public CategoriaDTO update(Long id, CategoriaCreateDTO dto) {
        Categoria categoria = findOwned(id);
        mapper.updateEntity(categoria, dto);
        validate(categoria);
        categoria = repository.save(categoria);
        return mapper.toDTO(categoria);
    }

    @Override
    public void delete(Long id) {
        Categoria categoria = findOwned(id);
        validateDelete(categoria);
        repository.delete(categoria);
    }

    public void criarCategoriasIniciais(Empresa empresa) {
        criarSeAusente(empresa, "Vendas", TipoMovimentoEnum.RECEITA, NaturezaReceitaEnum.COMERCIO);
        criarSeAusente(empresa, "Serviços", TipoMovimentoEnum.RECEITA, NaturezaReceitaEnum.SERVICOS);
        criarSeAusente(empresa, "Aluguel", TipoMovimentoEnum.DESPESA, null);
        criarSeAusente(empresa, "Fornecedores", TipoMovimentoEnum.DESPESA, null);
    }

    private void criarSeAusente(Empresa empresa, String nome, TipoMovimentoEnum tipo, NaturezaReceitaEnum natureza) {
        if (!repository.existsByEmpresaIdAndNomeIgnoreCaseAndTipo(empresa.getId(), nome, tipo)) {
            repository.save(Categoria.builder().nome(nome).tipo(tipo).naturezaReceita(natureza).ativo(true).empresa(empresa).build());
        }
    }

    private Categoria findOwned(Long id) {
        Empresa empresa = empresaAtualService.get();
        return repository.findByIdAndEmpresaIdAndEmpresaUsuarioEmail(id, empresa.getId(), currentEmail())
                .orElseThrow(() -> new ApplicationException("Categoria não encontrada"));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
