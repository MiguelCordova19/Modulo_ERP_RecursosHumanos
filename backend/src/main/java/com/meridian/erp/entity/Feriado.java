package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mferiados")
public class Feriado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imferiado_id")
    private Integer id;
    
    @Column(name = "ff_fechaferiado", nullable = false)
    private LocalDate fechaFeriado;
    
    @Column(name = "tf_diaferiado", length = 50, nullable = false)
    private String diaFeriado;
    
    @Column(name = "tf_denominacion", length = 200, nullable = false)
    private String denominacion;
    
    @Column(name = "if_estado", nullable = false)
    private Integer estado = 1;
    
    @Column(name = "imempresa_id", nullable = false)
    private Integer empresaId;
    
    @Column(name = "dtf_fechacreacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "dtf_fechamodificacion")
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
