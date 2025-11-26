// Módulo de Motivo Préstamo con DataTables
(function() {
    'use strict';

    window.motivoPrestamo = {
        table: null,
        
        // Inicializar el módulo
        init: function() {
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId');
            const empresaNombre = localStorage.getItem('empresa_nombre') || 'Desconocida';
            
            console.log('✅ Módulo Motivo Préstamo inicializado');
            console.log('🏢 Empresa:', empresaNombre, '(ID:', empresaId, ')');
            
            if (!empresaId) {
                console.warn('⚠️ ADVERTENCIA: No se encontró empresa_id en localStorage');
            }
            
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
        const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
        
        console.log('📊 Inicializando tabla con empresaId:', empresaId);
        
        this.table = $('#tablaMotivos').DataTable({
            ajax: {
                url: `/api/motivos-prestamo?empresaId=${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar datos:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cargar los datos',
                        confirmButtonColor: '#ffc107'
                    });
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
            order: [[0, 'asc']],
            initComplete: function() {
                const api = this.api();
                
                // Crear una fila de filtros debajo de los encabezados
                $('#tablaMotivos thead tr').clone(true).addClass('filters').appendTo('#tablaMotivos thead');
                
                // Agregar inputs de filtro en la nueva fila
                $('#tablaMotivos thead tr.filters th').each(function(i) {
                    const title = $('#tablaMotivos thead tr:first th').eq(i).text();
                    
                    // No agregar filtro en la columna de Acciones
                    if (i === 3) {
                        $(this).html('');
                    } else {
                        $(this).html('<input type="text" class="form-control form-control-sm" placeholder="Filtrar ' + title + '" />');
                        
                        $('input', this).on('keyup change', function() {
                            if (api.column(i).search() !== this.value) {
                                api.column(i).search(this.value).draw();
                            }
                        });
                    }
                });
                
                console.log('✅ DataTable inicializada con filtros en fila separada');
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
        
        // Botón Cancelar en modal con confirmación
        $(document).off('click', '.btn-cancelar-motivo').on('click', '.btn-cancelar-motivo', async function() {
            const descripcion = $('#motivoDescripcion').val().trim();
            
            // Si hay datos en el formulario, pedir confirmación
            if (descripcion) {
                const result = await Swal.fire({
                    title: '¿Cancelar?',
                    text: 'Los cambios no guardados se perderán',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6c757d',
                    cancelButtonColor: '#ffc107',
                    confirmButtonText: '<i class="fas fa-check me-2"></i>Sí, cancelar',
                    cancelButtonText: '<i class="fas fa-times me-2"></i>No',
                    reverseButtons: true
                });
                
                if (result.isConfirmed) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalMotivo'));
                    modal.hide();
                }
            } else {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMotivo'));
                modal.hide();
            }
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
            Swal.fire({
                icon: 'info',
                title: 'Actualizado',
                text: 'Tabla actualizada',
                confirmButtonColor: '#ffc107',
                timer: 1500,
                showConfirmButton: false
            });
        }
    },

    // Abrir modal para nuevo motivo
    nuevo: function() {
        $('#formMotivo')[0].reset();
        $('#motivoId').val('');
        $('#modalMotivoTitle').text('Motivo');
        
        const modal = new bootstrap.Modal(document.getElementById('modalMotivo'));
        modal.show();
    },

    // Guardar motivo (crear o actualizar)
    guardar: async function() {
        const self = this;
        
        // Confirmar con SweetAlert
        const result = await Swal.fire({
            title: '¿Confirmar acción?',
            text: '¿Está seguro de guardar este motivo de préstamo?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-check me-2"></i>Sí, guardar',
            cancelButtonText: '<i class="fas fa-times me-2"></i>Cancelar',
            reverseButtons: true
        });
        
        if (!result.isConfirmed) {
            return;
        }
        
        try {
            const id = $('#motivoId').val();
            const descripcion = $('#motivoDescripcion').val().trim();

            // Validaciones
            if (!descripcion) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Por favor ingrese la descripción del motivo',
                    confirmButtonColor: '#ffc107'
                });
                return;
            }

            if (descripcion.length < 3) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Descripción muy corta',
                    text: 'La descripción debe tener al menos 3 caracteres',
                    confirmButtonColor: '#ffc107'
                });
                return;
            }

            // Obtener empresaId del localStorage (guardado como empresa_id en el login)
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
            
            if (!empresaId || empresaId === '1') {
                console.warn('⚠️ No se encontró empresa_id en localStorage, usando empresa por defecto');
            }
            
            const datos = { 
                descripcion, 
                estado: 1,
                empresaId: parseInt(empresaId)
            };
            
            const url = id ? `/api/motivos-prestamo/${id}?empresaId=${empresaId}` : '/api/motivos-prestamo';
            const method = id ? 'PUT' : 'POST';

            // Deshabilitar botón mientras se guarda
            $('.btn-guardar-motivo').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const resultData = await response.json();

            if (resultData.success) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: id ? 'Motivo actualizado exitosamente' : 'Motivo creado exitosamente',
                    confirmButtonColor: '#ffc107',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalMotivo'));
                modal.hide();

                // Recargar tabla
                this.table.ajax.reload(null, false);
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultData.message || 'Error al guardar el motivo',
                    confirmButtonColor: '#ffc107'
                });
            }

        } catch (error) {
            console.error('Error al guardar motivo:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar: ' + error.message,
                confirmButtonColor: '#ffc107'
            });
        } finally {
            // Rehabilitar botón
            $('.btn-guardar-motivo').prop('disabled', false).html('<i class="fas fa-save me-2"></i>Guardar');
        }
    },

    // Editar motivo
    editar: async function(id) {
        try {
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
            const response = await fetch(`/api/motivos-prestamo/${id}?empresaId=${empresaId}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el motivo');
            }

            const result = await response.json();

            if (result.success && result.data) {
                const motivo = result.data;
                
                $('#motivoId').val(motivo.id);
                $('#motivoDescripcion').val(motivo.descripcion);
                $('#modalMotivoTitle').text('Motivo');

                const modal = new bootstrap.Modal(document.getElementById('modalMotivo'));
                modal.show();
            }

        } catch (error) {
            console.error('Error al editar motivo:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar el motivo: ' + error.message,
                confirmButtonColor: '#ffc107'
            });
        }
    },

    // Eliminar motivo
    eliminar: async function(id) {
        // Confirmación con SweetAlert
        const result = await Swal.fire({
            title: '¿Eliminar motivo?',
            text: 'Esta acción cambiará el estado del motivo a Inactivo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash me-2"></i>Sí, eliminar',
            cancelButtonText: '<i class="fas fa-times me-2"></i>Cancelar',
            reverseButtons: true
        });
        
        if (!result.isConfirmed) {
            return;
        }

        try {
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
            const response = await fetch(`/api/motivos-prestamo/${id}?empresaId=${empresaId}`, {
                method: 'DELETE'
            });

            const resultData = await response.json();

            if (resultData.success) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'Motivo eliminado exitosamente',
                    confirmButtonColor: '#ffc107',
                    timer: 2000,
                    showConfirmButton: false
                });
                this.table.ajax.reload(null, false);
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultData.message || 'Error al eliminar el motivo',
                    confirmButtonColor: '#ffc107'
                });
            }

        } catch (error) {
            console.error('Error al eliminar motivo:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar: ' + error.message,
                confirmButtonColor: '#ffc107'
            });
        }
    }
};

})(); // Fin del IIFE