// Funcionalidad del sistema de login
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginButton = document.querySelector('.btn-login');
    
    // Toggle para mostrar/ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar el icono
            if (type === 'text') {
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            } else {
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            }
        });
    }
    
    // Validación en tiempo real
    function validateInput(input) {
        const value = input.value.trim();
        const inputGroup = input.closest('.input-group');
        
        // Remover clases de validación previas
        if (inputGroup) {
            inputGroup.classList.remove('is-valid', 'is-invalid');
        }
        
        if (value.length === 0) {
            return false;
        }
        
        if (input.id === 'username' && value.length < 3) {
            if (inputGroup) inputGroup.classList.add('is-invalid');
            return false;
        }
        
        if (input.id === 'password' && value.length < 4) {
            if (inputGroup) inputGroup.classList.add('is-invalid');
            return false;
        }
        
        if (inputGroup) inputGroup.classList.add('is-valid');
        return true;
    }
    
    // Eventos de validación en tiempo real
    usernameInput.addEventListener('input', function() {
        validateInput(this);
        updateLoginButton();
    });
    
    passwordInput.addEventListener('input', function() {
        validateInput(this);
        updateLoginButton();
    });
    
    // Actualizar estado del botón de login
    function updateLoginButton() {
        const isUsernameValid = usernameInput.value.trim().length >= 3;
        const isPasswordValid = passwordInput.value.length >= 4;
        
        if (isUsernameValid && isPasswordValid) {
            loginButton.disabled = false;
            loginButton.style.opacity = '1';
        } else {
            loginButton.disabled = true;
            loginButton.style.opacity = '0.6';
        }
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} login-message mt-3`;
        messageDiv.style.borderRadius = '15px';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.animation = 'fadeIn 0.3s ease';
        messageDiv.innerHTML = `
            <i class="fas ${getIconForType(type)} me-2"></i>
            <span>${message}</span>
        `;
        
        loginForm.appendChild(messageDiv);
        
        // Remover mensaje después de 5 segundos (excepto si es error)
        if (type !== 'danger') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 5000);
        }
    }
    
    // Obtener icono según tipo de mensaje
    function getIconForType(type) {
        const icons = {
            'success': 'fa-check-circle',
            'danger': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    // Función de loading
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Autenticando...';
            loginButton.disabled = true;
            usernameInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión';
            loginButton.disabled = false;
            usernameInput.disabled = false;
            passwordInput.disabled = false;
        }
    }
    
    // Función para autenticar con el backend
    async function authenticate(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            // Verificar si la respuesta es OK
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Error en autenticación:', error);
            return {
                success: false,
                message: 'Error de conexión con el servidor. Verifique su red.'
            };
        }
    }
    
    // Función para guardar datos de sesión
    function saveSession(userData) {
        try {
            // Guardar autenticación
            localStorage.setItem('isAuthenticated', 'true');
            
            // Guardar datos del usuario
            localStorage.setItem('usuario_id', userData.usuario_id || '');
            localStorage.setItem('usuario', userData.usuario || '');
            localStorage.setItem('nombre_completo', userData.nombre_completo || '');
            localStorage.setItem('correo', userData.correo || '');
            
            // Guardar datos de empresa
            localStorage.setItem('empresa_id', userData.empresa_id || '');
            localStorage.setItem('empresa_nombre', userData.empresa_nombre || '');
            
            // Guardar datos adicionales
            localStorage.setItem('sede_id', userData.sede_id || '');
            localStorage.setItem('rol_id', userData.rol_id || '');
            localStorage.setItem('puesto_id', userData.puesto_id || '');
            
            // Guardar timestamp de login
            localStorage.setItem('loginTime', new Date().toISOString());
            
            console.log('✅ Sesión guardada:', {
                usuario: userData.usuario,
                empresa: userData.empresa_nombre
            });
            
            return true;
        } catch (error) {
            console.error('Error al guardar sesión:', error);
            return false;
        }
    }
    
    // Manejo del envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validación básica
        if (!username || !password) {
            showMessage('Por favor, complete todos los campos.', 'warning');
            return;
        }
        
        if (username.length < 3) {
            showMessage('El nombre de usuario debe tener al menos 3 caracteres.', 'warning');
            usernameInput.focus();
            return;
        }
        
        if (password.length < 4) {
            showMessage('La contraseña debe tener al menos 4 caracteres.', 'warning');
            passwordInput.focus();
            return;
        }
        
        // Iniciar proceso de autenticación
        setLoadingState(true);
        
        console.log('🔐 Intentando autenticar usuario:', username);
        
        // Llamar al backend
        const result = await authenticate(username, password);
        
        if (result.success && result.data) {
            console.log('✅ Autenticación exitosa');
            
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            // Guardar datos de sesión
            const sessionSaved = saveSession(result.data);
            
            if (sessionSaved) {
                // Redirigir al dashboard después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                showMessage('Error al guardar la sesión. Intente nuevamente.', 'danger');
                setLoadingState(false);
            }
            
        } else {
            console.log('❌ Autenticación fallida:', result.message);
            
            showMessage(
                result.message || 'Usuario o contraseña incorrectos. Verifique sus credenciales.', 
                'danger'
            );
            
            // Limpiar contraseña y hacer focus
            passwordInput.value = '';
            passwordInput.focus();
            
            setLoadingState(false);
        }
    });
    
    // Efectos visuales adicionales
    
    // Efecto de focus en inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Efecto de hover en el avatar
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Animación de entrada para el formulario
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        loginContainer.style.opacity = '0';
        loginContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            loginContainer.style.transition = 'all 0.6s ease';
            loginContainer.style.opacity = '1';
            loginContainer.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Manejo de teclas especiales
    document.addEventListener('keydown', function(e) {
        // Enter en cualquier input del formulario
        if (e.key === 'Enter' && (e.target === usernameInput || e.target === passwordInput)) {
            if (!loginButton.disabled) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape para limpiar mensajes
        if (e.key === 'Escape') {
            const message = document.querySelector('.login-message');
            if (message) {
                message.remove();
            }
        }
    });
    
    // Verificar si ya está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        console.log('⚠️ Usuario ya autenticado, redirigiendo...');
        window.location.href = '/dashboard.html';
        return;
    }
    
    // Inicialización
    updateLoginButton();
    
    // Limpiar cualquier sesión anterior al cargar la página
    if (!isAuthenticated) {
        localStorage.clear();
    }
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        
        .login-message {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Función para manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// Prevenir recarga accidental
window.addEventListener('beforeunload', function(e) {
    const loginButton = document.querySelector('.btn-login');
    if (loginButton && loginButton.disabled && loginButton.innerHTML.includes('Autenticando')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Exportar funciones para testing (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateInput,
        showMessage,
        authenticate
    };
}