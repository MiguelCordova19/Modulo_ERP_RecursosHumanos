package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.ConceptoRegimenRequest;
import com.meridian.erp.entity.ConceptoRegimenLaboral;
import com.meridian.erp.service.ConceptoRegimenLaboralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conceptos-regimen-laboral")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConceptoRegimenLaboralController {
    
    private final ConceptoRegimenLaboralService conceptoRegimenLaboralService;
    
    /**
     * GET /api/conceptos-regimen-laboral/regimenes-activos?empresaId=1
     * Listar solo los regímenes laborales que tienen conceptos asignados
     */
    @GetMapping("/regimenes-activos")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listarRegimenesActivos(@RequestParam Integer empresaId) {
        try {
            List<Map<String, Object>> regimenes = conceptoRegimenLaboralService.listarRegimenesConConceptos(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Regímenes laborales con conceptos obtenidos exitosamente", regimenes)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener regímenes: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-regimen-laboral?empresaId=1
     * Listar conceptos por régimen laboral de una empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(@RequestParam Integer empresaId) {
        try {
            List<Map<String, Object>> conceptos = conceptoRegimenLaboralService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Conceptos por régimen laboral obtenidos exitosamente", conceptos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-regimen-laboral/{id}/detalles
     * Obtener detalles de conceptos de un régimen
     */
    @GetMapping("/{id}/detalles")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerDetalles(@PathVariable Long id) {
        try {
            List<Map<String, Object>> detalles = conceptoRegimenLaboralService.obtenerDetalles(id);
            return ResponseEntity.ok(
                ApiResponse.success("Detalles obtenidos exitosamente", detalles)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener detalles: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-regimen-laboral/{regimenLaboralId}/conceptos
     * Obtener conceptos asignados a un régimen laboral para cargar en el modal de contrato
     */
    @GetMapping("/{regimenLaboralId}/conceptos")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerConceptosPorRegimen(@PathVariable String regimenLaboralId) {
        try {
            List<Map<String, Object>> conceptos = conceptoRegimenLaboralService.obtenerConceptosPorRegimen(regimenLaboralId);
            return ResponseEntity.ok(
                ApiResponse.success("Conceptos del régimen laboral obtenidos exitosamente", conceptos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener conceptos del régimen: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/conceptos-regimen-laboral/asignar?usuarioId=1
     * Asignar conceptos a un régimen laboral
     */
    @PostMapping("/asignar")
    public ResponseEntity<ApiResponse<ConceptoRegimenLaboral>> asignar(
            @RequestBody ConceptoRegimenRequest request,
            @RequestParam Long usuarioId) {
        try {
            if (request.getRegimenLaboralId() == null || request.getRegimenLaboralId().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El régimen laboral es requerido"));
            }
            
            if (request.getConceptos() == null || request.getConceptos().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Debe seleccionar al menos un concepto"));
            }
            
            ConceptoRegimenLaboral resultado = conceptoRegimenLaboralService.guardar(
                request.getRegimenLaboralId(),
                request.getEmpresaId(),
                request.getConceptos(),
                usuarioId
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Conceptos asignados exitosamente", resultado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al asignar conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/conceptos-regimen-laboral/{id}?usuarioId=1
     * Eliminar asignación de conceptos
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = conceptoRegimenLaboralService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Asignación eliminada exitosamente", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Asignación no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar: " + e.getMessage()));
        }
    }
}
