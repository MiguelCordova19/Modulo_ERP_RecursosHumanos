package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.dto.LoginRequest;
import com.meridian.erp.dto.LoginResponse;
import com.meridian.erp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        Optional<LoginResponse> response = authService.login(request);
        
        if (response.isPresent()) {
            return ResponseEntity.ok(
                ApiResponse.success("Login exitoso", response.get())
            );
        } else {
            return ResponseEntity.ok(
                ApiResponse.error("Usuario o contraseña incorrectos")
            );
        }
    }
    
    @GetMapping("/login")
    public ResponseEntity<ApiResponse<String>> loginInfo() {
        return ResponseEntity.ok(
            ApiResponse.error("Método GET no permitido. Use POST para hacer login.")
        );
    }
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<String>> status() {
        return ResponseEntity.ok(
            ApiResponse.success("API de autenticación funcionando correctamente", "OK")
        );
    }
}
