# 🔧 Limpiar LocalStorage y Reiniciar Sesión

## 🐛 Problemas Actuales

1. **Error:** `Identifier 'API_URL' has already been declared`
2. **Empresa ID incorrecta:** Muestra ID = 1 cuando debería ser ID = 2

## ✅ Soluciones Aplicadas

### 1. Error de API_URL (✅ Corregido)

**Cambio en:** `frontend/js/modules/asignar-rol.js`

```javascript
// Antes (❌ Causaba error al recargar)
const API_URL = 'http://localhost:3000/api';

// Ahora (✅ No causa error)
window.API_URL = window.API_URL || 'http://localhost:3000/api';
const API_URL = window.API_URL;
```

### 2. Empresa ID Incorrecta

El problema es que el **localStorage tiene datos antiguos** de cuando usabas empresa ID = 1.

## 🚀 SOLUCIÓN INMEDIATA

### Opción 1: Limpiar LocalStorage (Recomendado)

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Limpiar TODO el localStorage
localStorage.clear();

// Recargar la página
location.href = '/login.html';
```

### Opción 2: Limpiar Solo empresa_id

```javascript
// Eliminar solo empresa_id
localStorage.removeItem('empresa_id');

// Cerrar sesión
localStorage.clear();

// Ir a login
location.href = '/login.html';
```

### Opción 3: Desde la Interfaz

1. **Cierra sesión** usando el botón de logout
2. **Vuelve a iniciar sesión** con tu usuario
3. **Ve a Asignar Rol**
4. ✅ Ahora debería usar empresa ID = 2

## 🔍 Verificar que Funciona

Después de limpiar y volver a iniciar sesión:

### 1. Verificar Login

Abre consola (F12) después de iniciar sesión y busca:

```
💾 Guardando sesión con datos: {empresaId: 2, ...}
✅ Sesión guardada correctamente: {
  empresa_id: "2",  ← Debe ser 2
  ...
}
```

### 2. Verificar LocalStorage

Ejecuta en consola:

```javascript
console.log({
  empresa_id: localStorage.getItem('empresa_id'),
  usuario_id: localStorage.getItem('usuario_id'),
  rol_id: localStorage.getItem('rol_id')
});
```

**Resultado esperado:**
```javascript
{
  empresa_id: "2",  ← Debe ser 2, no 1
  usuario_id: "X",
  rol_id: "Y"
}
```

### 3. Verificar Asignar Rol

Ve a Asignar Rol y busca en consola:

```
🏢 Empresa ID final: 2  ← Debe ser 2
```

## 📋 Pasos Completos

### Paso 1: Limpiar

```javascript
// En consola (F12)
localStorage.clear();
console.log('✅ LocalStorage limpiado');
```

### Paso 2: Ir a Login

```javascript
location.href = '/login.html';
```

### Paso 3: Iniciar Sesión

1. Inicia sesión con tu usuario (empresa ID = 2)
2. Verifica en consola que se guarde correctamente

### Paso 4: Ir a Asignar Rol

1. Ve a: Gestión de Seguridad → Asignar Rol
2. Verifica en consola que use empresa ID = 2
3. ✅ Debería cargar los roles de la empresa 2

## 🎯 Por Qué Pasó Esto

1. **Antes:** El código usaba empresa ID = 1 por defecto
2. **Se guardó en localStorage:** empresa_id = "1"
3. **Ahora:** El código ya no usa valor por defecto
4. **Pero:** El localStorage todavía tiene el valor antiguo
5. **Solución:** Limpiar localStorage y volver a iniciar sesión

## 📊 Flujo Correcto

```
1. Limpiar localStorage
   ↓
2. Iniciar sesión
   ↓
3. Backend retorna empresaId = 2
   ↓
4. Frontend guarda empresa_id = "2"
   ↓
5. Asignar Rol lee empresa_id = "2"
   ↓
6. Carga roles de empresa 2
```

## ✅ Checklist

- [ ] Ejecuté `localStorage.clear()` en consola
- [ ] Fui a `/login.html`
- [ ] Inicié sesión con mi usuario
- [ ] Verifiqué que se guardó empresa_id = "2"
- [ ] Fui a Asignar Rol
- [ ] Verificó que usa empresa_id = "2"
- [ ] Funciona correctamente

## 🔧 Script de Limpieza Automática

Copia y pega esto en la consola (F12):

```javascript
// Script de limpieza y reinicio
console.log('🧹 Limpiando localStorage...');
localStorage.clear();
console.log('✅ LocalStorage limpiado');

console.log('🔄 Redirigiendo a login...');
setTimeout(() => {
    location.href = '/login.html';
}, 1000);
```

---

**Ejecuta el script de limpieza y vuelve a iniciar sesión.** El problema se resolverá. 🎯
