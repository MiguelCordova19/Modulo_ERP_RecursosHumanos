// Dashboard Empresas - JavaScript
let empresaActual = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    verificarSesionEmpresa();
    cargarDatosEmpresa();
    cargarModulo('inicio');
});

// Verificar sesión de empresa
function verificarSesionEmpresa() {
    const empresaData = localStorage.getItem('empresaActual');

    if (!empresaData) {
        window.location.href = '/empresas/login-empresa.html';
        return;
    }

    empresaActual = JSON.parse(empresaData);
}

// Cargar datos de la empresa en el header y sidebar
function cargarDatosEmpresa() {
    if (!empresaActual) return;

    document.getElementById('nombreEmpresaHeader').textContent = empresaActual.nombre;
    document.getElementById('nombreEmpresaSidebar').textContent = empresaActual.nombre;
    document.getElementById('rucEmpresa').textContent = `RUC: ${empresaActual.ruc}`;
}

// Cerrar sesión
function cerrarSesionEmpresa() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        localStorage.removeItem('empresaActual');
        window.location.href = '/empresas/login-empresa.html';
    }
}

// Cargar módulos dinámicamente
function cargarModulo(modulo) {
    const contenido = document.getElementById('contenidoModulo');
    const titulo = document.getElementById('tituloModulo');

    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event?.target.closest('.nav-link')?.classList.add('active');

    switch (modulo) {
        case 'inicio':
            titulo.textContent = 'Dashboard';
            contenido.innerHTML = generarVistaInicio();
            break;
        case 'empresas':
            titulo.textContent = 'Gestión de Empresas';
            contenido.innerHTML = generarVistaEmpresas();
            inicializarTablaEmpresas();
            break;
        case 'usuarios':
            titulo.textContent = 'Usuarios por Empresa';
            contenido.innerHTML = generarVistaUsuarios();
            inicializarTablaUsuarios();
            break;
        case 'roles':
            titulo.textContent = 'Roles del Sistema';
            contenido.innerHTML = generarVistaRoles();
            inicializarTablaRoles();
            break;
        case 'reportes':
            titulo.textContent = 'Reportes';
            contenido.innerHTML = generarVistaReportes();
            break;
    }
}

// Vista de inicio con estadísticas
function generarVistaInicio() {
    return `
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stat-card primary">
                    <div class="stat-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>12</h3>
                    <p>Empresas Activas</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card success">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>248</h3>
                    <p>Usuarios Totales</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3>85%</h3>
                    <p>Tasa de Actividad</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card info">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>24/7</h3>
                    <p>Disponibilidad</p>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="table-container">
                    <h5 class="mb-3">Actividad Reciente</h5>
                    <p class="text-muted">Últimas acciones realizadas en el sistema</p>
                </div>
            </div>
        </div>
    `;
}

