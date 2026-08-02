package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.auth.LoginRequestDTO;
import com.limiteMEI.limiteMEI.dto.auth.LoginResponseDTO;
import com.limiteMEI.limiteMEI.dto.auth.RegisterRequestDTO;
import com.limiteMEI.limiteMEI.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return service.login(request);
    }

    @GetMapping("/me")
    public LoginResponseDTO me(Authentication authentication) {
        return service.currentUser(authentication.getName());
    }
}
