// Funcionalidad del Dashboard
document.addEventListener('DOMContentLoaded', function () {
    initializeUserDropdown();
    checkAuthentication();
    loadDynamicMenus();
});

function refreshMenus() {
    loadDynamicMenus();
    showNotification('Menús actualizados exitosamente', 'success');
}

async function loadModuleContent(ruta, titulo, menuId) {
    const mainContent = document.querySelector('main');

    console.log('🔍 Cargando módulo:', ruta);

    if (!mainContent) {
        console.error('❌ Contenedor main no encontrado');
        return;
    }

    mainContent.innerHTML = `
        <div class="row">
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando módulo...</p>
            </div>
        </div>
    `;

    try {
        const url = `/modules/${ruta}.html`;

        const response = await fetch(url);

        if (response.ok) {
            const html = await response.text();
            mainContent.innerHTML = html;

            const scripts = mainContent.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
            });

        } else {
            console.warn(`⚠️ Error ${response.status}`);
            loadDefaultContent(titulo, ruta);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        showNotification('Error al cargar el módulo: ' + error.message, 'danger');
        loadDefaultContent(titulo, ruta);
    }
}

function loadDefaultContent(titulo, ruta) {
    const mainContent = document.querySelector('main');

    mainContent.innerHTML = `
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">${titulo}</h1>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="alert alert-warning">
                            Módulo en desarrollo
                        </div>
                        <p><strong>Ruta:</strong> <code>${ruta}</code></p>
                        <p>Archivo esperado: <code>/modules/${ruta}.html</code></p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadDynamicMenus() {
    try {
        showMenuLoading();

        const response = await fetch('/api/menus', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
            renderDynamicMenus(result.data);
            hideMenuLoading();
        } else {
            console.error('Error al cargar menus:', result.message);
            showMenuError('Error al cargar menus: ' + result.message);
        }
    } catch (error) {
        console.error('Error al cargar menus dinamicos:', error);
        showMenuError('Error de conexion al cargar menus: ' + error.message);
    }
}

function showMenuLoading() {
    const menuContainer = document.querySelector('.sidebar .nav.flex-column');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <li class="nav-item menu-loading">
                <div class="d-flex align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <span class="text-muted">Cargando menús...</span>
                </div>
            </li>
        `;
    }
}

