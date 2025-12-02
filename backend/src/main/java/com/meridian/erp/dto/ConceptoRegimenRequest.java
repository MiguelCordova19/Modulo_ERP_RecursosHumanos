package com.meridian.erp.dto;

import lombok.Data;
import java.util.List;

@Data
public class ConceptoRegimenRequest {
    private String regimenLaboralId;
    private Integer empresaId;
    private List<Long> conceptos;  // Lista de IDs de conceptos
}
