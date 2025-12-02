package com.meridian.erp.repository;

import com.meridian.erp.entity.EstadoCivil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstadoCivilRepository extends JpaRepository<EstadoCivil, String> {
    
    /**
     * Buscar estados civiles activos
     */
    List<EstadoCivil> findByEstadoOrderById(Integer estado);
}
