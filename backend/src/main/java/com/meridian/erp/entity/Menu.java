package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rrhh_mmenu")
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Integer id;
    
    @Column(name = "menu_ruta", length = 150)
    private String ruta;
    
    @Column(name = "menu_icon", length = 50)
    private String icon;
    
    @Column(name = "menu_nombre", length = 150)
    private String nombre;
    
    @Column(name = "menu_estado")
    private Integer estado;
    
    @Column(name = "menu_padre")
    private Integer menuPadre;
    
    @Column(name = "menu_nivel")
    private Integer nivel;
    
    @Column(name = "menu_posicion")
    private Integer posicion;
}
