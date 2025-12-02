package com.meridian.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rrhh_mhorario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horario {
    
    @Id
    @Column(name = "imhorario_id", length = 2)
    private String id;
    
    @Column(name = "th_descripcion", length = 50, nullable = false)
    private String descripcion;
    
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