// Vista de gestión de empresas
function generarVistaEmpresas() {
    return `
        <div class="mb-3">
            <button class="btn btn-primary-gradient" onclick="abrirModalNuevaEmpresa()">
                <i class="fas fa-plus me-2"></i>Nueva Empresa
            </button>
        </div>
        
        <div class="table-container">
            <table class="table table-hover" id="tablaEmpresas">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>Nombre</th>
                        <th style="width: 120px;">RUC</th>
                        <th style="width: 130px;">Teléfono</th>
                        <th style="width: 250px;">Dirección</th>
                        <th class="text-center" style="width: 100px;">Estado</th>
                        <th class="text-center" style="width: 120px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Datos dinámicos -->
                </tbody>
            </table>
        </div>
        
        <!-- Modal Nueva/Editar Empresa -->
        <div class="modal fade" id="modalNuevaEmpresa" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-building me-2"></i><span id="tituloModalEmpresa">Nueva Empresa</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formNuevaEmpresa">
                            <input type="hidden" id="idEmpresaEdit">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Nombre de la Empresa *</label>
                                    <input type="text" class="form-control" id="nombreEmpresa" required placeholder="Ej: Mi Empresa SAC">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">RUC *</label>
                                    <input type="text" class="form-control" id="rucEmpresaForm" maxlength="11" required placeholder="20123456789">
                                    <small class="text-muted">11 dígitos</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Teléfono</label>
                                    <input type="text" class="form-control" id="telefonoEmpresa" placeholder="01-1234567">
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Dirección</label>
                                    <input type="text" class="form-control" id="direccionEmpresa" placeholder="Av. Principal 123, Lima">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Estado *</label>
                                    <select class="form-select" id="estadoEmpresa" required>
                                        <option value="1">Activa</option>
                                        <option value="0">Inactiva</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary-gradient" onclick="guardarNuevaEmpresa()">
                            <i class="fas fa-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Inicializar tabla de empresas desde la API
async function inicializarTablaEmpresas() {
    try {
        const response = await fetch('/api/empresas');
        const result = await response.json();

        if (result.success && result.data) {
            renderizarTablaEmpresas(result.data);
            console.log(`✅ ${result.data.length} empresas cargadas desde la BD`);
        } else {
            console.error('Error al cargar empresas:', result.message);
            mostrarNotificacion('Error al cargar empresas', 'danger');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'danger');
    }
}

// Renderizar tabla de empresas
function renderizarTablaEmpresas(empresas) {
    const tbody = document.querySelector('#tablaEmpresas tbody');

    if (!tbody) return;

    if (empresas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay empresas registradas</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = empresas.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td><strong>${emp.descripcion}</strong></td>
            <td>${emp.ruc || '-'}</td>
            <td>${emp.telefono || '-'}</td>
            <td class="text-truncate" style="max-width: 200px;" title="${emp.direccion || ''}">${emp.direccion || '-'}</td>
            <td>
                <span class="badge ${emp.estado === 1 ? 'bg-success' : 'bg-danger'}">
                    ${emp.estado === 1 ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td>
                <button class="btn btn-action btn-editar" onclick="editarEmpresa(${emp.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-eliminar" onclick="eliminarEmpresa(${emp.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}



// Abrir modal nueva empresa
function abrirModalNuevaEmpresa() {
    const form = document.getElementById('formNuevaEmpresa');
    form.reset();
    document.getElementById('idEmpresaEdit').value = '';
    document.getElementById('tituloModalEmpresa').textContent = 'Nueva Empresa';
    document.getElementById('estadoEmpresa').value = '1';

    const modal = new bootstrap.Modal(document.getElementById('modalNuevaEmpresa'));
    modal.show();
}

// Guardar nueva empresa o actualizar existente
async function guardarNuevaEmpresa() {
    const form = document.getElementById('formNuevaEmpresa');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nombre = document.getElementById('nombreEmpresa').value.trim();
    const ruc = document.getElementById('rucEmpresaForm').value.trim();
    const telefono = document.getElementById('telefonoEmpresa').value.trim();
    const direccion = document.getElementById('direccionEmpresa').value.trim();
    const estado = parseInt(document.getElementById('estadoEmpresa').value);
    const idEdit = document.getElementById('idEmpresaEdit').value;

    // Validaciones
    if (!nombre) {
        mostrarNotificacion('El nombre de la empresa es obligatorio', 'warning');
        return;
    }

    if (!ruc) {
        mostrarNotificacion('El RUC es obligatorio', 'warning');
        return;
    }

    if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
        mostrarNotificacion('El RUC debe tener 11 dígitos', 'warning');
        return;
    }

    const empresa = {
        descripcion: nombre,
        ruc: ruc,
        telefono: telefono,
        direccion: direccion,
        estado: estado
    };

    try {
        let response;

        if (idEdit) {
            // Actualizar empresa existente
            response = await fetch(`/api/empresas/${idEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
            });
        } else {
            // Crear nueva empresa
            response = await fetch('/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
            });
        }

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion(
                idEdit ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente',
                'success'
            );
            bootstrap.Modal.getInstance(document.getElementById('modalNuevaEmpresa')).hide();
            form.reset();
            document.getElementById('idEmpresaEdit').value = '';
            inicializarTablaEmpresas();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar la empresa', 'danger');
    }
}

