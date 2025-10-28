package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.AsignarRolRequest;
import com.meridian.erp.dto.RolMenuResponse;
import com.meridian.erp.entity.Menu;
import com.meridian.erp.service.RolMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rol-menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RolMenuController {
    
    private final RolMenuService rolMenuService;
    
    /**
     * Obtener matriz de roles y menús para asignación
     */
    @GetMapping("/matriz")
    public ResponseEntity<ApiResponse<RolMenuResponse>> obtenerMatriz(
            @RequestParam Integer empresaId) {
        try {
            RolMenuResponse matriz = rolMenuService.obtenerMatrizRolMenu(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Matriz obtenida exitosamente", matriz));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error al obtener matriz: " + e.getMessage()));
        }
    }
    
    /**
     * Asignar menús a un rol
     */
    @PostMapping("/asignar")
    public ResponseEntity<ApiResponse<Void>> asignarMenus(
            @RequestBody AsignarRolRequest request) {
        try {
            rolMenuService.asignarMenusARol(request);
            return ResponseEntity.ok(ApiResponse.success("Permisos asignados exitosamente", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error al asignar permisos: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener menús asignados a un rol
     */
    @GetMapping("/rol/{rolId}")
    public ResponseEntity<ApiResponse<List<Integer>>> obtenerMenusPorRol(
            @PathVariable Integer rolId) {
        try {
            List<Integer> menuIds = rolMenuService.obtenerMenusPorRol(rolId);
            return ResponseEntity.ok(ApiResponse.success("Menús obtenidos exitosamente", menuIds));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error al obtener menús: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener menús con permiso para un usuario
     */
    @GetMapping("/usuario/{rolId}")
    public ResponseEntity<ApiResponse<List<Menu>>> obtenerMenusConPermiso(
            @PathVariable Integer rolId) {
        try {
            List<Menu> menus = rolMenuService.obtenerMenusConPermiso(rolId);
            return ResponseEntity.ok(ApiResponse.success("Menús con permiso obtenidos exitosamente", menus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error al obtener menús: " + e.getMessage()));
        }
    }
}
