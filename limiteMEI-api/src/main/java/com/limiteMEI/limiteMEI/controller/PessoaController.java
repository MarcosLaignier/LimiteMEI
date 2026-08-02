package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.Pessoa;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaCreateDTO;
import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO;
import com.limiteMEI.limiteMEI.service.PessoaService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pessoas")
public class PessoaController extends BaseController<Pessoa, PessoaDTO, PessoaCreateDTO, Long> {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @Override
    protected PessoaService getService() {
        return service;
    }

    @GetMapping("/pesquisar")
    public ResponseEntity<List<PessoaDTO>> pesquisar(@RequestParam String termo) {
        return ResponseEntity.ok(service.pesquisar(termo));
    }
}
