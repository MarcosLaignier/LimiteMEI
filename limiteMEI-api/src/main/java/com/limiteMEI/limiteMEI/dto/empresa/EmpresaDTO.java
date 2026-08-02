package com.limiteMEI.limiteMEI.dto.empresa;

import lombok.*;
import com.limiteMEI.limiteMEI.enums.TipoEmpresaEnum;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaDTO {

    private Long id;

    private Long usuarioId;

    private String cnpj;

    private String razaoSocial;

    private String nomeFantasia;

    private LocalDate dataAbertura;

    private TipoEmpresaEnum tipoEmpresa;

    private BigDecimal limiteAnual;

    private Boolean ativo;

    private LocalDate dataEncerramento;
}
