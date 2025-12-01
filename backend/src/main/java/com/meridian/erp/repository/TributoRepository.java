package com.meridian.erp.repository;

import com.meridian.erp.entity.Tributo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TributoRepository extends JpaRepository<Tributo, String> {
    
    // Listar solo tributos activos
    List<Tributo> findByEstadoOrderByIdAsc(Integer estado);
    
    // Listar todos ordenados por ID
    List<Tributo> findAllByOrderByIdAsc();
    
    // Buscar por código o descripción (para autocomplete)
    @Query("SELECT t FROM Tributo t WHERE t.estado = 1 AND " +
           "(LOWER(t.codigoSunat) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(t.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "ORDER BY t.codigoSunat")
    List<Tributo> buscarPorCodigoODescripcion(@Param("busqueda") String busqueda);
    
    // Buscar por tipo de tributo
    List<Tributo> findByTipoIdAndEstadoOrderByCodigoSunatAsc(String tipoId, Integer estado);
}
