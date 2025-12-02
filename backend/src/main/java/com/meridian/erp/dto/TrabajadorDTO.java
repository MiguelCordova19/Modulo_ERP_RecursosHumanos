package com.meridian.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabajadorDTO {
    
    private Long id;
    
    // Datos Personales (obligatorios marcados con validación)
    private String tipoTrabajador; // Obligatorio: 01=PLANILLA, 02=RRHH
    private String tipoDocumento; // Obligatorio
    private String numeroDocumento; // Obligatorio
    private String apellidoPaterno; // Obligatorio
    private String apellidoMaterno; // No obligatorio
    private String nombres; // Obligatorio
    private String numeroCelular; // Obligatorio
    private String correo; // Obligatorio
    private LocalDate fechaNacimiento; // Obligatorio
    private String genero; // Obligatorio
    private String estadoCivil; // Obligatorio
    private String regimenLaboral; // Obligatorio
    
    // Descripciones para mostrar en la tabla
    private String tipoDocumentoDescripcion;
    private String generoDescripcion;
    private String estadoCivilDescripcion;
    private String regimenLaboralDescripcion;
    private String regimenPensionarioDescripcion;
    
    // Datos Laborales (dinámicos)
    private LocalDate fechaIngreso;
    private Integer empresaId;
    private Integer sedeId;
    private Integer puestoId;
    private String turnoId;
    private String horarioId;
    private String diaDescanso;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    
    // Datos de Pensión (dinámicos)
    private String regimenPensionario;
    private String cuspp;
    
    // Remuneración (obligatorios)
    private String tipoPago; // Obligatorio
    private String bancoRemuneracion; // Obligatorio
    private String numeroCuentaRemuneracion; // Obligatorio
    private String tipoCuenta; // Obligatorio
    
    // CTS (obligatorios)
    private String bancoCts; // Obligatorio
    private String numeroCuentaCts; // Obligatorio
    
    // Control de Estado
    private Integer estado;
    private LocalDate fechaCese;
    
    // Auditoría
    private Long usuarioCreo;
}
