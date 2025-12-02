// Módulo de Puestos/Cargos con DataTables
const puestosCargos = window.puestosCargos || {
    tablaGrupos: null,
    tablaPuestos: null,
    puestosSeleccionados: [], // Array para almacenar puestos seleccionados temporalmente

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Puestos/Cargos inicializado');
        this.inicializarDataTables();
        this.configurarEventos();
    },

    // Cargar puestos para el select del modal de grupo
    cargarPuestosParaSelect: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/puestos?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const selectPuesto = $('#selectPuestoAgregar');
                selectPuesto.find('option:not(:first)').remove();
                
                result.data.forEach(puesto => {
                    const option = `<option value="${puesto.id}" data-nombre="${puesto.nombre}" data-descripcion="${puesto.descripcion}">
                        ${puesto.nombre} - ${puesto.descripcion}
                    </option>`;
                    selectPuesto.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        }
    },

    // Inicializar ambas DataTables
    inicializarDataTables: function() {
        this.inicializarTablaGrupos();
        this.inicializarTablaPuestos();
    },

    // Inicializar DataTable para Grupos
    inicializarTablaGrupos: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaGrupos')) {
            $('#tablaGrupos').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.tablaGrupos = $('#tablaGrupos').DataTable({
            ajax: {
                url: `/api/grupos?empresaId=${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar grupos:', error);
                    showNotification('Error al cargar los grupos', 'danger');
                }
            },
            columns: [
                {
                    data: 'id',
                    className: 'text-center fw-bold',
                    width: '80px',
                    render: function(data, type, row) {
                        return `<div title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'descripcion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 400px;" title="${data}">${data}</div>`;
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
                            <button class="btn btn-action btn-editar" onclick="puestosCargos.editarGrupo(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="puestosCargos.eliminarGrupo(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                searchPlaceholder: 'Buscar grupo...',
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
            dom: 'ltip',
            order: [[0, 'asc']],
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function() {
                const api = this.api();
                
                // Crear segunda fila para filtros
                const filterRow = $('<tr class="filters"></tr>').appendTo($(api.table().header()));
                
                api.columns([0, 1]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    const th = $('<th></th>').appendTo(filterRow);
                    const input = $(`<input type="text" placeholder="Filtrar..." />`)
                        .appendTo(th)
                        .on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
                
                // Columna de acciones sin filtro
                $('<th></th>').appendTo(filterRow);
            }
        });
    },

    // Inicializar DataTable para Puestos
    inicializarTablaPuestos: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaPuestos')) {
            $('#tablaPuestos').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.tablaPuestos = $('#tablaPuestos').DataTable({
            ajax: {
                url: `/api/puestos?empresaId=${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar puestos:', error);
                    showNotification('Error al cargar los puestos', 'danger');
                }
            },
            columns: [
                {
                    data: 'id',
                    className: 'text-center fw-bold',
                    width: '60px',
                    render: function(data, type, row) {
                        return `<div title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'nombre',
                    className: 'text-center',
                    width: '100px',
                    render: function(data, type, row) {
                        return `<span class="badge bg-primary">${data || '-'}</span>`;
                    }
                },
                {
                    data: 'descripcion',
                    width: '250px',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 250px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'grupoNombre',
                    width: '150px',
                    render: function(data, type, row) {
                        if (data) {
                            return `<span class="badge bg-success">${data}</span>`;
                        }
                        return '<span class="text-muted small">Sin grupo</span>';
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
                            <button class="btn btn-action btn-editar" onclick="puestosCargos.editarPuesto(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="puestosCargos.eliminarPuesto(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                searchPlaceholder: 'Buscar puesto...',
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
            dom: 'ltip',
            order: [[0, 'asc']],
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function() {
                const api = this.api();
                
                // Crear segunda fila para filtros
                const filterRow = $('<tr class="filters"></tr>').appendTo($(api.table().header()));
                
                api.columns([0, 1, 2, 3]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    
                    const th = $('<th></th>').appendTo(filterRow);
                    const input = $(`<input type="text" placeholder="Filtrar..." />`)
                        .appendTo(th)
                        .on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
                
                // Columna de acciones sin filtro
                $('<th></th>').appendTo(filterRow);
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        const self = this;
        
        // Botón Actualizar general
        $(document).off('click', '.btn-actualizar-puestos').on('click', '.btn-actualizar-puestos', function() {
            self.actualizar();
        });
        
        // Botón Nuevo Grupo
        $(document).off('click', '.btn-nuevo-grupo').on('click', '.btn-nuevo-grupo', function(e) {
            e.preventDefault();
            console.log('🔵 Click en botón Nuevo Grupo detectado');
            self.nuevoGrupo();
        });
        
        // Botón Nuevo Puesto
        $(document).off('click', '.btn-nuevo-puesto').on('click', '.btn-nuevo-puesto', function() {
            self.nuevoPuesto();
        });
        
        // Botón Guardar Grupo
        $(document).off('click', '.btn-guardar-grupo').on('click', '.btn-guardar-grupo', function() {
            self.guardarGrupo();
        });
        
        // Botón Guardar Puesto
        $(document).off('click', '.btn-guardar-puesto').on('click', '.btn-guardar-puesto', function() {
            self.guardarPuesto();
        });
        
        // Botón Agregar Puesto desde el combobox
        $(document).off('click', '.btn-agregar-puesto-grupo').on('click', '.btn-agregar-puesto-grupo', function(e) {
            e.preventDefault();
            self.agregarPuestoDesdeSelect();
        });
        
        // Botón Eliminar Puesto de la lista
        $(document).off('click', '.btn-eliminar-puesto-lista').on('click', '.btn-eliminar-puesto-lista', function() {
            const puestoId = $(this).data('puesto-id');
            self.eliminarPuestoDeLista(puestoId);
        });
        
        // Limpiar formularios al cerrar modales
        $('#modalGrupo').on('hidden.bs.modal', function() {
            $('#formGrupo')[0].reset();
            $('#grupoId').val('');
            $('.btn-guardar-grupo').html('<i class="fas fa-save me-1"></i>Crear Grupo');
            self.puestosSeleccionados = [];
            self.actualizarListaPuestos();
            // Limpiar todos los radio buttons
            $('input[type="radio"]').prop('checked', false);
        });
        
        $('#modalPuesto').on('hidden.bs.modal', function() {
            $('#formPuesto')[0].reset();
            $('#puestoId').val('');
            $('.btn-guardar-puesto').html('<i class="fas fa-save me-1"></i>Crear Puesto');
        });
    },

    // Actualizar ambas tablas
    actualizar: function() {
        if (this.tablaGrupos) {
            this.tablaGrupos.ajax.reload(null, false);
        }
        if (this.tablaPuestos) {
            this.tablaPuestos.ajax.reload(null, false);
        }
        this.cargarGruposParaSelect();
        showNotification('Tablas actualizadas', 'info');
    },

    // ========== GRUPOS ==========
    nuevoGrupo: function() {
        console.log('🔵 Abriendo modal de nuevo grupo...');
        
        $('#formGrupo')[0].reset();
        $('#grupoId').val('');
        $('#modalGrupoTitle').text('Crear grupo');
        
        // Limpiar lista de puestos seleccionados
        this.puestosSeleccionados = [];
        this.actualizarListaPuestos();
        
        // Cargar puestos disponibles en el select
        this.cargarPuestosParaSelect();
        
        const modalElement = document.getElementById('modalGrupo');
        console.log('🔵 Elemento modal encontrado:', modalElement);
        
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            console.log('🔵 Instancia de modal creada:', modal);
            modal.show();
            console.log('✅ Modal mostrado');
        } else {
            console.error('❌ No se encontró el elemento modal #modalGrupo');
        }
    },

    guardarGrupo: async function() {
        try {
            const id = $('#grupoId').val();
            const nombre = $('#grupoNombre').val().trim();
            
            if (!nombre) {
                showNotification('Por favor ingrese el nombre del grupo', 'warning');
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

            // Recoger datos de los radio buttons (evaluación ABCD)
            const evaluacion = {
                formacion: $('input[name="formacion"]:checked').val() || '',
                pasado_profesional: $('input[name="pasado_profesional"]:checked').val() || '',
                motivo_solicitud: $('input[name="motivo_solicitud"]:checked').val() || '',
                comportamiento: $('input[name="comportamiento"]:checked').val() || '',
                potencial: $('input[name="potencial"]:checked').val() || '',
                condiciones_personales: $('input[name="condiciones_personales"]:checked').val() || '',
                situacion_familiar: $('input[name="situacion_familiar"]:checked').val() || '',
                proceso_seleccion: $('input[name="proceso_seleccion"]:checked').val() || ''
            };

            let datos, url, method;
            
            // Si hay puestos seleccionados, usar el endpoint con-puestos
            if (this.puestosSeleccionados.length > 0) {
                // Preparar array de puestos con evaluación
                const puestos = this.puestosSeleccionados.map(puesto => ({
                    puestoId: parseInt(puesto.id),
                    evaluacion: evaluacion
                }));
                
                datos = {
                    nombre: nombre,
                    descripcion: nombre,
                    empresaId: parseInt(empresaId),
                    puestos: puestos
                };
                
                url = id 
                    ? `/api/grupos/${id}/con-puestos?usuarioId=${usuarioId}` 
                    : `/api/grupos/con-puestos?usuarioId=${usuarioId}`;
                method = id ? 'PUT' : 'POST';
            } else {
                // Sin puestos, usar el endpoint simple
                datos = { 
                    nombre: nombre,
                    descripcion: nombre,
                    empresaId: parseInt(empresaId)
                };
                
                url = id ? `/api/grupos/${id}?usuarioId=${usuarioId}` : `/api/grupos?usuarioId=${usuarioId}`;
                method = id ? 'PUT' : 'POST';
            }

            $('.btn-guardar-grupo').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

            console.log('📤 Enviando datos:', datos);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();
            console.log('📥 Respuesta:', result);
            
            if (result.success) {
                showNotification(
                    id ? 'Grupo actualizado exitosamente' : 'Grupo creado exitosamente',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalGrupo'));
                modal.hide();
                this.tablaGrupos.ajax.reload(null, false);
                this.tablaPuestos.ajax.reload(null, false); // Recargar también tabla de puestos
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar grupo:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            $('.btn-guardar-grupo').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Crear Grupo');
        }
    },

    editarGrupo: async function(id) {
        try {
            // Obtener datos del grupo
            const responseGrupo = await fetch(`/api/grupos/${id}`);
            
            if (!responseGrupo.ok) {
                throw new Error('Error al obtener el grupo');
            }

            const resultGrupo = await responseGrupo.json();
            if (!resultGrupo.success || !resultGrupo.data) {
                throw new Error('No se pudo obtener los datos del grupo');
            }

            const grupo = resultGrupo.data;
            
            // Cargar datos básicos del grupo
            $('#grupoId').val(grupo.id);
            $('#grupoNombre').val(grupo.nombre);
            $('#modalGrupoTitle').text('Editar grupo');
            $('.btn-guardar-grupo').html('<i class="fas fa-save me-1"></i>Actualizar Grupo');
            
            // Limpiar puestos seleccionados
            this.puestosSeleccionados = [];
            
            // Cargar puestos disponibles en el select
            await this.cargarPuestosParaSelect();
            
            // Obtener puestos asignados al grupo
            const responsePuestos = await fetch(`/api/grupos/${id}/puestos`);
            
            if (responsePuestos.ok) {
                const resultPuestos = await responsePuestos.json();
                console.log('📥 Puestos del grupo:', resultPuestos);
                
                if (resultPuestos.success && resultPuestos.data && resultPuestos.data.length > 0) {
                    // Cargar puestos asignados
                    resultPuestos.data.forEach((detalle, index) => {
                        // Agregar puesto a la lista
                        this.puestosSeleccionados.push({
                            id: detalle.puestoId,
                            nombre: detalle.puestoNombre,
                            descripcion: detalle.puestoDescripcion
                        });
                        
                        // Cargar evaluación desde el campo evaluacion (ya es un objeto)
                        if (detalle.evaluacion) {
                            const evaluacion = detalle.evaluacion;
                            console.log(`📋 Evaluación del puesto ${index + 1}:`, evaluacion);
                            
                            // Marcar los radio buttons según la evaluación guardada
                            // Solo marcar si es el primer puesto (asumimos que todos tienen la misma evaluación)
                            if (index === 0) {
                                if (evaluacion.formacion) {
                                    $(`input[name="formacion"][value="${evaluacion.formacion}"]`).prop('checked', true);
                                }
                                if (evaluacion.pasado_profesional) {
                                    $(`input[name="pasado_profesional"][value="${evaluacion.pasado_profesional}"]`).prop('checked', true);
                                }
                                if (evaluacion.motivo_solicitud) {
                                    $(`input[name="motivo_solicitud"][value="${evaluacion.motivo_solicitud}"]`).prop('checked', true);
                                }
                                if (evaluacion.comportamiento) {
                                    $(`input[name="comportamiento"][value="${evaluacion.comportamiento}"]`).prop('checked', true);
                                }
                                if (evaluacion.potencial) {
                                    $(`input[name="potencial"][value="${evaluacion.potencial}"]`).prop('checked', true);
                                }
                                if (evaluacion.condiciones_personales) {
                                    $(`input[name="condiciones_personales"][value="${evaluacion.condiciones_personales}"]`).prop('checked', true);
                                }
                                if (evaluacion.situacion_familiar) {
                                    $(`input[name="situacion_familiar"][value="${evaluacion.situacion_familiar}"]`).prop('checked', true);
                                }
                                if (evaluacion.proceso_seleccion) {
                                    $(`input[name="proceso_seleccion"][value="${evaluacion.proceso_seleccion}"]`).prop('checked', true);
                                }
                            }
                        }
                    });
                    
                    // Actualizar lista visual de puestos
                    this.actualizarListaPuestos();
                }
            }
            
            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('modalGrupo'));
            modal.show();
            
        } catch (error) {
            console.error('Error al editar grupo:', error);
            showNotification('Error al cargar el grupo: ' + error.message, 'danger');
        }
    },

    eliminarGrupo: async function(id) {
        const confirmar = confirm('¿Está seguro de que desea eliminar este grupo?');
        if (!confirmar) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id || user.usuario_id;
            
            if (!usuarioId) {
                showNotification('Error: No se encontró el ID del usuario', 'danger');
                return;
            }
            
            const response = await fetch(`/api/grupos/${id}?usuarioId=${usuarioId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Grupo eliminado exitosamente', 'success');
                this.tablaGrupos.ajax.reload(null, false);
                this.cargarGruposParaSelect();
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar grupo:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    },

    // ========== SELECCIÓN DE PUESTOS PARA GRUPO ==========
    agregarPuestoDesdeSelect: function() {
        const select = $('#selectPuestoAgregar');
        const puestoId = select.val();
        
        if (!puestoId) {
            showNotification('Por favor seleccione un puesto', 'warning');
            return;
        }
        
        const selectedOption = select.find('option:selected');
        const puestoNombre = selectedOption.data('nombre');
        const puestoDescripcion = selectedOption.data('descripcion');
        
        // Verificar si ya existe
        const existe = this.puestosSeleccionados.find(p => p.id == puestoId);
        if (existe) {
            showNotification('Este puesto ya fue agregado', 'warning');
            return;
        }
        
        // Agregar al array
        this.puestosSeleccionados.push({
            id: puestoId,
            nombre: puestoNombre,
            descripcion: puestoDescripcion
        });
        
        // Actualizar la lista visual
        this.actualizarListaPuestos();
        
        // Resetear el select
        select.val('');
        
        showNotification('Puesto agregado exitosamente', 'success');
    },
    
    actualizarListaPuestos: function() {
        const container = $('#listaPuestosAgregados');
        container.empty();
        
        if (this.puestosSeleccionados.length === 0) {
            container.html('<p class="text-muted small">No hay puestos agregados</p>');
            return;
        }
        
        this.puestosSeleccionados.forEach(puesto => {
            const item = `
                <div class="card mb-2" style="border: 1px solid #ddd;">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-primary me-1">${puesto.nombre}</span>
                                <small class="text-muted">${puesto.descripcion}</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-danger btn-eliminar-puesto-lista" data-puesto-id="${puesto.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.append(item);
        });
    },
    
    eliminarPuestoDeLista: function(puestoId) {
        this.puestosSeleccionados = this.puestosSeleccionados.filter(p => p.id != puestoId);
        this.actualizarListaPuestos();
        showNotification('Puesto eliminado de la lista', 'info');
    },

    // ========== PUESTOS ==========
    nuevoPuesto: function() {
        $('#formPuesto')[0].reset();
        $('#puestoId').val('');
        $('#modalPuestoTitle').text('Crear Puesto');
        
        const modal = new bootstrap.Modal(document.getElementById('modalPuesto'));
        modal.show();
    },

    guardarPuesto: async function() {
        try {
            const id = $('#puestoId').val();
            const codigo = $('#puestoCodigo').val().trim();
            const nombre = $('#puestoNombre').val().trim();
            
            // Validaciones
            if (!codigo) {
                showNotification('Por favor ingrese el código del puesto', 'warning');
                $('#puestoCodigo').focus();
                return;
            }
            
            if (!nombre) {
                showNotification('Por favor ingrese el nombre del puesto', 'warning');
                $('#puestoNombre').focus();
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

            const datos = { 
                nombre: codigo,
                descripcion: nombre,
                empresaId: parseInt(empresaId)
            };
            
            const url = id ? `/api/puestos/${id}?usuarioId=${usuarioId}` : `/api/puestos?usuarioId=${usuarioId}`;
            const method = id ? 'PUT' : 'POST';

            $('.btn-guardar-puesto').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                    id ? 'Puesto actualizado exitosamente' : 'Puesto creado exitosamente',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPuesto'));
                modal.hide();
                this.tablaPuestos.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar puesto:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            $('.btn-guardar-puesto').prop('disabled', false).html('<i class="fas fa-save me-1"></i>Crear Puesto');
        }
    },

    editarPuesto: async function(id) {
        try {
            const response = await fetch(`/api/puestos/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el puesto');
            }

            const result = await response.json();
            if (result.success && result.data) {
                const puesto = result.data;
                
                $('#puestoId').val(puesto.id);
                $('#puestoCodigo').val(puesto.nombre); // tp_nombre es el código
                $('#puestoNombre').val(puesto.descripcion); // tp_descripcion es el nombre completo
                $('#modalPuestoTitle').text('Editar Puesto');
                $('.btn-guardar-puesto').html('<i class="fas fa-save me-1"></i>Actualizar Puesto');
                
                const modal = new bootstrap.Modal(document.getElementById('modalPuesto'));
                modal.show();
            }
        } catch (error) {
            console.error('Error al editar puesto:', error);
            showNotification('Error al cargar el puesto: ' + error.message, 'danger');
        }
    },

    eliminarPuesto: async function(id) {
        const confirmar = confirm('¿Está seguro de que desea eliminar este puesto?');
        if (!confirmar) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id || user.usuario_id;
            
            if (!usuarioId) {
                showNotification('Error: No se encontró el ID del usuario', 'danger');
                return;
            }
            
            const response = await fetch(`/api/puestos/${id}?usuarioId=${usuarioId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                showNotification('Puesto eliminado exitosamente', 'success');
                this.tablaPuestos.ajax.reload(null, false);
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar puesto:', error);
            showNotification('Error al eliminar: ' + error.message, 'danger');
        }
    }
};

// Exportar para uso global
window.puestosCargos = puestosCargos;
