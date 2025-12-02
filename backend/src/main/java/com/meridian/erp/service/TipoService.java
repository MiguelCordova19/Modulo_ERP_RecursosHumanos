package com.meridian.erp.service;

import com.meridian.erp.entity.Tipo;
import com.meridian.erp.repository.TipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoService {
    
    private final JdbcTemplate jdbcTemplate;
    private final TipoRepository tipoRepository;
    
    // RowMapper para mapear resultados
    private final RowMapper<Tipo> tipoRowMapper = (rs, rowNum) -> {
        Tipo tipo = new Tipo();
        tipo.setId(rs.getInt("id"));
        tipo.setCodSunat(rs.getString("codsunat"));
        tipo.setDescripcion(rs.getString("descripcion"));
        return tipo;
    };
    
    // Listar todos los tipos
    public List<Tipo> listarTodos() {
        String sql = "SELECT * FROM public.sp_listar_tipos()";
        return jdbcTemplate.query(sql, tipoRowMapper);
    }
    
    // Obtener tipo por ID
    public Optional<Tipo> obtenerPorId(Integer id) {
        String sql = "SELECT * FROM public.sp_obtener_tipo(?)";
        List<Tipo> resultados = jdbcTemplate.query(sql, tipoRowMapper, id);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
}
