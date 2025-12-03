package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.ConceptoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/concepto")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConceptoController {
    
    private final ConceptoService conceptoService;
    
    /**
     * GET /api/concepto/buscar
     * Buscar conceptos por código o descripción
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> buscar(
            @RequestParam Long empresaId,
            @RequestParam String busqueda) {
        try {
            System.out.println("Buscando concepto: " + busqueda + " para empresa: " + empresaId);
            
            List<Map<String, Object>> conceptos = conceptoService.buscarConceptos(empresaId, busqueda);
            
            if (conceptos.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No se encontraron conceptos", conceptos));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Conceptos encontrados", conceptos));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al buscar conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/concepto
     * Listar todos los conceptos activos de una empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(
            @RequestParam Long empresaId) {
        try {
            List<Map<String, Object>> conceptos = conceptoService.listarConceptos(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Conceptos obtenidos exitosamente", conceptos));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener conceptos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/concepto/{id}
     * Obtener un concepto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerPorId(@PathVariable Long id) {
        try {
            Map<String, Object> concepto = conceptoService.obtenerConceptoPorId(id);
            
            if (concepto != null) {
                return ResponseEntity.ok(ApiResponse.success("Concepto obtenido exitosamente", concepto));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Concepto no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener concepto: " + e.getMessage()));
        }
    }
}
