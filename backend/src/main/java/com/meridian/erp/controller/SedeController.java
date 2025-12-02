package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Sede;
import com.meridian.erp.service.SedeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sedes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SedeController {
    
    private final SedeService sedeService;
    
    /**
     * GET /api/sedes?empresaId=1
     * Listar sedes por empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Sede>>> listar(@RequestParam Integer empresaId) {
        try {
            List<Sede> sedes = sedeService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Sedes obtenidas exitosamente", sedes)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener sedes: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/sedes/{id}
     * Obtener sede por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Sede>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Sede> sede = sedeService.obtenerPorId(id);
            
            if (sede.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Sede obtenida exitosamente", sede.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Sede no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener sede: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/sedes?usuarioId=1
     * Crear nueva sede
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Sede>> crear(
            @RequestBody Sede sede,
            @RequestParam Long usuarioId) {
        try {
            Sede nuevaSede = sedeService.crear(sede, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sede creada exitosamente", nuevaSede));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear sede: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/sedes/{id}?usuarioId=1
     * Actualizar sede
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Sede>> actualizar(
            @PathVariable Long id,
            @RequestBody Sede sede,
            @RequestParam Long usuarioId) {
        try {
            Sede sedeActualizada = sedeService.actualizar(id, sede, usuarioId);
            return ResponseEntity.ok(
                ApiResponse.success("Sede actualizada exitosamente", sedeActualizada)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar sede: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/sedes/{id}?usuarioId=1
     * Eliminar sede (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = sedeService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Sede eliminada exitosamente", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Sede no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar sede: " + e.getMessage()));
        }
    }
}
