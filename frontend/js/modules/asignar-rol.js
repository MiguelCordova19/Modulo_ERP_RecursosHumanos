// ============================================
// Módulo: Asignar Rol (Permisos)
// Descripción: Gestión de permisos de menús por rol
// ============================================

// Configuración global - usar window para evitar redeclaración
window.API_URL = window.API_URL || 'http://localhost:3000/api';

// Variables del módulo - usar var para evitar error de redeclaración
var matrizData = null;
var permisosModificados = new Map(); // Almacenar cambios pendientes

// ============================================
// Inicialización
// ============================================
$(document).ready(function() {
    console.log('Módulo Asignar Rol cargado');
    
    // Cargar matriz de permisos
    cargarMatrizPermisos();
    
    // Event listeners
    $('#btn-actualizar-matriz').on('click', cargarMatrizPermisos);
    $('#btn-guardar-permisos').on('click', guardarPermisos);
});

// ============================================
// Cargar matriz de permisos
// ============================================
async function cargarMatrizPermisos() {
    try {
        // Obtener empresa del usuario logueado
        // Prioridad: 1. Variable global, 2. localStorage, 3. Backend
        let empresaId = window.EMPRESA_ID || localStorage.getItem('empresa_id');
        
        console.log('🔍 Buscando empresa_id...', {
            window_EMPRESA_ID: window.EMPRESA_ID,
            localStorage_empresa_id: localStorage.getItem('empresa_id'),
            empresaId_final: empresaId
        });
        
        // Si no existe o está vacío, intentar obtenerlo del usuario actual
        if (!empresaId || empresaId === 'null' || empresaId === 'undefined' || empresaId === '') {
            console.warn('⚠️ empresa_id no encontrado, obteniendo del usuario actual...');
            
            const usuarioId = localStorage.getItem('usuario_id');
            if (usuarioId) {
                try {
                    const response = await fetch(`${window.API_URL}/usuarios/${usuarioId}`);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data && result.data.empresaId) {
                            empresaId = result.data.empresaId.toString();
                            localStorage.setItem('empresa_id', empresaId);
                            window.EMPRESA_ID = empresaId;
                            console.log('✅ Empresa ID obtenida del backend:', empresaId);
                        }
                    }
                } catch (error) {
                    console.error('❌ Error al obtener empresa del usuario:', error);
                }
            }
        }
        
        console.log('🏢 Empresa ID final:', empresaId);
        
        if (!empresaId) {
            // Usar alert si Swal no está disponible
            if (typeof Swal !== 'undefined') {
                mostrarError('No se pudo obtener la información de la empresa. Por favor, cierre sesión y vuelva a entrar.');
            } else {
                alert('Error: No se pudo obtener la información de la empresa. Por favor, cierre sesión y vuelva a entrar.');
            }
            
            // Mostrar mensaje en la tabla
            $('#tbody-permisos').html(`
                <tr>
                    <td colspan="100" class="text-center">
                        <div class="alert alert-danger m-3">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Error:</strong> No se pudo obtener la información de la empresa.
                            <br><br>
                            <strong>Solución:</strong>
                            <ol class="text-start">
                                <li>Cierre sesión</li>
                                <li>Vuelva a iniciar sesión</li>
                                <li>Intente nuevamente</li>
                            </ol>
                            <button class="btn btn-primary mt-2" onclick="window.location.href='/login.html'">
                                <i class="fas fa-sign-out-alt me-1"></i>
                                Ir a Login
                            </button>
                        </div>
                    </td>
                </tr>
            `);
            return;
        }
        
        console.log('🏢 Empresa ID:', empresaId);
        
        // Mostrar loading
        $('#tbody-permisos').html(`
            <tr>
                <td colspan="100" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">Cargando matriz de permisos...</p>
                </td>
            </tr>
        `);
        
        // Llamar al API
        const response = await fetch(`${window.API_URL}/rol-menu/matriz?empresaId=${empresaId}`);
        const result = await response.json();
        
        if (result.success) {
            matrizData = result.data;
            renderizarMatriz();
            mostrarExito('Matriz cargada exitosamente');
        } else {
            mostrarError(result.message || 'Error al cargar la matriz');
        }
    } catch (error) {
        console.error('Error al cargar matriz:', error);
        mostrarError('Error de conexión al cargar la matriz');
    }
}

