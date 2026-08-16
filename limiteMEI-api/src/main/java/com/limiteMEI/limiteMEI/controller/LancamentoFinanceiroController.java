package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.lancamento.*;
import com.limiteMEI.limiteMEI.service.LancamentoFinanceiroService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/lancamentos-financeiros")
public class LancamentoFinanceiroController {
    private final LancamentoFinanceiroService service;
    public LancamentoFinanceiroController(LancamentoFinanceiroService service) { this.service = service; }

    @GetMapping
    public List<LancamentoFinanceiroDTO> findAll() { return service.findAll(); }
    @GetMapping("/{id}")
    public LancamentoFinanceiroDTO getById(@PathVariable Long id) { return service.getById(id); }
    @PostMapping
    public ResponseEntity<LancamentoFinanceiroDTO> create(@Valid @RequestBody LancamentoFinanceiroCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
    @PutMapping("/{id}")
    public LancamentoFinanceiroDTO update(@PathVariable Long id, @Valid @RequestBody LancamentoFinanceiroCreateDTO dto) {
        return service.update(id, dto);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PostMapping("/{id}/cancelamento")
    public LancamentoFinanceiroDTO cancelar(@PathVariable Long id, @Valid @RequestBody MotivoOperacaoDTO dto) {
        return service.cancelar(id, dto);
    }

    @GetMapping("/{id}/historico")
    public List<HistoricoFinanceiroDTO> historico(@PathVariable Long id) {
        return service.historico(id);
    }

    @GetMapping("/parcelamentos/{parcelamentoId}")
    public List<LancamentoFinanceiroDTO> parcelas(@PathVariable String parcelamentoId) {
        return service.parcelas(parcelamentoId);
    }

    @PutMapping("/parcelamentos/{parcelamentoId}")
    public List<LancamentoFinanceiroDTO> atualizarParcelamento(@PathVariable String parcelamentoId,
                                                                @Valid @RequestBody GrupoLancamentoUpdateDTO dto) {
        return service.atualizarParcelamento(parcelamentoId, dto);
    }

    @PostMapping("/parcelamentos/{parcelamentoId}/cancelamento")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarParcelamento(@PathVariable String parcelamentoId,
                                     @Valid @RequestBody MotivoOperacaoDTO dto) {
        service.cancelarParcelamento(parcelamentoId, dto);
    }

    @DeleteMapping("/parcelamentos/{parcelamentoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirParcelamento(@PathVariable String parcelamentoId) {
        service.excluirParcelamento(parcelamentoId);
    }

    @GetMapping("/recorrencias/{recorrenciaId}")
    public List<LancamentoFinanceiroDTO> recorrencias(@PathVariable String recorrenciaId) {
        return service.recorrencias(recorrenciaId);
    }

    @PutMapping("/recorrencias/{recorrenciaId}")
    public List<LancamentoFinanceiroDTO> atualizarRecorrencia(@PathVariable String recorrenciaId,
                                                               @Valid @RequestBody GrupoLancamentoUpdateDTO dto) {
        return service.atualizarRecorrencia(recorrenciaId, dto);
    }

    @PostMapping("/recorrencias/{recorrenciaId}/cancelamento")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarRecorrencia(@PathVariable String recorrenciaId,
                                    @Valid @RequestBody MotivoOperacaoDTO dto) {
        service.cancelarRecorrencia(recorrenciaId, dto);
    }

    @DeleteMapping("/recorrencias/{recorrenciaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirRecorrencia(@PathVariable String recorrenciaId) {
        service.excluirRecorrencia(recorrenciaId);
    }
}
