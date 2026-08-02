package com.limiteMEI.limiteMEI.utils;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.enums.RoleEnum;
import com.limiteMEI.limiteMEI.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria os dados mínimos necessários para o ambiente de desenvolvimento.
 * A carga é idempotente: o administrador não é recriado quando o e-mail já existe.
 */
@Component
public class DataBaseLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean adminEnabled;
    private final String adminName;
    private final String adminEmail;
    private final String adminPassword;

    public DataBaseLoader(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.enabled}") boolean adminEnabled,
            @Value("${app.admin.name}") String adminName,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEnabled = adminEnabled;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (!adminEnabled) {
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        if (usuarioRepository.existsByEmail(normalizedEmail)) {
            return;
        }

        Usuario admin = Usuario.builder()
                .nome(adminName.trim())
                .email(normalizedEmail)
                .senhaHash(passwordEncoder.encode(adminPassword))
                .roleEnum(RoleEnum.ADMIN)
                .ativo(true)
                .build();

        usuarioRepository.save(admin);
    }
}
