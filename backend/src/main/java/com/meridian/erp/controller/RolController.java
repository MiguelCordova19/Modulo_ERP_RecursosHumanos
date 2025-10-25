package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Rol;
import com.meridian.erp.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {
    
    private final RolService rolService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Rol>>> findAll() {
        List<Rol> roles = rolService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Roles obtenidos", roles));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> findById(@PathVariable Integer id) {
        return rolService.findById(id)
            .map(rol -> ResponseEntity.ok(ApiResponse.success("Rol encontrado", rol)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Rol no encontrado")));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Rol>> create(@RequestBody Rol rol) {
        Rol saved = rolService.save(rol);
        return ResponseEntity.ok(ApiResponse.success("Rol creado exitosamente", saved));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> update(@PathVariable Integer id, @RequestBody Rol rol) {
        if (!rolService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Rol no encontrado"));
        }
        rol.setId(id);
        Rol updated = rolService.save(rol);
        return ResponseEntity.ok(ApiResponse.success("Rol actualizado exitosamente", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        if (!rolService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Rol no encontrado"));
        }
        rolService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Rol eliminado exitosamente", null));
    }
}
