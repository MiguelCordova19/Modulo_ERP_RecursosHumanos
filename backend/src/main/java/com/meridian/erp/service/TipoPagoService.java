package com.meridian.erp.service;

import com.meridian.erp.entity.TipoPago;
import com.meridian.erp.repository.TipoPagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoPagoService {
    
    private final TipoPagoRepository tipoPagoRepository;
    
    /**
     * Listar todos los tipos de pago activos
     */
    public List<TipoPago> listarActivos() {
        return tipoPagoRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los tipos de pago
     */
    public List<TipoPago> listarTodos() {
        return tipoPagoRepository.findAll();
    }
}
