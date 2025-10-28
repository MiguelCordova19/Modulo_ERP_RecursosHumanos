// Módulo de Sede con DataTables
const sede = {
    table: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Sede inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable con filtros en columnas
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaSedes')) {
            $('#tablaSedes').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaSedes').DataTable({
            ajax: {
                url: '/api/sedes',
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
                    data: 'codigo',
                    className: 'text-center fw-bold',
                    width: '100px',
                    render: function(data, type, row) {
                        return `<div title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'descripcion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 400px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    width: '120px',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar" onclick="sede.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="sede.eliminar(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar sede...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ registros'
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            responsive: true,
            dom: 'lftip',
            order: [[0, 'asc']],
            initComplete: function() {
                // Agregar filtros en cada columna
                this.api().columns([0, 1]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    // Crear input de búsqueda
                    const input = $(`<input type="text" placeholder="Filtrar ${title}" />`)
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
                
                console.log('✅ DataTable de sedes inicializada');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nueva-sede').on('click', '.btn-nueva-sede', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-sede').on('click', '.btn-actualizar-sede', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '.btn-guardar-sede').on('click', '.btn-guardar-sede', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalSede').on('hidden.bs.modal', function() {
            $('#formSede')[0].reset();
            $('#sedeId').val('');
        });
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nueva sede
    nuevo: function() {
        $('#formSede')[0].reset();
        $('#sedeId').val('');
        $('#modalSedeTitle').text('Registrar Sede');
        
        const modal = new bootstrap.Modal(document.getElementById('modalSede'));
        modal.show();
    },

    // Guardar sede (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#sedeId').val();
            const codigo = $('#sedeCodigo').val().trim().toUpperCase();
            const descripcion = $('#sedeDescripcion').val().trim();
            
            // Validaciones
            if (!codigo || !descripcion) {
                showNotification('Por favor complete todos los campos requeridos', 'warning');
                return;
            }

            if (codigo.length < 2) {
                showNotification('El código debe tener al menos 2 caracteres', 'warning');
                return;
            }

            if (descripcion.length < 3) {
                showNotification('La descripción debe tener al menos 3 caracteres', 'warning');
                return;
            }

            const datos = { codigo, descripcion };
            const url = id ? `/api/sedes/${id}` : '/api/sedes';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-sede').prop('disabled', true).html('Guardando...');

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
                    id ? 'Sede actualizada exitosamente' : 'Sede creada exitosamente',
                    'success'
                );
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalSede'));
                modal.hide();
                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar sede:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-sede').prop('disabled', false).html('Guardar');
        }
    },

    // Editar sede
    editar: async function(id) {
        try {
            const response = await fetch(`/api/sedes/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener la sede');
            }

            const result = await response.json();
            if (result.success && result.data) {
                const sede = result.data;
                
                $('#sedeId').val(sede.id);
                $('#sedeCodigo').val(sede.codigo);
                $('#sedeDescripcion').val(sede.descripcion);
                $('#modalSedeTitle').text('Editar Sede');
                
                const modal = new bootstrap.Modal(document.getElementById('modalSede'));
                modal.show();
            }
        } catch (error) {
            console.error('Error al editar sede:', error);
            showNotification('Error al cargar la sede: ' + error.message, 'danger');
        }
    },

    // Eliminar sede
    eliminar: async function(id) {
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/sedes/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Sede eliminada exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar sede:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar esta sede?');
            resolve(confirmar);
        });
    }
};

// Exportar para uso global
window.sede = sede;