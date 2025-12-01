package com.meridian.erp.repository;

import com.meridian.erp.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {
    
    /**
     * Buscar sedes por empresa y estado
     */
    List<Sede> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
    
    /**
     * Buscar sede por código, empresa y estado
     */
    Optional<Sede> findByCodigoAndEmpresaIdAndEstado(String codigo, Integer empresaId, Integer estado);
    
    /**
     * Verificar si existe una sede con el mismo código en la empresa
     */
    boolean existsByCodigoAndEmpresaIdAndEstadoAndIdNot(String codigo, Integer empresaId, Integer estado, Long id);
}
