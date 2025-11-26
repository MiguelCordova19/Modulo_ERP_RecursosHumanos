package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mmotivoprestamo")
public class MotivoPrestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "immmotivoprestamo_id")
    private Integer id;
    
    @Column(name = "tmp_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "imp_estado", nullable = false)
    private Integer estado = 1;
    
    @Column(name = "imempresa_id", nullable = false)
    private Integer empresaId;
    
    @Column(name = "dtmp_fechacreacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "dtmp_fechamodificacion")
    private LocalDateTime fechaModificacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (estado == null) {
            estado = 1;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDateTime.now();
    }
}
