package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Tipo;
import com.meridian.erp.service.TipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoController {
    
    private final TipoService tipoService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tipo>>> listar() {
        try {
            List<Tipo> tipos = tipoService.listarTodos();
            return ResponseEntity.ok(ApiResponse.success("Tipos obtenidos exitosamente", tipos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tipo>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Tipo> tipo = tipoService.obtenerPorId(id);
            
            if (tipo.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Tipo obtenido exitosamente", tipo.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipo: " + e.getMessage()));
        }
    }
}
