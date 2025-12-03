package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trabajador")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrabajadorController {
    
    private final TrabajadorService trabajadorService;
    
    /**
     * GET /api/trabajador/buscar-por-doc
     * Buscar trabajador por número de documento
     */
    @GetMapping("/buscar-por-doc")
    public ResponseEntity<ApiResponse<Map<String, Object>>> buscarPorDocumento(
            @RequestParam Long empresaId,
            @RequestParam String nroDoc) {
        try {
            System.out.println("Buscando trabajador por documento: " + nroDoc + " en empresa: " + empresaId);
            
            Map<String, Object> trabajador = trabajadorService.buscarPorDocumento(empresaId, nroDoc);
            
            if (trabajador != null) {
                return ResponseEntity.ok(ApiResponse.success("Trabajador encontrado", trabajador));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Trabajador no encontrado", null));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al buscar trabajador: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/trabajador/buscar
     * Buscar trabajadores por documento o nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> buscar(
            @RequestParam Long empresaId,
            @RequestParam String busqueda) {
        try {
            System.out.println("Buscando trabajador: " + busqueda + " en empresa: " + empresaId);
            
            List<Map<String, Object>> trabajadores = trabajadorService.buscarTrabajadores(empresaId, busqueda);
            
            if (trabajadores.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No se encontraron trabajadores", trabajadores));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Trabajadores encontrados", trabajadores));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al buscar trabajadores: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/trabajador
     * Listar todos los trabajadores activos de una empresa
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(
            @RequestParam Long empresaId) {
        try {
            List<Map<String, Object>> trabajadores = trabajadorService.listarTrabajadores(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Trabajadores obtenidos exitosamente", trabajadores));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener trabajadores: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/trabajador/{id}
     * Obtener un trabajador por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerPorId(@PathVariable Long id) {
        try {
            Map<String, Object> trabajador = trabajadorService.obtenerPorId(id);
            
            if (trabajador != null) {
                return ResponseEntity.ok(ApiResponse.success("Trabajador encontrado", trabajador));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Trabajador no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener trabajador: " + e.getMessage()));
        }
    }
}
