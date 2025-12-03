package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "rrhh_mcronogramavacacionesdetalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CronogramaVacacionesDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imcronogramavacacionesdetalle_id")
    private Long id;
    
    @Column(name = "icvd_cronogramavacaciones", nullable = false)
    private Long cronogramaId;
    
    @Column(name = "icvd_trabajador", nullable = false)
    private Long trabajadorId;
    
    @Column(name = "fcvd_fechainicio")
    private LocalDate fechaInicio;
    
    @Column(name = "fcvd_fechafin")
    private LocalDate fechaFin;
    
    @Column(name = "icvd_dias")
    private Integer dias;
    
    @Column(name = "tcvd_observaciones", length = 500)
    private String observaciones;
    
    @Column(name = "icvd_empresa", nullable = false)
    private Long empresaId;
    
    @Column(name = "icvd_estado")
    private Integer estado = 1;
}
