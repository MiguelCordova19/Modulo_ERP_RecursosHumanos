package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoDocumento;
import com.meridian.erp.service.TipoDocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-documento")
@RequiredArgsConstructor
public class TipoDocumentoController {
    
    private final TipoDocumentoService tipoDocumentoService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoDocumento>>> findAll() {
        List<TipoDocumento> tiposDocumento = tipoDocumentoService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Tipos de documento obtenidos", tiposDocumento));
    }
}

