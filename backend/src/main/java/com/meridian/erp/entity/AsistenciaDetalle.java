package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "rrhh_masistenciadetalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imasistenciadetalle_id")
    private Long id;
    
    @Column(name = "iad_asistencia", nullable = false)
    private Long asistenciaId;
    
    @Column(name = "iad_trabajador", nullable = false)
    private Long trabajadorId;
    
    @Column(name = "iad_diadescanso")
    private Integer diaDescanso = 0;
    
    @Column(name = "iad_compdiadescanso")
    private Integer comproDiaDescanso = 0;
    
    @Column(name = "iad_diaferiado")
    private Integer diaFeriado = 0;
    
    @Column(name = "iad_trabdiaferiado")
    private Integer diaFeriadoTrabajo = 0;
    
    @Column(name = "iad_falto")
    private Integer falto = 0;
    
    @Column(name = "had_horaingreso")
    private LocalTime horaIngreso;
    
    @Column(name = "had_horatardanza")
    private LocalTime horaTardanza;
    
    @Column(name = "tad_observacion", length = 200)
    private String observacion;
    
    @Column(name = "iad_empresa", nullable = false)
    private Long empresaId;
    
    @Column(name = "iad_estado")
    private Integer estado = 1;
}
