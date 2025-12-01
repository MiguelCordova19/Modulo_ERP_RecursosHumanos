package com.meridian.erp.service;

import com.meridian.erp.entity.Puesto;
import com.meridian.erp.repository.PuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PuestoService {
    
    private final PuestoRepository puestoRepository;
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para puestos con información del grupo (si está asignado)
    private final RowMapper<Puesto> puestoRowMapper = (rs, rowNum) -> {
        Puesto puesto = new Puesto();
        puesto.setId(rs.getInt("impuesto_id"));
        puesto.setNombre(rs.getString("tp_nombre"));
        puesto.setDescripcion(rs.getString("tp_descripcion"));
        puesto.setEstado(rs.getInt("ip_estado"));
        puesto.setEmpresaId(rs.getInt("ip_empresa"));
        
        // Información del grupo (puede ser null si no está asignado)
        String grupoNombre = rs.getString("grupo_nombre");
        if (grupoNombre != null) {
            puesto.setGrupoNombre(grupoNombre);
            puesto.setGrupoDescripcion(rs.getString("grupo_descripcion"));
        }
        
        return puesto;
    };
    
    /**
     * Listar puestos por empresa con información del grupo (si está asignado)
     */
    public List<Puesto> listarPorEmpresa(Integer empresaId) {
        String sql = """
            SELECT 
                p.impuesto_id,
                p.tp_nombre,
                p.tp_descripcion,
                p.ip_estado,
                p.ip_empresa,
                g.tg_nombre as grupo_nombre,
                g.tg_descripcion as grupo_descripcion
            FROM rrhh_mpuestos p
            LEFT JOIN rrhh_grupo_puesto_detalle gpd ON p.impuesto_id = gpd.igpd_puesto_id AND gpd.igpd_estado = 1
            LEFT JOIN rrhh_mgrupos g ON gpd.igpd_grupo_id = g.imgrupo_id AND g.ig_estado = 1
            WHERE p.ip_empresa = ? AND p.ip_estado = 1
            ORDER BY p.impuesto_id DESC
        """;
        
        return jdbcTemplate.query(sql, puestoRowMapper, empresaId);
    }
    
    /**
     * Obtener puesto por ID
     */
    public Optional<Puesto> obtenerPorId(Integer id) {
        return puestoRepository.findById(id);
    }
    
    /**
     * Crear nuevo puesto
     */
    @Transactional
    public Puesto crear(Puesto puesto, Long usuarioId) {
        // Validar que no exista el nombre en la misma empresa
        Optional<Puesto> existente = puestoRepository.findByNombreAndEmpresaIdAndEstado(
            puesto.getNombre(), 
            puesto.getEmpresaId(), 
            1
        );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un puesto con el nombre '" + puesto.getNombre() + "' en esta empresa");
        }
        
        puesto.setEstado(1);
        puesto.setUsuarioRegistro(usuarioId);
        puesto.setFechaRegistro(LocalDateTime.now());
        
        return puestoRepository.save(puesto);
    }
    
    /**
     * Actualizar puesto
     */
    @Transactional
    public Puesto actualizar(Integer id, Puesto puestoActualizado, Long usuarioId) {
        Optional<Puesto> puestoExistente = puestoRepository.findById(id);
        
        if (puestoExistente.isEmpty()) {
            throw new RuntimeException("Puesto no encontrado");
        }
        
        Puesto puesto = puestoExistente.get();
        
        // Validar que no exista otro registro con el mismo nombre en la misma empresa
        if (!puesto.getNombre().equals(puestoActualizado.getNombre())) {
            boolean existe = puestoRepository.existsByNombreAndEmpresaIdAndEstadoAndIdNot(
                puestoActualizado.getNombre(),
                puesto.getEmpresaId(),
                1,
                id
            );
            
            if (existe) {
                throw new RuntimeException("Ya existe otro puesto con el nombre '" + puestoActualizado.getNombre() + "' en esta empresa");
            }
        }
        
        puesto.setNombre(puestoActualizado.getNombre());
        puesto.setDescripcion(puestoActualizado.getDescripcion());
        puesto.setUsuarioEdito(usuarioId);
        puesto.setFechaEdito(LocalDateTime.now());
        
        return puestoRepository.save(puesto);
    }
    
    /**
     * Eliminar puesto (soft delete)
     */
    @Transactional
    public boolean eliminar(Integer id, Long usuarioId) {
        Optional<Puesto> puestoExistente = puestoRepository.findById(id);
        
        if (puestoExistente.isEmpty()) {
            return false;
        }
        
        Puesto puesto = puestoExistente.get();
        puesto.setEstado(0);
        puesto.setUsuarioElimino(usuarioId);
        puesto.setFechaElimino(LocalDateTime.now());
        puestoRepository.save(puesto);
        
        return true;
    }
    
    /**
     * Listar puestos por grupo (a través de la tabla intermedia)
     */
    public List<Puesto> listarPorGrupo(Integer grupoId) {
        String sql = """
            SELECT 
                p.impuesto_id,
                p.tp_nombre,
                p.tp_descripcion,
                p.ip_estado,
                p.ip_empresa,
                g.tg_nombre as grupo_nombre,
                g.tg_descripcion as grupo_descripcion
            FROM rrhh_mpuestos p
            INNER JOIN rrhh_grupo_puesto_detalle gpd ON p.impuesto_id = gpd.igpd_puesto_id
            INNER JOIN rrhh_mgrupos g ON gpd.igpd_grupo_id = g.imgrupo_id
            WHERE gpd.igpd_grupo_id = ? AND gpd.igpd_estado = 1 AND p.ip_estado = 1
            ORDER BY p.impuesto_id
        """;
        
        return jdbcTemplate.query(sql, puestoRowMapper, grupoId);
    }
}
