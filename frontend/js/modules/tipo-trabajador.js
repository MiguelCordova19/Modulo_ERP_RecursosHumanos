// Módulo de Tipo Trabajador con DataTables
(function() {
    'use strict';

    window.tipoTrabajador = {
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
        
        // Obtener empresa_id
        const empresaId = localStorage.getItem('empresa_id') || 1;
        
        // Crear la tabla
        this.table = $('#tablaTipoTrabajador').DataTable({
            ajax: {
                url: `/api/tipo-trabajador?empresaId=${empresaId}`,
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
                    data: 'codigoInterno',
                    className: 'text-center',
                    width: '100px'
                },
                { 
                    data: null,
                    render: function(data, type, row) {
                        // Mostrar Tipo - Régimen
                        if (row.tipo && row.regimenPensionario) {
                            const tipo = `${row.tipo.codSunat} - ${row.tipo.descripcion}`;
                            const regimen = `${row.regimenPensionario.codSunat} - ${row.regimenPensionario.abreviatura}`;
                            return `<div><strong>${tipo}</strong><br><small class="text-muted">${regimen}</small></div>`;
                        }
                        return 'N/A';
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
                decimal: "",
                emptyTable: "No hay datos disponibles en la tabla",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                infoPostFix: "",
                thousands: ",",
                lengthMenu: "Mostrar _MENU_ registros",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
                search: "Buscar:",
                zeroRecords: "No se encontraron registros coincidentes",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                },
                aria: {
                    sortAscending: ": activar para ordenar la columna ascendente",
                    sortDescending: ": activar para ordenar la columna descendente"
                }
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
        $(document).off('click', '.btn-guardar-tipo-trabajador').on('click', '.btn-guardar-tipo-trabajador', function() {
            self.guardar();
        });
        
        // Botón Cancelar en modal
        $(document).off('click', '.btn-cancelar-tipo-trabajador').on('click', '.btn-cancelar-tipo-trabajador', function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalTipoTrabajador'));
            if (modal) {
                modal.hide();
            }
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalTipoTrabajador').on('hidden.bs.modal', function() {
            self.limpiarFormulario();
            // Asegurar que el backdrop se elimine
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open').css('overflow', '');
        });
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Cargar tipos SUNAT en el combobox
    cargarTipos: async function() {
        try {
            const select = $('#tipoTrabajadorTipo');
            select.html('<option value="" selected disabled>Cargando tipos...</option>');
            
            const response = await fetch('/api/tipos');
            
            if (!response.ok) {
                throw new Error('Error al cargar tipos desde el servidor');
            }
            
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                select.empty();
                select.append('<option value="" selected disabled>Seleccione un tipo...</option>');
                
                result.data.forEach(tipo => {
                    select.append(`<option value="${tipo.id}">${tipo.codSunat} - ${tipo.descripcion}</option>`);
                });
                
                console.log('✅ Tipos SUNAT cargados:', result.data.length);
            } else {
                select.html('<option value="" selected disabled>No hay tipos disponibles</option>');
                console.warn('⚠️ No se encontraron tipos en la base de datos');
            }
        } catch (error) {
            console.error('❌ Error al cargar tipos:', error);
            const select = $('#tipoTrabajadorTipo');
            select.html('<option value="" selected disabled>Error al cargar tipos</option>');
            showNotification('Error al cargar tipos SUNAT', 'danger');
        }
    },

    // Cargar regímenes pensionarios en el combobox
    cargarRegimenes: async function() {
        try {
            const select = $('#tipoTrabajadorRegimen');
            select.html('<option value="" selected disabled>Cargando regímenes...</option>');
            
            const response = await fetch('/api/regimenes');
            
            if (!response.ok) {
                throw new Error('Error al cargar regímenes desde el servidor');
            }
            
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                select.empty();
                select.append('<option value="" selected disabled>Seleccione un régimen...</option>');
                
                result.data.forEach(regimen => {
                    select.append(`<option value="${regimen.id}">${regimen.codSunat} - ${regimen.abreviatura}</option>`);
                });
                
                console.log('✅ Regímenes pensionarios cargados:', result.data.length);
            } else {
                select.html('<option value="" selected disabled>No hay regímenes disponibles</option>');
                console.warn('⚠️ No se encontraron regímenes en la base de datos');
            }
        } catch (error) {
            console.error('❌ Error al cargar regímenes:', error);
            const select = $('#tipoTrabajadorRegimen');
            select.html('<option value="" selected disabled>Error al cargar regímenes</option>');
            showNotification('Error al cargar regímenes pensionarios', 'danger');
        }
    },

    // Abrir modal para nuevo tipo trabajador
    nuevo: function() {
        this.limpiarFormulario();
        $('#modalTipoTrabajadorTitle').text('Nuevo Tipo Trabajador');
        
        // Abrir modal inmediatamente
        const modal = new bootstrap.Modal(document.getElementById('modalTipoTrabajador'));
        modal.show();
        
        // Cargar tipos y regímenes en paralelo después de abrir el modal
        Promise.all([
            this.cargarTipos(),
            this.cargarRegimenes()
        ]).catch(error => {
            console.error('Error al cargar datos:', error);
        });
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
            const codigoInterno = $('#tipoTrabajadorCodigo').val().trim();
            const tipoId = $('#tipoTrabajadorTipo').val();
            const regimenId = $('#tipoTrabajadorRegimen').val();
            const descripcion = $('#tipoTrabajadorDescripcion').val().trim();

            // Validaciones
            if (!codigoInterno || !tipoId || !regimenId || !descripcion) {
                showNotification('Por favor complete todos los campos', 'warning');
                return;
            }

            // Validar que el código sea de 3 dígitos numéricos
            if (!/^\d{3}$/.test(codigoInterno)) {
                showNotification('El código interno debe ser de 3 dígitos numéricos (Ej: 001)', 'warning');
                return;
            }

            if (descripcion.length < 3) {
                showNotification('La descripción debe tener al menos 3 caracteres', 'warning');
                return;
            }

            const empresaId = parseInt(localStorage.getItem('empresa_id')) || 1;
            const datos = { 
                codigoInterno, 
                tipoId: parseInt(tipoId), 
                regimenId: parseInt(regimenId), 
                descripcion,
                empresaId
            };
            
            const url = id ? `/api/tipo-trabajador/${id}` : '/api/tipo-trabajador';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            const btnGuardar = $('.btn-guardar-tipo-trabajador');
            btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                if (modal) {
                    modal.hide();
                }

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
            const btnGuardar = $('.btn-guardar-tipo-trabajador');
            btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Editar tipo trabajador
    editar: async function(id) {
        try {
            this.limpiarFormulario();
            $('#modalTipoTrabajadorTitle').text('Editar Tipo Trabajador');
            
            // Abrir modal inmediatamente
            const modal = new bootstrap.Modal(document.getElementById('modalTipoTrabajador'));
            modal.show();
            
            // Cargar datos en paralelo
            const [tiposResult, regimenesResult, tipoTrabResult] = await Promise.all([
                this.cargarTipos(),
                this.cargarRegimenes(),
                fetch(`/api/tipo-trabajador/${id}`).then(r => r.json())
            ]);

            if (tipoTrabResult.success && tipoTrabResult.data) {
                const tipoTrab = tipoTrabResult.data;
                
                $('#tipoTrabajadorId').val(tipoTrab.id);
                $('#tipoTrabajadorCodigo').val(tipoTrab.codigoInterno);
                $('#tipoTrabajadorDescripcion').val(tipoTrab.descripcion);
                
                // Seleccionar tipo y régimen
                if (tipoTrab.tipo && tipoTrab.tipo.id) {
                    $('#tipoTrabajadorTipo').val(tipoTrab.tipo.id);
                }
                if (tipoTrab.regimenPensionario && tipoTrab.regimenPensionario.id) {
                    $('#tipoTrabajadorRegimen').val(tipoTrab.regimenPensionario.id);
                }
            } else {
                throw new Error('No se pudo cargar el tipo de trabajador');
            }

        } catch (error) {
            console.error('Error al editar tipo trabajador:', error);
            showNotification('Error al cargar el tipo de trabajador: ' + error.message, 'danger');
            // Cerrar modal si hay error
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalTipoTrabajador'));
            if (modal) {
                modal.hide();
            }
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

})(); // Fin del IIFE
