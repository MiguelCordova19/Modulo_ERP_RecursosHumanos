package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_regimenlaboral")
public class RegimenLaboral {
    
    @Id
    @Column(name = "imregimenlaboral_id", length = 2)
    private String id;
    
    @Column(name = "trl_codsunat", length = 10, nullable = false)
    private String codSunat;
    
    @Column(name = "trl_regimenlaboral", length = 100, nullable = false)
    private String regimenLaboral;
    
    @Column(name = "trl_descripcion", length = 500)
    private String descripcion;
    
    @Column(name = "estado")
    private Integer estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
