// Módulo de Comisiones AFP con DataTables
const ComisionesAFP = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Comisiones AFP inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaComisiones')) {
            $('#tablaComisiones').DataTable().destroy();
        }
        
        // Crear la tabla
        this.table = $('#tablaComisiones').DataTable({
            ajax: {
                url: '/api/comisiones-afp',
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
                    width: '60px'
                },
                { 
                    data: 'regimen',
                    className: 'text-center',
                    width: '120px',
                    render: function(data) {
                        const regimenes = {
                            1: 'Integra',
                            2: 'Prima',
                            3: 'Profuturo',
                            4: 'Habitat'
                        };
                        return regimenes[data] || data;
                    }
                },
                { 
                    data: 'comision_flujo',
                    className: 'text-end',
                    width: '100px',
                    render: function(data) {
                        return parseFloat(data).toFixed(2) + '%';
                    }
                },
                { 
                    data: 'comision_anual',
                    className: 'text-end',
                    width: '120px',
                    render: function(data) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                { 
                    data: 'prima_seguro',
                    className: 'text-end',
                    width: '110px',
                    render: function(data) {
                        return parseFloat(data).toFixed(2) + '%';
                    }
                },
                { 
                    data: 'aporte_obligatorio',
                    className: 'text-end',
                    width: '120px',
                    render: function(data) {
                        return parseFloat(data).toFixed(2) + '%';
                    }
                },
                { 
                    data: 'retencion_maxima',
                    className: 'text-end',
                    width: '120px',
                    render: function(data) {
                        return parseFloat(data).toFixed(2) + '%';
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
                            <button class="btn btn-action btn-editar" onclick="ComisionesAFP.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="ComisionesAFP.eliminar(${row.id})" title="Eliminar">
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
                console.log('✅ DataTable de Comisiones AFP inicializada');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-comisiones').on('click', '.btn-nuevo-comisiones', function() {
            self.nuevo();
        });
        
        // Botón Actualizar
        $(document).off('click', '.btn-actualizar-comisiones').on('click', '.btn-actualizar-comisiones', function() {
            self.actualizar();
        });
        
        // Botón Guardar en modal
        $(document).off('click', '#btnGuardarAFP').on('click', '#btnGuardarAFP', function() {
            self.guardar();
        });
        
        // Botón calendario
        $(document).off('click', '#btnCalendarioAFP').on('click', '#btnCalendarioAFP', function() {
            $('#afpPeriodo').focus();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalAFP').on('hidden.bs.modal', function() {
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

    // Abrir modal para nuevo AFP
    nuevo: function() {
        this.limpiarFormulario();
        $('#modalAFPTitle').text('Nuevo AFP');
        
        // Establecer periodo actual
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        $('#afpPeriodo').val(`${year}-${month}`);
        
        const modal = new bootstrap.Modal(document.getElementById('modalAFP'));
        modal.show();
    },

    // Limpiar formulario
    limpiarFormulario: function() {
        $('#formAFP')[0].reset();
        $('#afpId').val('');
        $('#afpRegimen').val('');
        $('#afpComisionFlujo').val('0.00');
        $('#afpComisionAnual').val('0.00');
        $('#afpPrimaSeguro').val('0.00');
        $('#afpAporteObligatorio').val('0.00');
        $('#afpRetencionMaxima').val('0.00');
    },

    // Guardar AFP (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#afpId').val();
            const periodo = $('#afpPeriodo').val();
            const regimen = $('#afpRegimen').val();
            const comisionFlujo = parseFloat($('#afpComisionFlujo').val());
            const comisionAnual = parseFloat($('#afpComisionAnual').val());
            const primaSeguro = parseFloat($('#afpPrimaSeguro').val());
            const aporteObligatorio = parseFloat($('#afpAporteObligatorio').val());
            const retencionMaxima = parseFloat($('#afpRetencionMaxima').val());

            // Validaciones
            if (!periodo || !regimen) {
                showNotification('Por favor complete los campos requeridos', 'warning');
                return;
            }

            if (isNaN(comisionFlujo) || isNaN(comisionAnual) || isNaN(primaSeguro) || 
                isNaN(aporteObligatorio) || isNaN(retencionMaxima)) {
                showNotification('Por favor ingrese valores numéricos válidos', 'warning');
                return;
            }

            if (comisionFlujo < 0 || comisionAnual < 0 || primaSeguro < 0 || 
                aporteObligatorio < 0 || retencionMaxima < 0) {
                showNotification('Los valores no pueden ser negativos', 'warning');
                return;
            }

            const datos = {
                periodo,
                regimen,
                comision_flujo: comisionFlujo,
                comision_anual: comisionAnual,
                prima_seguro: primaSeguro,
                aporte_obligatorio: aporteObligatorio,
                retencion_maxima: retencionMaxima
            };

            const url = id ? `/api/comisiones-afp/${id}` : '/api/comisiones-afp';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('#btnGuardarAFP').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                    id ? 'Comisión AFP actualizada exitosamente' : 'Comisión AFP creada exitosamente',
                    'success'
                );

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAFP'));
                modal.hide();

                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al guardar comisión AFP:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('#btnGuardarAFP').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar AFP
    editar: async function(id) {
        try {
            const response = await fetch(`/api/comisiones-afp/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener la comisión AFP');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const afpData = result.data;
                
                $('#afpId').val(afpData.id);
                $('#afpPeriodo').val(afpData.periodo);
                $('#afpRegimen').val(afpData.regimen);
                $('#afpComisionFlujo').val(parseFloat(afpData.comision_flujo).toFixed(2));
                $('#afpComisionAnual').val(parseFloat(afpData.comision_anual).toFixed(2));
                $('#afpPrimaSeguro').val(parseFloat(afpData.prima_seguro).toFixed(2));
                $('#afpAporteObligatorio').val(parseFloat(afpData.aporte_obligatorio).toFixed(2));
                $('#afpRetencionMaxima').val(parseFloat(afpData.retencion_maxima).toFixed(2));
                $('#modalAFPTitle').text('Editar AFP');

                const modal = new bootstrap.Modal(document.getElementById('modalAFP'));
                modal.show();
            }

        } catch (error) {
            console.error('Error al editar comisión AFP:', error);
            showNotification('Error al cargar la comisión AFP: ' + error.message, 'danger');
        }
    },

    // Eliminar AFP
    eliminar: async function(id) {
        const confirmar = await this.confirmarEliminacion();
        
        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`/api/comisiones-afp/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Comisión AFP eliminada exitosamente', 'success');
                this.table.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }

        } catch (error) {
            console.error('Error al eliminar comisión AFP:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // Confirmación de eliminación
    confirmarEliminacion: function() {
        return new Promise((resolve) => {
            const confirmar = confirm('¿Está seguro de que desea eliminar esta comisión AFP?\n\nEsta acción no se puede deshacer.');
            resolve(confirmar);
        });
    }
};
