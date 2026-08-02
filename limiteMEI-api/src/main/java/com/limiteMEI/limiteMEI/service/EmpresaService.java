package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaCreateDTO;
import com.limiteMEI.limiteMEI.dto.empresa.EmpresaDTO;
import com.limiteMEI.limiteMEI.mapper.EmpresaMapper;
import com.limiteMEI.limiteMEI.repository.EmpresaRepository;
import com.limiteMEI.limiteMEI.repository.UsuarioRepository;
import com.limiteMEI.limiteMEI.utils.BaseService;
import com.limiteMEI.limiteMEI.utils.validate.GenericUniqueValidator;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmpresaService extends BaseService<Empresa, Long, EmpresaCreateDTO, EmpresaDTO> {

    private final EmpresaRepository repository;
    private final EmpresaMapper mapper;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaService categoriaService;

    public EmpresaService(
            EmpresaRepository repository,
            EmpresaMapper mapper,
            GenericUniqueValidator validator,
            UsuarioRepository usuarioRepository,
            CategoriaService categoriaService
    ) {
        super(validator);
        this.repository = repository;
        this.mapper = mapper;
        this.usuarioRepository = usuarioRepository;
        this.categoriaService = categoriaService;
    }

    @Override
    protected EmpresaRepository getRepository() {
        return repository;
    }

    @Override
    protected EmpresaMapper getMapper() {
        return mapper;
    }

    @Override
    protected void validate(Empresa empresa) {
        if (empresa.getDataEncerramento() != null && empresa.getDataAbertura() != null
                && empresa.getDataEncerramento().isBefore(empresa.getDataAbertura())) {
            throw new ApplicationException("A data de encerramento não pode ser anterior à data de abertura");
        }
        super.validate(empresa);
    }

    @Override
    protected void beforeSave(Empresa empresa) {
        empresa.setUsuario(usuarioRepository.findByEmail(currentEmail())
                .orElseThrow(() -> new ApplicationException("Usuário autenticado não encontrado")));
    }

    @Override
    protected void afterSave(Empresa empresa) {
        categoriaService.criarCategoriasIniciais(empresa);
    }

    @Override
    public EmpresaDTO getById(Long id) {
        return mapper.toDTO(findOwned(id));
    }

    @Override
    public List<EmpresaDTO> findAll() {
        return repository.findByUsuarioEmail(currentEmail())
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public EmpresaDTO update(Long id, EmpresaCreateDTO dto) {
        Empresa empresa = findOwned(id);
        mapper.updateEntity(empresa, dto);
        validate(empresa);
        beforeUpdate(empresa);
        empresa = repository.save(empresa);
        afterUpdate(empresa);
        return mapper.toDTO(empresa);
    }

    @Override
    public void delete(Long id) {
        Empresa empresa = findOwned(id);
        validateDelete(empresa);
        beforeDelete(empresa);
        repository.delete(empresa);
        afterDelete(empresa);
    }

    private Empresa findOwned(Long id) {
        return repository.findByIdAndUsuarioEmail(id, currentEmail())
                .orElseThrow(() -> new ApplicationException("Empresa não encontrada"));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
