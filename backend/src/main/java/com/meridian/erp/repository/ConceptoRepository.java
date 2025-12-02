package com.meridian.erp.repository;

import com.meridian.erp.entity.Concepto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptoRepository extends JpaRepository<Concepto, Long> {
    
    // Listar conceptos activos por empresa
    List<Concepto> findByEmpresaIdAndEstadoOrderByIdDesc(Integer empresaId, Integer estado);
    
    // Listar todos los conceptos por empresa
    List<Concepto> findByEmpresaIdOrderByIdDesc(Integer empresaId);
    
    // Buscar por tributo y empresa
    List<Concepto> findByTributoIdAndEmpresaIdAndEstado(String tributoId, Integer empresaId, Integer estado);
}