// ============================================
// Renderizar matriz de permisos
// ============================================
function renderizarMatriz() {
    if (!matrizData) return;
    
    const { menus, roles, permisos } = matrizData;
    
    // Validar que haya roles
    if (!roles || roles.length === 0) {
        $('#tbody-permisos').html(`
            <tr>
                <td colspan="100" class="text-center">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No hay roles creados para esta empresa. Por favor, cree roles primero en el módulo de Roles.
                    </div>
                </td>
            </tr>
        `);
        return;
    }
    
    // Crear encabezados de roles
    let headerHtml = `
        <th style="width: 30%; position: sticky; left: 0; background: #cfe2ff; z-index: 10;">
            <i class="fas fa-list me-2"></i>Menú
        </th>
    `;
    
    roles.forEach(rol => {
        headerHtml += `
            <th class="text-center" style="min-width: 120px;">
                <i class="fas fa-user-shield me-1"></i>
                ${rol.rolDescripcion}
            </th>
        `;
    });
    
    $('#tabla-permisos thead tr').html(headerHtml);
    
    // Crear filas de menús
    let bodyHtml = '';
    
    menus.forEach(menu => {
        // Determinar clase según nivel
        let nivelClass = `menu-nivel-${menu.menuNivel}`;
        let indent = '';
        
        // Agregar icono si existe
        let iconHtml = menu.menuIcon ? `<i class="${menu.menuIcon} me-2"></i>` : '';
        
        bodyHtml += `<tr data-menu-id="${menu.menuId}">`;
        bodyHtml += `<td class="${nivelClass}">${iconHtml}${menu.menuNombre}</td>`;
        
        // Crear checkboxes para cada rol
        roles.forEach(rol => {
            // Verificar si el permiso existe
            const tienePermiso = permisos.some(p => 
                p.rolId === rol.rolId && p.menuId === menu.menuId
            );
            
            bodyHtml += `
                <td class="text-center">
                    <input type="checkbox" 
                           class="checkbox-permiso" 
                           data-rol-id="${rol.rolId}" 
                           data-menu-id="${menu.menuId}"
                           ${tienePermiso ? 'checked' : ''}>
                </td>
            `;
        });
        
        bodyHtml += `</tr>`;
    });
    
    $('#tbody-permisos').html(bodyHtml);
    
    // Agregar event listeners a los checkboxes
    $('.checkbox-permiso').on('change', function() {
        const rolId = $(this).data('rol-id');
        const menuId = $(this).data('menu-id');
        const checked = $(this).is(':checked');
        
        // Guardar cambio en el mapa
        const key = `${rolId}-${menuId}`;
        permisosModificados.set(key, { rolId, menuId, checked });
        
        console.log(`Permiso modificado: Rol ${rolId}, Menú ${menuId}, Estado: ${checked}`);
    });
}

// ============================================
// Guardar permisos
// ============================================
async function guardarPermisos() {
    try {
        if (permisosModificados.size === 0) {
            mostrarAdvertencia('No hay cambios para guardar');
            return;
        }
        
        // Confirmar acción
        if (!confirm('¿Está seguro de guardar los cambios en los permisos?')) {
            return;
        }
        
        // Deshabilitar botón
        $('#btn-guardar-permisos').prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm me-1"></span>
            Guardando...
        `);
        
        // Agrupar permisos por rol
        const permisosPorRol = new Map();
        
        permisosModificados.forEach((permiso) => {
            if (!permisosPorRol.has(permiso.rolId)) {
                permisosPorRol.set(permiso.rolId, []);
            }
            if (permiso.checked) {
                permisosPorRol.get(permiso.rolId).push(permiso.menuId);
            }
        });
        
        // Obtener todos los checkboxes marcados por rol
        const rolesActualizados = new Set();
        permisosModificados.forEach(p => rolesActualizados.add(p.rolId));
        
        // Para cada rol modificado, obtener TODOS sus permisos actuales
        const promesas = [];
        
        rolesActualizados.forEach(rolId => {
            const menuIds = [];
            $(`.checkbox-permiso[data-rol-id="${rolId}"]:checked`).each(function() {
                menuIds.push($(this).data('menu-id'));
            });
            
            const request = {
                rolId: rolId,
                menuIds: menuIds
            };
            
            promesas.push(
                fetch(`${window.API_URL}/rol-menu/asignar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request)
                })
            );
        });
        
        // Ejecutar todas las peticiones
        const responses = await Promise.all(promesas);
        const results = await Promise.all(responses.map(r => r.json()));
        
        // Verificar resultados
        const errores = results.filter(r => !r.success);
        
        if (errores.length > 0) {
            mostrarError('Algunos permisos no se pudieron guardar: ' + errores[0].message);
        } else {
            mostrarExito('Permisos guardados exitosamente');
            permisosModificados.clear();
            cargarMatrizPermisos();
        }
        
    } catch (error) {
        console.error('Error al guardar permisos:', error);
        mostrarError('Error de conexión al guardar permisos');
    } finally {
        // Rehabilitar botón
        $('#btn-guardar-permisos').prop('disabled', false).html(`
            <i class="fas fa-save me-1"></i>
            Guardar Permisos
        `);
    }
}

// ============================================
// Funciones de notificación
// ============================================
function mostrarExito(mensaje) {
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: mensaje,
        timer: 2000,
        showConfirmButton: false
    });
}

function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje
    });
}

function mostrarAdvertencia(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: mensaje
    });
}
