# 🚀 Inicio Rápido - Motivo Préstamo

## ⚡ 3 Pasos para Empezar

### 1️⃣ Ejecutar SQL (2 minutos)
```sql
-- Abre SQL Server Management Studio
-- Ejecuta este archivo:
sql/00_ejecutar_todo_motivo_prestamo.sql
```

### 2️⃣ Reiniciar Backend (1 minuto)
```bash
# Detén el backend si está corriendo
# Reinícialo (los archivos Java ya están creados)
```

### 3️⃣ Probar Frontend (1 minuto)
```
1. Inicia sesión en el sistema
2. Ve a "Motivo Préstamo" en el menú
3. Click en "Nuevo" → Ingresa descripción → Guardar
```

---

## 📋 Archivos Creados

### ✅ SQL (5 archivos)
- `sql/00_ejecutar_todo_motivo_prestamo.sql` ← **EJECUTAR ESTE**
- `sql/01_crear_tabla_motivo_prestamo.sql`
- `sql/02_insertar_datos_motivo_prestamo.sql`
- `sql/03_procedimientos_motivo_prestamo.sql`
- `sql/PRUEBA_RAPIDA_MOTIVO_PRESTAMO.sql`

### ✅ Backend Java (4 archivos)
- `backend/.../entity/MotivoPrestamo.java`
- `backend/.../repository/MotivoPrestamoRepository.java`
- `backend/.../service/MotivoPrestamoService.java`
- `backend/.../controller/MotivoPrestamoController.java`

### ✅ Frontend (2 archivos actualizados)
- `frontend/modules/motivo-prestamo.html`
- `frontend/js/modules/motivo-prestamo.js`

### ✅ Documentación (3 archivos)
- `GUIA_COMPLETA_MOTIVO_PRESTAMO.md` ← Guía detallada
- `sql/README_MOTIVO_PRESTAMO.md`
- `INICIO_RAPIDO_MOTIVO_PRESTAMO.md` ← Este archivo

### ✅ Pruebas (2 archivos)
- `sql/PRUEBA_RAPIDA_MOTIVO_PRESTAMO.sql`
- `frontend/test-motivo-prestamo.html`

---

## 🎯 Características Implementadas

### ✅ Modal Simplificado
- Diseño moderno y limpio
- Solo campo "Descripción"
- Botones grandes con iconos
- Colores: Cancelar (gris), Guardar (naranja #ffc107)

### ✅ SweetAlert2
- Confirmación al guardar
- Confirmación al cancelar (si hay cambios)
- Confirmación al eliminar
- Alertas de éxito/error elegantes

### ✅ Funcionalidades CRUD
- **Crear**: Estado = 1 automático
- **Editar**: Solo descripción
- **Eliminar**: Cambio de estado a 0 (lógico)
- **Listar**: Con filtros y paginación

### ✅ Multi-Empresa
- Cada motivo asociado a una empresa
- Usa empresaId del localStorage
- Validaciones por empresa

### ✅ Validaciones
- Frontend: Descripción mínimo 3 caracteres
- Backend: No duplicados por empresa
- Base de datos: Constraints y validaciones

---

## 🧪 Probar Rápidamente

### Opción 1: Desde SQL
```sql
-- Ejecutar:
sql/PRUEBA_RAPIDA_MOTIVO_PRESTAMO.sql
```

### Opción 2: Desde el Navegador
```
Abrir: frontend/test-motivo-prestamo.html
```

### Opción 3: Desde la Aplicación
```
1. Login → Dashboard
2. Menú → Motivo Préstamo
3. Probar funcionalidades
```

---

## 📊 Estructura de la Tabla

```
RRHH_MMOTIVOPRESTAMO
├── ID (autoincremental)
├── Descripción (VARCHAR 100)
├── Estado (1=Activo, 0=Inactivo)
├── EmpresaId (FK)
├── FechaCreacion
└── FechaModificacion
```

---

## 🔌 API Endpoints

```
GET    /api/motivos-prestamo?empresaId=1
GET    /api/motivos-prestamo/{id}?empresaId=1
POST   /api/motivos-prestamo
PUT    /api/motivos-prestamo/{id}?empresaId=1
DELETE /api/motivos-prestamo/{id}?empresaId=1
```

---

## 💡 Datos de Ejemplo

Al ejecutar el script SQL, se crean estos motivos:

1. Emergencia médica
2. Educación
3. Vivienda
4. Vehículo
5. Calamidad doméstica
6. Gastos personales
7. Consolidación de deudas

---

## ❓ Problemas Comunes

### "Tabla no existe"
```sql
-- Ejecutar:
sql/01_crear_tabla_motivo_prestamo.sql
```

### "Procedimiento no existe"
```sql
-- Ejecutar:
sql/03_procedimientos_motivo_prestamo.sql
```

### "SweetAlert no funciona"
```html
<!-- Verificar que esté incluido: -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### "empresaId es null"
```javascript
// En consola del navegador:
localStorage.setItem('empresaId', '1');
```

---

## 📞 Verificación Rápida

### 1. Verificar Base de Datos
```sql
SELECT * FROM RRHH_MMOTIVOPRESTAMO;
SELECT name FROM sys.procedures WHERE name LIKE '%MOTIVO_PRESTAMO%';
```

### 2. Verificar Backend
```bash
# Verificar que compile sin errores
mvn clean compile
```

### 3. Verificar Frontend
```
Abrir: frontend/test-motivo-prestamo.html
Click en "Listar Motivos"
```

---

## ✅ Checklist

- [ ] Ejecutar script SQL consolidado
- [ ] Verificar tabla creada
- [ ] Verificar procedimientos creados
- [ ] Verificar datos de ejemplo
- [ ] Reiniciar backend
- [ ] Probar listar motivos
- [ ] Probar crear motivo
- [ ] Probar editar motivo
- [ ] Probar eliminar motivo
- [ ] Verificar SweetAlert funciona
- [ ] Verificar validaciones

---

## 🎉 ¡Listo!

Si completaste los 3 pasos iniciales, el sistema ya está funcionando.

Para más detalles, consulta: `GUIA_COMPLETA_MOTIVO_PRESTAMO.md`

---

## 📝 Notas Finales

- **Eliminación**: Es lógica (estado=0), no física
- **Empresa**: Se obtiene del localStorage del usuario
- **Estado**: Se crea automáticamente en 1 (activo)
- **Validaciones**: Previenen duplicados por empresa
- **SweetAlert**: Todas las acciones tienen confirmación

---

**¿Necesitas ayuda?** Revisa `GUIA_COMPLETA_MOTIVO_PRESTAMO.md` para documentación detallada.
