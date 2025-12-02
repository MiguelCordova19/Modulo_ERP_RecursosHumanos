package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.RegimenPensionario;
import com.meridian.erp.service.RegimenPensionarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/regimenes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegimenPensionarioController {
    
    private final RegimenPensionarioService regimenPensionarioService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegimenPensionario>>> listar() {
        try {
            List<RegimenPensionario> regimenes = regimenPensionarioService.listarTodos();
            return ResponseEntity.ok(ApiResponse.success("Regímenes pensionarios obtenidos exitosamente", regimenes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener regímenes pensionarios: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegimenPensionario>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<RegimenPensionario> regimen = regimenPensionarioService.obtenerPorId(id);
            
            if (regimen.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Régimen pensionario obtenido exitosamente", regimen.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Régimen pensionario no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener régimen pensionario: " + e.getMessage()));
        }
    }
}
