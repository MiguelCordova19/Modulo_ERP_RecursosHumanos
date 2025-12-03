// Módulo de Apoyo / Bono
const apoyoBono = {
    tabla: null,
    empresaId: null,
    modoEdicion: false,
    apoyoBonoIdEdicion: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Apoyo / Bono inicializado');
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
        
        $('#filtroPeriodoApoyoBono').val(periodoActual);
        
        console.log('📅 Período establecido:', periodoActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaApoyoBono')) {
            $('#tablaApoyoBono').DataTable().destroy();
        }
        
        this.tabla = $('#tablaApoyoBono').DataTable({
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
                    data: 'fecha',
                    defaultContent: '-',
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
                    data: 'concepto',
                    defaultContent: '-'
                },
                { 
                    data: 'puesto',
                    defaultContent: '-'
                },
                { 
                    data: 'sede_origen',
                    defaultContent: '-'
                },
                { 
                    data: 'sede_apoyo',
                    defaultContent: '-'
                },
                { 
                    data: 'turno',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'tipo',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'tipo_apoyo',
                    defaultContent: '-'
                },
                { 
                    data: 'importe',
                    defaultContent: '0.00',
                    className: 'text-end',
                    render: function(data) {
                        return parseFloat(data || 0).toFixed(2);
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-warning btn-accion-apoyo-bono btn-editar-apoyo-bono" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-apoyo-bono btn-eliminar-apoyo-bono" 
                                    data-id="${row.id}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                "decimal": "",
                "emptyTable": "No hay datos disponibles",
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
            order: [[1, 'desc']], // Ordenar por fecha
            drawCallback: function() {
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-editar-apoyo-bono').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-apoyo-bono').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $('#btnNuevoApoyoBono').off('click').on('click', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $('#btnConsultarApoyoBono').off('click').on('click', function() {
            self.consultar();
        });
        
        // Botón Buscar Concepto
        $('#btnBuscarConceptoApoyoBono').off('click').on('click', function() {
            self.buscarConcepto();
        });
        
        // Enter en buscar concepto
        $('#buscarConceptoApoyoBono').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarConcepto();
            }
        });
        
        // Botón Buscar Trabajador
        $('#btnBuscarTrabajadorApoyoBono').off('click').on('click', function() {
            self.buscarTrabajador();
        });
        
        // Enter en buscar trabajador
        $('#nroDocApoyoBono').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarTrabajador();
            }
        });
        
        // Botón Guardar
        $('#btnGuardarApoyoBono').off('click').on('click', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalApoyoBono').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Cargar combos
    cargarCombos: async function() {
        await this.cargarSedes();
        await this.cargarTurnos();
        await this.cargarTiposApoyo();
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
            
            const $selectFiltro = $('#filtroSedeApoyoBono');
            const $selectModal = $('#modalSedeApoyoBono');
            
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
            
            const $selectFiltro = $('#filtroTurnoApoyoBono');
            const $selectModal = $('#modalTurnoApoyoBono');
            
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
    
    // Cargar Tipos de Apoyo
    cargarTiposApoyo: async function() {
        try {
            console.log('🔄 Cargando tipos de apoyo');
            // TODO: Conectar con endpoint real
            const tipos = [
                { id: 1, descripcion: 'APOYO TEMPORAL' },
                { id: 2, descripcion: 'APOYO PERMANENTE' },
                { id: 3, descripcion: 'BONO PRODUCTIVIDAD' },
                { id: 4, descripcion: 'BONO ESPECIAL' }
            ];
            
            const $select = $('#modalTipoDeApoyoBono');
            $select.empty().append('<option value="">* SELECCIONE *</option>');
            
            tipos.forEach(tipo => {
                $select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
            });
            
            console.log('✅ Tipos de apoyo cargados');
        } catch (error) {
            console.error('❌ Error al cargar tipos de apoyo:', error);
        }
    },

    // Consultar
    consultar: function() {
        const periodo = $('#filtroPeriodoApoyoBono').val();
        const sede = $('#filtroSedeApoyoBono').val();
        const turno = $('#filtroTurnoApoyoBono').val();
        
        console.log('🔍 Consultando:', { periodo, sede, turno });
        
        // TODO: Implementar consulta con backend
        showNotification('Consulta aplicada', 'info');
    },

    // Nuevo
    nuevo: function() {
        this.modoEdicion = false;
        this.apoyoBonoIdEdicion = null;
        this.limpiarModal();
        
        // Establecer fecha actual
        const hoy = new Date().toISOString().split('T')[0];
        $('#modalFechaApoyoBono').val(hoy);
        
        $('#tituloModalApoyoBono').text('Nuevo Apoyo / Bono');
        
        const modal = new bootstrap.Modal(document.getElementById('modalApoyoBono'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#formApoyoBono')[0].reset();
        $('#trabajadorIdApoyoBono').val('');
        $('#conceptoIdApoyoBono').val('');
        $('#nombreCompletoApoyoBono').val('');
        $('#modalImporteApoyoBono').val('0.00');
        $('#radioApoyo').prop('checked', true);
        this.modoEdicion = false;
        this.apoyoBonoIdEdicion = null;
    },
    
    // Buscar concepto
    buscarConcepto: async function() {
        const busqueda = $('#buscarConceptoApoyoBono').val().trim();
        
        if (!busqueda) {
            showNotification('Ingrese un concepto para buscar', 'warning');
            return;
        }
        
        console.log('🔍 Buscando concepto:', busqueda);
        
        // TODO: Implementar búsqueda real
        showNotification('Funcionalidad de búsqueda en desarrollo', 'info');
    },
    
    // Buscar trabajador
    buscarTrabajador: async function() {
        const busqueda = $('#nroDocApoyoBono').val().trim();
        
        if (!busqueda) {
            showNotification('Ingrese un número de documento', 'warning');
            return;
        }
        
        console.log('🔍 Buscando trabajador:', busqueda);
        
        // TODO: Implementar búsqueda real
        showNotification('Funcionalidad de búsqueda en desarrollo', 'info');
    },
    
    // Guardar
    guardar: function() {
        const trabajadorId = $('#trabajadorIdApoyoBono').val();
        const conceptoId = $('#conceptoIdApoyoBono').val();
        const nroDoc = $('#nroDocApoyoBono').val().trim();
        
        if (!trabajadorId || !nroDoc) {
            showNotification('Debe buscar y seleccionar un trabajador', 'warning');
            return;
        }
        
        if (!conceptoId) {
            showNotification('Debe buscar y seleccionar un concepto', 'warning');
            return;
        }
        
        const datos = {
            trabajadorId: trabajadorId,
            conceptoId: conceptoId,
            tipo: $('input[name="tipoApoyoBono"]:checked').val(),
            fecha: $('#modalFechaApoyoBono').val(),
            tipoApoyo: $('#modalTipoDeApoyoBono').val(),
            importe: $('#modalImporteApoyoBono').val(),
            turno: $('#modalTurnoApoyoBono').val(),
            sede: $('#modalSedeApoyoBono').val()
        };
        
        console.log('💾 Guardando:', datos);
        
        // TODO: Implementar guardado real
        showNotification('Funcionalidad de guardado en desarrollo', 'info');
    },
    
    // Editar
    editar: function(id) {
        console.log('✏️ Editando apoyo/bono ID:', id);
        
        // TODO: Implementar edición
        showNotification('Funcionalidad de edición en desarrollo', 'info');
    },
    
    // Eliminar
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar este registro?')) {
            return;
        }
        
        console.log('🗑️ Eliminando apoyo/bono ID:', id);
        
        // TODO: Implementar eliminación
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo apoyo-bono.js cargado');
    
    if ($('#tablaApoyoBono').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        apoyoBono.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerApoyoBono = new MutationObserver(function(mutations) {
    if ($('#tablaApoyoBono').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerApoyoBono.disconnect();
        apoyoBono.init();
    }
});

if (document.querySelector('main')) {
    observerApoyoBono.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
