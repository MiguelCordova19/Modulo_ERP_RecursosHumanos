package com.meridian.erp.repository;

import com.meridian.erp.entity.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Integer> {
    
    /**
     * Buscar puestos por empresa y estado
     */
    List<Puesto> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
    
    /**
     * Buscar puesto por nombre, empresa y estado
     */
    Optional<Puesto> findByNombreAndEmpresaIdAndEstado(String nombre, Integer empresaId, Integer estado);
    
    /**
     * Verificar si existe un puesto con el mismo nombre en la empresa
     */
    boolean existsByNombreAndEmpresaIdAndEstadoAndIdNot(String nombre, Integer empresaId, Integer estado, Integer id);
    

}
