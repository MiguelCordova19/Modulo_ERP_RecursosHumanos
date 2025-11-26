package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rrhh_mtipotrabajador")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoTrabajador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imtipotrabajador_id")
    private Integer id;
    
    @Column(name = "ttt_codigointerno", nullable = false, length = 20)
    private String codigoInterno;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "itt_tipo", nullable = false)
    private Tipo tipo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "itt_regimenpensionario", nullable = false)
    private RegimenPensionario regimenPensionario;
    
    @Column(name = "ttt_descripcion", nullable = false, length = 200)
    private String descripcion;
    
    @Column(name = "itt_estado", nullable = false)
    private Integer estado = 1;
    
    @Column(name = "empresa_id", nullable = false)
    private Integer empresaId;
}
