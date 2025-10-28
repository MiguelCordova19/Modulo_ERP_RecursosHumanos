package com.meridian.erp.repository;

import com.meridian.erp.entity.RolMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolMenuRepository extends JpaRepository<RolMenu, Integer> {
    
    // Obtener todos los menús asignados a un rol
    List<RolMenu> findByRolIdAndEstado(Integer rolId, Integer estado);
    
    // Obtener todos los permisos de un rol
    List<RolMenu> findByRolId(Integer rolId);
    
    // Eliminar todos los permisos de un rol
    @Modifying
    @Query("DELETE FROM RolMenu rm WHERE rm.rolId = :rolId")
    void deleteByRolId(@Param("rolId") Integer rolId);
    
    // Verificar si un rol tiene acceso a un menú
    boolean existsByRolIdAndMenuIdAndEstado(Integer rolId, Integer menuId, Integer estado);
    
    // Obtener IDs de menús por rol
    @Query("SELECT rm.menuId FROM RolMenu rm WHERE rm.rolId = :rolId AND rm.estado = 1")
    List<Integer> findMenuIdsByRolId(@Param("rolId") Integer rolId);
}
