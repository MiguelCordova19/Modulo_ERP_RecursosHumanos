package com.meridian.erp.controller;

import com.meridian.erp.entity.Horario;
import com.meridian.erp.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {
    
    @Autowired
    private HorarioService horarioService;
    
    // Listar todos los horarios
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Horario> horarios = horarioService.listarTodos();
            response.put("success", true);
            response.put("data", horarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar horarios: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Listar horarios activos
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> listarActivos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Horario> horarios = horarioService.listarActivos();
            response.put("success", true);
            response.put("data", horarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar horarios activos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Obtener horario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Horario horario = horarioService.obtenerPorId(id);
            if (horario != null) {
                response.put("success", true);
                response.put("data", horario);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Horario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener horario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
