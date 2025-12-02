package com.meridian.erp.controller;

import com.meridian.erp.entity.DiaSemana;
import com.meridian.erp.service.DiaSemanaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dias-semana")
@CrossOrigin(origins = "*")
public class DiaSemanaController {
    
    @Autowired
    private DiaSemanaService diaSemanaService;
    
    // Listar todos los días
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<DiaSemana> dias = diaSemanaService.listarTodos();
            response.put("success", true);
            response.put("data", dias);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar días: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Listar días activos
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> listarActivos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<DiaSemana> dias = diaSemanaService.listarActivos();
            response.put("success", true);
            response.put("data", dias);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar días activos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Obtener día por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            DiaSemana dia = diaSemanaService.obtenerPorId(id);
            if (dia != null) {
                response.put("success", true);
                response.put("data", dia);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Día no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener día: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
