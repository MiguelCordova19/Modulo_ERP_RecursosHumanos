package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoPago;
import com.meridian.erp.service.TipoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-pago")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoPagoController {
    
    private final TipoPagoService tipoPagoService;
    
    /**
     * GET /api/tipos-pago
     * Listar todos los tipos de pago activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoPago>>> listar() {
        try {
            List<TipoPago> tiposPago = tipoPagoService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tipos de pago obtenidos exitosamente", tiposPago)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de pago: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/tipos-pago/todos
     * Listar todos los tipos de pago (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<TipoPago>>> listarTodos() {
        try {
            List<TipoPago> tiposPago = tipoPagoService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los tipos de pago obtenidos exitosamente", tiposPago)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de pago: " + e.getMessage()));
        }
    }
}
