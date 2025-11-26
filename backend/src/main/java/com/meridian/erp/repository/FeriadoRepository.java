package com.meridian.erp.repository;

import com.meridian.erp.entity.Feriado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeriadoRepository extends JpaRepository<Feriado, Integer> {
    
    List<Feriado> findByEmpresaIdOrderByFechaFeriadoAsc(Integer empresaId);
    
    Optional<Feriado> findByIdAndEmpresaId(Integer id, Integer empresaId);
    
    @Query("SELECT f FROM Feriado f WHERE f.fechaFeriado = :fecha AND f.empresaId = :empresaId AND f.estado = 1")
    Optional<Feriado> findByFechaFeriadoAndEmpresaIdAndEstadoActivo(
        @Param("fecha") LocalDate fecha, 
        @Param("empresaId") Integer empresaId
    );
    
    @Query("SELECT f FROM Feriado f WHERE f.fechaFeriado = :fecha AND f.empresaId = :empresaId AND f.id != :id AND f.estado = 1")
    Optional<Feriado> findByFechaFeriadoAndEmpresaIdAndIdNotAndEstadoActivo(
        @Param("fecha") LocalDate fecha, 
        @Param("empresaId") Integer empresaId,
        @Param("id") Integer id
    );
}
