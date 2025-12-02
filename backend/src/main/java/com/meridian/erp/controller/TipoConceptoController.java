package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoConcepto;
import com.meridian.erp.service.TipoConceptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos-concepto")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoConceptoController {
    
    private final TipoConceptoService tipoConceptoService;
    
    /**
     * GET /api/tipos-concepto
     * Listar todos los tipos de concepto activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoConcepto>>> listar() {
        try {
            List<TipoConcepto> tipos = tipoConceptoService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tipos de concepto obtenidos exitosamente", tipos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de concepto: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-concepto/todos
     * Listar todos los tipos de concepto (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<TipoConcepto>>> listarTodos() {
        try {
            List<TipoConcepto> tipos = tipoConceptoService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los tipos de concepto obtenidos exitosamente", tipos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de concepto: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-concepto/{id}
     * Obtener tipo de concepto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoConcepto>> obtenerPorId(@PathVariable String id) {
        try {
            Optional<TipoConcepto> tipo = tipoConceptoService.obtenerPorId(id);
            
            if (tipo.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Tipo de concepto obtenido exitosamente", tipo.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo de concepto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipo de concepto: " + e.getMessage()));
        }
    }
}
