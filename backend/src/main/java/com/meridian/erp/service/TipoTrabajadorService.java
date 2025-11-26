package com.meridian.erp.service;

import com.meridian.erp.entity.TipoTrabajador;
import com.meridian.erp.entity.Tipo;
import com.meridian.erp.entity.RegimenPensionario;
import com.meridian.erp.repository.TipoTrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoTrabajadorService {
    
    private final JdbcTemplate jdbcTemplate;
    private final TipoTrabajadorRepository tipoTrabajadorRepository;
    
    // RowMapper para mapear resultados con relaciones
    private final RowMapper<TipoTrabajador> tipoTrabajadorRowMapper = (rs, rowNum) -> {
        TipoTrabajador tt = new TipoTrabajador();
        tt.setId(rs.getInt("id"));
        tt.setCodigoInterno(rs.getString("codigointerno"));
        tt.setDescripcion(rs.getString("descripcion"));
        tt.setEstado(rs.getInt("estado"));
        tt.setEmpresaId(rs.getInt("empresaid"));
        
        // Mapear Tipo
        Tipo tipo = new Tipo();
        tipo.setId(rs.getInt("tipoid"));
        tipo.setCodSunat(rs.getString("tipocodsunat"));
        tipo.setDescripcion(rs.getString("tipodescripcion"));
        tt.setTipo(tipo);
        
        // Mapear Régimen Pensionario
        RegimenPensionario regimen = new RegimenPensionario();
        regimen.setId(rs.getInt("regimenid"));
        regimen.setCodSunat(rs.getString("regimencodsunat"));
        regimen.setAbreviatura(rs.getString("regimenabreviatura"));
        tt.setRegimenPensionario(regimen);
        
        return tt;
    };
    
    @Transactional(readOnly = true)
    public List<TipoTrabajador> listarPorEmpresa(Integer empresaId) {
        String sql = "SELECT * FROM public.sp_listar_tipos_trabajador(?)";
        return jdbcTemplate.query(sql, tipoTrabajadorRowMapper, empresaId);
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoTrabajador> obtenerPorId(Integer id) {
        String sql = "SELECT * FROM public.sp_obtener_tipo_trabajador(?)";
        List<TipoTrabajador> resultados = jdbcTemplate.query(sql, tipoTrabajadorRowMapper, id);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
    
    @Transactional
    public Integer crear(String codigoInterno, Integer tipoId, Integer regimenId, String descripcion, Integer empresaId) {
        String sql = "SELECT public.sp_guardar_tipo_trabajador(?, ?, ?, ?, ?)";
        return jdbcTemplate.queryForObject(sql, Integer.class, codigoInterno, tipoId, regimenId, descripcion, empresaId);
    }
    
    @Transactional
    public boolean actualizar(Integer id, String codigoInterno, Integer tipoId, Integer regimenId, String descripcion) {
        String sql = "SELECT public.sp_actualizar_tipo_trabajador(?, ?, ?, ?, ?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, id, codigoInterno, tipoId, regimenId, descripcion);
        return resultado != null && resultado;
    }
    
    @Transactional
    public boolean eliminar(Integer id) {
        String sql = "SELECT public.sp_eliminar_tipo_trabajador(?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, id);
        return resultado != null && resultado;
    }
}
