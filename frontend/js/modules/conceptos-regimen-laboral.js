// Módulo de Conceptos por Régimen Laboral con DataTables
const conceptoRegimenLaboral = {
    table: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Conceptos por Régimen Laboral inicializado');
        this.cargarRegimenesLaborales();
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Cargar regímenes laborales para el filtro y modal
    cargarRegimenesLaborales: async function() {
        try {
            const response = await fetch('/api/regimenes-laborales');
            const result = await response.json();
            
            if (result.success && result.data) {
                const selectFiltro = $('#selectRegimenLaboral');
                const selectModal = $('#conceptoRegimenLaboral');
                
                // Limpiar opciones existentes (excepto la primera)
                selectFiltro.find('option:not(:first)').remove();
                selectModal.find('option:not(:first)').remove();
                
                // Agregar opciones
                result.data.forEach(regimen => {
                    const optionText = `${regimen.codigo} ${regimen.descripcion}`;
                    const option = `<option value="${regimen.id}">${optionText}</option>`;
                    selectFiltro.append(option);
                    selectModal.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar regímenes laborales:', error);
        }
    },

    // Cargar conceptos para el modal
    cargarConceptosDisponibles: async function() {
        try {
            const response = await fetch('/api/conceptos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const listaConceptos = $('#listaConceptos');
                listaConceptos.empty();
                
                // Agregar checkboxes para cada concepto
                result.data.forEach(concepto => {
                    if (concepto.estado === 1) { // Solo conceptos activos
                        const checkbox = `
                            <div class="form-check mb-2">
                                <input class="form-check-input concepto-checkbox" type="checkbox" value="${concepto.id}" id="concepto-${concepto.id}">
                                <label class="form-check-label" for="concepto-${concepto.id}">
                                    <strong>${concepto.descripcion}</strong> - ${concepto.concepto_plame}
                                    <span class="badge ${concepto.tipo === 'Ingresos' ? 'bg-success' : concepto.tipo === 'Descuentos' ? 'bg-danger' : 'bg-info'} badge-estado ms-2">${concepto.tipo}</span>
                                    <span class="badge ${concepto.afecto === 'SI' ? 'bg-success' : 'bg-warning'} badge-estado ms-1">${concepto.afecto}</span>
                                </label>
                            </div>
                        `;
                        listaConceptos.append(checkbox);
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar conceptos:', error);
        }
    },

    // Cargar conceptos asignados a un régimen específico
    cargarConceptosAsignados: async function(regimenId) {
        try {
            const response = await fetch(`/api/conceptos-regimen-laboral/${regimenId}/conceptos`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Marcar los checkboxes de los conceptos asignados
                result.data.forEach(conceptoAsignado => {
                    $(`#concepto-${conceptoAsignado.concepto_id}`).prop('checked', true);
                });
            }
        } catch (error) {
            console.error('Error al cargar conceptos asignados:', error);
        }
    },

    // Inicializar DataTable con filtros en columnas
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaConceptosRegimen')) {
            $('#tablaConceptosRegimen').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaConceptosRegimen').DataTable({
            ajax: {
                url: '/api/regimenes-laborales',
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
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <div>
                                <strong>${row.codigo}</strong> ${row.descripcion}
                                ${row.estado === 0 ? '<span class="badge bg-danger badge-estado ms-2">Inactivo</span>' : ''}
                            </div>
                        `;
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
                            <button class="btn btn-action btn-editar" onclick="conceptoRegimenLaboral.editar(${row.id})" title="Gestionar Conceptos">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="conceptoRegimenLaboral.eliminar(${row.id})" title="Eliminar" ${row.estado === 0 ? 'disabled' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar régimen laboral...',
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
                this.api().columns([0, 1]).every(function() {
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
                
                console.log('✅ DataTable de regímenes laborales inicializada');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-concepto-regimen').on('click', '.btn-nuevo-concepto-regimen', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-concepto-regimen').on('click', '.btn-actualizar-concepto-regimen', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '.btn-guardar-concepto-regimen').on('click', '.btn-guardar-concepto-regimen', function() {
            self.guardar();
        });
        
        // Filtro por régimen laboral
        $(document).off('change', '#selectRegimenLaboral').on('change', '#selectRegimenLaboral', function() {
            const regimenId = $(this).val();
            self.filtrarPorRegimen(regimenId);
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalConceptoRegimen').on('hidden.bs.modal', function() {
            $('#formConceptoRegimen')[0].reset();
            $('#conceptoRegimenId').val('');
            $('.concepto-checkbox').prop('checked', false);
        });
    },

    // Filtrar por régimen laboral
    filtrarPorRegimen: function(regimenId) {
        if (this.table) {
            if (regimenId) {
                // Buscar por ID del régimen
                this.table.column(0).search(regimenId).draw();
            } else {
                this.table.column(0).search('').draw();
            }
        }
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            this.cargarRegimenesLaborales();
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Abrir modal para nuevo régimen con conceptos
    nuevo: function() {
        $('#formConceptoRegimen')[0].reset();
        $('#conceptoRegimenId').val('');
        $('#modalConceptoRegimenTitle').html('<i class="fas fa-plus-circle me-2"></i>Asignar Conceptos a Régimen Laboral');
        
        // Cargar conceptos disponibles
        this.cargarConceptosDisponibles();
        
        const modal = new bootstrap.Modal(document.getElementById('modalConceptoRegimen'));
        modal.show();
    },

    // Editar - Gestionar conceptos de un régimen
    editar: async function(regimenId) {
        try {
            const response = await fetch(`/api/regimenes-laborales/${regimenId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const regimen = result.data;
                
                $('#conceptoRegimenId').val(regimen.id);
                $('#conceptoRegimenLaboral').val(regimen.id);
                $('#modalConceptoRegimenTitle').html(`<i class="fas fa-edit me-2"></i>Gestionar Conceptos - ${regimen.codigo} ${regimen.descripcion}`);
                
                // Cargar conceptos disponibles
                await this.cargarConceptosDisponibles();
                
                // Cargar conceptos asignados
                await this.cargarConceptosAsignados(regimen.id);
                
                const modal = new bootstrap.Modal(document.getElementById('modalConceptoRegimen'));
                modal.show();
            }
        } catch (error) {
            console.error('Error al cargar régimen:', error);
            showNotification('Error al cargar el régimen laboral: ' + error.message, 'danger');
        }
    },

    // Guardar asignación de conceptos a régimen
    guardar: async function() {
        try {
            const regimenId = $('#conceptoRegimenLaboral').val();
            
            // Validaciones
            if (!regimenId) {
                showNotification('Por favor seleccione un régimen laboral', 'warning');
                return;
            }

            // Obtener conceptos seleccionados
            const conceptosSeleccionados = [];
            $('.concepto-checkbox:checked').each(function() {
                conceptosSeleccionados.push($(this).val());
            });

            const datos = { 
                regimen_laboral_id: regimenId,
                conceptos: conceptosSeleccionados
            };

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-concepto-regimen').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

            const response = await fetch('/api/conceptos-regimen-laboral/asignar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Conceptos asignados exitosamente al régimen laboral', 'success');
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalConceptoRegimen'));
                modal.hide();
                // Recargar tabla
                this.actualizar();
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar asignación de conceptos:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-concepto-regimen').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Eliminar régimen (cambiar estado a inactivo)
    eliminar: async function(regimenId) {
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/regimenes-laborales/${regimenId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Régimen laboral desactivado exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar régimen laboral:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea desactivar este régimen laboral?\n\nEsta acción cambiará el estado a Inactivo.');
            resolve(confirmar);
        });
    }
};

// Exportar para uso global
window.conceptoRegimenLaboral = conceptoRegimenLaboral;