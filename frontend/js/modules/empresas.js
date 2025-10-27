// Módulo de Visualización de Empresas (solo lectura)
const empresasModule = {
    init: function() {
        console.log('✅ Módulo Empresas (visualización) inicializado');
        this.cargarEmpresas();
    },
    
    async cargarEmpresas() {
        try {
            const response = await fetch('/api/empresas');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.renderizarTabla(result.data);
                console.log(`✅ ${result.data.length} empresas cargadas desde la BD`);
            } else {
                console.error('Error al cargar empresas:', result.message);
                this.mostrarNotificacion('Error al cargar empresas', 'danger');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.mostrarNotificacion('Error de conexión con el servidor', 'danger');
        }
    },
    
    renderizarTabla: function(empresas) {
        const tbody = document.querySelector('#tablaEmpresasUsuario tbody');
        if (!tbody) return;
        
        if (empresas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="fas fa-inbox fa-3x mb-3"></i>
                        <p>No hay empresas registradas</p>
                        <a href="/empresas/dashboard-empresa.html" class="btn btn-primary mt-2">
                            <i class="fas fa-plus me-2"></i>Crear Primera Empresa
                        </a>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = empresas.map(empresa => `
            <tr>
                <td class="text-center">${empresa.id}</td>
                <td><strong>${empresa.descripcion}</strong></td>
                <td class="text-center">${empresa.ruc || '-'}</td>
                <td>${empresa.telefono || '-'}</td>
                <td class="text-truncate" style="max-width: 200px;" title="${empresa.direccion || ''}">${empresa.direccion || '-'}</td>
                <td class="text-center">
                    <span class="badge ${empresa.estado === 1 ? 'bg-success' : 'bg-danger'}">
                        ${empresa.estado === 1 ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
            </tr>
        `).join('');
    },
    
    mostrarNotificacion: function(mensaje, tipo = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    empresasModule.init();
});
