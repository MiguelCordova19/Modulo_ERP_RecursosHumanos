package com.meridian.erp.service;

import com.meridian.erp.dto.TrabajadorDTO;
import com.meridian.erp.entity.Trabajador;
import com.meridian.erp.repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrabajadorService {
    
    @Autowired
    private TrabajadorRepository trabajadorRepository;
    
    @Autowired
    private com.meridian.erp.repository.TipoDocumentoRepository tipoDocumentoRepository;
    
    @Autowired
    private com.meridian.erp.repository.GeneroRepository generoRepository;
    
    @Autowired
    private com.meridian.erp.repository.EstadoCivilRepository estadoCivilRepository;
    
    @Autowired
    private com.meridian.erp.repository.ConceptoRegimenLaboralRepository conceptoRegimenLaboralRepository;
    
    @Autowired
    private com.meridian.erp.repository.RegimenLaboralRepository regimenLaboralRepository;
    
    // Listar todos los trabajadores de una empresa
    public List<TrabajadorDTO> listarPorEmpresa(Integer empresaId) {
        return trabajadorRepository.findByEmpresaIdOrderByApellidoPaternoAsc(empresaId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // Listar trabajadores activos
    public List<TrabajadorDTO> listarActivosPorEmpresa(Integer empresaId) {
        return trabajadorRepository.findByEmpresaIdAndEstado(empresaId, 1)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // Obtener trabajador por ID
    public TrabajadorDTO obtenerPorId(Long id) {
        return trabajadorRepository.findById(id)
                .map(this::convertirADTO)
                .orElse(null);
    }
    
    // Guardar trabajador (crear o actualizar)
    @Transactional
    public TrabajadorDTO guardar(TrabajadorDTO dto, Long usuarioId) {
        // Validar campos obligatorios
        validarCamposObligatorios(dto);
        
        // Verificar documento duplicado
        if (trabajadorRepository.existsDocumentoDuplicado(
                dto.getTipoDocumento(), 
                dto.getNumeroDocumento(), 
                dto.getEmpresaId(), 
                dto.getId())) {
            throw new RuntimeException("Ya existe un trabajador con este documento en la empresa");
        }
        
        Trabajador trabajador;
        if (dto.getId() != null) {
            // Actualizar
            trabajador = trabajadorRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
            trabajador.setUsuarioEdito(usuarioId);
            trabajador.setFechaEdito(LocalDateTime.now());
        } else {
            // Crear nuevo
            trabajador = new Trabajador();
            trabajador.setUsuarioCreo(usuarioId);
            trabajador.setFechaCreo(LocalDateTime.now());
            trabajador.setEstado(1); // ACTIVO por defecto
        }
        
        // Mapear datos del DTO a la entidad
        mapearDTOAEntidad(dto, trabajador);
        
        // Guardar
        trabajador = trabajadorRepository.save(trabajador);
        
        return convertirADTO(trabajador);
    }
    
    // Eliminar (lógico)
    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        
        trabajador.setEstado(0); // Inactivo
        trabajador.setUsuarioElimino(usuarioId);
        trabajador.setFechaElimino(LocalDateTime.now());
        
        trabajadorRepository.save(trabajador);
    }
    
    // Validar campos obligatorios
    private void validarCamposObligatorios(TrabajadorDTO dto) {
        // Datos Personales obligatorios
        if (dto.getTipoTrabajador() == null || dto.getTipoTrabajador().trim().isEmpty()) {
            throw new RuntimeException("El tipo de trabajador es obligatorio");
        }
        if (dto.getTipoDocumento() == null || dto.getTipoDocumento().trim().isEmpty()) {
            throw new RuntimeException("El tipo de documento es obligatorio");
        }
        if (dto.getNumeroDocumento() == null || dto.getNumeroDocumento().trim().isEmpty()) {
            throw new RuntimeException("El número de documento es obligatorio");
        }
        if (dto.getApellidoPaterno() == null || dto.getApellidoPaterno().trim().isEmpty()) {
            throw new RuntimeException("El apellido paterno es obligatorio");
        }
        if (dto.getNombres() == null || dto.getNombres().trim().isEmpty()) {
            throw new RuntimeException("Los nombres son obligatorios");
        }
        if (dto.getNumeroCelular() == null || dto.getNumeroCelular().trim().isEmpty()) {
            throw new RuntimeException("El número de celular es obligatorio");
        }
        if (dto.getCorreo() == null || dto.getCorreo().trim().isEmpty()) {
            throw new RuntimeException("El correo es obligatorio");
        }
        if (dto.getFechaNacimiento() == null) {
            throw new RuntimeException("La fecha de nacimiento es obligatoria");
        }
        if (dto.getGenero() == null || dto.getGenero().trim().isEmpty()) {
            throw new RuntimeException("El género es obligatorio");
        }
        if (dto.getEstadoCivil() == null || dto.getEstadoCivil().trim().isEmpty()) {
            throw new RuntimeException("El estado civil es obligatorio");
        }
        if (dto.getRegimenLaboral() == null || dto.getRegimenLaboral().trim().isEmpty()) {
            throw new RuntimeException("El régimen laboral es obligatorio");
        }
        
        // Remuneración obligatoria solo para PLANILLA (01)
        if ("01".equals(dto.getTipoTrabajador())) {
            if (dto.getTipoPago() == null || dto.getTipoPago().trim().isEmpty()) {
                throw new RuntimeException("El tipo de pago es obligatorio");
            }
            if (dto.getBancoRemuneracion() == null || dto.getBancoRemuneracion().trim().isEmpty()) {
                throw new RuntimeException("El banco de remuneración es obligatorio");
            }
            if (dto.getNumeroCuentaRemuneracion() == null || dto.getNumeroCuentaRemuneracion().trim().isEmpty()) {
                throw new RuntimeException("El número de cuenta de remuneración es obligatorio");
            }
            if (dto.getTipoCuenta() == null || dto.getTipoCuenta().trim().isEmpty()) {
                throw new RuntimeException("El tipo de cuenta es obligatorio");
            }
            
            // CTS obligatorio solo para PLANILLA
            if (dto.getBancoCts() == null || dto.getBancoCts().trim().isEmpty()) {
                throw new RuntimeException("El banco CTS es obligatorio");
            }
            if (dto.getNumeroCuentaCts() == null || dto.getNumeroCuentaCts().trim().isEmpty()) {
                throw new RuntimeException("El número de cuenta CTS es obligatorio");
            }
            
            // Validaciones de formato solo para PLANILLA
            validarFormatoCuenta(dto.getNumeroCuentaRemuneracion(), "remuneración");
            validarFormatoCuenta(dto.getNumeroCuentaCts(), "CTS");
        }
        
        // Empresa obligatoria
        if (dto.getEmpresaId() == null) {
            throw new RuntimeException("La empresa es obligatoria");
        }
        
        // Validaciones de formato de documento (siempre)
        validarFormatoDocumento(dto.getTipoDocumento(), dto.getNumeroDocumento());
    }
    
    // Validar formato de documento
    private void validarFormatoDocumento(String tipoDoc, String nroDoc) {
        if ("01".equals(tipoDoc)) { // DNI
            if (!nroDoc.matches("\\d{8}")) {
                throw new RuntimeException("El DNI debe tener 8 dígitos");
            }
        } else if ("04".equals(tipoDoc)) { // Carnet de Extranjería
            if (!nroDoc.matches("\\d{9}")) {
                throw new RuntimeException("El Carnet de Extranjería debe tener 9 dígitos");
            }
        } else if ("07".equals(tipoDoc)) { // Pasaporte
            if (nroDoc.length() < 7 || nroDoc.length() > 12) {
                throw new RuntimeException("El Pasaporte debe tener entre 7 y 12 caracteres");
            }
        }
    }
    
    // Validar formato de cuenta bancaria
    private void validarFormatoCuenta(String nroCuenta, String tipoCuenta) {
        if (nroCuenta != null && !nroCuenta.trim().isEmpty()) {
            // Validar que solo contenga números y guiones
            if (!nroCuenta.matches("[0-9-]+")) {
                throw new RuntimeException("El número de cuenta de " + tipoCuenta + " solo puede contener números y guiones");
            }
            // Validar longitud (típicamente entre 10 y 20 dígitos)
            String soloNumeros = nroCuenta.replaceAll("-", "");
            if (soloNumeros.length() < 10 || soloNumeros.length() > 20) {
                throw new RuntimeException("El número de cuenta de " + tipoCuenta + " debe tener entre 10 y 20 dígitos");
            }
        }
    }
    
    // Mapear DTO a Entidad
    private void mapearDTOAEntidad(TrabajadorDTO dto, Trabajador entidad) {
        // Datos Personales
        entidad.setTipoTrabajador(dto.getTipoTrabajador());
        entidad.setTipoDocumento(dto.getTipoDocumento());
        entidad.setNumeroDocumento(dto.getNumeroDocumento());
        entidad.setApellidoPaterno(dto.getApellidoPaterno());
        entidad.setApellidoMaterno(dto.getApellidoMaterno());
        entidad.setNombres(dto.getNombres());
        entidad.setNumeroCelular(dto.getNumeroCelular());
        entidad.setCorreo(dto.getCorreo());
        entidad.setFechaNacimiento(dto.getFechaNacimiento());
        entidad.setGenero(dto.getGenero());
        entidad.setEstadoCivil(dto.getEstadoCivil());
        entidad.setRegimenLaboral(dto.getRegimenLaboral());
        
        // Datos Laborales
        entidad.setFechaIngreso(dto.getFechaIngreso());
        entidad.setEmpresaId(dto.getEmpresaId());
        entidad.setSedeId(dto.getSedeId());
        entidad.setPuestoId(dto.getPuestoId());
        entidad.setTurnoId(dto.getTurnoId());
        entidad.setHorarioId(dto.getHorarioId());
        entidad.setDiaDescanso(dto.getDiaDescanso());
        entidad.setHoraEntrada(dto.getHoraEntrada());
        entidad.setHoraSalida(dto.getHoraSalida());
        
        // Datos de Pensión
        entidad.setRegimenPensionario(dto.getRegimenPensionario());
        entidad.setCuspp(dto.getCuspp());
        
        // Remuneración
        entidad.setTipoPago(dto.getTipoPago());
        entidad.setBancoRemuneracion(dto.getBancoRemuneracion());
        entidad.setNumeroCuentaRemuneracion(dto.getNumeroCuentaRemuneracion());
        entidad.setTipoCuenta(dto.getTipoCuenta());
        
        // CTS
        entidad.setBancoCts(dto.getBancoCts());
        entidad.setNumeroCuentaCts(dto.getNumeroCuentaCts());
        
        // Estado
        if (dto.getEstado() != null) {
            entidad.setEstado(dto.getEstado());
        }
        entidad.setFechaCese(dto.getFechaCese());
    }
    
    // Convertir Entidad a DTO
    private TrabajadorDTO convertirADTO(Trabajador entidad) {
        TrabajadorDTO dto = new TrabajadorDTO();
        
        dto.setId(entidad.getId());
        
        // Datos Personales
        dto.setTipoTrabajador(entidad.getTipoTrabajador());
        dto.setTipoDocumento(entidad.getTipoDocumento());
        dto.setNumeroDocumento(entidad.getNumeroDocumento());
        dto.setApellidoPaterno(entidad.getApellidoPaterno());
        dto.setApellidoMaterno(entidad.getApellidoMaterno());
        dto.setNombres(entidad.getNombres());
        dto.setNumeroCelular(entidad.getNumeroCelular());
        dto.setCorreo(entidad.getCorreo());
        dto.setFechaNacimiento(entidad.getFechaNacimiento());
        dto.setGenero(entidad.getGenero());
        dto.setEstadoCivil(entidad.getEstadoCivil());
        dto.setRegimenLaboral(entidad.getRegimenLaboral());
        
        // Obtener descripciones
        try {
            if (entidad.getTipoDocumento() != null) {
                tipoDocumentoRepository.findById(Integer.parseInt(entidad.getTipoDocumento()))
                    .ifPresent(td -> dto.setTipoDocumentoDescripcion(td.getAbreviatura()));
            }
            if (entidad.getGenero() != null) {
                generoRepository.findById(entidad.getGenero())
                    .ifPresent(g -> dto.setGeneroDescripcion(g.getDescripcion()));
            }
            if (entidad.getEstadoCivil() != null) {
                estadoCivilRepository.findById(entidad.getEstadoCivil())
                    .ifPresent(ec -> dto.setEstadoCivilDescripcion(ec.getDescripcion()));
            }
            if (entidad.getRegimenLaboral() != null) {
                // El regimenLaboral es el ID de rrhh_conceptos_regimen_laboral
                conceptoRegimenLaboralRepository.findById(Long.parseLong(entidad.getRegimenLaboral()))
                    .ifPresent(crl -> {
                        // Obtener el régimen laboral desde la tabla maestra
                        regimenLaboralRepository.findById(crl.getRegimenLaboralId())
                            .ifPresent(rl -> dto.setRegimenLaboralDescripcion(rl.getRegimenLaboral()));
                    });
            }
        } catch (Exception e) {
            // Si hay error al obtener descripciones, continuar sin ellas
            System.err.println("Error al obtener descripciones: " + e.getMessage());
        }
        
        // Datos Laborales
        dto.setFechaIngreso(entidad.getFechaIngreso());
        dto.setEmpresaId(entidad.getEmpresaId());
        dto.setSedeId(entidad.getSedeId());
        dto.setPuestoId(entidad.getPuestoId());
        dto.setTurnoId(entidad.getTurnoId());
        dto.setHorarioId(entidad.getHorarioId());
        dto.setDiaDescanso(entidad.getDiaDescanso());
        dto.setHoraEntrada(entidad.getHoraEntrada());
        dto.setHoraSalida(entidad.getHoraSalida());
        
        // Datos de Pensión
        dto.setRegimenPensionario(entidad.getRegimenPensionario());
        dto.setCuspp(entidad.getCuspp());
        
        // Remuneración
        dto.setTipoPago(entidad.getTipoPago());
        dto.setBancoRemuneracion(entidad.getBancoRemuneracion());
        dto.setNumeroCuentaRemuneracion(entidad.getNumeroCuentaRemuneracion());
        dto.setTipoCuenta(entidad.getTipoCuenta());
        
        // CTS
        dto.setBancoCts(entidad.getBancoCts());
        dto.setNumeroCuentaCts(entidad.getNumeroCuentaCts());
        
        // Estado
        dto.setEstado(entidad.getEstado());
        dto.setFechaCese(entidad.getFechaCese());
        
        // Auditoría
        dto.setUsuarioCreo(entidad.getUsuarioCreo());
        
        return dto;
    }
}
