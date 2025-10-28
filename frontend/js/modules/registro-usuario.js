// Módulo de Registro de Usuario
window.registroUsuario = {
    empresaId: null,
    empresaNombre: null,
    tempUserData: null,
    modalCredenciales: null,
    modoEdicion: false,
    usuarioIdEditar: null,
    
    // Inicializar el módulo
    init: function(usuarioId = null) {
        console.log('✅ Módulo Registro Usuario inicializado');
        
        // Detectar modo edición
        if (usuarioId) {
            this.modoEdicion = true;
            this.usuarioIdEditar = usuarioId;
            console.log('📝 Modo EDICIÓN - Usuario ID:', usuarioId);
        } else {
            this.modoEdicion = false;
            this.usuarioIdEditar = null;
            console.log('➕ Modo CREACIÓN');
        }
        
        this.configurarEmpresaUsuario();
        this.cargarTiposDocumento();
        this.cargarRoles();
        this.configurarValidaciones();
        this.inicializarModal();
        this.configurarModoFormulario();
        
        // Si es modo edición, cargar datos del usuario
        if (this.modoEdicion) {
            this.cargarDatosUsuario(usuarioId);
        }
    },
    
    // Inicializar modal
    inicializarModal: function() {
        const modalElement = document.getElementById('modalCredenciales');
        if (modalElement) {
            this.modalCredenciales = new bootstrap.Modal(modalElement);
        }
    },
    
    // Configurar modo del formulario (crear/editar)
    configurarModoFormulario: function() {
        const titulo = $('#tituloModulo');
        const btnGuardar = $('#btnGuardar');
        
        if (this.modoEdicion) {
            // Modo edición
            titulo.html('<i class="fas fa-user-edit me-2" style="color: #FF7E70;"></i>Editar Usuario');
            btnGuardar.html('<i class="fas fa-save me-1"></i>Actualizar');
        } else {
            // Modo creación
            titulo.html('<i class="fas fa-user-plus me-2" style="color: #FF7E70;"></i>Registrar Usuario');
            btnGuardar.html('<i class="fas fa-arrow-right me-1"></i>Siguiente');
        }
    },
    
    // Cargar datos del usuario para edición
    cargarDatosUsuario: async function(usuarioId) {
        console.log('📥 Cargando datos del usuario:', usuarioId);
        
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const usuario = result.data;
                console.log('✅ Datos del usuario cargados:', usuario);
                
                // Llenar el formulario
                $('#usuarioId').val(usuario.id);
                $('#fechaNacimiento').val(usuario.fechaNacimiento);
                $('#tipoDoc').val(usuario.tipoDocumentoId);
                $('#nroDoc').val(usuario.nroDocumento);
                $('#nombres').val(usuario.nombres);
                
                // Combinar apellidos
                const apellidoCompleto = `${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim();
                $('#apellidos').val(apellidoCompleto);
                
                $('#rol').val(usuario.rolId);
                $('#telefono').val(usuario.nroCelular);
                $('#email').val(usuario.correo);
                
                // Validar campos cargados
                this.validarDocumento();
                this.validarEmail();
                this.validarTelefono();
                
                console.log('✅ Formulario cargado con datos del usuario');
            } else {
                this.showNotification('Error al cargar datos del usuario', 'danger');
                this.volverALista();
            }
        } catch (error) {
            console.error('❌ Error al cargar usuario:', error);
            this.showNotification('Error al conectar con el servidor', 'danger');
            this.volverALista();
        }
    },
    
    // Configurar empresa del usuario logueado
    configurarEmpresaUsuario: function() {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                this.empresaId = userData.empresaId || userData.empresa_id || 1;
                this.empresaNombre = userData.empresaNombre || userData.empresa_nombre || userData.empresa || 'EMPRESA TEST';
                
                // Mostrar nombre de empresa en ambos campos
                $('#empresa').val(this.empresaId);
                $('#empresaNombre').val(this.empresaNombre);
                
                console.log('✅ Empresa del usuario:', this.empresaId, '-', this.empresaNombre);
            } catch (error) {
                console.error('Error al obtener empresa del usuario:', error);
                this.empresaId = 1;
                this.empresaNombre = 'EMPRESA TEST';
                $('#empresa').val(this.empresaId);
                $('#empresaNombre').val(this.empresaNombre);
            }
        }
    },
    
    // Cargar tipos de documento desde el backend
    cargarTiposDocumento: async function() {
        try {
            const response = await fetch('http://localhost:3000/api/tipos-documento');
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#tipoDoc');
                select.html('<option value="" selected disabled>--SELECCIONE--</option>');
                
                result.data.forEach(tipo => {
                    // Solo mostrar la descripción, sin abreviatura
                    select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
                });
                
                console.log('✅ Tipos de documento cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar tipos de documento:', error);
            this.showNotification('Error al cargar tipos de documento', 'danger');
        }
    },
    
    // Cargar roles de la empresa del usuario logueado
    cargarRoles: async function() {
        try {
            const response = await fetch(`http://localhost:3000/api/roles/empresa/${this.empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const select = $('#rol');
                select.html('<option value="" selected disabled>--SELECCIONE--</option>');
                
                result.data.forEach(rol => {
                    select.append(`<option value="${rol.id}">${rol.descripcion}</option>`);
                });
                
                console.log('✅ Roles cargados:', result.data.length);
            }
        } catch (error) {
            console.error('Error al cargar roles:', error);
            this.showNotification('Error al cargar roles', 'danger');
        }
    },
    
    // Configurar validaciones en tiempo real
    configurarValidaciones: function() {
        // Validación de documento según tipo
        $('#tipoDoc').on('change', () => this.validarDocumento());
        $('#nroDoc').on('input', () => this.validarDocumento());
        
        // Validación de email
        $('#email').on('input', () => this.validarEmail());
        
        // Validación de teléfono
        $('#telefono').on('input', () => this.validarTelefono());
        
        // Validación de confirmación de contraseña
        $('#password, #confirmPassword').on('input', () => this.validarConfirmacionPassword());
    },
    
    // Validar documento según tipo
    validarDocumento: function() {
        const tipoDocId = $('#tipoDoc').val();
        const nroDoc = $('#nroDoc').val();
        const nroDocInput = $('#nroDoc')[0];
        
        if (!tipoDocId || !nroDoc) return;
        
        let esValido = false;
        
        // Obtener el texto de la opción seleccionada para determinar el tipo
        const tipoDocTexto = $('#tipoDoc option:selected').text();
        
        if (tipoDocTexto.includes('DNI')) {
            esValido = /^\d{8}$/.test(nroDoc);
            $('#nroDoc').attr('placeholder', 'Ingrese 8 dígitos');
        } else if (tipoDocTexto.includes('Pasaporte')) {
            esValido = /^[A-Z0-9]{6,12}$/.test(nroDoc.toUpperCase());
            $('#nroDoc').attr('placeholder', 'Ingrese 6-12 caracteres');
        } else if (tipoDocTexto.includes('Extranjería')) {
            esValido = /^\d{9,12}$/.test(nroDoc);
            $('#nroDoc').attr('placeholder', 'Ingrese 9-12 dígitos');
        } else if (tipoDocTexto.includes('RUC')) {
            esValido = /^\d{11}$/.test(nroDoc);
            $('#nroDoc').attr('placeholder', 'Ingrese 11 dígitos');
        }
        
        if (esValido) {
            $(nroDocInput).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(nroDocInput).removeClass('is-valid').addClass('is-invalid');
        }
    },
    
    // Validar email
    validarEmail: function() {
        const emailInput = $('#email')[0];
        const email = $('#email').val();
        
        if (!email) return;
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (regex.test(email)) {
            $(emailInput).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(emailInput).removeClass('is-valid').addClass('is-invalid');
        }
    },
    
    // Validar teléfono
    validarTelefono: function() {
        const telefonoInput = $('#telefono')[0];
        const telefono = $('#telefono').val();
        
        if (!telefono) return;
        
        const regex = /^[0-9+\-\s()]{9,15}$/;
        
        if (regex.test(telefono)) {
            $(telefonoInput).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(telefonoInput).removeClass('is-valid').addClass('is-invalid');
        }
    },
    
    // Validar confirmación de contraseña
    validarConfirmacionPassword: function() {
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        const confirmField = $('#confirmPassword')[0];
        
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
    
    // Validar formulario de datos personales
    validarFormularioDatos: function() {
        const form = $('#formUsuario')[0];
        const inputs = $(form).find('input[required], select[required]');
        let esValido = true;
        
        inputs.each(function() {
            if (!$(this).val() || !$(this).val().trim()) {
                $(this).addClass('is-invalid');
                esValido = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!esValido) {
            this.showNotification('Por favor complete todos los campos requeridos', 'danger');
        }
        
        return esValido;
    },
    
    // Validar formulario de credenciales
    validarFormularioCredenciales: function() {
        const username = $('#username').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        
        if (!username || !password || !confirmPassword) {
            this.showNotification('Todos los campos de credenciales son obligatorios', 'danger');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'danger');
            return false;
        }
        
        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'danger');
            return false;
        }
        
        return true;
    },
    
    // Guardar usuario (paso 1: validar datos y abrir modal o guardar directo)
    guardarUsuario: function() {
        console.log('📋 Validando datos del usuario...');
        
        // Validar formulario de datos personales
        if (!this.validarFormularioDatos()) {
            return;
        }
        
        // Separar apellidos en paterno y materno
        const apellidos = $('#apellidos').val().trim().split(' ');
        const apellidoPaterno = apellidos[0] || '';
        const apellidoMaterno = apellidos.slice(1).join(' ') || '';
        
        // Guardar datos temporalmente
        this.tempUserData = {
            nombres: $('#nombres').val().trim(),
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            empresaId: parseInt(this.empresaId),
            sedeId: null,
            tipoDocumentoId: parseInt($('#tipoDoc').val()),
            nroDocumento: $('#nroDoc').val().trim(),
            fechaNacimiento: $('#fechaNacimiento').val(),
            rolId: parseInt($('#rol').val()),
            puestoId: null,
            nroCelular: $('#telefono').val().trim(),
            correo: $('#email').val().trim(),
            estado: 1
        };
        
        console.log('📊 Datos temporales guardados');
        
        // Si es modo edición, guardar directamente sin pedir credenciales
        if (this.modoEdicion) {
            this.tempUserData.id = this.usuarioIdEditar;
            this.actualizarUsuario();
        } else {
            // Modo creación: abrir modal de credenciales
            this.abrirModalCredenciales();
        }
    },
    
    // Abrir modal de credenciales
    abrirModalCredenciales: function() {
        console.log('🔑 Abriendo modal de credenciales...');
        
        // Limpiar campos del modal
        $('#username').val('');
        $('#password').val('');
        $('#confirmPassword').val('');
        
        // Sugerir nombre de usuario
        const nombres = this.tempUserData.nombres;
        const apellidoPaterno = this.tempUserData.apellidoPaterno;
        
        if (nombres && apellidoPaterno) {
            const primerNombre = nombres.split(' ')[0].toLowerCase();
            const primerApellido = apellidoPaterno.toLowerCase();
            
            // Remover acentos y caracteres especiales
            const username = (primerNombre + '.' + primerApellido)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z.]/g, '');
            
            $('#username').val(username);
        }
        
        // Mostrar modal
        if (this.modalCredenciales) {
            this.modalCredenciales.show();
        }
    },
    
    // Guardar usuario final (paso 2: con credenciales) - Solo para modo creación
    guardarUsuarioFinal: async function() {
        console.log('💾 Guardando usuario con credenciales...');
        
        // Validar credenciales
        if (!this.validarFormularioCredenciales()) {
            return;
        }
        
        // Combinar datos temporales con credenciales
        const datosCompletos = {
            ...this.tempUserData,
            usuario: $('#username').val().trim(),
            password: $('#password').val(),
            primerLogin: 1
        };
        
        console.log('📤 Enviando datos al backend:', { ...datosCompletos, password: '***' });
        
        // Deshabilitar botón de guardar
        const btnGuardar = $('.modal-footer .btn-success');
        const textoOriginal = btnGuardar.html();
        btnGuardar.html('<i class="fas fa-spinner fa-spin me-1"></i>Guardando...').prop('disabled', true);
        
        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCompletos)
            });
            
            const result = await response.json();
            
            console.log('✅ Respuesta del backend:', result);
            
            if (result.success) {
                if (this.modalCredenciales) {
                    this.modalCredenciales.hide();
                }
                
                this.showNotification(`Usuario "${result.data.usuario}" creado exitosamente`, 'success');
                
                setTimeout(() => {
                    this.tempUserData = null;
                    this.volverALista();
                }, 1500);
            } else {
                this.showNotification(result.message || 'Error al crear usuario', 'danger');
            }
        } catch (error) {
            console.error('❌ Error al guardar usuario:', error);
            this.showNotification('Error al conectar con el servidor', 'danger');
        } finally {
            btnGuardar.html(textoOriginal).prop('disabled', false);
        }
    },
    
    // Actualizar usuario (modo edición)
    actualizarUsuario: async function() {
        console.log('💾 Actualizando usuario...');
        
        const datosActualizacion = {
            ...this.tempUserData,
            id: this.usuarioIdEditar
        };
        
        console.log('📤 Enviando actualización al backend:', datosActualizacion);
        
        // Deshabilitar botón de guardar
        const btnGuardar = $('#btnGuardar');
        const textoOriginal = btnGuardar.html();
        btnGuardar.html('<i class="fas fa-spinner fa-spin me-1"></i>Actualizando...').prop('disabled', true);
        
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${this.usuarioIdEditar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizacion)
            });
            
            const result = await response.json();
            
            console.log('✅ Respuesta del backend:', result);
            
            if (result.success) {
                this.showNotification('Usuario actualizado exitosamente', 'success');
                
                setTimeout(() => {
                    this.tempUserData = null;
                    this.volverALista();
                }, 1500);
            } else {
                this.showNotification(result.message || 'Error al actualizar usuario', 'danger');
            }
        } catch (error) {
            console.error('❌ Error al actualizar usuario:', error);
            this.showNotification('Error al conectar con el servidor', 'danger');
        } finally {
            btnGuardar.html(textoOriginal).prop('disabled', false);
        }
    },
    
    // Limpiar formulario
    limpiarFormulario: function() {
        const form = $('#formUsuario')[0];
        form.reset();
        
        // Limpiar clases de validación
        $(form).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        
        // Restaurar empresa
        $('#empresa').val(this.empresaNombre);
        
        console.log('🧹 Formulario limpiado');
    },
    
    // Cancelar formulario
    cancelarFormulario: function() {
        if (confirm('¿Está seguro de que desea cancelar? Se perderán los datos ingresados.')) {
            this.volverALista();
        }
    },
    
    // Volver a la lista de usuarios
    volverALista: function() {
        console.log('🔙 Volviendo a la lista de usuarios...');
        
        // Cargar el módulo de usuarios
        if (typeof loadModuleContent === 'function') {
            loadModuleContent('usuarios', 'Gestión de Usuarios');
        } else {
            console.error('❌ Función loadModuleContent no encontrada');
        }
    },
    
    // Mostrar notificación
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

// Función de inicialización que se llama automáticamente
(function() {
    console.log('🔄 Script de registro-usuario cargado');
    
    // Esperar a que jQuery esté listo
    function inicializarModulo() {
        if (typeof $ === 'undefined') {
            console.log('⏳ Esperando jQuery...');
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        if (!$('#formUsuario').length) {
            console.log('⏳ Esperando formulario en el DOM...');
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        console.log('✅ Inicializando módulo de registro de usuario...');
        
        // Obtener el ID del usuario si viene como parámetro (modo edición)
        const usuarioId = window.MODULE_PARAM || null;
        
        window.registroUsuario.init(usuarioId);
    }
    
    // Iniciar el proceso
    inicializarModulo();
})();
