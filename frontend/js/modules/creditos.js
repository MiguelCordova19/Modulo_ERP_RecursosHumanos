// Módulo de Créditos
const creditos = {
    tabla: null,
    empresaId: null,
    modoEdicion: false,
    creditoIdEdicion: null,
    creditosAgregados: [],
    paginaActual: 1,
    registrosPorPagina: 10,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Créditos inicializado');
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
        
        $('#filtroPeriodoCreditos').val(periodoActual);
        
        console.log('📅 Período establecido:', periodoActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaCreditos')) {
            $('#tablaCreditos').DataTable().destroy();
        }
        
        this.tabla = $('#tablaCreditos').DataTable({
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
                    data: 'linea_credito',
                    defaultContent: '-'
                },
                { 
                    data: 'consumo_total',
                    defaultContent: '0.00',
                    className: 'text-end',
                    render: function(data) {
                        return parseFloat(data || 0).toFixed(2);
                    }
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
                            <button class="btn btn-sm btn-warning btn-accion-creditos btn-editar-credito" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-creditos btn-eliminar-credito" 
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
            order: [[1, 'asc']], // Ordenar por número de documento
            drawCallback: function() {
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-editar-credito').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-credito').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $('#btnNuevoCredito').off('click').on('click', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $('#btnConsultarCreditos').off('click').on('click', function() {
            self.consultar();
        });
        
        // Botón Buscar Concepto
        $('#btnBuscarConceptoCredito').off('click').on('click', function() {
            self.buscarConcepto();
        });
        
        // Enter en buscar concepto
        $('#buscarConceptoCredito').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarConcepto();
            }
        });
        
        // Botón Buscar Trabajador
        $('#btnBuscarTrabajadorCredito').off('click').on('click', function() {
            self.buscarTrabajador();
        });
        
        // Enter en buscar trabajador
        $('#nroDocCredito').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                self.buscarTrabajador();
            }
        });
        
        // Botón Cargar Archivo
        $('#btnCargarArchivo').off('click').on('click', function() {
            self.cargarArchivo();
        });
        
        // Paginación
        $('#registrosPorPaginaCreditos').off('change').on('change', function() {
            self.registrosPorPagina = parseInt($(this).val());
            self.paginaActual = 1;
            self.renderizarTablaCreditos();
        });
        
        $('#btnAnteriorCreditos').off('click').on('click', function() {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.renderizarTablaCreditos();
            }
        });
        
        $('#btnSiguienteCreditos').off('click').on('click', function() {
            const totalPaginas = Math.ceil(self.creditosAgregados.length / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.renderizarTablaCreditos();
            }
        });
        
        // Botón Guardar
        $('#btnGuardarCredito').off('click').on('click', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalCredito').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Cargar combos
    cargarCombos: async function() {
        await this.cargarSedes();
        await this.cargarLineasCredito();
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
            
            const $select = $('#filtroSedeCreditos');
            $select.empty().append('<option value="">* TODOS *</option>');
            
            sedes.forEach(sede => {
                $select.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
            });
            
            console.log('✅ Sedes cargadas');
        } catch (error) {
            console.error('❌ Error al cargar sedes:', error);
        }
    },
    
    // Cargar Líneas de Crédito
    cargarLineasCredito: async function() {
        try {
            console.log('🔄 Cargando líneas de crédito');
            // TODO: Conectar con endpoint real
            const lineas = [
                { id: 1, descripcion: 'LÍNEA BÁSICA' },
                { id: 2, descripcion: 'LÍNEA PREMIUM' },
                { id: 3, descripcion: 'LÍNEA ESPECIAL' }
            ];
            
            const $select = $('#modalLineaCredito');
            $select.empty().append('<option value="">* Seleccione *</option>');
            
            lineas.forEach(linea => {
                $select.append(`<option value="${linea.id}">${linea.descripcion}</option>`);
            });
            
            console.log('✅ Líneas de crédito cargadas');
        } catch (error) {
            console.error('❌ Error al cargar líneas de crédito:', error);
        }
    },

    // Consultar
    consultar: function() {
        const periodo = $('#filtroPeriodoCreditos').val();
        const sede = $('#filtroSedeCreditos').val();
        
        console.log('🔍 Consultando:', { periodo, sede });
        
        // TODO: Implementar consulta con backend
        showNotification('Consulta aplicada', 'info');
    },

    // Nuevo
    nuevo: function() {
        this.modoEdicion = false;
        this.creditoIdEdicion = null;
        this.limpiarModal();
        
        // Establecer fecha y período actual
        const hoy = new Date();
        const fechaActual = hoy.toISOString().split('T')[0];
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const periodoActual = `${year}-${month}`;
        
        $('#modalFechaCredito').val(fechaActual);
        $('#modalPeriodoCredito').val(periodoActual);
        
        $('#tituloModalCredito').text('Nuevo Crédito');
        
        const modal = new bootstrap.Modal(document.getElementById('modalCredito'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#formCredito')[0].reset();
        $('#archivoCreditos').val('');
        this.creditosAgregados = [];
        this.paginaActual = 1;
        this.renderizarTablaCreditos();
        this.modoEdicion = false;
        this.creditoIdEdicion = null;
    },
    
    // Cargar archivo
    cargarArchivo: function() {
        const archivo = $('#archivoCreditos')[0].files[0];
        
        if (!archivo) {
            showNotification('Debe seleccionar un archivo', 'warning');
            return;
        }
        
        console.log('📁 Cargando archivo:', archivo.name);
        
        // TODO: Implementar lectura de archivo Excel/CSV
        // Por ahora, simular datos de ejemplo
        this.creditosAgregados = [
            {
                nroDoc: '12345678',
                nombreCompleto: 'JUAN PÉREZ GARCÍA',
                puesto: 'OPERARIO',
                sede: 'SEDE PRINCIPAL',
                lineaCredito: 'LÍNEA BÁSICA',
                consumoTotal: 500.00,
                saldo: 500.00
            },
            {
                nroDoc: '87654321',
                nombreCompleto: 'MARÍA LÓPEZ TORRES',
                puesto: 'SUPERVISOR',
                sede: 'SEDE SECUNDARIA',
                lineaCredito: 'LÍNEA PREMIUM',
                consumoTotal: 1000.00,
                saldo: 1000.00
            }
        ];
        
        this.renderizarTablaCreditos();
        showNotification('Archivo cargado exitosamente', 'success');
    },
    
    // Renderizar tabla de créditos
    renderizarTablaCreditos: function() {
        const tbody = $('#tbodyDetalleCreditos');
        tbody.empty();
        
        if (this.creditosAgregados.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="9" class="text-center text-muted">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            $('#infoRegistrosCreditos').text('Mostrando 0 a 0 de 0 registros');
            return;
        }
        
        // Calcular paginación
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = Math.min(inicio + this.registrosPorPagina, this.creditosAgregados.length);
        const creditosPagina = this.creditosAgregados.slice(inicio, fin);
        
        // Renderizar filas
        creditosPagina.forEach((credito, index) => {
            const numeroGlobal = inicio + index + 1;
            tbody.append(`
                <tr>
                    <td class="text-center">${numeroGlobal}</td>
                    <td class="text-center">${credito.nroDoc}</td>
                    <td>${credito.nombreCompleto}</td>
                    <td>${credito.puesto}</td>
                    <td>${credito.sede}</td>
                    <td>${credito.lineaCredito}</td>
                    <td class="text-end">${parseFloat(credito.consumoTotal).toFixed(2)}</td>
                    <td class="text-end">${parseFloat(credito.saldo).toFixed(2)}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger btn-eliminar-credito-modal" 
                                data-index="${inicio + index}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
        
        // Actualizar info de registros
        $('#infoRegistrosCreditos').text(`Mostrando ${inicio + 1} a ${fin} de ${this.creditosAgregados.length} registros`);
        
        // Configurar eventos de eliminación
        this.configurarEventosTablaModal();
    },
    
    // Configurar eventos de la tabla del modal
    configurarEventosTablaModal: function() {
        const self = this;
        
        $('.btn-eliminar-credito-modal').off('click').on('click', function() {
            const index = $(this).data('index');
            self.creditosAgregados.splice(index, 1);
            self.renderizarTablaCreditos();
            showNotification('Registro eliminado', 'info');
        });
    },
    
    // Buscar concepto
    buscarConcepto: async function() {
        const busqueda = $('#buscarConceptoCredito').val().trim();
        
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
        const busqueda = $('#nroDocCredito').val().trim();
        
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
        const trabajadorId = $('#trabajadorIdCredito').val();
        const conceptoId = $('#conceptoIdCredito').val();
        const nroDoc = $('#nroDocCredito').val().trim();
        
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
            lineaCredito: $('#modalLineaCredito').val(),
            monto: $('#modalMontoCredito').val(),
            observacion: $('#modalObservacionCredito').val()
        };
        
        console.log('💾 Guardando:', datos);
        
        // TODO: Implementar guardado real
        showNotification('Funcionalidad de guardado en desarrollo', 'info');
    },
    
    // Editar
    editar: function(id) {
        console.log('✏️ Editando crédito ID:', id);
        
        // TODO: Implementar edición
        showNotification('Funcionalidad de edición en desarrollo', 'info');
    },
    
    // Eliminar
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar este crédito?')) {
            return;
        }
        
        console.log('🗑️ Eliminando crédito ID:', id);
        
        // TODO: Implementar eliminación
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo creditos.js cargado');
    
    if ($('#tablaCreditos').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        creditos.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerCreditos = new MutationObserver(function(mutations) {
    if ($('#tablaCreditos').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerCreditos.disconnect();
        creditos.init();
    }
});

if (document.querySelector('main')) {
    observerCreditos.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
