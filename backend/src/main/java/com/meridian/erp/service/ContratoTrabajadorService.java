package com.meridian.erp.service;

import com.meridian.erp.entity.ContratoTrabajador;
import com.meridian.erp.repository.ContratoTrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContratoTrabajadorService {
    
    private final ContratoTrabajadorRepository contratoTrabajadorRepository;
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Guardar contrato usando procedimiento almacenado
     */
    @Transactional
    public Long guardar(
            Long trabajadorId,
            Integer tipoContratoId,
            LocalDate fechaIngresoLaboral,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Long sedeId,
            Integer puestoId,
            String turnoId,
            String horarioId,
            LocalTime horaEntrada,
            LocalTime horaSalida,
            String diaDescansoId,
            Integer tipoTrabajadorId,
            Integer regimenPensionarioId,
            Long regimenLaboralId,
            BigDecimal horaLaboral,
            BigDecimal remuneracionBasica,
            BigDecimal remuneracionRc,
            BigDecimal sueldoMensual,
            String cuspp,
            Integer empresaId,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_guardar_contrato_trabajador(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        return jdbcTemplate.queryForObject(sql, Long.class,
                trabajadorId,
                tipoContratoId,
                fechaIngresoLaboral,
                fechaInicio,
                fechaFin,
                sedeId,
                puestoId,
                turnoId,
                horarioId,
                horaEntrada,
                horaSalida,
                diaDescansoId,
                tipoTrabajadorId,
                regimenPensionarioId,
                regimenLaboralId,
                horaLaboral,
                remuneracionBasica,
                remuneracionRc,
                sueldoMensual,
                cuspp,
                empresaId,
                usuarioId
        );
    }
    
    /**
     * Actualizar contrato usando procedimiento almacenado
     */
    @Transactional
    public boolean actualizar(
            Long contratoId,
            Long trabajadorId,
            Integer tipoContratoId,
            LocalDate fechaIngresoLaboral,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Long sedeId,
            Integer puestoId,
            String turnoId,
            String horarioId,
            LocalTime horaEntrada,
            LocalTime horaSalida,
            String diaDescansoId,
            Integer tipoTrabajadorId,
            Integer regimenPensionarioId,
            Long regimenLaboralId,
            BigDecimal horaLaboral,
            BigDecimal remuneracionBasica,
            BigDecimal remuneracionRc,
            BigDecimal sueldoMensual,
            String cuspp,
            Integer empresaId,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_actualizar_contrato_trabajador(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class,
                contratoId,
                trabajadorId,
                tipoContratoId,
                fechaIngresoLaboral,
                fechaInicio,
                fechaFin,
                sedeId,
                puestoId,
                turnoId,
                horarioId,
                horaEntrada,
                horaSalida,
                diaDescansoId,
                tipoTrabajadorId,
                regimenPensionarioId,
                regimenLaboralId,
                horaLaboral,
                remuneracionBasica,
                remuneracionRc,
                sueldoMensual,
                cuspp,
                empresaId,
                usuarioId
        );
        
        return resultado != null && resultado;
    }
    
    /**
     * Eliminar contrato (soft delete)
     */
    @Transactional
    public boolean eliminar(Long contratoId, Long usuarioId) {
        String sql = "SELECT public.sp_eliminar_contrato_trabajador(?, ?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, contratoId, usuarioId);
        return resultado != null && resultado;
    }
    
    /**
     * Obtener contrato por ID
     */
    public Optional<ContratoTrabajador> obtenerPorId(Long id) {
        return contratoTrabajadorRepository.findById(id);
    }
    
    /**
     * Listar contratos por sede
     */
    public List<ContratoTrabajador> listarPorSede(Long sedeId) {
        return contratoTrabajadorRepository.findBySedeIdAndEstadoOrderByFechaInicioLaboralDesc(sedeId, 1);
    }
    
    /**
     * Listar contratos por empresa con información completa
     */
    public List<Map<String, Object>> listarPorEmpresa(Integer empresaId) {
        String sql = "SELECT " +
                "c.imcontratotrabajador_id as id, " +
                "c.ict_trabajador as trabajadorid, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "c.fct_fechainiciolaboral as fechainiciolaboral, " +
                "c.fct_fechafinlaboral as fechafinlaboral, " +
                "c.ict_sede as sedeid, " +
                "s.ts_descripcion as sededescripcion, " +
                "c.ict_puesto as puestoid, " +
                "p.tp_descripcion as puestodescripcion, " +
                "c.ict_tipocontrato as tipocontratoid, " +
                "tc.ttc_descripcion as tipocontratodescripcion, " +
                "c.hct_horalaboral as horalaboral, " +
                "c.dct_sueldomensual as sueldomensual, " +
                "c.ict_estado as estado " +
                "FROM public.rrhh_mcontratotrabajador c " +
                "INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id " +
                "INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id " +
                "INNER JOIN public.rrhh_mpuestos p ON c.ict_puesto = p.impuesto_id " +
                "INNER JOIN public.rrhh_mtipocontrato tc ON c.ict_tipocontrato = tc.imtipocontrato_id " +
                "WHERE c.ict_empresa = ? AND c.ict_estado = 1 " +
                "ORDER BY c.fct_fechainiciolaboral DESC";
        
        return jdbcTemplate.queryForList(sql, empresaId);
    }
    
    /**
     * Listar todos los contratos activos
     */
    public List<ContratoTrabajador> listarActivos() {
        return contratoTrabajadorRepository.findByEstadoOrderByFechaInicioLaboralDesc(1);
    }
    
    /**
     * Listar trabajadores activos por sede, turno y fecha para asistencia
     */
    public List<Map<String, Object>> listarTrabajadoresActivosPorSedeTurno(
            Integer empresaId, 
            Long sedeId, 
            String turnoId, 
            LocalDate fecha) {
        System.out.println("=== CONSULTA TRABAJADORES ACTIVOS ===");
        System.out.println("EmpresaId: " + empresaId);
        System.out.println("SedeId: " + sedeId);
        System.out.println("TurnoId: " + turnoId);
        System.out.println("Fecha: " + fecha);
        
        // Verificar si la fecha es un feriado
        String sqlFeriado = "SELECT COUNT(*) FROM public.rrhh_mferiados " +
                "WHERE ff_fechaferiado = ? AND imempresa_id = ? AND if_estado = 1";
        Integer esFeriado = jdbcTemplate.queryForObject(sqlFeriado, Integer.class, fecha, empresaId);
        boolean hayFeriado = esFeriado != null && esFeriado > 0;
        
        System.out.println("Es feriado: " + hayFeriado);
        
        String sql = "SELECT " +
                "c.imcontratotrabajador_id as contratoid, " +
                "c.ict_trabajador as trabajadorid, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "c.fct_fechainiciolaboral as fechainiciolaboral, " +
                "c.fct_fechainicio as fechainiciocontrato, " +
                "c.hct_horaentrada as horaentrada, " +
                "c.hct_horasalida as horasalida, " +
                "c.ict_turno as turnoid, " +
                "tu.tt_descripcion as turnodescripcion, " +
                "c.ict_sede as sedeid, " +
                "s.ts_descripcion as sededescripcion, " +
                "c.ict_diadescanso as diadescanso, " +
                "ds.tds_descripcion as diadescansodescripcion, " +
                (hayFeriado ? "true" : "false") + " as esferiado " +
                "FROM public.rrhh_mcontratotrabajador c " +
                "INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id " +
                "INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id " +
                "INNER JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id " +
                "LEFT JOIN public.rrhh_mdiasemana ds ON c.ict_diadescanso = ds.idiasemana_id " +
                "WHERE c.ict_empresa = ? " +
                "AND c.ict_sede = ? " +
                "AND c.ict_turno = ? " +
                "AND c.ict_estado = 1 " +
                "AND c.fct_fechainicio <= ? " +
                "AND (c.fct_fechafinlaboral IS NULL OR c.fct_fechafinlaboral >= ?) " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres";
        
        System.out.println("SQL: " + sql);
        
        List<Map<String, Object>> resultado = jdbcTemplate.queryForList(sql, empresaId, sedeId, turnoId, fecha, fecha);
        System.out.println("Resultados encontrados: " + resultado.size());
        
        return resultado;
    }
}
