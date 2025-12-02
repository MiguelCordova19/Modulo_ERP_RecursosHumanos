// Módulo de Sedes con DataTables
const sede = {
    table: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Sedes inicializado');
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
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.table = $('#tablaSedes').DataTable({
            ajax: {
                url: `/api/sedes?empresaId=${empresaId}`,
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
                    data: 'codigo',
                    width: '150px',
                    render: function(data, type, row) {
                        return `<span class="badge bg-primary">${data}</span>`;
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
                    width: '150px',
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
                searchPlaceholder: 'Buscar...',
                search: '_INPUT_',
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
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            responsive: true,
            dom: 'lftip',
            order: [[0, 'desc']],
            initComplete: function() {
                // Agregar filtros en cada columna
                this.api().columns([0, 1, 2]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    // Crear input de búsqueda
                    const input = $(`<input type="text" placeholder="Filtrar '${title}'" />`)
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
        $(document).off('click', '.btn-nuevo-sede').on('click', '.btn-nuevo-sede', function() {
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
        $('#modalSedeTitle').text('Nueva Sede');
        
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
            if (!codigo) {
                showNotification('Por favor ingrese el código de la sede', 'warning');
                $('#sedeCodigo').focus();
                return;
            }
            
            if (codigo.length > 20) {
                showNotification('El código no puede tener más de 20 caracteres', 'warning');
                $('#sedeCodigo').focus();
                return;
            }
            
            if (!descripcion) {
                showNotification('Por favor ingrese la descripción de la sede', 'warning');
                $('#sedeDescripcion').focus();
                return;
            }
            
            if (descripcion.length > 100) {
                showNotification('La descripción no puede tener más de 100 caracteres', 'warning');
                $('#sedeDescripcion').focus();
                return;
            }
            
            // Obtener empresa_id y usuario_id del localStorage
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id || user.usuario_id;
            
            if (!empresaId) {
                showNotification('Error: No se encontró el ID de la empresa', 'danger');
                return;
            }
            
            if (!usuarioId) {
                showNotification('Error: No se encontró el ID del usuario', 'danger');
                return;
            }
            
            // Preparar datos
            const datos = {
                codigo: codigo,
                descripcion: descripcion,
                empresaId: parseInt(empresaId)
            };
            
            console.log('📤 Datos a enviar:', datos);
            
            const url = id ? `/api/sedes/${id}?usuarioId=${usuarioId}` : `/api/sedes?usuarioId=${usuarioId}`;
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-sede').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
            $('.btn-guardar-sede').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
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
                
                console.log('📝 Sede a editar:', sede);
                
                // Establecer valores en el formulario
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
        // Confirmación
        const confirmar = confirm('¿Está seguro de que desea eliminar esta sede?\n\nEsta acción cambiará el estado a Inactivo.');
        
        if (!confirmar) {
            return;
        }

        try {
            // Obtener usuario_id del localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id || user.usuario_id;
            
            if (!usuarioId) {
                showNotification('Error: No se encontró el ID del usuario', 'danger');
                return;
            }
            
            const response = await fetch(`/api/sedes/${id}?usuarioId=${usuarioId}`, {
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
    }
};

// Exportar para uso global
if (typeof window.sede === 'undefined') {
    window.sede = sede;
}
