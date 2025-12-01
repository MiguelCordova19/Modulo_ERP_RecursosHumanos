package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Puesto;
import com.meridian.erp.service.PuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/puestos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PuestoController {
    
    private final PuestoService puestoService;
    
    /**
     * GET /api/puestos?empresaId=1
     * Listar puestos por empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Puesto>>> listar(@RequestParam Integer empresaId) {
        try {
            List<Puesto> puestos = puestoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Puestos obtenidos exitosamente", puestos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener puestos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/puestos/grupo/{grupoId}
     * Listar puestos por grupo
     */
    @GetMapping("/grupo/{grupoId}")
    public ResponseEntity<ApiResponse<List<Puesto>>> listarPorGrupo(@PathVariable Integer grupoId) {
        try {
            List<Puesto> puestos = puestoService.listarPorGrupo(grupoId);
            return ResponseEntity.ok(
                ApiResponse.success("Puestos del grupo obtenidos exitosamente", puestos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener puestos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/puestos/{id}
     * Obtener puesto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Puesto>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Puesto> puesto = puestoService.obtenerPorId(id);
            
            if (puesto.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Puesto obtenido exitosamente", puesto.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Puesto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener puesto: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/puestos?usuarioId=1
     * Crear nuevo puesto
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Puesto>> crear(
            @RequestBody Puesto puesto,
            @RequestParam Long usuarioId) {
        try {
            Puesto nuevoPuesto = puestoService.crear(puesto, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Puesto creado exitosamente", nuevoPuesto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear puesto: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/puestos/{id}?usuarioId=1
     * Actualizar puesto
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Puesto>> actualizar(
            @PathVariable Integer id,
            @RequestBody Puesto puesto,
            @RequestParam Long usuarioId) {
        try {
            Puesto puestoActualizado = puestoService.actualizar(id, puesto, usuarioId);
            return ResponseEntity.ok(
                ApiResponse.success("Puesto actualizado exitosamente", puestoActualizado)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar puesto: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/puestos/{id}?usuarioId=1
     * Eliminar puesto (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Integer id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = puestoService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Puesto eliminado exitosamente", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Puesto no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar puesto: " + e.getMessage()));
        }
    }
}
