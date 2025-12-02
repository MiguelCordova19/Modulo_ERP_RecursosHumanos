package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Banco;
import com.meridian.erp.service.BancoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bancos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BancoController {
    
    private final BancoService bancoService;
    
    /**
     * GET /api/bancos
     * Listar todos los bancos activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Banco>>> listar() {
        try {
            List<Banco> bancos = bancoService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Bancos obtenidos exitosamente", bancos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener bancos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/bancos/todos
     * Listar todos los bancos (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<Banco>>> listarTodos() {
        try {
            List<Banco> bancos = bancoService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los bancos obtenidos exitosamente", bancos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener bancos: " + e.getMessage()));
        }
    }
}
