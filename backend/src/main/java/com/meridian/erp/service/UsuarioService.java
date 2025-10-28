package com.meridian.erp.service;

import com.meridian.erp.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // RowMapper para mapear resultados del procedimiento almacenado
    private final RowMapper<Usuario> usuarioRowMapper = (rs, rowNum) -> {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getLong("id"));
        usuario.setUsuario(rs.getString("usuario"));
        usuario.setNombres(rs.getString("nombres"));
        usuario.setApellidoPaterno(rs.getString("apellido_paterno"));
        usuario.setApellidoMaterno(rs.getString("apellido_materno"));
        usuario.setEmpresaId(rs.getLong("empresa_id"));
        usuario.setSedeId(rs.getObject("sede_id") != null ? rs.getLong("sede_id") : null);
        usuario.setTipoDocumentoId(rs.getInt("tipo_documento_id"));
        usuario.setNroDocumento(rs.getString("nro_documento"));
        usuario.setFechaNacimiento(rs.getDate("fecha_nacimiento") != null ? rs.getDate("fecha_nacimiento").toLocalDate() : null);
        usuario.setRolId(rs.getInt("rol_id"));
        usuario.setPuestoId(rs.getInt("puesto_id"));
        usuario.setNroCelular(rs.getString("nro_celular"));
        usuario.setCorreo(rs.getString("correo"));
        usuario.setEstado(rs.getInt("estado"));
        
        // Mapear primerLogin si existe en el ResultSet
        try {
            usuario.setPrimerLogin(rs.getInt("primer_login"));
        } catch (SQLException e) {
            usuario.setPrimerLogin(0); // Por defecto no requiere cambio
        }
        
        // Mapear campos del JOIN (empresa_nombre y rol_descripcion)
        usuario.setEmpresaNombre(rs.getString("empresa_nombre"));
        usuario.setRolDescripcion(rs.getString("rol_descripcion"));
        
        return usuario;
    };
    
    // Listar todos los usuarios activos
    public List<Usuario> findAll() {
        String sql = "SELECT * FROM sp_listar_usuarios_activos()";
        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper);
        System.out.println("✅ Usuarios activos cargados desde BD: " + usuarios.size());
        return usuarios;
    }
    
    // Listar TODOS los usuarios (activos e inactivos, de todas las empresas)
    // Para el dashboard de empresas
    public List<Usuario> findAllUsuarios() {
        String sql = "SELECT * FROM sp_listar_todos_usuarios()";
        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper);
        System.out.println("✅ Todos los usuarios cargados desde BD: " + usuarios.size());
        return usuarios;
    }
    
    // Listar usuarios de una empresa específica
    // Para el dashboard ERP
    public List<Usuario> findByEmpresa(Long empresaId) {
        String sql = "SELECT * FROM sp_listar_usuarios_por_empresa(?)";
        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper, empresaId);
        System.out.println("✅ Usuarios de empresa " + empresaId + " cargados: " + usuarios.size());
        return usuarios;
    }
    
    // Obtener usuario por ID
    public Optional<Usuario> findById(Long id) {
        String sql = "SELECT * FROM sp_obtener_usuario_por_id(?)";
        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper, id);
        return usuarios.isEmpty() ? Optional.empty() : Optional.of(usuarios.get(0));
    }
    
    // Guardar o actualizar usuario
    public Map<String, Object> save(Usuario usuario) {
        // Encriptar contraseña si es nueva o si se está actualizando
        final String passwordEncriptado;
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            if (!usuario.getPassword().startsWith("$2")) {
                passwordEncriptado = passwordEncoder.encode(usuario.getPassword());
            } else {
                passwordEncriptado = usuario.getPassword();
            }
        } else {
            passwordEncriptado = null;
        }
        
        // Usar CALL directo con PostgreSQL
        String sql = "CALL sp_guardar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        return jdbcTemplate.execute((java.sql.Connection conn) -> {
            try (java.sql.CallableStatement cs = conn.prepareCall(sql)) {
                // Parámetros IN
                cs.setLong(1, usuario.getId() != null ? usuario.getId() : 0);
                cs.setString(2, usuario.getUsuario());
                cs.setString(3, passwordEncriptado);
                cs.setString(4, usuario.getNombres());
                cs.setString(5, usuario.getApellidoPaterno());
                cs.setString(6, usuario.getApellidoMaterno());
                cs.setLong(7, usuario.getEmpresaId());
                if (usuario.getSedeId() != null) {
                    cs.setLong(8, usuario.getSedeId());
                } else {
                    cs.setNull(8, java.sql.Types.BIGINT);
                }
                cs.setInt(9, usuario.getTipoDocumentoId());
                cs.setString(10, usuario.getNroDocumento());
                cs.setDate(11, usuario.getFechaNacimiento() != null ? java.sql.Date.valueOf(usuario.getFechaNacimiento()) : null);
                cs.setInt(12, usuario.getRolId());
                cs.setInt(13, usuario.getPuestoId());
                cs.setString(14, usuario.getNroCelular());
                cs.setString(15, usuario.getCorreo());
                
                // Parámetros OUT
                cs.registerOutParameter(16, java.sql.Types.BIGINT);
                cs.registerOutParameter(17, java.sql.Types.VARCHAR);
                cs.registerOutParameter(18, java.sql.Types.VARCHAR);
                
                // Ejecutar
                cs.execute();
                
                // Obtener resultados
                Map<String, Object> resultado = new java.util.HashMap<>();
                resultado.put("id", cs.getLong(16));
                resultado.put("usuario", cs.getString(17));
                resultado.put("mensaje", cs.getString(18));
                return resultado;
            }
        });
    }
    
    // Eliminar usuario (cambiar estado a 0)
    public Map<String, Object> deleteById(Long id) {
        String sql = "{CALL sp_eliminar_usuario(?, ?, ?)}";
        
        return jdbcTemplate.execute(sql, (java.sql.CallableStatement cs) -> {
            cs.setLong(1, id);
            cs.registerOutParameter(2, java.sql.Types.BOOLEAN);
            cs.registerOutParameter(3, java.sql.Types.VARCHAR);
            cs.execute();
            
            Map<String, Object> resultado = new java.util.HashMap<>();
            resultado.put("success", cs.getBoolean(2));
            resultado.put("mensaje", cs.getString(3));
            return resultado;
        });
    }
    
    // Verificar si existe usuario (ya no se usa pero lo dejamos por compatibilidad)
    public boolean existsByUsuario(String usuario) {
        String sql = "SELECT COUNT(*) FROM rrhh_musuario WHERE tu_usuario = ? AND iu_estado = 1";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, usuario);
        return count != null && count > 0;
    }
    
    // Crear nuevo usuario con procedimiento almacenado
    public Usuario crearUsuario(Usuario usuario) {
        // Encriptar contraseña
        String passwordEncriptado = passwordEncoder.encode(usuario.getPassword());
        
        // Establecer primerLogin por defecto si no viene
        Integer primerLogin = usuario.getPrimerLogin() != null ? usuario.getPrimerLogin() : 1;
        
        String sql = "SELECT * FROM sp_insertar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper,
            usuario.getUsuario(),
            passwordEncriptado,
            usuario.getNombres(),
            usuario.getApellidoPaterno(),
            usuario.getApellidoMaterno(),
            usuario.getEmpresaId(),
            usuario.getSedeId(),
            usuario.getTipoDocumentoId(),
            usuario.getNroDocumento(),
            usuario.getFechaNacimiento() != null ? java.sql.Date.valueOf(usuario.getFechaNacimiento()) : null,
            usuario.getRolId(),
            usuario.getPuestoId(),
            usuario.getNroCelular(),
            usuario.getCorreo(),
            usuario.getEstado(),
            primerLogin
        );
        
        return usuarios.isEmpty() ? null : usuarios.get(0);
    }
    
    // Cambiar contraseña de usuario (sin validar actual)
    public Map<String, Object> cambiarPassword(Long usuarioId, String nuevaPassword) {
        String passwordEncriptado = passwordEncoder.encode(nuevaPassword);
        
        String sql = "SELECT * FROM sp_cambiar_password(?, ?)";
        
        return jdbcTemplate.queryForMap(sql, usuarioId, passwordEncriptado);
    }
    
    // Cambiar contraseña validando la actual
    public Map<String, Object> cambiarPasswordValidado(Long usuarioId, String passwordActual, String passwordNueva) {
        // Obtener la contraseña directamente de la tabla (no del procedimiento almacenado)
        String sql = "SELECT tu_password FROM rrhh_musuario WHERE imusuario_id = ?";
        
        try {
            String passwordBD = jdbcTemplate.queryForObject(sql, String.class, usuarioId);
            
            if (passwordBD == null) {
                Map<String, Object> resultado = new java.util.HashMap<>();
                resultado.put("success", false);
                resultado.put("message", "Usuario no encontrado");
                return resultado;
            }
            
            // Validar que la contraseña actual sea correcta
            if (!passwordEncoder.matches(passwordActual, passwordBD)) {
                Map<String, Object> resultado = new java.util.HashMap<>();
                resultado.put("success", false);
                resultado.put("message", "La contraseña actual es incorrecta");
                System.out.println("❌ Contraseña incorrecta para usuario ID: " + usuarioId);
                return resultado;
            }
            
            // Si la contraseña actual es correcta, actualizar con la nueva
            String passwordEncriptado = passwordEncoder.encode(passwordNueva);
            
            String sqlUpdate = "SELECT * FROM sp_cambiar_password(?, ?)";
            
            System.out.println("✅ Contraseña validada correctamente para usuario ID: " + usuarioId);
            return jdbcTemplate.queryForMap(sqlUpdate, usuarioId, passwordEncriptado);
            
        } catch (Exception e) {
            Map<String, Object> resultado = new java.util.HashMap<>();
            resultado.put("success", false);
            resultado.put("message", "Error al validar contraseña: " + e.getMessage());
            System.err.println("❌ Error al cambiar contraseña: " + e.getMessage());
            return resultado;
        }
    }
}
