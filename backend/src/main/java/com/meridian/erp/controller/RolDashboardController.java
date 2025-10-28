package com.meridian.erp.controller;

import com.meridian.erp.entity.RolDashboard;
import com.meridian.erp.service.RolDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles-dashboard")
@CrossOrigin(origins = "*")
public class RolDashboardController {
    
    @Autowired
    private RolDashboardService rolDashboardService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerTodos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<RolDashboard> roles = rolDashboardService.obtenerTodos();
            response.put("success", true);
            response.put("data", roles);
            response.put("message", "Roles obtenidos exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener roles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> obtenerActivos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<RolDashboard> roles = rolDashboardService.obtenerActivos();
            response.put("success", true);
            response.put("data", roles);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener roles activos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            RolDashboard rol = rolDashboardService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            response.put("success", true);
            response.put("data", rol);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody RolDashboard rol) {
        Map<String, Object> response = new HashMap<>();
        try {
            RolDashboard nuevoRol = rolDashboardService.crear(rol);
            response.put("success", true);
            response.put("data", nuevoRol);
            response.put("message", "Rol creado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al crear rol: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Integer id, 
            @RequestBody RolDashboard rol) {
        Map<String, Object> response = new HashMap<>();
        try {
            RolDashboard rolActualizado = rolDashboardService.actualizar(id, rol);
            response.put("success", true);
            response.put("data", rolActualizado);
            response.put("message", "Rol actualizado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al actualizar rol: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            rolDashboardService.eliminar(id);
            response.put("success", true);
            response.put("message", "Rol eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar rol: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
