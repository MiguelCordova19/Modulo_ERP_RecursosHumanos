// Módulo de Motivo Préstamo con DataTables
const motivoPrestamo = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Motivo Préstamo inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable con filtros en columnas
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaMotivos')) {
            $('#tablaMotivos').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaMotivos').DataTable({
            ajax: {
                url: '/api/motivos-prestamo',
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
                    data: 'descripcion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 400px;" title="${data}">${data}</div>`;
                    }
                },
                { 
                    data: 'estado',
                    className: 'text-center',
                    width: '120px',
                    render: function(data, type, row) {
                        const badge = data === 1 
                            ? '<span class="badge bg-success badge-estado">Activo</span>'
                            : '<span class="badge bg-danger badge-estado">Inactivo</span>';
                        return badge;
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
                            <button class="btn btn-action btn-editar" onclick="motivoPrestamo.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="motivoPrestamo.eliminar(${row.id})" title="Eliminar">
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
            order: [[0, 'asc']],
            initComplete: function() {
                // Agregar filtros en cada columna
                this.api().columns([0, 1, 2]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    // Crear input de búsqueda
                    const input = $('<input type="text" placeholder="Filtrar ' + title + '" />')
                        .appendTo($(column.header()))
                        .on('click', function(e) {
                            e.stopPropagation();
                        })
                        .on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
                
                console.log('✅ DataTable inicializada con filtros');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-motivo').on('click', '.btn-nuevo-motivo', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-motivo').on('click', '.btn-actualizar-motivo', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '.btn-guardar-motivo').on('click', '.btn-guardar-motivo', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalMotivo').on('hidden.bs.modal', function() {
            $('#formMotivo')[0].reset();
            $('#motivoId').val('');
        });
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nuevo motivo
    nuevo: function() {
        $('#formMotivo')[0].reset();
        $('#motivoId').val('');
        $('#modalMotivoTitle').html('<i class="fas fa-plus-circle me-2"></i>Nuevo Motivo de Préstamo');
        
        const modal = new bootstrap.Modal(document.getElementById('modalMotivo'));
        modal.show();
    },

    // Guardar motivo (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#motivoId').val();
            const codigo = $('#motivoCodigo').val().trim();
            const descripcion = $('#motivoDescripcion').val().trim();
            const estado = parseInt($('#motivoEstado').val());

            // Validaciones
            if (!codigo || !descripcion) {
                showNotification('Por favor complete todos los campos requeridos', 'warning');
                return;
            }

            if (codigo.length < 2) {
                showNotification('El código debe tener al menos 2 caracteres', 'warning');
                return;
            }

            if (descripcion.length < 5) {
                showNotification('La descripción debe tener al menos 5 caracteres', 'warning');
                return;
            }

            const datos = { codigo, descripcion, estado };
            const url = id ? `/api/motivos-prestamo/${id}` : '/api/motivos-prestamo';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-motivo').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                    id ? 'Motivo actualizado exitosamente' : 'Motivo creado exitosamente',
                    'success'
                );

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMotivo'));
                modal.hide();

                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al guardar motivo:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-motivo').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar motivo
    editar: async function(id) {
        try {
            const response = await fetch(`/api/motivos-prestamo/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el motivo');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const motivo = result.data;
                
                $('#motivoId').val(motivo.id);
                $('#motivoCodigo').val(motivo.codigo);
                $('#motivoDescripcion').val(motivo.descripcion);
                $('#motivoEstado').val(motivo.estado);
                $('#modalMotivoTitle').html('<i class="fas fa-edit me-2"></i>Editar Motivo de Préstamo');

                const modal = new bootstrap.Modal(document.getElementById('modalMotivo'));
                modal.show();
            }

        } catch (error) {
            console.error('Error al editar motivo:', error);
            showNotification('Error al cargar el motivo: ' + error.message, 'danger');
        }
    },

    // Eliminar motivo
    eliminar: async function(id) {
        // Confirmación con SweetAlert si está disponible, sino con confirm nativo
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/motivos-prestamo/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Motivo eliminado exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al eliminar motivo:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar este motivo de préstamo?\n\nEsta acción cambiará el estado a Inactivo.');
            resolve(confirmar);
        });
    }
};

// Exportar para uso global
window.motivoPrestamo = motivoPrestamo;