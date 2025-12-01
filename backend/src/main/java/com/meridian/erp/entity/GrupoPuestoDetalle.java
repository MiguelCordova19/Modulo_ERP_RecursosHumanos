package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "rrhh_grupo_puesto_detalle")
public class GrupoPuestoDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imgrupo_puesto_detalle_id")
    private Integer id;
    
    @Column(name = "igpd_grupo_id", nullable = false)
    private Integer grupoId;
    
    @Column(name = "igpd_puesto_id", nullable = false)
    private Integer puestoId;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tgpd_evaluacion", columnDefinition = "jsonb")
    private Map<String, String> evaluacion;
    
    @Column(name = "igpd_estado")
    private Integer estado;
    
    @Column(name = "igpd_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fgpd_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "igpd_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fgpd_fechaedito")
    private LocalDateTime fechaEdito;
    
    // Campos transitorios para mostrar información relacionada
    @Transient
    private String puestoNombre;
    
    @Transient
    private String puestoDescripcion;
    
    @Transient
    private String grupoNombre;
}
