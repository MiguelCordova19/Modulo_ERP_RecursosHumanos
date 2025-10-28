// Funciones para el modal de cambio de contraseña obligatorio

// Función para toggle de visibilidad de contraseña
function togglePasswordField(fieldId, iconId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    
    if (field && icon) {
        if (field.type === 'password') {
            field.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            field.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Función para cambiar contraseña obligatoriamente
async function cambiarPasswordObligatorio() {
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;
    
    // Validaciones
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
        showNotification('Todos los campos son obligatorios', 'danger');
        return;
    }
    
    if (passwordNueva.length < 6) {
        showNotification('La nueva contraseña debe tener al menos 6 caracteres', 'danger');
        return;
    }
    
    if (passwordNueva !== passwordConfirmar) {
        showNotification('Las contraseñas no coinciden', 'danger');
        return;
    }
    
    if (passwordActual === passwordNueva) {
        showNotification('La nueva contraseña debe ser diferente a la actual', 'danger');
        return;
    }
    
    // Obtener datos del usuario
    const user = localStorage.getItem('user');
    if (!user) {
        showNotification('Error: No se encontró información del usuario', 'danger');
        return;
    }
    
    const userData = JSON.parse(user);
    const usuarioId = userData.id || userData.usuario_id;
    
    // Deshabilitar botón
    const btn = event.target;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Cambiando...';
    btn.disabled = true;
    
    try {
        // Usar el nuevo endpoint que valida la contraseña actual
        const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}/cambiar-password-validado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passwordActual: passwordActual,
                passwordNueva: passwordNueva
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Contraseña cambiada exitosamente', 'success');
            
            // Actualizar el usuario en localStorage para quitar el flag de primerLogin
            userData.primerLogin = 0;
            userData.primer_login = 0;
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCambioPasswordObligatorio'));
            if (modal) {
                modal.hide();
            }
            
            // Recargar la página para continuar normalmente
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification(result.message || 'Error al cambiar contraseña', 'danger');
        }
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        showNotification('Error al conectar con el servidor', 'danger');
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

// Función de notificaciones (si no existe ya)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

console.log('✅ Script de cambio de contraseña cargado');
