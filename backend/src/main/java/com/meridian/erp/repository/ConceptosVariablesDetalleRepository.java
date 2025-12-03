package com.meridian.erp.repository;

import com.meridian.erp.entity.ConceptosVariablesDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptosVariablesDetalleRepository extends JpaRepository<ConceptosVariablesDetalle, Long> {
    
    // Buscar por cabecera y trabajador
    Optional<ConceptosVariablesDetalle> findByConceptosVariablesIdAndTrabajadorIdAndEstado(
            Long conceptosVariablesId, Long trabajadorId, Integer estado);
    
    // Listar por cabecera y estado
    List<ConceptosVariablesDetalle> findByConceptosVariablesIdAndEstadoOrderByIdAsc(
            Long conceptosVariablesId, Integer estado);
    
    // Listar por trabajador y estado
    List<ConceptosVariablesDetalle> findByTrabajadorIdAndEstadoOrderByIdDesc(Long trabajadorId, Integer estado);
    
    // Listar por empresa y estado
    List<ConceptosVariablesDetalle> findByEmpresaIdAndEstadoOrderByIdDesc(Long empresaId, Integer estado);
    
    // Contar por cabecera y estado
    long countByConceptosVariablesIdAndEstado(Long conceptosVariablesId, Integer estado);
    
    // Eliminar por cabecera
    void deleteByConceptosVariablesId(Long conceptosVariablesId);
}
