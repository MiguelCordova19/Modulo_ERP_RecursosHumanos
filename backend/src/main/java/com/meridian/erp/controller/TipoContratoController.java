package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoContrato;
import com.meridian.erp.service.TipoContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos-contrato")
@CrossOrigin(origins = "*")
public class TipoContratoController {
    
    @Autowired
    private TipoContratoService tipoContratoService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoContrato>>> obtenerTodos() {
        try {
            List<TipoContrato> tiposContrato = tipoContratoService.obtenerTodosActivos();
            return ResponseEntity.ok(new ApiResponse<>(true, "Tipos de contrato obtenidos exitosamente", tiposContrato));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Error al obtener tipos de contrato: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoContrato>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<TipoContrato> tipoContrato = tipoContratoService.obtenerPorId(id);
            if (tipoContrato.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Tipo de contrato encontrado", tipoContrato.get()));
            } else {
                return ResponseEntity.status(404)
                        .body(new ApiResponse<>(false, "Tipo de contrato no encontrado", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Error al obtener tipo de contrato: " + e.getMessage(), null));
        }
    }
}
