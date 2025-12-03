package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rrhh_mconceptosvariables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConceptosVariables {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptosvariables_id")
    private Long id;
    
    @Column(name = "icv_mes", nullable = false)
    private Integer mes;
    
    @Column(name = "icv_anio", nullable = false)
    private Integer anio;
    
    @Column(name = "icv_tipoplanilla", nullable = false)
    private Long tipoPlanillaId;
    
    @Column(name = "icv_conceptos", nullable = false)
    private Long conceptoId;
    
    @Column(name = "icv_sede")
    private Long sedeId;
    
    @Column(name = "icv_empresa", nullable = false)
    private Long empresaId;
    
    @Column(name = "icv_estado")
    private Integer estado = 1;
    
    @Column(name = "icv_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fcv_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "icv_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fcv_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "icv_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fcv_fechaelimino")
    private LocalDateTime fechaElimino;
    
    // Relación con detalles
    @OneToMany(mappedBy = "conceptosVariablesId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ConceptosVariablesDetalle> detalles;
    
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
