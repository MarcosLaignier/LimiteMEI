package com.limiteMEI.limiteMEI.mapper;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaCreateDTO;
import com.limiteMEI.limiteMEI.dto.categoria.CategoriaDTO;
import com.limiteMEI.limiteMEI.utils.BaseMapper;
import org.springframework.stereotype.Component;
import com.limiteMEI.limiteMEI.enums.ExigenciaPessoaEnum;

@Component
public class CategoriaMapper implements BaseMapper<Categoria, CategoriaDTO, CategoriaCreateDTO> {

    @Override
    public CategoriaDTO toDTO(Categoria categoria) {
        if (categoria == null) return null;

        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .tipo(categoria.getTipo())
                .naturezaReceita(categoria.getNaturezaReceita())
                .exigenciaPessoa(categoria.getExigenciaPessoa() == null ? ExigenciaPessoaEnum.NAO_UTILIZA : categoria.getExigenciaPessoa())
                .papelPessoa(categoria.getPapelPessoa())
                .compoeFaturamentoMei(Boolean.TRUE.equals(categoria.getCompoeFaturamentoMei()))
                .exigeDocumentoFiscal(Boolean.TRUE.equals(categoria.getExigeDocumentoFiscal()))
                .ativo(categoria.getAtivo())
                .build();
    }

    @Override
    public Categoria toEntity(CategoriaCreateDTO createDTO) {
        if (createDTO == null) return null;

        return Categoria.builder()
                .nome(createDTO.getNome())
                .tipo(createDTO.getTipo())
                .naturezaReceita(createDTO.getNaturezaReceita())
                .exigenciaPessoa(createDTO.getExigenciaPessoa())
                .papelPessoa(createDTO.getPapelPessoa())
                .compoeFaturamentoMei(Boolean.TRUE.equals(createDTO.getCompoeFaturamentoMei()))
                .exigeDocumentoFiscal(Boolean.TRUE.equals(createDTO.getExigeDocumentoFiscal()))
                .ativo(createDTO.getAtivo() == null ? true : createDTO.getAtivo())
                .build();
    }

    @Override
    public void updateEntity(Categoria categoria, CategoriaCreateDTO dto) {
        categoria.setNome(dto.getNome());
        categoria.setTipo(dto.getTipo());
        categoria.setNaturezaReceita(dto.getNaturezaReceita());
        categoria.setExigenciaPessoa(dto.getExigenciaPessoa());
        categoria.setPapelPessoa(dto.getPapelPessoa());
        categoria.setCompoeFaturamentoMei(Boolean.TRUE.equals(dto.getCompoeFaturamentoMei()));
        categoria.setExigeDocumentoFiscal(Boolean.TRUE.equals(dto.getExigeDocumentoFiscal()));
        categoria.setAtivo(dto.getAtivo() == null ? categoria.getAtivo() : dto.getAtivo());
    }
}
