package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.MenuDTO;
import com.meridian.erp.entity.Menu;
import com.meridian.erp.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class MenuController {
    
    private final MenuService menuService;
    
    /**
     * Obtiene todos los menús activos en estructura jerárquica
     * Este es el endpoint principal que usa el frontend
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuDTO>>> findAllActiveHierarchical() {
        List<MenuDTO> menus = menuService.findAllActiveHierarchical();
        return ResponseEntity.ok(ApiResponse.success("Menús obtenidos exitosamente", menus));
    }
    
    /**
     * Obtiene todos los menús activos (lista plana)
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Menu>>> findAllActive() {
        List<Menu> menus = menuService.findAllActive();
        return ResponseEntity.ok(ApiResponse.success("Menús activos obtenidos", menus));
    }
    
    /**
     * Obtiene todos los menús (incluyendo inactivos)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Menu>>> findAll() {
        List<Menu> menus = menuService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Todos los menús obtenidos", menus));
    }
    
    /**
     * Obtiene los menús activos con permisos para un rol específico
     */
    @GetMapping("/rol/{rolId}")
    public ResponseEntity<ApiResponse<List<MenuDTO>>> findByRol(@PathVariable Integer rolId) {
        List<MenuDTO> menus = menuService.findActiveHierarchicalByRol(rolId);
        return ResponseEntity.ok(ApiResponse.success("Menús con permisos obtenidos", menus));
    }
}
