package com.meridian.erp.service;

import com.meridian.erp.entity.Feriado;
import com.meridian.erp.repository.FeriadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeriadoService {
    
    private final JdbcTemplate jdbcTemplate;
    private final FeriadoRepository feriadoRepository;
    
    // RowMapper para mapear resultados
    private final RowMapper<Feriado> feriadoRowMapper = (rs, rowNum) -> {
        Feriado feriado = new Feriado();
        feriado.setId(rs.getInt("id"));
        feriado.setFechaFeriado(rs.getDate("fechaferiado").toLocalDate());
        feriado.setDiaFeriado(rs.getString("diaferiado"));
        feriado.setDenominacion(rs.getString("denominacion"));
        feriado.setEstado(rs.getInt("estado"));
        feriado.setEmpresaId(rs.getInt("empresaid"));
        
        try {
            if (rs.getTimestamp("fechacreacion") != null) {
                feriado.setFechaCreacion(rs.getTimestamp("fechacreacion").toLocalDateTime());
            }
        } catch (Exception e) {
            // Ignorar si la columna no existe
        }
        
        try {
            if (rs.getTimestamp("fechamodificacion") != null) {
                feriado.setFechaModificacion(rs.getTimestamp("fechamodificacion").toLocalDateTime());
            }
        } catch (Exception e) {
            // Ignorar si la columna no existe
        }
        
        return feriado;
    };
    
    // Listar feriados por empresa
    public List<Feriado> listarPorEmpresa(Integer empresaId) {
        String sql = "SELECT * FROM public.sp_listar_feriados(?)";
        return jdbcTemplate.query(sql, feriadoRowMapper, empresaId);
    }
    
    // Obtener feriado por ID
    public Optional<Feriado> obtenerPorId(Integer id, Integer empresaId) {
        String sql = "SELECT * FROM public.sp_obtener_feriado(?, ?)";
        List<Feriado> resultados = jdbcTemplate.query(sql, feriadoRowMapper, id, empresaId);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
    
    // Crear feriado
    @Transactional
    public Feriado crear(Feriado feriado) {
        // Validar que no exista un feriado en la misma fecha
        Optional<Feriado> existente = feriadoRepository
            .findByFechaFeriadoAndEmpresaIdAndEstadoActivo(feriado.getFechaFeriado(), feriado.getEmpresaId());
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un feriado activo en esta fecha");
        }
        
        try {
            String sql = "SELECT * FROM public.sp_crear_feriado(?, ?, ?, ?)";
            List<Feriado> resultados = jdbcTemplate.query(
                sql, 
                feriadoRowMapper, 
                Date.valueOf(feriado.getFechaFeriado()),
                feriado.getDiaFeriado(),
                feriado.getDenominacion(),
                feriado.getEmpresaId()
            );
            
            if (resultados.isEmpty()) {
                throw new RuntimeException("No se pudo crear el feriado");
            }
            
            return resultados.get(0);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al crear el feriado: " + e.getMessage());
        }
    }
    
    // Actualizar feriado
    @Transactional
    public Feriado actualizar(Integer id, Feriado feriado, Integer empresaId) {
        // Validar que no exista otro feriado en la misma fecha
        Optional<Feriado> existente = feriadoRepository
            .findByFechaFeriadoAndEmpresaIdAndIdNotAndEstadoActivo(
                feriado.getFechaFeriado(), empresaId, id
            );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe otro feriado activo en esta fecha");
        }
        
        try {
            String sql = "SELECT * FROM public.sp_actualizar_feriado(?, ?, ?, ?, ?)";
            List<Feriado> resultados = jdbcTemplate.query(
                sql, 
                feriadoRowMapper, 
                id,
                Date.valueOf(feriado.getFechaFeriado()),
                feriado.getDiaFeriado(),
                feriado.getDenominacion(),
                empresaId
            );
            
            if (resultados.isEmpty()) {
                throw new RuntimeException("No se pudo actualizar el feriado");
            }
            
            return resultados.get(0);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el feriado: " + e.getMessage());
        }
    }
    
    // Eliminar (cambiar estado a 0)
    @Transactional
    public void eliminar(Integer id, Integer empresaId) {
        try {
            String sql = "SELECT public.sp_eliminar_feriado(?, ?)";
            jdbcTemplate.queryForObject(sql, Boolean.class, id, empresaId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al eliminar el feriado: " + e.getMessage());
        }
    }
}
