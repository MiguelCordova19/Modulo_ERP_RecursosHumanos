package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.Feriado;
import com.meridian.erp.service.FeriadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feriados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeriadoController {
    
    private final FeriadoService feriadoService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Feriado>>> listar(
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = 1;
            }
            
            List<Feriado> feriados = feriadoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Feriados obtenidos exitosamente", feriados));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener feriados: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Feriado>> obtenerPorId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = 1;
            }
            
            Optional<Feriado> feriado = feriadoService.obtenerPorId(id, empresaId);
            
            if (feriado.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Feriado obtenido exitosamente", feriado.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Feriado no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener feriado: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Feriado>> crear(@RequestBody Feriado feriado) {
        try {
            // Validaciones básicas
            if (feriado.getDenominacion() == null || feriado.getDenominacion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La denominación es requerida"));
            }
            
            if (feriado.getFechaFeriado() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La fecha es requerida"));
            }
            
            if (feriado.getEmpresaId() == null) {
                feriado.setEmpresaId(1);
            }
            
            Feriado nuevoFeriado = feriadoService.crear(feriado);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feriado creado exitosamente", nuevoFeriado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear feriado: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Feriado>> actualizar(
            @PathVariable Integer id,
            @RequestBody Feriado feriado,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = feriado.getEmpresaId() != null ? feriado.getEmpresaId() : 1;
            }
            
            // Validaciones básicas
            if (feriado.getDenominacion() == null || feriado.getDenominacion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La denominación es requerida"));
            }
            
            if (feriado.getFechaFeriado() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La fecha es requerida"));
            }
            
            Feriado feriadoActualizado = feriadoService.actualizar(id, feriado, empresaId);
            return ResponseEntity.ok(ApiResponse.success("Feriado actualizado exitosamente", feriadoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar feriado: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = 1;
            }
            
            feriadoService.eliminar(id, empresaId);
            return ResponseEntity.ok(ApiResponse.success("Feriado eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar feriado: " + e.getMessage()));
        }
    }
}
