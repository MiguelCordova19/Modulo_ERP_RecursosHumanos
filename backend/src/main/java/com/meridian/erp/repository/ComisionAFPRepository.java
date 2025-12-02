package com.meridian.erp.repository;

import com.meridian.erp.entity.ComisionAFP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComisionAFPRepository extends JpaRepository<ComisionAFP, Integer> {
    
    List<ComisionAFP> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
}
