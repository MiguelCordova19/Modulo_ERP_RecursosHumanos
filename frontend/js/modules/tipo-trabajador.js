// Módulo de Tipo Trabajador con DataTables
const tipoTrabajador = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Tipo Trabajador inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaTipoTrabajador')) {
            $('#tablaTipoTrabajador').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaTipoTrabajador').DataTable({
            ajax: {
                url: '/api/tipo-trabajador',
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
                    className: 'text-center',
                    width: '120px'
                },
                { 
                    data: 'tipo',
                    render: function(data) {
                        const tipos = {
                            1: 'Permanente',
                            2: 'Temporal',
                            3: 'Contratista',
                            4: 'Practicante'
                        };
                        return tipos[data] || data;
                    }
                },
                { 
                    data: 'regimen',
                    render: function(data) {
                        const regimenes = {
                            1: 'Régimen General',
                            2: 'Régimen MYPE',
                            3: 'Régimen Agrario',
                            4: 'Régimen CAS'
                        };
                        return regimenes[data] || data;
                    }
                },
                { 
                    data: 'descripcion',
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
                            <button class="btn btn-action btn-editar" onclick="tipoTrabajador.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="tipoTrabajador.eliminar(${row.id})" title="Eliminar">
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
                console.log('✅ DataTable de Tipo Trabajador inicializada');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-tipo-trabajador').on('click', '.btn-nuevo-tipo-trabajador', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-tipo-trabajador').on('click', '.btn-actualizar-tipo-trabajador', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '#btnGuardarTipoTrabajador').on('click', '#btnGuardarTipoTrabajador', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalTipoTrabajador').on('hidden.bs.modal', function() {
            self.limpiarFormulario();
        });
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nuevo tipo trabajador
    nuevo: function() {
        this.limpiarFormulario();
        $('#modalTipoTrabajadorTitle').html('<i class="fas fa-plus-circle me-2"></i>Registrar Tipo Trabajador');
        
        const modal = new bootstrap.Modal(document.getElementById('modalTipoTrabajador'));
        modal.show();
    },

    // Limpiar formulario
    limpiarFormulario: function() {
        $('#formTipoTrabajador')[0].reset();
        $('#tipoTrabajadorId').val('');
        $('#tipoTrabajadorTipo').val('');
        $('#tipoTrabajadorRegimen').val('');
    },

    // Guardar tipo trabajador (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#tipoTrabajadorId').val();
            const codigo = $('#tipoTrabajadorCodigo').val().trim();
            const tipo = $('#tipoTrabajadorTipo').val();
            const regimen = $('#tipoTrabajadorRegimen').val();
            const descripcion = $('#tipoTrabajadorDescripcion').val().trim();

            // Validaciones
            if (!codigo || !tipo || !regimen || !descripcion) {
                showNotification('Por favor complete todos los campos', 'warning');
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

            const datos = { codigo, tipo, regimen, descripcion };
            const url = id ? `/api/tipo-trabajador/${id}` : '/api/tipo-trabajador';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('#btnGuardarTipoTrabajador').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                    id ? 'Tipo de trabajador actualizado exitosamente' : 'Tipo de trabajador creado exitosamente',
                    'success'
                );

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalTipoTrabajador'));
                modal.hide();

                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al guardar tipo trabajador:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('#btnGuardarTipoTrabajador').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar tipo trabajador
    editar: async function(id) {
        try {
            const response = await fetch(`/api/tipo-trabajador/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el tipo de trabajador');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const tipoTrab = result.data;
                
                $('#tipoTrabajadorId').val(tipoTrab.id);
                $('#tipoTrabajadorCodigo').val(tipoTrab.codigo);
                $('#tipoTrabajadorTipo').val(tipoTrab.tipo);
                $('#tipoTrabajadorRegimen').val(tipoTrab.regimen);
                $('#tipoTrabajadorDescripcion').val(tipoTrab.descripcion);
                $('#modalTipoTrabajadorTitle').text('Editar Tipo Trabajador');

                const modal = new bootstrap.Modal(document.getElementById('modalTipoTrabajador'));
                modal.show();
            }

        } catch (error) {
            console.error('Error al editar tipo trabajador:', error);
            showNotification('Error al cargar el tipo de trabajador: ' + error.message, 'danger');
        }
    },

    // Eliminar tipo trabajador
    eliminar: async function(id) {
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/tipo-trabajador/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Tipo de trabajador eliminado exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al eliminar tipo trabajador:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar este tipo de trabajador?\n\nEsta acción no se puede deshacer.');
            resolve(confirmar);
        });
    }
};
