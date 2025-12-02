package com.meridian.erp.repository;

import com.meridian.erp.entity.GrupoPuestoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoPuestoDetalleRepository extends JpaRepository<GrupoPuestoDetalle, Integer> {
    
    /**
     * Buscar asignaciones por grupo y estado
     */
    List<GrupoPuestoDetalle> findByGrupoIdAndEstado(Integer grupoId, Integer estado);
    
    /**
     * Buscar asignación por puesto y estado
     */
    Optional<GrupoPuestoDetalle> findByPuestoIdAndEstado(Integer puestoId, Integer estado);
    
    /**
     * Eliminar todas las asignaciones de un grupo (soft delete)
     */
    @Modifying
    @Query("UPDATE GrupoPuestoDetalle g SET g.estado = 0 WHERE g.grupoId = ?1")
    void desactivarPorGrupo(Integer grupoId);
    
    /**
     * Verificar si un puesto ya está asignado a un grupo activo
     */
    boolean existsByPuestoIdAndEstado(Integer puestoId, Integer estado);
}