function hideMenuLoading() {
    const loadingElement = document.querySelector('.menu-loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showMenuError(message) {
    const menuContainer = document.querySelector('.sidebar .nav.flex-column');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <li class="nav-item">
                <div class="alert alert-danger alert-sm m-2">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <small>${message}</small>
                    <button class="btn btn-sm btn-outline-danger mt-2 w-100" onclick="loadDynamicMenus()">
                        <i class="fas fa-sync-alt me-1"></i>
                        Reintentar
                    </button>
                </div>
            </li>
        `;
    }
}

function renderDynamicMenus(menus) {
    const menuContainer = document.querySelector('.sidebar .nav.flex-column');

    if (!menuContainer) {
        console.error('Contenedor de menú no encontrado');
        return;
    }

    menuContainer.innerHTML = '';

    if (!menus || menus.length === 0) {
        menuContainer.innerHTML = `
            <li class="nav-item">
                <div class="text-center py-3 text-muted">
                    <i class="fas fa-info-circle mb-2"></i>
                    <p class="mb-0">No hay menús disponibles</p>
                </div>
            </li>
        `;
        return;
    }

    menus.forEach((menu, index) => {
        const menuElement = createMenuElement(menu, index);
        menuContainer.appendChild(menuElement);
    });

    initializeSidebarEvents();

    console.log(`✅ ${menus.length} menús principales renderizados`);
}

function createMenuElement(menu, index) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.style.animationDelay = `${index * 100}ms`;

    const tieneHijos = menu.hijos && menu.hijos.length > 0;
    const esNivel3 = menu.menu_nivel === 3;

    if (tieneHijos && !esNivel3) {
        const submenuId = `submenu-${menu.menu_id}`;
        const nivelClass = menu.menu_nivel === 1 ? 'menu-dropdown' : 'menu-dropdown-sub';
        const iconSize = menu.menu_nivel === 1 ? 'collapse-icon' : 'collapse-icon-sub';

        li.innerHTML = `
            <a class="nav-link menu-item ${nivelClass} ${menu.menu_nivel > 1 ? 'submenu-item' : ''}" href="#" 
               data-target="#${submenuId}" 
               aria-expanded="false"
               data-menu-id="${menu.menu_id}"
               data-menu-nivel="${menu.menu_nivel}">
                <i class="fas fa-chevron-down me-2 ${iconSize}"></i>
                <i class="${menu.menu_icon || 'fas fa-folder'} me-2"></i>
                <span>${menu.menu_nombre}</span>
            </a>
            <div class="collapse" id="${submenuId}">
                <ul class="nav flex-column ms-3">
                    ${renderSubmenus(menu.hijos)}
                </ul>
            </div>
        `;
    } else {
        const indentClass = menu.menu_nivel > 1 ? 'submenu-item' : '';
        const bulletClass = menu.menu_nivel > 1 ? 'submenu-bullet' : '';
        const nivel3Class = esNivel3 ? 'submenu-nivel-3' : '';

        li.innerHTML = `
            <a class="nav-link menu-item ${indentClass} ${nivel3Class}" 
            href="#" 
            data-ruta="${menu.menu_ruta || ''}"
            data-menu-id="${menu.menu_id}"
            data-menu-nivel="${menu.menu_nivel}">
                <i class="${menu.menu_icon || 'fas fa-circle'} me-2 ${bulletClass}"></i>
                <span>${menu.menu_nombre}</span>
            </a>
        `;
    }

    return li;
}

function renderSubmenus(hijos) {
    if (!hijos || hijos.length === 0) return '';

    return hijos.map(hijo => {
        const tieneHijos = hijo.hijos && hijo.hijos.length > 0;
        const esNivel3 = hijo.menu_nivel === 3;

        if (tieneHijos && !esNivel3) {
            const submenuId = `submenu-${hijo.menu_id}`;

            return `
                <li class="nav-item">
                    <a class="nav-link submenu-item menu-dropdown-sub" href="#"
                       data-target="#${submenuId}" 
                       aria-expanded="false"
                       data-menu-id="${hijo.menu_id}"
                       data-menu-nivel="${hijo.menu_nivel}">
                        <i class="fas fa-chevron-down me-2 collapse-icon-sub"></i>
                        <i class="${hijo.menu_icon || 'fas fa-folder'} me-2"></i>
                        <span>${hijo.menu_nombre}</span>
                    </a>
                    <div class="collapse" id="${submenuId}">
                        <ul class="nav flex-column ms-3">
                            ${renderSubmenus(hijo.hijos)}
                        </ul>
                    </div>
                </li>
            `;
        } else {
            const nivel3Class = esNivel3 ? 'submenu-nivel-3' : '';

            return `
                <li class="nav-item">
                    <a class="nav-link menu-item submenu-item ${nivel3Class}" 
                    href="#" 
                    data-ruta="${hijo.menu_ruta || ''}"
                    data-menu-id="${hijo.menu_id}"
                    data-menu-nivel="${hijo.menu_nivel}">
                        <i class="${hijo.menu_icon || 'fas fa-circle'} me-2 submenu-bullet"></i>
                        <span>${hijo.menu_nombre}</span>
                    </a>
                </li>
            `;
        }
    }).join('');
}

// Variable global para evitar múltiples inicializaciones
let sidebarEventsInitialized = false;

function initializeSidebarEvents() {
    const menuContainer = document.querySelector('.sidebar .nav.flex-column');

    if (!menuContainer) {
        console.error('Contenedor de menú no encontrado');
        return;
    }

    // Si ya está inicializado, no hacer nada
    if (sidebarEventsInitialized) {
        console.log('⚠️ Eventos ya inicializados, saltando...');
        return;
    }

    // Marcar como inicializado
    sidebarEventsInitialized = true;

    // Usar delegación de eventos - UN SOLO listener para todo
    menuContainer.addEventListener('click', function (e) {
        // Buscar si el click fue en un dropdown
        const dropdownItem = e.target.closest('.menu-dropdown, .menu-dropdown-sub');

        if (dropdownItem) {
            e.preventDefault();
            e.stopPropagation();

            const targetId = dropdownItem.getAttribute('data-target');
            if (!targetId) return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const icon = dropdownItem.querySelector('.collapse-icon, .collapse-icon-sub');
            const isOpen = targetElement.classList.contains('show');

            console.log(`🔄 Toggle menú: ${targetId}, Estado actual: ${isOpen ? 'ABIERTO' : 'CERRADO'}`);

            if (isOpen) {
                // CERRAR
                targetElement.classList.remove('show');
                dropdownItem.setAttribute('aria-expanded', 'false');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
                console.log(`✅ Menú ${targetId} CERRADO`);
            } else {
                // ABRIR (y cerrar hermanos)
                const parent = dropdownItem.closest('ul');
                if (parent) {
                    // Cerrar todos los hermanos
                    const siblings = parent.querySelectorAll(':scope > .nav-item > .collapse.show');
                    siblings.forEach(sibling => {
                        if (sibling.id !== targetId.substring(1)) {
                            sibling.classList.remove('show');
                            const siblingBtn = parent.querySelector(`[data-target="#${sibling.id}"]`);
                            if (siblingBtn) {
                                siblingBtn.setAttribute('aria-expanded', 'false');
                                const siblingIcon = siblingBtn.querySelector('.collapse-icon, .collapse-icon-sub');
                                if (siblingIcon) {
                                    siblingIcon.style.transform = 'rotate(0deg)';
                                }
                            }
                        }
                    });
                }

                targetElement.classList.add('show');
                dropdownItem.setAttribute('aria-expanded', 'true');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
                console.log(`✅ Menú ${targetId} ABIERTO`);
            }

            return; // Detener propagación
        }

        // Si no es dropdown, verificar si es un menú clickable
        const menuItem = e.target.closest('.menu-item:not(.menu-dropdown):not(.menu-dropdown-sub)');

        if (menuItem) {
            e.preventDefault();

            const menuRuta = menuItem.getAttribute('data-ruta');
            const menuNombre = menuItem.querySelector('span')?.textContent.trim();

            console.log('📱 Menú clickable:', menuNombre);

            // Remover active de todos
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });

            // Marcar como activo
            menuItem.classList.add('active');

            // Cargar contenido
            if (menuRuta && menuRuta !== '' && menuRuta !== '#') {
                loadModuleContent(menuRuta, menuNombre);
                showNotification(`Cargando: ${menuNombre}`, 'info');
            }
        }
    }, true); // true = useCapture para capturar el evento antes

    console.log('✅ Eventos de menú inicializados');
}

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
    }, 3000);
}

function initializeUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        console.log('Dropdown de usuario inicializado');
    }
}

function checkAuthentication() {
    const user = localStorage.getItem('user');

    if (!user) {
        console.log('No hay sesión activa, redirigiendo al login...');
        window.location.href = '/login.html';
        return;
    }

    try {
        const userData = JSON.parse(user);
        console.log('Usuario autenticado:', userData.usuario);

        // Actualizar el nombre del usuario en el dropdown (en blanco)
        const userNameElement = document.getElementById('nombreUsuarioHeader');
        if (userNameElement) {
            // Soportar ambos formatos: camelCase y snake_case
            const nombreCompleto = userData.nombreCompleto || userData.nombre_completo || userData.usuario || 'Usuario';
            userNameElement.textContent = nombreCompleto;
            userNameElement.style.color = 'white';
        }

        // Cargar información de la empresa del usuario
        cargarInformacionEmpresa(userData);
    } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    // Actualizar el sidebar con el nombre de la empresa
    const nombreEmpresaElement = document.getElementById('nombreEmpresaSidebar');
    const subtituloEmpresaElement = document.getElementById('subtituloEmpresa');

    if (nombreEmpresaElement) {
        nombreEmpresaElement.textContent = nombreEmpresa;
    }

    if (subtituloEmpresaElement) {
        subtituloEmpresaElement.textContent = subtituloEmpresa;
    }

    console.log('✅ Empresa cargada:', nombreEmpresa, subtituloEmpresa);
}

function cargarInformacionEmpresa(userData) {
    // Obtener el nombre de la empresa del usuario logueado
    // El backend retorna empresaNombre o empresa_nombre del JOIN
    let nombreEmpresaCompleto = userData.empresaNombre || userData.empresa_nombre || userData.empresa || 'EMPRESA SISTEMA';
    
    // Dividir el nombre de la empresa para el header y sidebar
    const palabras = nombreEmpresaCompleto.trim().split(' ');
    const nombreEmpresa = palabras[0]; // Primera palabra para el sidebar
    const subtituloEmpresa = palabras.slice(1).join(' ') || 'SISTEMA ERP'; // Resto para subtítulo
    
    // Actualizar el HEADER superior con el nombre completo de la empresa
    const nombreEmpresaHeaderElement = document.getElementById('nombreEmpresaHeader');
    if (nombreEmpresaHeaderElement) {
        nombreEmpresaHeaderElement.textContent = nombreEmpresaCompleto;
    }
    
    // Actualizar el SIDEBAR con el nombre dividido
    const nombreEmpresaSidebarElement = document.getElementById('nombreEmpresaSidebar');
    const subtituloEmpresaElement = document.getElementById('subtituloEmpresa');
    
    if (nombreEmpresaSidebarElement) {
        nombreEmpresaSidebarElement.textContent = nombreEmpresa;
    }
    
    if (subtituloEmpresaElement) {
        subtituloEmpresaElement.textContent = subtituloEmpresa;
    }
    
    console.log('✅ Empresa cargada:', {
        header: nombreEmpresaCompleto,
        sidebar: nombreEmpresa,
        subtitulo: subtituloEmpresa
    });
}

function logout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    showNotification('Sesión cerrada exitosamente', 'success');

    setTimeout(() => {
        window.location.href = '/index.html';
    }, 1000);
}

// Estilos
const hierarchicalMenuStyles = `
    .menu-dropdown {
        font-weight: 600;
        color: #495057;
    }

    .menu-dropdown:hover {
        background-color: #f8f9fa;
    }

    .collapse-icon,
    .collapse-icon-sub {
        transition: transform 0.3s ease;
        font-size: 0.75rem;
    }

    .submenu-item {
        font-size: 0.9rem;
        padding-left: 1rem;
        color: #6c757d;
    }

    .submenu-item:hover {
        background-color: #e9ecef;
        color: #495057;
    }

    .submenu-item.active {
        background-color: #007bff;
        color: white !important;
        border-radius: 4px;
    }

    .submenu-item.active .submenu-bullet {
        color: white !important;
    }

    .submenu-bullet {
        font-size: 0.6rem;
        color: #adb5bd;
    }

    .submenu-nivel-3 {
        font-size: 0.82rem;
        padding-left: 2rem;
        color: #868e96;
    }

    .submenu-nivel-3:hover {
        background-color: #dee2e6;
        color: #495057;
    }

    .submenu-nivel-3.active {
        background-color: #0056b3;
        color: white !important;
    }

    .collapse {
        transition: height 0.3s ease;
    }

    .nav-item {
        margin-bottom: 2px;
    }

    .menu-dropdown-sub {
        font-weight: 500;
        font-size: 0.9rem;
    }
`;

if (!document.getElementById('hierarchical-menu-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hierarchical-menu-styles';
    styleSheet.textContent = hierarchicalMenuStyles;
    document.head.appendChild(styleSheet);
}

// Exportar funciones globales
window.logout = logout;
window.loadDynamicMenus = loadDynamicMenus;
window.refreshMenus = refreshMenus;