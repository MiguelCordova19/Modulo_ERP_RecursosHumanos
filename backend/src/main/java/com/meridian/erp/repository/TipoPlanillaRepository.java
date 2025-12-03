package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoPlanilla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoPlanillaRepository extends JpaRepository<TipoPlanilla, Long> {
    
    // Listar tipos de planilla activos
    List<TipoPlanilla> findByEstadoOrderByDescripcionAsc(Integer estado);
    
    // Buscar por código
    Optional<TipoPlanilla> findByCodigoAndEstado(String codigo, Integer estado);
    
    // Buscar por descripción
    Optional<TipoPlanilla> findByDescripcionAndEstado(String descripcion, Integer estado);
    
    // Contar activos
    long countByEstado(Integer estado);
}
