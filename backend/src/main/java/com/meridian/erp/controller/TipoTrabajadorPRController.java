package com.meridian.erp.controller;

import com.meridian.erp.dto.ApiResponse;
import com.meridian.erp.entity.TipoTrabajadorPR;
import com.meridian.erp.service.TipoTrabajadorPRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-trabajador-pr")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TipoTrabajadorPRController {
    
    private final TipoTrabajadorPRService tipoTrabajadorPRService;
    
    /**
     * GET /api/tipos-trabajador-pr
     * Listar todos los tipos activos (PLANILLA/RRHH)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoTrabajadorPR>>> listar() {
        try {
            List<TipoTrabajadorPR> tipos = tipoTrabajadorPRService.listarActivos();
            return ResponseEntity.ok(
                ApiResponse.success("Tipos obtenidos exitosamente", tipos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener tipos: " + e.getMessage()));
        }
    }
}
