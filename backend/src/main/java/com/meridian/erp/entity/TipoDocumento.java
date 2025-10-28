package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rrhh_mtipodocumento")
public class TipoDocumento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imtipodoc_id")
    private Integer id;
    
    @Column(name = "ttd_codsunat", length = 10)
    private String codigoSunat;
    
    @Column(name = "ttd_descripcion", length = 100)
    private String descripcion;
    
    @Column(name = "ttd_abreviatura", length = 100)
    private String abreviatura;
}
