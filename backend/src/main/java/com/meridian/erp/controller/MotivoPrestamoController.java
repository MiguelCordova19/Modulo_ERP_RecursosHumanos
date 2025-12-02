package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.MotivoPrestamo;
import com.meridian.erp.service.MotivoPrestamoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/motivos-prestamo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MotivoPrestamoController {
    
    private final MotivoPrestamoService motivoPrestamoService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<MotivoPrestamo>>> listar(
            @RequestParam(required = false) Integer empresaId) {
        try {
            // Si no se proporciona empresaId, usar el de la sesión o un valor por defecto
            if (empresaId == null) {
                empresaId = 1; // Valor por defecto, ajustar según tu lógica de sesión
            }
            
            List<MotivoPrestamo> motivos = motivoPrestamoService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Motivos obtenidos exitosamente", motivos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener motivos: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MotivoPrestamo>> obtenerPorId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = 1; // Valor por defecto
            }
            
            Optional<MotivoPrestamo> motivo = motivoPrestamoService.obtenerPorId(id, empresaId);
            
            if (motivo.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Motivo obtenido exitosamente", motivo.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Motivo no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener motivo: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MotivoPrestamo>> crear(@RequestBody MotivoPrestamo motivo) {
        try {
            // Validaciones básicas
            if (motivo.getDescripcion() == null || motivo.getDescripcion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La descripción es requerida"));
            }
            
            if (motivo.getEmpresaId() == null) {
                motivo.setEmpresaId(1); // Valor por defecto
            }
            
            MotivoPrestamo nuevoMotivo = motivoPrestamoService.crear(motivo);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Motivo creado exitosamente", nuevoMotivo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear motivo: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MotivoPrestamo>> actualizar(
            @PathVariable Integer id,
            @RequestBody MotivoPrestamo motivo,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = motivo.getEmpresaId() != null ? motivo.getEmpresaId() : 1;
            }
            
            // Validaciones básicas
            if (motivo.getDescripcion() == null || motivo.getDescripcion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("La descripción es requerida"));
            }
            
            MotivoPrestamo motivoActualizado = motivoPrestamoService.actualizar(id, motivo, empresaId);
            return ResponseEntity.ok(ApiResponse.success("Motivo actualizado exitosamente", motivoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar motivo: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer empresaId) {
        try {
            if (empresaId == null) {
                empresaId = 1; // Valor por defecto
            }
            
            motivoPrestamoService.eliminar(id, empresaId);
            return ResponseEntity.ok(ApiResponse.success("Motivo eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar motivo: " + e.getMessage()));
        }
    }
}
