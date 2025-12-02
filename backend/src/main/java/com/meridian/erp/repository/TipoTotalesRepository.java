package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoTotales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoTotalesRepository extends JpaRepository<TipoTotales, String> {
    
    // Listar solo tipos de totales activos
    List<TipoTotales> findByEstadoOrderByIdAsc(Integer estado);
    
    // Listar todos ordenados por ID
    List<TipoTotales> findAllByOrderByIdAsc();
}