// Editar empresa
async function editarEmpresa(id) {
    try {
        const response = await fetch(`/api/empresas/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
            const empresa = result.data;

            // Llenar el formulario con los datos
            document.getElementById('idEmpresaEdit').value = empresa.id;
            document.getElementById('nombreEmpresa').value = empresa.descripcion;
            document.getElementById('rucEmpresaForm').value = empresa.ruc || '';
            document.getElementById('telefonoEmpresa').value = empresa.telefono || '';
            document.getElementById('direccionEmpresa').value = empresa.direccion || '';
            document.getElementById('estadoEmpresa').value = empresa.estado;

            // Cambiar título del modal
            document.getElementById('tituloModalEmpresa').textContent = 'Editar Empresa';

            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('modalNuevaEmpresa'));
            modal.show();
        } else {
            mostrarNotificacion('Error al cargar los datos de la empresa', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar la empresa', 'danger');
    }
}

// Eliminar empresa
async function eliminarEmpresa(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta empresa?')) {
        return;
    }

    try {
        const response = await fetch(`/api/empresas/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion('Empresa eliminada exitosamente', 'success');
            inicializarTablaEmpresas();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar la empresa', 'danger');
    }
}

// Vista de usuarios por empresa
function generarVistaUsuarios() {
    return `
        <div class="mb-3">
            <button class="btn btn-primary-gradient" onclick="abrirModalNuevoUsuario()">
                <i class="fas fa-user-plus me-2"></i>Nuevo Usuario
            </button>
        </div>
        
        <div class="table-container">
            <table class="table table-hover" id="tablaUsuarios">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Empresa</th>
                        <th>Rol</th>
                        <th class="text-center" style="width: 100px;">Estado</th>
                        <th class="text-center" style="width: 120px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Datos dinámicos -->
                </tbody>
            </table>
        </div>
        
        <!-- Modal Nuevo/Editar Usuario -->
        <div class="modal fade" id="modalNuevoUsuario" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user me-2"></i><span id="tituloModalUsuario">Nuevo Usuario</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formNuevoUsuario">
                            <input type="hidden" id="idUsuarioEdit">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Usuario *</label>
                                    <input type="text" class="form-control" id="usernameUsuario" required placeholder="usuario123">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Contraseña *</label>
                                    <input type="password" class="form-control" id="passwordUsuario" placeholder="Dejar vacío para mantener">
                                    <small class="text-muted" id="passwordHelp">Mínimo 6 caracteres</small>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Nombres *</label>
                                    <input type="text" class="form-control" id="nombresUsuario" required placeholder="Juan Carlos">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Apellido Paterno *</label>
                                    <input type="text" class="form-control" id="apellidoPaternoUsuario" required placeholder="Pérez">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Apellido Materno</label>
                                    <input type="text" class="form-control" id="apellidoMaternoUsuario" placeholder="García">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tipo Documento *</label>
                                    <select class="form-select" id="tipoDocUsuario" required>
                                        <option value="">Seleccione...</option>
                                        <option value="1">DNI</option>
                                        <option value="2">Pasaporte</option>
                                        <option value="3">Carnet de Extranjería</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nro Documento *</label>
                                    <input type="text" class="form-control" id="nroDocUsuario" required placeholder="12345678">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha Nacimiento *</label>
                                    <input type="date" class="form-control" id="fechaNacimientoUsuario" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Teléfono *</label>
                                    <input type="text" class="form-control" id="telefonoUsuario" required placeholder="987654321">
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Correo *</label>
                                    <input type="email" class="form-control" id="correoUsuario" required placeholder="usuario@empresa.com">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Empresa *</label>
                                    <select class="form-select" id="empresaUsuario" required>
                                        <option value="">Seleccione una empresa</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Rol *</label>
                                    <select class="form-select" id="rolUsuario" required>
                                        <option value="">Seleccione un rol</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Puesto *</label>
                                    <select class="form-select" id="puestoUsuario" required>
                                        <option value="">Seleccione un puesto</option>
                                        <option value="1">Gerente</option>
                                        <option value="2">Analista</option>
                                        <option value="3">Asistente</option>
                                    </select>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary-gradient" onclick="guardarNuevoUsuario()">
                            <i class="fas fa-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Vista de gestión de roles del dashboard
function generarVistaRoles() {
    return `
        <div class="mb-3">
            <button class="btn btn-primary-gradient" onclick="abrirModalNuevoRol()">
                <i class="fas fa-plus me-2"></i>Nuevo Rol
            </button>
        </div>
        
        <div class="table-container">
            <table class="table table-hover" id="tablaRoles">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>Descripción del Rol</th>
                        <th class="text-center" style="width: 100px;">Estado</th>
                        <th class="text-center" style="width: 120px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Datos dinámicos -->
                </tbody>
            </table>
        </div>
        
        <!-- Modal Nuevo/Editar Rol -->
        <div class="modal fade" id="modalNuevoRol" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-shield me-2"></i><span id="tituloModalRol">Nuevo Rol</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formNuevoRol">
                            <input type="hidden" id="idRolEdit">
                            <div class="mb-3">
                                <label class="form-label">Descripción del Rol *</label>
                                <input type="text" class="form-control" id="descripcionRol" required placeholder="Ej: Super Administrador">
                                <small class="text-muted">Este es un rol global del sistema, no está asociado a ninguna empresa específica</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Estado *</label>
                                <select class="form-select" id="estadoRol" required>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary-gradient" onclick="guardarNuevoRol()">
                            <i class="fas fa-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Vista de reportes
function generarVistaReportes() {
    return `
        <div class="table-container">
            <p class="text-muted">Módulo de reportes (en desarrollo)</p>
        </div>
    `;
}

// ========== GESTIÓN DE ROLES DEL DASHBOARD ==========

// Inicializar tabla de roles desde la API
async function inicializarTablaRoles() {
    try {
        const response = await fetch('/api/roles-dashboard');
        const result = await response.json();

        if (result.success && result.data) {
            renderizarTablaRoles(result.data);
            console.log(`✅ ${result.data.length} roles cargados desde la BD`);
        } else {
            console.error('Error al cargar roles:', result.message);
            mostrarNotificacion('Error al cargar roles', 'danger');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'danger');
    }
}

// Renderizar tabla de roles
function renderizarTablaRoles(roles) {
    const tbody = document.querySelector('#tablaRoles tbody');

    if (!tbody) return;

    if (roles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay roles registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = roles.map(rol => `
        <tr>
            <td>${rol.id}</td>
            <td><strong>${rol.descripcion}</strong></td>
            <td class="text-center">
                <span class="badge ${rol.estado === 1 ? 'bg-success' : 'bg-danger'}">
                    ${rol.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="text-center">
                <button class="btn btn-action btn-editar" onclick="editarRol(${rol.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-eliminar" onclick="eliminarRol(${rol.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Abrir modal nuevo rol
function abrirModalNuevoRol() {
    const form = document.getElementById('formNuevoRol');
    form.reset();
    document.getElementById('idRolEdit').value = '';
    document.getElementById('tituloModalRol').textContent = 'Nuevo Rol';
    document.getElementById('estadoRol').value = '1';

    const modal = new bootstrap.Modal(document.getElementById('modalNuevoRol'));
    modal.show();
}

// Guardar nuevo rol o actualizar existente
async function guardarNuevoRol() {
    const form = document.getElementById('formNuevoRol');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const descripcion = document.getElementById('descripcionRol').value.trim();
    const estado = parseInt(document.getElementById('estadoRol').value);
    const idEdit = document.getElementById('idRolEdit').value;

    if (!descripcion) {
        mostrarNotificacion('La descripción del rol es obligatoria', 'warning');
        return;
    }

    const rol = {
        descripcion: descripcion,
        estado: estado
    };

    try {
        let response;

        if (idEdit) {
            // Actualizar rol existente
            response = await fetch(`/api/roles-dashboard/${idEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rol)
            });
        } else {
            // Crear nuevo rol
            response = await fetch('/api/roles-dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rol)
            });
        }

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion(
                idEdit ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente',
                'success'
            );
            bootstrap.Modal.getInstance(document.getElementById('modalNuevoRol')).hide();
            form.reset();
            document.getElementById('idRolEdit').value = '';
            inicializarTablaRoles();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el rol', 'danger');
    }
}

