package com.meridian.erp.service;

import com.meridian.erp.entity.TipoDocumento;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoDocumentoService {
    
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para mapear resultados del procedimiento almacenado
    private final RowMapper<TipoDocumento> tipoDocumentoRowMapper = (rs, rowNum) -> {
        TipoDocumento tipoDocumento = new TipoDocumento();
        tipoDocumento.setId(rs.getInt("id"));
        tipoDocumento.setCodigoSunat(rs.getString("codigo_sunat"));
        tipoDocumento.setDescripcion(rs.getString("descripcion"));
        tipoDocumento.setAbreviatura(rs.getString("abreviatura"));
        return tipoDocumento;
    };
    
    // Listar todos los tipos de documento
    public List<TipoDocumento> findAll() {
        String sql = "SELECT * FROM sp_listar_tipos_documento()";
        return jdbcTemplate.query(sql, tipoDocumentoRowMapper);
    }
}
