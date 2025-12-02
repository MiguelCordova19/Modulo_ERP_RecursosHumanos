package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Genero;
import com.meridian.erp.service.GeneroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeneroController {
    
    private final GeneroService generoService;
    
    /**
     * GET /api/generos
     * Listar todos los géneros activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Genero>>> listar() {
        try {
            List<Genero> generos = generoService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Géneros obtenidos exitosamente", generos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener géneros: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/generos/todos
     * Listar todos los géneros (activos e inactivos)
     */
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<Genero>>> listarTodos() {
        try {
            List<Genero> generos = generoService.listarTodos();
            return ResponseEntity.ok(
                ApiResponse.success("Todos los géneros obtenidos exitosamente", generos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener géneros: " + e.getMessage()));
        }
    }
}
