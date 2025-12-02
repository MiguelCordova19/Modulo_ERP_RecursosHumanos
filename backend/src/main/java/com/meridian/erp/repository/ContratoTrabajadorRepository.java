package com.meridian.erp.repository;

import com.meridian.erp.entity.ContratoTrabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratoTrabajadorRepository extends JpaRepository<ContratoTrabajador, Long> {
    
    // Listar contratos por empresa
    List<ContratoTrabajador> findByEmpresaIdAndEstadoOrderByFechaInicioLaboralDesc(Integer empresaId, Integer estado);
    
    // Listar contratos por sede
    List<ContratoTrabajador> findBySedeIdAndEstadoOrderByFechaInicioLaboralDesc(Long sedeId, Integer estado);
    
    // Listar contratos por trabajador
    List<ContratoTrabajador> findByTrabajadorIdAndEstadoOrderByFechaInicioLaboralDesc(Long trabajadorId, Integer estado);
    
    // Listar todos los contratos activos
    List<ContratoTrabajador> findByEstadoOrderByFechaInicioLaboralDesc(Integer estado);
}
