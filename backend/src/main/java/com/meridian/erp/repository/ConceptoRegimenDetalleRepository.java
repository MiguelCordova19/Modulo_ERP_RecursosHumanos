package com.meridian.erp.repository;

import com.meridian.erp.entity.ConceptoRegimenDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptoRegimenDetalleRepository extends JpaRepository<ConceptoRegimenDetalle, Long> {
    
    // Listar detalles por cabecera
    List<ConceptoRegimenDetalle> findByConceptoRegimenIdAndEstado(Long conceptoRegimenId, Integer estado);
    
    // Eliminar detalles por cabecera
    void deleteByConceptoRegimenId(Long conceptoRegimenId);
}
