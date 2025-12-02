package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoContrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoContratoRepository extends JpaRepository<TipoContrato, Integer> {
    
    List<TipoContrato> findByEstadoOrderByCodigo(Boolean estado);
}
