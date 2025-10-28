// Módulo de Feriados con DataTables
const feriados = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Feriados inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaFeriados')) {
            $('#tablaFeriados').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaFeriados').DataTable({
            ajax: {
                url: '/api/feriados',
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar datos:', error);
                    showNotification('Error al cargar los datos', 'danger');
                }
            },
            columns: [
                { 
                    data: 'id',
                    className: 'text-center',
                    width: '80px'
                },
                { 
                    data: 'fecha',
                    className: 'text-center',
                    width: '120px',
                    render: function(data) {
                        // Formatear fecha dd/mm/yyyy
                        const fecha = new Date(data + 'T00:00:00');
                        return fecha.toLocaleDateString('es-PE');
                    }
                },
                { 
                    data: 'dia',
                    className: 'text-center',
                    width: '120px'
                },
                { 
                    data: 'denominacion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 300px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    width: '150px',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar" onclick="feriados.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="feriados.eliminar(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros'
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            responsive: true,
            dom: 'lftip',
            order: [[1, 'asc']], // Ordenar por fecha
            initComplete: function() {
                console.log('✅ DataTable de Feriados inicializada');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-feriado').on('click', '.btn-nuevo-feriado', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-feriado').on('click', '.btn-actualizar-feriado', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '#btnGuardarFeriado').on('click', '#btnGuardarFeriado', function() {
            self.guardar();
        });
        
        // Evento para cambio de fecha - actualizar el día automáticamente
        $('#feriadoFecha').off('change').on('change', function() {
            self.actualizarDia();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalFeriado').on('hidden.bs.modal', function() {
            self.limpiarFormulario();
        });
    },

    // Actualizar el campo "Día" basado en la fecha seleccionada
    actualizarDia: function() {
        const fechaInput = $('#feriadoFecha').val();
        
        if (fechaInput) {
            const fecha = new Date(fechaInput + 'T00:00:00');
            const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const nombreDia = dias[fecha.getDay()];
            
            $('#feriadoDia').val(nombreDia);
        } else {
            $('#feriadoDia').val('');
        }
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nuevo feriado
    nuevo: function() {
        this.limpiarFormulario();
        $('#modalFeriadoTitle').html('<i class="fas fa-plus-circle me-2"></i>Agregar Nuevo Feriado');
        
        const modal = new bootstrap.Modal(document.getElementById('modalFeriado'));
        modal.show();
    },

    // Limpiar formulario
    limpiarFormulario: function() {
        $('#formFeriado')[0].reset();
        $('#feriadoId').val('');
        $('#feriadoDia').val('');
    },

    // Guardar feriado (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#feriadoId').val();
            const fecha = $('#feriadoFecha').val();
            const dia = $('#feriadoDia').val();
            const denominacion = $('#feriadoDenominacion').val().trim();

            // Validaciones
            if (!fecha || !denominacion) {
                showNotification('Por favor complete todos los campos requeridos', 'warning');
                return;
            }

            if (denominacion.length < 3) {
                showNotification('La denominación debe tener al menos 3 caracteres', 'warning');
                return;
            }

            const datos = { fecha, dia, denominacion };
            const url = id ? `/api/feriados/${id}` : '/api/feriados';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('#btnGuardarFeriado').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (result.success) {
                showNotification(
                    id ? 'Feriado actualizado exitosamente' : 'Feriado creado exitosamente',
                    'success'
                );

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalFeriado'));
                modal.hide();

                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al guardar feriado:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('#btnGuardarFeriado').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar feriado
    editar: async function(id) {
        try {
            const response = await fetch(`/api/feriados/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el feriado');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const feriado = result.data;
                
                $('#feriadoId').val(feriado.id);
                $('#feriadoFecha').val(feriado.fecha);
                $('#feriadoDia').val(feriado.dia);
                $('#feriadoDenominacion').val(feriado.denominacion);
                $('#modalFeriadoTitle').text('EDITAR FERIADO');

                const modal = new bootstrap.Modal(document.getElementById('modalFeriado'));
                modal.show();
            }

        } catch (error) {
            console.error('Error al editar feriado:', error);
            showNotification('Error al cargar el feriado: ' + error.message, 'danger');
        }
    },

    // Eliminar feriado
    eliminar: async function(id) {
        // Confirmación
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/feriados/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Feriado eliminado exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al eliminar feriado:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar este feriado?\n\nEsta acción no se puede deshacer.');
            resolve(confirmar);
        });
    }
};