package com.meridian.erp.service;

import com.meridian.erp.entity.TipoConcepto;
import com.meridian.erp.repository.TipoConceptoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoConceptoService {
    
    private final TipoConceptoRepository tipoConceptoRepository;
    
    /**
     * Listar todos los tipos de concepto activos
     */
    public List<TipoConcepto> listarActivos() {
        return tipoConceptoRepository.findByEstadoOrderByIdAsc(1);
    }
    
    /**
     * Listar todos los tipos de concepto (activos e inactivos)
     */
    public List<TipoConcepto> listarTodos() {
        return tipoConceptoRepository.findAllByOrderByIdAsc();
    }
    
    /**
     * Obtener tipo de concepto por ID
     */
    public Optional<TipoConcepto> obtenerPorId(String id) {
        return tipoConceptoRepository.findById(id);
    }
}
