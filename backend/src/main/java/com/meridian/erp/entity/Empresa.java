package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rrhh_mempresa")
public class Empresa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imempresa_id")
    private Long id;
    
    @Column(name = "te_descripcion", length = 100)
    private String descripcion;
    
    @Column(name = "ie_estado")
    private Integer estado;
}
