package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Rol;
import com.meridian.erp.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {
    
    private final RolService rolService;
    
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<Rol>>> findByEmpresa(@PathVariable Long empresaId) {
        List<Rol> roles = rolService.findByEmpresa(empresaId);
        return ResponseEntity.ok(ApiResponse.success("Roles obtenidos", roles));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> findById(@PathVariable Integer id) {
        return rolService.findById(id)
            .map(rol -> ResponseEntity.ok(ApiResponse.success("Rol encontrado", rol)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Rol no encontrado")));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@RequestBody Rol rol) {
        Map<String, Object> resultado = rolService.save(rol);
        
        if (resultado != null) {
            String mensaje = (String) resultado.get("mensaje");
            
            if (mensaje.contains("ya existe")) {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
            
            Integer rolId = (Integer) resultado.get("id");
            Rol rolCreado = rolService.findById(rolId).orElse(null);
            
            return ResponseEntity.ok(ApiResponse.success(mensaje, Map.of(
                "id", rolId,
                "data", rolCreado
            )));
        }
        
        return ResponseEntity.ok(ApiResponse.error("Error al crear rol"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> update(@PathVariable Integer id, @RequestBody Rol rol) {
        if (!rolService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Rol no encontrado"));
        }
        
        rol.setId(id);
        Map<String, Object> resultado = rolService.save(rol);
        
        if (resultado != null) {
            String mensaje = (String) resultado.get("mensaje");
            
            if (mensaje.contains("ya existe")) {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
            
            Rol rolActualizado = rolService.findById(id).orElse(null);
            
            return ResponseEntity.ok(ApiResponse.success(mensaje, Map.of(
                "id", id,
                "data", rolActualizado
            )));
        }
        
        return ResponseEntity.ok(ApiResponse.error("Error al actualizar rol"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        Map<String, Object> resultado = rolService.deleteById(id);
        
        if (resultado != null) {
            Boolean success = (Boolean) resultado.get("success");
            String mensaje = (String) resultado.get("mensaje");
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success(mensaje, null));
            } else {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
        }
        
        return ResponseEntity.ok(ApiResponse.error("Error al eliminar rol"));
    }
}
