// Módulo de Gestión de Empresas
const empresasModule = {
    modal: null,
    
    init: function() {
        console.log('✅ Módulo Empresas inicializado');
        this.cargarEmpresas();
        this.inicializarModal();
    },
    
    inicializarModal: function() {
        const modalElement = document.getElementById('modalNuevaEmpresaUsuario');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }
    },
    
    cargarEmpresas: function() {
        const empresas = this.obtenerEmpresasLocales();
        this.renderizarTabla(empresas);
    },
    
    obtenerEmpresasLocales: function() {
        const empresas = localStorage.getItem('empresas_data');
        if (empresas) {
            return JSON.parse(empresas);
        }
        
        // Datos por defecto
        const empresasDefault = [
            { 
                id: 1, 
                nombre: 'PROMART HOMECENTER', 
                ruc: '20123456789', 
                codigo: 'PROMART2024',
                telefono: '01-6259000',
                direccion: 'Av. Angamos Este 2681, Surquillo',
                estado: 1 
            },
            { 
                id: 2, 
                nombre: 'SODIMAC PERÚ', 
                ruc: '20987654321', 
                codigo: 'SODIMAC2024',
                telefono: '01-2119000',
                direccion: 'Av. Aviación 2405, San Borja',
                estado: 1 
            },
            { 
                id: 3, 
                nombre: 'MAESTRO HOME CENTER', 
                ruc: '20456789123', 
                codigo: 'MAESTRO2024',
                telefono: '01-6259500',
                direccion: 'Av. Universitaria 5175, Los Olivos',
                estado: 1 
            }
        ];
        
        localStorage.setItem('empresas_data', JSON.stringify(empresasDefault));
        return empresasDefault;
    },
    
    renderizarTabla: function(empresas) {
        const tbody = document.querySelector('#tablaEmpresasUsuario tbody');
        
        if (!tbody) {
            console.error('Tabla no encontrada');
            return;
        }
        
        tbody.innerHTML = empresas.map(emp => `
            <tr>
                <td>${emp.id}</td>
                <td><strong>${emp.nombre}</strong></td>
                <td>${emp.ruc}</td>
                <td><code>${emp.codigo}</code></td>
                <td>${emp.telefono || '-'}</td>
                <td>
                    <span class="badge ${emp.estado === 1 ? 'bg-success' : 'bg-danger'}">
                        ${emp.estado === 1 ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-action btn-editar" onclick="empresasModule.editar(${emp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-eliminar" onclick="empresasModule.eliminar(${emp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    editar: function(id) {
        this.showNotification(`Editar empresa ID: ${id} (en desarrollo)`, 'info');
    },
    
    eliminar: function(id) {
        if (confirm('¿Está seguro de eliminar esta empresa?')) {
            let empresas = this.obtenerEmpresasLocales();
            empresas = empresas.filter(e => e.id !== id);
            localStorage.setItem('empresas_data', JSON.stringify(empresas));
            this.cargarEmpresas();
            this.showNotification('Empresa eliminada correctamente', 'success');
        }
    },
    
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
};

// Funciones globales
function abrirModalNuevaEmpresaUsuario() {
    const form = document.getElementById('formNuevaEmpresaUsuario');
    if (form) form.reset();
    if (empresasModule.modal) empresasModule.modal.show();
}

function guardarNuevaEmpresaUsuario() {
    const form = document.getElementById('formNuevaEmpresaUsuario');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const empresas = empresasModule.obtenerEmpresasLocales();
    const maxId = Math.max(...empresas.map(e => e.id), 0);
    
    const nuevaEmpresa = {
        id: maxId + 1,
        nombre: document.getElementById('nombreEmpresaUsuario').value,
        ruc: document.getElementById('rucEmpresaUsuario').value,
        codigo: document.getElementById('codigoEmpresaUsuario').value,
        telefono: document.getElementById('telefonoEmpresaUsuario').value,
        direccion: document.getElementById('direccionEmpresaUsuario').value,
        estado: parseInt(document.getElementById('estadoEmpresaUsuario').value)
    };
    
    empresas.push(nuevaEmpresa);
    localStorage.setItem('empresas_data', JSON.stringify(empresas));
    
    if (empresasModule.modal) empresasModule.modal.hide();
    empresasModule.cargarEmpresas();
    empresasModule.showNotification('Empresa creada exitosamente', 'success');
}

// Inicializar cuando el DOM esté listo
$(document).ready(function() {
    empresasModule.init();
});
