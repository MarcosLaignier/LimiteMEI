package com.limiteMEI.limiteMEI.domain;

import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "pessoa_papel",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_pessoa_papel",
                columnNames = {"pessoa_id", "papel"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PessoaPapel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pessoa_id", nullable = false)
    private Pessoa pessoa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PapelPessoaEnum papel;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;
}
