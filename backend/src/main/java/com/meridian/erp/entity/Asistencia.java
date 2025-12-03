package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rrhh_masistencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imasistencia_id")
    private Long id;
    
    @Column(name = "fa_fechaasistencia", nullable = false)
    private LocalDate fechaAsistencia;
    
    @Column(name = "ia_turno", length = 2, nullable = false)
    private String turnoId;
    
    @Column(name = "ia_sede", nullable = false)
    private Long sedeId;
    
    @Column(name = "ia_empresa", nullable = false)
    private Long empresaId;
    
    @Column(name = "ia_estado")
    private Integer estado = 1;
    
    @Column(name = "ia_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fa_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ia_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fa_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "ia_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fa_fechaelimino")
    private LocalDateTime fechaElimino;
    
    // Relación con detalles (opcional, para cargar detalles si es necesario)
    @OneToMany(mappedBy = "asistenciaId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AsistenciaDetalle> detalles;
    
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
