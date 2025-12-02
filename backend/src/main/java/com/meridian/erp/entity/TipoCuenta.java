package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mtipocuenta")
public class TipoCuenta {
    
    @Id
    @Column(name = "imtipocuenta_id", length = 2)
    private String id;
    
    @Column(name = "ttc_descripcion", length = 50, nullable = false)
    private String descripcion;
    
    @Column(name = "estado")
    private Integer estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
