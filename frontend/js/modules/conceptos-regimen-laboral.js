// Módulo de Conceptos por Régimen Laboral - Versión actualizada
const conceptoRegimenLaboral = {
    table: null,
    conceptosAgregados: [],
    conceptoSeleccionado: null,
    paginaActual: 1,
    registrosPorPagina: 8,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Conceptos por Régimen Laboral inicializado');
        this.cargarRegimenesLaborales();
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Configurar eventos
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
        
        // Botón Guardar
        $(document).off('click', '.btn-guardar-concepto-regimen').on('click', '.btn-guardar-concepto-regimen', function() {
            self.guardar();
        });
        
        // Autocomplete de conceptos
        this.configurarAutocompleteConceptos();
        
        // Botón agregar concepto
        $('#btnAgregarConcepto').on('click', function(e) {
            e.preventDefault();
            self.agregarConcepto();
        });
        
        // Botón eliminar concepto de la tabla (evento delegado)
        $(document).off('click', '.btn-eliminar-concepto').on('click', '.btn-eliminar-concepto', function(e) {
            e.preventDefault();
            const index = $(this).data('index');
            self.eliminarConcepto(index);
        });
        
        // Botones de paginación
        $(document).off('click', '#btnAnterior a').on('click', '#btnAnterior a', function(e) {
            e.preventDefault();
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.actualizarTablaConceptos();
            }
        });
        
        $(document).off('click', '#btnSiguiente a').on('click', '#btnSiguiente a', function(e) {
            e.preventDefault();
            const totalPaginas = Math.ceil(self.conceptosAgregados.length / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.actualizarTablaConceptos();
            }
        });
        
        // Click en números de página (delegado)
        $(document).off('click', '.page-numero').on('click', '.page-numero', function(e) {
            e.preventDefault();
            const pagina = $(this).data('pagina');
            self.paginaActual = pagina;
            self.actualizarTablaConceptos();
        });
        
        // Limpiar al cerrar modal
        $('#modalConceptoRegimen').on('hidden.bs.modal', function() {
            self.limpiarModal();
        });
    },

    // Configurar autocomplete de conceptos
    configurarAutocompleteConceptos: function() {
        const self = this;
        let timeoutId = null;
        
        $('#codConcepto').on('input', function() {
            const busqueda = $(this).val().trim();
            
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            if (busqueda.length < 1) {
                $('#conceptoSugerencias').hide().empty();
                return;
            }
            
            timeoutId = setTimeout(() => {
                self.buscarConceptos(busqueda);
            }, 300);
        });
        
        // Cerrar sugerencias al hacer click fuera
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#codConcepto, #conceptoSugerencias').length) {
                $('#conceptoSugerencias').hide();
            }
        });
    },

    // Buscar conceptos
    buscarConceptos: async function(busqueda) {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/conceptos?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Filtrar conceptos por búsqueda (código SUNAT o descripción)
                const conceptosFiltrados = result.data.filter(c => {
                    const codigoConcepto = c.id ? c.id.toString() : '';
                    const codigoSunat = c.tributoCodigoSunat || '';
                    const descripcion = c.descripcion || '';
                    const busquedaLower = busqueda.toLowerCase();
                    
                    return codigoConcepto.includes(busqueda) || 
                           codigoSunat.includes(busqueda) || 
                           descripcion.toLowerCase().includes(busquedaLower);
                });
                
                this.mostrarSugerenciasConceptos(conceptosFiltrados.slice(0, 10));
            }
        } catch (error) {
            console.error('Error al buscar conceptos:', error);
        }
    },

    // Mostrar sugerencias de conceptos
    mostrarSugerenciasConceptos: function(conceptos) {
        const container = $('#conceptoSugerencias');
        container.empty();
        
        if (conceptos.length === 0) {
            container.hide();
            return;
        }
        
        conceptos.forEach(concepto => {
            // Mostrar código SUNAT del tributo en lugar del ID del concepto
            const codigoMostrar = concepto.tributoCodigoSunat || concepto.id;
            
            const item = $(`
                <div class="list-group-item" data-concepto-id="${concepto.id}">
                    <span class="concepto-codigo">${codigoMostrar}</span>
                    <span>${concepto.descripcion || 'Sin descripción'}</span>
                </div>
            `);
            
            item.on('click', () => {
                this.seleccionarConcepto(concepto);
            });
            
            container.append(item);
        });
        
        container.show();
    },

    // Seleccionar un concepto
    seleccionarConcepto: function(concepto) {
        this.conceptoSeleccionado = concepto;
        // Mostrar código SUNAT del tributo en lugar del ID del concepto
        const codigoMostrar = concepto.tributoCodigoSunat || concepto.id;
        $('#codConcepto').val(codigoMostrar);
        $('#conceptoNombre').val(concepto.descripcion || 'Sin descripción');
        $('#conceptoSugerencias').hide().empty();
        
        console.log('✅ Concepto seleccionado:', concepto);
    },

    // Agregar concepto a la tabla
    agregarConcepto: function() {
        if (!this.conceptoSeleccionado) {
            showNotification('Por favor seleccione un concepto', 'warning');
            return;
        }
        
        // Verificar si ya está agregado
        const yaExiste = this.conceptosAgregados.find(c => c.id === this.conceptoSeleccionado.id);
        if (yaExiste) {
            showNotification('Este concepto ya fue agregado', 'warning');
            return;
        }
        
        // Agregar a la lista
        this.conceptosAgregados.push(this.conceptoSeleccionado);
        
        // Actualizar tabla
        this.actualizarTablaConceptos();
        
        // Limpiar campos
        $('#codConcepto').val('');
        $('#conceptoNombre').val('');
        this.conceptoSeleccionado = null;
        
        showNotification('Concepto agregado', 'success');
    },

    // Actualizar tabla de conceptos agregados
    actualizarTablaConceptos: function() {
        const tbody = $('#tablaConceptosAgregados');
        tbody.empty();
        
        if (this.conceptosAgregados.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            $('#infoRegistros').text('Mostrando 0 a 0 de 0 registros');
            $('#btnAnterior').addClass('disabled');
            $('#btnSiguiente').addClass('disabled');
            // Limpiar números de página
            $('#paginacionConceptos').find('.page-numero').parent().remove();
            return;
        }
        
        // Calcular paginación
        const totalRegistros = this.conceptosAgregados.length;
        const totalPaginas = Math.ceil(totalRegistros / this.registrosPorPagina);
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = Math.min(inicio + this.registrosPorPagina, totalRegistros);
        
        // Obtener registros de la página actual
        const conceptosPagina = this.conceptosAgregados.slice(inicio, fin);
        
        conceptosPagina.forEach((concepto, indexPagina) => {
            const indexReal = inicio + indexPagina;
            // Mostrar el código SUNAT del tributo en lugar del ID del concepto
            const codigoMostrar = concepto.tributoCodigoSunat || concepto.id;
            
            const row = $(`
                <tr>
                    <td class="text-center">${indexReal + 1}</td>
                    <td>${codigoMostrar}</td>
                    <td>${concepto.descripcion || 'Sin descripción'}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger btn-eliminar-concepto" data-index="${indexReal}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
            tbody.append(row);
        });
        
        // Actualizar información de registros
        $('#infoRegistros').text(`Mostrando ${inicio + 1} a ${fin} de ${totalRegistros} registros`);
        
        // Generar números de página
        this.generarPaginacion(totalPaginas);
    },
    
    // Generar botones de paginación
    generarPaginacion: function(totalPaginas) {
        const paginacion = $('#paginacionConceptos');
        
        // Limpiar números de página anteriores
        paginacion.find('.page-numero').parent().remove();
        
        // Habilitar/deshabilitar botón Anterior
        if (this.paginaActual === 1) {
            $('#btnAnterior').addClass('disabled');
        } else {
            $('#btnAnterior').removeClass('disabled');
        }
        
        // Generar números de página
        const maxBotones = 5; // Máximo de botones numéricos a mostrar
        let inicio = Math.max(1, this.paginaActual - Math.floor(maxBotones / 2));
        let fin = Math.min(totalPaginas, inicio + maxBotones - 1);
        
        // Ajustar inicio si estamos cerca del final
        if (fin - inicio < maxBotones - 1) {
            inicio = Math.max(1, fin - maxBotones + 1);
        }
        
        for (let i = inicio; i <= fin; i++) {
            const activeClass = i === this.paginaActual ? 'active' : '';
            const pageItem = $(`
                <li class="page-item ${activeClass}">
                    <a class="page-link page-numero" href="#" data-pagina="${i}">${i}</a>
                </li>
            `);
            pageItem.insertBefore($('#btnSiguiente'));
        }
        
        // Habilitar/deshabilitar botón Siguiente
        if (this.paginaActual >= totalPaginas) {
            $('#btnSiguiente').addClass('disabled');
        } else {
            $('#btnSiguiente').removeClass('disabled');
        }
    },

    // Eliminar concepto de la lista
    eliminarConcepto: function(index) {
        this.conceptosAgregados.splice(index, 1);
        
        // Ajustar página actual si es necesario
        const totalPaginas = Math.ceil(this.conceptosAgregados.length / this.registrosPorPagina);
        if (this.paginaActual > totalPaginas && totalPaginas > 0) {
            this.paginaActual = totalPaginas;
        }
        
        this.actualizarTablaConceptos();
        showNotification('Concepto eliminado', 'info');
    },

    // Limpiar modal
    limpiarModal: function() {
        $('#formConceptoRegimen')[0].reset();
        $('#conceptoRegimenId').val('');
        $('#codConcepto').val('');
        $('#conceptoNombre').val('');
        $('#conceptoSugerencias').hide().empty();
        $('#conceptoRegimenLaboral').prop('disabled', false); // Habilitar select
        this.conceptosAgregados = [];
        this.conceptoSeleccionado = null;
        this.paginaActual = 1; // Resetear paginación
        this.actualizarTablaConceptos();
    },

    // Abrir modal para nuevo
    nuevo: async function() {
        this.limpiarModal();
        $('#modalConceptoRegimenTitle').text('Nuevo Conceptos Por Regimen Laboral');
        await this.cargarRegimenesLaborales();
        
        const modal = new bootstrap.Modal(document.getElementById('modalConceptoRegimen'));
        modal.show();
    },

    // Guardar (crear o actualizar)
    guardar: async function() {
        try {
            const regimenId = $('#conceptoRegimenLaboral').val();
            const conceptoRegimenId = $('#conceptoRegimenId').val(); // ID para edición
            
            if (!regimenId) {
                showNotification('Por favor seleccione un régimen laboral', 'warning');
                return;
            }
            
            if (this.conceptosAgregados.length === 0) {
                showNotification('Por favor agregue al menos un concepto', 'warning');
                return;
            }
            
            // Obtener empresa_id y usuario_id
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
            
            const conceptosIds = this.conceptosAgregados.map(c => c.id);
            
            const datos = {
                regimenLaboralId: regimenId,
                empresaId: parseInt(empresaId),
                conceptos: conceptosIds
            };
            
            console.log('📤 Datos a enviar:', datos);
            console.log('🔄 Modo:', conceptoRegimenId ? 'Edición' : 'Creación');
            
            $('.btn-guardar-concepto-regimen').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');
            
            // Si hay ID, es edición (primero eliminar y luego crear)
            if (conceptoRegimenId) {
                // Eliminar asignaciones anteriores
                await fetch(`/api/conceptos-regimen-laboral/${conceptoRegimenId}?usuarioId=${usuarioId}`, {
                    method: 'DELETE'
                });
            }
            
            // Crear nuevas asignaciones
            const response = await fetch(`/api/conceptos-regimen-laboral/asignar?usuarioId=${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const mensaje = conceptoRegimenId ? 'Conceptos actualizados exitosamente' : 'Conceptos asignados exitosamente';
                showNotification(mensaje, 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalConceptoRegimen'));
                modal.hide();
                if (this.table) {
                    this.table.ajax.reload(null, false);
                }
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            $('.btn-guardar-concepto-regimen').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    // Cargar regímenes laborales
    cargarRegimenesLaborales: async function() {
        try {
            const response = await fetch('/api/regimenes-laborales');
            const result = await response.json();
            
            if (result.success && result.data) {
                const selectModal = $('#conceptoRegimenLaboral');
                selectModal.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    // Mostrar: CodSunat - Nombre del régimen
                    const optionText = `${regimen.codSunat} - ${regimen.regimenLaboral}`;
                    selectModal.append(`<option value="${regimen.id}">${optionText}</option>`);
                });
                
                console.log('✅ Regímenes laborales cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar regímenes laborales:', error);
        }
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        // Destruir tabla existente si hay
        if ($.fn.DataTable.isDataTable('#tablaConceptosRegimen')) {
            $('#tablaConceptosRegimen').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        // Crear la tabla
        this.table = $('#tablaConceptosRegimen').DataTable({
            ajax: {
                url: `/api/conceptos-regimen-laboral?empresaId=${empresaId}`,
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
                    data: 'imconceptosregimen_id',
                    className: 'text-center',
                    width: '80px'
                },
                {
                    data: 'regimen_codigo',
                    className: 'text-center',
                    width: '100px'
                },
                {
                    data: 'regimen_nombre',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 300px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'total_conceptos',
                    className: 'text-center',
                    width: '150px',
                    render: function(data, type, row) {
                        return `<span class="badge bg-info">${data} conceptos</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    width: '100px',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar" onclick="conceptoRegimenLaboral.editar(${row.imconceptosregimen_id})" title="Editar">
                                <i class="fas fa-edit"></i>
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
            order: [[0, 'desc']],
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function() {
                const api = this.api();
                
                // Crear una segunda fila de encabezados para los filtros
                $('#tablaConceptosRegimen thead tr').clone(true).addClass('filters').appendTo('#tablaConceptosRegimen thead');
                
                // Agregar filtros en la segunda fila
                api.columns([0, 1, 2, 3]).every(function(index) {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    // Crear input de búsqueda en la segunda fila
                    const input = $(`<input type="text" class="form-control form-control-sm" placeholder="Filtrar ${title}" style="width: 100%;" />`)
                        .appendTo($('#tablaConceptosRegimen thead tr.filters th').eq(index).empty())
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
                $('#tablaConceptosRegimen thead tr.filters th').eq(4).empty();
                
                console.log('✅ DataTable inicializada con filtros en fila separada');
            }
        });
    },

    
    // Editar - Cargar régimen y sus conceptos
    editar: async function(id) {
        try {
            console.log('🔄 Iniciando edición del régimen ID:', id);
            
            // Limpiar modal
            this.limpiarModal();
            
            // Cargar regímenes laborales
            await this.cargarRegimenesLaborales();
            
            // Obtener datos del régimen y sus conceptos
            const response = await fetch(`/api/conceptos-regimen-laboral/${id}/detalles`);
            const result = await response.json();
            
            console.log('📥 Datos recibidos del backend:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                // Guardar el ID para actualizar
                $('#conceptoRegimenId').val(id);
                
                // Obtener el régimen laboral ID del primer detalle
                const regimenId = result.data[0].regimen_id;
                console.log('🏢 Régimen ID:', regimenId);
                
                $('#conceptoRegimenLaboral').val(regimenId);
                
                // Deshabilitar el select de régimen (no se puede cambiar al editar)
                $('#conceptoRegimenLaboral').prop('disabled', true);
                
                // Cargar todos los conceptos de la empresa
                const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
                const conceptosResponse = await fetch(`/api/conceptos?empresaId=${empresaId}`);
                const conceptosResult = await conceptosResponse.json();
                
                console.log('📦 Conceptos disponibles:', conceptosResult.data?.length || 0);
                
                if (conceptosResult.success && conceptosResult.data) {
                    // Obtener los IDs de conceptos asignados
                    const conceptosIds = result.data.map(d => parseInt(d.concepto_id));
                    console.log('🎯 IDs de conceptos asignados:', conceptosIds);
                    
                    // Filtrar solo los conceptos que están asignados
                    this.conceptosAgregados = conceptosResult.data.filter(c => conceptosIds.includes(c.id));
                    
                    console.log('✅ Conceptos cargados:', this.conceptosAgregados.length);
                    
                    // Actualizar tabla
                    this.actualizarTablaConceptos();
                } else {
                    console.error('❌ Error al cargar conceptos');
                }
                
                // Cambiar título del modal
                $('#modalConceptoRegimenTitle').text('Editar Conceptos Por Régimen Laboral');
                
                // Mostrar modal
                const modal = new bootstrap.Modal(document.getElementById('modalConceptoRegimen'));
                modal.show();
                
                console.log('✅ Modal abierto para edición');
            } else if (result.success && result.data && result.data.length === 0) {
                // No hay conceptos asignados, pero podemos editar
                showNotification('Este régimen no tiene conceptos asignados aún', 'info');
                
                // Obtener el régimen desde la tabla principal
                const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
                const regimenResponse = await fetch(`/api/conceptos-regimen-laboral?empresaId=${empresaId}`);
                const regimenResult = await regimenResponse.json();
                
                if (regimenResult.success && regimenResult.data) {
                    const regimen = regimenResult.data.find(r => r.imconceptosregimen_id === id);
                    if (regimen) {
                        $('#conceptoRegimenId').val(id);
                        $('#conceptoRegimenLaboral').val(regimen.ic_regimenlaboral);
                        $('#conceptoRegimenLaboral').prop('disabled', true);
                        
                        $('#modalConceptoRegimenTitle').text('Editar Conceptos Por Régimen Laboral');
                        const modal = new bootstrap.Modal(document.getElementById('modalConceptoRegimen'));
                        modal.show();
                    }
                }
            } else {
                showNotification('Error al cargar datos del régimen', 'danger');
            }
        } catch (error) {
            console.error('❌ Error al editar:', error);
            showNotification('Error al cargar datos: ' + error.message, 'danger');
        }
    },


    // Actualizar tabla
    actualizar: function() {
        if (this.table) {
            this.table.ajax.reload(null, false);
            showNotification('Tabla actualizada', 'info');
        }
    }
};

// Exportar para uso global
if (typeof window.conceptoRegimenLaboral === 'undefined') {
    window.conceptoRegimenLaboral = conceptoRegimenLaboral;
}
