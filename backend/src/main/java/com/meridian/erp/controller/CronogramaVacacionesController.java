package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.service.CronogramaVacacionesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cronograma-vacaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CronogramaVacacionesController {
    
    private final CronogramaVacacionesService cronogramaVacacionesService;
    
    /**
     * POST /api/cronograma-vacaciones/generar
     * Generar cronograma de vacaciones
     */
    @PostMapping("/generar")
    public ResponseEntity<ApiResponse<Long>> generar(@RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para generar cronograma: " + datos);
            
            LocalDate fechaDesde = LocalDate.parse(datos.get("fechaDesde").toString());
            LocalDate fechaHasta = LocalDate.parse(datos.get("fechaHasta").toString());
            Long empresaId = Long.valueOf(datos.get("empresaId").toString());
            Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
            
            Long cronogramaId = cronogramaVacacionesService.generarCronograma(
                    fechaDesde, fechaHasta, empresaId, usuarioId);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Cronograma generado exitosamente", cronogramaId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al generar cronograma: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/cronograma-vacaciones
     * Listar cronogramas de vacaciones
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listar(
            @RequestParam Long empresaId) {
        try {
            List<Map<String, Object>> cronogramas = cronogramaVacacionesService.listarCronogramas(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Cronogramas obtenidos exitosamente", cronogramas));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener cronogramas: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/cronograma-vacaciones/{id}/detalle
     * Obtener detalle de un cronograma
     */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> obtenerDetalle(@PathVariable Long id) {
        try {
            List<Map<String, Object>> detalle = cronogramaVacacionesService.obtenerDetalleCronograma(id);
            return ResponseEntity.ok(ApiResponse.success("Detalle obtenido exitosamente", detalle));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener detalle: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/cronograma-vacaciones/{id}
     * Eliminar cronograma
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = cronogramaVacacionesService.eliminarCronograma(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Cronograma eliminado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Cronograma no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar cronograma: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/cronograma-vacaciones/detalle/{id}
     * Actualizar detalle de cronograma (fechas y días de vacaciones)
     */
    @PutMapping("/detalle/{id}")
    public ResponseEntity<ApiResponse<Boolean>> actualizarDetalle(
            @PathVariable Long id,
            @RequestBody Map<String, Object> datos) {
        try {
            System.out.println("Datos recibidos para actualizar detalle: " + datos);
            
            String fechaInicio = datos.get("fechaInicio") != null ? datos.get("fechaInicio").toString() : null;
            String fechaFin = datos.get("fechaFin") != null ? datos.get("fechaFin").toString() : null;
            Integer dias = datos.get("dias") != null ? Integer.valueOf(datos.get("dias").toString()) : null;
            String observaciones = datos.get("observaciones") != null ? datos.get("observaciones").toString() : null;
            
            boolean actualizado = cronogramaVacacionesService.actualizarDetalleCronograma(
                    id, fechaInicio, fechaFin, dias, observaciones);
            
            if (actualizado) {
                return ResponseEntity.ok(ApiResponse.success("Detalle actualizado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Detalle no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar detalle: " + e.getMessage()));
        }
    }
}
