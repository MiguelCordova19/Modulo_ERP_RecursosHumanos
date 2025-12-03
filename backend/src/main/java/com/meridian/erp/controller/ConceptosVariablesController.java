package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.ConceptosVariablesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conceptos-variables")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConceptosVariablesController {
    
    private final ConceptosVariablesService conceptosVariablesService;
    
    /**
     * POST /api/conceptos-variables/batch
     * Guardar conceptos variables en lote (múltiples trabajadores)
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Long>> guardarBatch(@RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para guardar conceptos variables: " + datos);
            
            Integer anio = Integer.valueOf(datos.get("anio").toString());
            Integer mes = Integer.valueOf(datos.get("mes").toString());
            Long planillaId = Long.valueOf(datos.get("planillaId").toString());
            Long conceptoId = Long.valueOf(datos.get("conceptoId").toString());
            
            // Convertir trabajadores a JSON válido
            Object trabajadoresObj = datos.get("trabajadores");
            ObjectMapper mapper = new ObjectMapper();
            String trabajadoresJson = mapper.writeValueAsString(trabajadoresObj);
            
            System.out.println("JSON de trabajadores: " + trabajadoresJson);
            
            Long empresaId = Long.valueOf(datos.get("empresaId").toString());
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            Long cabeceraId = conceptosVariablesService.guardarConceptosVariablesBatch(
                    anio, mes, planillaId, conceptoId, trabajadoresJson, empresaId, usuarioId);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Conceptos variables guardados exitosamente", cabeceraId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al guardar conceptos variables: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-variables
     * Listar conceptos variables
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(
            @RequestParam Long empresaId,
            @RequestParam(required = false) Integer anio,
            @RequestParam(required = false) Integer mes) {
        try {
            List<Map<String, Object>> conceptos = conceptosVariablesService.listarConceptosVariables(
                    empresaId, anio, mes);
            return ResponseEntity.ok(ApiResponse.success("Conceptos variables obtenidos exitosamente", conceptos));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener conceptos variables: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/conceptos-variables/{id}/detalle
     * Obtener detalle de conceptos variables
     */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerDetalle(@PathVariable Long id) {
        try {
            List<Map<String, Object>> detalle = conceptosVariablesService.obtenerDetalleConceptosVariables(id);
            return ResponseEntity.ok(ApiResponse.success("Detalle obtenido exitosamente", detalle));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener detalle: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/conceptos-variables/{id}
     * Eliminar conceptos variables (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = conceptosVariablesService.eliminarConceptosVariables(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Conceptos variables eliminados exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Conceptos variables no encontrados"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar conceptos variables: " + e.getMessage()));
        }
    }
}
