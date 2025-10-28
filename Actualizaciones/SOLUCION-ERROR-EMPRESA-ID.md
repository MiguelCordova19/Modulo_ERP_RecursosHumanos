# 🔧 Solución: Error "No se pudo obtener la información de la empresa"

## 🐛 Problema

Al abrir el módulo "Asignar Rol", aparece un error que dice:
```
Error
No se pudo obtener la información de la empresa
```

## 📋 Causa

El `empresa_id` no está guardado en el localStorage cuando el usuario inicia sesión.

## ✅ Solución Aplicada

He modificado `asignar-rol.js` para que:

1. **Primero intente obtener** `empresa_id` del localStorage
2. **Si no existe**, intente obtenerlo del backend usando el `usuario_id`
3. **Guarde el resultado** en localStorage para futuras consultas
4. **Muestre un mensaje claro** si aún así no puede obtenerlo

## 🚀 Pasos para Probar

### Opción 1: Cerrar Sesión y Volver a Entrar (Recomendado)

1. **Cerrar sesión** en el sistema
2. **Volver a iniciar sesión**
3. **Ir a:** Gestión de Seguridad → Asignar Rol
4. ✅ Debería cargar correctamente

### Opción 2: Agregar empresa_id Manualmente (Temporal)

Si no quieres cerrar sesión, abre la consola del navegador (F12) y ejecuta:

```javascript
// Reemplaza 1 con el ID de tu empresa
localStorage.setItem('empresa_id', '1');

// Luego recarga la página
location.reload();
```

## 🔍 Verificar el Problema

Abre la consola del navegador (F12) y busca este mensaje:

```
📦 LocalStorage completo: {
  empresa_id: null,  ← Si es null, ese es el problema
  usuario: "admin",
  usuario_id: "2",
  todas_las_claves: [...]
}
```

## 🛠️ Solución Permanente

El problema raíz está en el login. Necesitamos asegurarnos de que `empresa_id` se guarde correctamente al iniciar sesión.

### Verificar script.js

El archivo `frontend/js/script.js` debería tener esto en la función de login:

```javascript
// Guardar datos de empresa
localStorage.setItem('empresa_id', userData.empresa_id || '');
localStorage.setItem('empresa_nombre', userData.empresa_nombre || '');
```

### Si el Backend No Envía empresa_id

Verifica que el backend esté enviando `empresa_id` en la respuesta del login:

```java
// En AuthService.java o similar
Map<String, Object> userData = new HashMap<>();
userData.put("usuario_id", usuario.getId());
userData.put("usuario", usuario.getUsuario());
userData.put("empresa_id", usuario.getEmpresaId());  // ← Debe estar presente
userData.put("empresa_nombre", empresa.getNombre());
// ...
```

## 📊 Flujo Correcto

```
1. Usuario inicia sesión
   ↓
2. Backend retorna datos incluyendo empresa_id
   ↓
3. Frontend guarda empresa_id en localStorage
   ↓
4. Módulo Asignar Rol lee empresa_id
   ↓
5. Carga matriz de permisos
```

## 🧪 Prueba Rápida

Ejecuta esto en la consola del navegador (F12):

```javascript
// Ver qué hay en localStorage
console.log('empresa_id:', localStorage.getItem('empresa_id'));
console.log('usuario_id:', localStorage.getItem('usuario_id'));

// Si empresa_id es null pero usuario_id existe:
// El código actualizado intentará obtenerlo del backend
```

## ✅ Resultado Esperado

Después de aplicar la solución:

1. **Primera vez:** El código intenta obtener empresa_id del localStorage
2. **Si no existe:** Lo obtiene del backend usando usuario_id
3. **Lo guarda:** Para futuras consultas
4. **Carga la matriz:** Con el empresa_id correcto

## 📝 Cambios Realizados

**Archivo:** `frontend/js/modules/asignar-rol.js`

**Cambios:**
- ✅ Agregado debug de localStorage
- ✅ Fallback para obtener empresa_id del backend
- ✅ Guardado automático en localStorage
- ✅ Mensaje de error más claro

---

**Solución aplicada:** 28/10/2025 - 00:45  
**Estado:** ✅ Implementado con fallback
