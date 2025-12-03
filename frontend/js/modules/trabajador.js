// Módulo de Trabajadores con DataTables
const trabajador = {
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
                url: `http://localhost:3000/api/trabajador?empresaId=${empresaId}`,
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
                    data: 'sedescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'tipoplanilla',
                    className: 'text-center',
                    render: function(data) {
                        if (data === 'PLANILLA') {
                            return '<span class="badge bg-primary">PLANILLA</span>';
                        } else if (data === 'RRHH') {
                            return '<span class="badge bg-info">RRHH</span>';
                        }
                        return data || '-';
                    }
                },
                {
                    data: 'tipodocumentodescripcion',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'numerodocumento',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: null,
                    render: function(data, type, row) {
                        const apellidos = (row.apellidopaterno || '') + ' ' + (row.apellidomaterno || '');
                        const nombres = row.nombres || '';
                        return (apellidos + ' ' + nombres).trim() || '-';
                    }
                },
                {
                    data: 'generodescripcion',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechanacimiento',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechaingreso',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'puestodescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'regimenlaboraldescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'regimenpensionariodescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechacese',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'estado',
                    className: 'text-center',
                    render: function(data) {
                        if (data === 1) {
                            return '<span class="badge bg-success">ACTIVO</span>';
                        } else if (data === 2) {
                            return '<span class="badge bg-danger">BAJA</span>';
                        } else if (data === 3) {
                            return '<span class="badge bg-warning text-dark">SUSPENDIDO</span>';
                        }
                        return '<span class="badge bg-secondary">-</span>';
                    }
                },
                {
                    data: null,
                    className: 'text-center',
                    orderable: false,
                    render: function(data, type, row) {
                        return `
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-outline-primary btn-sm btn-editar" 
                                        data-id="${row.id}" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" 
                                        data-id="${row.id}" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
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
            dom: 'lftip',
            ordering: false,
            initComplete: function() {
                // Eliminar cualquier fila extra del thead
                $('#tablaTrabajadores thead tr:not(:first)').remove();
                console.log('✅ DataTable de trabajadores inicializada');
            }
        });
        
        // Eliminar filas extra después de un momento
        setTimeout(() => {
            $('#tablaTrabajadores thead tr:not(:first)').remove();
        }, 500);
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
        
        // Botones de Editar y Eliminar en la tabla
        $(document).off('click', '.btn-editar').on('click', '.btn-editar', function() {
            const id = $(this).data('id');
            self.editar(id);
        });
        
        $(document).off('click', '.btn-eliminar').on('click', '.btn-eliminar', function() {
            const id = $(this).data('id');
            self.eliminar(id);
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
            const tipoPagoId = $(this).val();
            const camposBancarios = $('#banco, #tipoCuenta, #numeroCuenta');
            
            // 02 = Depósito
            if (tipoPagoId === '02') {
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
        
        // Evento para cambio de tipo de trabajador (PLANILLA/RRHH)
        $(document).off('change', 'input[name="radioTipoTrabajador"]').on('change', 'input[name="radioTipoTrabajador"]', function() {
            const tipoTrabajador = $(this).val();
            console.log('📝 Tipo trabajador cambiado a:', tipoTrabajador);
            
            // Sincronizar con campo oculto
            $('#tipoTrabajador').val(tipoTrabajador);
            
            // Ajustar formulario
            self.ajustarFormularioPorTipo(tipoTrabajador);
        });
        
        // Validación de números de cuenta (solo números y guiones)
        $(document).off('input', '#numeroCuenta, #ctsNumeroCuenta').on('input', '#numeroCuenta, #ctsNumeroCuenta', function() {
            let valor = $(this).val();
            // Remover caracteres no permitidos (solo dejar números y guiones)
            valor = valor.replace(/[^0-9-]/g, '');
            // Limitar a 20 caracteres
            if (valor.length > 20) {
                valor = valor.substring(0, 20);
            }
            $(this).val(valor);
        });
        
        // Validación de número de documento según tipo
        $(document).off('change', '#tipoDocumento').on('change', '#tipoDocumento', function() {
            const tipoDoc = $(this).val();
            const inputDoc = $('#nroDocumento');
            
            // Limpiar el campo
            inputDoc.val('');
            
            // Configurar según tipo de documento
            if (tipoDoc === '01') { // DNI
                inputDoc.attr('maxlength', '8');
                inputDoc.attr('placeholder', '8 dígitos');
                inputDoc.attr('pattern', '\\d{8}');
            } else if (tipoDoc === '04') { // Carnet de Extranjería
                inputDoc.attr('maxlength', '9');
                inputDoc.attr('placeholder', '9 dígitos');
                inputDoc.attr('pattern', '\\d{9}');
            } else if (tipoDoc === '07') { // Pasaporte
                inputDoc.attr('maxlength', '12');
                inputDoc.attr('placeholder', '7-12 caracteres');
                inputDoc.attr('pattern', '[A-Za-z0-9]{7,12}');
            } else {
                inputDoc.attr('maxlength', '20');
                inputDoc.attr('placeholder', 'Número de documento');
                inputDoc.removeAttr('pattern');
            }
        });
        
        // Validación de solo números para DNI y CE
        $(document).off('input', '#nroDocumento').on('input', '#nroDocumento', function() {
            const tipoDoc = $('#tipoDocumento').val();
            let valor = $(this).val();
            
            if (tipoDoc === '01' || tipoDoc === '04') { // DNI o CE - solo números
                valor = valor.replace(/[^0-9]/g, '');
            } else if (tipoDoc === '07') { // Pasaporte - alfanumérico
                valor = valor.replace(/[^A-Za-z0-9]/g, '');
            }
            
            $(this).val(valor);
        });
    },
    
    // Ajustar formulario según tipo de trabajador
    ajustarFormularioPorTipo: function(tipoTrabajador) {
        console.log('🔄 Ajustando formulario para tipo:', tipoTrabajador);
        
        if (tipoTrabajador === '02') { // RRHH
            // Ocultar pestañas no necesarias (ocultar el li padre del botón)
            $('#tab-datos-pension').parent().hide();
            $('#tab-remuneracion').parent().hide();
            $('#tab-cts').parent().hide();
            
            // Habilitar campos específicos en Datos Laborales
            $('#fechaIngresoLaboral').prop('readonly', false).prop('required', false);
            $('#turno').prop('disabled', false).prop('required', false); // Select usa disabled
            $('#horario').prop('disabled', false).prop('required', false); // Select usa disabled
            $('#diaDescanso').prop('disabled', false).prop('required', false); // Select usa disabled
            $('#horaEntrada').prop('readonly', false).prop('required', false);
            $('#horaSalida').prop('readonly', false).prop('required', false);
            
            // Bloquear campos que no se usan en RRHH
            $('#sede').prop('readonly', true).prop('required', false).val('');
            $('#puesto').prop('readonly', true).prop('required', false).val('');
            
            // Limpiar campos de remuneración y CTS
            $('#tipoPago, #banco, #numeroCuenta, #tipoCuenta').val('').prop('required', false);
            $('#ctsBanco, #ctsNumeroCuenta').val('').prop('required', false);
            $('#regimenPensionario, #cuspp').val('').prop('required', false);
            
            // Ocultar el mensaje de solo lectura
            $('#panel-datos-laborales .alert-info').hide();
            
            console.log('✅ Modo RRHH activado - Campos habilitados para edición');
        } else { // PLANILLA
            // Mostrar todas las pestañas
            $('#tab-datos-pension').parent().show();
            $('#tab-remuneracion').parent().show();
            $('#tab-cts').parent().show();
            
            // BLOQUEAR TODOS los campos de Datos Laborales (se llenan dinámicamente)
            $('#fechaIngresoLaboral').prop('readonly', true).prop('required', false).val('');
            $('#sede').prop('readonly', true).prop('required', false).val('');
            $('#puesto').prop('readonly', true).prop('required', false).val('');
            $('#turno').prop('disabled', true).prop('required', false).val(''); // Select usa disabled
            $('#horario').prop('disabled', true).prop('required', false).val(''); // Select usa disabled
            $('#diaDescanso').prop('disabled', true).prop('required', false).val(''); // Select usa disabled
            $('#horaEntrada').prop('readonly', true).prop('required', false).val('');
            $('#horaSalida').prop('readonly', true).prop('required', false).val('');
            
            // Hacer obligatorios los campos de remuneración y CTS
            $('#tipoPago, #banco, #numeroCuenta, #tipoCuenta').prop('required', true);
            $('#ctsBanco, #ctsNumeroCuenta').prop('required', true);
            
            // Mostrar el mensaje de solo lectura
            $('#panel-datos-laborales .alert-info').show();
            
            console.log('✅ Modo PLANILLA activado - Todos los campos bloqueados');
        }
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
        const self = this;
        
        // Validar formularios según el tipo de trabajador
        const tipoTrabajador = $('#tipoTrabajador').val();
        
        // Validar campos obligatorios de Datos Personales manualmente
        const camposObligatorios = [
            { id: '#tipoTrabajador', nombre: 'Tipo de Trabajador', tab: 'datosPersonales' },
            { id: '#tipoDocumento', nombre: 'Tipo de Documento', tab: 'datosPersonales' },
            { id: '#nroDocumento', nombre: 'Número de Documento', tab: 'datosPersonales' },
            { id: '#apPaterno', nombre: 'Apellido Paterno', tab: 'datosPersonales' },
            { id: '#nombres', nombre: 'Nombres', tab: 'datosPersonales' },
            { id: '#telefono', nombre: 'Número de Celular', tab: 'datosPersonales' },
            { id: '#correo', nombre: 'Correo Electrónico', tab: 'datosPersonales' },
            { id: '#fechaNacimiento', nombre: 'Fecha de Nacimiento', tab: 'datosPersonales' },
            { id: '#sexo', nombre: 'Sexo', tab: 'datosPersonales' },
            { id: '#estadoCivil', nombre: 'Estado Civil', tab: 'datosPersonales' },
            { id: '#regimenLaboral', nombre: 'Régimen Laboral', tab: 'datosPersonales' }
        ];
        
        // Validar campos obligatorios
        for (let campo of camposObligatorios) {
            const valor = $(campo.id).val();
            if (!valor || valor.trim() === '') {
                showNotification(`El campo "${campo.nombre}" es obligatorio`, 'warning');
                $('#tab-datos-personales').tab('show');
                $(campo.id).focus();
                return;
            }
        }
        
        // Solo validar Remuneración y CTS si es PLANILLA
        if (tipoTrabajador === '01') {
            const camposRemuneracion = [
                { id: '#tipoPago', nombre: 'Tipo de Pago', tab: 'remuneracion' },
                { id: '#banco', nombre: 'Banco de Remuneración', tab: 'remuneracion' },
                { id: '#numeroCuenta', nombre: 'Número de Cuenta de Remuneración', tab: 'remuneracion' },
                { id: '#tipoCuenta', nombre: 'Tipo de Cuenta', tab: 'remuneracion' }
            ];
            
            for (let campo of camposRemuneracion) {
                const valor = $(campo.id).val();
                if (!valor || valor.trim() === '') {
                    showNotification(`El campo "${campo.nombre}" es obligatorio para trabajadores de PLANILLA`, 'warning');
                    $('#tab-remuneracion').tab('show');
                    $(campo.id).focus();
                    return;
                }
            }
            
            const camposCTS = [
                { id: '#ctsBanco', nombre: 'Banco CTS', tab: 'cts' },
                { id: '#ctsNumeroCuenta', nombre: 'Número de Cuenta CTS', tab: 'cts' }
            ];
            
            for (let campo of camposCTS) {
                const valor = $(campo.id).val();
                if (!valor || valor.trim() === '') {
                    showNotification(`El campo "${campo.nombre}" es obligatorio para trabajadores de PLANILLA`, 'warning');
                    $('#tab-cts').tab('show');
                    $(campo.id).focus();
                    return;
                }
            }
        }
        
        // Recopilar datos del formulario
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        const trabajadorId = $('#trabajadorId').val();
        
        const trabajadorData = {
            id: trabajadorId ? parseInt(trabajadorId) : null,
            empresaId: parseInt(empresaId),
            
            // Datos Personales (obligatorios)
            tipoTrabajador: $('#tipoTrabajador').val() || null,
            tipoDocumento: $('#tipoDocumento').val() || null,
            numeroDocumento: $('#nroDocumento').val() ? $('#nroDocumento').val().trim() : null,
            apellidoPaterno: $('#apPaterno').val() ? $('#apPaterno').val().trim().toUpperCase() : null,
            apellidoMaterno: $('#apMaterno').val() ? $('#apMaterno').val().trim().toUpperCase() : null,
            nombres: $('#nombres').val() ? $('#nombres').val().trim().toUpperCase() : null,
            numeroCelular: $('#telefono').val() ? $('#telefono').val().trim() : null,
            correo: $('#correo').val() ? $('#correo').val().trim().toLowerCase() : null,
            fechaNacimiento: $('#fechaNacimiento').val() || null,
            genero: $('#sexo').val() || null,
            estadoCivil: $('#estadoCivil').val() || null,
            regimenLaboral: $('#regimenLaboral').val() || null,
            
            // Datos Laborales (dinámicos)
            fechaIngreso: $('#fechaIngresoLaboral').val() || null,
            sedeId: $('#sede').val() ? parseInt($('#sede').val()) : null,
            puestoId: $('#puesto').val() ? parseInt($('#puesto').val()) : null,
            turnoId: $('#turno').val() || null,
            horarioId: $('#horario').val() || null,
            diaDescanso: $('#diaDescanso').val() || null,
            horaEntrada: $('#horaEntrada').val() || null,
            horaSalida: $('#horaSalida').val() || null,
            
            // Datos de Pensión (solo para PLANILLA)
            regimenPensionario: tipoTrabajador === '01' ? ($('#regimenPensionario').val() || null) : null,
            cuspp: tipoTrabajador === '01' ? ($('#cuspp').val() ? $('#cuspp').val().trim() : null) : null,
            
            // Remuneración (solo para PLANILLA)
            tipoPago: tipoTrabajador === '01' ? ($('#tipoPago').val() || null) : null,
            bancoRemuneracion: tipoTrabajador === '01' ? ($('#banco').val() || null) : null,
            numeroCuentaRemuneracion: tipoTrabajador === '01' ? ($('#numeroCuenta').val() ? $('#numeroCuenta').val().trim() : null) : null,
            tipoCuenta: tipoTrabajador === '01' ? ($('#tipoCuenta').val() || null) : null,
            
            // CTS (solo para PLANILLA)
            bancoCts: tipoTrabajador === '01' ? ($('#ctsBanco').val() || null) : null,
            numeroCuentaCts: tipoTrabajador === '01' ? ($('#ctsNumeroCuenta').val() ? $('#ctsNumeroCuenta').val().trim() : null) : null,
            
            estado: 1 // ACTIVO por defecto
        };
        
        // Deshabilitar botón y mostrar loading
        const btnGuardar = $('.btn-guardar-trabajador');
        const textoOriginal = btnGuardar.html();
        btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');
        
        // Enviar datos al servidor
        const url = trabajadorId ? `/api/trabajadores/${trabajadorId}` : '/api/trabajadores';
        const method = trabajadorId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Usuario-Id': localStorage.getItem('usuario_id') || '1'
            },
            body: JSON.stringify(trabajadorData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showNotification(result.message || 'Trabajador guardado exitosamente', 'success');
                
                // Cerrar modal
                bootstrap.Modal.getInstance(document.getElementById('modalTrabajador')).hide();
                
                // Recargar tabla
                self.tablaTrabajadores.ajax.reload(null, false);
            } else {
                showNotification(result.message || 'Error al guardar trabajador', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al guardar trabajador: ' + error.message, 'danger');
        })
        .finally(() => {
            // Restaurar botón
            btnGuardar.prop('disabled', false).html(textoOriginal);
        });
    },

    // Métodos CRUD
    nuevo: function() {
        // Limpiar formulario
        $('#formDatosPersonales')[0].reset();
        $('#formRemuneracion')[0].reset();
        $('#formCTS')[0].reset();
        $('#trabajadorId').val('');
        $('#modalTrabajadorTitle').text('Nuevo Trabajador');
        $('.btn-guardar-trabajador').html('<i class="fas fa-save me-1"></i>Guardar');
        
        // Establecer valores por defecto
        $('#tipoTrabajador').val('01');
        $('#radioPlanilla').prop('checked', true);
        
        // Ajustar formulario según tipo (PLANILLA por defecto)
        this.ajustarFormularioPorTipo('01');
        
        // Activar primera pestaña
        $('#tab-datos-personales').tab('show');
        
        // Cargar datos de selects
        this.cargarTiposDocumento();
        this.cargarGeneros();
        this.cargarEstadosCiviles();
        this.cargarRegimenesLaborales();
        this.cargarTiposPago();
        this.cargarBancos();
        this.cargarTiposCuenta();
        this.cargarTurnos();
        this.cargarHorarios();
        this.cargarDiasSemana();
        
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
    
    cargarEstadosCiviles: async function() {
        try {
            const response = await fetch('/api/estados-civiles');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#estadoCivil');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(estado => {
                    const option = `<option value="${estado.id}">${estado.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Estados civiles cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar estados civiles:', error);
        }
    },
    
    cargarGeneros: async function() {
        try {
            const response = await fetch('/api/generos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#sexo');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(genero => {
                    const option = `<option value="${genero.id}">${genero.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Géneros cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar géneros:', error);
        }
    },
    
    cargarTiposPago: async function() {
        try {
            const response = await fetch('/api/tipos-pago');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoPago');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Tipos de pago cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de pago:', error);
        }
    },
    
    cargarBancos: async function() {
        try {
            const response = await fetch('/api/bancos');
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar en el select de Remuneración
                const selectRemuneracion = $('#banco');
                selectRemuneracion.find('option:not(:first)').remove();
                
                // Cargar en el select de CTS
                const selectCTS = $('#ctsBanco');
                selectCTS.find('option:not(:first)').remove();
                
                result.data.forEach(banco => {
                    const option = `<option value="${banco.id}">${banco.descripcion}</option>`;
                    selectRemuneracion.append(option);
                    selectCTS.append(option);
                });
                
                console.log('✅ Bancos cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar bancos:', error);
        }
    },
    
    cargarTiposCuenta: async function() {
        try {
            const response = await fetch('/api/tipos-cuenta');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoCuenta');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Tipos de cuenta cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de cuenta:', error);
        }
    },
    
    cargarTurnos: async function() {
        try {
            const response = await fetch('/api/turnos/activos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#turno');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    const option = `<option value="${turno.id}">${turno.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Turnos cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },
    
    cargarHorarios: async function() {
        try {
            const response = await fetch('/api/horarios/activos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#horario');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(horario => {
                    const option = `<option value="${horario.id}">${horario.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Horarios cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    },
    
    cargarDiasSemana: async function() {
        try {
            const response = await fetch('/api/dias-semana/activos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#diaDescanso');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(dia => {
                    const option = `<option value="${dia.id}">${dia.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Días de la semana cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar días de la semana:', error);
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
    
    cargarSedes: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/sedes?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#sede');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    const option = `<option value="${sede.id}">${sede.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Sedes cargadas:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },
    
    cargarPuestos: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/puestos?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#puesto');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(puesto => {
                    const option = `<option value="${puesto.id}">${puesto.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Puestos cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar puestos:', error);
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
            showNotification('Datos actualizados', 'success');
        }
    },
    
    editar: async function(id) {
        const self = this;
        
        try {
            // Cargar datos del trabajador
            const response = await fetch(`/api/trabajador/${id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const trabajador = result.data;
                
                // Cargar datos de selects primero
                await Promise.all([
                    this.cargarTiposDocumento(),
                    this.cargarGeneros(),
                    this.cargarEstadosCiviles(),
                    this.cargarRegimenesLaborales(),
                    this.cargarSedes(),
                    this.cargarPuestos(),
                    this.cargarTiposPago(),
                    this.cargarBancos(),
                    this.cargarTiposCuenta(),
                    this.cargarTurnos(),
                    this.cargarHorarios(),
                    this.cargarDiasSemana()
                ]);
                
                // Llenar formulario con datos del trabajador
                $('#trabajadorId').val(trabajador.id);
                
                // Datos Personales
                $('#tipoTrabajador').val(trabajador.tipoplanilla);
                // Seleccionar el radio button correspondiente
                if (trabajador.tipoplanilla === '01') {
                    $('#radioPlanilla').prop('checked', true);
                } else if (trabajador.tipoplanilla === '02') {
                    $('#radioRRHH').prop('checked', true);
                }
                $('#tipoDocumento').val(trabajador.tipodocumento);
                $('#nroDocumento').val(trabajador.numerodocumento);
                $('#apPaterno').val(trabajador.apellidopaterno);
                $('#apMaterno').val(trabajador.apellidomaterno);
                $('#nombres').val(trabajador.nombres);
                $('#telefono').val(trabajador.celular);
                $('#correo').val(trabajador.correo);
                $('#fechaNacimiento').val(trabajador.fechanacimiento);
                $('#sexo').val(trabajador.genero);
                $('#estadoCivil').val(trabajador.estadocivil);
                $('#regimenLaboral').val(trabajador.regimenlaboral);
                
                // Cambiar título y botón
                $('#modalTrabajadorTitle').text('Editar Trabajador');
                $('.btn-guardar-trabajador').html('<i class="fas fa-save me-1"></i>Actualizar');
                
                // Ajustar formulario según tipo de trabajador
                self.ajustarFormularioPorTipo(trabajador.tipoplanilla);
                
                // Abrir modal
                const modalElement = document.getElementById('modalTrabajador');
                const modal = new bootstrap.Modal(modalElement);
                
                // Esperar a que el modal se abra completamente antes de llenar los campos
                modalElement.addEventListener('shown.bs.modal', function llenarCampos() {
                    // Datos Laborales
                    setTimeout(() => {
                        $('#fechaIngresoLaboral').val(trabajador.fechaingresolaboral || '');
                        $('#sede').val(trabajador.sede || '');
                        $('#puesto').val(trabajador.puesto || '');
                        $('#turno').val(trabajador.turno || '');
                        $('#horario').val(trabajador.horario || '');
                        $('#diaDescanso').val(trabajador.diadescanso || '');
                        $('#horaEntrada').val(trabajador.horaentrada || '');
                        $('#horaSalida').val(trabajador.horasalida || '');
                        
                        console.log('✅ Datos laborales insertados en los campos');
                    }, 100);
                    
                    // Datos de Pensión
                    $('#regimenPensionario').val(trabajador.regimenpensionario || '');
                    $('#cuspp').val(trabajador.cuspp || '');
                    
                    // Remuneración
                    $('#tipoPago').val(trabajador.tipopago || '');
                    $('#banco').val(trabajador.bancorem || '');
                    $('#numeroCuenta').val(trabajador.nrocuentarem || '');
                    
                    // CTS
                    $('#ctsBanco').val(trabajador.bancocts || '');
                    $('#ctsNumeroCuenta').val(trabajador.nrocuentacts || '');
                    
                    // Remover el event listener para que no se ejecute múltiples veces
                    modalElement.removeEventListener('shown.bs.modal', llenarCampos);
                }, { once: true });
                
                modal.show();
                
            } else {
                showNotification('No se pudo cargar el trabajador', 'danger');
            }
        } catch (error) {
            console.error('Error al cargar trabajador:', error);
            showNotification('Error al cargar trabajador: ' + error.message, 'danger');
        }
    },
    
    eliminar: function(id) {
        const self = this;
        
        if (!confirm('¿Está seguro de eliminar este trabajador?')) {
            return;
        }
        
        fetch(`/api/trabajadores/${id}`, {
            method: 'DELETE',
            headers: {
                'Usuario-Id': localStorage.getItem('usuario_id') || '1'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showNotification(result.message || 'Trabajador eliminado exitosamente', 'success');
                self.tablaTrabajadores.ajax.reload(null, false);
            } else {
                showNotification(result.message || 'Error al eliminar trabajador', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al eliminar trabajador: ' + error.message, 'danger');
        });
    },
    
    exportar: function() {
        showNotification('Funcionalidad de exportar en desarrollo', 'info');
    },
    
    consultar: function() {
        this.tablaTrabajadores.ajax.reload();
        showNotification('Datos actualizados', 'success');
    }
};

// Exportar para uso global
window.trabajador = trabajador;

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    if (typeof trabajador !== 'undefined') {
        trabajador.init();
    }
});
