package com.meridian.erp.repository;

import com.meridian.erp.entity.Banco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BancoRepository extends JpaRepository<Banco, String> {
    
    /**
     * Buscar bancos activos ordenados por ID
     */
    List<Banco> findByEstadoOrderById(Integer estado);
}
