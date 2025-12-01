package com.meridian.erp.repository;

import com.meridian.erp.entity.ConceptoRegimenLaboral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptoRegimenLaboralRepository extends JpaRepository<ConceptoRegimenLaboral, Long> {
    
    // Listar por empresa y estado
    List<ConceptoRegimenLaboral> findByEmpresaIdAndEstadoOrderByIdDesc(Integer empresaId, Integer estado);
    
    // Buscar por régimen laboral y empresa
    Optional<ConceptoRegimenLaboral> findByRegimenLaboralIdAndEmpresaIdAndEstado(
        String regimenLaboralId, Integer empresaId, Integer estado);
}
