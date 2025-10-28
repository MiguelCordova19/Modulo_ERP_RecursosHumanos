package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rrhh_mrol")
public class Rol {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imrol_id")
    private Integer id;
    
    @Column(name = "tr_descripcion", length = 100)
    private String descripcion;
    
    @Column(name = "ir_estado")
    private Integer estado;
    
    @Column(name = "ir_empresa")
    private Long empresaId;
    
    // Campos transitorios para datos del JOIN
    @Transient
    private String empresaNombre;
}
