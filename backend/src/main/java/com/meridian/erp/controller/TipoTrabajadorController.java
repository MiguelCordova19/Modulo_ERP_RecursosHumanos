package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoTrabajador;
import com.meridian.erp.service.TipoTrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipo-trabajador")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoTrabajadorController {
    
    private final TipoTrabajadorService tipoTrabajadorService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoTrabajador>>> listar(@RequestParam(defaultValue = "1") Integer empresaId) {
        try {
            List<TipoTrabajador> tiposTrabajador = tipoTrabajadorService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Tipos de trabajador obtenidos exitosamente", tiposTrabajador));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos de trabajador: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoTrabajador>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<TipoTrabajador> tipoTrabajador = tipoTrabajadorService.obtenerPorId(id);
            
            if (tipoTrabajador.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de trabajador obtenido exitosamente", tipoTrabajador.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo de trabajador no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipo de trabajador: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> crear(@RequestBody Map<String, Object> datos) {
        try {
            String codigoInterno = (String) datos.get("codigoInterno");
            Integer tipoId = (Integer) datos.get("tipoId");
            Integer regimenId = (Integer) datos.get("regimenId");
            String descripcion = (String) datos.get("descripcion");
            Integer empresaId = datos.get("empresaId") != null ? (Integer) datos.get("empresaId") : 1;
            
            // Validar código interno (3 dígitos numéricos)
            if (codigoInterno == null || !codigoInterno.matches("\\d{3}")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("El código interno debe ser de 3 dígitos numéricos"));
            }
            
            Integer nuevoId = tipoTrabajadorService.crear(codigoInterno, tipoId, regimenId, descripcion, empresaId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tipo de trabajador creado exitosamente", nuevoId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear tipo de trabajador: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> actualizar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> datos) {
        try {
            String codigoInterno = (String) datos.get("codigoInterno");
            Integer tipoId = (Integer) datos.get("tipoId");
            Integer regimenId = (Integer) datos.get("regimenId");
            String descripcion = (String) datos.get("descripcion");
            
            // Validar código interno (3 dígitos numéricos)
            if (codigoInterno == null || !codigoInterno.matches("\\d{3}")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("El código interno debe ser de 3 dígitos numéricos"));
            }
            
            boolean actualizado = tipoTrabajadorService.actualizar(id, codigoInterno, tipoId, regimenId, descripcion);
            
            if (actualizado) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de trabajador actualizado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo de trabajador no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar tipo de trabajador: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(@PathVariable Integer id) {
        try {
            boolean eliminado = tipoTrabajadorService.eliminar(id);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Tipo de trabajador eliminado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Tipo de trabajador no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar tipo de trabajador: " + e.getMessage()));
        }
    }
}
