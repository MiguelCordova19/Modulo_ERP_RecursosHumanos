package com.meridian.erp.repository;

import com.meridian.erp.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Integer> {
    
    /**
     * Buscar grupos por empresa y estado
     */
    List<Grupo> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
    
    /**
     * Buscar grupo por nombre, empresa y estado
     */
    Optional<Grupo> findByNombreAndEmpresaIdAndEstado(String nombre, Integer empresaId, Integer estado);
    
    /**
     * Verificar si existe un grupo con el mismo nombre en la empresa
     */
    boolean existsByNombreAndEmpresaIdAndEstadoAndIdNot(String nombre, Integer empresaId, Integer estado, Integer id);
}
