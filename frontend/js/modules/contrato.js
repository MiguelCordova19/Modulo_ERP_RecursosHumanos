// Módulo de Contrato
const contrato = {
    tablaContratos: null,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Contrato inicializado');
        this.inicializarDataTable();
        this.configurarEventos();
        this.cargarSedes();
    },

    // Inicializar DataTable
    inicializarDataTable: function() {
        const self = this;
        
        if ($.fn.DataTable.isDataTable('#tablaContratos')) {
            $('#tablaContratos').DataTable().destroy();
        }
        
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        
        this.tablaContratos = $('#tablaContratos').DataTable({
            ajax: {
                url: `/api/contratos/empresa/${empresaId}`,
                dataSrc: function(json) {
                    if (json.success && json.data) {
                        return json.data;
                    }
                    return [];
                },
                error: function(xhr, error, code) {
                    console.error('Error al cargar contratos:', error);
                    showNotification('Error al cargar los contratos', 'danger');
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
                    data: 'sededescripcion',
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
                    data: 'fechainiciolaboral',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechainiciolaboral',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'fechafinlaboral',
                    className: 'text-center',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'sueldomensual',
                    className: 'text-end',
                    render: function(data) {
                        return data ? parseFloat(data).toFixed(2) : '0.00';
                    }
                },
                {
                    data: 'tipocontratodescripcion',
                    render: function(data) {
                        return data || '-';
                    }
                },
                {
                    data: 'horalaboral',
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
                    data: 'fechafinlaboral',
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
                            return '<span class="badge bg-success">VIGENTE</span>';
                        } else if (data === 0) {
                            return '<span class="badge bg-danger">INACTIVO</span>';
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
                            <button class="btn btn-dark btn-sm btn-menu-acciones" type="button" 
                                    data-id="${row.id}" 
                                    style="background-color: #2c3e50; border: none;">
                                <i class="fas fa-ellipsis-v"></i>
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
            dom: 'lftip',
            ordering: false,
            initComplete: function() {
                $('#tablaContratos thead tr:not(:first)').remove();
                console.log('✅ DataTable de contratos inicializada');
            }
        });
        
        setTimeout(() => {
            $('#tablaContratos thead tr:not(:first)').remove();
        }, 500);
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón Nuevo
        $(document).off('click', '.btn-nuevo-contrato').on('click', '.btn-nuevo-contrato', function() {
            console.log('🔵 Click en botón Nuevo Contrato');
            self.nuevo();
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-contratos').on('click', '.btn-consultar-contratos', function() {
            self.consultar();
        });
        
        // Filtro de sede
        $(document).off('change', '#filtroSede').on('change', '#filtroSede', function() {
            const sede = $(this).val();
            self.tablaContratos.column(1).search(sede).draw();
        });
        
        // Botón para abrir menú de acciones
        $(document).off('click', '.btn-menu-acciones').on('click', '.btn-menu-acciones', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = $(this).data('id');
            const button = $(this);
            const buttonOffset = button.offset();
            const buttonHeight = button.outerHeight();
            const buttonWidth = button.outerWidth();
            
            // Guardar el ID del contrato
            $('#contratoIdAccion').val(id);
            
            // Obtener el menú
            const menu = $('#menuAccionesContrato');
            const menuWidth = 220;
            const menuHeight = menu.outerHeight() || 200;
            
            // Calcular posición (a la izquierda del botón)
            let top = buttonOffset.top;
            let left = buttonOffset.left - menuWidth - 5;
            
            // Ajustar si se sale de la pantalla por la izquierda
            if (left < 10) {
                left = buttonOffset.left + buttonWidth + 5;
            }
            
            // Ajustar si se sale de la pantalla por abajo
            if (top + menuHeight > $(window).height()) {
                top = $(window).height() - menuHeight - 10;
            }
            
            // Ajustar si se sale de la pantalla por arriba
            if (top < 10) {
                top = 10;
            }
            
            // Posicionar y mostrar el menú
            menu.css({
                top: top + 'px',
                left: left + 'px'
            });
            
            menu.addClass('show');
            $('#menuOverlay').addClass('show');
        });
        
        // Cerrar menú al hacer clic en el overlay
        $(document).off('click', '#menuOverlay').on('click', '#menuOverlay', function() {
            $('#menuAccionesContrato').removeClass('show');
            $('#menuOverlay').removeClass('show');
        });
        
        // Botones del menú de acciones
        $(document).off('click', '#menuAccionesContrato .btn-editar-contrato').on('click', '#menuAccionesContrato .btn-editar-contrato', function(e) {
            e.preventDefault();
            const id = $('#contratoIdAccion').val();
            $('#menuAccionesContrato').removeClass('show');
            $('#menuOverlay').removeClass('show');
            self.editar(id);
        });
        
        $(document).off('click', '#menuAccionesContrato .btn-modificar-conceptos').on('click', '#menuAccionesContrato .btn-modificar-conceptos', function(e) {
            e.preventDefault();
            const id = $('#contratoIdAccion').val();
            $('#menuAccionesContrato').removeClass('show');
            $('#menuOverlay').removeClass('show');
            self.modificarConceptos(id);
        });
        
        $(document).off('click', '#menuAccionesContrato .btn-finalizar-contrato').on('click', '#menuAccionesContrato .btn-finalizar-contrato', function(e) {
            e.preventDefault();
            const id = $('#contratoIdAccion').val();
            $('#menuAccionesContrato').removeClass('show');
            $('#menuOverlay').removeClass('show');
            self.finalizarContrato(id);
        });
        
        $(document).off('click', '#menuAccionesContrato .btn-eliminar-contrato').on('click', '#menuAccionesContrato .btn-eliminar-contrato', function(e) {
            e.preventDefault();
            const id = $('#contratoIdAccion').val();
            $('#menuAccionesContrato').removeClass('show');
            $('#menuOverlay').removeClass('show');
            self.eliminar(id);
        });
        
        // Botón Guardar
        $(document).off('click', '.btn-guardar-contrato').on('click', '.btn-guardar-contrato', function() {
            self.guardar();
        });
        
        // Limpiar formulario al cerrar modal
        $('#modalContrato').on('hidden.bs.modal', function() {
            $('#formContrato')[0].reset();
            $('#contratoId').val('');
            $('.btn-guardar-contrato').html('<i class="fas fa-save me-1"></i>Guardar');
            // Desbloquear el campo de régimen pensionario
            $('#regimenPensionario').prop('disabled', false).css('background-color', '');
        });
    },

    // Cargar sedes para el filtro
    cargarSedes: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/sedes?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Cargar filtro de sede
                const selectFiltro = $('#filtroSede');
                selectFiltro.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    const option = `<option value="${sede.descripcion}">${sede.descripcion}</option>`;
                    selectFiltro.append(option);
                });
                
                // Cargar select de sede en el modal
                const selectModal = $('#sede');
                selectModal.find('option:not(:first)').remove();
                
                result.data.forEach(sede => {
                    const option = `<option value="${sede.id}">${sede.descripcion}</option>`;
                    selectModal.append(option);
                });
                
                console.log('✅ Sedes cargadas:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    },

    // Métodos CRUD
    nuevo: function() {
        console.log('🔵 Abriendo modal de nuevo contrato...');
        
        // Resetear formulario
        $('#formContrato')[0].reset();
        $('#contratoId').val('');
        $('#modalContratoTitle').text('Nuevo Contrato');
        $('.btn-guardar-contrato').html('<i class="fas fa-save me-1"></i>Guardar');
        
        // Desbloquear y limpiar el campo de régimen pensionario
        $('#regimenPensionario').prop('disabled', false).css('background-color', '').val('');
        
        // Ocultar y limpiar campo CUSPP
        $('#filaCuspp').hide();
        $('#cuspp').prop('required', false).val('');
        
        // Cargar todos los selects
        this.cargarTiposContrato();
        this.cargarSedes();
        this.cargarPuestos();
        this.cargarTurnos();
        this.cargarHorarios();
        this.cargarDiasDescanso();
        this.cargarTiposTrabajador();
        this.cargarRegimenesPensionarios();
        this.cargarRegimenesLaborales();
        
        // Configurar cálculos automáticos
        this.configurarCalculos();
        
        // Abrir modal
        try {
            const modalElement = document.getElementById('modalContrato');
            if (!modalElement) {
                console.error('❌ Modal #modalContrato no encontrado en el DOM');
                showNotification('Error: Modal no encontrado', 'danger');
                return;
            }
            
            console.log('✅ Modal encontrado, intentando abrir...');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Modal abierto');
        } catch (error) {
            console.error('❌ Error al abrir modal:', error);
            showNotification('Error al abrir modal: ' + error.message, 'danger');
        }
    },

    buscarTrabajadores: async function(termino) {
        if (!termino || termino.length < 2) {
            $('#resultadosBusqueda').hide().empty();
            $('#spinnerBusqueda').hide();
            return;
        }
        
        try {
            // Mostrar spinner de carga
            $('#spinnerBusqueda').show();
            $('#resultadosBusqueda').hide().empty();
            
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            // Buscar solo trabajadores de PLANILLA (tipo '01')
            const response = await fetch(`/api/trabajadores/empresa/${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Filtrar por tipo PLANILLA y por término de búsqueda
                const trabajadoresPlanilla = result.data.filter(t => {
                    if (t.tipoTrabajador !== '01') return false; // Solo PLANILLA
                    
                    const terminoLower = termino.toLowerCase();
                    const nombreCompleto = `${t.apellidoPaterno || ''} ${t.apellidoMaterno || ''} ${t.nombres || ''}`.toLowerCase();
                    const documento = (t.numeroDocumento || '').toLowerCase();
                    
                    return nombreCompleto.includes(terminoLower) || documento.includes(terminoLower);
                });
                
                this.mostrarResultados(trabajadoresPlanilla);
            }
            
            // Ocultar spinner después de mostrar resultados
            $('#spinnerBusqueda').hide();
        } catch (error) {
            console.error('Error al buscar trabajadores:', error);
            $('#spinnerBusqueda').hide();
            showNotification('Error al buscar trabajadores', 'danger');
        }
    },
    
    mostrarResultados: function(trabajadores) {
        const contenedor = $('#resultadosBusqueda');
        contenedor.empty();
        
        if (trabajadores.length === 0) {
            contenedor.append('<div class="list-group-item text-muted">No se encontraron trabajadores de PLANILLA</div>');
            contenedor.show();
            return;
        }
        
        trabajadores.forEach(trabajador => {
            const nombreCompleto = `${trabajador.apellidoPaterno || ''} ${trabajador.apellidoMaterno || ''} ${trabajador.nombres || ''}`.trim();
            const dni = trabajador.numeroDocumento || '';
            const item = $(`
                <a href="#" class="list-group-item list-group-item-action" data-id="${trabajador.id}" data-nombre="${nombreCompleto}" data-dni="${dni}">
                    <strong>${dni}</strong> - ${nombreCompleto}
                </a>
            `);
            
            item.on('click', (e) => {
                e.preventDefault();
                this.seleccionarTrabajador(trabajador.id, nombreCompleto, dni);
            });
            
            contenedor.append(item);
        });
        
        contenedor.show();
    },
    
    seleccionarTrabajador: function(id, nombreCompleto, dni) {
        $('#trabajadorId').val(id);
        $('#nombreCompleto').val(nombreCompleto);
        $('#buscarTrabajador').val(dni).data('dni', dni); // Guardar DNI en data attribute
        $('#resultadosBusqueda').hide().empty();
        $('#spinnerBusqueda').hide();
        console.log('✅ Trabajador seleccionado:', id, nombreCompleto, dni);
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
            }
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        }
    },
    
    cargarTurnos: async function() {
        try {
            const response = await fetch('/api/turnos');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#turno');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(turno => {
                    const option = `<option value="${turno.id}">${turno.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    },
    
    cargarHorarios: async function() {
        try {
            const response = await fetch('/api/horarios');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#horario');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(horario => {
                    const option = `<option value="${horario.id}">${horario.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    },
    
    cargarDiasDescanso: async function() {
        try {
            const response = await fetch('/api/dias-semana');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#diaDescanso');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(dia => {
                    const option = `<option value="${dia.id}">${dia.descripcion}</option>`;
                    select.append(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar días de descanso:', error);
        }
    },
    
    cargarTiposTrabajador: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/tipo-trabajador?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoTrabajador');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    // Guardar información adicional en data attributes
                    const option = $('<option></option>')
                        .val(tipo.id)
                        .text(`${tipo.codigoInterno} - ${tipo.descripcion}`)
                        .attr('data-tipo-id', tipo.tipo?.id || '')
                        .attr('data-tipo-codigo', tipo.tipo?.codSunat || '')
                        .attr('data-regimen-id', tipo.regimenPensionario?.id || '')
                        .attr('data-regimen-codigo', tipo.regimenPensionario?.codSunat || '');
                    
                    select.append(option);
                });
                
                console.log('✅ Tipos de trabajador cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de trabajador:', error);
            showNotification('Error al cargar tipos de trabajador', 'danger');
        }
    },
    
    cargarRegimenesPensionarios: async function() {
        try {
            const response = await fetch('/api/regimenes');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#regimenPensionario');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    // Mostrar código SUNAT y abreviatura
                    const option = $('<option></option>')
                        .val(regimen.id)
                        .text(`${regimen.codSunat} - ${regimen.abreviatura}`)
                        .attr('data-codigo', regimen.codSunat)
                        .attr('data-descripcion', regimen.descripcion)
                        .attr('data-abreviatura', regimen.abreviatura);
                    
                    select.append(option);
                });
                
                console.log('✅ Regímenes pensionarios cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar regímenes pensionarios:', error);
            showNotification('Error al cargar regímenes pensionarios', 'danger');
        }
    },
    
    cargarRegimenesLaborales: async function() {
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            console.log('🔍 Cargando regímenes laborales para empresa:', empresaId);
            
            // Usar endpoint que trae solo regímenes con conceptos asignados
            const response = await fetch(`/api/conceptos-regimen-laboral/regimenes-activos?empresaId=${empresaId}`);
            const result = await response.json();
            
            console.log('📦 Respuesta regímenes laborales:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                const select = $('#regimenLaboral');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(regimen => {
                    // Mostrar código SUNAT y nombre del régimen laboral
                    // IMPORTANTE: Usar codsunat como valor porque es el que se usa en ic_regimenlaboral
                    const option = $('<option></option>')
                        .val(regimen.codsunat)
                        .text(`${regimen.codsunat} - ${regimen.regimenlaboral}`)
                        .attr('data-id', regimen.id)
                        .attr('data-codigo', regimen.codsunat)
                        .attr('data-nombre', regimen.regimenlaboral)
                        .attr('data-descripcion', regimen.descripcion);
                    
                    select.append(option);
                });
                
                console.log('✅ Regímenes laborales con conceptos cargados:', result.data.length);
            } else {
                console.warn('⚠️ No hay regímenes laborales con conceptos asignados para empresa', empresaId);
                const select = $('#regimenLaboral');
                select.find('option:not(:first)').remove();
                select.append('<option value="" disabled>No hay regímenes configurados</option>');
            }
        } catch (error) {
            console.error('Error al cargar regímenes laborales:', error);
            showNotification('Error al cargar regímenes laborales', 'danger');
        }
    },
    
    configurarCalculos: function() {
        const self = this;
        
        // Calcular Hora Laboral cuando cambien H. Entrada o H. Salida
        $('#horaEntrada, #horaSalida').off('change').on('change', function() {
            const entrada = $('#horaEntrada').val();
            const salida = $('#horaSalida').val();
            
            if (entrada && salida) {
                const [hE, mE] = entrada.split(':').map(Number);
                const [hS, mS] = salida.split(':').map(Number);
                
                const minutosEntrada = hE * 60 + mE;
                const minutosSalida = hS * 60 + mS;
                
                let diferencia = minutosSalida - minutosEntrada;
                if (diferencia < 0) diferencia += 24 * 60; // Si cruza medianoche
                
                const horas = (diferencia / 60).toFixed(1);
                $('#horaLaboral').val(horas);
            }
        });
        
        // Calcular Sueldo Total cuando cambien Remuneración Básica o R.C.
        $('#remuneracionBasica, #remuneracionRC').off('input').on('input', function() {
            const basica = parseFloat($('#remuneracionBasica').val()) || 0;
            const rc = parseFloat($('#remuneracionRC').val()) || 0;
            const total = (basica + rc).toFixed(2);
            $('#sueldoTotal').val(total);
        });
        
        // Evento al cambiar tipo de trabajador
        $('#tipoTrabajador').off('change').on('change', function() {
            const selectedOption = $(this).find('option:selected');
            const tipoId = selectedOption.attr('data-tipo-id');
            const tipoCodigo = selectedOption.attr('data-tipo-codigo');
            const regimenId = selectedOption.attr('data-regimen-id');
            const regimenCodigo = selectedOption.attr('data-regimen-codigo');
            
            console.log('Tipo Trabajador seleccionado:', {
                id: $(this).val(),
                tipoId: tipoId,
                tipoCodigo: tipoCodigo,
                regimenId: regimenId,
                regimenCodigo: regimenCodigo
            });
            
            // Seleccionar automáticamente el régimen pensionario asociado
            if (regimenId) {
                $('#regimenPensionario').val(regimenId);
                // Bloquear el campo de régimen pensionario
                $('#regimenPensionario').prop('disabled', true);
                // Agregar estilo visual de campo bloqueado
                $('#regimenPensionario').css('background-color', '#e9ecef');
                
                console.log('✅ Régimen Pensionario seleccionado automáticamente:', regimenId);
            } else {
                // Si no hay régimen asociado, desbloquear el campo
                $('#regimenPensionario').prop('disabled', false);
                $('#regimenPensionario').css('background-color', '');
            }
        });
        
        // Evento al cambiar régimen pensionario
        $('#regimenPensionario').off('change').on('change', function() {
            const selectedOption = $(this).find('option:selected');
            const codigo = selectedOption.attr('data-codigo');
            const descripcion = selectedOption.attr('data-descripcion');
            const abreviatura = selectedOption.attr('data-abreviatura');
            
            console.log('Régimen Pensionario seleccionado:', {
                id: $(this).val(),
                codigo: codigo,
                descripcion: descripcion,
                abreviatura: abreviatura
            });
            
            // Mostrar/ocultar campo CUSPP según el régimen
            // ONP tiene código '02', AFP tienen códigos que empiezan con '2' (21, 22, 23, 24)
            if (codigo && codigo !== '02') {
                // Es AFP, mostrar campo CUSPP
                $('#filaCuspp').show();
                $('#cuspp').prop('required', true);
                console.log('✅ Campo CUSPP mostrado (AFP)');
            } else {
                // Es ONP o no seleccionado, ocultar campo CUSPP
                $('#filaCuspp').hide();
                $('#cuspp').prop('required', false).val('');
                console.log('⚪ Campo CUSPP oculto (ONP)');
            }
        });
        
        // Evento al cambiar régimen laboral
        $('#regimenLaboral').off('change').on('change', function() {
            const selectedOption = $(this).find('option:selected');
            const codigo = selectedOption.attr('data-codigo');
            const nombre = selectedOption.attr('data-nombre');
            const descripcion = selectedOption.attr('data-descripcion');
            
            console.log('Régimen Laboral seleccionado:', {
                id: $(this).val(),
                codigo: codigo,
                nombre: nombre,
                descripcion: descripcion
            });
        });
        
        // Autocomplete para buscar trabajador (búsqueda instantánea)
        $('#buscarTrabajador').off('input').on('input', function() {
            const termino = $(this).val().trim();
            
            if (termino.length < 2) {
                $('#resultadosBusqueda').hide().empty();
                return;
            }
            
            self.buscarTrabajadores(termino);
        });
        
        // Ocultar resultados al hacer clic fuera
        $(document).off('click.busqueda').on('click.busqueda', function(e) {
            if (!$(e.target).closest('#buscarTrabajador, #resultadosBusqueda').length) {
                $('#resultadosBusqueda').hide();
            }
        });
        
        // Limpiar al hacer focus
        $('#buscarTrabajador').off('focus').on('focus', function() {
            if ($('#trabajadorId').val()) {
                // Si ya hay un trabajador seleccionado, no limpiar
                return;
            }
            $(this).select();
        });
    },

    cargarTiposContrato: async function() {
        try {
            const response = await fetch('/api/tipos-contrato');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoContrato');
                select.find('option:not(:first)').remove();
                
                result.data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.codigo} - ${tipo.descripcion}</option>`;
                    select.append(option);
                });
                
                console.log('✅ Tipos de contrato cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de contrato:', error);
        }
    },

    consultar: function() {
        this.tablaContratos.ajax.reload();
        showNotification('Datos actualizados', 'success');
    },

    guardar: async function() {
        const form = $('#formContrato')[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        try {
            // Validar que se haya seleccionado un trabajador
            const trabajadorId = $('#trabajadorId').val();
            if (!trabajadorId) {
                showNotification('Debe seleccionar un trabajador', 'warning');
                return;
            }
            
            // Preparar datos
            // Obtener el ID del régimen laboral desde el data attribute
            const regimenLaboralOption = $('#regimenLaboral option:selected');
            const regimenLaboralId = regimenLaboralOption.attr('data-id');
            
            const datos = {
                trabajadorId: parseInt(trabajadorId),
                tipoContratoId: parseInt($('#tipoContrato').val()),
                fechaIngresoLaboral: $('#fechaIngresoLaboral').val() || null,
                fechaInicio: $('#fechaInicio').val(),
                fechaFin: $('#fechaFin').val() || null,
                sedeId: parseInt($('#sede').val()),
                puestoId: parseInt($('#puesto').val()),
                turnoId: $('#turno').val(),
                horarioId: $('#horario').val(),
                horaEntrada: $('#horaEntrada').val(),
                horaSalida: $('#horaSalida').val(),
                diaDescansoId: $('#diaDescanso').val(),
                tipoTrabajadorId: parseInt($('#tipoTrabajador').val()),
                regimenPensionarioId: parseInt($('#regimenPensionario').val()),
                regimenLaboralId: parseInt(regimenLaboralId), // Usar el ID del data attribute
                horaLaboral: parseFloat($('#horaLaboral').val()) || 0,
                remuneracionBasica: parseFloat($('#remuneracionBasica').val()) || 0,
                remuneracionRc: parseFloat($('#remuneracionRC').val()) || 0,
                sueldoMensual: parseFloat($('#sueldoTotal').val()) || 0,
                cuspp: $('#cuspp').val() || null,
                empresaId: parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1,
                usuarioId: parseInt(localStorage.getItem('usuario_id')) || 1
            };
            
            console.log('Datos a enviar:', datos);
            
            // Verificar si es edición o creación
            const contratoId = $('#contratoId').val();
            const esEdicion = contratoId && contratoId !== '';
            
            // Deshabilitar botón mientras se guarda
            const btnGuardar = $('.btn-guardar-contrato');
            btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>' + (esEdicion ? 'Actualizando...' : 'Guardando...'));
            
            // Enviar al backend
            const url = esEdicion ? `/api/contratos/${contratoId}` : '/api/contratos';
            const method = esEdicion ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            console.log('📦 Respuesta del servidor:', result);
            console.log('🔍 Es edición:', esEdicion);
            console.log('🔍 result.data:', result.data);
            
            if (result.success) {
                showNotification(esEdicion ? 'Contrato actualizado exitosamente' : 'Contrato guardado exitosamente', 'success');
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalContrato'));
                if (modal) {
                    modal.hide();
                }
                
                // Recargar tabla
                this.tablaContratos.ajax.reload();
                
                // Si es un nuevo contrato, guardar conceptos automáticamente y abrir modal
                if (!esEdicion) {
                    console.log('✅ Es un nuevo contrato, guardando conceptos automáticamente...');
                    
                    // Obtener el ID del contrato (puede venir en diferentes formatos)
                    const contratoId = result.data?.id || result.data?.imcontrato_id || result.data;
                    const nroDocumento = $('#buscarTrabajador').val() || '';
                    const nombreCompleto = $('#nombreCompleto').val() || '';
                    // Usar el código del régimen laboral (value del select) para buscar conceptos
                    const regimenLaboralCodigo = $('#regimenLaboral').val();
                    const sueldoTotal = $('#sueldoTotal').val();
                    
                    console.log('📋 Datos para modal:', {
                        contratoId,
                        nroDocumento,
                        nombreCompleto,
                        regimenLaboralCodigo,
                        sueldoTotal
                    });
                    
                    if (contratoId && regimenLaboralCodigo) {
                        // Guardar referencia a this
                        const self = this;
                        // Esperar un momento para que se cierre el modal anterior
                        setTimeout(async function() {
                            // Guardar conceptos automáticamente primero
                            await self.guardarConceptosAutomaticamente(contratoId, regimenLaboralCodigo, sueldoTotal);
                            // Luego abrir modal para editar
                            self.abrirModalConceptosParaEditar(contratoId, nroDocumento, nombreCompleto);
                        }, 500);
                    } else {
                        console.error('❌ Faltan datos para abrir el modal de conceptos');
                    }
                }
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
            
        } catch (error) {
            console.error('Error al guardar contrato:', error);
            showNotification('Error al guardar contrato: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            const btnGuardar = $('.btn-guardar-contrato');
            btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },

    editar: async function(id) {
        const self = this;
        
        try {
            // Obtener datos del contrato
            const response = await fetch(`/api/contratos/${id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const contrato = result.data;
                
                // Cargar todos los selects primero
                await Promise.all([
                    this.cargarTiposContrato(),
                    this.cargarSedes(),
                    this.cargarPuestos(),
                    this.cargarTurnos(),
                    this.cargarHorarios(),
                    this.cargarDiasDescanso(),
                    this.cargarTiposTrabajador(),
                    this.cargarRegimenesPensionarios(),
                    this.cargarRegimenesLaborales()
                ]);
                
                // Llenar formulario
                $('#contratoId').val(contrato.id);
                $('#trabajadorId').val(contrato.trabajadorId);
                
                // Buscar y mostrar el trabajador
                const trabajadorResponse = await fetch(`/api/trabajadores/${contrato.trabajadorId}`);
                const trabajadorResult = await trabajadorResponse.json();
                if (trabajadorResult.success && trabajadorResult.data) {
                    const trabajador = trabajadorResult.data;
                    const nombreCompleto = `${trabajador.apellidoPaterno || ''} ${trabajador.apellidoMaterno || ''} ${trabajador.nombres || ''}`.trim();
                    $('#buscarTrabajador').val(trabajador.numeroDocumento);
                    $('#nombreCompleto').val(nombreCompleto);
                }
                
                // Llenar campos del contrato
                $('#tipoContrato').val(contrato.tipoContratoId);
                $('#fechaIngresoLaboral').val(contrato.fechaInicio); // Fecha de inicio del contrato
                $('#fechaInicio').val(contrato.fechaInicio);
                $('#fechaFin').val(contrato.fechaFin || '');
                $('#sede').val(contrato.sedeId);
                $('#puesto').val(contrato.puestoId);
                $('#turno').val(contrato.turnoId);
                $('#horario').val(contrato.horarioId);
                $('#horaEntrada').val(contrato.horaEntrada);
                $('#horaSalida').val(contrato.horaSalida);
                $('#diaDescanso').val(contrato.diaDescansoId);
                $('#tipoTrabajador').val(contrato.tipoTrabajadorId);
                $('#regimenPensionario').val(contrato.regimenPensionarioId);
                
                // Régimen Laboral - con timeout para asegurar que el select esté listo
                setTimeout(() => {
                    $('#regimenLaboral').val(contrato.regimenLaboralId);
                    console.log('Régimen Laboral ID:', contrato.regimenLaboralId);
                    console.log('Opciones disponibles:', $('#regimenLaboral option').map(function() { 
                        return $(this).val(); 
                    }).get());
                    console.log('Valor seleccionado:', $('#regimenLaboral').val());
                }, 100);
                
                $('#horaLaboral').val(contrato.horaLaboral);
                $('#remuneracionBasica').val(contrato.remuneracionBasica);
                $('#remuneracionRC').val(contrato.remuneracionRc);
                $('#sueldoTotal').val(contrato.sueldoMensual);
                $('#cuspp').val(contrato.cuspp || '');
                
                // Mostrar/ocultar campo CUSPP según régimen
                const regimenOption = $('#regimenPensionario option:selected');
                const codigo = regimenOption.attr('data-codigo');
                if (codigo && codigo !== '02') {
                    $('#filaCuspp').show();
                    $('#cuspp').prop('required', true);
                } else {
                    $('#filaCuspp').hide();
                    $('#cuspp').prop('required', false);
                }
                
                // Cambiar título y botón
                $('#modalContratoTitle').text('Editar Contrato');
                $('.btn-guardar-contrato').html('<i class="fas fa-save me-1"></i>Actualizar');
                
                // Configurar cálculos automáticos
                this.configurarCalculos();
                
                // Abrir modal
                const modal = new bootstrap.Modal(document.getElementById('modalContrato'));
                modal.show();
                
            } else {
                showNotification('No se pudo cargar el contrato', 'danger');
            }
        } catch (error) {
            console.error('Error al cargar contrato:', error);
            showNotification('Error al cargar contrato: ' + error.message, 'danger');
        }
    },
    
    modificarConceptos: async function(id) {
        const self = this;
        
        try {
            // Obtener datos del contrato
            const response = await fetch(`/api/contratos/${id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const contrato = result.data;
                
                // Guardar el ID del contrato actual
                self.contratoIdConceptos = id;
                
                // Restaurar título del modal
                $('#modalConceptosTrabajadorTitle').text('Conceptos Del Trabajador');
                
                // Ocultar mensaje de ayuda
                $('#alertConceptosNuevoContrato').addClass('d-none');
                
                // Obtener datos del trabajador
                const trabajadorResponse = await fetch(`/api/trabajadores/${contrato.trabajadorId}`);
                const trabajadorResult = await trabajadorResponse.json();
                
                if (trabajadorResult.success && trabajadorResult.data) {
                    const trabajador = trabajadorResult.data;
                    const nombreCompleto = `${trabajador.apellidoPaterno || ''} ${trabajador.apellidoMaterno || ''} ${trabajador.nombres || ''}`.trim();
                    
                    // Llenar los datos del trabajador
                    $('#conceptoNroDocumento').val(trabajador.numeroDocumento || '');
                    $('#conceptoTrabajador').val(nombreCompleto);
                } else {
                    // Si no se puede obtener el trabajador, dejar vacío
                    $('#conceptoNroDocumento').val('');
                    $('#conceptoTrabajador').val('');
                }
                
                // Limpiar campos de búsqueda
                $('#conceptoCodigo').val('');
                $('#conceptoDescripcion').val('');
                
                // Limpiar la tabla
                self.limpiarTablaConceptos();
                
                // Intentar cargar conceptos guardados del trabajador
                // Si no hay, quedará la tabla vacía para que el usuario los agregue
                await self.cargarConceptosTrabajador(id);
                
                // Mostrar el modal
                $('#modalConceptosTrabajador').modal('show');
                
                // Event listeners para el modal
                self.inicializarEventosConceptos();
            } else {
                showNotification('No se pudo cargar la información del contrato', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al cargar el contrato: ' + error.message, 'danger');
        }
    },
    
    inicializarEventosConceptos: function() {
        const self = this;
        
        // Búsqueda de concepto por código
        $(document).off('input', '#conceptoCodigo').on('input', '#conceptoCodigo', function() {
            const codigo = $(this).val().trim();
            if (codigo.length >= 2) {
                self.buscarConcepto(codigo);
            } else {
                $('#conceptoDescripcion').val('');
            }
        });
        
        // Agregar concepto
        $(document).off('click', '#btnAgregarConcepto').on('click', '#btnAgregarConcepto', function() {
            self.agregarConceptoATabla();
        });
        
        // Eliminar concepto de la tabla
        $(document).off('click', '.btn-eliminar-concepto').on('click', '.btn-eliminar-concepto', function() {
            $(this).closest('tr').remove();
            self.actualizarNumeracionTabla();
        });
        
        // Guardar conceptos
        $(document).off('click', '#btnGuardarConceptos').on('click', '#btnGuardarConceptos', function() {
            self.guardarConceptosTrabajador();
        });
    },
    
    buscarConcepto: function(codigo) {
        // Por ahora, simulamos la búsqueda
        // Aquí irá la llamada al API cuando esté lista
        console.log('Buscando concepto:', codigo);
        
        // Simulación temporal
        setTimeout(() => {
            $('#conceptoDescripcion').val('Concepto encontrado - ' + codigo);
        }, 300);
    },
    
    agregarConceptoATabla: function() {
        const codigo = $('#conceptoCodigo').val().trim();
        const descripcion = $('#conceptoDescripcion').val().trim();
        
        if (!codigo || !descripcion) {
            showNotification('Debe buscar y seleccionar un concepto válido', 'warning');
            return;
        }
        
        // Verificar si ya existe en la tabla
        let existe = false;
        $('#tablaConceptosTrabajadorBody tr').each(function() {
            const codigoExistente = $(this).find('td:eq(1)').text();
            if (codigoExistente === codigo) {
                existe = true;
                return false;
            }
        });
        
        if (existe) {
            showNotification('Este concepto ya está en la lista', 'warning');
            return;
        }
        
        // Limpiar mensaje de "no hay datos"
        if ($('#tablaConceptosTrabajadorBody tr td[colspan]').length > 0) {
            $('#tablaConceptosTrabajadorBody').empty();
        }
        
        // Agregar fila a la tabla
        const numeroFila = $('#tablaConceptosTrabajadorBody tr').length + 1;
        const nuevaFila = `
            <tr>
                <td class="text-center">${numeroFila}</td>
                <td class="text-center">${codigo}</td>
                <td>${descripcion}</td>
                <td class="text-center">
                    <select class="form-select form-select-sm tipo-concepto">
                        <option value="VARIABLE">VARIABLE</option>
                        <option value="FIJO">FIJO</option>
                    </select>
                </td>
                <td class="text-center">
                    <select class="form-select form-select-sm tipo-valor">
                        <option value="">Seleccione...</option>
                        <option value="MONTO">MONTO</option>
                        <option value="PORCENTAJE">PORCENTAJE</option>
                    </select>
                </td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm valor-concepto" 
                           placeholder="0.00" 
                           step="0.01"
                           min="0">
                </td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-concepto">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        $('#tablaConceptosTrabajadorBody').append(nuevaFila);
        
        // Limpiar campos
        $('#conceptoCodigo').val('');
        $('#conceptoDescripcion').val('');
        
        // Re-inicializar event listener para el nuevo botón eliminar
        this.inicializarEventosConceptos();
        
        showNotification('Concepto agregado a la lista', 'success');
    },
    
    limpiarTablaConceptos: function() {
        $('#tablaConceptosTrabajadorBody').html(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No hay conceptos asignados
                </td>
            </tr>
        `);
    },
    
    actualizarNumeracionTabla: function() {
        $('#tablaConceptosTrabajadorBody tr').each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
        
        // Si no quedan filas, mostrar mensaje
        if ($('#tablaConceptosTrabajadorBody tr').length === 0) {
            this.limpiarTablaConceptos();
        }
    },
    
    cargarConceptosTrabajador: async function(contratoId) {
        const self = this;
        
        try {
            console.log('🔍 Cargando conceptos del contrato:', contratoId);
            
            const empresaId = parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1;
            const response = await fetch(`/api/conceptos-trabajador/contrato/${contratoId}?empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                const tbody = $('#tablaConceptosTrabajadorBody');
                tbody.empty();
                
                result.data.forEach((concepto, index) => {
                    const nuevaFila = `
                        <tr data-concepto-id="${concepto.concepto_id}">
                            <td class="text-center">${index + 1}</td>
                            <td class="text-center">${concepto.concepto_codigo || ''}</td>
                            <td>${concepto.concepto_descripcion || ''}</td>
                            <td class="text-center">
                                <select class="form-select form-select-sm tipo-concepto">
                                    <option value="VARIABLE" ${concepto.tipo === 'VARIABLE' ? 'selected' : ''}>VARIABLE</option>
                                    <option value="FIJO" ${concepto.tipo === 'FIJO' ? 'selected' : ''}>FIJO</option>
                                </select>
                            </td>
                            <td class="text-center">
                                <select class="form-select form-select-sm tipo-valor">
                                    <option value="">Seleccione...</option>
                                    <option value="MONTO" ${concepto.tipo_valor === 'MONTO' ? 'selected' : ''}>MONTO</option>
                                    <option value="PORCENTAJE" ${concepto.tipo_valor === 'PORCENTAJE' ? 'selected' : ''}>PORCENTAJE</option>
                                </select>
                            </td>
                            <td class="text-center">
                                <input type="number" class="form-control form-control-sm valor-concepto" 
                                       placeholder="0.00" 
                                       value="${concepto.valor || '0.00'}"
                                       step="0.01"
                                       min="0">
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-concepto">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    
                    tbody.append(nuevaFila);
                });
                
                // Re-inicializar event listeners
                self.inicializarEventosConceptos();
                
                console.log(`✅ Cargados ${result.data.length} conceptos guardados del trabajador`);
            } else {
                console.log('⚠️ No hay conceptos guardados para este contrato');
                self.limpiarTablaConceptos();
            }
        } catch (error) {
            console.error('Error al cargar conceptos del trabajador:', error);
            self.limpiarTablaConceptos();
        }
    },
    
    guardarConceptosTrabajador: async function() {
        const self = this;
        
        // Recopilar datos de la tabla
        const conceptos = [];
        let hayErrores = false;
        
        $('#tablaConceptosTrabajadorBody tr').each(function() {
            if ($(this).find('td[colspan]').length === 0) {
                const conceptoId = $(this).data('concepto-id');
                const codigo = $(this).find('td:eq(1)').text();
                const descripcion = $(this).find('td:eq(2)').text();
                const tipo = $(this).find('.tipo-concepto').val();
                const tipoValor = $(this).find('.tipo-valor').val();
                const valor = $(this).find('.valor-concepto').val();
                
                // Validar que tenga tipo valor y valor
                if (!tipoValor) {
                    showNotification(`El concepto "${descripcion}" debe tener un Tipo Valor`, 'warning');
                    hayErrores = true;
                    return false;
                }
                
                if (!valor || parseFloat(valor) < 0) {
                    showNotification(`El concepto "${descripcion}" debe tener un Valor válido`, 'warning');
                    hayErrores = true;
                    return false;
                }
                
                conceptos.push({
                    conceptoId: conceptoId,
                    codigo: codigo,
                    descripcion: descripcion,
                    tipo: tipo,
                    tipoValor: tipoValor,
                    valor: parseFloat(valor)
                });
            }
        });
        
        if (hayErrores) {
            return;
        }
        
        if (conceptos.length === 0) {
            showNotification('No hay conceptos para guardar', 'warning');
            return;
        }
        
        console.log('Guardando conceptos:', {
            contratoId: self.contratoIdConceptos,
            conceptos: conceptos
        });
        
        // Preparar datos para enviar al backend
        const empresaId = parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1;
        const datos = {
            contratoId: self.contratoIdConceptos,
            empresaId: empresaId,
            conceptos: conceptos
        };
        
        const usuarioId = localStorage.getItem('usuario_id') || 1;
        
        try {
            // Deshabilitar botón mientras se guarda
            $('#btnGuardarConceptos').prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');
            
            const response = await fetch(`/api/conceptos-trabajador?usuarioId=${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Conceptos guardados exitosamente', 'success');
                $('#modalConceptosTrabajador').modal('hide');
            } else {
                showNotification('Error: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error al guardar conceptos:', error);
            showNotification('Error al guardar conceptos: ' + error.message, 'danger');
        } finally {
            // Rehabilitar botón
            $('#btnGuardarConceptos').prop('disabled', false)
                .html('<i class="fas fa-save me-1"></i>Guardar');
        }
    },
    
    // Guardar conceptos automáticamente al crear contrato
    guardarConceptosAutomaticamente: async function(contratoId, regimenLaboralCodigo, sueldoTotal) {
        const self = this;
        
        try {
            console.log('💾 Guardando conceptos automáticamente...');
            
            // Obtener conceptos del régimen laboral
            const response = await fetch(`/api/conceptos-regimen-laboral/${regimenLaboralCodigo}/conceptos`);
            const result = await response.json();
            
            if (!result.success || !result.data || result.data.length === 0) {
                console.warn('⚠️ No hay conceptos para este régimen laboral');
                return false;
            }
            
            // Preparar conceptos con valores por defecto
            const conceptos = result.data.map(concepto => {
                let tipo = 'VARIABLE';
                let tipoValor = '';
                let valor = 0;
                
                const descripcion = concepto.descripcion || '';
                const descripcionUpper = descripcion.toUpperCase();
                
                // Lógica para determinar tipo y valores según la descripción
                if (descripcionUpper.includes('REMUNERACIÓN') && (descripcionUpper.includes('BÁSICA') || descripcionUpper.includes('VACACIONAL'))) {
                    tipo = 'FIJO';
                    tipoValor = 'MONTO';
                    valor = parseFloat(sueldoTotal) || 0;
                } else if (descripcionUpper.includes('ESSALUD')) {
                    tipo = 'FIJO';
                    tipoValor = 'PORCENTAJE';
                    valor = 9.00;
                } else if (descripcionUpper.includes('BONIFICACIÓN') && descripcionUpper.includes('9%')) {
                    tipo = 'FIJO';
                    tipoValor = 'PORCENTAJE';
                    valor = 9.00;
                } else if (descripcionUpper.includes('AFP') || descripcionUpper.includes('ONP')) {
                    tipo = 'FIJO';
                    tipoValor = 'PORCENTAJE';
                    valor = 0.00;
                } else if (descripcionUpper.includes('GRATIFICACIÓN') || descripcionUpper.includes('CTS')) {
                    tipo = 'FIJO';
                    tipoValor = 'MONTO';
                    valor = 0.00;
                } else {
                    tipo = 'VARIABLE';
                    tipoValor = 'MONTO';
                    valor = 0.00;
                }
                
                return {
                    conceptoId: concepto.concepto_id,
                    codigo: concepto.tributo_codigo_sunat || '',
                    descripcion: descripcion,
                    tipo: tipo,
                    tipoValor: tipoValor,
                    valor: valor
                };
            });
            
            // Guardar en la base de datos
            const empresaId = parseInt(localStorage.getItem('empresa_id')) || window.EMPRESA_ID || 1;
            const usuarioId = parseInt(localStorage.getItem('usuario_id')) || 1;
            
            const datos = {
                contratoId: contratoId,
                empresaId: empresaId,
                conceptos: conceptos
            };
            
            const saveResponse = await fetch(`/api/conceptos-trabajador?usuarioId=${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const saveResult = await saveResponse.json();
            
            if (saveResult.success) {
                console.log(`✅ ${conceptos.length} conceptos guardados automáticamente`);
                return true;
            } else {
                console.error('❌ Error al guardar conceptos:', saveResult.message);
                return false;
            }
            
        } catch (error) {
            console.error('Error al guardar conceptos automáticamente:', error);
            return false;
        }
    },
    
    // Abrir modal para editar conceptos ya guardados
    abrirModalConceptosParaEditar: async function(contratoId, nroDocumento, nombreCompleto) {
        const self = this;
        
        try {
            // Guardar el ID del contrato actual
            self.contratoIdConceptos = contratoId;
            
            // Cambiar título del modal
            $('#modalConceptosTrabajadorTitle').html('Conceptos Del Trabajador <small class="text-muted">(Editar)</small>');
            
            // Mostrar mensaje de ayuda
            $('#alertConceptosNuevoContrato').removeClass('d-none');
            
            // Llenar los datos del trabajador
            $('#conceptoNroDocumento').val(nroDocumento);
            $('#conceptoTrabajador').val(nombreCompleto);
            
            // Limpiar campos de búsqueda
            $('#conceptoCodigo').val('');
            $('#conceptoDescripcion').val('');
            
            // Limpiar la tabla
            self.limpiarTablaConceptos();
            
            // Cargar conceptos guardados de la base de datos
            await self.cargarConceptosTrabajador(contratoId);
            
            // Mostrar el modal
            $('#modalConceptosTrabajador').modal('show');
            
            // Event listeners para el modal
            self.inicializarEventosConceptos();
            
        } catch (error) {
            console.error('Error al abrir modal de conceptos:', error);
            showNotification('Error al cargar conceptos: ' + error.message, 'danger');
        }
    },
    
    // Abrir modal de conceptos automáticamente después de crear contrato (DEPRECATED - mantener por compatibilidad)
    abrirModalConceptosAutomatico: async function(contratoId, nroDocumento, nombreCompleto, regimenLaboralId, sueldoTotal) {
        const self = this;
        
        try {
            // Guardar el ID del contrato actual
            self.contratoIdConceptos = contratoId;
            
            // Cambiar título del modal para indicar que es un nuevo contrato
            $('#modalConceptosTrabajadorTitle').html('Conceptos Del Trabajador <small class="text-muted">(Nuevo Contrato)</small>');
            
            // Llenar los datos del trabajador
            $('#conceptoNroDocumento').val(nroDocumento);
            $('#conceptoTrabajador').val(nombreCompleto);
            
            // Limpiar campos de búsqueda
            $('#conceptoCodigo').val('');
            $('#conceptoDescripcion').val('');
            
            // Limpiar la tabla
            self.limpiarTablaConceptos();
            
            // Cargar conceptos del régimen laboral
            await self.cargarConceptosDesdeRegimen(regimenLaboralId, sueldoTotal);
            
            // Mostrar mensaje de ayuda en el modal
            $('#alertConceptosNuevoContrato').removeClass('d-none');
            
            // Mostrar el modal
            $('#modalConceptosTrabajador').modal('show');
            
            // Event listeners para el modal
            self.inicializarEventosConceptos();
            
        } catch (error) {
            console.error('Error al abrir modal de conceptos:', error);
            showNotification('Error al cargar conceptos: ' + error.message, 'danger');
        }
    },
    
    // Cargar conceptos desde el régimen laboral
    cargarConceptosDesdeRegimen: async function(regimenLaboralId, sueldoTotal) {
        const self = this;
        
        try {
            console.log('🔍 Cargando conceptos para régimen laboral:', regimenLaboralId);
            
            // Obtener conceptos del régimen laboral desde la tabla rrhh_concepto_regimen_detalle
            const response = await fetch(`/api/conceptos-regimen-laboral/${regimenLaboralId}/conceptos`);
            const result = await response.json();
            
            console.log('📦 Respuesta de conceptos:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                const tbody = $('#tablaConceptosTrabajadorBody');
                tbody.empty();
                
                result.data.forEach((concepto, index) => {
                    // Determinar tipo y tipo valor según el concepto
                    let tipo = 'VARIABLE';
                    let tipoValor = '';
                    let valorInput = '';
                    
                    const descripcion = concepto.descripcion || '';
                    const descripcionUpper = descripcion.toUpperCase();
                    const codigo = concepto.tributo_codigo_sunat || concepto.concepto_id || (index + 1);
                    
                    // Lógica para determinar tipo y valores según la descripción
                    if (descripcionUpper.includes('REMUNERACIÓN') && (descripcionUpper.includes('BÁSICA') || descripcionUpper.includes('VACACIONAL'))) {
                        tipo = 'FIJO';
                        tipoValor = 'MONTO';
                        valorInput = sueldoTotal || '0.00';
                    } else if (descripcionUpper.includes('ESSALUD')) {
                        tipo = 'FIJO';
                        tipoValor = 'PORCENTAJE';
                        valorInput = '9.00';
                    } else if (descripcionUpper.includes('BONIFICACIÓN') && descripcionUpper.includes('9%')) {
                        tipo = 'FIJO';
                        tipoValor = 'PORCENTAJE';
                        valorInput = '9.00';
                    } else if (descripcionUpper.includes('AFP') || descripcionUpper.includes('ONP')) {
                        tipo = 'FIJO';
                        tipoValor = 'PORCENTAJE';
                        valorInput = '0.00';
                    } else if (descripcionUpper.includes('GRATIFICACIÓN') || descripcionUpper.includes('CTS')) {
                        tipo = 'FIJO';
                        tipoValor = 'MONTO';
                        valorInput = '0.00';
                    }
                    
                    const nuevaFila = `
                        <tr data-concepto-id="${concepto.concepto_id}">
                            <td class="text-center">${index + 1}</td>
                            <td class="text-center">${codigo}</td>
                            <td>${descripcion}</td>
                            <td class="text-center">
                                <select class="form-select form-select-sm tipo-concepto">
                                    <option value="VARIABLE" ${tipo === 'VARIABLE' ? 'selected' : ''}>VARIABLE</option>
                                    <option value="FIJO" ${tipo === 'FIJO' ? 'selected' : ''}>FIJO</option>
                                </select>
                            </td>
                            <td class="text-center">
                                <select class="form-select form-select-sm tipo-valor">
                                    <option value="">Seleccione...</option>
                                    <option value="MONTO" ${tipoValor === 'MONTO' ? 'selected' : ''}>MONTO</option>
                                    <option value="PORCENTAJE" ${tipoValor === 'PORCENTAJE' ? 'selected' : ''}>PORCENTAJE</option>
                                </select>
                            </td>
                            <td class="text-center">
                                <input type="number" class="form-control form-control-sm valor-concepto" 
                                       placeholder="0.00" 
                                       value="${valorInput}"
                                       step="0.01"
                                       min="0">
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-concepto">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    
                    tbody.append(nuevaFila);
                });
                
                // Re-inicializar event listeners
                self.inicializarEventosConceptos();
                
                console.log(`✅ Cargados ${result.data.length} conceptos del régimen laboral`);
                // No mostrar notificación aquí, se mostrará en abrirModalConceptosAutomatico
            } else {
                console.log('⚠️ No se encontraron conceptos para este régimen laboral');
                showNotification('No hay conceptos configurados para este régimen laboral', 'warning');
                self.limpiarTablaConceptos();
            }
            
        } catch (error) {
            console.error('Error al cargar conceptos del régimen:', error);
            showNotification('Error al cargar conceptos del régimen laboral', 'danger');
            self.limpiarTablaConceptos();
        }
    },
    
    finalizarContrato: function(id) {
        if (confirm('¿Está seguro de finalizar este contrato?')) {
            showNotification('Funcionalidad de finalizar contrato en desarrollo', 'info');
        }
    },

    eliminar: function(id) {
        if (confirm('¿Está seguro de eliminar este contrato? Esta acción no se puede deshacer.')) {
            showNotification('Funcionalidad de eliminar contrato en desarrollo', 'info');
        }
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo contrato.js cargado');
    
    // Intentar inicializar si la tabla ya existe
    if ($('#tablaContratos').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        contrato.init();
    } else {
        console.log('⏳ Tabla no encontrada aún, esperando carga dinámica...');
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observer = new MutationObserver(function(mutations) {
    if ($('#tablaContratos').length > 0 && !contrato.tablaContratos) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observer.disconnect();
        contrato.init();
    }
});

// Observar cambios en el contenedor principal
if (document.querySelector('main')) {
    observer.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
