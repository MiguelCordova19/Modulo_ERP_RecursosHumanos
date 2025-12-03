# 🔍 Diagnóstico: Modal de Asistencia No Se Abre

## 🐛 Problema
Al hacer clic en el botón "Nuevo" en el módulo de Asistencia, el modal no se abre.

## ✅ Pasos de Diagnóstico

### Paso 1: Verificar que el Módulo se Carga

Abre la consola del navegador (F12) y busca:
```
✅ Módulo Asistencia inicializado
```

Si NO ves este mensaje, el módulo no se está cargando.

### Paso 2: Verificar Errores en la Consola

Busca errores en rojo como:
- `Uncaught ReferenceError: asistencia is not defined`
- `Uncaught TypeError: Cannot read property 'nuevo' of undefined`
- `$ is not defined`

### Paso 3: Verificar que jQuery está Cargado

En la consola, escribe:
```javascript
typeof $
```

Debería retornar `"function"`. Si retorna `"undefined"`, jQuery no está cargado.

### Paso 4: Verificar que el Módulo Existe

En la consola, escribe:
```javascript
console.log(asistencia);
```

Debería mostrar el objeto con todas sus funciones. Si muestra `undefined`, el módulo no se cargó.

### Paso 5: Verificar que el Modal Existe en el DOM

En la consola, escribe:
```javascript
$('#modalAsistencia').length
```

Debería retornar `1`. Si retorna `0`, el HTML del modal no está en el DOM.

## 🔧 Soluciones

### Solución 1: Verificar Carga del Módulo

Asegúrate de que el archivo `asistencia.js` se está cargando. Verifica en:
- DevTools → Network → busca `asistencia.js`
- Debería aparecer con status 200

### Solución 2: Verificar Orden de Carga

Los scripts deben cargarse en este orden:
```html
<!-- 1. jQuery -->
<script src="jquery.min.js"></script>

<!-- 2. Bootstrap -->
<script src="bootstrap.bundle.min.js"></script>

<!-- 3. Tu módulo -->
<script src="js/modules/asistencia.js"></script>
```

### Solución 3: Forzar Recarga

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Solución 4: Verificar que el HTML se Cargó

Si estás usando carga dinámica de módulos, asegúrate de que:
1. El HTML de `asistencia.html` se carga en el contenedor principal
2. El JS de `asistencia.js` se carga después del HTML

### Solución 5: Probar Manualmente

En la consola del navegador, ejecuta:
```javascript
// Verificar que el módulo existe
console.log(asistencia);

// Intentar abrir el modal manualmente
asistencia.nuevo();

// O directamente con Bootstrap
const modal = new bootstrap.Modal(document.getElementById('modalAsistencia'));
modal.show();
```

## 🎯 Código de Prueba

Copia y pega esto en la consola del navegador:

```javascript
// Test completo
console.log('=== DIAGNÓSTICO ASISTENCIA ===');
console.log('1. jQuery cargado:', typeof $ !== 'undefined');
console.log('2. Bootstrap cargado:', typeof bootstrap !== 'undefined');
console.log('3. Módulo asistencia existe:', typeof asistencia !== 'undefined');
console.log('4. Modal existe en DOM:', $('#modalAsistencia').length > 0);
console.log('5. Botón Nuevo existe:', $('.btn-nuevo-asistencia').length > 0);

// Si todo está OK, intentar abrir el modal
if (typeof asistencia !== 'undefined') {
    console.log('Intentando abrir modal...');
    asistencia.nuevo();
} else {
    console.error('❌ El módulo asistencia no está definido');
}
```

## 📋 Checklist

- [ ] jQuery está cargado
- [ ] Bootstrap está cargado
- [ ] El archivo `asistencia.js` se carga sin errores
- [ ] El archivo `asistencia.html` está en el DOM
- [ ] El modal `#modalAsistencia` existe en el DOM
- [ ] El botón `.btn-nuevo-asistencia` existe en el DOM
- [ ] No hay errores en la consola
- [ ] El módulo `asistencia` está definido

## 🔍 Información para Compartir

Si el problema persiste, comparte:

1. **Captura de pantalla** de la consola (F12)
2. **Resultado** del código de prueba de arriba
3. **Errores** que aparezcan en rojo
4. **Cómo cargas** el módulo (¿dinámicamente? ¿en el HTML principal?)

---

**Fecha:** 2025-12-03
