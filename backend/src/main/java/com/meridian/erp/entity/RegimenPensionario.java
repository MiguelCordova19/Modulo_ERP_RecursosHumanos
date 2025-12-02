package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rrhh_mregimenpensionario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegimenPensionario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imregimenpensionario_id")
    private Integer id;
    
    @Column(name = "trp_codsunat", nullable = false, length = 50)
    private String codSunat;
    
    @Column(name = "trp_descripcion", nullable = false, length = 200)
    private String descripcion;
    
    @Column(name = "trp_abreviatura", nullable = false, length = 100)
    private String abreviatura;
}
