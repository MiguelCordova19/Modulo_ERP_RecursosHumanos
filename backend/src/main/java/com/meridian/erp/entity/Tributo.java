package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mtributos")
public class Tributo {
    
    @Id
    @Column(name = "imtributos_id", length = 3)
    private String id;
    
    @Column(name = "it_tid", length = 2, nullable = false)
    private String tipoId;
    
    @Column(name = "tt_codsunat", length = 10, nullable = false)
    private String codigoSunat;
    
    @Column(name = "tt_descripcion", length = 200, nullable = false)
    private String descripcion;
    
    @Column(name = "estado")
    private Integer estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
