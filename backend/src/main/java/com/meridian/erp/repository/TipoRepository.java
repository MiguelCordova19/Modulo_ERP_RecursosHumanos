package com.meridian.erp.repository;

import com.meridian.erp.entity.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoRepository extends JpaRepository<Tipo, Integer> {
    
    List<Tipo> findAllByOrderByDescripcionAsc();
}
