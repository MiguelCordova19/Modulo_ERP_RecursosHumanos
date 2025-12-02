package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoTrabajadorPR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoTrabajadorPRRepository extends JpaRepository<TipoTrabajadorPR, String> {
    
    /**
     * Buscar tipos activos ordenados por ID
     */
    List<TipoTrabajadorPR> findByEstadoOrderById(Integer estado);
}
