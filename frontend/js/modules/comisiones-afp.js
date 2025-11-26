// Módulo de Comisiones AFP
(function() {
    'use strict';

    window.ComisionesAFP = {
        table: null,
        
        // Inicializar el módulo
        init: function() {
            console.log('✅ Módulo Comisiones AFP inicializado');
            this.inicializarDataTable();
            this.configurarEventos();
            this.configurarValidaciones();
        },

        // Inicializar DataTable
        inicializarDataTable: function() {
            const self = this;
            
            // Destruir tabla existente si hay
            if ($.fn.DataTable.isDataTable('#tablaComisiones')) {
                $('#tablaComisiones').DataTable().destroy();
            }
            
            // Obtener empresa_id
            const empresaId = localStorage.getItem('empresa_id') || 1;
            
            // Crear la tabla
            this.table = $('#tablaComisiones').DataTable({
                ajax: {
                    url: `/api/comisiones-afp?empresaId=${empresaId}`,
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
                        width: '60px'
                    },
                    { 
                        data: null,
                        className: 'text-center',
                        width: '120px',
                        render: function(data, type, row) {
                            // Mostrar régimen AFP
                            if (row.regimenPensionario && row.regimenPensionario.abreviatura) {
                                return row.regimenPensionario.abreviatura;
                            }
                            return 'N/A';
                        }
                    },
                    { 
                        data: null,
                        className: 'text-center',
                        width: '100px',
                        render: function(data, type, row) {
                            // Mostrar periodo
                            const mes = String(row.mes).padStart(2, '0');
                            return `${mes}/${row.anio}`;
                        }
                    },
                    { 
                        data: 'comisionFlujo',
                        className: 'text-end',
                        render: function(data) {
                            return parseFloat(data).toFixed(2) + '%';
                        }
                    },
                    { 
                        data: 'comisionAnualSaldo',
                        className: 'text-end',
                        render: function(data) {
                            return parseFloat(data).toFixed(2);
                        }
                    },
                    { 
                        data: 'primaSeguro',
                        className: 'text-end',
                        render: function(data) {
                            return parseFloat(data).toFixed(2) + '%';
                        }
                    },
                    { 
                        data: 'aporteObligatorio',
                        className: 'text-end',
                        render: function(data) {
                            return parseFloat(data).toFixed(2) + '%';
                        }
                    },
                    { 
                        data: 'remuneracionMaxima',
                        className: 'text-end',
                        render: function(data) {
                            return parseFloat(data).toFixed(2);
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
                                <button class="btn btn-action btn-editar" onclick="ComisionesAFP.editar(${row.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-action btn-eliminar" onclick="ComisionesAFP.eliminar(${row.id})" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            `;
                        }
                    }
                ],
                language: {
                    decimal: "",
                    emptyTable: "No hay comisiones AFP registradas",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Mostrando 0 a 0 de 0 registros",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    infoPostFix: "",
                    thousands: ",",
                    lengthMenu: "Mostrar _MENU_ registros",
                    loadingRecords: "Cargando...",
                    processing: "Procesando...",
                    search: "Buscar:",
                    zeroRecords: "No se encontraron registros coincidentes",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                },
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
                responsive: true,
                dom: 'lftip',
                order: [[2, 'desc'], [1, 'asc']],
                initComplete: function() {
                    console.log('✅ DataTable de Comisiones AFP inicializada');
                }
            });
        },

        // Actualizar tabla
        actualizar: function() {
            if (this.table) {
                this.table.ajax.reload(null, false);
                showNotification('Tabla actualizada', 'info');
            }
        },

        // Filtrar por periodo
        filtrarPorPeriodo: function() {
            const periodo = $('#filtroPeriodo').val();
            
            if (!periodo) {
                showNotification('Por favor seleccione un periodo', 'warning');
                return;
            }
            
            if (this.table) {
                // Extraer mes y año
                const [anio, mes] = periodo.split('-');
                const mesNum = parseInt(mes);
                const anioNum = parseInt(anio);
                
                // Aplicar filtro personalizado
                $.fn.dataTable.ext.search.push(
                    function(settings, data, dataIndex) {
                        const rowData = $('#tablaComisiones').DataTable().row(dataIndex).data();
                        return rowData.mes === mesNum && rowData.anio === anioNum;
                    }
                );
                
                this.table.draw();
                
                showNotification(`Mostrando comisiones de ${mes}/${anio}`, 'info');
            }
        },

        // Limpiar filtro
        limpiarFiltro: function() {
            $('#filtroPeriodo').val('');
            
            if (this.table) {
                // Limpiar filtros personalizados
                $.fn.dataTable.ext.search.pop();
                this.table.draw();
                
                showNotification('Filtro eliminado', 'info');
            }
        },

        // Configurar eventos del módulo
        configurarEventos: function() {
            const self = this;
            
            // Botón Nuevo
            $(document).off('click', '.btn-nuevo-comisiones').on('click', '.btn-nuevo-comisiones', function() {
                self.nuevo();
            });
            
            // Botón Actualizar
            $(document).off('click', '.btn-actualizar-comisiones').on('click', '.btn-actualizar-comisiones', function() {
                self.actualizar();
            });
            
            // Botón Buscar por periodo
            $(document).off('click', '.btn-buscar-periodo').on('click', '.btn-buscar-periodo', function() {
                self.filtrarPorPeriodo();
            });
            
            // Botón Limpiar filtro
            $(document).off('click', '.btn-limpiar-filtro').on('click', '.btn-limpiar-filtro', function() {
                self.limpiarFiltro();
            });
            
            // Buscar al presionar Enter en el input de periodo
            $(document).off('keypress', '#filtroPeriodo').on('keypress', '#filtroPeriodo', function(e) {
                if (e.which === 13) {
                    self.filtrarPorPeriodo();
                }
            });
            
            // Botón Guardar en modal
            $(document).off('click', '.btn-guardar-afp').on('click', '.btn-guardar-afp', function() {
                self.guardar();
            });
            
            // Botón Cancelar en modal
            $(document).off('click', '.btn-cancelar-afp').on('click', '.btn-cancelar-afp', function() {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAFP'));
                if (modal) {
                    modal.hide();
                }
            });
            
            // Limpiar formulario al cerrar modal
            $('#modalAFP').on('hidden.bs.modal', function() {
                self.limpiarFormulario();
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open').css('overflow', '');
            });
        },

        // Configurar validaciones para inputs decimales
        configurarValidaciones: function() {
            // Formatear al perder el foco
            $(document).on('blur', '.decimal-input', function() {
                let valor = $(this).val().trim();
                
                // Si está vacío, poner 0.00
                if (valor === '' || valor === '.') {
                    $(this).val('0.00');
                    return;
                }
                
                // Reemplazar coma por punto
                valor = valor.replace(',', '.');
                
                // Convertir a número
                let numero = parseFloat(valor);
                
                // Validar que sea un número válido
                if (isNaN(numero)) {
                    $(this).val('0.00');
                    return;
                }
                
                // Validar que no sea negativo
                if (numero < 0) {
                    numero = 0;
                }
                
                // Validar máximo si tiene atributo max
                const max = parseFloat($(this).attr('max'));
                if (!isNaN(max) && numero > max) {
                    numero = max;
                }
                
                // Formatear a 2 decimales
                $(this).val(numero.toFixed(2));
            });
            
            // Prevenir entrada de caracteres no válidos (solo en keypress)
            $(document).on('keypress', '.decimal-input', function(e) {
                const char = String.fromCharCode(e.which);
                const valor = $(this).val();
                
                // Permitir teclas de control
                if (e.which === 8 || e.which === 0 || e.which === 9 || e.which === 13 || e.which === 27) {
                    return true;
                }
                
                // Permitir punto o coma solo si no existe ya
                if ((char === '.' || char === ',') && valor.indexOf('.') === -1 && valor.indexOf(',') === -1) {
                    return true;
                }
                
                // Permitir solo números
                if (char >= '0' && char <= '9') {
                    return true;
                }
                
                // Bloquear cualquier otro carácter
                e.preventDefault();
                return false;
            });
        },

        // Cargar regímenes pensionarios en el combobox (sin ONP)
        cargarRegimenes: async function() {
            try {
                const select = $('#afpRegimen');
                select.html('<option value="" selected disabled>Cargando regímenes...</option>');
                
                const response = await fetch('/api/regimenes');
                
                if (!response.ok) {
                    throw new Error('Error al cargar regímenes desde el servidor');
                }
                
                const result = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    select.empty();
                    select.append('<option value="" selected disabled>Seleccione un régimen...</option>');
                    
                    // Filtrar para excluir ONP (solo mostrar AFP)
                    const regimenesAFP = result.data.filter(regimen => 
                        regimen.abreviatura.toUpperCase() !== 'ONP'
                    );
                    
                    regimenesAFP.forEach(regimen => {
                        // Solo mostrar la abreviatura
                        select.append(`<option value="${regimen.id}">${regimen.abreviatura}</option>`);
                    });
                    
                    console.log('✅ Regímenes AFP cargados (sin ONP):', regimenesAFP.length);
                } else {
                    select.html('<option value="" selected disabled>No hay regímenes disponibles</option>');
                    console.warn('⚠️ No se encontraron regímenes en la base de datos');
                }
            } catch (error) {
                console.error('❌ Error al cargar regímenes:', error);
                const select = $('#afpRegimen');
                select.html('<option value="" selected disabled>Error al cargar regímenes</option>');
                showNotification('Error al cargar regímenes AFP', 'danger');
            }
        },

        // Abrir modal para nuevo AFP
        nuevo: function() {
            this.limpiarFormulario();
            $('#modalAFPTitle').text('Nuevo AFP');
            
            // Establecer periodo actual
            const hoy = new Date();
            const periodo = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
            $('#afpPeriodo').val(periodo);
            
            // Abrir modal inmediatamente
            const modal = new bootstrap.Modal(document.getElementById('modalAFP'));
            modal.show();
            
            // Cargar regímenes en segundo plano
            this.cargarRegimenes().catch(error => {
                console.error('Error al cargar regímenes:', error);
            });
        },

        // Limpiar formulario
        limpiarFormulario: function() {
            $('#formAFP')[0].reset();
            $('#afpId').val('');
            
            // Establecer valores por defecto en 0.00
            $('.decimal-input').val('0.00');
        },

        // Editar comisión AFP
        editar: async function(id) {
            try {
                this.limpiarFormulario();
                $('#modalAFPTitle').text('Editar Comisión AFP');
                
                // Abrir modal inmediatamente
                const modal = new bootstrap.Modal(document.getElementById('modalAFP'));
                modal.show();
                
                // Cargar regímenes y datos en paralelo
                await this.cargarRegimenes();
                
                const response = await fetch(`/api/comisiones-afp/${id}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener la comisión AFP');
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const afp = result.data;
                    
                    $('#afpId').val(afp.id);
                    
                    // Establecer periodo
                    const mes = String(afp.mes).padStart(2, '0');
                    $('#afpPeriodo').val(`${afp.anio}-${mes}`);
                    
                    // Seleccionar régimen
                    if (afp.regimenPensionario && afp.regimenPensionario.id) {
                        $('#afpRegimen').val(afp.regimenPensionario.id);
                    }
                    
                    // Establecer valores
                    $('#afpComisionFlujo').val(parseFloat(afp.comisionFlujo).toFixed(2));
                    $('#afpPrimaSeguro').val(parseFloat(afp.primaSeguro).toFixed(2));
                    $('#afpComisionAnual').val(parseFloat(afp.comisionAnualSaldo).toFixed(2));
                    $('#afpRemuneracionMaxima').val(parseFloat(afp.remuneracionMaxima).toFixed(2));
                    $('#afpAporteObligatorio').val(parseFloat(afp.aporteObligatorio).toFixed(2));
                }

            } catch (error) {
                console.error('Error al editar comisión AFP:', error);
                showNotification('Error al cargar la comisión AFP: ' + error.message, 'danger');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAFP'));
                if (modal) {
                    modal.hide();
                }
            }
        },

        // Eliminar comisión AFP
        eliminar: async function(id) {
            const confirmar = confirm('¿Está seguro de que desea eliminar esta comisión AFP?\n\nEsta acción no se puede deshacer.');
            
            if (!confirmar) {
                return;
            }

            try {
                const response = await fetch(`/api/comisiones-afp/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    showNotification('Comisión AFP eliminada exitosamente', 'success');
                    this.table.ajax.reload(null, false);
                } else {
                    showNotification('Error: ' + result.message, 'danger');
                }

            } catch (error) {
                console.error('Error al eliminar comisión AFP:', error);
                showNotification('Error al eliminar: ' + error.message, 'danger');
            }
        },

        // Guardar AFP
        guardar: async function() {
            try {
                const id = $('#afpId').val();
                const periodo = $('#afpPeriodo').val();
                const regimenId = $('#afpRegimen').val();
                const comisionFlujo = parseFloat($('#afpComisionFlujo').val() || 0);
                const primaSeguro = parseFloat($('#afpPrimaSeguro').val() || 0);
                const comisionAnualSaldo = parseFloat($('#afpComisionAnual').val() || 0);
                const remuneracionMaxima = parseFloat($('#afpRemuneracionMaxima').val() || 0);
                const aporteObligatorio = parseFloat($('#afpAporteObligatorio').val() || 0);

                // Validaciones
                if (!periodo || !regimenId) {
                    showNotification('Por favor complete todos los campos obligatorios', 'warning');
                    return;
                }

                // Validar que los valores sean números válidos
                if (isNaN(comisionFlujo) || isNaN(primaSeguro) || isNaN(comisionAnualSaldo) || 
                    isNaN(remuneracionMaxima) || isNaN(aporteObligatorio)) {
                    showNotification('Por favor ingrese valores numéricos válidos', 'warning');
                    return;
                }

                // Validar que no sean negativos
                if (comisionFlujo < 0 || primaSeguro < 0 || comisionAnualSaldo < 0 || 
                    remuneracionMaxima < 0 || aporteObligatorio < 0) {
                    showNotification('Los valores no pueden ser negativos', 'warning');
                    return;
                }

                // Validar rangos de porcentajes
                if (comisionFlujo > 100 || primaSeguro > 100 || aporteObligatorio > 100) {
                    showNotification('Los porcentajes no pueden ser mayores a 100%', 'warning');
                    return;
                }

                const empresaId = parseInt(localStorage.getItem('empresa_id')) || 1;
                
                const datos = {
                    periodo,
                    regimenId: parseInt(regimenId),
                    comisionFlujo: comisionFlujo.toFixed(2),
                    primaSeguro: primaSeguro.toFixed(2),
                    comisionAnualSaldo: comisionAnualSaldo.toFixed(2),
                    remuneracionMaxima: remuneracionMaxima.toFixed(2),
                    aporteObligatorio: aporteObligatorio.toFixed(2),
                    empresaId
                };

                console.log('📊 Datos a guardar:', datos);

                const url = id ? `/api/comisiones-afp/${id}` : '/api/comisiones-afp';
                const method = id ? 'PUT' : 'POST';

                // Deshabilitar botón mientras se guarda
                const btnGuardar = $('.btn-guardar-afp');
                btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...');

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
                        id ? 'Comisión AFP actualizada exitosamente' : 'Comisión AFP creada exitosamente',
                        'success'
                    );

                    // Cerrar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAFP'));
                    if (modal) {
                        modal.hide();
                    }

                    // Recargar tabla si existe
                    if (this.table) {
                        this.table.ajax.reload(null, false);
                    }
                    
                    console.log('✅ Datos guardados correctamente');
                } else {
                    showNotification('Error: ' + result.message, 'danger');
                }

            } catch (error) {
                console.error('Error al guardar:', error);
                showNotification('Error al guardar: ' + error.message, 'danger');
            } finally {
                // Rehabilitar botón
                const btnGuardar = $('.btn-guardar-afp');
                btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i>Guardar');
            }
        }
    };

})();
