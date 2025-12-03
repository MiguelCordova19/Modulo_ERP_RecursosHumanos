package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mtipoplanilla")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoPlanilla {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imtipoplanilla_id")
    private Long id;
    
    @Column(name = "ttp_descripcion", nullable = false, unique = true, length = 100)
    private String descripcion;
    
    @Column(name = "ttp_codigo", unique = true, length = 20)
    private String codigo;
    
    @Column(name = "itp_estado")
    private Integer estado = 1;
    
    @Column(name = "itp_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "ftp_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "itp_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "ftp_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "itp_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "ftp_fechaelimino")
    private LocalDateTime fechaElimino;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        if (estado == null) {
            estado = 1;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaEdito = LocalDateTime.now();
    }
}
