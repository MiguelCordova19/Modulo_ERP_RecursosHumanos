package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mtipototales")
public class TipoTotales {
    
    @Id
    @Column(name = "imtipototales_id", length = 2)
    private String id;
    
    @Column(name = "ttt_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "estado")
    private Integer estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
