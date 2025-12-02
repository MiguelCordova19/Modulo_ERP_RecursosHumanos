package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mcontratotrabajador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContratoTrabajador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imcontratotrabajador_id")
    private Long id;
    
    // Información del trabajador y contrato
    @Column(name = "ict_trabajador", nullable = false)
    private Long trabajadorId;
    
    @Column(name = "ict_tipocontrato", nullable = false)
    private Integer tipoContratoId;
    
    @Column(name = "fct_fechainiciolaboral", nullable = false)
    private LocalDate fechaInicioLaboral; // Fecha de ingreso laboral a la empresa
    
    @Column(name = "fct_fechainicio")
    private LocalDate fechaInicio; // Fecha de inicio del contrato
    
    @Column(name = "fct_fechafinlaboral")
    private LocalDate fechaFinLaboral;
    
    // Ubicación y puesto
    @Column(name = "ict_sede", nullable = false)
    private Long sedeId;
    
    @Column(name = "ict_puesto", nullable = false)
    private Integer puestoId;
    
    // Horario y turno
    @Column(name = "ict_turno", length = 2, nullable = false)
    private String turnoId;
    
    @Column(name = "ict_horario", length = 2, nullable = false)
    private String horarioId;
    
    @Column(name = "hct_horaentrada", nullable = false)
    private LocalTime horaEntrada;
    
    @Column(name = "hct_horasalida", nullable = false)
    private LocalTime horaSalida;
    
    @Column(name = "ict_diadescanso", length = 2, nullable = false)
    private String diaDescansoId;
    
    // Tipo de trabajador y regímenes
    @Column(name = "ict_tipotrabajador", nullable = false)
    private Integer tipoTrabajadorId;
    
    @Column(name = "ict_regimenpensionario", nullable = false)
    private Integer regimenPensionarioId;
    
    @Column(name = "ict_regimenlaboral", nullable = false)
    private Long regimenLaboralId;
    
    // Horas laborales
    @Column(name = "hct_horalaboral", precision = 5, scale = 2)
    private BigDecimal horaLaboral;
    
    // Remuneraciones
    @Column(name = "dct_remuneracionbasica", precision = 10, scale = 2)
    private BigDecimal remuneracionBasica;
    
    @Column(name = "dct_remuneracionrc", precision = 10, scale = 2)
    private BigDecimal remuneracionRc;
    
    @Column(name = "dct_sueldomensual", precision = 10, scale = 2)
    private BigDecimal sueldoMensual;
    
    // CUSPP (solo para AFP)
    @Column(name = "tct_cuspp", length = 20)
    private String cuspp;
    
    // Empresa
    @Column(name = "ict_empresa", nullable = false)
    private Integer empresaId;
    
    // Estado y auditoría
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
