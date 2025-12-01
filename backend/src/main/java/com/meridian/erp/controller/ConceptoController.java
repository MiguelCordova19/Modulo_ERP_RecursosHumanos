package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Concepto;
import com.meridian.erp.service.ConceptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conceptos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConceptoController {
    
    private final ConceptoService conceptoService;
    
    /**
     * GET /api/conceptos?empresaId=1
     * Listar conceptos por empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Concepto>>> listar(@RequestParam Integer empresaId) {
        try {
            List<Concepto> conceptos = conceptoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Conceptos obtenidos exitosamente", conceptos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos/{id}
     * Obtener concepto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Concepto>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Concepto> concepto = conceptoService.obtenerPorId(id);
            
            if (concepto.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Concepto obtenido exitosamente", concepto.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Concepto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener concepto: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/conceptos
     * Crear nuevo concepto
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Concepto>> crear(
            @RequestBody Concepto concepto,
            @RequestParam Long usuarioId) {
        try {
            Concepto nuevoConcepto = conceptoService.crear(concepto, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Concepto creado exitosamente", nuevoConcepto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear concepto: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/conceptos/{id}
     * Actualizar concepto
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Concepto>> actualizar(
            @PathVariable Long id,
            @RequestBody Concepto concepto,
            @RequestParam Long usuarioId) {
        try {
            Concepto conceptoActualizado = conceptoService.actualizar(id, concepto, usuarioId);
            
            if (conceptoActualizado != null) {
                return ResponseEntity.ok(
                    ApiResponse.success("Concepto actualizado exitosamente", conceptoActualizado)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Concepto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar concepto: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/conceptos/{id}
     * Eliminar concepto (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = conceptoService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Concepto eliminado exitosamente", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Concepto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar concepto: " + e.getMessage()));
        }
    }
}
