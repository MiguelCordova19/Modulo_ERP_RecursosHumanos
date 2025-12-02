package com.meridian.erp.service;

import com.meridian.erp.entity.MotivoPrestamo;
import com.meridian.erp.repository.MotivoPrestamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MotivoPrestamoService {
    
    private final JdbcTemplate jdbcTemplate;
    private final MotivoPrestamoRepository motivoPrestamoRepository;
    
    // RowMapper para mapear resultados del procedimiento almacenado
    private final RowMapper<MotivoPrestamo> motivoPrestamoRowMapper = (rs, rowNum) -> {
        MotivoPrestamo motivo = new MotivoPrestamo();
        motivo.setId(rs.getInt("id"));
        motivo.setDescripcion(rs.getString("descripcion"));
        motivo.setEstado(rs.getInt("estado"));
        motivo.setEmpresaId(rs.getInt("empresaid")); // PostgreSQL retorna en minúsculas
        
        // Manejar fechas que pueden ser null
        try {
            if (rs.getTimestamp("fechacreacion") != null) { // PostgreSQL retorna en minúsculas
                motivo.setFechaCreacion(rs.getTimestamp("fechacreacion").toLocalDateTime());
            }
        } catch (Exception e) {
            // Ignorar si la columna no existe
        }
        
        try {
            if (rs.getTimestamp("fechamodificacion") != null) { // PostgreSQL retorna en minúsculas
                motivo.setFechaModificacion(rs.getTimestamp("fechamodificacion").toLocalDateTime());
            }
        } catch (Exception e) {
            // Ignorar si la columna no existe
        }
        
        return motivo;
    };
    
    // Listar motivos por empresa
    public List<MotivoPrestamo> listarPorEmpresa(Integer empresaId) {
        String sql = "SELECT * FROM public.sp_listar_motivos_prestamo(?)";
        return jdbcTemplate.query(sql, motivoPrestamoRowMapper, empresaId);
    }
    
    // Obtener motivo por ID
    public Optional<MotivoPrestamo> obtenerPorId(Integer id, Integer empresaId) {
        String sql = "SELECT * FROM public.sp_obtener_motivo_prestamo(?, ?)";
        List<MotivoPrestamo> resultados = jdbcTemplate.query(sql, motivoPrestamoRowMapper, id, empresaId);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
    
    // Crear motivo
    @Transactional
    public MotivoPrestamo crear(MotivoPrestamo motivo) {
        // Validar que no exista un motivo con la misma descripción
        Optional<MotivoPrestamo> existente = motivoPrestamoRepository
            .findByDescripcionAndEmpresaIdAndEstadoActivo(motivo.getDescripcion(), motivo.getEmpresaId());
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un motivo activo con esta descripción en la empresa");
        }
        
        try {
            // Llamar a la función de PostgreSQL con esquema explícito
            String sql = "SELECT * FROM public.sp_crear_motivo_prestamo(?, ?)";
            List<MotivoPrestamo> resultados = jdbcTemplate.query(
                sql, 
                motivoPrestamoRowMapper, 
                motivo.getDescripcion(), 
                motivo.getEmpresaId()
            );
            
            if (resultados.isEmpty()) {
                throw new RuntimeException("No se pudo crear el motivo");
            }
            
            return resultados.get(0);
        } catch (Exception e) {
            // Log del error completo para debugging
            e.printStackTrace();
            throw new RuntimeException("Error al crear el motivo: " + e.getMessage());
        }
    }
    
    // Actualizar motivo
    @Transactional
    public MotivoPrestamo actualizar(Integer id, MotivoPrestamo motivo, Integer empresaId) {
        // Validar que no exista otro motivo con la misma descripción
        Optional<MotivoPrestamo> existente = motivoPrestamoRepository
            .findByDescripcionAndEmpresaIdAndIdNotAndEstadoActivo(
                motivo.getDescripcion(), empresaId, id
            );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe otro motivo activo con esta descripción");
        }
        
        try {
            // Llamar a la función de PostgreSQL con esquema explícito
            String sql = "SELECT * FROM public.sp_actualizar_motivo_prestamo(?, ?, ?)";
            List<MotivoPrestamo> resultados = jdbcTemplate.query(
                sql, 
                motivoPrestamoRowMapper, 
                id, 
                motivo.getDescripcion(), 
                empresaId
            );
            
            if (resultados.isEmpty()) {
                throw new RuntimeException("No se pudo actualizar el motivo");
            }
            
            return resultados.get(0);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el motivo: " + e.getMessage());
        }
    }
    
    // Eliminar (cambiar estado a 0)
    @Transactional
    public void eliminar(Integer id, Integer empresaId) {
        try {
            // Llamar a la función de PostgreSQL con esquema explícito
            String sql = "SELECT public.sp_eliminar_motivo_prestamo(?, ?)";
            jdbcTemplate.queryForObject(sql, Boolean.class, id, empresaId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al eliminar el motivo: " + e.getMessage());
        }
    }
}
