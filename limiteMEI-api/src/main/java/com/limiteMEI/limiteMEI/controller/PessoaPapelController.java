package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.pessoa.PessoaDTO;
import com.limiteMEI.limiteMEI.enums.PapelPessoaEnum;
import com.limiteMEI.limiteMEI.service.PessoaPapelService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pessoas-papeis")
public class PessoaPapelController {

    private final PessoaPapelService service;

    public PessoaPapelController(PessoaPapelService service) {
        this.service = service;
    }

    @GetMapping("/{papel}")
    public ResponseEntity<List<PessoaDTO>> listar(@PathVariable PapelPessoaEnum papel) {
        return ResponseEntity.ok(service.listar(papel));
    }

    @PostMapping("/{papel}/{pessoaId}")
    public ResponseEntity<PessoaDTO> adicionar(
            @PathVariable PapelPessoaEnum papel,
            @PathVariable Long pessoaId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionar(pessoaId, papel));
    }
}
