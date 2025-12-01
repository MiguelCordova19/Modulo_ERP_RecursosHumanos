package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoConcepto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoConceptoRepository extends JpaRepository<TipoConcepto, String> {
    
    // Listar solo tipos de concepto activos
    List<TipoConcepto> findByEstadoOrderByIdAsc(Integer estado);
    
    // Listar todos ordenados por ID
    List<TipoConcepto> findAllByOrderByIdAsc();
}
