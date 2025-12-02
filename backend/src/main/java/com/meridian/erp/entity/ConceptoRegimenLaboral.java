package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rrhh_conceptos_regimen_laboral")
public class ConceptoRegimenLaboral {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptosregimen_id")
    private Long id;
    
    @Column(name = "ic_regimenlaboral", length = 2, nullable = false)
    private String regimenLaboralId;
    
    @Column(name = "ic_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "ic_estado")
    private Integer estado;
    
    @Column(name = "ic_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fc_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ic_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fc_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "ic_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fc_fechaelimino")
    private LocalDateTime fechaElimino;
    
    // Relación con detalles
    @OneToMany(mappedBy = "conceptoRegimenLaboral", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConceptoRegimenDetalle> detalles = new ArrayList<>();
    
    // Campos transitorios para mostrar información
    @Transient
    private String regimenLaboralNombre;
    
    @Transient
    private String regimenLaboralCodigo;
}
