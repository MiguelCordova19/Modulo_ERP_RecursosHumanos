# Portal de Empresas - Sistema ERP

## 📁 Estructura de Carpetas

```
frontend/empresas/
├── login-empresa.html          # Login exclusivo para empresas
├── dashboard-empresa.html      # Dashboard de gestión de empresas
├── css/
│   └── dashboard-empresa.css   # Estilos del portal de empresas
└── js/
    └── dashboard-empresa.js    # Lógica del portal de empresas
```

## 🎯 Características

### 1. Login de Empresas
- **Archivo**: `login-empresa.html`
- **Spline 3D**: Integración con animación 3D interactiva
- **Autenticación**: Sistema de login con código de empresa y contraseña
- **Empresas de prueba**:
  - PROMART2024 / admin123
  - SODIMAC2024 / admin123
  - MAESTRO2024 / admin123

### 2. Dashboard de Empresas
- **Archivo**: `dashboard-empresa.html`
- **Funcionalidades**:
  - Gestión completa de empresas (CRUD)
  - Visualización de estadísticas
  - Usuarios por empresa
  - Reportes

### 3. Integración con Dashboard Principal
- El nombre de la empresa se muestra dinámicamente en el sidebar
- El nombre de usuario aparece en blanco en el header
- Sistema de empresas compartido entre ambos dashboards

## 🚀 Cómo Usar

### Acceso al Portal de Empresas
1. Desde la página principal: Click en "Portal Empresas"
2. Desde el login de usuarios: Click en "Portal Empresas"
3. URL directa: `/empresas/login-empresa.html`

### Gestión de Empresas en Dashboard de Usuarios
1. Iniciar sesión como usuario
2. Navegar al módulo "Gestión de Empresas"
3. Crear, editar o eliminar empresas

## 💾 Almacenamiento

Los datos se guardan en `localStorage`:
- `empresas_data`: Lista de empresas
- `empresaActual`: Empresa actualmente logueada en el portal

## 🎨 Diseño

- **Colores**: Gradiente púrpura (#667eea → #764ba2)
- **Spline**: Animación 3D de 100 followers
- **Responsive**: Adaptado para móviles y tablets

## 📝 Próximas Mejoras

- [ ] Conexión con base de datos
- [ ] Relación usuarios-empresas
- [ ] Módulo de reportes completo
- [ ] Sistema de permisos por empresa
- [ ] Dashboard con gráficos estadísticos
