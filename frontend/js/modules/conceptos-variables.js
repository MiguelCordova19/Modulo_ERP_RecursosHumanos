// Módulo de Conceptos Variables
const conceptosVariables = {
    tabla: null,
    empresaId: null,
    trabajadoresAgregados: [],
    conceptoSeleccionado: null,
    paginaActual: 1,
    registrosPorPagina: 10,
    modoEdicion: false,
    cabeceraIdEdicion: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Conceptos Variables inicializado');
        this.empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        console.log('🏢 Empresa ID:', this.empresaId);
        this.configurarEventos();
        this.inicializarTabla();
        this.cargarCombos();
        this.establecerPeriodoActual();
    },
    
    // Establecer período actual (mes y año actual)
    establecerPeriodoActual: function() {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const periodoActual = `${year}-${month}`;
        
        // Establecer en filtro de la página principal
        $('#filtroPeriodonceptosVariables').val(periodoActual);
        
        // Establecer en el modal (campo editable)
        $('#modalPeriodo').val(periodoActual);
        
        console.log('📅 Período establecido:', periodoActual);
    },
    
    // Inicializar DataTable
    inicializarTabla: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaConceptosVariables')) {
            $('#tablaConceptosVariables').DataTable().destroy();
        }
        
        this.tabla = $('#tablaConceptosVariables').DataTable({
            ajax: {
                url: `http://localhost:3000/api/conceptos-variables?empresaId=${this.empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, thrown) {
                    console.error('Error al cargar conceptos variables:', error);
                    // No mostrar notificación si es la primera carga
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
                    data: 'mes',
                    defaultContent: '-',
                    className: 'text-center'
                },
                { 
                    data: 'tipo_planilla',
                    defaultContent: '-'
                },
                { 
                    data: 'concepto',
                    defaultContent: '-'
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-sm btn-warning btn-accion-conceptos-variables btn-editar-concepto-variable" 
                                    data-id="${row.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-accion-conceptos-variables btn-eliminar-concepto-variable" 
                                    data-id="${row.id}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron registros coincidentes",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": activar para ordenar la columna ascendente",
                    "sortDescending": ": activar para ordenar la columna descendente"
                }
            },
            pageLength: 10,
            order: [[1, 'desc'], [2, 'desc']],
            drawCallback: function() {
                self.configurarEventosTabla();
            }
        });
    },
    
    // Configurar eventos de la tabla
    configurarEventosTabla: function() {
        const self = this;
        
        $('.btn-editar-concepto-variable').off('click').on('click', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $('.btn-eliminar-concepto-variable').off('click').on('click', function() {
            const id = $(this).data('id');
            self.eliminar(id);
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-concepto-variable').on('click', '.btn-nuevo-concepto-variable', function() {
            self.nuevo();
        });
        
        // Botón Filtrar
        $(document).off('click', '#btnFiltrarConceptosVariables').on('click', '#btnFiltrarConceptosVariables', function() {
            self.filtrar();
        });
        
        // Botón Buscar Concepto
        $(document).off('click', '#btnBuscarConcepto').on('click', '#btnBuscarConcepto', function() {
            self.buscarConcepto();
        });
        
        // Enter en buscar concepto
        $(document).off('keypress', '#buscarConcepto').on('keypress', '#buscarConcepto', function(e) {
            if (e.which === 13) {
                self.buscarConcepto();
            }
        });
        
        // Buscar trabajador mientras escribe (con debounce)
        let timeoutBusquedaTrabajador;
        $(document).off('input', '#nroDocTrabajador').on('input', '#nroDocTrabajador', function() {
            clearTimeout(timeoutBusquedaTrabajador);
            timeoutBusquedaTrabajador = setTimeout(function() {
                self.buscarTrabajadorPorDoc();
            }, 500); // Espera 500ms después de que el usuario deje de escribir
        });
        
        // También buscar al presionar Enter
        $(document).off('keypress', '#nroDocTrabajador').on('keypress', '#nroDocTrabajador', function(e) {
            if (e.which === 13) {
                clearTimeout(timeoutBusquedaTrabajador);
                self.buscarTrabajadorPorDoc();
            }
        });
        
        // Botón Agregar Trabajador
        $(document).off('click', '#btnAgregarTrabajador').on('click', '#btnAgregarTrabajador', function() {
            self.agregarTrabajador();
        });
        
        // Botón Guardar
        $(document).off('click', '#btnGuardarConceptosVariables').on('click', '#btnGuardarConceptosVariables', function() {
            self.guardarConceptosVariables();
        });
        
        // Paginación
        $(document).off('change', '#registrosPorPagina').on('change', '#registrosPorPagina', function() {
            self.registrosPorPagina = parseInt($(this).val());
            self.paginaActual = 1;
            self.renderizarTablaTrabajadores();
        });
        
        $(document).off('click', '#btnAnterior').on('click', '#btnAnterior', function() {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.renderizarTablaTrabajadores();
            }
        });
        
        $(document).off('click', '#btnSiguiente').on('click', '#btnSiguiente', function() {
            const totalPaginas = Math.ceil(self.trabajadoresAgregados.length / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.renderizarTablaTrabajadores();
            }
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalConceptoVariable').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
        
        // Cerrar resultados al hacer click fuera
        $(document).off('click.resultados').on('click.resultados', function(e) {
            if (!$(e.target).closest('#buscarConcepto, #resultadosConcepto').length) {
                $('#resultadosConcepto').remove();
            }
            if (!$(e.target).closest('#nroDocTrabajador, #nombreTrabajador, #resultadosTrabajador').length) {
                $('#resultadosTrabajador').remove();
            }
        });
    },

    // Cargar combos (Tipo Planilla)
    cargarCombos: async function() {
        await this.cargarTiposPlanilla();
    },
    
    // Cargar Tipos de Planilla (GLOBAL - sin filtro de empresa)
    cargarTiposPlanilla: async function() {
        try {
            console.log('🔄 Cargando tipos de planilla (GLOBAL)');
            const url = 'http://localhost:3000/api/tipo-planilla';
            console.log('📡 URL:', url);
            
            const response = await fetch(url);
            const result = await response.json();
            
            console.log('📦 Respuesta del servidor:', result);
            
            if (result.success && result.data) {
                const $select = $('#modalPlanilla');
                $select.empty().append('<option value="">* SELECCIONE *</option>');
                
                result.data.forEach(tipo => {
                    console.log('➕ Agregando planilla:', tipo.descripcion);
                    $select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
                });
                
                console.log('✅ Tipos de planilla cargados:', result.data.length);
            } else {
                console.warn('⚠️ No se encontraron tipos de planilla');
            }
        } catch (error) {
            console.error('❌ Error al cargar tipos de planilla:', error);
        }
    },


    // Filtrar por período
    filtrar: function() {
        const periodo = $('#filtroPeriodonceptosVariables').val();
        
        if (!periodo) {
            showNotification('Debe seleccionar un período', 'warning');
            return;
        }
        
        const [anio, mes] = periodo.split('-');
        
        if (this.tabla) {
            this.tabla.ajax.url(`http://localhost:3000/api/conceptos-variables?empresaId=${this.empresaId}&anio=${anio}&mes=${mes}`).load();
        }
    },

    // Nuevo concepto variable
    nuevo: function() {
        this.modoEdicion = false;
        this.cabeceraIdEdicion = null;
        this.limpiarModal();
        this.establecerPeriodoActual();
        
        // Actualizar título del modal
        $('#modalConceptoVariable .modal-title').html('<i class="fas fa-file-invoice-dollar me-2"></i>Nuevo Conceptos Variables');
        
        const modal = new bootstrap.Modal(document.getElementById('modalConceptoVariable'));
        modal.show();
    },
    
    // Limpiar modal
    limpiarModal: function() {
        $('#modalPeriodo').val('');
        $('#modalPlanilla').val('');
        $('#buscarConcepto').val('');
        $('#nroDocTrabajador').val('');
        $('#nombreTrabajador').val('');
        this.trabajadoresAgregados = [];
        this.conceptoSeleccionado = null;
        this.paginaActual = 1;
        this.modoEdicion = false;
        this.cabeceraIdEdicion = null;
        this.renderizarTablaTrabajadores();
    },
    
    // Buscar concepto
    buscarConcepto: async function() {
        const busqueda = $('#buscarConcepto').val().trim();
        
        if (!busqueda) {
            showNotification('Ingrese un concepto para buscar', 'warning');
            return;
        }
        
        if (busqueda.length < 2) {
            showNotification('Ingrese al menos 2 caracteres', 'warning');
            return;
        }
        
        try {
            console.log('🔍 Buscando concepto:', busqueda);
            const response = await fetch(`http://localhost:3000/api/concepto/buscar?empresaId=${this.empresaId}&busqueda=${encodeURIComponent(busqueda)}`);
            const result = await response.json();
            
            console.log('📦 Resultados:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                if (result.data.length === 1) {
                    // Un solo resultado, seleccionar automáticamente
                    this.conceptoSeleccionado = result.data[0];
                    $('#buscarConcepto').val(this.conceptoSeleccionado.descripcion);
                    showNotification(`✅ Concepto seleccionado: ${this.conceptoSeleccionado.descripcion}`, 'success');
                } else {
                    // Múltiples resultados, mostrar lista
                    this.mostrarResultadosConcepto(result.data);
                }
            } else {
                showNotification('❌ No se encontraron conceptos', 'warning');
                this.conceptoSeleccionado = null;
            }
        } catch (error) {
            console.error('❌ Error al buscar concepto:', error);
            showNotification('Error al buscar el concepto', 'danger');
        }
    },
    
    // Mostrar resultados de búsqueda de concepto
    mostrarResultadosConcepto: function(conceptos) {
        const self = this;
        
        // Crear dropdown con resultados
        let html = '<div class="list-group mt-2" id="resultadosConcepto" style="max-height: 200px; overflow-y: auto;">';
        
        conceptos.forEach(concepto => {
            html += `
                <button type="button" class="list-group-item list-group-item-action btn-seleccionar-concepto" 
                        data-concepto='${JSON.stringify(concepto)}'>
                    ${concepto.descripcion}
                </button>
            `;
        });
        
        html += '</div>';
        
        // Eliminar resultados anteriores
        $('#resultadosConcepto').remove();
        
        // Insertar después del input
        $('#buscarConcepto').parent().after(html);
        
        // Configurar eventos
        $('.btn-seleccionar-concepto').off('click').on('click', function() {
            const concepto = JSON.parse($(this).attr('data-concepto'));
            self.seleccionarConcepto(concepto);
        });
        
        showNotification(`Se encontraron ${conceptos.length} conceptos`, 'info');
    },
    
    // Seleccionar un concepto de la lista
    seleccionarConcepto: function(concepto) {
        this.conceptoSeleccionado = concepto;
        $('#buscarConcepto').val(concepto.descripcion);
        $('#resultadosConcepto').remove();
        showNotification(`✅ Concepto seleccionado: ${concepto.descripcion}`, 'success');
    },
    
    // Buscar trabajador por documento o nombre
    buscarTrabajadorPorDoc: async function() {
        const busqueda = $('#nroDocTrabajador').val().trim();
        
        if (!busqueda) {
            $('#nombreTrabajador').val('').removeData('trabajador-id');
            $('#resultadosTrabajador').remove();
            return;
        }
        
        if (busqueda.length < 2) {
            return;
        }
        
        try {
            console.log('🔍 Buscando trabajador:', busqueda);
            const response = await fetch(`http://localhost:3000/api/trabajador/buscar?empresaId=${this.empresaId}&busqueda=${encodeURIComponent(busqueda)}`);
            const result = await response.json();
            
            console.log('📦 Resultados trabajador:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                if (result.data.length === 1) {
                    // Un solo resultado, seleccionar automáticamente
                    this.seleccionarTrabajador(result.data[0]);
                } else {
                    // Múltiples resultados, mostrar lista
                    this.mostrarResultadosTrabajador(result.data);
                }
            } else {
                $('#nombreTrabajador').val('').removeData('trabajador-id');
                $('#resultadosTrabajador').remove();
                showNotification('❌ Trabajador no encontrado', 'warning');
            }
        } catch (error) {
            console.error('❌ Error al buscar trabajador:', error);
            $('#nombreTrabajador').val('').removeData('trabajador-id');
        }
    },
    
    // Mostrar resultados de búsqueda de trabajador
    mostrarResultadosTrabajador: function(trabajadores) {
        const self = this;
        
        // Crear dropdown con resultados
        let html = '<div class="list-group mt-2" id="resultadosTrabajador" style="max-height: 200px; overflow-y: auto; position: absolute; z-index: 1000; width: calc(100% - 30px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #dee2e6; border-radius: 4px; background: white;">';
        
        trabajadores.forEach(trabajador => {
            html += `
                <button type="button" class="list-group-item list-group-item-action btn-seleccionar-trabajador" 
                        data-trabajador='${JSON.stringify(trabajador)}' 
                        style="cursor: pointer; padding: 10px 15px; border: none; border-bottom: 1px solid #f0f0f0;">
                    <strong>${trabajador.numero_documento}</strong> - ${trabajador.nombre_completo}
                </button>
            `;
        });
        
        html += '</div>';
        
        // Eliminar resultados anteriores
        $('#resultadosTrabajador').remove();
        
        // Insertar después del campo de nombre
        $('#nombreTrabajador').parent().css('position', 'relative').append(html);
        
        // Configurar eventos
        $('.btn-seleccionar-trabajador').off('click').on('click', function() {
            const trabajador = JSON.parse($(this).attr('data-trabajador'));
            self.seleccionarTrabajador(trabajador);
        });
        
        showNotification(`Se encontraron ${trabajadores.length} trabajadores`, 'info');
    },
    
    // Seleccionar un trabajador de la lista
    seleccionarTrabajador: function(trabajador) {
        $('#nroDocTrabajador').val(trabajador.numero_documento);
        $('#nombreTrabajador').val(trabajador.nombre_completo).data('trabajador-id', trabajador.id);
        $('#resultadosTrabajador').remove();
        showNotification(`✅ Trabajador seleccionado: ${trabajador.nombre_completo}`, 'success');
    },
    
    // Agregar trabajador a la tabla
    agregarTrabajador: function() {
        const nroDoc = $('#nroDocTrabajador').val().trim();
        const nombreCompleto = $('#nombreTrabajador').val().trim();
        const trabajadorId = $('#nombreTrabajador').data('trabajador-id');
        
        if (!nroDoc || !nombreCompleto || !trabajadorId) {
            showNotification('Debe buscar y seleccionar un trabajador válido', 'warning');
            return;
        }
        
        if (!this.conceptoSeleccionado) {
            showNotification('Debe buscar y seleccionar un concepto primero', 'warning');
            return;
        }
        
        // Verificar si ya está agregado
        const yaExiste = this.trabajadoresAgregados.some(t => t.trabajadorId === trabajadorId);
        if (yaExiste) {
            showNotification('Este trabajador ya fue agregado', 'warning');
            return;
        }
        
        // Agregar a la lista
        this.trabajadoresAgregados.push({
            trabajadorId: trabajadorId,
            nroDoc: nroDoc,
            nombreCompleto: nombreCompleto,
            fecha: new Date().toISOString().split('T')[0],
            valor: 0
        });
        
        // Limpiar campos
        $('#nroDocTrabajador').val('');
        $('#nombreTrabajador').val('').removeData('trabajador-id');
        
        // Renderizar tabla
        this.renderizarTablaTrabajadores();
        
        showNotification('Trabajador agregado', 'success');
    },
    
    // Renderizar tabla de trabajadores
    renderizarTablaTrabajadores: function() {
        const tbody = $('#tbodyConceptosVariables');
        tbody.empty();
        
        if (this.trabajadoresAgregados.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            $('#infoRegistros').text('Mostrando 0 a 0 de 0 registros');
            return;
        }
        
        // Calcular paginación
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = Math.min(inicio + this.registrosPorPagina, this.trabajadoresAgregados.length);
        const trabajadoresPagina = this.trabajadoresAgregados.slice(inicio, fin);
        
        // Renderizar filas
        trabajadoresPagina.forEach((trabajador, index) => {
            const numeroGlobal = inicio + index + 1;
            tbody.append(`
                <tr data-index="${inicio + index}">
                    <td class="text-center">${numeroGlobal}</td>
                    <td class="text-center">${trabajador.nroDoc}</td>
                    <td>${trabajador.nombreCompleto}</td>
                    <td>
                        <input type="date" class="form-control form-control-sm fecha-trabajador" 
                               value="${trabajador.fecha}" data-index="${inicio + index}">
                    </td>
                    <td>
                        <input type="number" class="form-control form-control-sm valor-trabajador" 
                               value="${trabajador.valor}" step="0.01" min="0" 
                               data-index="${inicio + index}">
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger btn-eliminar-trabajador" 
                                data-index="${inicio + index}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
        
        // Actualizar info de registros
        $('#infoRegistros').text(`Mostrando ${inicio + 1} a ${fin} de ${this.trabajadoresAgregados.length} registros`);
        
        // Configurar eventos de la tabla
        this.configurarEventosTablaModal();
    },
    
    // Configurar eventos de la tabla del modal
    configurarEventosTablaModal: function() {
        const self = this;
        
        // Actualizar fecha
        $('.fecha-trabajador').off('change').on('change', function() {
            const index = $(this).data('index');
            const fecha = $(this).val();
            self.trabajadoresAgregados[index].fecha = fecha;
        });
        
        // Actualizar valor
        $('.valor-trabajador').off('change').on('change', function() {
            const index = $(this).data('index');
            const valor = parseFloat($(this).val()) || 0;
            self.trabajadoresAgregados[index].valor = valor;
        });
        
        // Eliminar trabajador
        $('.btn-eliminar-trabajador').off('click').on('click', function() {
            const index = $(this).data('index');
            self.trabajadoresAgregados.splice(index, 1);
            self.renderizarTablaTrabajadores();
            showNotification('Trabajador eliminado', 'info');
        });
    },
    
    // Guardar conceptos variables
    guardarConceptosVariables: async function() {
        const periodo = $('#modalPeriodo').val();
        const planillaId = $('#modalPlanilla').val();
        
        if (!periodo) {
            showNotification('Debe seleccionar un período', 'warning');
            return;
        }
        
        if (!planillaId) {
            showNotification('Debe seleccionar una planilla', 'warning');
            return;
        }
        
        if (!this.conceptoSeleccionado) {
            showNotification('Debe buscar y seleccionar un concepto', 'warning');
            return;
        }
        
        if (this.trabajadoresAgregados.length === 0) {
            showNotification('Debe agregar al menos un trabajador', 'warning');
            return;
        }
        
        const [anio, mes] = periodo.split('-');
        const usuarioId = parseInt(localStorage.getItem('usuario_id')) || 1;
        
        const datos = {
            anio: parseInt(anio),
            mes: parseInt(mes),
            planillaId: parseInt(planillaId),
            conceptoId: this.conceptoSeleccionado.id,
            trabajadores: this.trabajadoresAgregados.map(t => ({
                trabajadorId: t.trabajadorId,
                fecha: t.fecha,
                valor: t.valor
            })),
            empresaId: this.empresaId,
            usuarioId: usuarioId
        };
        
        try {
            $('#btnGuardarConceptosVariables').prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');
            
            // Si es modo edición, primero eliminar el registro anterior
            if (this.modoEdicion && this.cabeceraIdEdicion) {
                console.log('🔄 Modo edición: eliminando registro anterior ID:', this.cabeceraIdEdicion);
                
                const deleteResponse = await fetch(`http://localhost:3000/api/conceptos-variables/${this.cabeceraIdEdicion}?usuarioId=${usuarioId}`, {
                    method: 'DELETE'
                });
                
                const deleteResult = await deleteResponse.json();
                
                if (!deleteResult.success) {
                    showNotification('Error al actualizar: ' + deleteResult.message, 'danger');
                    return;
                }
                
                console.log('✅ Registro anterior eliminado');
            }
            
            // Crear nuevo registro (o recrear en caso de edición)
            const response = await fetch('http://localhost:3000/api/conceptos-variables/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const mensaje = this.modoEdicion 
                    ? `Concepto variable actualizado exitosamente (${this.trabajadoresAgregados.length} trabajadores)`
                    : `${this.trabajadoresAgregados.length} conceptos variables guardados exitosamente`;
                
                showNotification(mensaje, 'success');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalConceptoVariable'));
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
            console.error('Error al guardar conceptos variables:', error);
            showNotification('Error al guardar los conceptos variables', 'danger');
        } finally {
            $('#btnGuardarConceptosVariables').prop('disabled', false)
                .html('<i class="fas fa-save me-2"></i>Guardar');
        }
    },

    // Editar concepto variable
    editar: async function(id) {
        try {
            console.log('📝 Editando concepto variable ID:', id);
            
            // Obtener detalle del concepto variable
            const response = await fetch(`http://localhost:3000/api/conceptos-variables/${id}/detalle`);
            const result = await response.json();
            
            if (!result.success || !result.data || result.data.length === 0) {
                showNotification('No se pudo cargar el detalle del concepto variable', 'danger');
                return;
            }
            
            const detalle = result.data;
            const primerRegistro = detalle[0];
            
            console.log('📦 Detalle cargado:', detalle);
            
            // Activar modo edición
            this.modoEdicion = true;
            this.cabeceraIdEdicion = id;
            
            // Limpiar modal
            this.limpiarModal();
            
            // Establecer período
            const periodo = `${primerRegistro.anio}-${String(primerRegistro.mes).padStart(2, '0')}`;
            $('#modalPeriodo').val(periodo);
            
            // Establecer planilla
            $('#modalPlanilla').val(primerRegistro.planilla_id);
            
            // Establecer concepto
            this.conceptoSeleccionado = {
                id: primerRegistro.concepto_id,
                descripcion: primerRegistro.concepto
            };
            $('#buscarConcepto').val(primerRegistro.concepto);
            
            // Cargar trabajadores
            this.trabajadoresAgregados = detalle.map(item => ({
                trabajadorId: item.trabajador_id,
                nroDoc: item.numero_documento,
                nombreCompleto: item.trabajador,
                fecha: item.fecha,
                valor: parseFloat(item.valor) || 0
            }));
            
            // Renderizar tabla
            this.renderizarTablaTrabajadores();
            
            // Actualizar título del modal
            $('#modalConceptoVariable .modal-title').html('<i class="fas fa-edit me-2"></i>Editar Conceptos Variables');
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalConceptoVariable'));
            modal.show();
            
            showNotification(`Cargados ${detalle.length} trabajadores para edición`, 'success');
            
        } catch (error) {
            console.error('❌ Error al cargar concepto variable:', error);
            showNotification('Error al cargar el concepto variable', 'danger');
        }
    },

    // Eliminar concepto variable
    eliminar: async function(id) {
        if (!confirm('¿Está seguro de eliminar este concepto variable?')) {
            return;
        }
        
        try {
            const usuarioId = localStorage.getItem('usuario_id') || 1;
            const response = await fetch(`http://localhost:3000/api/conceptos-variables/${id}?usuarioId=${usuarioId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Concepto variable eliminado exitosamente', 'success');
                if (this.tabla) {
                    this.tabla.ajax.reload();
                }
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar concepto variable:', error);
            showNotification('Error al eliminar el concepto variable', 'danger');
        }
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo conceptos-variables.js cargado');
    
    if ($('#tablaConceptosVariables').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        conceptosVariables.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerConceptosVariables = new MutationObserver(function(mutations) {
    if ($('#tablaConceptosVariables').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerConceptosVariables.disconnect();
        conceptosVariables.init();
    }
});

if (document.querySelector('main')) {
    observerConceptosVariables.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
