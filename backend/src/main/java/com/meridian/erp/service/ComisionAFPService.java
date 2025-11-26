package com.meridian.erp.service;

import com.meridian.erp.entity.ComisionAFP;
import com.meridian.erp.entity.RegimenPensionario;
import com.meridian.erp.repository.ComisionAFPRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComisionAFPService {
    
    private final JdbcTemplate jdbcTemplate;
    private final ComisionAFPRepository comisionAFPRepository;
    
    // RowMapper para mapear resultados con relaciones
    private final RowMapper<ComisionAFP> comisionAFPRowMapper = (rs, rowNum) -> {
        ComisionAFP afp = new ComisionAFP();
        afp.setId(rs.getInt("id"));
        afp.setMes(rs.getInt("mes"));
        afp.setAnio(rs.getInt("anio"));
        afp.setComisionFlujo(rs.getBigDecimal("comisionflujo"));
        afp.setComisionAnualSaldo(rs.getBigDecimal("comisionanualsaldo"));
        afp.setPrimaSeguro(rs.getBigDecimal("primaseguro"));
        afp.setAporteObligatorio(rs.getBigDecimal("aporteobligatorio"));
        afp.setRemuneracionMaxima(rs.getBigDecimal("remunmaxima"));
        afp.setEstado(rs.getInt("estado"));
        afp.setEmpresaId(rs.getInt("empresaid"));
        
        // Mapear Régimen Pensionario
        RegimenPensionario regimen = new RegimenPensionario();
        regimen.setId(rs.getInt("regimenid"));
        regimen.setCodSunat(rs.getString("regimencodsunat"));
        regimen.setAbreviatura(rs.getString("regimenabreviatura"));
        afp.setRegimenPensionario(regimen);
        
        return afp;
    };
    
    @Transactional(readOnly = true)
    public List<ComisionAFP> listarPorEmpresa(Integer empresaId) {
        String sql = "SELECT * FROM public.sp_listar_comisiones_afp(?)";
        return jdbcTemplate.query(sql, comisionAFPRowMapper, empresaId);
    }
    
    @Transactional(readOnly = true)
    public Optional<ComisionAFP> obtenerPorId(Integer id) {
        String sql = "SELECT * FROM public.sp_obtener_comision_afp(?)";
        List<ComisionAFP> resultados = jdbcTemplate.query(sql, comisionAFPRowMapper, id);
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }
    
    @Transactional
    public Integer crear(Integer mes, Integer anio, Integer regimenId, 
                        BigDecimal comisionFlujo, BigDecimal comisionAnualSaldo,
                        BigDecimal primaSeguro, BigDecimal aporteObligatorio,
                        BigDecimal remuneracionMaxima, Integer empresaId) {
        String sql = "SELECT public.sp_guardar_comision_afp(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.queryForObject(sql, Integer.class, 
            mes, anio, regimenId, comisionFlujo, comisionAnualSaldo,
            primaSeguro, aporteObligatorio, remuneracionMaxima, empresaId);
    }
    
    @Transactional
    public boolean actualizar(Integer id, Integer mes, Integer anio, Integer regimenId,
                             BigDecimal comisionFlujo, BigDecimal comisionAnualSaldo,
                             BigDecimal primaSeguro, BigDecimal aporteObligatorio,
                             BigDecimal remuneracionMaxima) {
        String sql = "SELECT public.sp_actualizar_comision_afp(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class,
            id, mes, anio, regimenId, comisionFlujo, comisionAnualSaldo,
            primaSeguro, aporteObligatorio, remuneracionMaxima);
        return resultado != null && resultado;
    }
    
    @Transactional
    public boolean eliminar(Integer id) {
        String sql = "SELECT public.sp_eliminar_comision_afp(?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, id);
        return resultado != null && resultado;
    }
}
