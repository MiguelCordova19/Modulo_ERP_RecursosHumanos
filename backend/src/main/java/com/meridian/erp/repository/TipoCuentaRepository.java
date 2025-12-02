package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoCuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoCuentaRepository extends JpaRepository<TipoCuenta, String> {
    
    /**
     * Buscar tipos de cuenta activos ordenados por ID
     */
    List<TipoCuenta> findByEstadoOrderById(Integer estado);
}
