package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mconceptostrabajador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConceptoTrabajador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imconceptostrabajador_id")
    private Long id;
    
    @Column(name = "ict_contratotrabajador", nullable = false)
    private Long contratoTrabajadorId;
    
    @Column(name = "ict_conceptos", nullable = false)
    private Long conceptoId;
    
    @Column(name = "ict_tipo", nullable = false)
    private Integer tipo; // 1=VARIABLE, 2=FIJO
    
    @Column(name = "ict_tipovalor", nullable = false)
    private Integer tipoValor; // 1=MONTO, 2=PORCENTAJE
    
    @Column(name = "dct_valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;
    
    @Column(name = "ict_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "ict_estado")
    private Integer estado = 1;
    
    @Column(name = "ict_usuarioregistro")
    private Long usuarioRegistro;
    
    @Column(name = "fct_fecharegistro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "ict_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "fct_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "ict_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "fct_fechaelimino")
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
