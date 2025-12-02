package com.meridian.erp.controller;

import com.meridian.erp.dto.TrabajadorDTO;
import com.meridian.erp.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin(origins = "*")
public class TrabajadorController {
    
    @Autowired
    private TrabajadorService trabajadorService;
    
    // Listar todos los trabajadores de una empresa
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<Map<String, Object>> listarPorEmpresa(@PathVariable Integer empresaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<TrabajadorDTO> trabajadores = trabajadorService.listarPorEmpresa(empresaId);
            response.put("success", true);
            response.put("data", trabajadores);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar trabajadores: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Listar trabajadores activos
    @GetMapping("/empresa/{empresaId}/activos")
    public ResponseEntity<Map<String, Object>> listarActivosPorEmpresa(@PathVariable Integer empresaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<TrabajadorDTO> trabajadores = trabajadorService.listarActivosPorEmpresa(empresaId);
            response.put("success", true);
            response.put("data", trabajadores);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar trabajadores activos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Obtener trabajador por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            TrabajadorDTO trabajador = trabajadorService.obtenerPorId(id);
            if (trabajador != null) {
                response.put("success", true);
                response.put("data", trabajador);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Trabajador no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener trabajador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Guardar trabajador (crear o actualizar)
    @PostMapping
    public ResponseEntity<Map<String, Object>> guardar(
            @RequestBody TrabajadorDTO trabajadorDTO,
            @RequestHeader(value = "Usuario-Id", required = false, defaultValue = "1") Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            TrabajadorDTO trabajadorGuardado = trabajadorService.guardar(trabajadorDTO, usuarioId);
            response.put("success", true);
            response.put("message", trabajadorDTO.getId() == null ? 
                "Trabajador creado exitosamente" : "Trabajador actualizado exitosamente");
            response.put("data", trabajadorGuardado);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar trabajador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Actualizar trabajador
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Long id,
            @RequestBody TrabajadorDTO trabajadorDTO,
            @RequestHeader(value = "Usuario-Id", required = false, defaultValue = "1") Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            trabajadorDTO.setId(id);
            TrabajadorDTO trabajadorActualizado = trabajadorService.guardar(trabajadorDTO, usuarioId);
            response.put("success", true);
            response.put("message", "Trabajador actualizado exitosamente");
            response.put("data", trabajadorActualizado);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al actualizar trabajador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Eliminar trabajador (lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(
            @PathVariable Long id,
            @RequestHeader(value = "Usuario-Id", required = false, defaultValue = "1") Long usuarioId) {
        Map<String, Object> response = new HashMap<>();
        try {
            trabajadorService.eliminar(id, usuarioId);
            response.put("success", true);
            response.put("message", "Trabajador eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar trabajador: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
