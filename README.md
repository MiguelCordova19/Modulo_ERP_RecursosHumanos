# ERP Meridian - Sistema de Login

Sistema de login responsivo para el ERP de Recursos Humanos Meridian, desarrollado con HTML5, CSS3, JavaScript y Bootstrap 5.

## 🚀 Características

- ✅ Diseño responsivo con Bootstrap 5
- ✅ Colores corporativos Meridian (coral/rosa)
- ✅ Animaciones CSS personalizadas
- ✅ Validación en tiempo real
- ✅ Toggle para mostrar/ocultar contraseña
- ✅ Mensajes de error y éxito
- ✅ Credenciales de prueba incluidas

## 📁 Estructura del Proyecto

```
Modulo_ERP_RecursosHumanos/
├── index.html          # Página principal del login
├── styles.css          # Estilos personalizados
├── script.js           # Funcionalidad JavaScript
├── .cpanel.yml         # Configuración para deployment en cPanel
└── README.md           # Documentación del proyecto
```

## 🔐 Credenciales de Prueba

| Usuario   | Contraseña |
|-----------|------------|
| admin     | admin123   |
| usuario   | password   |
| meridian  | erp2024    |

## 🌐 Deployment en cPanel

### Configuración Automática

Este proyecto incluye un archivo `.cpanel.yml` para deployment automático en cPanel.

### Pasos para configurar:

1. **Editar el archivo .cpanel.yml:**
   ```yaml
   # Cambiar 'username' por tu nombre de usuario real de cPanel
   - export DEPLOYPATH=/home/TU_USUARIO/public_html/
   ```

2. **Subir archivos a tu repositorio Git:**
   - Conecta tu cuenta de cPanel con tu repositorio Git (GitHub, GitLab, etc.)
   - El deployment se ejecutará automáticamente en cada push

3. **Configuración manual alternativa:**
   Si prefieres subir manualmente:
   ```bash
   # Subir archivos via File Manager o FTP:
   - index.html → /public_html/
   - styles.css → /public_html/
   - script.js → /public_html/
   ```

### Características del Deployment:

- ✅ Copia automática de archivos al directorio público
- ✅ Configuración de permisos correctos (644)
- ✅ Creación de .htaccess con:
  - Rewrite rules para SPA
  - Cache headers para optimización
  - Compresión GZIP
  - Configuraciones de seguridad
- ✅ Protección de archivos de configuración

## 🛠️ Desarrollo Local

### Requisitos:
- Python 3.x (para servidor local)
- Navegador web moderno

### Ejecutar localmente:
```bash
# Navegar al directorio del proyecto
cd Modulo_ERP_RecursosHumanos

# Iniciar servidor local
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000
```

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

### Modificar Credenciales:
Editar en `script.js`:
```javascript
const validCredentials = {
    'tu_usuario': 'tu_contraseña',
    // Agregar más usuarios...
};
```

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Funcionalidad interactiva
- **Bootstrap 5**: Framework CSS responsivo
- **Font Awesome**: Iconografía

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema ERP Meridian, contactar al equipo de desarrollo.

---

**Meridian ERP** - Sistema de Gestión de Recursos Humanos
© 2024 - Todos los derechos reservados
