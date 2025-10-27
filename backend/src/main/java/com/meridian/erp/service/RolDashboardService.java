package com.meridian.erp.service;

import com.meridian.erp.entity.RolDashboard;
import com.meridian.erp.repository.RolDashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolDashboardService {
    
    @Autowired
    private RolDashboardRepository rolDashboardRepository;
    
    public List<RolDashboard> obtenerTodos() {
        return rolDashboardRepository.findAll();
    }
    
    public List<RolDashboard> obtenerActivos() {
        return rolDashboardRepository.findByEstado(1);
    }
    
    public Optional<RolDashboard> obtenerPorId(Integer id) {
        return rolDashboardRepository.findById(id);
    }
    
    public RolDashboard crear(RolDashboard rol) {
        return rolDashboardRepository.save(rol);
    }
    
    public RolDashboard actualizar(Integer id, RolDashboard rolActualizado) {
        return rolDashboardRepository.findById(id)
            .map(rol -> {
                rol.setDescripcion(rolActualizado.getDescripcion());
                rol.setEstado(rolActualizado.getEstado());
                return rolDashboardRepository.save(rol);
            })
            .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));
    }
    
    public void eliminar(Integer id) {
        rolDashboardRepository.deleteById(id);
    }
}
