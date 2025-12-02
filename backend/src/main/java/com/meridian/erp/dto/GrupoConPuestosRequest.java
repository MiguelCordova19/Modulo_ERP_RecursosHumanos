package com.meridian.erp.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class GrupoConPuestosRequest {
    private String nombre;
    private String descripcion;
    private Integer empresaId;
    private List<PuestoConEvaluacion> puestos;
    
    @Data
    public static class PuestoConEvaluacion {
        private Integer puestoId;
        private Map<String, String> evaluacion;
    }
}
