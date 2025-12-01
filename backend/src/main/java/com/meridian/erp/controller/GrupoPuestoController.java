package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.GrupoPuesto;
import com.meridian.erp.service.GrupoPuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grupos-puestos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrupoPuestoController {
    
    private final GrupoPuestoService grupoPuestoService;
    
    /**
     * GET /api/grupos-puestos?empresaId=1
     * Listar grupos por empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<GrupoPuesto>>> listar(@RequestParam(required = false) Integer empresaId) {
        try {
            // Si no se proporciona empresaId, usar 1 por defecto (temporal)
            if (empresaId == null) {
                empresaId = 1;
            }
            
            List<GrupoPuesto> grupos = grupoPuestoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Grupos obtenidos exitosamente", grupos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener grupos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/grupos-puestos/{id}
     * Obtener grupo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GrupoPuesto>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<GrupoPuesto> grupo = grupoPuestoService.obtenerPorId(id);
            
            if (grupo.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Grupo obtenido exitosamente", grupo.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Grupo no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener grupo: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/grupos-puestos?usuarioId=1
     * Crear nuevo grupo
     */
    @PostMapping
    public ResponseEntity<ApiResponse<GrupoPuesto>> crear(
            @RequestBody GrupoPuesto grupo,
            @RequestParam(required = false) Long usuarioId) {
        try {
            // Si no se proporciona usuarioId, usar 1 por defecto (temporal)
            if (usuarioId == null) {
                usuarioId = 1L;
            }
            
            // Si no se proporciona empresaId, usar 1 por defecto (temporal)
            if (grupo.getEmpresaId() == null) {
                grupo.setEmpresaId(1);
            }
            
            GrupoPuesto nuevoGrupo = grupoPuestoService.crear(grupo, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grupo creado exitosamente", nuevoGrupo));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear grupo: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/grupos-puestos/{id}?usuarioId=1
     * Actualizar grupo
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GrupoPuesto>> actualizar(
            @PathVariable Long id,
            @RequestBody GrupoPuesto grupo,
            @RequestParam(required = false) Long usuarioId) {
        try {
            // Si no se proporciona usuarioId, usar 1 por defecto (temporal)
            if (usuarioId == null) {
                usuarioId = 1L;
            }
            
            GrupoPuesto grupoActualizado = grupoPuestoService.actualizar(id, grupo, usuarioId);
            return ResponseEntity.ok(
                ApiResponse.success("Grupo actualizado exitosamente", grupoActualizado)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar grupo: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/grupos-puestos/{id}?usuarioId=1
     * Eliminar grupo (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Long id,
            @RequestParam(required = false) Long usuarioId) {
        try {
            // Si no se proporciona usuarioId, usar 1 por defecto (temporal)
            if (usuarioId == null) {
                usuarioId = 1L;
            }
            
            boolean eliminado = grupoPuestoService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Grupo eliminado exitosamente", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Grupo no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar grupo: " + e.getMessage()));
        }
    }
}
