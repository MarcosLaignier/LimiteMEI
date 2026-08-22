package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.domain.ObrigacaoMei;
import com.limiteMEI.limiteMEI.dto.mei.ObrigacaoMeiCreateDTO;
import com.limiteMEI.limiteMEI.dto.mei.ObrigacaoMeiDTO;
import com.limiteMEI.limiteMEI.service.ObrigacaoMeiService;
import com.limiteMEI.limiteMEI.utils.BaseController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/obrigacoes-mei")
public class ObrigacaoMeiController extends BaseController<ObrigacaoMei, ObrigacaoMeiDTO, ObrigacaoMeiCreateDTO, Long> {
    private final ObrigacaoMeiService service;

    public ObrigacaoMeiController(ObrigacaoMeiService service) {
        this.service = service;
    }

    @Override
    protected ObrigacaoMeiService getService() {
        return service;
    }

    @GetMapping("/exercicio/{ano}")
    public ResponseEntity<List<ObrigacaoMeiDTO>> listarExercicio(@PathVariable Integer ano) {
        return ResponseEntity.ok(service.listarExercicio(ano));
    }

    @PostMapping("/{id}/comprovante")
    public ResponseEntity<ObrigacaoMeiDTO> salvarComprovante(@PathVariable Long id,
                                                             @RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.ok(service.salvarComprovante(id, arquivo));
    }

    @DeleteMapping("/{id}/comprovante")
    public ResponseEntity<Void> removerComprovante(@PathVariable Long id) {
        service.removerComprovante(id);
        return ResponseEntity.noContent().build();
    }
}
