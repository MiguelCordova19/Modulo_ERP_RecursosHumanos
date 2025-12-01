package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mgrupos")
public class Grupo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imgrupo_id")
    private Integer id;
    
    @Column(name = "tg_nombre", length = 20, nullable = false)
    private String nombre;
    
    @Column(name = "tg_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "ig_estado")
    private Integer estado;
    
    @Column(name = "ig_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "ig_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fg_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ig_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fg_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "ig_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fg_fechaelimino")
    private LocalDateTime fechaElimino;
}
