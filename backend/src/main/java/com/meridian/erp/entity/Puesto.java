package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rrhh_mpuestos")
public class Puesto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "impuesto_id")
    private Integer id;
    
    @Column(name = "tp_nombre", length = 20, nullable = false)
    private String nombre;
    
    @Column(name = "tp_descripcion", length = 100, nullable = false)
    private String descripcion;
    
    @Column(name = "ip_estado")
    private Integer estado;
    
    @Column(name = "ip_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "ip_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fp_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ip_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fp_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "ip_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fp_fechaelimino")
    private LocalDateTime fechaElimino;
    
    // Campos transitorios para mostrar información relacionada
    @Transient
    private String grupoNombre;
    
    @Transient
    private String grupoDescripcion;
}
