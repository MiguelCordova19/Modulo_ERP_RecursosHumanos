// Módulo de Puestos/Cargos con DataTables
const puestosCargos = {
    tablaGrupos: null,
    tablaPuestos: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Puestos/Cargos inicializado');
        this.cargarGruposParaSelect();
        this.inicializarDataTables();
        this.configurarEventos();
    },

    // Cargar grupos para el select del modal de puestos
    cargarGruposParaSelect: async function() {
        try {
            const response = await fetch('/api/grupos-puestos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const selectGrupo = $('#puestoGrupo');
                selectGrupo.find('option:not(:first)').remove();
                
                result.data.forEach(grupo => {
                    const option = `<option value="${grupo.id}">${grupo.descripcion}</option>`;
                    selectGrupo.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar grupos:', error);
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
        
        this.tablaGrupos = $('#tablaGrupos').DataTable({
            ajax: {
                url: '/api/grupos-puestos',
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
                        return `<div class="text-truncate" style="max-width: 300px;" title="${data}">${data}</div>`;
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
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar grupo...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros'
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            responsive: true,
            dom: 'lftip',
            order: [[0, 'asc']],
            initComplete: function() {
                this.api().columns([0, 1]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    const input = $(`<input type="text" placeholder="Filtrar ${title}" />`)
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
            }
        });
    },

    // Inicializar DataTable para Puestos
    inicializarTablaPuestos: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaPuestos')) {
            $('#tablaPuestos').DataTable().destroy();
        }
        
        this.tablaPuestos = $('#tablaPuestos').DataTable({
            ajax: {
                url: '/api/puestos',
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
                    width: '80px',
                    render: function(data, type, row) {
                        return `<div title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'grupo_descripcion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 200px;" title="${data}">${data}</div>`;
                    }
                },
                {
                    data: 'codigo_interno',
                    className: 'text-center',
                    width: '120px'
                },
                {
                    data: 'descripcion',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 250px;" title="${data}">${data}</div>`;
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
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar puesto...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros'
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            responsive: true,
            dom: 'lftip',
            order: [[0, 'asc']],
            initComplete: function() {
                this.api().columns([0, 1, 2, 3]).every(function() {
                    const column = this;
                    const title = $(column.header()).text();
                    const input = $(`<input type="text" placeholder="Filtrar ${title}" />`)
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
        $(document).off('click', '.btn-nuevo-grupo').on('click', '.btn-nuevo-grupo', function() {
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
        
        // Botón Agregar Puesto en modal de grupo
        $(document).off('click', '.btn-agregar-puesto').on('click', '.btn-agregar-puesto', function() {
            // Aquí se podría implementar la funcionalidad para agregar puestos al grupo
            showNotification('Funcionalidad de agregar puesto al grupo', 'info');
        });
        
        // Limpiar formularios al cerrar modales
        $('#modalGrupo').on('hidden.bs.modal', function() {
            $('#formGrupo')[0].reset();
            $('#grupoId').val('');
        });
        
        $('#modalPuesto').on('hidden.bs.modal', function() {
            $('#formPuesto')[0].reset();
            $('#puestoId').val('');
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
        $('#formGrupo')[0].reset();
        $('#grupoId').val('');
        $('#modalGrupoTitle').text('Crear grupo');
        
        const modal = new bootstrap.Modal(document.getElementById('modalGrupo'));
        modal.show();
    },

    guardarGrupo: async function() {
        try {
            const id = $('#grupoId').val();
            const nombre = $('#grupoNombre').val().trim();
            
            if (!nombre) {
                showNotification('Por favor ingrese el nombre del grupo', 'warning');
                return;
            }

            // Recoger datos de los radio buttons
            const evaluacion = {
                formacion: $('input[name="formacion"]:checked').val(),
                pasado_profesional: $('input[name="pasado_profesional"]:checked').val(),
                motivo_solicitud: $('input[name="motivo_solicitud"]:checked').val(),
                comportamiento: $('input[name="comportamiento"]:checked').val(),
                potencial: $('input[name="potencial"]:checked').val(),
                condiciones_personales: $('input[name="condiciones_personales"]:checked').val(),
                situacion_familiar: $('input[name="situacion_familiar"]:checked').val(),
                proceso_seleccion: $('input[name="proceso_seleccion"]:checked').val()
            };

            const datos = { 
                descripcion: nombre,
                evaluacion: evaluacion
            };
            
            const url = id ? `/api/grupos-puestos/${id}` : '/api/grupos-puestos';
            const method = id ? 'PUT' : 'POST';

            $('.btn-guardar-grupo').prop('disabled', true).html('Creando...');

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
                    id ? 'Grupo actualizado exitosamente' : 'Grupo creado exitosamente',
                    'success'
                );
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalGrupo'));
                modal.hide();
                this.tablaGrupos.ajax.reload(null, false);
                this.cargarGruposParaSelect();
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar grupo:', error);
            showNotification('Error al guardar: ' + error.message, 'danger');
        } finally {
            $('.btn-guardar-grupo').prop('disabled', false).html('Crear');
        }
    },

    editarGrupo: async function(id) {
        try {
            const response = await fetch(`/api/grupos-puestos/${id}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el grupo');
            }

            const result = await response.json();
            if (result.success && result.data) {
                const grupo = result.data;
                
                $('#grupoId').val(grupo.id);
                $('#grupoNombre').val(grupo.descripcion);
                $('#modalGrupoTitle').text('Editar grupo');
                
                // Aquí se podrían cargar los datos de evaluación si existen
                
                const modal = new bootstrap.Modal(document.getElementById('modalGrupo'));
                modal.show();
            }
        } catch (error) {
            console.error('Error al editar grupo:', error);
            showNotification('Error al cargar el grupo: ' + error.message, 'danger');
        }
    },

    eliminarGrupo: async function(id) {
        const confirmar = confirm('¿Está seguro de que desea eliminar este grupo?');
        if (!confirmar) return;

        try {
            const response = await fetch(`/api/grupos-puestos/${id}`, {
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
            const grupoId = $('#puestoGrupo').val();
            
            if (!codigo || !nombre || !grupoId) {
                showNotification('Por favor complete todos los campos', 'warning');
                return;
            }

            const datos = { 
                codigo_interno: codigo,
                descripcion: nombre,
                grupo_id: grupoId
            };
            
            const url = id ? `/api/puestos/${id}` : '/api/puestos';
            const method = id ? 'PUT' : 'POST';

            $('.btn-guardar-puesto').prop('disabled', true).html('Creando...');

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
            $('.btn-guardar-puesto').prop('disabled', false).html('Crear');
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
                $('#puestoCodigo').val(puesto.codigo_interno);
                $('#puestoNombre').val(puesto.descripcion);
                $('#puestoGrupo').val(puesto.grupo_id);
                $('#modalPuestoTitle').text('Editar Puesto');
                
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
            const response = await fetch(`/api/puestos/${id}`, {
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