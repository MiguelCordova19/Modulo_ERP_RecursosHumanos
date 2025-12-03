# Funcionalidad de Edición de Usuarios

## ✅ Implementación Completada

Se ha implementado exitosamente la funcionalidad de edición de usuarios reutilizando el mismo formulario de registro.

## 🎯 Características

### Modo Creación
- Formulario limpio para nuevo usuario
- Título: "Registrar Usuario"
- Botón: "Siguiente" → Abre modal de credenciales
- Requiere usuario y contraseña

### Modo Edición
- Formulario pre-cargado con datos del usuario
- Título: "Editar Usuario"
- Botón: "Actualizar" → Guarda directamente
- NO requiere credenciales (mantiene las existentes)

## 🔧 Archivos Modificados

### Frontend

1. **frontend/modules/registro-usuario.html**
   - Agregado campo oculto `usuarioId`
   - ID dinámico en título: `tituloModulo`
   - ID dinámico en botón: `btnGuardar`

2. **frontend/js/modules/registro-usuario.js**
   - Nueva propiedad: `modoEdicion` y `usuarioIdEditar`
   - Método `init()` acepta parámetro `usuarioId`
   - Nuevo método: `configurarModoFormulario()` - Cambia título y botón
   - Nuevo método: `cargarDatosUsuario()` - Carga datos para edición
   - Nuevo método: `actualizarUsuario()` - Actualiza vía PUT
   - Modificado: `guardarUsuario()` - Detecta modo y actúa en consecuencia

3. **frontend/js/modules/usuarios.js**
   - Modificado método `editar()` - Llama a `loadModuleContent` con ID

4. **frontend/js/dashboard.js**
   - Modificado `loadModuleContent()` - Acepta parámetro adicional
   - Guarda parámetro en `window.MODULE_PARAM`

### Backend

✅ Ya existían los endpoints necesarios:
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `PUT /api/usuarios/{id}` - Actualizar usuario
- El método `save()` en `UsuarioService` maneja ambos casos

## 🚀 Flujo de Uso

### Para Crear Usuario:
1. Click en "Nuevo Usuario" en la tabla
2. Llenar formulario
3. Click en "Siguiente"
4. Modal de credenciales aparece
5. Ingresar usuario y contraseña
6. Click en "Guardar Usuario"
7. Usuario creado ✅

### Para Editar Usuario:
1. Click en botón "Editar" (✏️) en la tabla
2. Formulario se carga con datos del usuario
3. Modificar campos necesarios
4. Click en "Actualizar"
5. Usuario actualizado ✅ (sin pedir credenciales)

## 📡 Endpoints Utilizados

```javascript
// Obtener usuario para edición
GET http://localhost:3000/api/usuarios/{id}

// Actualizar usuario
PUT http://localhost:3000/api/usuarios/{id}
Body: {
  nombres: "...",
  apellidoPaterno: "...",
  apellidoMaterno: "...",
  empresaId: 1,
  sedeId: null,
  tipoDocumentoId: 1,
  nroDocumento: "...",
  fechaNacimiento: "YYYY-MM-DD",
  rolId: 2,
  puestoId: null,
  nroCelular: "...",
  correo: "...",
  estado: 1
}
```

## 🔐 Seguridad

- En modo edición NO se permite cambiar la contraseña
- La contraseña se mantiene encriptada en la BD
- Para cambiar contraseña existe endpoint separado: `/api/usuarios/{id}/cambiar-password`

## 📝 Notas Técnicas

1. **Parámetro de Módulo**: Se usa `window.MODULE_PARAM` para pasar el ID del usuario entre módulos
2. **Detección de Modo**: El módulo detecta automáticamente si viene un ID (edición) o no (creación)
3. **Reutilización**: El mismo HTML y JS se usa para ambos modos
4. **Validaciones**: Se mantienen las mismas validaciones en ambos modos

## ✨ Ventajas de esta Implementación

- ✅ DRY (Don't Repeat Yourself) - Un solo formulario
- ✅ Mantenibilidad - Cambios en un solo lugar
- ✅ UX consistente - Misma interfaz para crear/editar
- ✅ Menos código - No duplicar lógica
- ✅ Fácil de extender - Agregar campos una sola vez

## 🎨 Mejoras Futuras Sugeridas

1. Agregar confirmación antes de actualizar
2. Mostrar historial de cambios del usuario
3. Permitir cambio de contraseña desde el formulario de edición (con validación)
4. Agregar foto de perfil del usuario
5. Implementar tabla de puestos (actualmente es campo informativo)
