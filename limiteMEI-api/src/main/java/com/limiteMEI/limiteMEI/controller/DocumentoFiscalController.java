package com.limiteMEI.limiteMEI.controller;

import com.limiteMEI.limiteMEI.dto.documentofiscal.*;
import com.limiteMEI.limiteMEI.service.DocumentoFiscalService;
import com.limiteMEI.limiteMEI.service.DocumentoFiscalXmlService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/documentos-fiscais")
public class DocumentoFiscalController {
    private final DocumentoFiscalService service;
    private final DocumentoFiscalXmlService xmlService;

    public DocumentoFiscalController(DocumentoFiscalService service, DocumentoFiscalXmlService xmlService) {
        this.service = service;
        this.xmlService = xmlService;
    }

    @GetMapping
    public List<DocumentoFiscalDTO> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public DocumentoFiscalDTO getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public ResponseEntity<DocumentoFiscalDTO> create(@Valid @RequestBody DocumentoFiscalCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public DocumentoFiscalDTO update(@PathVariable Long id, @Valid @RequestBody DocumentoFiscalCreateDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PostMapping(value = "/importar-xml", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentoFiscalXmlPreviewDTO importarXml(@RequestPart("arquivo") MultipartFile arquivo) {
        return xmlService.importar(arquivo);
    }
}
