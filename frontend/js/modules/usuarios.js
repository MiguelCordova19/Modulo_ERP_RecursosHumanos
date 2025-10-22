// Módulo de Gestión de Usuarios con DataTables
const usuarios = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Usuarios inicializado');
        
        // Cargar datos desde localStorage o usar datos por defecto
        this.cargarDatosLocales();
        
        this.inicializarDataTable();
        this.configurarEventos();
        this.inicializarModal();
    },
    
    // Cargar datos desde localStorage
    cargarDatosLocales: function() {
        const datosGuardados = localStorage.getItem('usuarios_data');
        
        if (datosGuardados) {
            this.datosLocales = JSON.parse(datosGuardados);
            console.log('✅ Datos cargados desde localStorage:', this.datosLocales.length, 'usuarios');
        } else {
            // Datos por defecto
            this.datosLocales = [
                {
                    id: 1,
                    usuario: 'admin',
                    nombre_completo: 'Usuario Administrador Sistema',
                    correo: 'admin@empresa.com',
                    empresa: 'EMPRESA TEST',
                    estado: 1
                },
                {
                    id: 2,
                    usuario: 'juan.perez',
                    nombre_completo: 'Juan Carlos Pérez García',
                    correo: 'juan.perez@empresa.com',
                    empresa: 'EMPRESA TEST',
                    estado: 1
                },
                {
                    id: 3,
                    usuario: 'maria.lopez',
                    nombre_completo: 'María Elena López Rodríguez',
                    correo: 'maria.lopez@empresa.com',
                    empresa: 'EMPRESA TEST',
                    estado: 0
                }
            ];
            this.guardarDatosLocales();
        }
    },
    
    // Guardar datos en localStorage
    guardarDatosLocales: function() {
        localStorage.setItem('usuarios_data', JSON.stringify(this.datosLocales));
        console.log('💾 Datos guardados en localStorage');
    },

    // Inicializar DataTable con datos locales persistentes
    inicializarDataTable: function() {
        // Verificar si la tabla ya existe
        if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
            console.log('✅ Tabla ya inicializada, recargando datos');
            this.table = $('#tablaUsuarios').DataTable();
            this.table.clear().rows.add(this.datosLocales).draw();
            return;
        }
        
        // Crear la tabla con datos locales
        this.table = $('#tablaUsuarios').DataTable({
            data: this.datosLocales,
            bSort: false,
            sDom: 'rt<"row align-items-center mt-2"<"col-sm-auto"l><"col-sm-auto"i><"col text-right"p>>',
            iDisplayLength: 10,
            autoWidth: false,
            aoColumns: [
                { sClass: "text-center" },      // ID
                { sClass: "text-center" },      // Usuario
                { sClass: "text-left" },        // Nombre Completo
                { sClass: "text-left" },        // Correo
                { sClass: "text-center" },      // Empresa
                { sClass: "text-center" },      // Estado
                { sClass: "text-center" }       // Acciones
            ],
            columns: [
                { 
                    data: 'id'
                },
                { 
                    data: 'usuario',
                    render: function(data, type, row) {
                        return `<strong>${data}</strong>`;
                    }
                },
                { 
                    data: 'nombre_completo',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 250px;" title="${data}">${data}</div>`;
                    }
                },
                { 
                    data: 'correo',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 200px;" title="${data}">${data}</div>`;
                    }
                },
                { 
                    data: 'empresa',
                    render: function(data, type, row) {
                        return `<div class="text-truncate" style="max-width: 140px;" title="${data}">${data}</div>`;
                    }
                },
                { 
                    data: 'estado',
                    render: function(data, type, row) {
                        const badge = data === 1 
                            ? '<span class="badge bg-success badge-estado">Activo</span>'
                            : '<span class="badge bg-danger badge-estado">Inactivo</span>';
                        return badge;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar" onclick="usuarios.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="usuarios.eliminar(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar usuarios...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros'
            },
            initComplete: function() {
                // Agregar filtros en el tfoot
                const api = this.api();
                
                // Aplicar filtros a las columnas específicas
                api.columns([1, 2, 3, 4, 5]).every(function() {
                    const column = this;
                    const input = $('tfoot th').eq(column.index()).find('input');
                    
                    if (input.length > 0) {
                        input.on('keyup change clear', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                    }
                });
                
                console.log('✅ DataTable de usuarios inicializada con datos persistentes');
            }
        });
    },

    // Agregar nuevo usuario a los datos locales
    agregarUsuarioLocal: function(nuevoUsuario) {
        // Generar nuevo ID
        const maxId = Math.max(...this.datosLocales.map(u => u.id), 0);
        nuevoUsuario.id = maxId + 1;
        
        // Agregar a datos locales
        this.datosLocales.push(nuevoUsuario);
        
        // Guardar en localStorage
        this.guardarDatosLocales();
        
        // Actualizar tabla
        this.table.row.add(nuevoUsuario).draw();
        
        console.log('✅ Usuario agregado localmente:', nuevoUsuario);
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        // Evento del formulario de nuevo usuario
        $('#form-nuevo-usuario').on('submit', function(e) {
            e.preventDefault();
            usuarios.procesarFormularioUsuario();
        });
        
        // Validación en tiempo real del formulario de credenciales
        $('#password, #confirm-password').on('input', function() {
            usuarios.validarConfirmacionPassword();
        });
    },

    // Inicializar modal
    inicializarModal: function() {
        this.modalCredenciales = new bootstrap.Modal(document.getElementById('modalCredenciales'));
    },

    // Función para abrir el formulario de nuevo usuario
    abrirFormularioNuevoUsuario: function() {
        console.log('📝 Abriendo formulario de nuevo usuario...');
        
        // Ocultar lista de usuarios
        $('#lista-usuarios').hide();
        
        // Mostrar formulario
        $('#formulario-usuario').show();
        
        // Limpiar formulario
        document.getElementById('form-nuevo-usuario').reset();
        
        // Scroll al formulario
        document.getElementById('formulario-usuario').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        this.showNotification('Formulario de nuevo usuario abierto', 'info');
    },

    // Función para cancelar el formulario
    cancelarFormulario: function() {
        console.log('❌ Cancelando formulario...');
        
        if (confirm('¿Está seguro de que desea cancelar? Se perderán los datos ingresados.')) {
            // Ocultar formulario
            $('#formulario-usuario').hide();
            
            // Mostrar lista de usuarios
            $('#lista-usuarios').show();
            
            // Limpiar formulario
            document.getElementById('form-nuevo-usuario').reset();
            
            this.showNotification('Formulario cancelado', 'warning');
        }
    },

    // Procesar el formulario de usuario (paso 1)
    procesarFormularioUsuario: function() {
        console.log('📋 Procesando formulario de usuario...');
        
        // Validar campos requeridos
        const form = document.getElementById('form-nuevo-usuario');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Recopilar datos del formulario
        const datosUsuario = {
            empresa: $('#empresa').val(),
            sede: $('#sede').val(),
            tipoDoc: $('#tipo-doc').val(),
            nroDoc: $('#nro-doc').val(),
            fechaNacimiento: $('#fecha-nacimiento').val(),
            nombres: $('#nombres').val(),
            apellidos: $('#apellidos').val(),
            rol: $('#rol').val(),
            puesto: $('#puesto').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val(),
            estado: $('#estado').val()
        };
        
        console.log('📊 Datos del usuario:', datosUsuario);
        
        // Validaciones adicionales
        if (!this.validarEmail(datosUsuario.email)) {
            this.showNotification('Por favor ingrese un email válido', 'danger');
            return;
        }
        
        if (!this.validarDocumento(datosUsuario.nroDoc, datosUsuario.tipoDoc)) {
            this.showNotification('Número de documento inválido', 'danger');
            return;
        }
        
        // Guardar datos temporalmente
        this.tempUserData = datosUsuario;
        
        // Abrir modal de credenciales
        this.abrirModalCredenciales();
    },

    // Abrir modal de credenciales
    abrirModalCredenciales: function() {
        console.log('🔑 Abriendo modal de credenciales...');
        
        // Limpiar campos del modal
        $('#username').val('');
        $('#password').val('');
        $('#confirm-password').val('');
        
        // Sugerir un nombre de usuario basado en los datos
        const nombres = $('#nombres').val();
        const apellidos = $('#apellidos').val();
        
        if (nombres && apellidos) {
            const sugerencia = this.generarSugerenciaUsername(nombres, apellidos);
            $('#username').val(sugerencia);
        }
        
        // Mostrar modal
        this.modalCredenciales.show();
        
        this.showNotification('Complete las credenciales de acceso', 'info');
    },

    // Generar sugerencia de nombre de usuario
    generarSugerenciaUsername: function(nombres, apellidos) {
        const primerNombre = nombres.split(' ')[0].toLowerCase();
        const primerApellido = apellidos.split(' ')[0].toLowerCase();
        
        // Remover acentos y caracteres especiales
        const username = (primerNombre + '.' + primerApellido)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z.]/g, '');
        
        return username;
    },

    // Toggle para mostrar/ocultar contraseña
    togglePassword: function() {
        const passwordField = $('#password')[0];
        const toggleIcon = $('#togglePasswordIcon');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            toggleIcon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    },

    // Validar confirmación de contraseña
    validarConfirmacionPassword: function() {
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();
        const confirmField = $('#confirm-password')[0];
        
        if (confirmPassword && password !== confirmPassword) {
            confirmField.setCustomValidity('Las contraseñas no coinciden');
            $(confirmField).addClass('is-invalid').removeClass('is-valid');
        } else {
            confirmField.setCustomValidity('');
            $(confirmField).removeClass('is-invalid');
            if (confirmPassword) {
                $(confirmField).addClass('is-valid');
            }
        }
    },

    // Guardar usuario completo
    guardarUsuario: function() {
        console.log('💾 Guardando usuario...');
        
        // Validar credenciales
        const username = $('#username').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();
        
        if (!username || !password || !confirmPassword) {
            this.showNotification('Todos los campos de credenciales son obligatorios', 'danger');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'danger');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }
        
        // Combinar datos del usuario con credenciales
        const datosCompletos = {
            usuario: username,
            nombre_completo: `${this.tempUserData.nombres} ${this.tempUserData.apellidos}`,
            correo: this.tempUserData.email,
            empresa: 'EMPRESA TEST',
            estado: parseInt(this.tempUserData.estado),
            ...this.tempUserData,
            password: password
        };
        
        console.log('📤 Guardando datos completos:', { ...datosCompletos, password: '***' });
        
        // Simular guardado y agregar a datos locales
        this.simularGuardadoUsuario(datosCompletos);
    },

    // Simular guardado de usuario (temporal)
    simularGuardadoUsuario: function(datos) {
        const saveButton = $('#modalCredenciales .btn-success');
        const originalText = saveButton.html();
        
        // Mostrar loading
        saveButton.html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...').prop('disabled', true);
        
        // Simular delay de API
        setTimeout(() => {
            // Agregar usuario a datos locales
            this.agregarUsuarioLocal(datos);
            
            // Restaurar botón
            saveButton.html(originalText).prop('disabled', false);
            
            // Cerrar modal
            this.modalCredenciales.hide();
            
            // Volver a la lista
            this.cancelarFormulario();
            
            // Mostrar éxito
            this.showNotification(`Usuario "${datos.usuario}" creado exitosamente`, 'success');
            
            // Limpiar datos temporales
            delete this.tempUserData;
            
        }, 2000);
    },

    // Funciones de validación
    validarEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    validarDocumento: function(nroDoc, tipoDoc) {
        if (!nroDoc || !tipoDoc) return false;
        
        switch (tipoDoc) {
            case '1': // DNI
                return /^\d{8}$/.test(nroDoc);
            case '2': // Pasaporte
                return /^[A-Z0-9]{6,12}$/.test(nroDoc.toUpperCase());
            case '3': // Carnet de Extranjería
                return /^\d{9,12}$/.test(nroDoc);
            default:
                return false;
        }
    },

    // Funciones de acciones de tabla
    editar: function(id) {
        this.showNotification(`Editar usuario ID: ${id} (función en desarrollo)`, 'info');
    },

    eliminar: function(id) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            // Eliminar de datos locales
            this.datosLocales = this.datosLocales.filter(u => u.id !== id);
            
            // Guardar en localStorage
            this.guardarDatosLocales();
            
            // Actualizar tabla
            this.table.clear().rows.add(this.datosLocales).draw();
            
            this.showNotification(`Usuario eliminado correctamente`, 'success');
        }
    },

    // Función de notificaciones
    showNotification: function(message, type = 'info') {
        const notification = $(`
            <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
};

// Inicializar cuando el DOM esté listo
$(document).ready(function() {
    // Solo inicializar si no está ya inicializado
    if (!window.usuariosModuloInicializado) {
        usuarios.init();
        window.usuariosModuloInicializado = true;
    } else {
        // Si ya está inicializado, solo recargar los datos
        console.log('✅ Módulo ya inicializado, recargando datos');
        usuarios.cargarDatosLocales();
        if (usuarios.table) {
            usuarios.table.clear().rows.add(usuarios.datosLocales).draw();
        }
    }
});

// Exportar funciones globales para uso en HTML
window.abrirFormularioNuevoUsuario = () => usuarios.abrirFormularioNuevoUsuario();
window.cancelarFormulario = () => usuarios.cancelarFormulario();
window.togglePassword = () => usuarios.togglePassword();
window.guardarUsuario = () => usuarios.guardarUsuario();