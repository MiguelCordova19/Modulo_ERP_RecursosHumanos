package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mdiasemana")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaSemana {
    
    @Id
    @Column(name = "idiasemana_id", length = 2)
    private String id;
    
    @Column(name = "tds_descripcion", length = 20, nullable = false)
    private String descripcion;
    
    @Column(name = "tds_abreviatura", length = 3, nullable = false)
    private String abreviatura;
    
    @Column(name = "it_estado")
    private Integer estado = 1;
    
    @Column(name = "it_usuariocreo")
    private Long usuarioCreo;
    
    @Column(name = "ft_fechacreo")
    private LocalDateTime fechaCreo;
    
    @Column(name = "it_usuarioedito")
    private Long usuarioEdito;
    
    @Column(name = "ft_fechaedito")
    private LocalDateTime fechaEdito;
    
    @PrePersist
    protected void onCreate() {
        fechaCreo = LocalDateTime.now();
        if (estado == null) {
            estado = 1;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaEdito = LocalDateTime.now();
    }
}
