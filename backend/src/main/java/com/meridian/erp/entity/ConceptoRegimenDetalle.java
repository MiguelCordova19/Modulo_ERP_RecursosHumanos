package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_conceptos_regimen_detalle")
public class ConceptoRegimenDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptosregimendetalle_id")
    private Long id;
    
    @Column(name = "ic_conceptosregimen_id", nullable = false)
    private Long conceptoRegimenId;
    
    @Column(name = "ic_concepto_id", nullable = false)
    private Long conceptoId;
    
    @Column(name = "ic_estado")
    private Integer estado;
    
    @Column(name = "fc_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    // Relación con cabecera
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ic_conceptosregimen_id", insertable = false, updatable = false)
    private ConceptoRegimenLaboral conceptoRegimenLaboral;
    
    // Campos transitorios para mostrar información del concepto
    @Transient
    private String conceptoDescripcion;
    
    @Transient
    private String conceptoCodigoSunat;
}
