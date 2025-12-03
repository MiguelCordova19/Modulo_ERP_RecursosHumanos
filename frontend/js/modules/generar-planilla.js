// Módulo de Generar Planilla
const generarPlanilla = {
    tabla: null,
    empresaId: null,

    init: function() {
        console.log('✅ Módulo Generar Planilla inicializado');
        this.empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        this.configurarEventos();
        this.inicializarTabla();
        this.cargarCombos();
        this.establecerAnioActual();
    },
    
    establecerAnioActual: function() {
        const anioActual = new Date().getFullYear();
        const $selectAnio = $('#filtroAnioPlanilla, #modalAnioPlanilla');
        $selectAnio.empty();
        
        for (let i = anioActual - 2; i <= anioActual + 2; i++) {
            const selected = i === anioActual ? 'selected' : '';
            $selectAnio.append(`<option value="${i}" ${selected}>${i}</option>`);
        }
    },
    
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaGenerarPlanilla')) {
            $('#tablaGenerarPlanilla').DataTable().destroy();
        }
        
        this.tabla = $('#tablaGenerarPlanilla').DataTable({
            data: [],
            columns: [
                { data: null, render: (data, type, row, meta) => meta.row + 1, className: 'text-center' },
                { data: 'sede', defaultContent: '-' },
                { data: 'correlativo', defaultContent: '-' },
                { data: 'fecha', defaultContent: '-', className: 'text-center' },
                { data: 'tipo', defaultContent: '-', className: 'text-center' },
                { data: 'periodicidad', defaultContent: '-' },
                { data: 'fecha_desde', defaultContent: '-', className: 'text-center' },
                { data: 'fecha_hasta', defaultContent: '-', className: 'text-center' },
                { data: 'dias', defaultContent: '0', className: 'text-center' },
                { 
                    data: 'neto_pagar', 
                    defaultContent: '0.00', 
                    className: 'text-end',
                    render: data => parseFloat(data || 0).toFixed(2)
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-info btn-accion-planilla btn-ver-planilla" 
                                data-id="${row.id}" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-accion-planilla btn-eliminar-planilla" 
                                data-id="${row.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    `
                }
            ],
            language: {
                emptyTable: "No hay datos disponibles",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                lengthMenu: "Mostrar _MENU_ registros",
                search: "Buscar:",
                paginate: { first: "Primero", last: "Último", next: "Siguiente", previous: "Anterior" }
            },
            pageLength: 10,
            order: [[3, 'desc']],
            drawCallback: () => self.configurarEventosTabla()
        });
    },
    
    configurarEventosTabla: function() {
        const self = this;
        $('.btn-ver-planilla').off('click').on('click', function() {
            self.verPlanilla($(this).data('id'));
        });
        $('.btn-eliminar-planilla').off('click').on('click', function() {
            self.eliminar($(this).data('id'));
        });
    },

    configurarEventos: function() {
        const self = this;
        $('#btnNuevaPlanilla').off('click').on('click', () => self.nuevo());
        $('#btnConsultarPlanilla').off('click').on('click', () => self.consultar());
        $('#btnGuardarPlanilla').off('click').on('click', () => self.guardar());
        $('#modalGenerarPlanilla').on('hidden.bs.modal', () => self.limpiarModal());
    },

    cargarCombos: async function() {
        await this.cargarSedes();
        await this.cargarTiposPlanilla();
    },
    
    cargarSedes: async function() {
        try {
            const sedes = [
                { id: 1, descripcion: 'SEDE PRINCIPAL' },
                { id: 2, descripcion: 'SEDE SECUNDARIA' }
            ];
            
            const $selectFiltro = $('#filtroSedePlanilla');
            const $selectModal = $('#modalSedePlanilla');
            
            $selectFiltro.empty().append('<option value="">Todos</option>');
            $selectModal.empty().append('<option value="">* Seleccione *</option>');
            
            sedes.forEach(sede => {
                $selectFiltro.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                $selectModal.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
            });
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },
    
    cargarTiposPlanilla: async function() {
        try {
            const tipos = [
                { id: 1, descripcion: 'MENSUAL' },
                { id: 2, descripcion: 'QUINCENAL' },
                { id: 3, descripcion: 'SEMANAL' }
            ];
            
            const $selectFiltro = $('#filtroPlanilla');
            const $selectModal = $('#modalTipoPlanilla');
            
            $selectFiltro.empty().append('<option value="">Todos</option>');
            $selectModal.empty().append('<option value="">* Seleccione *</option>');
            
            tipos.forEach(tipo => {
                $selectFiltro.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
                $selectModal.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
            });
        } catch (error) {
            console.error('Error al cargar tipos de planilla:', error);
        }
    },

    consultar: function() {
        console.log('🔍 Consultando planillas');
        showNotification('Consulta aplicada', 'info');
    },

    nuevo: function() {
        // Navegar a la página de registro de planilla
        if (typeof loadModuleContent === 'function') {
            loadModuleContent('registro-planilla', 'Registro de Planilla');
        } else {
            console.error('❌ Función loadModuleContent no encontrada');
            showNotification('Error al cargar el módulo', 'danger');
        }
    },
    
    limpiarModal: function() {
        $('#formGenerarPlanilla')[0].reset();
    },
    
    guardar: function() {
        if (!$('#formGenerarPlanilla')[0].checkValidity()) {
            $('#formGenerarPlanilla')[0].reportValidity();
            return;
        }
        
        const datos = {
            sede: $('#modalSedePlanilla').val(),
            planilla: $('#modalTipoPlanilla').val(),
            anio: $('#modalAnioPlanilla').val(),
            mes: $('#modalMesPlanilla').val(),
            fechaDesde: $('#modalFechaDesdePlanilla').val(),
            fechaHasta: $('#modalFechaHastaPlanilla').val(),
            observacion: $('#modalObservacionPlanilla').val()
        };
        
        console.log('💾 Guardando planilla:', datos);
        showNotification('Funcionalidad en desarrollo', 'info');
    },
    
    verPlanilla: function(id) {
        console.log('👁️ Ver planilla ID:', id);
        showNotification('Funcionalidad en desarrollo', 'info');
    },
    
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar esta planilla?')) return;
        console.log('🗑️ Eliminando planilla ID:', id);
        showNotification('Funcionalidad en desarrollo', 'info');
    }
};

$(document).ready(function() {
    if ($('#tablaGenerarPlanilla').length > 0) {
        generarPlanilla.init();
    }
});

const observerGenerarPlanilla = new MutationObserver(function() {
    if ($('#tablaGenerarPlanilla').length > 0) {
        observerGenerarPlanilla.disconnect();
        generarPlanilla.init();
    }
});

if (document.querySelector('main')) {
    observerGenerarPlanilla.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
