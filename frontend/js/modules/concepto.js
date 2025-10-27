// Módulo de Conceptos con DataTables
const concepto = {
    table: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Conceptos inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable con filtros en columnas
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaConceptos')) {
            $('#tablaConceptos').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaConceptos').DataTable({
            ajax: {
                url: '/api/conceptos',
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
                        return `<div class="text-truncate" style="max-width: 300px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'concepto_plame',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 250px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'tipo',
                    className: 'text-center',
                    width: '120px',
                    render: function(data, type, row) {
                        const badgeClass = data === 'Ingresos' ? 'bg-success' : 
                                         data === 'Descuentos' ? 'bg-danger' : 'bg-info';
                        return `<span class="badge ${badgeClass} badge-estado">${data}</span>`;
                    }
                },
                {
                    data: 'afecto',
                    className: 'text-center',
                    width: '100px',
                    render: function(data, type, row) {
                        const badgeClass = data === 'SI' ? 'bg-success' : 'bg-warning';
                        return `<span class="badge ${badgeClass} badge-estado">${data}</span>`;
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
                            <button class="btn btn-action btn-editar" onclick="concepto.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="concepto.eliminar(${row.id})" title="Eliminar">
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
                this.api().columns([0, 1, 2, 3, 4]).every(function() {
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
        $(document).off('click', '.btn-nuevo-concepto').on('click', '.btn-nuevo-concepto', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-concepto').on('click', '.btn-actualizar-concepto', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '.btn-guardar-concepto').on('click', '.btn-guardar-concepto', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalConcepto').on('hidden.bs.modal', function() {
            $('#formConcepto')[0].reset();
            $('#conceptoId').val('');
        });
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nuevo concepto
    nuevo: function() {
        $('#formConcepto')[0].reset();
        $('#conceptoId').val('');
        $('#modalConceptoTitle').html('<i class="fas fa-plus-circle me-2"></i>Nuevo Concepto');
        
        const modal = new bootstrap.Modal(document.getElementById('modalConcepto'));
        modal.show();
    },

    // Guardar concepto (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#conceptoId').val();
            const descripcion = $('#conceptoDescripcion').val().trim();
            const conceptoPlame = $('#conceptoPlame').val().trim();
            const tipo = $('#conceptoTipo').val();
            const afecto = $('#conceptoAfecto').val();
            const estado = parseInt($('#conceptoEstado').val());
            
            // Validaciones
            if (!descripcion || !conceptoPlame || !tipo || !afecto) {
                showNotification('Por favor complete todos los campos requeridos', 'warning');
                return;
            }

            if (descripcion.length < 3) {
                showNotification('La descripción debe tener al menos 3 caracteres', 'warning');
                return;
            }

            const datos = { descripcion, concepto_plame: conceptoPlame, tipo, afecto, estado };
            const url = id ? `/api/conceptos/${id}` : '/api/conceptos';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-concepto').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                    id ? 'Concepto actualizado exitosamente' : 'Concepto creado exitosamente',
                    'success'
                );
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalConcepto'));
                modal.hide();
                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar concepto:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-concepto').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar concepto
    editar: async function(id) {
        try {
            const response = await fetch(`/api/conceptos/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el concepto');
            }

            const result = await response.json();
            if (result.success && result.data) {
                const concepto = result.data;
                
                $('#conceptoId').val(concepto.id);
                $('#conceptoDescripcion').val(concepto.descripcion);
                $('#conceptoPlame').val(concepto.concepto_plame);
                $('#conceptoTipo').val(concepto.tipo);
                $('#conceptoAfecto').val(concepto.afecto);
                $('#conceptoEstado').val(concepto.estado);
                $('#modalConceptoTitle').html('<i class="fas fa-edit me-2"></i>Editar Concepto');
                
                const modal = new bootstrap.Modal(document.getElementById('modalConcepto'));
                modal.show();
            }
        } catch (error) {
            console.error('Error al editar concepto:', error);
            showNotification('Error al cargar el concepto: ' + error.message, 'danger');
        }
    },

    // Eliminar concepto
    eliminar: async function(id) {
        // Confirmación con SweetAlert si está disponible, sino con confirm nativo
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/conceptos/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Concepto eliminado exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar concepto:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar este concepto?\n\nEsta acción cambiará el estado a Inactivo.');
            resolve(confirmar);
        });
    }
};

// Exportar para uso global
window.concepto = concepto;