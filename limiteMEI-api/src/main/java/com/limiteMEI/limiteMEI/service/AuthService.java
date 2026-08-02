package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Usuario;
import com.limiteMEI.limiteMEI.dto.auth.LoginRequestDTO;
import com.limiteMEI.limiteMEI.dto.auth.LoginResponseDTO;
import com.limiteMEI.limiteMEI.dto.auth.RegisterRequestDTO;
import com.limiteMEI.limiteMEI.enums.RoleEnum;
import com.limiteMEI.limiteMEI.repository.UsuarioRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponseDTO register(RegisterRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase();
        if (repository.existsByEmail(email)) {
            throw new ApplicationException("Já existe uma conta com este e-mail");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome().trim())
                .email(email)
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .roleEnum(RoleEnum.USER)
                .ativo(true)
                .build();
        return response(repository.save(usuario));
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getSenha()));
        return response(repository.findByEmail(email)
                .orElseThrow(() -> new ApplicationException("Usuário não encontrado")));
    }

    public LoginResponseDTO currentUser(String email) {
        return response(repository.findByEmail(email)
                .orElseThrow(() -> new ApplicationException("Usuário não encontrado")));
    }

    private LoginResponseDTO response(Usuario usuario) {
        return LoginResponseDTO.builder()
                .token(jwtService.generate(usuario))
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRoleEnum().name())
                .build();
    }
}
