package com.meridian.erp.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ConceptoTrabajadorRequest {
    
    private Long contratoId;
    private Integer empresaId;
    private List<ConceptoItem> conceptos;
    
    @Data
    public static class ConceptoItem {
        private Long conceptoId;
        private String codigo;
        private String descripcion;
        private String tipo; // VARIABLE o FIJO
        private String tipoValor; // MONTO o PORCENTAJE
        private BigDecimal valor;
    }
}
