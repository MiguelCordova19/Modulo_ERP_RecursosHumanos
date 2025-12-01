package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mconceptos")
public class Concepto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptos_id")
    private Long id;
    
    @Column(name = "ic_tributos", length = 3)
    private String tributoId;
    
    @Column(name = "ic_tipoconcepto", length = 2)
    private String tipoConceptoId;
    
    @Column(name = "tc_descripcion", length = 200)
    private String descripcion;
    
    @Column(name = "ic_afecto")
    private Integer afecto;
    
    @Column(name = "ic_tipototales", length = 2)
    private String tipoTotalesId;
    
    @Column(name = "ic_empresa")
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
    
    // Campos transitorios para mostrar información relacionada
    @Transient
    private String tributoDescripcion;
    
    @Transient
    private String tributoCodigoSunat;
    
    @Transient
    private String tipoConceptoDescripcion;
    
    @Transient
    private String tipoTotalesDescripcion;
}
