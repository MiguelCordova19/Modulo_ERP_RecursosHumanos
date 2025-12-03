package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.ConceptoTrabajadorRequest;
import com.meridian.erp.entity.ConceptoTrabajador;
import com.meridian.erp.service.ConceptoTrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conceptos-trabajador")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConceptoTrabajadorController {
    
    private final ConceptoTrabajadorService conceptoTrabajadorService;
    
    /**
     * POST /api/conceptos-trabajador?usuarioId=1
     * Guardar conceptos de un trabajador
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Boolean>> guardarConceptos(
            @RequestBody ConceptoTrabajadorRequest request,
            @RequestParam Long usuarioId) {
        try {
            if (request.getContratoId() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El ID del contrato es requerido"));
            }
            
            if (request.getEmpresaId() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El ID de la empresa es requerido"));
            }
            
            if (request.getConceptos() == null || request.getConceptos().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Debe proporcionar al menos un concepto"));
            }
            
            boolean resultado = conceptoTrabajadorService.guardarConceptos(
                request.getContratoId(),
                request.getEmpresaId(),
                request.getConceptos(),
                usuarioId
            );
            
            if (resultado) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Conceptos guardados exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al guardar conceptos"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al guardar conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-trabajador/contrato/{contratoId}?empresaId=1
     * Obtener conceptos de un trabajador por contrato y empresa
     */
    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerConceptosPorContrato(
            @PathVariable Long contratoId,
            @RequestParam Integer empresaId) {
        try {
            List<Map<String, Object>> conceptos = conceptoTrabajadorService.obtenerConceptosPorContrato(contratoId, empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Conceptos obtenidos exitosamente", conceptos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-trabajador/empresa/{empresaId}
     * Obtener todos los conceptos de una empresa
     */
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<ConceptoTrabajador>>> obtenerConceptosPorEmpresa(
            @PathVariable Integer empresaId) {
        try {
            List<ConceptoTrabajador> conceptos = conceptoTrabajadorService.obtenerConceptosPorEmpresa(empresaId);
            return ResponseEntity.ok(
                ApiResponse.success("Conceptos de la empresa obtenidos exitosamente", conceptos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/conceptos-trabajador/contrato/{contratoId}?empresaId=1&usuarioId=1
     * Eliminar conceptos de un trabajador
     */
    @DeleteMapping("/contrato/{contratoId}")
    public ResponseEntity<ApiResponse<Boolean>> eliminarConceptos(
            @PathVariable Long contratoId,
            @RequestParam Integer empresaId,
            @RequestParam Long usuarioId) {
        try {
            boolean resultado = conceptoTrabajadorService.eliminarConceptos(contratoId, empresaId, usuarioId);
            
            if (resultado) {
                return ResponseEntity.ok(
                    ApiResponse.success("Conceptos eliminados exitosamente", true)
                );
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar conceptos"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar conceptos: " + e.getMessage()));
        }
    }
}
