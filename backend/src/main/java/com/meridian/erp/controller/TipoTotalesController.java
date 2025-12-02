package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoTotales;
import com.meridian.erp.service.TipoTotalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos-totales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoTotalesController {
    
    private final TipoTotalesService tipoTotalesService;
    
    /**
     * GET /api/tipos-totales
     * Listar todos los tipos de totales activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoTotales>>> listar() {
        try {
            List<TipoTotales> tipos = tipoTotalesService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tipos de totales obtenidos exitosamente", tipos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de totales: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-totales/todos
     * Listar todos los tipos de totales (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<TipoTotales>>> listarTodos() {
        try {
            List<TipoTotales> tipos = tipoTotalesService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los tipos de totales obtenidos exitosamente", tipos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de totales: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-totales/{id}
     * Obtener tipo de totales por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoTotales>> obtenerPorId(@PathVariable String id) {
        try {
            Optional<TipoTotales> tipo = tipoTotalesService.obtenerPorId(id);
            
            if (tipo.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Tipo de totales obtenido exitosamente", tipo.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo de totales no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipo de totales: " + e.getMessage()));
        }
    }
}
