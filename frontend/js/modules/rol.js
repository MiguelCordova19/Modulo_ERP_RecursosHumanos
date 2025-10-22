// Módulo de Gestión de Roles con DataTables
const roles = {
    table: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Roles inicializado');
        
        // Cargar datos desde localStorage o usar datos por defecto
        this.cargarDatosLocales();
        
        this.inicializarDataTable();
        this.configurarEventos();
    },
    
    // Cargar datos desde localStorage
    cargarDatosLocales: function() {
        const datosGuardados = localStorage.getItem('roles_data');
        
        if (datosGuardados) {
            this.datosLocales = JSON.parse(datosGuardados);
            console.log('✅ Datos cargados desde localStorage:', this.datosLocales.length, 'roles');
        } else {
            // Datos por defecto
            this.datosLocales = [
                {
                    id: 1,
                    rol: 'Administrador',
                    descripcion: 'Acceso completo al sistema'
                },
                {
                    id: 2,
                    rol: 'Usuario',
                    descripcion: 'Acceso limitado a funciones básicas'
                },
                {
                    id: 3,
                    rol: 'Supervisor',
                    descripcion: 'Acceso a supervisión y reportes'
                }
            ];
            this.guardarDatosLocales();
        }
    },
    
    // Guardar datos en localStorage
    guardarDatosLocales: function() {
        localStorage.setItem('roles_data', JSON.stringify(this.datosLocales));
        console.log('💾 Datos guardados en localStorage');
    },

    // Inicializar DataTable con datos locales persistentes
    inicializarDataTable: function() {
        // Verificar si la tabla ya existe
        if ($.fn.DataTable.isDataTable('#tabla-usuarios')) {
            console.log('✅ Tabla ya inicializada, recargando datos');
            this.table = $('#tabla-usuarios').DataTable();
            this.table.clear().rows.add(this.datosLocales).draw();
            return;
        }
        
        // Crear la tabla con datos locales
        this.table = $('#tabla-usuarios').DataTable({
            data: this.datosLocales,
            bSort: false,
            sDom: 'rt<"row align-items-center mt-2"<"col-sm-auto"l><"col-sm-auto"i><"col text-right"p>>',
            iDisplayLength: 10,
            autoWidth: false,
            aoColumns: [
                { sClass: "text-center" },      // COD
                { sClass: "text-left" },        // ROL
                { sClass: "text-center" }       // Acciones
            ],
            columns: [
                { 
                    data: 'id'
                },
                { 
                    data: 'rol'
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-action btn-editar" onclick="roles.editar(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="roles.eliminar(${row.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
                searchPlaceholder: 'Buscar roles...',
                search: '_INPUT_',
                lengthMenu: 'Mostrar _MENU_ registros'
            },
            initComplete: function() {
                // Agregar filtros en el tfoot
                const api = this.api();
                
                // Aplicar filtro a la columna de rol
                api.columns([1]).every(function() {
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
                
                console.log('✅ DataTable de roles inicializada con datos persistentes');
            }
        });
    },

    // Configurar eventos del módulo
    configurarEventos: function() {
        // Aquí se pueden agregar eventos específicos del módulo
        console.log('✅ Eventos de roles configurados');
    },

    // Funciones de acciones de tabla
    editar: function(id) {
        this.showNotification(`Editar rol ID: ${id} (función en desarrollo)`, 'info');
    },

    eliminar: function(id) {
        if (confirm('¿Está seguro de que desea eliminar este rol?')) {
            // Eliminar de datos locales
            this.datosLocales = this.datosLocales.filter(r => r.id !== id);
            
            // Guardar en localStorage
            this.guardarDatosLocales();
            
            // Actualizar tabla
            this.table.clear().rows.add(this.datosLocales).draw();
            
            this.showNotification(`Rol eliminado correctamente`, 'success');
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
    if (!window.rolesModuloInicializado) {
        roles.init();
        window.rolesModuloInicializado = true;
    } else {
        // Si ya está inicializado, solo recargar los datos
        console.log('✅ Módulo ya inicializado, recargando datos');
        roles.cargarDatosLocales();
        if (roles.table) {
            roles.table.clear().rows.add(roles.datosLocales).draw();
        }
    }
});

// Exportar funciones globales
window.roles = roles;