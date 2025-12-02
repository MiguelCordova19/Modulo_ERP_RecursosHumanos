package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.EstadoCivil;
import com.meridian.erp.service.EstadoCivilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados-civiles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EstadoCivilController {
    
    private final EstadoCivilService estadoCivilService;
    
    /**
     * GET /api/estados-civiles
     * Listar todos los estados civiles activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EstadoCivil>>> listar() {
        try {
            List<EstadoCivil> estadosCiviles = estadoCivilService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Estados civiles obtenidos exitosamente", estadosCiviles)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener estados civiles: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/estados-civiles/todos
     * Listar todos los estados civiles (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<EstadoCivil>>> listarTodos() {
        try {
            List<EstadoCivil> estadosCiviles = estadoCivilService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los estados civiles obtenidos exitosamente", estadosCiviles)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener estados civiles: " + e.getMessage()));
        }
    }
}
