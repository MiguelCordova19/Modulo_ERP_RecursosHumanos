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
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.table = $('#tablaConceptos').DataTable({
            ajax: {
                url: `/api/conceptos?empresaId=${empresaId}`,
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
                        // Mostrar la descripción personalizada, si no existe mostrar la del tributo
                        const descripcion = data || row.tributoDescripcion || 'Sin descripción';
                        return `<div class="text-truncate" style="max-width: 300px;" title="${descripcion}">${descripcion}</div>`;
                    }
                },
                {
                    data: 'tributoCodigoSunat',
                    width: '250px',
                    render: function(data, type, row) {
                        const codigo = data || '-';
                        const descripcion = row.tributoDescripcion || '';
                        
                        if (descripcion) {
                            return `
                                <div>
                                    <span class="badge bg-primary me-2">${codigo}</span>
                                    <span class="text-muted" style="font-size: 0.9em;">${descripcion}</span>
                                </div>
                            `;
                        }
                        return codigo;
                    }
                },
                {
                    data: 'tipoConceptoDescripcion',
                    className: 'text-center',
                    width: '150px',
                    render: function(data, type, row) {
                        const tipo = data || 'Sin tipo';
                        const badgeClass = tipo.includes('INGRESO') ? 'bg-success' : 
                                         tipo.includes('DESCUENTO') ? 'bg-danger' : 'bg-info';
                        return `<span class="badge ${badgeClass} badge-estado">${tipo}</span>`;
                    }
                },
                {
                    data: 'afecto',
                    className: 'text-center',
                    width: '100px',
                    render: function(data, type, row) {
                        const afecto = data === 1 ? 'SI' : 'NO';
                        const badgeClass = data === 1 ? 'bg-success' : 'bg-warning';
                        return `<span class="badge ${badgeClass} badge-estado">${afecto}</span>`;
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
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function() {
                const api = this.api();
                
                // Crear una segunda fila de encabezados para los filtros
                $('#tablaConceptos thead tr').clone(true).addClass('filters').appendTo('#tablaConceptos thead');
                
                // Agregar filtros en la segunda fila
                api.columns([0, 1, 2, 3, 4]).every(function(index) {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    // Crear input de búsqueda en la segunda fila
                    const input = $(`<input type="text" class="form-control form-control-sm" placeholder="Filtrar ${title}" style="width: 100%;" />`)
                        .appendTo($('#tablaConceptos thead tr.filters th').eq(index).empty())
                        .on('click', function(e) {
                            e.stopPropagation();
                        })
                        .on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
                
                // Limpiar la celda de acciones en la fila de filtros
                $('#tablaConceptos thead tr.filters th').eq(5).empty();
                
                console.log('✅ DataTable inicializada con filtros en fila separada');
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
            $('#conceptoTributoId').val('');
            $('#tributoSugerencias').hide().empty();
            $('#conceptoTipo').prop('disabled', true).val('');
            $('#tipoRequerido').hide();
            $('#tipoAyuda').text('Este campo se habilitará si selecciona "Afecto: Sí"');
        });
        
        // Autocomplete para tributos
        this.configurarAutocompleteTributos();
        
        // Evento para habilitar/deshabilitar campo Tipo según Afecto
        this.configurarAfectoTipo();
        
        // Evento para habilitar/deshabilitar tributo según Tipo Concepto
        this.configurarTipoConcepto();
    },
    
    // Configurar lógica de Afecto -> Tipo
    configurarAfectoTipo: function() {
        const self = this;
        
        $('input[name="conceptoAfecto"]').on('change', function() {
            const afecto = $(this).val();
            
            if (afecto === 'SI') {
                // Habilitar campo Tipo
                $('#conceptoTipo').prop('disabled', false);
                $('#tipoRequerido').show();
                $('#tipoAyuda').text('Seleccione un tipo de total');
                
                // Cargar tipos de totales si no están cargados
                if ($('#conceptoTipo option').length <= 1) {
                    self.cargarTiposTotales();
                }
                
                console.log('✅ Campo Tipo habilitado (Afecto: Sí)');
            } else {
                // Deshabilitar campo Tipo y limpiar selección
                $('#conceptoTipo').prop('disabled', true).val('');
                $('#tipoRequerido').hide();
                $('#tipoAyuda').text('No requerido cuando Afecto es "No"');
                
                console.log('⚠️ Campo Tipo deshabilitado (Afecto: No)');
            }
        });
    },
    
    // Configurar lógica de Tipo Concepto -> Tributo
    configurarTipoConcepto: function() {
        $('#conceptoTipoConcepto').on('change', function() {
            const tipoConceptoId = $(this).val();
            const tipoConceptoTexto = $(this).find('option:selected').text().toUpperCase();
            const esTipoTotales = tipoConceptoTexto.includes('TOTALES') || tipoConceptoId === '03';
            
            if (esTipoTotales) {
                // Si es TOTALES, el tributo no es obligatorio
                $('#conceptoNombreTributo').prop('required', false);
                $('#conceptoNombreTributo').attr('placeholder', 'Opcional para tipo TOTALES');
                console.log('ℹ️ Tributo no obligatorio (Tipo: TOTALES)');
            } else {
                // Para otros tipos, el tributo es obligatorio
                $('#conceptoNombreTributo').prop('required', true);
                $('#conceptoNombreTributo').attr('placeholder', 'Buscar por código o nombre del tributo...');
                console.log('✅ Tributo obligatorio');
            }
        });
    },
    
    // Configurar autocomplete de tributos
    configurarAutocompleteTributos: function() {
        const self = this;
        let timeoutId = null;
        
        // Evento de escritura en el campo
        $('#conceptoNombreTributo').on('input', function() {
            const busqueda = $(this).val().trim();
            
            // Limpiar timeout anterior
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Si está vacío, ocultar sugerencias
            if (busqueda.length < 2) {
                $('#tributoSugerencias').hide().empty();
                $('#conceptoTributoId').val('');
                return;
            }
            
            // Esperar 300ms antes de buscar (debounce)
            timeoutId = setTimeout(() => {
                self.buscarTributos(busqueda);
            }, 300);
        });
        
        // Cerrar sugerencias al hacer click fuera
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#conceptoNombreTributo, #tributoSugerencias').length) {
                $('#tributoSugerencias').hide();
            }
        });
        
        // Mostrar sugerencias al hacer focus si hay texto
        $('#conceptoNombreTributo').on('focus', function() {
            const busqueda = $(this).val().trim();
            if (busqueda.length >= 2) {
                self.buscarTributos(busqueda);
            }
        });
    },
    
    // Buscar tributos en el backend
    buscarTributos: async function(busqueda) {
        try {
            const response = await fetch(`/api/tributos/buscar?q=${encodeURIComponent(busqueda)}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.mostrarSugerenciasTributos(result.data);
            } else {
                $('#tributoSugerencias').hide().empty();
            }
        } catch (error) {
            console.error('Error al buscar tributos:', error);
            $('#tributoSugerencias').hide().empty();
        }
    },
    
    // Mostrar sugerencias de tributos
    mostrarSugerenciasTributos: function(tributos) {
        const container = $('#tributoSugerencias');
        container.empty();
        
        if (tributos.length === 0) {
            container.hide();
            return;
        }
        
        // Limitar a 10 resultados
        const tributosMostrar = tributos.slice(0, 10);
        
        tributosMostrar.forEach(tributo => {
            const item = $(`
                <div class="list-group-item" data-tributo-id="${tributo.id}" data-tributo-codigo="${tributo.codigoSunat}">
                    <span class="tributo-codigo">${tributo.codigoSunat}</span>
                    <span class="tributo-descripcion">${tributo.descripcion}</span>
                </div>
            `);
            
            // Evento click en la sugerencia
            item.on('click', () => {
                this.seleccionarTributo(tributo);
            });
            
            container.append(item);
        });
        
        container.show();
    },
    
    // Seleccionar un tributo
    seleccionarTributo: function(tributo) {
        $('#conceptoTributoId').val(tributo.id);
        $('#conceptoNombreTributo').val(`${tributo.codigoSunat} - ${tributo.descripcion}`);
        
        // Auto-llenar descripción con el nombre del tributo (sin el código)
        // Solo si el campo está vacío
        if (!$('#conceptoDescripcion').val()) {
            $('#conceptoDescripcion').val(tributo.descripcion);
        }
        
        $('#tributoSugerencias').hide().empty();
        
        console.log('✅ Tributo seleccionado:', tributo);
    },

    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    },

    // Cargar tipos de concepto en el combobox
    cargarTiposConcepto: async function() {
        try {
            const response = await fetch('/api/tipos-concepto');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#conceptoTipoConcepto');
                select.empty();
                select.append('<option value="">--SELECCIONAR--</option>');
                
                result.data.forEach(tipo => {
                    select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
                });
                
                console.log('✅ Tipos de concepto cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de concepto:', error);
            showNotification('Error al cargar tipos de concepto', 'danger');
        }
    },

    // Cargar tipos de totales en el combobox
    cargarTiposTotales: async function() {
        try {
            const response = await fetch('/api/tipos-totales');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#conceptoTipo');
                select.empty();
                select.append('<option value="">* SELECCIONAR *</option>');
                
                result.data.forEach(tipo => {
                    select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
                });
                
                console.log('✅ Tipos de totales cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de totales:', error);
            showNotification('Error al cargar tipos de totales', 'danger');
        }
    },

    // Abrir modal para nuevo concepto
    nuevo: async function() {
        $('#formConcepto')[0].reset();
        $('#conceptoId').val('');
        $('#modalConceptoTitle').text('Nuevo Conceptos');
        
        // Deshabilitar campo Tipo inicialmente
        $('#conceptoTipo').prop('disabled', true).val('');
        $('#tipoRequerido').hide();
        $('#tipoAyuda').text('Este campo se habilitará si selecciona "Afecto: Sí"');
        
        // Cargar solo tipos de concepto (tipos de totales se cargan cuando se selecciona Afecto: Sí)
        await this.cargarTiposConcepto();
        
        const modal = new bootstrap.Modal(document.getElementById('modalConcepto'));
        modal.show();
    },

    // Guardar concepto (crear o actualizar)
    guardar: async function() {
        try {
            const id = $('#conceptoId').val();
            const tributoId = $('#conceptoTributoId').val();
            const tipoConceptoId = $('#conceptoTipoConcepto').val();
            const tipoConceptoTexto = $('#conceptoTipoConcepto option:selected').text().toUpperCase();
            const descripcion = $('#conceptoDescripcion').val().trim();
            const afectoRadio = $('input[name="conceptoAfecto"]:checked').val();
            const tipoTotalesId = $('#conceptoTipo').val();
            
            // Validaciones
            if (!tipoConceptoId) {
                showNotification('Por favor seleccione un tipo de concepto', 'warning');
                $('#conceptoTipoConcepto').focus();
                return;
            }
            
            // Solo validar tributo si NO es tipo TOTALES
            const esTipoTotales = tipoConceptoTexto.includes('TOTALES') || tipoConceptoId === '03';
            if (!esTipoTotales && !tributoId) {
                showNotification('Por favor seleccione un tributo válido', 'warning');
                $('#conceptoNombreTributo').focus();
                return;
            }
            
            if (!descripcion) {
                showNotification('Por favor ingrese una descripción', 'warning');
                $('#conceptoDescripcion').focus();
                return;
            }
            
            if (!afectoRadio) {
                showNotification('Por favor seleccione si es afecto o no', 'warning');
                return;
            }
            
            // Solo validar Tipo si Afecto es "SI"
            if (afectoRadio === 'SI' && !tipoTotalesId) {
                showNotification('Por favor seleccione un tipo (requerido cuando es afecto)', 'warning');
                $('#conceptoTipo').focus();
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
                tributoId: tributoId,  // String (ej: "01", "02")
                tipoConceptoId: tipoConceptoId,  // String (ej: "01", "02")
                descripcion: descripcion,  // String editable
                afecto: afectoRadio === 'SI' ? 1 : 0,
                tipoTotalesId: tipoTotalesId || null,  // String (ej: "01", "02") o null
                empresaId: parseInt(empresaId)
            };
            
            console.log('📤 Datos a enviar:', datos);
            
            const url = id ? `/api/conceptos/${id}?usuarioId=${usuarioId}` : `/api/conceptos?usuarioId=${usuarioId}`;
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
                
                console.log('📝 Concepto a editar:', concepto);
                
                // Establecer ID
                $('#conceptoId').val(concepto.id);
                
                // Cargar tipos de concepto
                await this.cargarTiposConcepto();
                $('#conceptoTipoConcepto').val(concepto.tipoConceptoId);
                
                // Establecer descripción
                $('#conceptoDescripcion').val(concepto.descripcion || '');
                
                // Establecer tributo (buscar y mostrar)
                if (concepto.tributoId) {
                    try {
                        const tributoResponse = await fetch(`/api/tributos/${concepto.tributoId}`);
                        const tributoResult = await tributoResponse.json();
                        if (tributoResult.success && tributoResult.data) {
                            const tributo = tributoResult.data;
                            $('#conceptoTributoId').val(tributo.id);
                            $('#conceptoNombreTributo').val(`${tributo.codigoSunat} - ${tributo.descripcion}`);
                        }
                    } catch (error) {
                        console.error('Error al cargar tributo:', error);
                    }
                }
                
                // Establecer afecto
                const afectoValue = concepto.afecto === 1 ? 'SI' : 'NO';
                $(`input[name="conceptoAfecto"][value="${afectoValue}"]`).prop('checked', true);
                
                // Cargar tipos de totales si es afecto
                if (concepto.afecto === 1) {
                    $('#conceptoTipo').prop('disabled', false);
                    $('#tipoRequerido').show();
                    $('#tipoAyuda').text('Seleccione un tipo de total');
                    await this.cargarTiposTotales();
                    $('#conceptoTipo').val(concepto.tipoTotalesId);
                } else {
                    $('#conceptoTipo').prop('disabled', true).val('');
                    $('#tipoRequerido').hide();
                    $('#tipoAyuda').text('No requerido cuando Afecto es "No"');
                }
                
                $('#modalConceptoTitle').text('Editar Concepto');
                
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
            // Obtener usuario_id del localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id || user.usuario_id;
            
            if (!usuarioId) {
                showNotification('Error: No se encontró el ID del usuario', 'danger');
                return;
            }
            
            const response = await fetch(`/api/conceptos/${id}?usuarioId=${usuarioId}`, {
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

// Exportar para uso global (solo si no existe)
if (typeof window.concepto === 'undefined') {
    window.concepto = concepto;
}