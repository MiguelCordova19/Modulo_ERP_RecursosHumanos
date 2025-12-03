package com.meridian.erp.repository;

import com.meridian.erp.entity.ConceptoTrabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptoTrabajadorRepository extends JpaRepository<ConceptoTrabajador, Long> {
    
    /**
     * Buscar conceptos por contrato, empresa y estado
     */
    List<ConceptoTrabajador> findByContratoTrabajadorIdAndEmpresaIdAndEstado(
        Long contratoTrabajadorId, 
        Integer empresaId, 
        Integer estado
    );
    
    /**
     * Buscar conceptos activos por contrato y empresa
     */
    default List<ConceptoTrabajador> findActivosByContratoIdAndEmpresaId(
        Long contratoTrabajadorId, 
        Integer empresaId
    ) {
        return findByContratoTrabajadorIdAndEmpresaIdAndEstado(contratoTrabajadorId, empresaId, 1);
    }
    
    /**
     * Buscar conceptos por empresa y estado
     */
    List<ConceptoTrabajador> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
}
