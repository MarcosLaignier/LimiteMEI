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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class EmpresaService extends BaseService<Empresa, Long, EmpresaCreateDTO, EmpresaDTO> {
    private static final long TAMANHO_MAXIMO_LOGO = 1024 * 1024;
    private static final Set<String> CONTENT_TYPES_LOGO = Set.of("image/png", "image/jpeg", "image/webp");

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
        if (empresa.getDataInicioSimei() != null && empresa.getDataAbertura() != null
                && empresa.getDataInicioSimei().isBefore(empresa.getDataAbertura())) {
            throw new ApplicationException("A data de início no SIMEI não pode ser anterior à data de abertura");
        }
        if (empresa.getDataEncerramento() != null && empresa.getDataAbertura() != null
                && empresa.getDataEncerramento().isBefore(empresa.getDataAbertura())) {
            throw new ApplicationException("A data de encerramento não pode ser anterior à data de abertura");
        }
        if (empresa.getDataEncerramento() != null && empresa.getDataInicioSimei() != null
                && empresa.getDataEncerramento().isBefore(empresa.getDataInicioSimei())) {
            throw new ApplicationException("A data de encerramento não pode ser anterior ao início no SIMEI");
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

    public EmpresaDTO salvarLogo(Long id, MultipartFile arquivo) {
        Empresa empresa = findOwned(id);
        validarLogo(arquivo);
        try {
            empresa.setLogoConteudo(arquivo.getBytes());
            empresa.setLogoContentType(arquivo.getContentType());
            empresa.setLogoNome(arquivo.getOriginalFilename());
            return mapper.toDTO(repository.save(empresa));
        } catch (IOException e) {
            throw new ApplicationException("Não foi possível ler o arquivo da logo");
        }
    }

    public EmpresaDTO removerLogo(Long id) {
        Empresa empresa = findOwned(id);
        empresa.setLogoConteudo(null);
        empresa.setLogoContentType(null);
        empresa.setLogoNome(null);
        return mapper.toDTO(repository.save(empresa));
    }

    private Empresa findOwned(Long id) {
        return repository.findByIdAndUsuarioEmail(id, currentEmail())
                .orElseThrow(() -> new ApplicationException("Empresa não encontrada"));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void validarLogo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ApplicationException("Selecione uma imagem para a logo");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_LOGO) {
            throw new ApplicationException("A logo deve ter no máximo 1MB");
        }
        if (!CONTENT_TYPES_LOGO.contains(arquivo.getContentType())) {
            throw new ApplicationException("A logo deve ser PNG, JPG ou WEBP");
        }
    }
}
