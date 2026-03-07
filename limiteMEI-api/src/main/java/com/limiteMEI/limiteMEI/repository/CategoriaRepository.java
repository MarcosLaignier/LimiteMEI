package com.limiteMEI.limiteMEI.repository;

import com.limiteMEI.limiteMEI.domain.Categoria;
import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.enums.TipoMovimentoEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByEmpresa(Empresa empresa);

    List<Categoria> findByEmpresaAndTipo(Empresa empresa, TipoMovimentoEnum tipo);

}