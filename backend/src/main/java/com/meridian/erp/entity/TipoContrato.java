package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mtipocontrato")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoContrato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imtipocontrato_id")
    private Integer id;
    
    @Column(name = "ttc_codsunat", length = 2, nullable = false, unique = true)
    private String codigo;
    
    @Column(name = "ttc_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "btc_estado", nullable = false)
    private Boolean estado = true;
    
    @Column(name = "dttc_fechacreacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "dttc_fechamodificacion")
    private LocalDateTime fechaModificacion;
}
