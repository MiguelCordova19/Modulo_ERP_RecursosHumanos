package com.meridian.erp.repository;

import com.meridian.erp.entity.MotivoPrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MotivoPrestamoRepository extends JpaRepository<MotivoPrestamo, Integer> {
    
    List<MotivoPrestamo> findByEmpresaIdOrderByDescripcionAsc(Integer empresaId);
    
    Optional<MotivoPrestamo> findByIdAndEmpresaId(Integer id, Integer empresaId);
    
    @Query("SELECT m FROM MotivoPrestamo m WHERE m.descripcion = :descripcion AND m.empresaId = :empresaId AND m.estado = 1")
    Optional<MotivoPrestamo> findByDescripcionAndEmpresaIdAndEstadoActivo(
        @Param("descripcion") String descripcion, 
        @Param("empresaId") Integer empresaId
    );
    
    @Query("SELECT m FROM MotivoPrestamo m WHERE m.descripcion = :descripcion AND m.empresaId = :empresaId AND m.id != :id AND m.estado = 1")
    Optional<MotivoPrestamo> findByDescripcionAndEmpresaIdAndIdNotAndEstadoActivo(
        @Param("descripcion") String descripcion, 
        @Param("empresaId") Integer empresaId,
        @Param("id") Integer id
    );
}