// Editar rol
async function editarRol(id) {
    try {
        const response = await fetch(`/api/roles-dashboard/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
            const rol = result.data;

            // Llenar el formulario con los datos
            document.getElementById('idRolEdit').value = rol.id;
            document.getElementById('descripcionRol').value = rol.descripcion;
            document.getElementById('estadoRol').value = rol.estado;

            // Cambiar título del modal
            document.getElementById('tituloModalRol').textContent = 'Editar Rol';

            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('modalNuevoRol'));
            modal.show();
        } else {
            mostrarNotificacion('Error al cargar los datos del rol', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar el rol', 'danger');
    }
}

// Eliminar rol
async function eliminarRol(id) {
    if (!confirm('¿Está seguro de que desea eliminar este rol?')) {
        return;
    }

    try {
        const response = await fetch(`/api/roles-dashboard/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion('Rol eliminado exitosamente', 'success');
            inicializarTablaRoles();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar el rol', 'danger');
    }
}

// ========== GESTIÓN DE USUARIOS ==========

// Inicializar tabla de usuarios desde la API
// Dashboard de Empresas: Muestra TODOS los usuarios de TODAS las empresas
async function inicializarTablaUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/api/usuarios/todos');
        const result = await response.json();

        if (result.success && result.data) {
            renderizarTablaUsuarios(result.data);
            console.log(`✅ ${result.data.length} usuarios cargados desde la BD (todas las empresas)`);
        } else {
            console.error('Error al cargar usuarios:', result.message);
            mostrarNotificacion('Error al cargar usuarios', 'danger');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'danger');
    }
}

