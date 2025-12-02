package com.meridian.erp.controller;

import com.meridian.erp.entity.Turno;
import com.meridian.erp.service.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {
    
    @Autowired
    private TurnoService turnoService;
    
    // Listar todos los turnos
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Turno> turnos = turnoService.listarTodos();
            response.put("success", true);
            response.put("data", turnos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar turnos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Listar turnos activos
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> listarActivos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Turno> turnos = turnoService.listarActivos();
            response.put("success", true);
            response.put("data", turnos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar turnos activos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Obtener turno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Turno turno = turnoService.obtenerPorId(id);
            if (turno != null) {
                response.put("success", true);
                response.put("data", turno);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Turno no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener turno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
