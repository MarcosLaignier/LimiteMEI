package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleEnum roleEnum;

    @Column(nullable = false)
    private Boolean ativo = true;

}