// Módulo de Préstamos
const prestamos = {
    tabla: null,
    empresaId: null,
    modoEdicion: false,
    prestamoIdEdicion: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Préstamos inicializado');
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
        
        $('#filtroPeriodoPrestamos').val(periodoActual);
        
        console.log('📅 Período establecido:', periodoActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaPrestamos')) {
            $('#tablaPrestamos').DataTable().destroy();
        }
        
        this.tabla = $('#tablaPrestamos').DataTable({
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
                    data: 'sede',
                    defaultContent: '-'
                },
                { 
                    data: 'motivo',
                    defaultContent: '-'
                },
                { 
                    data: 'prestamo',
                    defaultContent: '0.00',
                    className: 'text-end',
                    render: function(data) {
                        return parseFloat(data || 0).toFixed(2);
                    }
                },
                { 
                    data: 'cuotas',
                    defaultContent: '0',
                    className: 'text-center'
                },
                { 
                    data: 'saldo',
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
                            <button class="btn btn-sm btn-warning btn-accion-prestamos btn-editar-prestamo" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-prestamos btn-eliminar-prestamo" 
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
        
        $('.btn-editar-prestamo').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-prestamo').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $('#btnNuevoPrestamo').off('click').on('click', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $('#btnConsultarPrestamos').off('click').on('click', function() {
            self.consultar();
        });
        
        // Botón Buscar Concepto
        $('#btnBuscarConceptoPrestamo').off('click').on('click', function() {
            self.buscarConcepto();
        });
        
        // Enter en buscar concepto
        $('#buscarConceptoPrestamo').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarConcepto();
            }
        });
        
        // Botón Buscar Trabajador
        $('#btnBuscarTrabajadorPrestamo').off('click').on('click', function() {
            self.buscarTrabajador();
        });
        
        // Enter en buscar trabajador
        $('#nroDocPrestamo').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarTrabajador();
            }
        });
        
        // Calcular cuota aproximada al cambiar monto o cuotas
        $('#modalMontoPrestamo, #modalCuotasPrestamo').off('change').on('change', function() {
            self.calcularCuotaAprox();
        });
        
        // Botón Generar Cronograma
        $('#btnGenerarCronograma').off('click').on('click', function() {
            self.generarCronograma();
        });
        
        // Botón Guardar
        $('#btnGuardarPrestamo').off('click').on('click', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalPrestamo').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Cargar combos
    cargarCombos: async function() {
        await this.cargarSedes();
        await this.cargarMotivos();
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
            
            const $select = $('#filtroSedePrestamos');
            $select.empty().append('<option value="">* TODOS *</option>');
            
            sedes.forEach(sede => {
                $select.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
            });
            
            console.log('✅ Sedes cargadas');
        } catch (error) {
            console.error('❌ Error al cargar sedes:', error);
        }
    },
    
    // Cargar Motivos
    cargarMotivos: async function() {
        try {
            console.log('🔄 Cargando motivos de préstamo');
            // TODO: Conectar con endpoint real de motivo-prestamo
            const motivos = [
                { id: 1, descripcion: 'PERSONAL' },
                { id: 2, descripcion: 'EMERGENCIA' },
                { id: 3, descripcion: 'EDUCACIÓN' },
                { id: 4, descripcion: 'SALUD' }
            ];
            
            const $select = $('#modalMotivoPrestamo');
            $select.empty().append('<option value="">* Seleccione *</option>');
            
            motivos.forEach(motivo => {
                $select.append(`<option value="${motivo.id}">${motivo.descripcion}</option>`);
            });
            
            console.log('✅ Motivos cargados');
        } catch (error) {
            console.error('❌ Error al cargar motivos:', error);
        }
    },

    // Consultar
    consultar: function() {
        const periodo = $('#filtroPeriodoPrestamos').val();
        const sede = $('#filtroSedePrestamos').val();
        
        console.log('🔍 Consultando:', { periodo, sede });
        
        // TODO: Implementar consulta con backend
        showNotification('Consulta aplicada', 'info');
    },

    // Nuevo
    nuevo: function() {
        this.modoEdicion = false;
        this.prestamoIdEdicion = null;
        this.limpiarModal();
        
        // Establecer fecha actual
        const hoy = new Date().toISOString().split('T')[0];
        $('#modalFechaPrestamo').val(hoy);
        
        $('#tituloModalPrestamo').text('Nuevo Préstamo');
        
        const modal = new bootstrap.Modal(document.getElementById('modalPrestamo'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#formPrestamo')[0].reset();
        $('#trabajadorIdPrestamo').val('');
        $('#conceptoIdPrestamo').val('');
        $('#nombreCompletoPrestamo').val('');
        $('#sedePrestamo').val('');
        $('#modalMontoPrestamo').val('');
        $('#modalCuotasPrestamo').val('');
        $('#cuotaAproxPrestamo').val('0.00');
        $('#tbodyDetalleCuotas').html(`
            <tr>
                <td colspan="5" class="text-center text-muted">
                    No hay cuotas generadas
                </td>
            </tr>
        `);
        this.modoEdicion = false;
        this.prestamoIdEdicion = null;
    },
    
    // Calcular cuota aproximada
    calcularCuotaAprox: function() {
        const monto = parseFloat($('#modalMontoPrestamo').val()) || 0;
        const cuotas = parseInt($('#modalCuotasPrestamo').val()) || 0;
        
        if (monto > 0 && cuotas > 0) {
            const cuotaAprox = monto / cuotas;
            $('#cuotaAproxPrestamo').val(cuotaAprox.toFixed(2));
        } else {
            $('#cuotaAproxPrestamo').val('0.00');
        }
    },
    
    // Generar cronograma de cuotas
    generarCronograma: function() {
        const trabajadorId = $('#trabajadorIdPrestamo').val();
        const monto = parseFloat($('#modalMontoPrestamo').val()) || 0;
        const cuotas = parseInt($('#modalCuotasPrestamo').val()) || 0;
        const fecha = $('#modalFechaPrestamo').val();
        
        // Validaciones
        if (!trabajadorId) {
            showNotification('Debe seleccionar un trabajador', 'warning');
            return;
        }
        
        if (!fecha) {
            showNotification('Debe seleccionar una fecha', 'warning');
            return;
        }
        
        if (monto <= 0) {
            showNotification('El monto del préstamo debe ser mayor a 0', 'warning');
            return;
        }
        
        if (cuotas <= 0) {
            showNotification('Debe seleccionar el número de cuotas', 'warning');
            return;
        }
        
        // Calcular cuota mensual
        const cuotaMensual = monto / cuotas;
        
        // Generar tabla de cuotas
        const tbody = $('#tbodyDetalleCuotas');
        tbody.empty();
        
        let saldoRestante = monto;
        const fechaInicio = new Date(fecha);
        
        for (let i = 1; i <= cuotas; i++) {
            // Calcular fecha de pago (agregar i meses)
            const fechaPago = new Date(fechaInicio);
            fechaPago.setMonth(fechaPago.getMonth() + i);
            const fechaPagoStr = fechaPago.toISOString().split('T')[0];
            
            // Calcular monto de la cuota (última cuota ajusta el saldo)
            const montoCuota = i === cuotas ? saldoRestante : cuotaMensual;
            saldoRestante -= montoCuota;
            
            // Generar fila
            tbody.append(`
                <tr>
                    <td class="text-center">${i}</td>
                    <td class="text-center">
                        <input type="date" class="form-control form-control-sm" 
                               value="${fechaPagoStr}" data-cuota="${i}">
                    </td>
                    <td class="text-center">
                        <input type="month" class="form-control form-control-sm" 
                               placeholder="YYYY-MM" data-cuota="${i}">
                    </td>
                    <td class="text-end">${montoCuota.toFixed(2)}</td>
                    <td class="text-end">${Math.max(0, saldoRestante).toFixed(2)}</td>
                </tr>
            `);
        }
        
        showNotification(`Cronograma de ${cuotas} cuotas generado exitosamente`, 'success');
    },
    
    // Buscar concepto
    buscarConcepto: async function() {
        const busqueda = $('#buscarConceptoPrestamo').val().trim();
        
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
        const busqueda = $('#nroDocPrestamo').val().trim();
        
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
        const trabajadorId = $('#trabajadorIdPrestamo').val();
        const conceptoId = $('#conceptoIdPrestamo').val();
        const nroDoc = $('#nroDocPrestamo').val().trim();
        
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
            fecha: $('#modalFechaPrestamo').val(),
            motivo: $('#modalMotivoPrestamo').val(),
            monto: $('#modalMontoPrestamo').val(),
            cuotas: $('#modalCuotasPrestamo').val(),
            observacion: $('#modalObservacionPrestamo').val()
        };
        
        console.log('💾 Guardando:', datos);
        
        // TODO: Implementar guardado real
        showNotification('Funcionalidad de guardado en desarrollo', 'info');
    },
    
    // Editar
    editar: function(id) {
        console.log('✏️ Editando préstamo ID:', id);
        
        // TODO: Implementar edición
        showNotification('Funcionalidad de edición en desarrollo', 'info');
    },
    
    // Eliminar
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar este préstamo?')) {
            return;
        }
        
        console.log('🗑️ Eliminando préstamo ID:', id);
        
        // TODO: Implementar eliminación
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo prestamos.js cargado');
    
    if ($('#tablaPrestamos').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        prestamos.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerPrestamos = new MutationObserver(function(mutations) {
    if ($('#tablaPrestamos').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerPrestamos.disconnect();
        prestamos.init();
    }
});

if (document.querySelector('main')) {
    observerPrestamos.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
