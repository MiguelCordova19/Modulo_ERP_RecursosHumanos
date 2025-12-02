package com.meridian.erp.repository;

import com.meridian.erp.entity.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    
    // Buscar por número de documento y empresa
    Optional<Trabajador> findByNumeroDocumentoAndEmpresaId(String numeroDocumento, Integer empresaId);
    
    // Buscar por tipo y número de documento en una empresa
    Optional<Trabajador> findByTipoDocumentoAndNumeroDocumentoAndEmpresaId(
        String tipoDocumento, String numeroDocumento, Integer empresaId);
    
    // Listar trabajadores activos por empresa
    List<Trabajador> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
    
    // Listar todos los trabajadores de una empresa
    List<Trabajador> findByEmpresaIdOrderByApellidoPaternoAsc(Integer empresaId);
    
    // Buscar por sede
    List<Trabajador> findBySedeIdAndEstado(Integer sedeId, Integer estado);
    
    // Buscar por puesto
    List<Trabajador> findByPuestoIdAndEstado(Integer puestoId, Integer estado);
    
    // Verificar si existe documento duplicado
    @Query("SELECT COUNT(t) > 0 FROM Trabajador t WHERE t.tipoDocumento = :tipoDoc " +
           "AND t.numeroDocumento = :nroDoc AND t.empresaId = :empresaId " +
           "AND (:id IS NULL OR t.id != :id)")
    boolean existsDocumentoDuplicado(@Param("tipoDoc") String tipoDoc, 
                                     @Param("nroDoc") String nroDoc,
                                     @Param("empresaId") Integer empresaId,
                                     @Param("id") Long id);
}
