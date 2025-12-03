// Módulo de Subsidios
const subsidios = {
    tabla: null,
    empresaId: null,
    modoEdicion: false,
    subsidioIdEdicion: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Subsidios inicializado');
        this.empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        console.log('🏢 Empresa ID:', this.empresaId);
        this.configurarEventos();
        this.inicializarTabla();
        this.cargarCombos();
        this.establecerPeriodoActual();
    },
    
    // Establecer período actual
    establecerPeriodoActual: function() {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const periodoActual = `${year}-${month}`;
        
        $('#filtroPeriodoSubsidios').val(periodoActual);
        $('#modalPeriodoSubsidio').val(periodoActual);
        
        console.log('📅 Período establecido:', periodoActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaSubsidios')) {
            $('#tablaSubsidios').DataTable().destroy();
        }
        
        this.tabla = $('#tablaSubsidios').DataTable({
            data: [], // Por ahora vacío, luego conectaremos con el backend
            columns: [
                { 
                    data: null,
                    render: function(data, type, row, meta) {
                        return meta.row + 1;
                    },
                    className: 'text-center'
                },
                { 
                    data: 'numero_documento',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'nombre_completo',
                    defaultContent: '-'
                },
                { 
                    data: 'puesto',
                    defaultContent: '-'
                },
                { 
                    data: 'sede',
                    defaultContent: '-'
                },
                { 
                    data: 'turno',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'tipo_subsidio',
                    defaultContent: '-'
                },
                { 
                    data: 'tipo_suspension',
                    defaultContent: '-'
                },
                { 
                    data: 'fecha_desde',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'fecha_hasta',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'dias',
                    defaultContent: '-',
                    className: 'text-center'
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-warning btn-accion-subsidios btn-editar-subsidio" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-subsidios btn-eliminar-subsidio" 
                                    data-id="${row.id}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron registros coincidentes",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": activar para ordenar la columna ascendente",
                    "sortDescending": ": activar para ordenar la columna descendente"
                }
            },
            pageLength: 10,
            order: [[8, 'desc']], // Ordenar por fecha desde
            drawCallback: function() {
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-editar-subsidio').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-subsidio').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $('#btnNuevoSubsidio').off('click').on('click', function() {
            self.nuevo();
        });
        
        // Botón Filtrar
        $('#btnFiltrarSubsidios').off('click').on('click', function() {
            self.filtrar();
        });
        
        // Botón Buscar Trabajador
        $('#btnBuscarTrabajadorSubsidio').off('click').on('click', function() {
            self.buscarTrabajador();
        });
        
        // Enter en buscar trabajador
        $('#nroDocSubsidio').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarTrabajador();
            }
        });
        
        // Calcular días automáticamente
        $('#modalFechaDesde, #modalFechaHasta').off('change').on('change', function() {
            self.calcularDias();
        });
        
        // Botón Guardar
        $('#btnGuardarSubsidio').off('click').on('click', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalSubsidio').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Cargar combos
    cargarCombos: async function() {
        await this.cargarTurnos();
        await this.cargarSedes();
        await this.cargarTiposSuspension();
    },
    
    // Cargar Turnos
    cargarTurnos: async function() {
        try {
            console.log('🔄 Cargando turnos');
            // TODO: Conectar con endpoint real
            const turnos = [
                { id: 1, descripcion: 'TODOS' },
                { id: 2, descripcion: 'MAÑANA' },
                { id: 3, descripcion: 'TARDE' },
                { id: 4, descripcion: 'NOCHE' }
            ];
            
            const $selectFiltro = $('#filtroTurnoSubsidios');
            const $selectModal = $('#modalTurnoSubsidio');
            
            $selectFiltro.empty().append('<option value="">* TODOS *</option>');
            $selectModal.empty().append('<option value="">* SELECCIONE *</option>');
            
            turnos.forEach(turno => {
                $selectFiltro.append(`<option value="${turno.id}">${turno.descripcion}</option>`);
                $selectModal.append(`<option value="${turno.id}">${turno.descripcion}</option>`);
            });
            
            console.log('✅ Turnos cargados');
        } catch (error) {
            console.error('❌ Error al cargar turnos:', error);
        }
    },
    
    // Cargar Sedes
    cargarSedes: async function() {
        try {
            console.log('🔄 Cargando sedes');
            // TODO: Conectar con endpoint real
            const sedes = [
                { id: 1, descripcion: 'SEDE PRINCIPAL' },
                { id: 2, descripcion: 'SEDE SECUNDARIA' }
            ];
            
            const $selectFiltro = $('#filtroSedeSubsidios');
            const $selectModal = $('#modalSedeSubsidio');
            
            $selectFiltro.empty().append('<option value="">* TODOS *</option>');
            $selectModal.empty().append('<option value="">* SELECCIONE *</option>');
            
            sedes.forEach(sede => {
                $selectFiltro.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                $selectModal.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
            });
            
            console.log('✅ Sedes cargadas');
        } catch (error) {
            console.error('❌ Error al cargar sedes:', error);
        }
    },
    
    // Cargar Tipos de Suspensión
    cargarTiposSuspension: async function() {
        try {
            console.log('🔄 Cargando tipos de suspensión');
            // TODO: Conectar con endpoint real
            const tipos = [
                { id: 1, descripcion: 'SUSPENSIÓN PERFECTA' },
                { id: 2, descripcion: 'SUSPENSIÓN IMPERFECTA' },
                { id: 3, descripcion: 'LICENCIA SIN GOCE' }
            ];
            
            const $select = $('#modalTipoSuspension');
            $select.empty().append('<option value="">* SELECCIONE *</option>');
            
            tipos.forEach(tipo => {
                $select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
            });
            
            console.log('✅ Tipos de suspensión cargados');
        } catch (error) {
            console.error('❌ Error al cargar tipos de suspensión:', error);
        }
    },

    // Filtrar
    filtrar: function() {
        const periodo = $('#filtroPeriodoSubsidios').val();
        const turno = $('#filtroTurnoSubsidios').val();
        const sede = $('#filtroSedeSubsidios').val();
        
        console.log('🔍 Filtrando:', { periodo, turno, sede });
        
        // TODO: Implementar filtrado con backend
        showNotification('Filtrado aplicado', 'info');
    },

    // Nuevo
    nuevo: function() {
        this.modoEdicion = false;
        this.subsidioIdEdicion = null;
        this.limpiarModal();
        
        $('#tituloModalSubsidio').text('Nuevo Subsidios y No Subsidios');
        
        const modal = new bootstrap.Modal(document.getElementById('modalSubsidio'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#formSubsidio')[0].reset();
        $('#trabajadorIdSubsidio').val('');
        $('#nombreCompletoSubsidio').val('');
        $('#modalDias').val('');
        $('#modalObservacion').val('');
        $('#radioSubsidiado').prop('checked', true);
        this.modoEdicion = false;
        this.subsidioIdEdicion = null;
    },
    
    // Buscar trabajador
    buscarTrabajador: async function() {
        const busqueda = $('#nroDocSubsidio').val().trim();
        
        if (!busqueda) {
            showNotification('Ingrese un número de documento o nombre', 'warning');
            return;
        }
        
        console.log('🔍 Buscando trabajador:', busqueda);
        
        // TODO: Implementar búsqueda real
        showNotification('Funcionalidad de búsqueda en desarrollo', 'info');
    },
    
    // Calcular días
    calcularDias: function() {
        const desde = $('#modalFechaDesde').val();
        const hasta = $('#modalFechaHasta').val();
        
        if (desde && hasta) {
            const fechaDesde = new Date(desde);
            const fechaHasta = new Date(hasta);
            
            if (fechaHasta >= fechaDesde) {
                const diferencia = Math.floor((fechaHasta - fechaDesde) / (1000 * 60 * 60 * 24)) + 1;
                $('#modalDias').val(diferencia);
            } else {
                $('#modalDias').val('');
                showNotification('La fecha "Hasta" debe ser mayor o igual a "Desde"', 'warning');
            }
        }
    },
    
    // Guardar
    guardar: function() {
        const trabajadorId = $('#trabajadorIdSubsidio').val();
        const nroDoc = $('#nroDocSubsidio').val().trim();
        
        if (!trabajadorId || !nroDoc) {
            showNotification('Debe buscar y seleccionar un trabajador', 'warning');
            return;
        }
        
        const datos = {
            trabajadorId: trabajadorId,
            tipoSubsidio: $('input[name="tipoSubsidio"]:checked').val(),
            tipoSuspension: $('#modalTipoSuspension').val(),
            fechaDesde: $('#modalFechaDesde').val(),
            fechaHasta: $('#modalFechaHasta').val(),
            dias: $('#modalDias').val(),
            observacion: $('#modalObservacion').val()
        };
        
        console.log('💾 Guardando:', datos);
        
        // TODO: Implementar guardado real
        showNotification('Funcionalidad de guardado en desarrollo', 'info');
    },
    
    // Editar
    editar: function(id) {
        console.log('✏️ Editando subsidio ID:', id);
        
        // TODO: Implementar edición
        showNotification('Funcionalidad de edición en desarrollo', 'info');
    },
    
    // Eliminar
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar este registro?')) {
            return;
        }
        
        console.log('🗑️ Eliminando subsidio ID:', id);
        
        // TODO: Implementar eliminación
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo subsidios.js cargado');
    
    if ($('#tablaSubsidios').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        subsidios.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerSubsidios = new MutationObserver(function(mutations) {
    if ($('#tablaSubsidios').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerSubsidios.disconnect();
        subsidios.init();
    }
});

if (document.querySelector('main')) {
    observerSubsidios.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
