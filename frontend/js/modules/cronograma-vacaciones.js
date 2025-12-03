// Módulo de Cronograma de Vacaciones
const cronogramaVacaciones = {
    paginaActual: 1,
    registrosPorPagina: 10,
    totalRegistros: 0,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Cronograma de Vacaciones inicializado');
        this.configurarEventos();
        this.inicializarTabla();
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        if ($.fn.DataTable.isDataTable('#tablaCronogramaVacaciones')) {
            $('#tablaCronogramaVacaciones').DataTable().destroy();
        }
        
        this.tabla = $('#tablaCronogramaVacaciones').DataTable({
            ajax: {
                url: `http://localhost:3000/api/cronograma-vacaciones?empresaId=${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                }
            },
            columns: [
                { 
                    data: null,
                    render: function(data, type, row, meta) {
                        return meta.row + 1;
                    },
                    className: 'text-center'
                },
                { 
                    data: 'anio',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'fecha_desde',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'fecha_hasta',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'total_trabajadores',
                    defaultContent: '0',
                    className: 'text-center'
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary btn-accion-vacaciones btn-ver-cronograma" data-id="${row.cronograma_id}" title="Ver Detalle">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-vacaciones btn-eliminar-cronograma" data-id="${row.cronograma_id}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
            },
            pageLength: 10,
            order: [[0, 'asc']],
            drawCallback: function() {
                // Reconfigurar event listeners después de cada redibujado
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-ver-cronograma').off('click').on('click', function() {
            const id = $(this).data('id');
            self.ver(id);
        });
        
        $('.btn-eliminar-cronograma').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-cronograma').on('click', '.btn-nuevo-cronograma', function() {
            self.nuevo();
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-cronograma').on('click', '.btn-consultar-cronograma', function() {
            if (self.tabla) {
                self.tabla.ajax.reload();
            }
        });
        
        // Botón Generar
        $(document).off('click', '.btn-generar-cronograma').on('click', '.btn-generar-cronograma', function() {
            self.generar();
        });
        

        

        
        // Limpiar formulario al cerrar modal
        $('#modalCronogramaVacaciones').on('hidden.bs.modal', function() {
            $('#formCronogramaVacaciones')[0].reset();
            $('#cronogramaId').val('');
        });
    },



    // Nuevo cronograma
    nuevo: function() {
        $('#modalCronogramaTitle').text('Generación de Cronograma');
        $('#formCronogramaVacaciones')[0].reset();
        
        // Establecer fechas por defecto (año actual)
        const hoy = new Date();
        const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
        const finAnio = new Date(hoy.getFullYear(), 11, 31);
        
        $('#cronogramaFechaDesde').val(this.formatearFecha(inicioAnio));
        $('#cronogramaFechaHasta').val(this.formatearFecha(finAnio));
        
        const modal = new bootstrap.Modal(document.getElementById('modalCronogramaVacaciones'));
        modal.show();
    },
    
    // Formatear fecha a YYYY-MM-DD
    formatearFecha: function(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Generar cronograma
    generar: async function() {
        if (!$('#formCronogramaVacaciones')[0].checkValidity()) {
            $('#formCronogramaVacaciones')[0].reportValidity();
            return;
        }
        
        const fechaDesde = $('#cronogramaFechaDesde').val();
        const fechaHasta = $('#cronogramaFechaHasta').val();
        
        if (!fechaDesde || !fechaHasta) {
            showNotification('Debe seleccionar ambas fechas', 'warning');
            return;
        }
        
        try {
            const datos = {
                fechaDesde: fechaDesde,
                fechaHasta: fechaHasta,
                empresaId: parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1,
                usuarioId: parseInt(localStorage.getItem('usuario_id')) || 1
            };
            
            // Deshabilitar botón mientras genera
            $('.btn-generar-cronograma').prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin me-2"></i>Generando...');
            
            const response = await fetch('http://localhost:3000/api/cronograma-vacaciones/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Cronograma generado exitosamente', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCronogramaVacaciones'));
                if (modal) {
                    modal.hide();
                }
                if (this.tabla) {
                    this.tabla.ajax.reload();
                }
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al generar cronograma:', error);
            showNotification('Error al generar cronograma', 'danger');
        } finally {
            // Rehabilitar botón
            $('.btn-generar-cronograma').prop('disabled', false)
                .html('<i class="fas fa-sync-alt me-2"></i>Generar');
        }
    },

    // Ver cronograma
    ver: async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/cronograma-vacaciones/${id}/detalle`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.mostrarModalDetalle(result.data);
            } else {
                showNotification('Error al obtener detalle: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al obtener detalle:', error);
            showNotification('Error al obtener detalle del cronograma', 'danger');
        }
    },
    
    // Mostrar modal con detalle del cronograma
    mostrarModalDetalle: function(detalles) {
        const self = this;
        let html = `
            <div class="modal fade" id="modalDetalleCronograma" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalle del Cronograma de Vacaciones</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-3">
                                <i class="fas fa-info-circle me-2"></i>
                                Haga clic en las fechas u observaciones para editarlas. Los días se calculan automáticamente. Los cambios se guardan al presionar Enter o el botón ✓.
                            </div>
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered table-sm table-hover" id="tablaDetalleCronograma">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 40px;">#</th>
                                            <th style="width: 110px;">Nro. Documento</th>
                                            <th style="min-width: 200px;">Apellidos y Nombres</th>
                                            <th style="width: 120px;">Sede</th>
                                            <th style="width: 140px;">Cargo</th>
                                            <th style="width: 100px;">F. Ingreso</th>
                                            <th style="width: 120px;">F. Inicio Vac.</th>
                                            <th style="width: 120px;">F. Fin Vac.</th>
                                            <th style="width: 70px;">Días</th>
                                            <th style="min-width: 200px;">Observaciones</th>
                                            <th style="width: 60px;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;
        
        detalles.forEach((detalle, index) => {
            const fechaInicio = detalle.fecha_inicio || '';
            const fechaFin = detalle.fecha_fin || '';
            const dias = detalle.dias || '';
            const observaciones = detalle.observaciones || '';
            
            html += `
                <tr data-detalle-id="${detalle.detalle_id}">
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${detalle.numero_documento || '-'}</td>
                    <td>${detalle.apellidos_nombres || '-'}</td>
                    <td>${detalle.sede || '-'}</td>
                    <td>${detalle.cargo || '-'}</td>
                    <td class="text-center">${detalle.fecha_ingreso || '-'}</td>
                    <td class="text-center editable-cell" data-field="fechaInicio">
                        <span class="cell-display">${fechaInicio || '<span class="text-muted">-</span>'}</span>
                        <input type="date" class="form-control form-control-sm cell-input d-none" value="${fechaInicio}">
                    </td>
                    <td class="text-center editable-cell" data-field="fechaFin">
                        <span class="cell-display">${fechaFin || '<span class="text-muted">-</span>'}</span>
                        <input type="date" class="form-control form-control-sm cell-input d-none" value="${fechaFin}">
                    </td>
                    <td class="text-center" data-field="dias">
                        <span class="cell-display">${dias || '<span class="text-muted">-</span>'}</span>
                        <input type="number" class="form-control form-control-sm cell-input d-none bg-light" value="${dias}" min="0" max="365" readonly>
                    </td>
                    <td class="editable-cell" data-field="observaciones">
                        <span class="cell-display">${observaciones || '<span class="text-muted">-</span>'}</span>
                        <textarea class="form-control form-control-sm cell-input d-none" rows="2" maxlength="500" placeholder="Ingrese observaciones...">${observaciones}</textarea>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-success btn-guardar-detalle d-none" title="Guardar">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary btn-cancelar-detalle d-none" title="Cancelar">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Eliminar modal anterior si existe
        $('#modalDetalleCronograma').remove();
        
        // Agregar y mostrar nuevo modal
        $('body').append(html);
        const modal = new bootstrap.Modal(document.getElementById('modalDetalleCronograma'));
        modal.show();
        
        // Configurar eventos de edición
        this.configurarEdicionDetalle();
        
        // Limpiar al cerrar
        $('#modalDetalleCronograma').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    },
    
    // Configurar eventos de edición en el detalle
    configurarEdicionDetalle: function() {
        const self = this;
        
        // Click en celda editable para activar modo edición
        $(document).off('click', '.editable-cell').on('click', '.editable-cell', function() {
            const $cell = $(this);
            const $row = $cell.closest('tr');
            
            // Si ya está en modo edición, no hacer nada
            if ($cell.find('.cell-input').is(':visible')) {
                return;
            }
            
            // Activar modo edición
            $cell.find('.cell-display').addClass('d-none');
            $cell.find('.cell-input').removeClass('d-none').focus();
            
            // Mostrar botones de acción
            $row.find('.btn-guardar-detalle, .btn-cancelar-detalle').removeClass('d-none');
        });
        
        // Calcular días automáticamente cuando cambian las fechas
        $(document).off('change', '[data-field="fechaInicio"] .cell-input, [data-field="fechaFin"] .cell-input')
            .on('change', '[data-field="fechaInicio"] .cell-input, [data-field="fechaFin"] .cell-input', function() {
            const $row = $(this).closest('tr');
            self.calcularDiasAutomaticamente($row);
        });
        
        // Guardar cambios
        $(document).off('click', '.btn-guardar-detalle').on('click', '.btn-guardar-detalle', function() {
            const $row = $(this).closest('tr');
            self.guardarDetalle($row);
        });
        
        // Cancelar edición
        $(document).off('click', '.btn-cancelar-detalle').on('click', '.btn-cancelar-detalle', function() {
            const $row = $(this).closest('tr');
            self.cancelarEdicionDetalle($row);
        });
        
        // Guardar con Enter en los inputs
        $(document).off('keypress', '.cell-input').on('keypress', '.cell-input', function(e) {
            if (e.which === 13) { // Enter
                const $row = $(this).closest('tr');
                self.guardarDetalle($row);
            }
        });
        
        // Cancelar con Escape
        $(document).off('keydown', '.cell-input').on('keydown', '.cell-input', function(e) {
            if (e.which === 27) { // Escape
                const $row = $(this).closest('tr');
                self.cancelarEdicionDetalle($row);
            }
        });
    },
    
    // Calcular días automáticamente basado en las fechas
    calcularDiasAutomaticamente: function($row) {
        const fechaInicio = $row.find('[data-field="fechaInicio"] .cell-input').val();
        const fechaFin = $row.find('[data-field="fechaFin"] .cell-input').val();
        
        // Solo calcular si ambas fechas están presentes
        if (fechaInicio && fechaFin) {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            
            // Validar que fecha inicio no sea mayor a fecha fin
            if (inicio > fin) {
                showNotification('La fecha de inicio no puede ser mayor a la fecha fin', 'warning');
                return;
            }
            
            // Calcular diferencia en días (incluye ambos días)
            const diferenciaMilisegundos = fin - inicio;
            const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;
            
            // Actualizar el campo de días
            const $inputDias = $row.find('[data-field="dias"] .cell-input');
            $inputDias.val(dias);
            
            // Si el campo de días está visible, actualizar también el display
            if (!$inputDias.hasClass('d-none')) {
                $row.find('[data-field="dias"] .cell-display').html(dias);
            }
            
            console.log(`📅 Días calculados: ${dias} (desde ${fechaInicio} hasta ${fechaFin})`);
        }
    },
    
    // Guardar detalle editado
    guardarDetalle: async function($row) {
        const detalleId = $row.data('detalle-id');
        
        // Obtener valores de los inputs
        const fechaInicio = $row.find('[data-field="fechaInicio"] .cell-input').val();
        const fechaFin = $row.find('[data-field="fechaFin"] .cell-input').val();
        const dias = $row.find('[data-field="dias"] .cell-input').val();
        const observaciones = $row.find('[data-field="observaciones"] .cell-input').val().trim();
        
        // Validar que ambas fechas estén presentes
        if (!fechaInicio || !fechaFin) {
            showNotification('Debe ingresar ambas fechas (inicio y fin)', 'warning');
            return;
        }
        
        // Validar fechas
        if (fechaInicio > fechaFin) {
            showNotification('La fecha de inicio no puede ser mayor a la fecha fin', 'warning');
            return;
        }
        
        // Calcular días una vez más antes de guardar (por seguridad)
        this.calcularDiasAutomaticamente($row);
        const diasCalculados = $row.find('[data-field="dias"] .cell-input').val();
        
        try {
            const datos = {
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                dias: diasCalculados ? parseInt(diasCalculados) : null,
                observaciones: observaciones || null
            };
            
            const response = await fetch(`http://localhost:3000/api/cronograma-vacaciones/detalle/${detalleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Actualizar display con nuevos valores
                $row.find('[data-field="fechaInicio"] .cell-display').html(fechaInicio);
                $row.find('[data-field="fechaFin"] .cell-display').html(fechaFin);
                $row.find('[data-field="dias"] .cell-display').html(diasCalculados);
                $row.find('[data-field="observaciones"] .cell-display').html(observaciones || '<span class="text-muted">-</span>');
                
                // Salir del modo edición
                this.cancelarEdicionDetalle($row);
                
                showNotification(`Vacaciones guardadas: ${diasCalculados} días`, 'success');
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar detalle:', error);
            showNotification('Error al guardar los cambios', 'danger');
        }
    },
    
    // Cancelar edición de detalle
    cancelarEdicionDetalle: function($row) {
        // Ocultar inputs y mostrar displays
        $row.find('.cell-input').addClass('d-none');
        $row.find('.cell-display').removeClass('d-none');
        
        // Ocultar botones de acción
        $row.find('.btn-guardar-detalle, .btn-cancelar-detalle').addClass('d-none');
        
        // Restaurar valores originales en los inputs
        $row.find('.editable-cell').each(function() {
            const $cell = $(this);
            const displayValue = $cell.find('.cell-display').text().trim();
            if (displayValue !== '-') {
                $cell.find('.cell-input').val(displayValue);
            }
        });
    },

    // Eliminar cronograma
    eliminar: async function(id) {
        if (!confirm('¿Está seguro de eliminar este cronograma?')) {
            return;
        }
        
        try {
            const usuarioId = localStorage.getItem('usuario_id') || 1;
            const response = await fetch(`http://localhost:3000/api/cronograma-vacaciones/${id}?usuarioId=${usuarioId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Cronograma eliminado exitosamente', 'success');
                if (this.tabla) {
                    this.tabla.ajax.reload();
                }
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar cronograma:', error);
            showNotification('Error al eliminar cronograma', 'danger');
        }
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo cronograma-vacaciones.js cargado');
    
    if ($('#tablaCronogramaVacaciones').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        cronogramaVacaciones.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerCronogramaVacaciones = new MutationObserver(function(mutations) {
    if ($('#tablaCronogramaVacaciones').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerCronogramaVacaciones.disconnect();
        cronogramaVacaciones.init();
    }
});

if (document.querySelector('main')) {
    observerCronogramaVacaciones.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
