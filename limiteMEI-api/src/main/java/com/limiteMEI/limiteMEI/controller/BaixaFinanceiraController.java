package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.baixa.*;
import com.limiteMEI.limiteMEI.service.BaixaFinanceiraService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/lancamentos-financeiros/{lancamentoId}/baixas")
public class BaixaFinanceiraController {
    private final BaixaFinanceiraService service;
    public BaixaFinanceiraController(BaixaFinanceiraService service) { this.service = service; }

    @GetMapping
    public List<BaixaFinanceiraDTO> findAll(@PathVariable Long lancamentoId) { return service.findAll(lancamentoId); }
    @PostMapping
    public ResponseEntity<BaixaFinanceiraDTO> create(@PathVariable Long lancamentoId,
                                                      @Valid @RequestBody BaixaFinanceiraCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(lancamentoId, dto));
    }
    @DeleteMapping("/{baixaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long lancamentoId, @PathVariable Long baixaId) { service.delete(lancamentoId, baixaId); }
}
