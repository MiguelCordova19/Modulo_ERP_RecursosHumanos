// Funcionalidad del sistema de login
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginButton = document.querySelector('.btn-login');
    
    // Credenciales de ejemplo (en un entorno real, esto se manejaría en el backend)
    const validCredentials = {
        'admin': 'admin123',
        'usuario': 'password',
        'meridian': 'erp2024'
    };
    
    // Toggle para mostrar/ocultar contraseña
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
    
    // Validación en tiempo real
    function validateInput(input) {
        const value = input.value.trim();
        const inputGroup = input.closest('.input-group');
        
        // Remover clases de validación previas
        inputGroup.classList.remove('is-valid', 'is-invalid');
        
        if (value.length === 0) {
            return false;
        }
        
        if (input.type === 'text' && value.length < 3) {
            inputGroup.classList.add('is-invalid');
            return false;
        }
        
        if (input.type === 'password' && value.length < 6) {
            inputGroup.classList.add('is-invalid');
            return false;
        }
        
        inputGroup.classList.add('is-valid');
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
        const isUsernameValid = validateInput(usernameInput);
        const isPasswordValid = validateInput(passwordInput);
        
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
        messageDiv.textContent = message;
        
        loginForm.appendChild(messageDiv);
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Función de loading
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            loginButton.disabled = true;
        } else {
            loginButton.innerHTML = 'Iniciar Sesión';
            loginButton.disabled = false;
        }
    }
    
    // Manejo del envío del formulario
    loginForm.addEventListener('submit', function(e) {
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
        
        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres.', 'warning');
            passwordInput.focus();
            return;
        }
        
        // Simular proceso de autenticación
        setLoadingState(true);
        
        setTimeout(() => {
            // Verificar credenciales
            if (validCredentials[username] && validCredentials[username] === password) {
                showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Simular redirección después de 2 segundos
                setTimeout(() => {
                    // En un entorno real, aquí se redirigiría al dashboard
                    alert('¡Bienvenido al sistema ERP Meridian!\n\nEn un entorno real, serías redirigido al dashboard.');
                    
                    // Limpiar formulario
                    loginForm.reset();
                    updateLoginButton();
                }, 2000);
            } else {
                showMessage('Credenciales incorrectas. Verifique su usuario y contraseña.', 'danger');
                passwordInput.value = '';
                passwordInput.focus();
            }
            
            setLoadingState(false);
        }, 1500); // Simular delay de red
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
    
    // Inicialización
    updateLoginButton();
    
    // Mostrar credenciales de prueba en consola (solo para desarrollo)
    console.log('=== CREDENCIALES DE PRUEBA ===');
    console.log('Usuario: admin | Contraseña: admin123');
    console.log('Usuario: usuario | Contraseña: password');
    console.log('Usuario: meridian | Contraseña: erp2024');
    console.log('==============================');
});

// Función para manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// Prevenir envío de formulario con F5
window.addEventListener('keydown', function(e) {
    if (e.key === 'F5') {
        e.preventDefault();
        location.reload();
    }
});