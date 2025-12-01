package com.meridian.erp.repository;

import com.meridian.erp.entity.RegimenLaboral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegimenLaboralRepository extends JpaRepository<RegimenLaboral, String> {
    
    // Listar solo regímenes activos ordenados por código SUNAT
    List<RegimenLaboral> findByEstadoOrderByCodSunatAsc(Integer estado);
    
    // Listar todos ordenados por código SUNAT
    List<RegimenLaboral> findAllByOrderByCodSunatAsc();
}
