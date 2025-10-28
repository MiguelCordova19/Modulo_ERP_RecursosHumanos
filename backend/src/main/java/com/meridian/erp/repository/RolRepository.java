package com.meridian.erp.repository;

import com.meridian.erp.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    
    // Buscar roles por empresa y estado
    List<Rol> findByEmpresaIdAndEstado(Long empresaId, Integer estado);
    
    // Buscar roles por empresa
    List<Rol> findByEmpresaId(Long empresaId);
    
    // Buscar roles activos
    List<Rol> findByEstado(Integer estado);
}
