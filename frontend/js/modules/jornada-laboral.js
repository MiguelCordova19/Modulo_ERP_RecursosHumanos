// Módulo de Jornada Laboral
const jornadaLaboral = {
    tabla: null,
    empresaId: null,
    modoEdicion: false,
    jornadaIdEdicion: null,
    trabajadoresJornada: [],
    paginaActual: 1,
    registrosPorPagina: 10,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Jornada Laboral inicializado');
        this.empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        console.log('🏢 Empresa ID:', this.empresaId);
        this.configurarEventos();
        this.inicializarTabla();
        this.cargarCombos();
        this.establecerAnioActual();
    },
    
    // Establecer año actual
    establecerAnioActual: function() {
        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        
        // Llenar selector de años (últimos 5 años y próximos 2)
        const $selectAnio = $('#filtroAnioJornada');
        $selectAnio.empty().append('<option value="">Todos</option>');
        
        for (let i = anioActual - 5; i <= anioActual + 2; i++) {
            const selected = i === anioActual ? 'selected' : '';
            $selectAnio.append(`<option value="${i}" ${selected}>${i}</option>`);
        }
        
        console.log('📅 Año establecido:', anioActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaJornadaLaboral')) {
            $('#tablaJornadaLaboral').DataTable().destroy();
        }
        
        this.tabla = $('#tablaJornadaLaboral').DataTable({
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
                    data: 'sede',
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
                    data: 'registrado_por',
                    defaultContent: '-'
                },
                { 
                    data: 'fecha_registro',
                    defaultContent: '-',
                    className: 'text-center'
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-warning btn-accion-jornada btn-editar-jornada" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-jornada btn-eliminar-jornada" 
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
            order: [[2, 'desc']], // Ordenar por fecha desde
            drawCallback: function() {
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-editar-jornada').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-jornada').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $('#btnNuevaJornada').off('click').on('click', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $('#btnConsultarJornada').off('click').on('click', function() {
            self.consultar();
        });
        
        // Botón Consultar en Modal
        $('#btnConsultarModalJornada').off('click').on('click', function() {
            self.consultarModalJornada();
        });
        
        // Paginación
        $('#registrosPorPaginaJornada').off('change').on('change', function() {
            self.registrosPorPagina = parseInt($(this).val());
            self.paginaActual = 1;
            self.renderizarTablaJornada();
        });
        
        $('#btnAnteriorJornada').off('click').on('click', function() {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.renderizarTablaJornada();
            }
        });
        
        $('#btnSiguienteJornada').off('click').on('click', function() {
            const totalPaginas = Math.ceil(self.trabajadoresJornada.length / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.renderizarTablaJornada();
            }
        });
        
        // Botón Guardar
        $('#btnGuardarJornada').off('click').on('click', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalJornadaLaboral').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Cargar combos
    cargarCombos: async function() {
        await this.cargarSedes();
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
            
            const $selectFiltro = $('#filtroSedeJornada');
            const $selectModal = $('#modalSedeJornada');
            
            $selectFiltro.empty().append('<option value="">Todas</option>');
            $selectModal.empty().append('<option value="">* Seleccione *</option>');
            
            sedes.forEach(sede => {
                $selectFiltro.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
                $selectModal.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
            });
            
            console.log('✅ Sedes cargadas');
        } catch (error) {
            console.error('❌ Error al cargar sedes:', error);
        }
    },

    // Consultar
    consultar: function() {
        const sede = $('#filtroSedeJornada').val();
        const anio = $('#filtroAnioJornada').val();
        const mes = $('#filtroMesJornada').val();
        
        console.log('🔍 Consultando:', { sede, anio, mes });
        
        // TODO: Implementar consulta con backend
        showNotification('Consulta aplicada', 'info');
    },

    // Nuevo
    nuevo: function() {
        this.modoEdicion = false;
        this.jornadaIdEdicion = null;
        this.limpiarModal();
        
        $('#tituloModalJornada').text('Nueva Jornada Laboral');
        
        const modal = new bootstrap.Modal(document.getElementById('modalJornadaLaboral'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#formJornadaLaboral')[0].reset();
        this.trabajadoresJornada = [];
        this.paginaActual = 1;
        this.renderizarTablaJornada();
        this.modoEdicion = false;
        this.jornadaIdEdicion = null;
    },
    
    // Consultar en modal
    consultarModalJornada: function() {
        const sede = $('#modalSedeJornada').val();
        const fechaDesde = $('#modalFechaDesdeJornada').val();
        const fechaHasta = $('#modalFechaHastaJornada').val();
        
        if (!sede) {
            showNotification('Debe seleccionar una sede', 'warning');
            return;
        }
        
        if (!fechaDesde || !fechaHasta) {
            showNotification('Debe seleccionar las fechas', 'warning');
            return;
        }
        
        console.log('🔍 Consultando jornada:', { sede, fechaDesde, fechaHasta });
        
        // TODO: Implementar consulta real con backend
        // Por ahora, simular datos de ejemplo
        this.trabajadoresJornada = [
            {
                fIngreso: '01/01/2024',
                nombreCompleto: 'JUAN PÉREZ GARCÍA',
                turno: 'MAÑANA',
                horaLab: 8,
                diaLab: 26,
                dNoLab: 0,
                diaSub: 0,
                dNoSub: 0,
                diaDesc: 4,
                cDDesc: 0,
                diaVac: 0,
                diaFer: 0,
                dTFer: 0,
                horaTrab: 208,
                tardMin: 0,
                diaTotal: 30,
                diasValidar: 26,
                validado: 'SI'
            },
            {
                fIngreso: '15/02/2024',
                nombreCompleto: 'MARÍA LÓPEZ TORRES',
                turno: 'TARDE',
                horaLab: 8,
                diaLab: 26,
                dNoLab: 0,
                diaSub: 0,
                dNoSub: 0,
                diaDesc: 4,
                cDDesc: 0,
                diaVac: 0,
                diaFer: 0,
                dTFer: 0,
                horaTrab: 208,
                tardMin: 0,
                diaTotal: 30,
                diasValidar: 26,
                validado: 'SI'
            }
        ];
        
        this.renderizarTablaJornada();
        showNotification('Datos cargados exitosamente', 'success');
    },
    
    // Renderizar tabla de jornada
    renderizarTablaJornada: function() {
        const tbody = $('#tbodyJornadaLaboral');
        tbody.empty();
        
        if (this.trabajadoresJornada.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="19" class="text-center text-muted">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            $('#infoRegistrosJornada').text('Mostrando 0 a 0 de 0 registros');
            return;
        }
        
        // Calcular paginación
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = Math.min(inicio + this.registrosPorPagina, this.trabajadoresJornada.length);
        const trabajadoresPagina = this.trabajadoresJornada.slice(inicio, fin);
        
        // Renderizar filas
        trabajadoresPagina.forEach((trabajador, index) => {
            const numeroGlobal = inicio + index + 1;
            tbody.append(`
                <tr>
                    <td class="text-center">${numeroGlobal}</td>
                    <td class="text-center">${trabajador.fIngreso}</td>
                    <td>${trabajador.nombreCompleto}</td>
                    <td class="text-center">${trabajador.turno}</td>
                    <td class="text-center">${trabajador.horaLab}</td>
                    <td class="text-center">${trabajador.diaLab}</td>
                    <td class="text-center">${trabajador.dNoLab}</td>
                    <td class="text-center">${trabajador.diaSub}</td>
                    <td class="text-center">${trabajador.dNoSub}</td>
                    <td class="text-center">${trabajador.diaDesc}</td>
                    <td class="text-center">${trabajador.cDDesc}</td>
                    <td class="text-center">${trabajador.diaVac}</td>
                    <td class="text-center">${trabajador.diaFer}</td>
                    <td class="text-center">${trabajador.dTFer}</td>
                    <td class="text-center">${trabajador.horaTrab}</td>
                    <td class="text-center">${trabajador.tardMin}</td>
                    <td class="text-center">${trabajador.diaTotal}</td>
                    <td class="text-center">${trabajador.diasValidar}</td>
                    <td class="text-center">${trabajador.validado}</td>
                </tr>
            `);
        });
        
        // Actualizar info de registros
        $('#infoRegistrosJornada').text(`Mostrando ${inicio + 1} a ${fin} de ${this.trabajadoresJornada.length} registros`);
    },
    
    // Guardar
    guardar: function() {
        if (!$('#formJornadaLaboral')[0].checkValidity()) {
            $('#formJornadaLaboral')[0].reportValidity();
            return;
        }
        
        const sede = $('#modalSedeJornada').val();
        const fechaDesde = $('#modalFechaDesdeJornada').val();
        const fechaHasta = $('#modalFechaHastaJornada').val();
        
        if (!sede) {
            showNotification('Debe seleccionar una sede', 'warning');
            return;
        }
        
        if (!fechaDesde || !fechaHasta) {
            showNotification('Debe seleccionar las fechas', 'warning');
            return;
        }
        
        // Validar que fecha hasta sea mayor o igual a fecha desde
        if (new Date(fechaHasta) < new Date(fechaDesde)) {
            showNotification('La fecha hasta debe ser mayor o igual a la fecha desde', 'warning');
            return;
        }
        
        const datos = {
            sede: sede,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            observacion: $('#modalObservacionJornada').val(),
            empresaId: this.empresaId,
            usuarioId: parseInt(localStorage.getItem('usuario_id')) || 1
        };
        
        console.log('💾 Guardando:', datos);
        
        // TODO: Implementar guardado real
        showNotification('Funcionalidad de guardado en desarrollo', 'info');
    },
    
    // Editar
    editar: function(id) {
        console.log('✏️ Editando jornada laboral ID:', id);
        
        // TODO: Implementar edición
        showNotification('Funcionalidad de edición en desarrollo', 'info');
    },
    
    // Eliminar
    eliminar: function(id) {
        if (!confirm('¿Está seguro de eliminar esta jornada laboral?')) {
            return;
        }
        
        console.log('🗑️ Eliminando jornada laboral ID:', id);
        
        // TODO: Implementar eliminación
        showNotification('Funcionalidad de eliminación en desarrollo', 'info');
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo jornada-laboral.js cargado');
    
    if ($('#tablaJornadaLaboral').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        jornadaLaboral.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerJornadaLaboral = new MutationObserver(function(mutations) {
    if ($('#tablaJornadaLaboral').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerJornadaLaboral.disconnect();
        jornadaLaboral.init();
    }
});

if (document.querySelector('main')) {
    observerJornadaLaboral.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
