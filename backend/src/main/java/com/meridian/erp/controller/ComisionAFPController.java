package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.ComisionAFP;
import com.meridian.erp.service.ComisionAFPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/comisiones-afp")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComisionAFPController {
    
    private final ComisionAFPService comisionAFPService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ComisionAFP>>> listar(@RequestParam(defaultValue = "1") Integer empresaId) {
        try {
            List<ComisionAFP> comisiones = comisionAFPService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Comisiones AFP obtenidas exitosamente", comisiones));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener comisiones AFP: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComisionAFP>> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<ComisionAFP> comision = comisionAFPService.obtenerPorId(id);
            
            if (comision.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Comisión AFP obtenida exitosamente", comision.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Comisión AFP no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener comisión AFP: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> crear(@RequestBody Map<String, Object> datos) {
        try {
            // Extraer periodo (formato: "2025-11")
            String periodo = (String) datos.get("periodo");
            String[] partesPeriodo = periodo.split("-");
            Integer anio = Integer.parseInt(partesPeriodo[0]);
            Integer mes = Integer.parseInt(partesPeriodo[1]);
            
            Integer regimenId = (Integer) datos.get("regimenId");
            BigDecimal comisionFlujo = new BigDecimal(datos.get("comisionFlujo").toString());
            BigDecimal comisionAnualSaldo = new BigDecimal(datos.get("comisionAnualSaldo").toString());
            BigDecimal primaSeguro = new BigDecimal(datos.get("primaSeguro").toString());
            BigDecimal aporteObligatorio = new BigDecimal(datos.get("aporteObligatorio").toString());
            BigDecimal remuneracionMaxima = new BigDecimal(datos.get("remuneracionMaxima").toString());
            Integer empresaId = datos.get("empresaId") != null ? (Integer) datos.get("empresaId") : 1;
            
            Integer nuevoId = comisionAFPService.crear(mes, anio, regimenId, 
                comisionFlujo, comisionAnualSaldo, primaSeguro, 
                aporteObligatorio, remuneracionMaxima, empresaId);
                
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comisión AFP creada exitosamente", nuevoId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear comisión AFP: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> actualizar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> datos) {
        try {
            // Extraer periodo
            String periodo = (String) datos.get("periodo");
            String[] partesPeriodo = periodo.split("-");
            Integer anio = Integer.parseInt(partesPeriodo[0]);
            Integer mes = Integer.parseInt(partesPeriodo[1]);
            
            Integer regimenId = (Integer) datos.get("regimenId");
            BigDecimal comisionFlujo = new BigDecimal(datos.get("comisionFlujo").toString());
            BigDecimal comisionAnualSaldo = new BigDecimal(datos.get("comisionAnualSaldo").toString());
            BigDecimal primaSeguro = new BigDecimal(datos.get("primaSeguro").toString());
            BigDecimal aporteObligatorio = new BigDecimal(datos.get("aporteObligatorio").toString());
            BigDecimal remuneracionMaxima = new BigDecimal(datos.get("remuneracionMaxima").toString());
            
            boolean actualizado = comisionAFPService.actualizar(id, mes, anio, regimenId,
                comisionFlujo, comisionAnualSaldo, primaSeguro,
                aporteObligatorio, remuneracionMaxima);
            
            if (actualizado) {
                return ResponseEntity.ok(ApiResponse.success("Comisión AFP actualizada exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Comisión AFP no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al actualizar comisión AFP: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(@PathVariable Integer id) {
        try {
            boolean eliminado = comisionAFPService.eliminar(id);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Comisión AFP eliminada exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Comisión AFP no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al eliminar comisión AFP: " + e.getMessage()));
        }
    }
}
