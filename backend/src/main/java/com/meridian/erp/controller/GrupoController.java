package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.GrupoConPuestosRequest;
import com.meridian.erp.entity.Grupo;
import com.meridian.erp.entity.GrupoPuestoDetalle;
import com.meridian.erp.service.GrupoService;
import com.meridian.erp.service.GrupoPuestoDetalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrupoController {
    
    private final GrupoService grupoService;
    private final GrupoPuestoDetalleService grupoPuestoDetalleService;
    
    /**
     * GET /api/grupos?empresaId=1
     * Listar grupos por empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Grupo>>> listar(@RequestParam Integer empresaId) {
        try {
            List<Grupo> grupos = grupoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Grupos obtenidos exitosamente", grupos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener grupos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/grupos/{id}
     * Obtener grupo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Grupo>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Grupo> grupo = grupoService.obtenerPorId(id);
            
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
     * POST /api/grupos?usuarioId=1
     * Crear nuevo grupo (simple, sin puestos)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Grupo>> crear(
            @RequestBody Grupo grupo,
            @RequestParam Long usuarioId) {
        try {
            Grupo nuevoGrupo = grupoService.crear(grupo, usuarioId);
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
     * POST /api/grupos/con-puestos?usuarioId=1
     * Crear grupo con puestos asignados
     */
    @PostMapping("/con-puestos")
    public ResponseEntity<ApiResponse<Grupo>> crearConPuestos(
            @RequestBody GrupoConPuestosRequest request,
            @RequestParam Long usuarioId) {
        try {
            Grupo nuevoGrupo = grupoService.crearConPuestos(request, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grupo creado exitosamente con puestos asignados", nuevoGrupo));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear grupo: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/grupos/{id}?usuarioId=1
     * Actualizar grupo (simple, sin puestos)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Grupo>> actualizar(
            @PathVariable Integer id,
            @RequestBody Grupo grupo,
            @RequestParam Long usuarioId) {
        try {
            Grupo grupoActualizado = grupoService.actualizar(id, grupo, usuarioId);
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
     * PUT /api/grupos/{id}/con-puestos?usuarioId=1
     * Actualizar grupo con puestos
     */
    @PutMapping("/{id}/con-puestos")
    public ResponseEntity<ApiResponse<Grupo>> actualizarConPuestos(
            @PathVariable Integer id,
            @RequestBody GrupoConPuestosRequest request,
            @RequestParam Long usuarioId) {
        try {
            Grupo grupoActualizado = grupoService.actualizarConPuestos(id, request, usuarioId);
            return ResponseEntity.ok(
                ApiResponse.success("Grupo actualizado exitosamente con puestos", grupoActualizado)
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
     * GET /api/grupos/{id}/puestos
     * Obtener puestos asignados a un grupo con sus evaluaciones
     */
    @GetMapping("/{id}/puestos")
    public ResponseEntity<ApiResponse<List<GrupoPuestoDetalle>>> obtenerPuestos(@PathVariable Integer id) {
        try {
            List<GrupoPuestoDetalle> puestos = grupoPuestoDetalleService.listarPorGrupo(id);
            return ResponseEntity.ok(
                ApiResponse.success("Puestos del grupo obtenidos exitosamente", puestos)
            );
        } catch (Exception e) {
            e.printStackTrace(); // Para debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener puestos: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/grupos/{id}?usuarioId=1
     * Eliminar grupo (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Integer id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = grupoService.eliminar(id, usuarioId);
            
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
