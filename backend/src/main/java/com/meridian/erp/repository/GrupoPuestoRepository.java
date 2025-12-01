package com.meridian.erp.repository;

import com.meridian.erp.entity.GrupoPuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoPuestoRepository extends JpaRepository<GrupoPuesto, Long> {
    
    /**
     * Buscar grupos por empresa y estado
     */
    List<GrupoPuesto> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
}
