package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoPagoRepository extends JpaRepository<TipoPago, String> {
    
    /**
     * Buscar tipos de pago activos
     */
    List<TipoPago> findByEstadoOrderById(Integer estado);
}
