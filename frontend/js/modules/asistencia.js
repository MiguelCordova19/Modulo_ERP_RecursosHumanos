// Módulo de Asistencia
const asistencia = {
    tablaAsistencia: null,
    paginaActual: 1,
    registrosPorPagina: 10,
    totalRegistros: 0,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Asistencia inicializado');
        this.configurarFechas();
        this.cargarSedes();
        this.cargarTurnos();
        this.configurarEventos();
        this.consultar();
    },

    // Configurar fechas por defecto (mes actual)
    configurarFechas: function() {
        const hoy = new Date();
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        
        $('#filtroFechaDesde').val(this.formatearFecha(primerDia));
        $('#filtroFechaHasta').val(this.formatearFecha(ultimoDia));
    },

    // Formatear fecha a YYYY-MM-DD
    formatearFecha: function(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Cargar sedes
    cargarSedes: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`http://localhost:3000/api/sedes?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar filtro de sede
                const selectFiltro = $('#filtroSede');
                selectFiltro.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    selectFiltro.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                });
                
                // Cargar select de sede en el modal
                const selectModal = $('#sede');
                selectModal.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    selectModal.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                });
                
                console.log('✅ Sedes cargadas:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },

    // Cargar turnos
    cargarTurnos: async function() {
        try {
            const response = await fetch('http://localhost:3000/api/turnos');
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar filtro de turno
                const selectFiltro = $('#filtroTurno');
                selectFiltro.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    selectFiltro.append(`<option value="${turno.id}">${turno.descripcion}</option>`);
                });
                
                // Cargar select de turno en el modal
                const selectModal = $('#turno');
                selectModal.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    selectModal.append(`<option value="${turno.id}">${turno.descripcion}</option>`);
                });
                
                console.log('✅ Turnos cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-asistencia').on('click', '.btn-nuevo-asistencia', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-asistencia').on('click', '.btn-consultar-asistencia', function() {
            self.paginaActual = 1;
            self.consultar();
        });
        
        // Botón Guardar
        $(document).off('click', '.btn-guardar-asistencia-trabajadores').on('click', '.btn-guardar-asistencia-trabajadores', function() {
            self.guardar();
        });
        
        // Cambio de registros por página
        $(document).off('change', '#registrosPorPagina').on('change', '#registrosPorPagina', function() {
            self.registrosPorPagina = parseInt($(this).val());
            self.paginaActual = 1;
            self.consultar();
        });
        
        // Botones de paginación
        $(document).off('click', '#btnAnterior').on('click', '#btnAnterior', function() {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.consultar();
            }
        });
        
        $(document).off('click', '#btnSiguiente').on('click', '#btnSiguiente', function() {
            const totalPaginas = Math.ceil(self.totalRegistros / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.consultar();
            }
        });
        
        // Limpiar modal al cerrar
        $('#modalAsistencia').on('hidden.bs.modal', function() {
            $('#tablaTrabajadoresAsistencia').html(`
                <tr>
                    <td colspan="13" class="text-center text-muted py-4">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
        });
    },

    // Consultar asistencias
    consultar: async function() {
        try {
            const fechaDesde = $('#filtroFechaDesde').val();
            const fechaHasta = $('#filtroFechaHasta').val();
            const sedeId = $('#filtroSede').val();
            const turnoId = $('#filtroTurno').val();
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            
            // Construir URL con parámetros
            let url = `http://localhost:3000/api/asistencias?empresaId=${empresaId}`;
            if (fechaDesde) url += `&fechaDesde=${fechaDesde}`;
            if (fechaHasta) url += `&fechaHasta=${fechaHasta}`;
            if (sedeId) url += `&sedeId=${sedeId}`;
            if (turnoId) url += `&turnoId=${turnoId}`;
            url += `&pagina=${this.paginaActual}&registros=${this.registrosPorPagina}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.totalRegistros = result.total || result.data.length;
                this.renderizarTabla(result.data);
                this.actualizarInfoPaginacion();
            } else {
                this.renderizarTabla([]);
                showNotification('No se encontraron registros', 'info');
            }
        } catch (error) {
            console.error('Error al consultar asistencias:', error);
            showNotification('Error al cargar asistencias', 'danger');
            this.renderizarTabla([]);
        }
    },

    // Renderizar tabla
    renderizarTabla: function(datos) {
        const tbody = $('#tablaAsistencia tbody');
        tbody.empty();
        
        if (datos.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="11" class="text-center text-muted py-4">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            return;
        }
        
        datos.forEach(asistencia => {
            // Formatear fecha y obtener día de la semana
            const fecha = asistencia.fecha_asistencia || '-';
            let diaNombre = '-';
            if (fecha !== '-') {
                const fechaObj = new Date(fecha + 'T00:00:00');
                diaNombre = this.obtenerNombreDia(fechaObj);
            }
            
            const fila = `
                <tr>
                    <td>${fecha}</td>
                    <td>${diaNombre}</td>
                    <td>${asistencia.turno_descripcion || '-'}</td>
                    <td>${asistencia.sede_descripcion || '-'}</td>
                    <td>${asistencia.total_asistieron || 0}</td>
                    <td>${asistencia.total_faltaron || 0}</td>
                    <td>${asistencia.total_dia_descanso || 0}</td>
                    <td>0</td>
                    <td>${asistencia.total_feriado || 0}</td>
                    <td>0</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-ver-detalle" data-id="${asistencia.asistencia_id}" title="Ver detalle">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning btn-editar-asistencia" data-id="${asistencia.asistencia_id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar-asistencia" data-id="${asistencia.asistencia_id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(fila);
        });
        
        // Event listener para ver detalle
        $('.btn-ver-detalle').off('click').on('click', function() {
            const id = $(this).data('id');
            asistencia.verDetalle(id);
        });
        
        // Event listener para editar
        $('.btn-editar-asistencia').off('click').on('click', function() {
            const id = $(this).data('id');
            asistencia.editar(id);
        });
        
        // Event listener para eliminar
        $('.btn-eliminar-asistencia').off('click').on('click', function() {
            const id = $(this).data('id');
            asistencia.eliminar(id);
        });
    },

    // Actualizar información de paginación
    actualizarInfoPaginacion: function() {
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina + 1;
        const fin = Math.min(this.paginaActual * this.registrosPorPagina, this.totalRegistros);
        
        $('#infoRegistros').text(`Mostrando ${inicio} a ${fin} de ${this.totalRegistros} registros`);
        
        // Habilitar/deshabilitar botones
        $('#btnAnterior').prop('disabled', this.paginaActual === 1);
        const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
        $('#btnSiguiente').prop('disabled', this.paginaActual >= totalPaginas);
    },

    // Nuevo registro
    nuevo: function() {
        const self = this;
        
        // Obtener nombre del usuario desde localStorage
        let nombreUsuario = 'Usuario';
        try {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                nombreUsuario = userData.nombreCompleto || userData.nombre_completo || userData.usuario || 'Usuario';
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
        }
        
        // Limpiar modal
        $('#modalFecha').val(this.formatearFecha(new Date()));
        $('#modalDia').val(this.obtenerNombreDia(new Date()));
        $('#modalSede').val('');
        $('#modalTurno').val('');
        $('#modalRegistradoPor').val(nombreUsuario);
        $('#tablaTrabajadoresAsistencia').html(`
            <tr>
                <td colspan="14" class="text-center text-muted py-4">
                    Seleccione fecha, sede y turno, luego haga clic en Consultar
                </td>
            </tr>
        `);
        
        // Cargar sedes y turnos en el modal
        this.cargarSedesModal();
        this.cargarTurnosModal();
        
        // Event listener para cambio de fecha
        $('#modalFecha').off('change').on('change', function() {
            const fecha = new Date($(this).val() + 'T00:00:00');
            $('#modalDia').val(self.obtenerNombreDia(fecha));
        });
        
        // Event listener para consultar trabajadores
        $('.btn-consultar-trabajadores').off('click').on('click', function() {
            self.consultarTrabajadores();
        });
        
        const modal = new bootstrap.Modal(document.getElementById('modalAsistencia'));
        modal.show();
    },
    
    // Obtener nombre del día
    obtenerNombreDia: function(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    },
    
    // Cargar sedes en el modal
    cargarSedesModal: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`http://localhost:3000/api/sedes?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#modalSede');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    select.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                });
            }
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },
    
    // Cargar turnos en el modal
    cargarTurnosModal: async function() {
        try {
            const response = await fetch('http://localhost:3000/api/turnos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#modalTurno');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    select.append(`<option value="${turno.id}">${turno.descripcion}</option>`);
                });
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },
    
    // Consultar trabajadores
    consultarTrabajadores: async function() {
        const fecha = $('#modalFecha').val();
        const sedeId = $('#modalSede').val();
        const turnoId = $('#modalTurno').val();
        
        if (!fecha || !sedeId || !turnoId) {
            showNotification('Debe seleccionar fecha, sede y turno', 'warning');
            return;
        }
        
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const url = `http://localhost:3000/api/contratos/trabajadores-activos?empresaId=${empresaId}&sedeId=${sedeId}&turnoId=${turnoId}&fecha=${fecha}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                this.renderizarTrabajadores(result.data);
            } else {
                $('#tablaTrabajadoresAsistencia').html(`
                    <tr>
                        <td colspan="14" class="text-center text-muted py-4">
                            No se encontraron trabajadores activos para los filtros seleccionados
                        </td>
                    </tr>
                `);
                showNotification('No se encontraron trabajadores', 'info');
            }
        } catch (error) {
            console.error('Error al consultar trabajadores:', error);
            showNotification('Error al cargar trabajadores', 'danger');
        }
    },
    
    // Renderizar trabajadores en la tabla
    renderizarTrabajadores: function(trabajadores) {
        const tbody = $('#tablaTrabajadoresAsistencia');
        tbody.empty();
        
        // Obtener la fecha seleccionada para verificar día de descanso
        const fechaSeleccionada = $('#modalFecha').val();
        const diaSemana = this.obtenerDiaSemanaNumero(new Date(fechaSeleccionada + 'T00:00:00'));
        
        trabajadores.forEach((trabajador, index) => {
            // Formatear nombre completo (los nombres vienen en minúsculas desde el backend)
            const apellidosNombres = `${trabajador.apellidopaterno || ''} ${trabajador.apellidomaterno || ''} ${trabajador.nombres || ''}`.trim();
            
            // Formatear fecha de inicio
            let fechaInicio = trabajador.fechainiciolaboral || trabajador.fechainiciocontrato || '';
            if (fechaInicio && fechaInicio.includes('T')) {
                fechaInicio = fechaInicio.split('T')[0];
            }
            
            // Formatear hora de entrada (de HH:MM:SS a HH:MM)
            let horaEntrada = '';
            if (trabajador.horaentrada) {
                horaEntrada = trabajador.horaentrada.substring(0, 5); // Tomar solo HH:MM
            }
            
            // Verificar si es día de descanso del trabajador
            const esDiaDescanso = trabajador.diadescanso && trabajador.diadescanso === diaSemana;
            
            // Verificar si es día feriado
            const esFeriado = trabajador.esferiado === true || trabajador.esferiado === 'true';
            
            // Si es día de descanso o feriado, bloquear "Faltó"
            const bloquearFalto = esDiaDescanso || esFeriado;
            
            // Si coinciden feriado y día de descanso, el feriado tiene prioridad
            // Solo se habilita "Trabajó Día Feriado", no "Compró Día Descanso"
            const habilitarComproDiaDescanso = esDiaDescanso && !esFeriado;
            const habilitarTrabajoDiaFeriado = esFeriado;
            
            const fila = `
                <tr data-trabajador-id="${trabajador.trabajadorid || trabajador.id}" 
                    data-contrato-id="${trabajador.contratoid || ''}"
                    data-dia-descanso="${esDiaDescanso}"
                    data-es-feriado="${esFeriado}">
                    <td class="text-center" style="vertical-align: middle;">${index + 1}</td>
                    <td class="text-center" style="vertical-align: middle;">${trabajador.numerodocumento || ''}</td>
                    <td style="vertical-align: middle;">${apellidosNombres}</td>
                    <td class="text-center" style="vertical-align: middle;">${fechaInicio}</td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input dia-descanso" 
                               style="width: 20px; height: 20px; cursor: not-allowed;" 
                               ${esDiaDescanso ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; ${habilitarComproDiaDescanso ? '' : 'background-color: #f8f9fa;'}">
                        <input type="checkbox" class="form-check-input compro-dia-descanso" 
                               style="width: 20px; height: 20px; cursor: ${habilitarComproDiaDescanso ? 'pointer' : 'not-allowed'};" 
                               ${habilitarComproDiaDescanso ? '' : 'disabled'}>
                    </td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input dia-feriado" 
                               style="width: 20px; height: 20px; cursor: not-allowed;" 
                               ${esFeriado ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; ${habilitarTrabajoDiaFeriado ? '' : 'background-color: #f8f9fa;'}">
                        <input type="checkbox" class="form-check-input dia-feriado-trabajo" 
                               style="width: 20px; height: 20px; cursor: ${habilitarTrabajoDiaFeriado ? 'pointer' : 'not-allowed'};" 
                               ${habilitarTrabajoDiaFeriado ? '' : 'disabled'}>
                    </td>
                    <td class="text-center" style="vertical-align: middle; ${bloquearFalto ? 'background-color: #f8f9fa;' : ''}">
                        <input type="checkbox" class="form-check-input falto" 
                               style="width: 20px; height: 20px; cursor: ${bloquearFalto ? 'not-allowed' : 'pointer'};" 
                               ${bloquearFalto ? 'disabled' : ''}>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-entrada" 
                               value="${horaEntrada}" disabled style="background-color: #f8f9fa;">
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-ingreso" 
                               ${(esDiaDescanso || esFeriado) ? 'disabled' : ''}>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-tardanza" 
                               disabled readonly style="background-color: #f8f9fa;">
                    </td>
                    <td style="vertical-align: middle;">
                        <input type="text" class="form-control form-control-sm observacion" 
                               placeholder="Observación" ${(esDiaDescanso || esFeriado) ? 'disabled' : ''}>
                    </td>
                </tr>
            `;
            tbody.append(fila);
        });
        
        // Configurar event listeners para "Compró Día Descanso"
        this.configurarEventosComproDiaDescanso();
        
        // Configurar event listeners para "Trabajó Día Feriado"
        this.configurarEventosTrabajoDiaFeriado();
        
        // Configurar event listeners para "Faltó"
        this.configurarEventosFalto();
        
        // Configurar event listeners para calcular tardanza
        this.configurarCalculoTardanza();
        
        showNotification(`Se cargaron ${trabajadores.length} trabajadores`, 'success');
    },
    
    // Obtener número de día de la semana según el sistema de la BD
    // En la BD: 01=Lunes, 02=Martes, 03=Miércoles, 04=Jueves, 05=Viernes, 06=Sábado, 07=Domingo
    obtenerDiaSemanaNumero: function(fecha) {
        const dia = fecha.getDay(); // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
        
        // Convertir de JavaScript (0-6) al sistema de la BD (01-07)
        if (dia === 0) {
            return '07'; // Domingo
        } else {
            return dia.toString().padStart(2, '0'); // Lunes=01, Martes=02, etc.
        }
    },
    
    // Configurar eventos para el checkbox "Compró Día Descanso"
    configurarEventosComproDiaDescanso: function() {
        $('.compro-dia-descanso').off('change').on('change', function() {
            const $row = $(this).closest('tr');
            const esDiaDescanso = $row.data('dia-descanso');
            const comproDiaDescanso = $(this).is(':checked');
            
            if (esDiaDescanso && comproDiaDescanso) {
                // Desbloquear hora ingreso y observación (hora entrada y tardanza siempre bloqueadas)
                $row.find('.hora-ingreso, .observacion').prop('disabled', false);
            } else if (esDiaDescanso && !comproDiaDescanso) {
                // Bloquear y limpiar hora ingreso, tardanza y observación
                $row.find('.hora-ingreso').prop('disabled', true).val('');
                $row.find('.hora-tardanza').val('');
                $row.find('.observacion').prop('disabled', true).val('');
            }
        });
    },
    
    // Configurar eventos para el checkbox "Trabajó Día Feriado"
    configurarEventosTrabajoDiaFeriado: function() {
        $('.dia-feriado-trabajo').off('change').on('change', function() {
            const $row = $(this).closest('tr');
            const esFeriado = $row.data('es-feriado');
            const trabajoDiaFeriado = $(this).is(':checked');
            
            if (esFeriado && trabajoDiaFeriado) {
                // Desbloquear hora ingreso y observación
                $row.find('.hora-ingreso, .observacion').prop('disabled', false);
            } else if (esFeriado && !trabajoDiaFeriado) {
                // Bloquear y limpiar hora ingreso, tardanza y observación
                $row.find('.hora-ingreso').prop('disabled', true).val('');
                $row.find('.hora-tardanza').val('');
                $row.find('.observacion').prop('disabled', true).val('');
            }
        });
    },
    
    // Configurar eventos para el checkbox "Faltó"
    configurarEventosFalto: function() {
        $('.falto').off('change').on('change', function() {
            const $row = $(this).closest('tr');
            const falto = $(this).is(':checked');
            
            if (falto) {
                // Si faltó, bloquear campos de horas y limpiarlos
                // La observación permanece habilitada para que puedan poner el motivo
                $row.find('.hora-ingreso').prop('disabled', true).val('');
                $row.find('.hora-tardanza').val('');
            } else {
                // Si desmarca faltó, desbloquear hora ingreso
                $row.find('.hora-ingreso').prop('disabled', false);
            }
        });
    },
    
    // Configurar cálculo automático de tardanza
    configurarCalculoTardanza: function() {
        $('.hora-ingreso').off('change').on('change', function() {
            const $row = $(this).closest('tr');
            const horaEntrada = $row.find('.hora-entrada').val();
            const horaIngreso = $(this).val();
            
            if (horaEntrada && horaIngreso) {
                const tardanza = asistencia.calcularTardanza(horaEntrada, horaIngreso);
                $row.find('.hora-tardanza').val(tardanza);
            } else {
                $row.find('.hora-tardanza').val('');
            }
        });
    },
    
    // Calcular tardanza (diferencia entre hora ingreso y hora entrada)
    calcularTardanza: function(horaEntrada, horaIngreso) {
        // Convertir horas a minutos desde medianoche
        const [hEntrada, mEntrada] = horaEntrada.split(':').map(Number);
        const [hIngreso, mIngreso] = horaIngreso.split(':').map(Number);
        
        const minutosEntrada = hEntrada * 60 + mEntrada;
        const minutosIngreso = hIngreso * 60 + mIngreso;
        
        // Calcular diferencia
        const diferencia = minutosIngreso - minutosEntrada;
        
        // Si llegó antes o a tiempo, tardanza es 00:00
        if (diferencia <= 0) {
            return '00:00';
        }
        
        // Convertir diferencia a formato HH:MM
        const horas = Math.floor(diferencia / 60);
        const minutos = diferencia % 60;
        
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    },

    // Guardar asistencia (nuevo o edición)
    guardar: async function() {
        const fecha = $('#modalFecha').val();
        const sedeId = $('#modalSede').val();
        const turnoId = $('#modalTurno').val();
        
        if (!fecha || !sedeId || !turnoId) {
            showNotification('Debe seleccionar fecha, sede y turno', 'warning');
            return;
        }
        
        // Verificar si es edición o nuevo
        const asistenciaId = $('.btn-guardar-asistencia-trabajadores').data('asistencia-id');
        const esEdicion = asistenciaId !== undefined && asistenciaId !== null;
        
        // Recopilar datos de todos los trabajadores
        const trabajadores = [];
        $('#tablaTrabajadoresAsistencia tr').each(function() {
            const trabajadorId = $(this).data('trabajador-id');
            if (trabajadorId) {
                const trabajador = {
                    trabajadorId: trabajadorId,
                    diaDescanso: $(this).find('.dia-descanso').is(':checked') ? 1 : 0,
                    comproDiaDescanso: $(this).find('.compro-dia-descanso').is(':checked') ? 1 : 0,
                    diaFeriado: $(this).find('.dia-feriado').is(':checked') ? 1 : 0,
                    diaFeriadoTrabajo: $(this).find('.dia-feriado-trabajo').is(':checked') ? 1 : 0,
                    falto: $(this).find('.falto').is(':checked') ? 1 : 0,
                    horaIngreso: $(this).find('.hora-ingreso').val() || null,
                    horaTardanza: $(this).find('.hora-tardanza').val() || null,
                    observacion: $(this).find('.observacion').val() || null
                };
                
                // Si es edición, incluir el ID del detalle
                if (esEdicion) {
                    const detalleId = $(this).data('detalle-id');
                    if (detalleId) {
                        trabajador.detalleId = detalleId;
                    }
                }
                
                trabajadores.push(trabajador);
            }
        });
        
        if (trabajadores.length === 0) {
            showNotification('No hay trabajadores para registrar', 'warning');
            return;
        }
        
        try {
            const datos = {
                fecha: fecha,
                sedeId: parseInt(sedeId),
                turnoId: turnoId,
                trabajadores: trabajadores,
                empresaId: parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1,
                usuarioId: parseInt(localStorage.getItem('usuario_id')) || 1
            };
            
            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-asistencia-trabajadores').prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');
            
            // Determinar URL y método según si es nuevo o edición
            const url = esEdicion 
                ? `http://localhost:3000/api/asistencias/${asistenciaId}`
                : 'http://localhost:3000/api/asistencias';
            const method = esEdicion ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const mensaje = esEdicion 
                    ? `Asistencia actualizada exitosamente para ${trabajadores.length} trabajadores`
                    : `Asistencia registrada exitosamente para ${trabajadores.length} trabajadores`;
                showNotification(mensaje, 'success');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAsistencia'));
                if (modal) {
                    modal.hide();
                }
                
                // Limpiar el ID de asistencia del botón
                $('.btn-guardar-asistencia-trabajadores').removeData('asistencia-id');
                
                this.consultar();
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar asistencia:', error);
            showNotification('Error al guardar asistencia: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-asistencia-trabajadores').prop('disabled', false)
                .html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Ver detalle de asistencia (solo lectura)
    verDetalle: async function(id) {
        await this.cargarAsistencia(id, 'ver');
    },
    
    // Editar asistencia
    editar: async function(id) {
        await this.cargarAsistencia(id, 'editar');
    },
    
    // Cargar asistencia en el modal (modo: 'ver' o 'editar')
    cargarAsistencia: async function(id, modo) {
        try {
            const response = await fetch(`http://localhost:3000/api/asistencias/${id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.mostrarModalAsistencia(result.data, modo);
            } else {
                showNotification('No se pudo obtener la asistencia', 'warning');
            }
        } catch (error) {
            console.error('Error al cargar asistencia:', error);
            showNotification('Error al cargar asistencia', 'danger');
        }
    },
    
    // Mostrar modal con asistencia (modo: 'ver' o 'editar')
    mostrarModalAsistencia: async function(asistencia, modo) {
        const soloLectura = modo === 'ver';
        
        // Configurar título del modal
        const titulo = soloLectura ? 'Ver Asistencia' : 'Editar Asistencia';
        $('#modalAsistenciaTitle').text(titulo);
        
        // Cargar sedes y turnos primero
        await this.cargarSedesModal();
        await this.cargarTurnosModal();
        
        // Llenar datos de cabecera
        $('#modalFecha').val(asistencia.fecha).prop('disabled', true);
        $('#modalDia').val(this.obtenerNombreDia(new Date(asistencia.fecha + 'T00:00:00')));
        $('#modalSede').val(asistencia.sedeid).prop('disabled', true);
        $('#modalTurno').val(asistencia.turnoid).prop('disabled', true);
        
        // Obtener usuario registrado
        let nombreUsuario = 'Usuario';
        try {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                nombreUsuario = userData.nombreCompleto || userData.nombre_completo || userData.usuario || 'Usuario';
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
        }
        $('#modalRegistradoPor').val(nombreUsuario);
        
        // Renderizar trabajadores
        const tbody = $('#tablaTrabajadoresAsistencia');
        tbody.empty();
        
        asistencia.trabajadores.forEach((trabajador, index) => {
            const apellidosNombres = `${trabajador.apellidopaterno || ''} ${trabajador.apellidomaterno || ''} ${trabajador.nombres || ''}`.trim();
            const fechaInicio = trabajador.fechainiciolaboral || '';
            const horaEntrada = trabajador.horaentrada ? trabajador.horaentrada.substring(0, 5) : '';
            const horaIngreso = trabajador.horaingreso ? trabajador.horaingreso.substring(0, 5) : '';
            const horaTardanza = trabajador.horatardanza ? trabajador.horatardanza.substring(0, 5) : '';
            
            const fila = `
                <tr data-trabajador-id="${trabajador.trabajadorid}" data-detalle-id="${trabajador.id}">
                    <td class="text-center" style="vertical-align: middle;">${index + 1}</td>
                    <td class="text-center" style="vertical-align: middle;">${trabajador.numerodocumento || ''}</td>
                    <td style="vertical-align: middle;">${apellidosNombres}</td>
                    <td class="text-center" style="vertical-align: middle;">${fechaInicio}</td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input dia-descanso" 
                               style="width: 20px; height: 20px;" 
                               ${trabajador.diadescanso ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input compro-dia-descanso" 
                               style="width: 20px; height: 20px;" 
                               ${trabajador.comprodiadescanso ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input dia-feriado" 
                               style="width: 20px; height: 20px;" 
                               ${trabajador.diaferiado ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; background-color: #f8f9fa;">
                        <input type="checkbox" class="form-check-input dia-feriado-trabajo" 
                               style="width: 20px; height: 20px;" 
                               ${trabajador.trabdiaferiado ? 'checked' : ''} disabled>
                    </td>
                    <td class="text-center" style="vertical-align: middle; ${soloLectura ? 'background-color: #f8f9fa;' : ''}">
                        <input type="checkbox" class="form-check-input falto" 
                               style="width: 20px; height: 20px; cursor: ${soloLectura ? 'not-allowed' : 'pointer'};" 
                               ${trabajador.falto ? 'checked' : ''} ${soloLectura ? 'disabled' : ''}>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-entrada" 
                               value="${horaEntrada}" disabled style="background-color: #f8f9fa;">
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-ingreso" 
                               value="${horaIngreso}" ${soloLectura ? 'disabled' : ''}>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <input type="time" class="form-control form-control-sm hora-tardanza" 
                               value="${horaTardanza}" disabled readonly style="background-color: #f8f9fa;">
                    </td>
                    <td style="vertical-align: middle;">
                        <input type="text" class="form-control form-control-sm observacion" 
                               value="${trabajador.observacion || ''}" placeholder="Observación" ${soloLectura ? 'disabled' : ''}>
                    </td>
                </tr>
            `;
            tbody.append(fila);
        });
        
        // Configurar botones del modal
        if (soloLectura) {
            $('.btn-guardar-asistencia-trabajadores').hide();
        } else {
            $('.btn-guardar-asistencia-trabajadores').show()
                .data('asistencia-id', asistencia.id); // Guardar ID para actualizar
            
            // Reconfigurar eventos para edición
            this.configurarEventosFalto();
            this.configurarCalculoTardanza();
        }
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalAsistencia'));
        modal.show();
    },
    
    // Eliminar asistencia
    eliminar: async function(id) {
        if (!confirm('¿Está seguro de eliminar esta asistencia?')) {
            return;
        }
        
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
        console.log('Eliminar asistencia:', id);
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo asistencia.js cargado');
    
    // Intentar inicializar si la tabla ya existe
    if ($('#tablaAsistencia').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        asistencia.init();
    } else {
        console.log('⏳ Tabla no encontrada aún, esperando carga dinámica...');
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerAsistencia = new MutationObserver(function(mutations) {
    if ($('#tablaAsistencia').length > 0 && asistencia.paginaActual === 1) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerAsistencia.disconnect();
        asistencia.init();
    }
});

// Observar cambios en el contenedor principal
if (document.querySelector('main')) {
    observerAsistencia.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