// Renderizar tabla de usuarios
function renderizarTablaUsuarios(usuarios) {
    const tbody = document.querySelector('#tablaUsuarios tbody');

    if (!tbody) return;

    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay usuarios registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(user => {
        const nombreCompleto = `${user.nombres || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}`.trim();
        // El procedimiento almacenado retorna empresa_nombre y rol_descripcion directamente
        const empresaNombre = user.empresaNombre || user.empresa_nombre || (user.empresa ? user.empresa.descripcion : '-');
        const rolDescripcion = user.rolDescripcion || user.rol_descripcion || user.rolId || '-';

        return `
        <tr>
            <td>${user.id}</td>
            <td><strong>${user.usuario}</strong></td>
            <td>${nombreCompleto || '-'}</td>
            <td>${empresaNombre}</td>
            <td><span class="badge bg-info">${rolDescripcion}</span></td>
            <td class="text-center">
                <span class="badge ${user.estado === 1 ? 'bg-success' : 'bg-danger'}">
                    ${user.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="text-center">
                <button class="btn btn-action btn-editar" onclick="editarUsuario(${user.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-eliminar" onclick="eliminarUsuario(${user.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

// Abrir modal nuevo usuario
async function abrirModalNuevoUsuario() {
    const form = document.getElementById('formNuevoUsuario');
    form.reset();
    document.getElementById('idUsuarioEdit').value = '';
    document.getElementById('tituloModalUsuario').textContent = 'Nuevo Usuario';
    document.getElementById('passwordUsuario').required = true;
    document.getElementById('passwordHelp').textContent = 'Mínimo 6 caracteres';

    // Cargar empresas y roles
    await cargarEmpresasSelect();
    await cargarRolesSelect();

    const modal = new bootstrap.Modal(document.getElementById('modalNuevoUsuario'));
    modal.show();
}

// Cargar empresas en el select
async function cargarEmpresasSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/empresas');
        const result = await response.json();

        if (result.success && result.data) {
            const select = document.getElementById('empresaUsuario');
            select.innerHTML = '<option value="">Seleccione una empresa</option>';

            result.data.forEach(emp => {
                if (emp.estado === 1) {
                    select.innerHTML += `<option value="${emp.id}">${emp.descripcion}</option>`;
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar empresas:', error);
    }
}

// Cargar roles en el select (usa roles del dashboard)
async function cargarRolesSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/roles-dashboard');
        const result = await response.json();

        if (result.success && result.data) {
            const select = document.getElementById('rolUsuario');
            select.innerHTML = '<option value="">Seleccione un rol</option>';

            result.data.filter(rol => rol.estado === 1).forEach(rol => {
                select.innerHTML += `<option value="${rol.id}">${rol.descripcion}</option>`;
            });
        }
    } catch (error) {
        console.error('Error al cargar roles:', error);
    }
}

// Guardar nuevo usuario o actualizar existente
async function guardarNuevoUsuario() {
    const form = document.getElementById('formNuevoUsuario');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const username = document.getElementById('usernameUsuario').value.trim();
    const password = document.getElementById('passwordUsuario').value;
    const nombres = document.getElementById('nombresUsuario').value.trim();
    const apellidoPaterno = document.getElementById('apellidoPaternoUsuario').value.trim();
    const apellidoMaterno = document.getElementById('apellidoMaternoUsuario').value.trim();
    const tipoDocumentoId = parseInt(document.getElementById('tipoDocUsuario').value);
    const nroDocumento = document.getElementById('nroDocUsuario').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimientoUsuario').value;
    const nroCelular = document.getElementById('telefonoUsuario').value.trim();
    const correo = document.getElementById('correoUsuario').value.trim();
    const empresaId = parseInt(document.getElementById('empresaUsuario').value);
    const rolId = parseInt(document.getElementById('rolUsuario').value);
    const puestoId = parseInt(document.getElementById('puestoUsuario').value);
    const idEdit = document.getElementById('idUsuarioEdit').value;

    // Validaciones
    if (!username || !nombres || !apellidoPaterno || !empresaId || !rolId) {
        mostrarNotificacion('Todos los campos obligatorios deben estar completos', 'warning');
        return;
    }

    if (!idEdit && (!password || password.length < 6)) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }

    if (idEdit && password && password.length < 6) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }

    // Preparar datos según la entidad Usuario del backend
    const usuario = {
        usuario: username,
        nombres: nombres,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        empresaId: empresaId,
        sedeId: null, // No se llena en el dashboard de empresas
        tipoDocumentoId: tipoDocumentoId,
        nroDocumento: nroDocumento,
        fechaNacimiento: fechaNacimiento,
        rolId: rolId,
        puestoId: puestoId,
        nroCelular: nroCelular,
        correo: correo,
        estado: 1, // Siempre activo al crear
        primerLogin: 1 // Debe cambiar contraseña en primer login
    };

    // Solo incluir password si se proporcionó
    if (password) {
        usuario.password = password;
    }

    console.log('📤 Enviando usuario al backend:', { ...usuario, password: password ? '***' : undefined });

    try {
        let response;

        if (idEdit) {
            // Actualizar usuario existente
            response = await fetch(`http://localhost:3000/api/usuarios/${idEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
        } else {
            // Crear nuevo usuario
            response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
        }

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion(
                idEdit ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente',
                'success'
            );
            bootstrap.Modal.getInstance(document.getElementById('modalNuevoUsuario')).hide();
            form.reset();
            document.getElementById('idUsuarioEdit').value = '';
            inicializarTablaUsuarios();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar el usuario', 'danger');
    }
}

