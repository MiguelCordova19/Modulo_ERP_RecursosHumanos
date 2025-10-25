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
    
    @Column(name = "tr_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "ir_estado", nullable = false)
    private Integer estado;
    
    @Column(name = "ir_empresa")
    private Integer empresaId;
}
