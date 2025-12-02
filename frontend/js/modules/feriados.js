// Módulo de Feriados con DataTables
(function() {
    'use strict';

    window.feriados = {
        table: null,
        
        // Inicializar el módulo
        init: function() {
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId');
            const empresaNombre = localStorage.getItem('empresa_nombre') || 'Desconocida';
            
            console.log('✅ Módulo Feriados inicializado');
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
            if ($.fn.DataTable.isDataTable('#tablaFeriados')) {
                $('#tablaFeriados').DataTable().destroy();
            }
            
            // Crear la tabla
            const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
            
            console.log('📊 Inicializando tabla con empresaId:', empresaId);
            
            this.table = $('#tablaFeriados').DataTable({
                ajax: {
                    url: `/api/feriados?empresaId=${empresaId}`,
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
                        data: 'fechaFeriado',
                        className: 'text-center',
                        width: '120px',
                        render: function(data) {
                            // Formatear fecha a DD/MM/YYYY
                            const fecha = new Date(data + 'T00:00:00');
                            return fecha.toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });
                        }
                    },
                    { 
                        data: 'diaFeriado',
                        className: 'text-center',
                        width: '120px'
                    },
                    { 
                        data: 'denominacion',
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
                order: [[1, 'asc']], // Ordenar por fecha
                initComplete: function() {
                    const api = this.api();
                    
                    // Crear una fila de filtros debajo de los encabezados
                    $('#tablaFeriados thead tr').clone(true).addClass('filters').appendTo('#tablaFeriados thead');
                    
                    // Agregar inputs de filtro en la nueva fila
                    $('#tablaFeriados thead tr.filters th').each(function(i) {
                        const title = $('#tablaFeriados thead tr:first th').eq(i).text();
                        
                        // No agregar filtro en la columna de Acciones
                        if (i === 4) {
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
            $(document).off('click', '.btn-nuevo-feriado').on('click', '.btn-nuevo-feriado', function() {
                self.nuevo();
            });
            
            // Botón Actualizar
            $(document).off('click', '.btn-actualizar-feriado').on('click', '.btn-actualizar-feriado', function() {
                self.actualizar();
            });
            
            // Botón Guardar en modal
            $(document).off('click', '.btn-guardar-feriado').on('click', '.btn-guardar-feriado', function() {
                self.guardar();
            });
            
            // Botón Cancelar en modal con confirmación
            $(document).off('click', '.btn-cancelar-feriado').on('click', '.btn-cancelar-feriado', async function() {
                const denominacion = $('#feriadoDenominacion').val().trim();
                const fecha = $('#feriadoFecha').val();
                
                // Si hay datos en el formulario, pedir confirmación
                if (denominacion || fecha) {
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
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modalFeriado'));
                        modal.hide();
                    }
                } else {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalFeriado'));
                    modal.hide();
                }
            });
            
            // Calcular día de la semana cuando cambia la fecha
            $(document).off('change', '#feriadoFecha').on('change', '#feriadoFecha', function() {
                self.calcularDiaSemana();
            });
            
            // Limpiar formulario al cerrar modal
            $('#modalFeriado').on('hidden.bs.modal', function() {
                $('#formFeriado')[0].reset();
                $('#feriadoId').val('');
                $('#feriadoDia').val('');
            });
        },

        // Calcular día de la semana desde la fecha
        calcularDiaSemana: function() {
            const fechaInput = $('#feriadoFecha').val();
            
            if (!fechaInput) {
                $('#feriadoDia').val('');
                return;
            }
            
            const fecha = new Date(fechaInput + 'T00:00:00');
            const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const diaSemana = dias[fecha.getDay()];
            
            $('#feriadoDia').val(diaSemana);
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

        // Abrir modal para nuevo feriado
        nuevo: function() {
            $('#formFeriado')[0].reset();
            $('#feriadoId').val('');
            $('#feriadoDia').val('');
            $('#modalFeriadoTitle').text('Agregar Feriado');
            
            const modal = new bootstrap.Modal(document.getElementById('modalFeriado'));
            modal.show();
        },

        // Guardar feriado (crear o actualizar)
        guardar: async function() {
            const self = this;
            
            // Confirmar con SweetAlert
            const result = await Swal.fire({
                title: '¿Confirmar acción?',
                text: '¿Está seguro de guardar este feriado?',
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
                const id = $('#feriadoId').val();
                const fecha = $('#feriadoFecha').val();
                const dia = $('#feriadoDia').val();
                const denominacion = $('#feriadoDenominacion').val().trim();

                // Validaciones
                if (!fecha) {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Campo requerido',
                        text: 'Por favor seleccione una fecha',
                        confirmButtonColor: '#ffc107'
                    });
                    return;
                }

                if (!denominacion) {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Campo requerido',
                        text: 'Por favor ingrese la denominación del feriado',
                        confirmButtonColor: '#ffc107'
                    });
                    return;
                }

                if (denominacion.length < 3) {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Denominación muy corta',
                        text: 'La denominación debe tener al menos 3 caracteres',
                        confirmButtonColor: '#ffc107'
                    });
                    return;
                }

                // Obtener empresaId del localStorage
                const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
                
                if (!empresaId || empresaId === '1') {
                    console.warn('⚠️ No se encontró empresa_id en localStorage, usando empresa por defecto');
                }
                
                const datos = { 
                    fechaFeriado: fecha,
                    diaFeriado: dia,
                    denominacion: denominacion,
                    estado: 1,
                    empresaId: parseInt(empresaId)
                };
                
                const url = id ? `/api/feriados/${id}?empresaId=${empresaId}` : '/api/feriados';
                const method = id ? 'PUT' : 'POST';

                // Deshabilitar botón mientras se guarda
                $('.btn-guardar-feriado').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');

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
                        text: id ? 'Feriado actualizado exitosamente' : 'Feriado creado exitosamente',
                        confirmButtonColor: '#ffc107',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalFeriado'));
                    modal.hide();

                    // Recargar tabla
                    this.table.ajax.reload(null, false);
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: resultData.message || 'Error al guardar el feriado',
                        confirmButtonColor: '#ffc107'
                    });
                }

            } catch (error) {
                console.error('Error al guardar feriado:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar: ' + error.message,
                    confirmButtonColor: '#ffc107'
                });
            } finally {
                // Rehabilitar botón
                $('.btn-guardar-feriado').prop('disabled', false).html('<i class="fas fa-save me-2"></i>Guardar');
            }
        },

        // Editar feriado
        editar: async function(id) {
            try {
                const empresaId = localStorage.getItem('empresa_id') || localStorage.getItem('empresaId') || 1;
                const response = await fetch(`/api/feriados/${id}?empresaId=${empresaId}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener el feriado');
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const feriado = result.data;
                    
                    $('#feriadoId').val(feriado.id);
                    $('#feriadoFecha').val(feriado.fechaFeriado);
                    $('#feriadoDia').val(feriado.diaFeriado);
                    $('#feriadoDenominacion').val(feriado.denominacion);
                    $('#modalFeriadoTitle').text('Editar Feriado');

                    const modal = new bootstrap.Modal(document.getElementById('modalFeriado'));
                    modal.show();
                }

            } catch (error) {
                console.error('Error al editar feriado:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar el feriado: ' + error.message,
                    confirmButtonColor: '#ffc107'
                });
            }
        },

        // Eliminar feriado
        eliminar: async function(id) {
            // Confirmación con SweetAlert
            const result = await Swal.fire({
                title: '¿Eliminar feriado?',
                text: 'Esta acción cambiará el estado del feriado a Inactivo',
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
                const response = await fetch(`/api/feriados/${id}?empresaId=${empresaId}`, {
                    method: 'DELETE'
                });

                const resultData = await response.json();

                if (resultData.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'Feriado eliminado exitosamente',
                        confirmButtonColor: '#ffc107',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    this.table.ajax.reload(null, false);
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: resultData.message || 'Error al eliminar el feriado',
                        confirmButtonColor: '#ffc107'
                    });
                }

            } catch (error) {
                console.error('Error al eliminar feriado:', error);
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
