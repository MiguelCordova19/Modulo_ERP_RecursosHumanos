# ERP Meridian - Sistema de Recursos Humanos

Sistema ERP para la gestión de Recursos Humanos Meridian, desarrollado con arquitectura frontend/backend separada. Frontend con HTML5, CSS3, JavaScript y Bootstrap 5. Backend con Node.js y PostgreSQL.

## 🚀 Características

- ✅ Diseño responsivo con Bootstrap 5
- ✅ Colores corporativos Meridian (coral/rosa)
- ✅ Arquitectura modular frontend/backend
- ✅ API RESTful para comunicación entre capas
- ✅ Sistema de menús dinámicos
- ✅ Gestión de trabajadores
- ✅ Módulo de motivos de préstamos
- ✅ Contenedorización con Docker
- ✅ Dashboard interactivo

## 📁 Estructura del Proyecto

```
Modulo_ERP_RecursosHumanos/
├── backend/                # Servidor y API
│   ├── configuration/      # Configuración de base de datos
│   ├── controllers/        # Controladores de la API
│   ├── routes/             # Rutas de la API
│   ├── Dockerfile          # Configuración de Docker
│   ├── docker-compose.yml  # Orquestación de contenedores
│   ├── servidor.js         # Punto de entrada del servidor
│   └── package.json        # Dependencias del backend
├── frontend/               # Interfaz de usuario
│   ├── css/                # Estilos CSS
│   ├── js/                 # Scripts JavaScript
│   ├── images/             # Recursos gráficos
│   ├── modules/            # Módulos del sistema
│   ├── index.html          # Página de login
│   └── dashboard.html      # Panel principal
└── README.md               # Documentación del proyecto
```

## 🔐 Credenciales de Prueba

| Usuario   | Contraseña |
|-----------|------------|
| admin     | admin123   |
| usuario   | password   |
| meridian  | erp2024    |

## 🐳 Deployment con Docker

El proyecto incluye configuración Docker para facilitar el despliegue y desarrollo.

### Requisitos:
- Docker y Docker Compose instalados
- Node.js (para desarrollo)
- PostgreSQL (o usar la versión contenedorizada)

### Pasos para ejecutar con Docker:

1. **Configurar variables de entorno:**
   - Revisar el archivo `.env` en la carpeta backend
   - Ajustar las credenciales de base de datos según sea necesario

2. **Construir y ejecutar los contenedores:**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Verificar que los servicios estén funcionando:**
   ```bash
   docker-compose ps
   ```

### Características del Deployment con Docker:

- ✅ Contenedorización completa del backend
- ✅ Configuración de red aislada para servicios
- ✅ Persistencia de datos con volúmenes
- ✅ Reinicio automático de servicios
- ✅ Escalabilidad horizontal

## 🌐 Deployment Frontend (cPanel)

El frontend puede desplegarse en cPanel utilizando el archivo `.cpanel.yml` incluido.

### Pasos para configurar:

1. **Editar el archivo .cpanel.yml:**
   ```yaml
   # Cambiar 'username' por tu nombre de usuario real de cPanel
   - export DEPLOYPATH=/home/TU_USUARIO/public_html/
   ```

2. **Subir archivos a tu repositorio Git:**
   - Conecta tu cuenta de cPanel con tu repositorio Git
   - El deployment se ejecutará automáticamente en cada push

## 🛠️ Desarrollo Local

### Requisitos:
- Node.js 14.x o superior
- PostgreSQL 12.x o superior (o usar Docker)
- Navegador web moderno

### Ejecutar Backend:
```bash
# Navegar al directorio del backend
cd Modulo_ERP_RecursosHumanos/backend

# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm run dev

# O iniciar en modo producción
npm start
```

### Ejecutar Frontend:
```bash
# Navegar al directorio del frontend
cd Modulo_ERP_RecursosHumanos/frontend

# Si usas un servidor local como http-server
npx http-server -p 8080

# O simplemente abre index.html en tu navegador
```

## 🔄 API y Endpoints

El sistema cuenta con varios endpoints para la gestión de datos:

- `/api/menu` - Gestión de menús dinámicos
- `/api/trabajadores` - Gestión de trabajadores
- `/api/motivo-prestamo` - Gestión de motivos de préstamos

## 🎨 Personalización

### Colores Corporativos:
```css
:root {
    --primary-coral: #E8A598;
    --secondary-coral: #D4958A;
    --light-coral: #F5E6E3;
    --dark-coral: #C8847A;
}
```

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## 🔧 Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript ES6+
  - Bootstrap 5
  - Font Awesome
  
- **Backend**:
  - Node.js
  - Express.js
  - PostgreSQL
  - Docker

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema ERP Meridian, contactar al equipo de desarrollo.

---

**Meridian ERP** - Sistema de Gestión de Recursos Humanos
© 2025 - Todos los derechos reservados
