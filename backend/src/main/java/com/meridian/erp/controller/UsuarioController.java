package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Usuario;
import com.meridian.erp.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Usuario>>> findAll() {
        List<Usuario> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos", usuarios));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Usuario>> findById(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(usuario -> ResponseEntity.ok(ApiResponse.success("Usuario encontrado", usuario)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Usuario no encontrado")));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Usuario>> create(@RequestBody Usuario usuario) {
        if (usuarioService.existsByUsuario(usuario.getUsuario())) {
            return ResponseEntity.ok(ApiResponse.error("El nombre de usuario ya existe"));
        }
        Usuario saved = usuarioService.save(usuario);
        return ResponseEntity.ok(ApiResponse.success("Usuario creado exitosamente", saved));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Usuario>> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Usuario no encontrado"));
        }
        usuario.setId(id);
        Usuario updated = usuarioService.save(usuario);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Usuario no encontrado"));
        }
        usuarioService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }
}
