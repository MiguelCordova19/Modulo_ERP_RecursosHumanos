package com.meridian.erp.service;

import com.meridian.erp.entity.Rol;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {
    
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para mapear resultados del procedimiento almacenado
    private final RowMapper<Rol> rolRowMapper = (rs, rowNum) -> {
        Rol rol = new Rol();
        rol.setId(rs.getInt("id"));
        rol.setDescripcion(rs.getString("descripcion"));
        rol.setEstado(rs.getInt("estado"));
        rol.setEmpresaId(rs.getLong("empresa_id"));
        rol.setEmpresaNombre(rs.getString("empresa_nombre"));
        return rol;
    };
    
    // Listar roles por empresa
    public List<Rol> findByEmpresa(Long empresaId) {
        String sql = "SELECT * FROM sp_listar_roles_por_empresa(?)";
        return jdbcTemplate.query(sql, rolRowMapper, empresaId);
    }
    
    // Obtener rol por ID
    public Optional<Rol> findById(Integer id) {
        String sql = "SELECT * FROM sp_obtener_rol_empresa_por_id(?)";
        List<Rol> roles = jdbcTemplate.query(sql, rolRowMapper, id);
        return roles.isEmpty() ? Optional.empty() : Optional.of(roles.get(0));
    }
    
    // Guardar o actualizar rol
    public Map<String, Object> save(Rol rol) {
        String sql = "CALL sp_guardar_rol_empresa(?, ?, ?, ?, ?)";
        
        return jdbcTemplate.execute((java.sql.Connection conn) -> {
            java.sql.CallableStatement cs = conn.prepareCall(sql);
            cs.setInt(1, rol.getId() != null ? rol.getId() : 0);
            cs.setString(2, rol.getDescripcion());
            cs.setLong(3, rol.getEmpresaId());
            cs.registerOutParameter(4, java.sql.Types.INTEGER);
            cs.registerOutParameter(5, java.sql.Types.VARCHAR);
            return cs;
        }, (java.sql.CallableStatement cs) -> {
            cs.execute();
            
            Map<String, Object> resultado = new java.util.HashMap<>();
            resultado.put("id", cs.getInt(4));
            resultado.put("mensaje", cs.getString(5));
            return resultado;
        });
    }
    
    // Eliminar rol (cambiar estado a 0)
    public Map<String, Object> deleteById(Integer id) {
        String sql = "CALL sp_eliminar_rol_empresa(?, ?, ?)";
        
        return jdbcTemplate.execute((java.sql.Connection conn) -> {
            java.sql.CallableStatement cs = conn.prepareCall(sql);
            cs.setInt(1, id);
            cs.registerOutParameter(2, java.sql.Types.BOOLEAN);
            cs.registerOutParameter(3, java.sql.Types.VARCHAR);
            return cs;
        }, (java.sql.CallableStatement cs) -> {
            cs.execute();
            
            Map<String, Object> resultado = new java.util.HashMap<>();
            resultado.put("success", cs.getBoolean(2));
            resultado.put("mensaje", cs.getString(3));
            return resultado;
        });
    }
}
