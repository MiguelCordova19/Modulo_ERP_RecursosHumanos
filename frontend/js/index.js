// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.module-card, .info-card, .plan-card, .testimonio-card').forEach(el => {
    observer.observe(el);
});

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efectos hover en módulos
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', function() {
        console.log('Módulo seleccionado:', this.querySelector('h5').textContent);
    });
});

// Botones de planes
document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', function() {
        const planName = this.closest('.plan-card').querySelector('h4').textContent;
        alert(`¡Gracias por tu interés en el plan ${planName}! Un asesor se contactará contigo pronto.`);
    });
});

// Botones del navbar
document.querySelectorAll('.nav-buttons .btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        if (btnText === 'Iniciar Sesión') {
            // Redirigir a login.html
            window.location.href = 'login.html';
        } else if (btnText === 'Registrarse') {
            alert('Registro en desarrollo');
        } else if (btnText === 'Contáctanos') {
            window.scrollTo({
                top: document.querySelector('.footer')?.offsetTop || document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Log para desarrollo
console.log('🎨 Meridian ERP - Landing Page cargada correctamente');
console.log('Color principal: #FF7E70');