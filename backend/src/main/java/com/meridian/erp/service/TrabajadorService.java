package com.meridian.erp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TrabajadorService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Buscar trabajador por número de documento
     */
    public Map<String, Object> buscarPorDocumento(Long empresaId, String nroDoc) {
        String sql = "SELECT " +
                "t.itrabajador_id as id, " +
                "t.tt_nrodoc as numero_documento, " +
                "t.tt_apellidopaterno as apellido_paterno, " +
                "t.tt_apellidomaterno as apellido_materno, " +
                "t.tt_nombres as nombres, " +
                "CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres) as nombre_completo " +
                "FROM public.rrhh_trabajador t " +
                "INNER JOIN public.rrhh_mcontratotrabajador c ON t.itrabajador_id = c.ict_trabajador " +
                "WHERE c.ict_empresa = ? " +
                "AND t.tt_nrodoc = ? " +
                "AND c.ict_estado = 1 " +
                "LIMIT 1";
        
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, empresaId, nroDoc);
        return result.isEmpty() ? null : result.get(0);
    }
    
    /**
     * Buscar trabajadores por documento o nombre
     */
    public List<Map<String, Object>> buscarTrabajadores(Long empresaId, String busqueda) {
        String sql = "SELECT " +
                "t.itrabajador_id as id, " +
                "t.tt_nrodoc as numero_documento, " +
                "t.tt_apellidopaterno as apellido_paterno, " +
                "t.tt_apellidomaterno as apellido_materno, " +
                "t.tt_nombres as nombres, " +
                "CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres) as nombre_completo " +
                "FROM public.rrhh_trabajador t " +
                "INNER JOIN public.rrhh_mcontratotrabajador c ON t.itrabajador_id = c.ict_trabajador " +
                "WHERE c.ict_empresa = ? " +
                "AND c.ict_estado = 1 " +
                "AND (" +
                "    t.tt_nrodoc LIKE ? " +
                "    OR UPPER(CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres)) LIKE UPPER(?)" +
                ") " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres " +
                "LIMIT 10";
        
        String busquedaLike = "%" + busqueda + "%";
        return jdbcTemplate.queryForList(sql, empresaId, busquedaLike, busquedaLike);
    }
    
    /**
     * Listar todos los trabajadores activos de una empresa
     */
    public List<Map<String, Object>> listarTrabajadores(Long empresaId) {
        String sql = "SELECT " +
                "t.itrabajador_id as id, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "COALESCE(s.ts_descripcion, '-') as sedescripcion, " +
                "COALESCE(tt.ttt_codigointerno, '-') as tipotrabajador, " +
                "COALESCE(mpr.tpr_descripcion, '-') as tipoplanilla, " +
                "COALESCE(td.ttd_descripcion, '-') as tipodocumentodescripcion, " +
                "COALESCE(g.td_descripcion, '-') as generodescripcion, " +
                "COALESCE(TO_CHAR(t.ft_fechanacimiento, 'DD/MM/YYYY'), '-') as fechanacimiento, " +
                "COALESCE(TO_CHAR(t.ft_fechaingreso, 'DD/MM/YYYY'), '-') as fechaingreso, " +
                "COALESCE(pc.tp_descripcion, '-') as puestodescripcion, " +
                "COALESCE(rl.trl_regimenlaboral, '-') as regimenlaboraldescripcion, " +
                "COALESCE(rp.trp_abreviatura, '-') as regimenpensionariodescripcion, " +
                "COALESCE(TO_CHAR(t.ft_fechacese, 'DD/MM/YYYY'), '-') as fechacese, " +
                "COALESCE(c.ict_estado, 1) as estado " +
                "FROM public.rrhh_trabajador t " +
                "LEFT JOIN public.rrhh_mcontratotrabajador c ON t.itrabajador_id = c.ict_trabajador AND c.ict_empresa = ? " +
                "LEFT JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id " +
                "LEFT JOIN public.rrhh_mtipotrabajador tt ON c.ict_tipotrabajador = tt.imtipotrabajador_id " +
                "LEFT JOIN public.rrhh_mpr mpr ON t.it_en = mpr.impr_id " +
                "LEFT JOIN public.rrhh_mtipodocumento td ON CAST(t.it_tipodoc AS INTEGER) = td.imtipodoc_id " +
                "LEFT JOIN public.rrhh_mgenero g ON t.it_genero = g.imgenero_id " +
                "LEFT JOIN public.rrhh_mpuestos pc ON c.ict_puesto = pc.impuesto_id " +
                "LEFT JOIN public.rrhh_conceptos_regimen_laboral crl ON c.ict_regimenlaboral = crl.imconceptosregimen_id " +
                "LEFT JOIN public.rrhh_regimenlaboral rl ON CAST(crl.ic_regimenlaboral AS VARCHAR) = rl.imregimenlaboral_id " +
                "LEFT JOIN public.rrhh_mregimenpensionario rp ON c.ict_regimenpensionario = rp.imregimenpensionario_id " +
                "WHERE c.ict_trabajador IS NOT NULL AND c.ict_estado = 1 " +
                "ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres";
        
        return jdbcTemplate.queryForList(sql, empresaId);
    }
    
    /**
     * Obtener un trabajador por ID con todos sus datos
     */
    public Map<String, Object> obtenerPorId(Long id) {
        String sql = "SELECT " +
                "t.itrabajador_id as id, " +
                "t.it_en as tipoplanilla, " +
                "t.it_tipodoc as tipodocumento, " +
                "t.tt_nrodoc as numerodocumento, " +
                "t.tt_apellidopaterno as apellidopaterno, " +
                "t.tt_apellidomaterno as apellidomaterno, " +
                "t.tt_nombres as nombres, " +
                "t.tt_nrocelular as celular, " +
                "t.tt_correo as correo, " +
                "t.it_genero as genero, " +
                "t.ft_fechanacimiento as fechanacimiento, " +
                "t.it_estadocivil as estadocivil, " +
                "t.it_regimenlaboral as regimenlaboral, " +
                "COALESCE(rl.trl_regimenlaboral, '-') as regimenlaboraldescripcion, " +
                "t.ft_fechaingreso as fechaingresolaboral, " +
                "t.it_empresa as empresa, " +
                "t.it_sede as sede, " +
                "COALESCE(s.ts_descripcion, '-') as sededescripcion, " +
                "t.it_puesto as puesto, " +
                "COALESCE(p.tp_descripcion, '-') as puestodescripcion, " +
                "t.it_turno as turno, " +
                "t.it_horario as horario, " +
                "t.it_diadescanso as diadescanso, " +
                "c.hct_horaentrada as horaentrada, " +
                "c.hct_horasalida as horasalida, " +
                "t.it_regimenpensionario as regimenpensionario, " +
                "COALESCE(rp.trp_descripcion, '-') as regimenpensionariodescripcion, " +
                "t.tt_cuspp as cuspp, " +
                "t.it_tipopago as tipopago, " +
                "t.it_bancorem as bancorem, " +
                "t.tt_nrocuentarem as nrocuentarem, " +
                "t.it_bancocts as bancocts, " +
                "t.tt_nrocuentacts as nrocuentacts, " +
                "t.ft_fechacese as fechacese, " +
                "t.it_estado as estado " +
                "FROM public.rrhh_trabajador t " +
                "LEFT JOIN public.rrhh_mcontratotrabajador c ON t.itrabajador_id = c.ict_trabajador AND c.ict_estado = 1 " +
                "LEFT JOIN public.rrhh_conceptos_regimen_laboral crl ON CAST(t.it_regimenlaboral AS BIGINT) = crl.imconceptosregimen_id " +
                "LEFT JOIN public.rrhh_regimenlaboral rl ON CAST(crl.ic_regimenlaboral AS VARCHAR) = rl.imregimenlaboral_id " +
                "LEFT JOIN public.rrhh_msede s ON t.it_sede = s.imsede_id " +
                "LEFT JOIN public.rrhh_mpuestos p ON t.it_puesto = p.impuesto_id " +
                "LEFT JOIN public.rrhh_mregimenpensionario rp ON CAST(t.it_regimenpensionario AS INTEGER) = rp.imregimenpensionario_id " +
                "WHERE t.itrabajador_id = ?";
        
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.isEmpty() ? null : result.get(0);
    }
}
