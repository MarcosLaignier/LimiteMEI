package com.limiteMEI.limiteMEI.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.*;


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

    @Column(nullable = false)
    private BigDecimal limiteAnual;

    @Column(nullable = false)
    private Boolean ativo = true;

}