// Editar usuario
async function editarUsuario(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
            const usuario = result.data;

            // Cargar empresas y roles primero
            await cargarEmpresasSelect();
            await cargarRolesSelect();

            // Llenar el formulario con los datos
            document.getElementById('idUsuarioEdit').value = usuario.id;
            document.getElementById('usernameUsuario').value = usuario.usuario;
            document.getElementById('passwordUsuario').value = '';
            document.getElementById('passwordUsuario').required = false;
            document.getElementById('passwordHelp').textContent = 'Dejar vacío para mantener la contraseña actual';
            document.getElementById('nombresUsuario').value = usuario.nombres || '';
            document.getElementById('apellidoPaternoUsuario').value = usuario.apellidoPaterno || '';
            document.getElementById('apellidoMaternoUsuario').value = usuario.apellidoMaterno || '';
            document.getElementById('tipoDocUsuario').value = usuario.tipoDocumentoId || '';
            document.getElementById('nroDocUsuario').value = usuario.nroDocumento || '';
            document.getElementById('fechaNacimientoUsuario').value = usuario.fechaNacimiento || '';
            document.getElementById('telefonoUsuario').value = usuario.nroCelular || '';
            document.getElementById('correoUsuario').value = usuario.correo || '';
            document.getElementById('empresaUsuario').value = usuario.empresaId || '';
            document.getElementById('rolUsuario').value = usuario.rolId || '';
            document.getElementById('puestoUsuario').value = usuario.puestoId || '';

            // Cambiar título del modal
            document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';

            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('modalNuevoUsuario'));
            modal.show();
        } else {
            mostrarNotificacion('Error al cargar los datos del usuario', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar el usuario', 'danger');
    }
}

// Eliminar usuario
async function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            mostrarNotificacion('Usuario eliminado exitosamente', 'success');
            inicializarTablaUsuarios();
        } else {
            mostrarNotificacion(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar el usuario', 'danger');
    }
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };

    const notif = document.createElement('div');
    notif.className = `alert ${colores[tipo]} alert-dismissible fade show position-fixed`;
    notif.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notif.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
}
