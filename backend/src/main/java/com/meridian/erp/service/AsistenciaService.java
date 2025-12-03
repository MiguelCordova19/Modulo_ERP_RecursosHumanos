package com.meridian.erp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AsistenciaService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Guardar asistencia completa (cabecera + detalles)
     */
    @Transactional
    public Long guardarAsistenciaCompleta(
            LocalDate fechaAsistencia,
            String turnoId,
            Long sedeId,
            Long empresaId,
            Long usuarioId,
            String detallesJson
    ) {
        String sql = "SELECT public.sp_guardar_asistencia_completa(?, ?, ?, ?, ?, ?::jsonb)";
        
        return jdbcTemplate.queryForObject(sql, Long.class,
                fechaAsistencia,
                turnoId,
                sedeId,
                empresaId,
                usuarioId,
                detallesJson
        );
    }
    
    /**
     * Listar asistencias con filtros
     */
    public List<Map<String, Object>> listarAsistencias(
            Long empresaId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            Long sedeId,
            String turnoId
    ) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("a.imasistencia_id as asistencia_id, ");
        sql.append("a.fa_fechaasistencia as fecha_asistencia, ");
        sql.append("a.ia_turno as turno_id, ");
        sql.append("t.tt_descripcion as turno_descripcion, ");
        sql.append("a.ia_sede as sede_id, ");
        sql.append("s.ts_descripcion as sede_descripcion, ");
        sql.append("COUNT(d.imasistenciadetalle_id) as total_trabajadores, ");
        sql.append("COUNT(CASE WHEN d.iad_falto = 0 THEN 1 END) as total_asistieron, ");
        sql.append("COUNT(CASE WHEN d.iad_falto = 1 THEN 1 END) as total_faltaron, ");
        sql.append("COUNT(CASE WHEN d.iad_diadescanso = 1 THEN 1 END) as total_dia_descanso, ");
        sql.append("COUNT(CASE WHEN d.iad_diaferiado = 1 THEN 1 END) as total_feriado ");
        sql.append("FROM public.rrhh_masistencia a ");
        sql.append("INNER JOIN public.rrhh_mturno t ON a.ia_turno = t.imturno_id ");
        sql.append("INNER JOIN public.rrhh_msede s ON a.ia_sede = s.imsede_id ");
        sql.append("LEFT JOIN public.rrhh_masistenciadetalle d ON a.imasistencia_id = d.iad_asistencia ");
        sql.append("WHERE a.ia_empresa = ? AND a.ia_estado = 1 ");
        
        if (fechaDesde != null) {
            sql.append("AND a.fa_fechaasistencia >= ? ");
        }
        if (fechaHasta != null) {
            sql.append("AND a.fa_fechaasistencia <= ? ");
        }
        if (sedeId != null) {
            sql.append("AND a.ia_sede = ? ");
        }
        if (turnoId != null) {
            sql.append("AND a.ia_turno = ? ");
        }
        
        sql.append("GROUP BY a.imasistencia_id, a.fa_fechaasistencia, a.ia_turno, t.tt_descripcion, a.ia_sede, s.ts_descripcion ");
        sql.append("ORDER BY a.fa_fechaasistencia DESC");
        
        // Construir lista de parámetros
        List<Object> params = new java.util.ArrayList<>();
        params.add(empresaId);
        if (fechaDesde != null) params.add(fechaDesde);
        if (fechaHasta != null) params.add(fechaHasta);
        if (sedeId != null) params.add(sedeId);
        if (turnoId != null) params.add(turnoId);
        
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
    
    /**
     * Obtener detalle de una asistencia específica
     */
    public List<Map<String, Object>> obtenerDetalleAsistencia(Long asistenciaId) {
        String sql = "SELECT " +
                "d.imasistenciadetalle_id as id, " +
                "d.iad_trabajador as trabajadorid, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "d.iad_diadescanso as diadescanso, " +
                "d.iad_compdiadescanso as comprodiadescanso, " +
                "d.iad_diaferiado as diaferiado, " +
                "d.iad_trabdiaferiado as trabdiaferiado, " +
                "d.iad_falto as falto, " +
                "d.had_horaingreso as horaingreso, " +
                "d.had_horatardanza as horatardanza, " +
                "d.tad_observacion as observacion " +
                "FROM public.rrhh_masistenciadetalle d " +
                "INNER JOIN public.rrhh_trabajador t ON d.iad_trabajador = t.itrabajador_id " +
                "WHERE d.iad_asistencia = ? " +
                "AND d.iad_estado = 1 " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres";
        
        return jdbcTemplate.queryForList(sql, asistenciaId);
    }
    
    /**
     * Obtener asistencia completa (cabecera + detalle)
     */
    public Map<String, Object> obtenerAsistenciaCompleta(Long asistenciaId) {
        // Obtener cabecera
        String sqlCabecera = "SELECT " +
                "a.imasistencia_id as id, " +
                "a.fa_fechaasistencia as fecha, " +
                "a.ia_turno as turnoid, " +
                "t.tt_descripcion as turnodescripcion, " +
                "a.ia_sede as sedeid, " +
                "s.ts_descripcion as sededescripcion " +
                "FROM public.rrhh_masistencia a " +
                "INNER JOIN public.rrhh_mturno t ON a.ia_turno = t.imturno_id " +
                "INNER JOIN public.rrhh_msede s ON a.ia_sede = s.imsede_id " +
                "WHERE a.imasistencia_id = ?";
        
        Map<String, Object> cabecera = jdbcTemplate.queryForMap(sqlCabecera, asistenciaId);
        
        // Obtener detalle con hora de entrada del contrato
        String sqlDetalle = "SELECT " +
                "d.imasistenciadetalle_id as id, " +
                "d.iad_trabajador as trabajadorid, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "c.fct_fechainiciolaboral as fechainiciolaboral, " +
                "c.hct_horaentrada as horaentrada, " +
                "d.iad_diadescanso as diadescanso, " +
                "d.iad_compdiadescanso as comprodiadescanso, " +
                "d.iad_diaferiado as diaferiado, " +
                "d.iad_trabdiaferiado as trabdiaferiado, " +
                "d.iad_falto as falto, " +
                "d.had_horaingreso as horaingreso, " +
                "d.had_horatardanza as horatardanza, " +
                "d.tad_observacion as observacion " +
                "FROM public.rrhh_masistenciadetalle d " +
                "INNER JOIN public.rrhh_trabajador t ON d.iad_trabajador = t.itrabajador_id " +
                "LEFT JOIN public.rrhh_mcontratotrabajador c ON d.iad_trabajador = c.ict_trabajador AND c.ict_estado = 1 " +
                "WHERE d.iad_asistencia = ? " +
                "AND d.iad_estado = 1 " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres";
        
        List<Map<String, Object>> detalle = jdbcTemplate.queryForList(sqlDetalle, asistenciaId);
        
        // Combinar cabecera y detalle
        cabecera.put("trabajadores", detalle);
        
        return cabecera;
    }
}
