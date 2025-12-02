package com.meridian.erp.repository;

import com.meridian.erp.entity.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, String> {
    
    // Listar horarios activos
    List<Horario> findByEstadoOrderByIdAsc(Integer estado);
    
    // Buscar por descripción
    Horario findByDescripcion(String descripcion);
}
