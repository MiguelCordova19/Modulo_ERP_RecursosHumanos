package com.meridian.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String usuario;
    private String nombreCompleto;
    private String correo;
    private String empresa;
    private Long empresaId;
    private String empresaNombre;
    private Integer estado;
    private Integer primerLogin;
}
