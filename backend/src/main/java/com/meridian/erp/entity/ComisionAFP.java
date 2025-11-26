package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "rrhh_mafp")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComisionAFP {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imafp_id")
    private Integer id;
    
    @Column(name = "ia_mes", nullable = false)
    private Integer mes;
    
    @Column(name = "ia_anio", nullable = false)
    private Integer anio;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ia_regimenpensionario", nullable = false)
    private RegimenPensionario regimenPensionario;
    
    @Column(name = "da_comisionflujo", nullable = false, precision = 10, scale = 2)
    private BigDecimal comisionFlujo = BigDecimal.ZERO;
    
    @Column(name = "da_comisionanualsaldo", nullable = false, precision = 10, scale = 2)
    private BigDecimal comisionAnualSaldo = BigDecimal.ZERO;
    
    @Column(name = "da_primaseguro", nullable = false, precision = 10, scale = 2)
    private BigDecimal primaSeguro = BigDecimal.ZERO;
    
    @Column(name = "da_aporteobligatorio", nullable = false, precision = 10, scale = 2)
    private BigDecimal aporteObligatorio = BigDecimal.ZERO;
    
    @Column(name = "da_remunmaxima", nullable = false, precision = 10, scale = 2)
    private BigDecimal remuneracionMaxima = BigDecimal.ZERO;
    
    @Column(name = "ia_estado", nullable = false)
    private Integer estado = 1;
    
    @Column(name = "empresa_id", nullable = false)
    private Integer empresaId;
}
