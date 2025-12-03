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
public class CronogramaVacacionesService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Generar cronograma de vacaciones
     */
    @Transactional
    public Long generarCronograma(
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            Long empresaId,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_generar_cronograma_vacaciones(?, ?, ?, ?)";
        
        return jdbcTemplate.queryForObject(sql, Long.class,
                fechaDesde,
                fechaHasta,
                empresaId,
                usuarioId
        );
    }
    
    /**
     * Listar cronogramas de vacaciones
     */
    public List<Map<String, Object>> listarCronogramas(Long empresaId) {
        String sql = "SELECT * FROM public.sp_listar_cronogramas_vacaciones(?)";
        return jdbcTemplate.queryForList(sql, empresaId);
    }
    
    /**
     * Obtener detalle de un cronograma con información de trabajadores
     */
    public List<Map<String, Object>> obtenerDetalleCronograma(Long cronogramaId) {
        String sql = "SELECT " +
                "d.imcronogramavacacionesdetalle_id as detalle_id, " +
                "d.icvd_trabajador as trabajador_id, " +
                "t.tt_nrodoc as numero_documento, " +
                "CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres) as apellidos_nombres, " +
                "s.ts_descripcion as sede, " +
                "p.tp_descripcion as cargo, " +
                "c.fct_fechainiciolaboral as fecha_ingreso, " +
                "d.fcvd_fechainicio as fecha_inicio, " +
                "d.fcvd_fechafin as fecha_fin, " +
                "d.icvd_dias as dias, " +
                "d.tcvd_observaciones as observaciones " +
                "FROM public.rrhh_mcronogramavacacionesdetalle d " +
                "INNER JOIN public.rrhh_trabajador t ON d.icvd_trabajador = t.itrabajador_id " +
                "LEFT JOIN public.rrhh_mcontratotrabajador c ON d.icvd_trabajador = c.ict_trabajador AND c.ict_estado = 1 " +
                "LEFT JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id " +
                "LEFT JOIN public.rrhh_mpuestos p ON c.ict_puesto = p.impuesto_id " +
                "WHERE d.icvd_cronogramavacaciones = ? " +
                "AND d.icvd_estado = 1 " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres";
        
        return jdbcTemplate.queryForList(sql, cronogramaId);
    }
    
    /**
     * Eliminar cronograma (soft delete)
     */
    @Transactional
    public boolean eliminarCronograma(Long cronogramaId, Long usuarioId) {
        String sql = "UPDATE public.rrhh_mcronogramavacaciones " +
                "SET icv_estado = 0, " +
                "icv_usuarioelimino = ?, " +
                "fcv_fechaelimino = CURRENT_TIMESTAMP " +
                "WHERE imcronogramavacaciones_id = ?";
        
        int rows = jdbcTemplate.update(sql, usuarioId, cronogramaId);
        return rows > 0;
    }
    
    /**
     * Actualizar detalle de cronograma (fechas y días de vacaciones)
     */
    @Transactional
    public boolean actualizarDetalleCronograma(
            Long detalleId,
            String fechaInicio,
            String fechaFin,
            Integer dias,
            String observaciones
    ) {
        String sql = "UPDATE public.rrhh_mcronogramavacacionesdetalle " +
                "SET fcvd_fechainicio = ?::date, " +
                "fcvd_fechafin = ?::date, " +
                "icvd_dias = ?, " +
                "tcvd_observaciones = ? " +
                "WHERE imcronogramavacacionesdetalle_id = ?";
        
        int rows = jdbcTemplate.update(sql, fechaInicio, fechaFin, dias, observaciones, detalleId);
        return rows > 0;
    }
}
