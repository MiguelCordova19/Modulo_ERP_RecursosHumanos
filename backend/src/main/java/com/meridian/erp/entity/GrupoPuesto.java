package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "rrhh_grupos_puestos")
public class GrupoPuesto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imgrupo_id")
    private Long id;
    
    @Column(name = "tg_descripcion", length = 200, nullable = false)
    private String descripcion;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tg_evaluacion", columnDefinition = "jsonb")
    private Map<String, String> evaluacion;
    
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
