package com.meridian.erp.service;

import com.meridian.erp.entity.RegimenPensionario;
import com.meridian.erp.repository.RegimenPensionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegimenPensionarioService {
    
    private final JdbcTemplate jdbcTemplate;
    private final RegimenPensionarioRepository regimenPensionarioRepository;
    
    // RowMapper para mapear resultados
    private final RowMapper<RegimenPensionario> regimenRowMapper = (rs, rowNum) -> {
        RegimenPensionario regimen = new RegimenPensionario();
        regimen.setId(rs.getInt("id"));
        regimen.setCodSunat(rs.getString("codsunat"));
        regimen.setDescripcion(rs.getString("descripcion"));
        regimen.setAbreviatura(rs.getString("abreviatura"));
        return regimen;
    };
    
    // Listar todos los regímenes
    public List<RegimenPensionario> listarTodos() {
        String sql = "SELECT * FROM public.sp_listar_regimenes()";
        return jdbcTemplate.query(sql, regimenRowMapper);
    }
    
    // Obtener régimen por ID
    public Optional<RegimenPensionario> obtenerPorId(Integer id) {
        String sql = "SELECT * FROM public.sp_obtener_regimen(?)";
        List<RegimenPensionario> resultados = jdbcTemplate.query(sql, regimenRowMapper, id);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
}
