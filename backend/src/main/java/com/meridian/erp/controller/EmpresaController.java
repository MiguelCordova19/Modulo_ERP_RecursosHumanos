package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Empresa;
import com.meridian.erp.service.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class EmpresaController {
    
    private final EmpresaService empresaService;
    
    /**
     * Obtener todas las empresas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Empresa>>> findAll() {
        List<Empresa> empresas = empresaService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Empresas obtenidas exitosamente", empresas));
    }
    
    /**
     * Obtener empresas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<ApiResponse<List<Empresa>>> findActivas() {
        List<Empresa> empresas = empresaService.findByEstado(1);
        return ResponseEntity.ok(ApiResponse.success("Empresas activas obtenidas", empresas));
    }
    
    /**
     * Obtener empresa por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Empresa>> findById(@PathVariable Long id) {
        return empresaService.findById(id)
            .map(empresa -> ResponseEntity.ok(ApiResponse.success("Empresa encontrada", empresa)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Empresa no encontrada")));
    }
    
    /**
     * Crear nueva empresa
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Empresa>> create(@RequestBody Empresa empresa) {
        try {
            Empresa saved = empresaService.save(empresa);
            return ResponseEntity.ok(ApiResponse.success("Empresa creada exitosamente", saved));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Error al crear empresa: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar empresa
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Empresa>> update(@PathVariable Long id, @RequestBody Empresa empresa) {
        if (!empresaService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Empresa no encontrada"));
        }
        empresa.setId(id);
        Empresa updated = empresaService.save(empresa);
        return ResponseEntity.ok(ApiResponse.success("Empresa actualizada exitosamente", updated));
    }
    
    /**
     * Eliminar empresa (cambiar estado a inactivo)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!empresaService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Empresa no encontrada"));
        }
        empresaService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Empresa eliminada exitosamente", null));
    }
}
