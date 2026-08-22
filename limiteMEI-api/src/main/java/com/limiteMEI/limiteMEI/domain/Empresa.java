package com.limiteMEI.limiteMEI.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.*;
import com.limiteMEI.limiteMEI.enums.TipoEmpresaEnum;


@Entity
@Table(name = "empresa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column(nullable = false)
    private String razaoSocial;

    private String nomeFantasia;

    @Column(nullable = false)
    private LocalDate dataAbertura;

    private LocalDate dataInicioSimei;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEmpresaEnum tipoEmpresa;

    @Column(nullable = false)
    private BigDecimal limiteAnual;

    @Column(nullable = false)
    private Boolean ativo = true;

    private LocalDate dataEncerramento;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] logoConteudo;

    private String logoContentType;

    private String logoNome;

}
