package com.meridian.erp.repository;

import com.meridian.erp.entity.DiaSemana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaSemanaRepository extends JpaRepository<DiaSemana, String> {
    
    // Listar días activos
    List<DiaSemana> findByEstadoOrderByIdAsc(Integer estado);
    
    // Buscar por descripción
    DiaSemana findByDescripcion(String descripcion);
}
