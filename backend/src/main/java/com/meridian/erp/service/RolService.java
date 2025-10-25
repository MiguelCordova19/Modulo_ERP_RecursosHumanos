package com.meridian.erp.service;

import com.meridian.erp.entity.Rol;
import com.meridian.erp.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {
    
    private final RolRepository rolRepository;
    
    public List<Rol> findAll() {
        return rolRepository.findAll();
    }
    
    public Optional<Rol> findById(Integer id) {
        return rolRepository.findById(id);
    }
    
    public Rol save(Rol rol) {
        return rolRepository.save(rol);
    }
    
    public void deleteById(Integer id) {
        rolRepository.deleteById(id);
    }
}
