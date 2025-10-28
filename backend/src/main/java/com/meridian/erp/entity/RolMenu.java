package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rrhh_drol_menu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolMenu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idrm_id")
    private Integer id;
    
    @Column(name = "irm_rol", nullable = false)
    private Integer rolId;
    
    @Column(name = "irm_menu", nullable = false)
    private Integer menuId;
    
    @Column(name = "irm_estado")
    private Integer estado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "irm_rol", insertable = false, updatable = false)
    private Rol rol;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "irm_menu", insertable = false, updatable = false)
    private Menu menu;
}
