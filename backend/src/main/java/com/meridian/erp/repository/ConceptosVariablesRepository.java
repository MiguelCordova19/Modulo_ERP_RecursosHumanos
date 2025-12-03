package com.meridian.erp.repository;

import com.meridian.erp.entity.ConceptosVariables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptosVariablesRepository extends JpaRepository<ConceptosVariables, Long> {
    
    // Buscar por mes, año, planilla, concepto y empresa
    Optional<ConceptosVariables> findByMesAndAnioAndTipoPlanillaIdAndConceptoIdAndEmpresaIdAndEstado(
            Integer mes, Integer anio, Long tipoPlanillaId, Long conceptoId, Long empresaId, Integer estado);
    
    // Listar por empresa y estado
    List<ConceptosVariables> findByEmpresaIdAndEstadoOrderByAnioDescMesDesc(Long empresaId, Integer estado);
    
    // Listar por empresa, año y estado
    List<ConceptosVariables> findByEmpresaIdAndAnioAndEstadoOrderByMesDesc(Long empresaId, Integer anio, Integer estado);
    
    // Listar por empresa, año, mes y estado
    List<ConceptosVariables> findByEmpresaIdAndAnioAndMesAndEstadoOrderByIdDesc(
            Long empresaId, Integer anio, Integer mes, Integer estado);
    
    // Contar por empresa y estado
    long countByEmpresaIdAndEstado(Long empresaId, Integer estado);
}
