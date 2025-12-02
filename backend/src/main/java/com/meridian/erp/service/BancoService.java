package com.meridian.erp.service;

import com.meridian.erp.entity.Banco;
import com.meridian.erp.repository.BancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BancoService {
    
    private final BancoRepository bancoRepository;
    
    /**
     * Listar todos los bancos activos ordenados por ID
     */
    public List<Banco> listarActivos() {
        return bancoRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los bancos
     */
    public List<Banco> listarTodos() {
        return bancoRepository.findAll();
    }
}
