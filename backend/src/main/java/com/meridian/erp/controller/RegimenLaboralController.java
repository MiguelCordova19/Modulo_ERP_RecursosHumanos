package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.RegimenLaboral;
import com.meridian.erp.service.RegimenLaboralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/regimenes-laborales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegimenLaboralController {
    
    private final RegimenLaboralService regimenLaboralService;
    
    /**
     * GET /api/regimenes-laborales
     * Listar todos los regímenes laborales activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegimenLaboral>>> listar() {
        try {
            List<RegimenLaboral> regimenes = regimenLaboralService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Regímenes laborales obtenidos exitosamente", regimenes)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener regímenes laborales: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/regimenes-laborales/todos
     * Listar todos los regímenes laborales (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<RegimenLaboral>>> listarTodos() {
        try {
            List<RegimenLaboral> regimenes = regimenLaboralService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los regímenes laborales obtenidos exitosamente", regimenes)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener regímenes laborales: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/regimenes-laborales/{id}
     * Obtener régimen laboral por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegimenLaboral>> obtenerPorId(@PathVariable String id) {
        try {
            Optional<RegimenLaboral> regimen = regimenLaboralService.obtenerPorId(id);
            
            if (regimen.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("Régimen laboral obtenido exitosamente", regimen.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Régimen laboral no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener régimen laboral: " + e.getMessage()));
        }
    }
}
