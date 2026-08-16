package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.movimento.*;
import com.limiteMEI.limiteMEI.service.MovimentoFinanceiroService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/movimentos")
public class MovimentoFinanceiroController {
    private final MovimentoFinanceiroService service;
    public MovimentoFinanceiroController(MovimentoFinanceiroService service) { this.service = service; }

    @GetMapping
    public List<MovimentoFinanceiroDTO> findAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public MovimentoFinanceiroDTO getById(@PathVariable Long id) { return service.getById(id); }
    @GetMapping("/extrato/{contaId}")
    public List<MovimentoFinanceiroDTO> extrato(@PathVariable Long contaId,
            @RequestParam(required = false) LocalDate inicio, @RequestParam(required = false) LocalDate fim) {
        return service.extrato(contaId, inicio, fim);
    }
    @GetMapping("/saldo/{contaId}")
    public BigDecimal saldo(@PathVariable Long contaId) { return service.saldo(contaId); }
    @PostMapping
    public ResponseEntity<MovimentoFinanceiroDTO> create(@Valid @RequestBody MovimentoFinanceiroCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }
    @PutMapping("/{id}")
    public MovimentoFinanceiroDTO update(@PathVariable Long id, @Valid @RequestBody MovimentoFinanceiroCreateDTO dto) {
        return service.update(id, dto);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
    @PostMapping("/transferencias")
    public List<MovimentoFinanceiroDTO> transferir(@Valid @RequestBody TransferenciaFinanceiraDTO dto) { return service.transferir(dto); }
    @DeleteMapping("/transferencias/{transferenciaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirTransferencia(@PathVariable String transferenciaId) { service.excluirTransferencia(transferenciaId); }
}
