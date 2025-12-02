package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoCuenta;
import com.meridian.erp.service.TipoCuentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-cuenta")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoCuentaController {
    
    private final TipoCuentaService tipoCuentaService;
    
    /**
     * GET /api/tipos-cuenta
     * Listar todos los tipos de cuenta activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoCuenta>>> listar() {
        try {
            List<TipoCuenta> tiposCuenta = tipoCuentaService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tipos de cuenta obtenidos exitosamente", tiposCuenta)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de cuenta: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-cuenta/todos
     * Listar todos los tipos de cuenta (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<TipoCuenta>>> listarTodos() {
        try {
            List<TipoCuenta> tiposCuenta = tipoCuentaService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los tipos de cuenta obtenidos exitosamente", tiposCuenta)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de cuenta: " + e.getMessage()));
        }
    }
}
