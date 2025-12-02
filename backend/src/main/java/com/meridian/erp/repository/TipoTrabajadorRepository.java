package com.meridian.erp.repository;

import com.meridian.erp.entity.TipoTrabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoTrabajadorRepository extends JpaRepository<TipoTrabajador, Integer> {
    
    List<TipoTrabajador> findByEmpresaIdAndEstado(Integer empresaId, Integer estado);
}
