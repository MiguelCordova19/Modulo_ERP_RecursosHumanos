package com.meridian.erp.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MenuDTO {
    private Integer menu_id;
    private String menu_ruta;
    private String menu_icon;
    private String menu_nombre;
    private Integer menu_estado;
    private Integer menu_padre;
    private Integer menu_nivel;
    private Integer menu_posicion;
    private List<MenuDTO> hijos = new ArrayList<>();
    
    // Constructor desde Menu entity
    public MenuDTO(Integer id, String ruta, String icon, String nombre, 
                   Integer estado, Integer padre, Integer nivel, Integer posicion) {
        this.menu_id = id;
        this.menu_ruta = ruta;
        this.menu_icon = icon;
        this.menu_nombre = nombre;
        this.menu_estado = estado;
        this.menu_padre = padre;
        this.menu_nivel = nivel;
        this.menu_posicion = posicion;
    }
}
