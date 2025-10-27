package com.meridian.erp.service;

import com.meridian.erp.entity.Empresa;
import com.meridian.erp.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmpresaService {
    
    private final EmpresaRepository empresaRepository;
    
    public List<Empresa> findAll() {
        return empresaRepository.findAll();
    }
    
    public List<Empresa> findByEstado(Integer estado) {
        return empresaRepository.findByEstado(estado);
    }
    
    public Optional<Empresa> findById(Long id) {
        return empresaRepository.findById(id);
    }
    
    public Empresa save(Empresa empresa) {
        return empresaRepository.save(empresa);
    }
    
    public void deleteById(Long id) {
        // En lugar de eliminar, cambiar estado a inactivo
        Optional<Empresa> empresa = empresaRepository.findById(id);
        if (empresa.isPresent()) {
            Empresa emp = empresa.get();
            emp.setEstado(0);
            empresaRepository.save(emp);
        }
    }
}
