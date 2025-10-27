// Módulo de Gestión de Roles por Empresa
// Sobrescribir el objeto completo para evitar problemas de redeclaración
window.roles = {
    table: null,
    empresaId: null,
    modalRol: null,
    
    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Roles inicializado');
        
        this.obtenerEmpresaUsuario();
        this.inicializarDataTable();
        this.inicializarModal();
        this.cargarRoles();
    },
    
    // Obtener empresa del usuario logueado
    obtenerEmpresaUsuario: function() {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                this.empresaId = userData.empresaId || userData.empresa_id || 1;
                console.log('✅ Empresa del usuario:', this.empresaId);
            } catch (error) {
                console.error('Error al obtener empresa del usuario:', error);
                this.empresaId = 1;
            }
        }
    },
    
    // Inicializar DataTable
    inicializarDataTable: function() {
        // Asegurarse de que la tabla existe en el DOM
        if (!$('#tablaRoles').length) {
            console.warn('⚠️ Tabla #tablaRoles no encontrada en el DOM');
            return;
        }
        
        // Destruir instancia anterior si existe
        if ($.fn.DataTable.isDataTable('#tablaRoles')) {
            $('#tablaRoles').DataTable().destroy();
            $('#tablaRoles').empty(); // Limpiar el contenido
        }
        
        this.table = $('#tablaRoles').DataTable({
            data: [],
            bSort: false,
            sDom: 'rt<"row align-items-center mt-2"<"col-sm-auto"l><"col-sm-auto"i><"col text-right"p>>',
            iDisplayLength: 10,
            autoWidth: false,
            aoColumns: [
                { sClass: "text-center" },      // ID
                { sClass: "text-left" },        // Descripción
                { sClass: "text-center" },      // Estado
                { sClass: "text-center" }       // Acciones
            ],
            columns: [
                { data: 'id' },
                { 
                    data: 'descripcion',
                    render: function(data, type, row) {
                        return `<strong>${data}</strong>`;
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
                            <button class="btn btn-action btn-editar" onclick="roles.editarRol(${row.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-eliminar" onclick="roles.eliminarRol(${row.id})" title="Eliminar">
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
                const api = this.api();
                
                api.columns([1, 2]).every(function() {
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
                
                console.log('✅ DataTable de roles inicializada');
            }
        });
    },
    
    // Inicializar modal
    inicializarModal: function() {
        this.modalRol = new bootstrap.Modal(document.getElementById('modalRol'));
    },
    
    // Cargar roles desde el backend
    cargarRoles: async function() {
        try {
            const response = await fetch(`http://localhost:3000/api/roles/empresa/${this.empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.table.clear().rows.add(result.data).draw();
                console.log(`✅ ${result.data.length} roles cargados`);
            } else {
                console.error('Error al cargar roles:', result.message);
                this.showNotification('Error al cargar roles', 'danger');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.showNotification('Error de conexión con el servidor', 'danger');
        }
    },
    
    // Abrir modal para nuevo rol
    abrirModalNuevoRol: function() {
        document.getElementById('formRol').reset();
        document.getElementById('rolId').value = '';
        document.getElementById('tituloModalRol').textContent = 'Registrar Rol';
        this.modalRol.show();
    },
    
    // Guardar rol
    guardarRol: async function() {
        const form = document.getElementById('formRol');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const rolId = document.getElementById('rolId').value;
        const descripcion = document.getElementById('rolDescripcion').value.trim();
        
        if (!descripcion) {
            this.showNotification('La descripción del rol es obligatoria', 'warning');
            return;
        }
        
        const rol = {
            id: rolId ? parseInt(rolId) : null,
            descripcion: descripcion,
            empresaId: this.empresaId
        };
        
        try {
            const url = rolId 
                ? `http://localhost:3000/api/roles/${rolId}`
                : 'http://localhost:3000/api/roles';
            
            const method = rolId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rol)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                this.modalRol.hide();
                this.cargarRoles();
            } else {
                this.showNotification(result.message, 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al guardar el rol', 'danger');
        }
    },
    
    // Editar rol
    editarRol: async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/roles/${id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const rol = result.data;
                
                document.getElementById('rolId').value = rol.id;
                document.getElementById('rolDescripcion').value = rol.descripcion;
                document.getElementById('tituloModalRol').textContent = 'Editar Rol';
                
                this.modalRol.show();
            } else {
                this.showNotification('Error al cargar los datos del rol', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar el rol', 'danger');
        }
    },
    
    // Eliminar rol
    eliminarRol: async function(id) {
        if (!confirm('¿Está seguro de que desea eliminar este rol?')) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/api/roles/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                this.cargarRoles();
            } else {
                this.showNotification(result.message, 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al eliminar el rol', 'danger');
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
    console.log('🔄 Script de roles cargado');
    
    // Esperar a que jQuery y el DOM estén listos
    function inicializarModulo() {
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
            console.log('⏳ Esperando jQuery y DataTables...');
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        if (!$('#tablaRoles').length) {
            console.log('⏳ Esperando tabla en el DOM...');
            setTimeout(inicializarModulo, 100);
            return;
        }
        
        console.log('✅ Inicializando módulo de roles...');
        
        // Destruir DataTable anterior si existe
        if ($.fn.DataTable.isDataTable('#tablaRoles')) {
            $('#tablaRoles').DataTable().destroy();
            console.log('🗑️ DataTable anterior destruido');
        }
        
        // Inicializar el módulo
        window.roles.init();
    }
    
    // Iniciar el proceso
    inicializarModulo();
})();
