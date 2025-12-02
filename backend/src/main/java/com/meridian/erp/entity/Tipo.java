package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rrhh_mtipo")
public class Tipo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imtipo_id")
    private Integer id;
    
    @Column(name = "tt_codsunat", length = 20, nullable = false, unique = true)
    private String codSunat;
    
    @Column(name = "tt_descripcion", length = 200, nullable = false)
    private String descripcion;
}
