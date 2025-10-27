package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Usuario;
import com.meridian.erp.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Usuario>>> findAll() {
        List<Usuario> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Usuarios activos obtenidos", usuarios));
    }
    
    @GetMapping("/todos")
    public ResponseEntity<ApiResponse<List<Usuario>>> findAllUsuarios() {
        List<Usuario> usuarios = usuarioService.findAllUsuarios();
        return ResponseEntity.ok(ApiResponse.success("Todos los usuarios obtenidos", usuarios));
    }
    
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<Usuario>>> findByEmpresa(@PathVariable Long empresaId) {
        List<Usuario> usuarios = usuarioService.findByEmpresa(empresaId);
        return ResponseEntity.ok(ApiResponse.success("Usuarios de la empresa obtenidos", usuarios));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Usuario>> findById(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(usuario -> ResponseEntity.ok(ApiResponse.success("Usuario encontrado", usuario)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Usuario no encontrado")));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Usuario>> create(@RequestBody Usuario usuario) {
        try {
            // Usar el nuevo método crearUsuario
            Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
            
            if (usuarioCreado != null) {
                return ResponseEntity.ok(ApiResponse.success("Usuario creado exitosamente", usuarioCreado));
            }
            
            return ResponseEntity.ok(ApiResponse.error("Error al crear usuario"));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Error al crear usuario: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Usuario no encontrado"));
        }
        
        usuario.setId(id);
        Map<String, Object> resultado = usuarioService.save(usuario);
        
        if (resultado != null) {
            String mensaje = (String) resultado.get("mensaje");
            
            if (mensaje.contains("ya existe")) {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
            
            // Obtener el usuario actualizado
            Usuario usuarioActualizado = usuarioService.findById(id).orElse(null);
            
            return ResponseEntity.ok(ApiResponse.success(mensaje, Map.of(
                "id", id,
                "usuario", resultado.get("usuario"),
                "data", usuarioActualizado
            )));
        }
        
        return ResponseEntity.ok(ApiResponse.error("Error al actualizar usuario"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Map<String, Object> resultado = usuarioService.deleteById(id);
        
        if (resultado != null) {
            Boolean success = (Boolean) resultado.get("success");
            String mensaje = (String) resultado.get("mensaje");
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success(mensaje, null));
            } else {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
        }
        
        return ResponseEntity.ok(ApiResponse.error("Error al eliminar usuario"));
    }
    
    @PostMapping("/{id}/cambiar-password")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cambiarPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String nuevaPassword = request.get("password");
            
            if (nuevaPassword == null || nuevaPassword.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("La contraseña es requerida"));
            }
            
            Map<String, Object> resultado = usuarioService.cambiarPassword(id, nuevaPassword);
            
            Boolean success = (Boolean) resultado.get("success");
            String mensaje = (String) resultado.get("message");
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success(mensaje, resultado));
            } else {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Error al cambiar contraseña: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/cambiar-password-validado")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cambiarPasswordValidado(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String passwordActual = request.get("passwordActual");
            String passwordNueva = request.get("passwordNueva");
            
            if (passwordActual == null || passwordActual.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("La contraseña actual es requerida"));
            }
            
            if (passwordNueva == null || passwordNueva.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("La contraseña nueva es requerida"));
            }
            
            Map<String, Object> resultado = usuarioService.cambiarPasswordValidado(id, passwordActual, passwordNueva);
            
            Boolean success = (Boolean) resultado.get("success");
            String mensaje = (String) resultado.get("message");
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success(mensaje, resultado));
            } else {
                return ResponseEntity.ok(ApiResponse.error(mensaje));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Error al cambiar contraseña: " + e.getMessage()));
        }
    }
}
