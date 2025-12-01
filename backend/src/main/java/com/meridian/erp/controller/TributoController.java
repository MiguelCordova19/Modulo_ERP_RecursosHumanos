package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Tributo;
import com.meridian.erp.service.TributoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tributos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TributoController {
    
    private final TributoService tributoService;
    
    /**
     * GET /api/tributos
     * Listar todos los tributos activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tributo>>> listar() {
        try {
            List<Tributo> tributos = tributoService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tributos obtenidos exitosamente", tributos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tributos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tributos/buscar?q=texto
     * Buscar tributos por código o descripción (para autocomplete)
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<Tributo>>> buscar(@RequestParam("q") String busqueda) {
        try {
            List<Tributo> tributos = tributoService.buscar(busqueda);
            return ResponseEntity.ok(
                ApiResponse.success("Búsqueda completada", tributos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error en la búsqueda: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tributos/tipo/{tipoId}
     * Listar tributos por tipo
     */
    @GetMapping("/tipo/{tipoId}")
    public ResponseEntity<ApiResponse<List<Tributo>>> listarPorTipo(@PathVariable String tipoId) {
        try {
            List<Tributo> tributos = tributoService.listarPorTipo(tipoId);
            return ResponseEntity.ok(
                ApiResponse.success("Tributos obtenidos exitosamente", tributos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tributos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tributos/{id}
     * Obtener tributo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tributo>> obtenerPorId(@PathVariable String id) {
        try {
            Optional<Tributo> tributo = tributoService.obtenerPorId(id);
            
            if (tributo.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Tributo obtenido exitosamente", tributo.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tributo no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tributo: " + e.getMessage()));
        }
    }
}
