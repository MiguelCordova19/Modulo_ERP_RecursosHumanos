package com.meridian.erp.repository;

import com.meridian.erp.entity.Genero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneroRepository extends JpaRepository<Genero, String> {
    
    /**
     * Buscar géneros activos
     */
    List<Genero> findByEstadoOrderById(Integer estado);
}
