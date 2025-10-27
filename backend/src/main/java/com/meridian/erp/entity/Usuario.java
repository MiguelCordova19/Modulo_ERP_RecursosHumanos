package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "rrhh_musuario")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imusuario_id")
    private Long id;
    
    @Column(name = "tu_apellidopaterno", length = 50)
    private String apellidoPaterno;
    
    @Column(name = "tu_apellidomaterno", length = 50)
    private String apellidoMaterno;
    
    @Column(name = "tu_nombres", length = 50)
    private String nombres;
    
    @Column(name = "iu_empresa")
    private Long empresaId;
    
    @Column(name = "iu_sede")
    private Long sedeId;
    
    @Column(name = "iu_tipodocumento")
    private Integer tipoDocumentoId;
    
    @Column(name = "tu_nrodocumento", length = 20)
    private String nroDocumento;
    
    @Column(name = "fu_fechanacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "iu_rol")
    private Integer rolId;
    
    @Column(name = "iu_puesto")
    private Integer puestoId;
    
    @Column(name = "tu_nrocelular", length = 20)
    private String nroCelular;
    
    @Column(name = "tu_correo", length = 50)
    private String correo;
    
    @Column(name = "iu_estado")
    private Integer estado;
    
    @Column(name = "tu_usuario", length = 50, unique = true)
    private String usuario;
    
    @Column(name = "tu_password", length = 255)
    private String password;
    
    @Column(name = "iu_primerlogin")
    private Integer primerLogin; // 1 = debe cambiar contraseña, 0 = ya cambió
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "iu_empresa", insertable = false, updatable = false)
    private Empresa empresa;
    
    // Campos transitorios para datos del JOIN (no se mapean a la BD)
    @Transient
    private String empresaNombre;
    
    @Transient
    private String rolDescripcion;
}
