package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.ContratoTrabajador;
import com.meridian.erp.service.ContratoTrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContratoTrabajadorController {
    
    private final ContratoTrabajadorService contratoTrabajadorService;
    
    /**
     * POST /api/contratos
     * Guardar nuevo contrato
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> guardar(@RequestBody Map<String, Object> datos) {
        try {
            // Extraer datos del request
            Long trabajadorId = Long.valueOf(datos.get("trabajadorId").toString());
            Integer tipoContratoId = Integer.valueOf(datos.get("tipoContratoId").toString());
            LocalDate fechaIngresoLaboral = datos.get("fechaIngresoLaboral") != null ? LocalDate.parse(datos.get("fechaIngresoLaboral").toString()) : null;
            LocalDate fechaInicio = LocalDate.parse(datos.get("fechaInicio").toString());
            LocalDate fechaFin = datos.get("fechaFin") != null ? LocalDate.parse(datos.get("fechaFin").toString()) : null;
            Long sedeId = Long.valueOf(datos.get("sedeId").toString());
            Integer puestoId = Integer.valueOf(datos.get("puestoId").toString());
            String turnoId = datos.get("turnoId").toString();
            String horarioId = datos.get("horarioId").toString();
            LocalTime horaEntrada = LocalTime.parse(datos.get("horaEntrada").toString());
            LocalTime horaSalida = LocalTime.parse(datos.get("horaSalida").toString());
            String diaDescansoId = datos.get("diaDescansoId").toString();
            Integer tipoTrabajadorId = Integer.valueOf(datos.get("tipoTrabajadorId").toString());
            Integer regimenPensionarioId = Integer.valueOf(datos.get("regimenPensionarioId").toString());
            Long regimenLaboralId = Long.valueOf(datos.get("regimenLaboralId").toString());
            BigDecimal horaLaboral = new BigDecimal(datos.get("horaLaboral").toString());
            BigDecimal remuneracionBasica = new BigDecimal(datos.get("remuneracionBasica").toString());
            BigDecimal remuneracionRc = new BigDecimal(datos.get("remuneracionRc").toString());
            BigDecimal sueldoMensual = new BigDecimal(datos.get("sueldoMensual").toString());
            String cuspp = datos.get("cuspp") != null ? datos.get("cuspp").toString() : null;
            Integer empresaId = datos.get("empresaId") != null ? Integer.valueOf(datos.get("empresaId").toString()) : 1;
            Long usuarioId = datos.get("usuarioId") != null ? Long.valueOf(datos.get("usuarioId").toString()) : 1L;
            
            // Guardar contrato
            Long contratoId = contratoTrabajadorService.guardar(
                    trabajadorId,
                    tipoContratoId,
                    fechaIngresoLaboral,
                    fechaInicio,
                    fechaFin,
                    sedeId,
                    puestoId,
                    turnoId,
                    horarioId,
                    horaEntrada,
                    horaSalida,
                    diaDescansoId,
                    tipoTrabajadorId,
                    regimenPensionarioId,
                    regimenLaboralId,
                    horaLaboral,
                    remuneracionBasica,
                    remuneracionRc,
                    sueldoMensual,
                    cuspp,
                    empresaId,
                    usuarioId
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Contrato guardado exitosamente", contratoId));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al guardar contrato: " + e.getMessage()));
        }
    }
    
    /**
     * PUT /api/contratos/{id}
     * Actualizar contrato existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> actualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> datos) {
        try {
            // Extraer datos del request
            Long trabajadorId = Long.valueOf(datos.get("trabajadorId").toString());
            Integer tipoContratoId = Integer.valueOf(datos.get("tipoContratoId").toString());
            LocalDate fechaIngresoLaboral = datos.get("fechaIngresoLaboral") != null ? LocalDate.parse(datos.get("fechaIngresoLaboral").toString()) : null;
            LocalDate fechaInicio = LocalDate.parse(datos.get("fechaInicio").toString());
            LocalDate fechaFin = datos.get("fechaFin") != null ? LocalDate.parse(datos.get("fechaFin").toString()) : null;
            Long sedeId = Long.valueOf(datos.get("sedeId").toString());
            Integer puestoId = Integer.valueOf(datos.get("puestoId").toString());
            String turnoId = datos.get("turnoId").toString();
            String horarioId = datos.get("horarioId").toString();
            LocalTime horaEntrada = LocalTime.parse(datos.get("horaEntrada").toString());
            LocalTime horaSalida = LocalTime.parse(datos.get("horaSalida").toString());
            String diaDescansoId = datos.get("diaDescansoId").toString();
            Integer tipoTrabajadorId = Integer.valueOf(datos.get("tipoTrabajadorId").toString());
            Integer regimenPensionarioId = Integer.valueOf(datos.get("regimenPensionarioId").toString());
            Long regimenLaboralId = Long.valueOf(datos.get("regimenLaboralId").toString());
            BigDecimal horaLaboral = new BigDecimal(datos.get("horaLaboral").toString());
            BigDecimal remuneracionBasica = new BigDecimal(datos.get("remuneracionBasica").toString());
            BigDecimal remuneracionRc = new BigDecimal(datos.get("remuneracionRc").toString());
            BigDecimal sueldoMensual = new BigDecimal(datos.get("sueldoMensual").toString());
            String cuspp = datos.get("cuspp") != null ? datos.get("cuspp").toString() : null;
            Integer empresaId = datos.get("empresaId") != null ? Integer.valueOf(datos.get("empresaId").toString()) : 1;
            Long usuarioId = datos.get("usuarioId") != null ? Long.valueOf(datos.get("usuarioId").toString()) : 1L;
            
            // Actualizar contrato
            boolean actualizado = contratoTrabajadorService.actualizar(
                    id,
                    trabajadorId,
                    tipoContratoId,
                    fechaIngresoLaboral,
                    fechaInicio,
                    fechaFin,
                    sedeId,
                    puestoId,
                    turnoId,
                    horarioId,
                    horaEntrada,
                    horaSalida,
                    diaDescansoId,
                    tipoTrabajadorId,
                    regimenPensionarioId,
                    regimenLaboralId,
                    horaLaboral,
                    remuneracionBasica,
                    remuneracionRc,
                    sueldoMensual,
                    cuspp,
                    empresaId,
                    usuarioId
            );
            
            if (actualizado) {
                return ResponseEntity.ok(ApiResponse.success("Contrato actualizado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contrato no encontrado"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar contrato: " + e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/contratos/{id}?usuarioId=1
     * Eliminar contrato (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> eliminar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        try {
            boolean eliminado = contratoTrabajadorService.eliminar(id, usuarioId);
            
            if (eliminado) {
                return ResponseEntity.ok(ApiResponse.success("Contrato eliminado exitosamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contrato no encontrado"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar contrato: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/contratos/{id}
     * Obtener contrato por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContratoTrabajador>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<ContratoTrabajador> contrato = contratoTrabajadorService.obtenerPorId(id);
            
            if (contrato.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Contrato obtenido exitosamente", contrato.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contrato no encontrado"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contrato: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/contratos/sede/{sedeId}
     * Listar contratos por sede
     */
    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<ApiResponse<List<ContratoTrabajador>>> listarPorSede(@PathVariable Long sedeId) {
        try {
            List<ContratoTrabajador> contratos = contratoTrabajadorService.listarPorSede(sedeId);
            return ResponseEntity.ok(ApiResponse.success("Contratos obtenidos exitosamente", contratos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contratos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/contratos/empresa/{empresaId}
     * Listar contratos por empresa con información completa
     */
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listarPorEmpresa(@PathVariable Integer empresaId) {
        try {
            List<Map<String, Object>> contratos = contratoTrabajadorService.listarPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success("Contratos obtenidos exitosamente", contratos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contratos: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/contratos
     * Listar todos los contratos activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContratoTrabajador>>> listarActivos() {
        try {
            List<ContratoTrabajador> contratos = contratoTrabajadorService.listarActivos();
            return ResponseEntity.ok(ApiResponse.success("Contratos obtenidos exitosamente", contratos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contratos: " + e.getMessage()));
        }
    }
}
