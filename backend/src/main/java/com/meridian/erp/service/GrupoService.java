package com.meridian.erp.service;

import com.meridian.erp.dto.GrupoConPuestosRequest;
import com.meridian.erp.entity.Grupo;
import com.meridian.erp.repository.GrupoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GrupoService {
    
    private final GrupoRepository grupoRepository;
    private final GrupoPuestoDetalleService grupoPuestoDetalleService;
    
    /**
     * Listar grupos por empresa (solo activos)
     */
    public List<Grupo> listarPorEmpresa(Integer empresaId) {
        return grupoRepository.findByEmpresaIdAndEstado(empresaId, 1);
    }
    
    /**
     * Obtener grupo por ID
     */
    public Optional<Grupo> obtenerPorId(Integer id) {
        return grupoRepository.findById(id);
    }
    
    /**
     * Crear nuevo grupo
     */
    @Transactional
    public Grupo crear(Grupo grupo, Long usuarioId) {
        // Validar que no exista el nombre en la misma empresa
        Optional<Grupo> existente = grupoRepository.findByNombreAndEmpresaIdAndEstado(
            grupo.getNombre(), 
            grupo.getEmpresaId(), 
            1
        );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un grupo con el nombre '" + grupo.getNombre() + "' en esta empresa");
        }
        
        grupo.setEstado(1);
        grupo.setUsuarioRegistro(usuarioId);
        grupo.setFechaRegistro(LocalDateTime.now());
        
        return grupoRepository.save(grupo);
    }
    
    /**
     * Actualizar grupo
     */
    @Transactional
    public Grupo actualizar(Integer id, Grupo grupoActualizado, Long usuarioId) {
        Optional<Grupo> grupoExistente = grupoRepository.findById(id);
        
        if (grupoExistente.isEmpty()) {
            throw new RuntimeException("Grupo no encontrado");
        }
        
        Grupo grupo = grupoExistente.get();
        
        // Validar que no exista otro registro con el mismo nombre en la misma empresa
        if (!grupo.getNombre().equals(grupoActualizado.getNombre())) {
            boolean existe = grupoRepository.existsByNombreAndEmpresaIdAndEstadoAndIdNot(
                grupoActualizado.getNombre(),
                grupo.getEmpresaId(),
                1,
                id
            );
            
            if (existe) {
                throw new RuntimeException("Ya existe otro grupo con el nombre '" + grupoActualizado.getNombre() + "' en esta empresa");
            }
        }
        
        grupo.setNombre(grupoActualizado.getNombre());
        grupo.setDescripcion(grupoActualizado.getDescripcion());
        grupo.setUsuarioEdito(usuarioId);
        grupo.setFechaEdito(LocalDateTime.now());
        
        return grupoRepository.save(grupo);
    }
    
    /**
     * Eliminar grupo (soft delete)
     */
    @Transactional
    public boolean eliminar(Integer id, Long usuarioId) {
        Optional<Grupo> grupoExistente = grupoRepository.findById(id);
        
        if (grupoExistente.isEmpty()) {
            return false;
        }
        
        Grupo grupo = grupoExistente.get();
        grupo.setEstado(0);
        grupo.setUsuarioElimino(usuarioId);
        grupo.setFechaElimino(LocalDateTime.now());
        grupoRepository.save(grupo);
        
        // Desasignar todos los puestos del grupo
        grupoPuestoDetalleService.desasignarTodosPorGrupo(id);
        
        return true;
    }
    
    /**
     * Crear grupo con puestos asignados
     */
    @Transactional
    public Grupo crearConPuestos(GrupoConPuestosRequest request, Long usuarioId) {
        // Crear el grupo
        Grupo grupo = new Grupo();
        grupo.setNombre(request.getNombre());
        grupo.setDescripcion(request.getDescripcion());
        grupo.setEmpresaId(request.getEmpresaId());
        grupo.setEstado(1);
        grupo.setUsuarioRegistro(usuarioId);
        grupo.setFechaRegistro(LocalDateTime.now());
        
        // Validar que no exista el nombre
        Optional<Grupo> existente = grupoRepository.findByNombreAndEmpresaIdAndEstado(
            grupo.getNombre(), 
            grupo.getEmpresaId(), 
            1
        );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un grupo con el nombre '" + grupo.getNombre() + "' en esta empresa");
        }
        
        grupo = grupoRepository.save(grupo);
        
        // Asignar puestos si hay
        if (request.getPuestos() != null && !request.getPuestos().isEmpty()) {
            List<Map<String, Object>> puestos = request.getPuestos().stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("puestoId", p.getPuestoId());
                    map.put("evaluacion", p.getEvaluacion());
                    return map;
                })
                .collect(Collectors.toList());
            
            grupoPuestoDetalleService.reasignarPuestos(grupo.getId(), puestos, usuarioId);
        }
        
        return grupo;
    }
    
    /**
     * Actualizar grupo con puestos
     */
    @Transactional
    public Grupo actualizarConPuestos(Integer id, GrupoConPuestosRequest request, Long usuarioId) {
        // Actualizar el grupo
        Grupo grupo = actualizar(id, convertirAGrupo(request), usuarioId);
        
        // Reasignar puestos
        if (request.getPuestos() != null) {
            List<Map<String, Object>> puestos = request.getPuestos().stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("puestoId", p.getPuestoId());
                    map.put("evaluacion", p.getEvaluacion());
                    return map;
                })
                .collect(Collectors.toList());
            
            grupoPuestoDetalleService.reasignarPuestos(id, puestos, usuarioId);
        }
        
        return grupo;
    }
    
    private Grupo convertirAGrupo(GrupoConPuestosRequest request) {
        Grupo grupo = new Grupo();
        grupo.setNombre(request.getNombre());
        grupo.setDescripcion(request.getDescripcion());
        return grupo;
    }
}
