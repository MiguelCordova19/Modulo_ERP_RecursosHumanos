package com.meridian.erp.repository;

import com.meridian.erp.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, String> {
    
    // Listar turnos activos
    List<Turno> findByEstadoOrderByIdAsc(Integer estado);
    
    // Buscar por descripción
    Turno findByDescripcion(String descripcion);
}
