// Módulo de Gestión de Usuarios con DataTables
// Sobrescribir el objeto completo para evitar problemas de redeclaración
window.usuarios = {
    table: null,
    
    // Inicializar el módulo
    init: async function() {
        console.log('✅ Módulo Usuarios inicializado');
        
        this.configurarEmpresaUsuario();
        
        // Cargar usuarios desde el backend
        await this.cargarUsuarios();
        
        this.inicializarDataTable();
        this.configurarEventos();
    },
    
    // Configurar empresa del usuario logueado
    configurarEmpresaUsuario: function() {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                // Guardar el ID de la empresa del usuario logueado
                this.empresaId = userData.empresaId || userData.empresa_id || 1;
                console.log('✅ Empresa del usuario:', this.empresaId);
            } catch (error) {
                console.error('Error al obtener empresa del usuario:', error);
                this.empresaId = 1; // Default
            }
        }
    },
    

    
    // Cargar usuarios desde el backend
    cargarUsuarios: async function() {
        try {
            // Usar el endpoint que filtra por empresa del usuario logueado
            const response = await fetch(`http://localhost:3000/api/usuarios/empresa/${this.empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.datosLocales = result.data.map(usuario => ({
                    id: usuario.id,
                    usuario: usuario.usuario,
                    nombre_completo: `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim(),
                    correo: usuario.correo,
                    empresa: usuario.empresaNombre || 'N/A',
                    estado: usuario.estado
                }));
                
                console.log(`✅ Usuarios de empresa ${this.empresaId} cargados:`, this.datosLocales.length);
                return true;
            } else {
                console.error('Error al cargar usuarios:', result.message);
                this.datosLocales = [];
                return false;
            }
        } catch (error) {
            console.error('❌ Error al cargar usuarios:', error);
            this.datosLocales = [];
            return false;
        }
    },

    // Inicializar DataTable con datos locales persistentes
    inicializarDataTable: function() {
        // Asegurarse de que la tabla existe en el DOM
        if (!$('#tablaUsuarios').length) {
            console.warn('⚠️ Tabla #tablaUsuarios no encontrada en el DOM');
            return;
        }
        
        // Destruir instancia anterior si existe
        if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
            $('#tablaUsuarios').DataTable().destroy();
            $('#tablaUsuarios').empty(); // Limpiar el contenido
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

    // Recargar usuarios desde el backend
    recargarUsuarios: async function() {
        console.log('🔄 Recargando usuarios...');
        
        await this.cargarUsuarios();
        
        // Destruir y recrear la tabla
        if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
            $('#tablaUsuarios').DataTable().destroy();
        }
        
        this.inicializarDataTable();
        
        console.log('✅ Usuarios recargados');
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        // Eventos específicos de la tabla si son necesarios
        console.log('✅ Eventos de tabla configurados');
    },

    // Abrir módulo de registro de usuario
    abrirRegistroUsuario: function() {
        console.log('📝 Abriendo módulo de registro de usuario...');
        
        // Cargar el módulo de registro-usuario
        if (typeof loadModuleContent === 'function') {
            loadModuleContent('registro-usuario', 'Registrar Usuario');
        } else {
            console.error('❌ Función loadModuleContent no encontrada');
            this.showNotification('Error al cargar el módulo de registro', 'danger');
        }
    },

    // Funciones de acciones de tabla
    editar: function(id) {
        console.log('✏️ Editando usuario ID:', id);
        
        // Cargar el módulo de registro-usuario en modo edición
        if (typeof loadModuleContent === 'function') {
            loadModuleContent('registro-usuario', 'Editar Usuario', id);
        } else {
            console.error('❌ Función loadModuleContent no encontrada');
            this.showNotification('Error al cargar el módulo de edición', 'danger');
        }
    },

    eliminar: async function(id) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Usuario eliminado correctamente', 'success');
                    
                    // Recargar usuarios
                    await this.recargarUsuarios();
                } else {
                    this.showNotification(result.message || 'Error al eliminar usuario', 'danger');
                }
            } catch (error) {
                console.error('❌ Error al eliminar usuario:', error);
                this.showNotification('Error al conectar con el servidor', 'danger');
            }
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

// Función de inicialización que se llama automáticamente
(function() {
    console.log('🔄 Script de usuarios cargado');
    
    // Esperar a que jQuery y el DOM estén listos
    function inicializarModulo() {
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
            console.log('⏳ Esperando jQuery y DataTables...');
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        if (!$('#tablaUsuarios').length) {
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        console.log('✅ Inicializando módulo de usuarios...');
        
        // Destruir DataTable anterior si existe
        if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
            $('#tablaUsuarios').DataTable().destroy();
            console.log('🗑️ DataTable anterior destruido');
        }
        
        // Inicializar el módulo
        window.usuarios.init();
    }
    
    // Iniciar el proceso
    inicializarModulo();
})();

