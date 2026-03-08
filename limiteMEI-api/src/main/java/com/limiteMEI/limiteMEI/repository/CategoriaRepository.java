package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import com.limiteMEI.limiteMEI.utils.BaseRepository;

import java.util.List;

public interface CategoriaRepository extends BaseRepository<Categoria, Long> {

    List<Categoria> findByEmpresa(Empresa empresa);

    List<Categoria> findByEmpresaAndTipo(Empresa empresa, TipoMovimentoEnum tipo);

}