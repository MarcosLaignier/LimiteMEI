package com.limiteMEI.limiteMEI.service;

import com.limiteMEI.limiteMEI.domain.Empresa;
import com.limiteMEI.limiteMEI.repository.EmpresaRepository;
import com.limiteMEI.limiteMEI.utils.validate.ApplicationException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EmpresaAtualService {

    public static final String HEADER_EMPRESA_ID = "X-Empresa-Id";

    private final EmpresaRepository empresaRepository;
    private final HttpServletRequest request;

    public EmpresaAtualService(EmpresaRepository empresaRepository, HttpServletRequest request) {
        this.empresaRepository = empresaRepository;
        this.request = request;
    }

    public Empresa get() {
        String empresaId = request.getHeader(HEADER_EMPRESA_ID);
        if (empresaId == null || empresaId.isBlank()) {
            throw new ApplicationException("Selecione uma empresa para continuar");
        }

        try {
            return empresaRepository.findByIdAndUsuarioEmail(Long.valueOf(empresaId), currentEmail())
                    .orElseThrow(() -> new ApplicationException("Empresa não encontrada"));
        } catch (NumberFormatException exception) {
            throw new ApplicationException("Empresa selecionada inválida");
        }
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
