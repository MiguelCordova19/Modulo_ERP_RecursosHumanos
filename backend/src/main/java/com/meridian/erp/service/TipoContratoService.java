package com.meridian.erp.service;

import com.meridian.erp.entity.TipoContrato;
import com.meridian.erp.repository.TipoContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoContratoService {
    
    @Autowired
    private TipoContratoRepository tipoContratoRepository;
    
    public List<TipoContrato> obtenerTodosActivos() {
        return tipoContratoRepository.findByEstadoOrderByCodigo(true);
    }
    
    public Optional<TipoContrato> obtenerPorId(Integer id) {
        return tipoContratoRepository.findById(id);
    }
}
