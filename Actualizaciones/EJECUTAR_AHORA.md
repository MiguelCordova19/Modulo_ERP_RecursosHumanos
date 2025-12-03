# ⚡ EJECUTAR AHORA - Motivo Préstamo

## 🎯 Sigue estos pasos en orden

---

## PASO 1: Base de Datos (2 minutos)

### Abrir SQL Server Management Studio

1. Conectarse a tu servidor SQL
2. Abrir el archivo: `sql/00_ejecutar_todo_motivo_prestamo.sql`
3. Presionar F5 o click en "Ejecutar"
4. Esperar mensaje: "CONFIGURACIÓN COMPLETADA EXITOSAMENTE"

### ✅ Verificar
```sql
-- Copiar y ejecutar esto:
SELECT * FROM RRHH_MMOTIVOPRESTAMO;
```

**Deberías ver 7 motivos de ejemplo.**

---

## PASO 2: Backend (1 minuto)

### Si el backend está corriendo:

**Opción A: Reiniciar desde IDE**
- Detener el servidor
- Volver a iniciar

**Opción B: Reiniciar desde terminal**
```bash
# Ir a la carpeta backend
cd backend

# Detener con Ctrl+C si está corriendo

# Reiniciar
mvn spring-boot:run
```

### ✅ Verificar
Abrir en navegador:
```
http://localhost:8080/api/motivos-prestamo?empresaId=1
```

**Deberías ver un JSON con los motivos.**

---

## PASO 3: Frontend (30 segundos)

### Probar en la aplicación:

1. Abrir tu aplicación web
2. Iniciar sesión
3. Ir al menú "Motivo Préstamo"
4. Click en botón "Nuevo"
5. Ingresar: "Prueba de sistema"
6. Click en "Guardar"
7. Confirmar en SweetAlert
8. ✅ Debería aparecer en la tabla

---

## 🧪 PRUEBA RÁPIDA ALTERNATIVA

### Opción 1: Página de Pruebas
```
Abrir en navegador:
frontend/test-motivo-prestamo.html
```

Click en "Listar Motivos" → Deberías ver los datos

### Opción 2: Consola del Navegador
```javascript
// Abrir consola (F12)
// Copiar y pegar:

fetch('/api/motivos-prestamo?empresaId=1')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## ❌ SI ALGO FALLA

### Error: "Tabla no existe"
```sql
-- Ejecutar solo este archivo:
sql/01_crear_tabla_motivo_prestamo.sql
```

### Error: "Backend no responde"
```bash
# Verificar que esté corriendo:
curl http://localhost:8080/api/motivos-prestamo?empresaId=1

# Si no responde, iniciar backend:
cd backend
mvn spring-boot:run
```

### Error: "SweetAlert no funciona"
```
Verificar que motivo-prestamo.html tenga esta línea:
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### Error: "empresaId es null"
```javascript
// En consola del navegador (F12):
localStorage.setItem('empresaId', '1');
// Recargar página
```

---

## 📋 CHECKLIST RÁPIDO

Marca cada paso al completarlo:

- [ ] Ejecuté el script SQL consolidado
- [ ] Vi el mensaje "CONFIGURACIÓN COMPLETADA"
- [ ] Verifiqué que hay 7 motivos en la tabla
- [ ] Reinicié el backend
- [ ] El backend responde en http://localhost:8080
- [ ] Abrí la aplicación web
- [ ] Fui a "Motivo Préstamo"
- [ ] Click en "Nuevo" abre el modal
- [ ] Puedo crear un motivo
- [ ] SweetAlert muestra confirmaciones
- [ ] Puedo editar un motivo
- [ ] Puedo eliminar un motivo
- [ ] La tabla se actualiza correctamente

---

## 🎉 ¡LISTO!

Si completaste todos los pasos del checklist, el sistema está funcionando correctamente.

---

## 📚 DOCUMENTACIÓN ADICIONAL

Si necesitas más información:

- **Inicio Rápido**: `INICIO_RAPIDO_MOTIVO_PRESTAMO.md`
- **Guía Completa**: `GUIA_COMPLETA_MOTIVO_PRESTAMO.md`
- **Resumen**: `RESUMEN_IMPLEMENTACION_MOTIVO_PRESTAMO.md`

---

## 🆘 AYUDA

Si tienes problemas:

1. Revisa los logs del backend
2. Abre la consola del navegador (F12)
3. Verifica que la tabla existe en SQL
4. Verifica que los procedimientos existen
5. Consulta la sección "Solución de Problemas" en `GUIA_COMPLETA_MOTIVO_PRESTAMO.md`

---

**Tiempo estimado total: 3-4 minutos**

¡Éxito! 🚀
