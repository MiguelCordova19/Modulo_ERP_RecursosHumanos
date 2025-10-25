// Dashboard Empresas - JavaScript
let empresaActual = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
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
    
    switch(modulo) {
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
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>RUC</th>
                        <th>Código</th>
                        <th>Usuarios</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Datos dinámicos -->
                </tbody>
            </table>
        </div>
        
        <!-- Modal Nueva Empresa -->
        <div class="modal fade" id="modalNuevaEmpresa" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-building me-2"></i>Nueva Empresa
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formNuevaEmpresa">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre de la Empresa *</label>
                                    <input type="text" class="form-control" id="nombreEmpresa" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">RUC *</label>
                                    <input type="text" class="form-control" id="rucEmpresaForm" maxlength="11" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Código de Acceso *</label>
                                    <input type="text" class="form-control" id="codigoEmpresaForm" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Teléfono</label>
                                    <input type="text" class="form-control" id="telefonoEmpresa">
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Dirección</label>
                                    <input type="text" class="form-control" id="direccionEmpresa">
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

// Inicializar tabla de empresas
function inicializarTablaEmpresas() {
    const empresas = obtenerEmpresasLocales();
    const tbody = document.querySelector('#tablaEmpresas tbody');
    
    tbody.innerHTML = empresas.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td><strong>${emp.nombre}</strong></td>
            <td>${emp.ruc}</td>
            <td><code>${emp.codigo}</code></td>
            <td><span class="badge bg-info">${emp.usuarios || 0}</span></td>
            <td>
                <span class="badge ${emp.estado === 1 ? 'bg-success' : 'bg-danger'}">
                    ${emp.estado === 1 ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td>
                <button class="btn btn-action btn-editar" onclick="editarEmpresa(${emp.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-action btn-eliminar" onclick="eliminarEmpresa(${emp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Obtener empresas desde localStorage
function obtenerEmpresasLocales() {
    const empresas = localStorage.getItem('empresas_data');
    if (empresas) {
        return JSON.parse(empresas);
    }
    
    // Datos por defecto
    const empresasDefault = [
        { id: 1, nombre: 'PROMART HOMECENTER', ruc: '20123456789', codigo: 'PROMART2024', usuarios: 45, estado: 1 },
        { id: 2, nombre: 'SODIMAC PERÚ', ruc: '20987654321', codigo: 'SODIMAC2024', usuarios: 78, estado: 1 },
        { id: 3, nombre: 'MAESTRO HOME CENTER', ruc: '20456789123', codigo: 'MAESTRO2024', usuarios: 32, estado: 1 }
    ];
    
    localStorage.setItem('empresas_data', JSON.stringify(empresasDefault));
    return empresasDefault;
}

// Abrir modal nueva empresa
function abrirModalNuevaEmpresa() {
    const modal = new bootstrap.Modal(document.getElementById('modalNuevaEmpresa'));
    document.getElementById('formNuevaEmpresa').reset();
    modal.show();
}

// Guardar nueva empresa
function guardarNuevaEmpresa() {
    const form = document.getElementById('formNuevaEmpresa');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const empresas = obtenerEmpresasLocales();
    const maxId = Math.max(...empresas.map(e => e.id), 0);
    
    const nuevaEmpresa = {
        id: maxId + 1,
        nombre: document.getElementById('nombreEmpresa').value,
        ruc: document.getElementById('rucEmpresaForm').value,
        codigo: document.getElementById('codigoEmpresaForm').value,
        telefono: document.getElementById('telefonoEmpresa').value,
        direccion: document.getElementById('direccionEmpresa').value,
        usuarios: 0,
        estado: 1
    };
    
    empresas.push(nuevaEmpresa);
    localStorage.setItem('empresas_data', JSON.stringify(empresas));
    
    bootstrap.Modal.getInstance(document.getElementById('modalNuevaEmpresa')).hide();
    inicializarTablaEmpresas();
    mostrarNotificacion('Empresa creada exitosamente', 'success');
}

// Editar empresa
function editarEmpresa(id) {
    mostrarNotificacion(`Editar empresa ID: ${id} (en desarrollo)`, 'info');
}

// Eliminar empresa
function eliminarEmpresa(id) {
    if (confirm('¿Está seguro de eliminar esta empresa?')) {
        let empresas = obtenerEmpresasLocales();
        empresas = empresas.filter(e => e.id !== id);
        localStorage.setItem('empresas_data', JSON.stringify(empresas));
        inicializarTablaEmpresas();
        mostrarNotificacion('Empresa eliminada', 'success');
    }
}

// Vista de usuarios
function generarVistaUsuarios() {
    return `
        <div class="table-container">
            <p class="text-muted">Módulo de usuarios por empresa (en desarrollo)</p>
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
