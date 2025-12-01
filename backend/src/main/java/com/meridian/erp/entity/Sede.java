package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_msede")
public class Sede {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imsede_id")
    private Long id;
    
    @Column(name = "ts_codigo", length = 20, nullable = false)
    private String codigo;
    
    @Column(name = "ts_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "is_estado")
    private Integer estado;
    
    @Column(name = "is_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "is_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fs_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "is_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fs_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "is_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fs_fechaelimino")
    private LocalDateTime fechaElimino;
}
