// Módulo de Contrato
const contrato = {
    tablaContratos: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Contrato inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
        this.cargarSedes();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaContratos')) {
            $('#tablaContratos').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.tablaContratos = $('#tablaContratos').DataTable({
            ajax: {
                url: `/api/contratos/empresa/${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar contratos:', error);
                    showNotification('Error al cargar los contratos', 'danger');
                }
            },
            columns: [
                {
                    data: 'id',
                    className: 'text-center fw-bold',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'sedeDescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'numeroDocumento',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: null,
                    render: function(data, type, row) {
                        const apellidos = (row.apellidoPaterno || '') + ' ' + (row.apellidoMaterno || '');
                        const nombres = row.nombres || '';
                        return (apellidos + ' ' + nombres).trim() || '-';
                    }
                },
                {
                    data: 'fechaIngreso',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaInicio',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaFin',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'sueldo',
                    className: 'text-end',
                    render: function(data) {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                {
                    data: 'tipoContratoDescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'horaLaboral',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'puestoDescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaFinCese',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'estado',
                    className: 'text-center',
                    render: function(data) {
                        if (data === 'VIGENTE') {
                            return '<span class="badge bg-success">VIGENTE</span>';
                        } else if (data === 'FINALIZADO') {
                            return '<span class="badge bg-danger">FINALIZADO</span>';
                        }
                        return '<span class="badge bg-secondary">-</span>';
                    }
                },
                {
                    data: null,
                    className: 'text-center',
                    orderable: false,
                    render: function(data, type, row) {
                        return `
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-outline-primary btn-sm btn-editar" 
                                        data-id="${row.id}" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" 
                                        data-id="${row.id}" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                lengthMenu: 'Mostrar _MENU_ registros',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                infoEmpty: 'Mostrando 0 a 0 de 0 registros',
                infoFiltered: '(filtrado de _MAX_ registros totales)',
                paginate: {
                    first: 'Primero',
                    last: 'Último',
                    next: 'Siguiente',
                    previous: 'Anterior'
                },
                emptyTable: 'No hay datos disponibles',
                zeroRecords: 'No se encontraron registros coincidentes'
            },
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
            responsive: false,
            scrollX: true,
            dom: 'lftip',
            ordering: false,
            initComplete: function() {
                $('#tablaContratos thead tr:not(:first)').remove();
                console.log('✅ DataTable de contratos inicializada');
            }
        });
        
        setTimeout(() => {
            $('#tablaContratos thead tr:not(:first)').remove();
        }, 500);
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-contrato').on('click', '.btn-nuevo-contrato', function() {
            console.log('🔵 Click en botón Nuevo Contrato');
            self.nuevo();
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-contratos').on('click', '.btn-consultar-contratos', function() {
            self.consultar();
        });
        
        // Filtro de sede
        $(document).off('change', '#filtroSede').on('change', '#filtroSede', function() {
            const sede = $(this).val();
            self.tablaContratos.column(1).search(sede).draw();
        });
        
        // Botones de Editar y Eliminar
        $(document).off('click', '.btn-editar').on('click', '.btn-editar', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $(document).off('click', '.btn-eliminar').on('click', '.btn-eliminar', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
        
        // Botón Guardar
        $(document).off('click', '.btn-guardar-contrato').on('click', '.btn-guardar-contrato', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalContrato').on('hidden.bs.modal', function() {
            $('#formContrato')[0].reset();
            $('#contratoId').val('');
            $('.btn-guardar-contrato').html('<i class="fas fa-save me-1"></i>Guardar');
        });
    },

    // Cargar sedes para el filtro
    cargarSedes: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/sedes?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar filtro de sede
                const selectFiltro = $('#filtroSede');
                selectFiltro.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    const option = `<option value="${sede.descripcion}">${sede.descripcion}</option>`;
                    selectFiltro.append(option);
                });
                
                // Cargar select de sede en el modal
                const selectModal = $('#sede');
                selectModal.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    const option = `<option value="${sede.id}">${sede.descripcion}</option>`;
                    selectModal.append(option);
                });
                
                console.log('✅ Sedes cargadas:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },

    // Métodos CRUD
    nuevo: function() {
        console.log('🔵 Abriendo modal de nuevo contrato...');
        
        // Resetear formulario
        $('#formContrato')[0].reset();
        $('#contratoId').val('');
        $('#modalContratoTitle').text('Nuevo Contrato');
        $('.btn-guardar-contrato').html('<i class="fas fa-save me-1"></i>Guardar');
        
        // Cargar todos los selects
        this.cargarTiposContrato();
        this.cargarSedes();
        this.cargarPuestos();
        this.cargarTurnos();
        this.cargarHorarios();
        this.cargarDiasDescanso();
        this.cargarTiposTrabajador();
        this.cargarRegimenesPensionarios();
        this.cargarRegimenesLaborales();
        
        // Configurar cálculos automáticos
        this.configurarCalculos();
        
        // Abrir modal
        try {
            const modalElement = document.getElementById('modalContrato');
            if (!modalElement) {
                console.error('❌ Modal #modalContrato no encontrado en el DOM');
                showNotification('Error: Modal no encontrado', 'danger');
                return;
            }
            
            console.log('✅ Modal encontrado, intentando abrir...');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Modal abierto');
        } catch (error) {
            console.error('❌ Error al abrir modal:', error);
            showNotification('Error al abrir modal: ' + error.message, 'danger');
        }
    },

    buscarTrabajadores: async function(termino) {
        if (!termino || termino.length < 2) {
            $('#resultadosBusqueda').hide().empty();
            return;
        }
        
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            // Buscar solo trabajadores de PLANILLA (tipo '01')
            const response = await fetch(`/api/trabajadores/empresa/${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Filtrar por tipo PLANILLA y por término de búsqueda
                const trabajadoresPlanilla = result.data.filter(t => {
                    if (t.tipoTrabajador !== '01') return false; // Solo PLANILLA
                    
                    const terminoLower = termino.toLowerCase();
                    const nombreCompleto = `${t.apellidoPaterno || ''} ${t.apellidoMaterno || ''} ${t.nombres || ''}`.toLowerCase();
                    const documento = (t.numeroDocumento || '').toLowerCase();
                    
                    return nombreCompleto.includes(terminoLower) || documento.includes(terminoLower);
                });
                
                this.mostrarResultados(trabajadoresPlanilla);
            }
        } catch (error) {
            console.error('Error al buscar trabajadores:', error);
        }
    },
    
    mostrarResultados: function(trabajadores) {
        const contenedor = $('#resultadosBusqueda');
        contenedor.empty();
        
        if (trabajadores.length === 0) {
            contenedor.append('<div class="list-group-item text-muted">No se encontraron trabajadores de PLANILLA</div>');
            contenedor.show();
            return;
        }
        
        trabajadores.forEach(trabajador => {
            const nombreCompleto = `${trabajador.apellidoPaterno || ''} ${trabajador.apellidoMaterno || ''} ${trabajador.nombres || ''}`.trim();
            const dni = trabajador.numeroDocumento || '';
            const item = $(`
                <a href="#" class="list-group-item list-group-item-action" data-id="${trabajador.id}" data-nombre="${nombreCompleto}" data-dni="${dni}">
                    <strong>${dni}</strong> - ${nombreCompleto}
                </a>
            `);
            
            item.on('click', (e) => {
                e.preventDefault();
                this.seleccionarTrabajador(trabajador.id, nombreCompleto, dni);
            });
            
            contenedor.append(item);
        });
        
        contenedor.show();
    },
    
    seleccionarTrabajador: function(id, nombreCompleto, dni) {
        $('#trabajadorId').val(id);
        $('#nombreCompleto').val(nombreCompleto);
        $('#buscarTrabajador').val(dni); // Solo el DNI en el campo de búsqueda
        $('#resultadosBusqueda').hide().empty();
        console.log('✅ Trabajador seleccionado:', id, nombreCompleto);
    },
    
    cargarPuestos: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/puestos?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#puesto');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(puesto => {
                    const option = `<option value="${puesto.id}">${puesto.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        }
    },
    
    cargarTurnos: async function() {
        try {
            const response = await fetch('/api/turnos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#turno');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    const option = `<option value="${turno.id}">${turno.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },
    
    cargarHorarios: async function() {
        try {
            const response = await fetch('/api/horarios');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#horario');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(horario => {
                    const option = `<option value="${horario.id}">${horario.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    },
    
    cargarDiasDescanso: async function() {
        try {
            const response = await fetch('/api/dias-semana');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#diaDescanso');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(dia => {
                    const option = `<option value="${dia.id}">${dia.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar días de descanso:', error);
        }
    },
    
    cargarTiposTrabajador: async function() {
        try {
            const response = await fetch('/api/tipos-trabajador');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoTrabajador');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar tipos de trabajador:', error);
        }
    },
    
    cargarRegimenesPensionarios: async function() {
        try {
            const response = await fetch('/api/regimenes-pensionarios');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#regimenPensionario');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    const option = `<option value="${regimen.id}">${regimen.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar regímenes pensionarios:', error);
        }
    },
    
    cargarRegimenesLaborales: async function() {
        try {
            const response = await fetch('/api/regimenes-laborales');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#regimenLaboral');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    const option = `<option value="${regimen.id}">${regimen.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar regímenes laborales:', error);
        }
    },
    
    configurarCalculos: function() {
        const self = this;
        
        // Calcular Hora Laboral cuando cambien H. Entrada o H. Salida
        $('#horaEntrada, #horaSalida').off('change').on('change', function() {
            const entrada = $('#horaEntrada').val();
            const salida = $('#horaSalida').val();
            
            if (entrada && salida) {
                const [hE, mE] = entrada.split(':').map(Number);
                const [hS, mS] = salida.split(':').map(Number);
                
                const minutosEntrada = hE * 60 + mE;
                const minutosSalida = hS * 60 + mS;
                
                let diferencia = minutosSalida - minutosEntrada;
                if (diferencia < 0) diferencia += 24 * 60; // Si cruza medianoche
                
                const horas = (diferencia / 60).toFixed(1);
                $('#horaLaboral').val(horas);
            }
        });
        
        // Calcular Sueldo Total cuando cambien Remuneración Básica o R.C.
        $('#remuneracionBasica, #remuneracionRC').off('input').on('input', function() {
            const basica = parseFloat($('#remuneracionBasica').val()) || 0;
            const rc = parseFloat($('#remuneracionRC').val()) || 0;
            const total = (basica + rc).toFixed(2);
            $('#sueldoTotal').val(total);
        });
        
        // Autocomplete para buscar trabajador (búsqueda instantánea)
        $('#buscarTrabajador').off('input').on('input', function() {
            const termino = $(this).val().trim();
            
            if (termino.length < 2) {
                $('#resultadosBusqueda').hide().empty();
                return;
            }
            
            self.buscarTrabajadores(termino);
        });
        
        // Ocultar resultados al hacer clic fuera
        $(document).off('click.busqueda').on('click.busqueda', function(e) {
            if (!$(e.target).closest('#buscarTrabajador, #resultadosBusqueda').length) {
                $('#resultadosBusqueda').hide();
            }
        });
        
        // Limpiar al hacer focus
        $('#buscarTrabajador').off('focus').on('focus', function() {
            if ($('#trabajadorId').val()) {
                // Si ya hay un trabajador seleccionado, no limpiar
                return;
            }
            $(this).select();
        });
    },

    cargarTiposContrato: async function() {
        try {
            const response = await fetch('/api/tipos-contrato');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoContrato');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.codigo} - ${tipo.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Tipos de contrato cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de contrato:', error);
        }
    },

    consultar: function() {
        this.tablaContratos.ajax.reload();
        showNotification('Datos actualizados', 'success');
    },

    guardar: function() {
        const form = $('#formContrato')[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        showNotification('Funcionalidad de guardar contrato en desarrollo', 'info');
    },

    editar: function(id) {
        showNotification('Funcionalidad de editar contrato en desarrollo', 'info');
    },

    eliminar: function(id) {
        showNotification('Funcionalidad de eliminar contrato en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo contrato.js cargado');
    
    // Intentar inicializar si la tabla ya existe
    if ($('#tablaContratos').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        contrato.init();
    } else {
        console.log('⏳ Tabla no encontrada aún, esperando carga dinámica...');
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observer = new MutationObserver(function(mutations) {
    if ($('#tablaContratos').length > 0 && !contrato.tablaContratos) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observer.disconnect();
        contrato.init();
    }
});

// Observar cambios en el contenedor principal
if (document.querySelector('main')) {
    observer.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
