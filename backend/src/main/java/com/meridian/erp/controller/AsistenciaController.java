package com.meridian.erp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.AsistenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AsistenciaController {
    
    private final AsistenciaService asistenciaService;
    private final ObjectMapper objectMapper;
    
    /**
     * GET /api/asistencias
     * Listar asistencias con filtros
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(
            @RequestParam Long empresaId,
            @RequestParam(required = false) String fechaDesde,
            @RequestParam(required = false) String fechaHasta,
            @RequestParam(required = false) Long sedeId,
            @RequestParam(required = false) String turnoId) {
        try {
            LocalDate fDesde = fechaDesde != null ? LocalDate.parse(fechaDesde) : null;
            LocalDate fHasta = fechaHasta != null ? LocalDate.parse(fechaHasta) : null;
            
            List<Map<String, Object>> asistencias = asistenciaService.listarAsistencias(
                    empresaId, fDesde, fHasta, sedeId, turnoId);
            
            return ResponseEntity.ok(ApiResponse.success("Asistencias obtenidas exitosamente", asistencias));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener asistencias: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/asistencias
     * Guardar asistencia masiva
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> guardar(@RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para guardar asistencia: " + datos);
            
            // Extraer datos
            LocalDate fechaAsistencia = LocalDate.parse(datos.get("fecha").toString());
            String turnoId = datos.get("turnoId").toString();
            Long sedeId = Long.valueOf(datos.get("sedeId").toString());
            Long empresaId = Long.valueOf(datos.get("empresaId").toString());
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            // Convertir trabajadores a JSON
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> trabajadores = (List<Map<String, Object>>) datos.get("trabajadores");
            String detallesJson = objectMapper.writeValueAsString(trabajadores);
            
            System.out.println("Detalles JSON: " + detallesJson);
            
            // Guardar asistencia
            Long asistenciaId = asistenciaService.guardarAsistenciaCompleta(
                    fechaAsistencia, turnoId, sedeId, empresaId, usuarioId, detallesJson);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Asistencia guardada exitosamente", asistenciaId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al guardar asistencia: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/asistencias/{id}
     * Actualizar asistencia existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Long>> actualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para actualizar asistencia " + id + ": " + datos);
            
            // Extraer datos
            LocalDate fechaAsistencia = LocalDate.parse(datos.get("fecha").toString());
            String turnoId = datos.get("turnoId").toString();
            Long sedeId = Long.valueOf(datos.get("sedeId").toString());
            Long empresaId = Long.valueOf(datos.get("empresaId").toString());
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            // Convertir trabajadores a JSON
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> trabajadores = (List<Map<String, Object>>) datos.get("trabajadores");
            String detallesJson = objectMapper.writeValueAsString(trabajadores);
            
            System.out.println("Detalles JSON: " + detallesJson);
            
            // Actualizar asistencia (usa el mismo procedimiento que guarda, que actualiza si ya existe)
            Long asistenciaId = asistenciaService.guardarAsistenciaCompleta(
                    fechaAsistencia, turnoId, sedeId, empresaId, usuarioId, detallesJson);
            
            return ResponseEntity.ok(ApiResponse.success("Asistencia actualizada exitosamente", asistenciaId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar asistencia: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/asistencias/{id}/detalle
     * Obtener detalle de una asistencia
     */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerDetalle(@PathVariable Long id) {
        try {
            List<Map<String, Object>> detalle = asistenciaService.obtenerDetalleAsistencia(id);
            return ResponseEntity.ok(ApiResponse.success("Detalle obtenido exitosamente", detalle));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener detalle: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/asistencias/{id}
     * Obtener asistencia completa (cabecera + detalle)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerAsistenciaCompleta(@PathVariable Long id) {
        try {
            Map<String, Object> asistencia = asistenciaService.obtenerAsistenciaCompleta(id);
            return ResponseEntity.ok(ApiResponse.success("Asistencia obtenida exitosamente", asistencia));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener asistencia: " + e.getMessage()));
        }
    }
}
