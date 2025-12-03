package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.TipoPlanillaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tipo-planilla")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoPlanillaController {
    
    private final TipoPlanillaService tipoPlanillaService;
    
    /**
     * GET /api/tipo-planilla
     * Listar tipos de planilla (GLOBAL - todas las empresas)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar() {
        try {
            List<Map<String, Object>> tipos = tipoPlanillaService.listarTiposPlanilla();
            return ResponseEntity.ok(ApiResponse.success("Tipos de planilla obtenidos exitosamente", tipos));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener tipos de planilla: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipo-planilla/{id}
     * Obtener un tipo de planilla por ID (GLOBAL)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerPorId(@PathVariable Long id) {
        try {
            Map<String, Object> tipo = tipoPlanillaService.obtenerTipoPlanillaPorId(id);
            
            if (tipo != null) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de planilla obtenido exitosamente", tipo));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Tipo de planilla no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener tipo de planilla: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/tipo-planilla
     * Crear nuevo tipo de planilla (GLOBAL)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> crear(@RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para crear tipo de planilla: " + datos);
            
            String descripcion = datos.get("descripcion").toString();
            String codigo = datos.get("codigo") != null ? datos.get("codigo").toString() : null;
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            Long id = tipoPlanillaService.insertarTipoPlanilla(descripcion, codigo, usuarioId);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tipo de planilla creado exitosamente", id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear tipo de planilla: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/tipo-planilla/{id}
     * Actualizar tipo de planilla
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> actualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para actualizar tipo de planilla: " + datos);
            
            String descripcion = datos.get("descripcion").toString();
            String codigo = datos.get("codigo") != null ? datos.get("codigo").toString() : null;
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            boolean actualizado = tipoPlanillaService.actualizarTipoPlanilla(id, descripcion, codigo, usuarioId);
            
            if (actualizado) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de planilla actualizado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Tipo de planilla no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar tipo de planilla: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/tipo-planilla/{id}
     * Eliminar tipo de planilla (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = tipoPlanillaService.eliminarTipoPlanilla(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de planilla eliminado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Tipo de planilla no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar tipo de planilla: " + e.getMessage()));
        }
    }
}
