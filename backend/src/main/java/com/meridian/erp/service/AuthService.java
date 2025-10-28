package com.meridian.erp.service;

import com.meridian.erp.dto.LoginRequest;
import com.meridian.erp.dto.LoginResponse;
import com.meridian.erp.entity.Usuario;
import com.meridian.erp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Optional<LoginResponse> login(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsuario(request.getUsername());
        
        if (usuarioOpt.isEmpty()) {
            return Optional.empty();
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return Optional.empty();
        }
        
        // Verificar que el usuario esté activo
        if (usuario.getEstado() != 1) {
            return Optional.empty();
        }
        
        // Construir nombre completo
        String nombreCompleto = String.format("%s %s %s", 
            usuario.getNombres() != null ? usuario.getNombres() : "",
            usuario.getApellidoPaterno() != null ? usuario.getApellidoPaterno() : "",
            usuario.getApellidoMaterno() != null ? usuario.getApellidoMaterno() : ""
        ).trim();
        
        // Obtener nombre de empresa (manejo seguro)
        String empresaNombre = "EMPRESA TEST";
        Long empresaId = usuario.getEmpresaId();
        try {
            if (usuario.getEmpresa() != null && usuario.getEmpresa().getDescripcion() != null) {
                empresaNombre = usuario.getEmpresa().getDescripcion();
            }
        } catch (Exception e) {
            // Si hay error al cargar la empresa, usar valor por defecto
            System.out.println("Advertencia: No se pudo cargar la empresa del usuario");
        }
        
        // Obtener primerLogin (por defecto 0 si es null)
        Integer primerLogin = usuario.getPrimerLogin() != null ? usuario.getPrimerLogin() : 0;
        
        // Obtener rolId (por defecto 1 si es null)
        Integer rolId = usuario.getRolId() != null ? usuario.getRolId() : 1;
        
        LoginResponse response = new LoginResponse(
            usuario.getId(),
            usuario.getUsuario(),
            nombreCompleto,
            usuario.getCorreo(),
            empresaNombre,
            empresaId,
            empresaNombre,
            rolId,
            usuario.getEstado(),
            primerLogin
        );
        
        return Optional.of(response);
    }
}
