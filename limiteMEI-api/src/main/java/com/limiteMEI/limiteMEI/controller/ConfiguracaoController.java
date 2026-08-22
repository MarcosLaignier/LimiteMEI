package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteDTO;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoAlertaLimiteUpdateDTO;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoGeralDTO;
import com.limiteMEI.limiteMEI.dto.configuracao.ConfiguracaoGeralUpdateDTO;
import com.limiteMEI.limiteMEI.service.ConfiguracaoAlertaLimiteService;
import com.limiteMEI.limiteMEI.service.ConfiguracaoGeralService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configuracoes")
public class ConfiguracaoController {
    private final ConfiguracaoAlertaLimiteService alertasLimite;
    private final ConfiguracaoGeralService gerais;

    public ConfiguracaoController(ConfiguracaoAlertaLimiteService alertasLimite,
                                  ConfiguracaoGeralService gerais) {
        this.alertasLimite = alertasLimite;
        this.gerais = gerais;
    }

    @GetMapping("/gerais")
    public ConfiguracaoGeralDTO carregarGerais() {
        return gerais.carregar();
    }

    @PutMapping("/gerais")
    public ConfiguracaoGeralDTO atualizarGerais(@RequestBody ConfiguracaoGeralUpdateDTO dto) {
        return gerais.atualizar(dto);
    }

    @GetMapping("/alertas-limite")
    public List<ConfiguracaoAlertaLimiteDTO> listarAlertasLimite() {
        return alertasLimite.listar();
    }

    @PutMapping("/alertas-limite")
    public List<ConfiguracaoAlertaLimiteDTO> atualizarAlertasLimite(
            @Valid @RequestBody List<@Valid ConfiguracaoAlertaLimiteUpdateDTO> alertas) {
        return alertasLimite.atualizar(alertas);
    }
}
