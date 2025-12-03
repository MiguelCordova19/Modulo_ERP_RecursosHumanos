package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "rrhh_mconceptosvariablesdetalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConceptosVariablesDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptosvariablesdetalle_id")
    private Long id;
    
    @Column(name = "icvd_conceptosvariables", nullable = false)
    private Long conceptosVariablesId;
    
    @Column(name = "icvd_trabajador", nullable = false)
    private Long trabajadorId;
    
    @Column(name = "fcvd_fecha", nullable = false)
    private LocalDate fecha;
    
    @Column(name = "dcvd_valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor = BigDecimal.ZERO;
    
    @Column(name = "icvd_empresa", nullable = false)
    private Long empresaId;
    
    @Column(name = "icvd_estado")
    private Integer estado = 1;
    
    @PrePersist
    protected void onCreate() {
        if (estado == null) {
            estado = 1;
        }
        if (valor == null) {
            valor = BigDecimal.ZERO;
        }
    }
}
