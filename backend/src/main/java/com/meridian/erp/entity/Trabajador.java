package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_trabajador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trabajador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "itrabajador_id")
    private Long id;
    
    // Datos Personales
    @Column(name = "it_en", length = 2, nullable = false)
    private String tipoTrabajador; // 01=PLANILLA, 02=RRHH
    
    @Column(name = "it_tipodoc", length = 2, nullable = false)
    private String tipoDocumento;
    
    @Column(name = "tt_nrodoc", length = 20, nullable = false)
    private String numeroDocumento;
    
    @Column(name = "tt_apellidopaterno", length = 50, nullable = false)
    private String apellidoPaterno;
    
    @Column(name = "tt_apellidomaterno", length = 50)
    private String apellidoMaterno;
    
    @Column(name = "tt_nombres", length = 50, nullable = false)
    private String nombres;
    
    @Column(name = "tt_nrocelular", length = 20)
    private String numeroCelular;
    
    @Column(name = "tt_correo", length = 50)
    private String correo;
    
    @Column(name = "ft_fechanacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "it_genero", length = 2)
    private String genero;
    
    @Column(name = "it_estadocivil", length = 2)
    private String estadoCivil;
    
    @Column(name = "it_regimenlaboral", length = 2)
    private String regimenLaboral;
    
    // Datos Laborales
    @Column(name = "ft_fechaingreso")
    private LocalDate fechaIngreso;
    
    @Column(name = "it_empresa", nullable = false)
    private Integer empresaId;
    
    @Column(name = "it_sede")
    private Integer sedeId;
    
    @Column(name = "it_puesto")
    private Integer puestoId;
    
    @Column(name = "it_turno", length = 2)
    private String turnoId;
    
    @Column(name = "it_horario", length = 2)
    private String horarioId;
    
    @Column(name = "it_diadescanso", length = 2)
    private String diaDescanso;
    
    @Column(name = "tt_horaentrada")
    private LocalTime horaEntrada;
    
    @Column(name = "tt_horasalida")
    private LocalTime horaSalida;
    
    // Datos de Pensión
    @Column(name = "it_regimenpensionario", length = 2)
    private String regimenPensionario;
    
    @Column(name = "tt_cuspp", length = 20)
    private String cuspp;
    
    // Remuneración
    @Column(name = "it_tipopago", length = 2)
    private String tipoPago;
    
    @Column(name = "it_bancorem", length = 2)
    private String bancoRemuneracion;
    
    @Column(name = "tt_nrocuentarem", length = 50)
    private String numeroCuentaRemuneracion;
    
    @Column(name = "it_tipocuenta", length = 2)
    private String tipoCuenta;
    
    // CTS
    @Column(name = "it_bancocts", length = 2)
    private String bancoCts;
    
    @Column(name = "tt_nrocuentacts", length = 50)
    private String numeroCuentaCts;
    
    // Control de Estado
    @Column(name = "it_estado")
    private Integer estado = 1; // 1=ACTIVO, 2=BAJA, 3=SUSPENDIDO
    
    @Column(name = "ft_fechacese")
    private LocalDate fechaCese;
    
    // Auditoría
    @Column(name = "it_usuariocreo")
    private Long usuarioCreo;
    
    @Column(name = "ft_fechacreo")
    private LocalDateTime fechaCreo;
    
    @Column(name = "it_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "ft_fechaedito")
    private LocalDateTime fechaEdito;
    
    @Column(name = "it_usuarioelimino")
    private Long usuarioElimino;
    
    @Column(name = "ft_fechaelimino")
    private LocalDateTime fechaElimino;
    
    @PrePersist
    protected void onCreate() {
        fechaCreo = LocalDateTime.now();
        if (estado == null) {
            estado = 1;
        }
        if (tipoTrabajador == null) {
            tipoTrabajador = "01";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaEdito = LocalDateTime.now();
    }
}
