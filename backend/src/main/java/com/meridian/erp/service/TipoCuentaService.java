package com.meridian.erp.service;

import com.meridian.erp.entity.TipoCuenta;
import com.meridian.erp.repository.TipoCuentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoCuentaService {
    
    private final TipoCuentaRepository tipoCuentaRepository;
    
    /**
     * Listar todos los tipos de cuenta activos
     */
    public List<TipoCuenta> listarActivos() {
        return tipoCuentaRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los tipos de cuenta
     */
    public List<TipoCuenta> listarTodos() {
        return tipoCuentaRepository.findAll();
    }
}
