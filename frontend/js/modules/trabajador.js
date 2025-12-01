// Módulo de Trabajadores con DataTables
const trabajador = window.trabajador || {
    tablaTrabajadores: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Trabajador inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaTrabajadores')) {
            $('#tablaTrabajadores').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.tablaTrabajadores = $('#tablaTrabajadores').DataTable({
            ajax: {
                url: `/api/trabajadores?empresaId=${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar trabajadores:', error);
                    showNotification('Error al cargar los trabajadores', 'danger');
                }
            },
            columns: [
                {
                    data: 'id',
                    className: 'text-center fw-bold',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'sede',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'en',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'tipoDocumento',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'numeroDocumento',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'apellidosNombres',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'sexo',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaNacimiento',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaIngreso',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'puesto',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'regimenLaboral',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'regimenPensionario',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaCese',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'situacion',
                    className: 'text-center',
                    render: function(data) {
                        if (data === 'ACTIVO') {
                            return '<span class="badge bg-success">ACTIVO</span>';
                        } else if (data === 'BAJA') {
                            return '<span class="badge bg-danger">BAJA</span>';
                        } else if (data === 'SUSPENDIDO') {
                            return '<span class="badge bg-warning text-dark">SUSPENDIDO</span>';
                        }
                        return '<span class="badge bg-secondary">-</span>';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar btn-sm" onclick="trabajador.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar btn-sm" onclick="trabajador.eliminar(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
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
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
            responsive: false,
            scrollX: true,
            dom: 'ltip',
            order: [[0, 'asc']],
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function() {
                const api = this.api();
                
                // Crear segunda fila para filtros
                const filterRow = $('<tr class="filters"></tr>').appendTo($(api.table().header()));
                
                // Agregar filtros para todas las columnas excepto la última (acciones)
                api.columns().every(function(index) {
                    const column = this;
                    const th = $('<th></th>').appendTo(filterRow);
                    
                    // No agregar filtro en la columna de acciones
                    if (index === 14) {
                        return;
                    }
                    
                    const input = $(`<input type="text" placeholder="..." />`)
                        .appendTo(th)
                        .on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
            }
        });
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-trabajador').on('click', '.btn-nuevo-trabajador', function() {
            self.nuevo();
        });
        
        // Botón Exportar
        $(document).off('click', '.btn-exportar-trabajadores').on('click', '.btn-exportar-trabajadores', function() {
            self.exportar();
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-trabajadores').on('click', '.btn-consultar-trabajadores', function() {
            self.consultar();
        });
        
        // Filtro de situación
        $(document).off('change', '#filtroSituacion').on('change', '#filtroSituacion', function() {
            const situacion = $(this).val();
            self.tablaTrabajadores.column(13).search(situacion).draw();
        });
        
        // Botón Guardar Trabajador
        $(document).off('click', '.btn-guardar-trabajador').on('click', '.btn-guardar-trabajador', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalTrabajador').on('hidden.bs.modal', function() {
            $('#formDatosPersonales')[0].reset();
            $('#formRemuneracion')[0].reset();
            $('#formCTS')[0].reset();
            $('#trabajadorId').val('');
            $('.btn-guardar-trabajador').html('<i class="fas fa-save me-1"></i>Guardar');
        });
        
        // Habilitar/deshabilitar campos bancarios según tipo de pago
        $(document).off('change', '#tipoPago').on('change', '#tipoPago', function() {
            const tipoPago = $(this).val();
            const camposBancarios = $('#banco, #tipoCuenta, #numeroCuenta');
            
            if (tipoPago === 'DEPOSITO' || tipoPago === 'TRANSFERENCIA') {
                camposBancarios.prop('disabled', false);
            } else {
                camposBancarios.prop('disabled', true).val('');
            }
        });
        
        // Botón Nuevo Adjunto
        $(document).off('click', '.btn-nuevo-adjunto').on('click', '.btn-nuevo-adjunto', function() {
            self.nuevoAdjunto();
        });
        
        // Botón Guardar Adjunto
        $(document).off('click', '.btn-guardar-adjunto').on('click', '.btn-guardar-adjunto', function() {
            self.guardarAdjunto();
        });
        
        // Limpiar formulario de adjunto al cerrar modal
        $('#modalAdjunto').on('hidden.bs.modal', function() {
            $('#formAdjunto')[0].reset();
        });
    },
    
    nuevoAdjunto: function() {
        $('#formAdjunto')[0].reset();
        const modal = new bootstrap.Modal(document.getElementById('modalAdjunto'));
        modal.show();
    },
    
    guardarAdjunto: function() {
        const form = $('#formAdjunto')[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const descripcion = $('#descripcionAdjunto').val();
        const archivo = $('#archivoAdjunto')[0].files[0];
        
        if (archivo && archivo.type !== 'application/pdf') {
            showNotification('Por favor seleccione un archivo PDF válido', 'warning');
            return;
        }
        
        showNotification('Funcionalidad de guardar adjunto en desarrollo', 'info');
        // Aquí se implementará la lógica de subida
    },
    
    guardar: function() {
        // Validar formulario
        const form = $('#formDatosPersonales')[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        showNotification('Funcionalidad de guardar en desarrollo', 'info');
    },

    // Métodos CRUD
    nuevo: function() {
        // Limpiar formulario
        $('#formDatosPersonales')[0].reset();
        $('#trabajadorId').val('');
        $('#modalTrabajadorTitle').text('Nuevo Trabajador');
        $('.btn-guardar-trabajador').html('<i class="fas fa-save me-1"></i>Guardar');
        
        // Activar primera pestaña
        $('#tab-datos-personales').tab('show');
        
        // Cargar datos de selects
        this.cargarTiposDocumento();
        this.cargarRegimenesLaborales();
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalTrabajador'));
        modal.show();
    },
    
    cargarTiposDocumento: async function() {
        try {
            const response = await fetch('/api/tipos-documento');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoDocumento');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.abreviatura} - ${tipo.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar tipos de documento:', error);
        }
    },
    
    cargarRegimenesLaborales: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/conceptos-regimen-laboral/regimenes-activos?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#regimenLaboral');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    // Mostrar: CodSunat - Nombre del régimen
                    const optionText = `${regimen.codsunat} - ${regimen.regimenlaboral}`;
                    const option = `<option value="${regimen.id}">${optionText}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Regímenes laborales con conceptos cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar regímenes laborales:', error);
        }
    },

    editar: function(id) {
        showNotification('Funcionalidad de Editar Trabajador en desarrollo', 'info');
    },

    eliminar: function(id) {
        showNotification('Funcionalidad de Eliminar Trabajador en desarrollo', 'info');
    },

    exportar: function() {
        showNotification('Funcionalidad de Exportar en desarrollo', 'info');
    },

    consultar: function() {
        if (this.tablaTrabajadores) {
            this.tablaTrabajadores.ajax.reload();
            showNotification('Datos actualizados', 'info');
        }
    }
};

// Exportar para uso global
window.trabajador = trabajador;
