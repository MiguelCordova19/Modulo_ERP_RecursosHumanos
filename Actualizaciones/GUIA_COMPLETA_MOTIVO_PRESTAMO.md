# 📋 Guía Completa: Sistema de Motivo Préstamo

## 🎯 Resumen

Sistema completo CRUD para gestionar motivos de préstamos con:
- ✅ Modal simplificado con diseño moderno
- ✅ SweetAlert2 para confirmaciones elegantes
- ✅ Soporte multi-empresa
- ✅ Eliminación lógica (cambio de estado)
- ✅ Validaciones completas
- ✅ API REST completa

---

## 📁 Archivos Creados

### SQL (Base de Datos)
```
sql/
├── 00_ejecutar_todo_motivo_prestamo.sql    ← EJECUTAR ESTE (Todo en uno)
├── 01_crear_tabla_motivo_prestamo.sql      
├── 02_insertar_datos_motivo_prestamo.sql   
├── 03_procedimientos_motivo_prestamo.sql   
└── README_MOTIVO_PRESTAMO.md               
```

### Backend (Java Spring Boot)
```
backend/src/main/java/com/meridian/erp/
├── entity/MotivoPrestamo.java              ← Entidad JPA
├── repository/MotivoPrestamoRepository.java ← Repositorio
├── service/MotivoPrestamoService.java      ← Lógica de negocio
└── controller/MotivoPrestamoController.java ← API REST
```

### Frontend (HTML/JS)
```
frontend/
├── modules/motivo-prestamo.html            ← Vista actualizada
└── js/modules/motivo-prestamo.js           ← Lógica actualizada
```

---

## 🚀 Pasos de Instalación

### 1️⃣ Ejecutar Script SQL

Abre SQL Server Management Studio y ejecuta:

```sql
-- Opción A: Script consolidado (RECOMENDADO)
sql/00_ejecutar_todo_motivo_prestamo.sql

-- Opción B: Scripts individuales (en orden)
sql/01_crear_tabla_motivo_prestamo.sql
sql/02_insertar_datos_motivo_prestamo.sql
sql/03_procedimientos_motivo_prestamo.sql
```

### 2️⃣ Verificar Base de Datos

```sql
-- Verificar tabla
SELECT * FROM RRHH_MMOTIVOPRESTAMO;

-- Verificar procedimientos
SELECT name FROM sys.procedures WHERE name LIKE '%MOTIVO_PRESTAMO%';

-- Probar listar
EXEC SP_LISTAR_MOTIVOS_PRESTAMO @EmpresaId = 1;
```

### 3️⃣ Compilar Backend

Los archivos Java ya están creados. Si el backend está corriendo, reinícialo:

```bash
# En la carpeta backend
mvn clean install
mvn spring-boot:run
```

### 4️⃣ Probar Frontend

1. Inicia sesión en el sistema
2. Navega a "Motivo Préstamo" en el menú
3. Prueba las funcionalidades:
   - Click en "Nuevo" → Ingresa descripción → Guardar
   - Click en "Editar" → Modifica → Guardar
   - Click en "Eliminar" → Confirmar
   - Click en "Actualizar" → Recarga tabla

---

## 🗄️ Estructura de la Tabla

```sql
RRHH_MMOTIVOPRESTAMO
├── iMMMotivoPrestamo_Id (PK, INT, IDENTITY)
├── tMP_Descripcion (VARCHAR(100), NOT NULL)
├── iMP_Estado (INT, DEFAULT 1)
├── iEmpresa_Id (FK, INT, NOT NULL)
├── dtMP_FechaCreacion (DATETIME)
└── dtMP_FechaModificacion (DATETIME)
```

---

## 🔌 API REST Endpoints

### Listar Motivos
```http
GET /api/motivos-prestamo?empresaId=1
```

### Obtener por ID
```http
GET /api/motivos-prestamo/{id}?empresaId=1
```

### Crear Motivo
```http
POST /api/motivos-prestamo
Content-Type: application/json

{
  "descripcion": "Emergencia médica",
  "empresaId": 1
}
```

### Actualizar Motivo
```http
PUT /api/motivos-prestamo/{id}?empresaId=1
Content-Type: application/json

{
  "descripcion": "Emergencia médica actualizada"
}
```

### Eliminar Motivo (Cambiar estado a 0)
```http
DELETE /api/motivos-prestamo/{id}?empresaId=1
```

---

## 🎨 Características del Modal

### Diseño
- ✅ Modal centrado y redondeado
- ✅ Título simple: "Motivo"
- ✅ Campo único: Descripción
- ✅ Botones grandes con iconos
- ✅ Botón Cancelar: Gris con borde
- ✅ Botón Guardar: Naranja/Amarillo (#ffc107)

### Confirmaciones con SweetAlert2
- ✅ Confirmar al guardar
- ✅ Confirmar al cancelar (si hay cambios)
- ✅ Confirmar al eliminar
- ✅ Alertas de éxito/error
- ✅ Validaciones en tiempo real

---

## 📝 Funcionalidades

### Crear Motivo
1. Click en botón "Nuevo"
2. Se abre modal con título "Motivo"
3. Ingresa descripción (mínimo 3 caracteres)
4. Click en "Guardar"
5. Confirma con SweetAlert
6. Se crea con estado = 1 automáticamente
7. Se asocia a la empresa del usuario logueado

### Editar Motivo
1. Click en botón "Editar" (icono lápiz)
2. Se carga la descripción actual
3. Modifica la descripción
4. Click en "Guardar"
5. Confirma con SweetAlert
6. Se actualiza y registra fecha de modificación

### Eliminar Motivo
1. Click en botón "Eliminar" (icono basura)
2. Confirma con SweetAlert (advertencia)
3. Cambia estado a 0 (eliminación lógica)
4. Se oculta de la lista (filtrado por estado)

### Cancelar
1. Click en botón "Cancelar"
2. Si hay cambios, pide confirmación
3. Si no hay cambios, cierra directamente

---

## 🔒 Validaciones

### Frontend
- ✅ Descripción requerida
- ✅ Mínimo 3 caracteres
- ✅ Confirmación antes de guardar
- ✅ Confirmación antes de eliminar
- ✅ Confirmación al cancelar con cambios

### Backend
- ✅ Descripción no vacía
- ✅ Empresa debe existir
- ✅ No duplicados por empresa (activos)
- ✅ Motivo debe pertenecer a la empresa
- ✅ Transacciones con rollback

### Base de Datos
- ✅ Constraints de FK
- ✅ Validaciones en procedimientos
- ✅ Manejo de errores con TRY/CATCH
- ✅ Índices para optimización

---

## 🎯 Datos de Ejemplo

Al ejecutar el script, se insertan estos motivos:

1. Emergencia médica
2. Educación
3. Vivienda
4. Vehículo
5. Calamidad doméstica
6. Gastos personales
7. Consolidación de deudas

---

## 🧪 Pruebas

### Probar Crear
```javascript
// En la consola del navegador
fetch('/api/motivos-prestamo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    descripcion: 'Prueba desde consola',
    empresaId: 1
  })
}).then(r => r.json()).then(console.log);
```

### Probar Listar
```javascript
fetch('/api/motivos-prestamo?empresaId=1')
  .then(r => r.json())
  .then(console.log);
```

### Probar Actualizar
```javascript
fetch('/api/motivos-prestamo/1?empresaId=1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    descripcion: 'Descripción actualizada'
  })
}).then(r => r.json()).then(console.log);
```

### Probar Eliminar
```javascript
fetch('/api/motivos-prestamo/1?empresaId=1', {
  method: 'DELETE'
}).then(r => r.json()).then(console.log);
```

---

## 🐛 Solución de Problemas

### Error: "Tabla no existe"
```sql
-- Verificar que la tabla existe
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'RRHH_MMOTIVOPRESTAMO';

-- Si no existe, ejecutar:
sql/01_crear_tabla_motivo_prestamo.sql
```

### Error: "Procedimiento no existe"
```sql
-- Verificar procedimientos
SELECT name FROM sys.procedures 
WHERE name LIKE '%MOTIVO_PRESTAMO%';

-- Si no existen, ejecutar:
sql/03_procedimientos_motivo_prestamo.sql
```

### Error: "No se puede conectar al backend"
```bash
# Verificar que el backend esté corriendo
# Puerto por defecto: 8080
curl http://localhost:8080/api/motivos-prestamo?empresaId=1
```

### Error: "SweetAlert no está definido"
```html
<!-- Verificar que esté incluido en motivo-prestamo.html -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### Error: "empresaId es null"
```javascript
// Verificar localStorage
console.log(localStorage.getItem('empresaId'));

// Si es null, establecer manualmente
localStorage.setItem('empresaId', '1');
```

---

## 📊 Diagrama de Flujo

```
Usuario → Click "Nuevo"
    ↓
Modal se abre
    ↓
Ingresa descripción
    ↓
Click "Guardar"
    ↓
SweetAlert: ¿Confirmar?
    ↓
[Sí] → Validar frontend
    ↓
Enviar POST al backend
    ↓
Backend valida
    ↓
Ejecuta SP_CREAR_MOTIVO_PRESTAMO
    ↓
Inserta en BD (estado=1)
    ↓
Retorna motivo creado
    ↓
SweetAlert: ¡Éxito!
    ↓
Cierra modal
    ↓
Recarga tabla
```

---

## ✅ Checklist de Implementación

- [x] Crear tabla en BD
- [x] Crear procedimientos almacenados
- [x] Insertar datos de ejemplo
- [x] Crear Entity (MotivoPrestamo.java)
- [x] Crear Repository (MotivoPrestamoRepository.java)
- [x] Crear Service (MotivoPrestamoService.java)
- [x] Crear Controller (MotivoPrestamoController.java)
- [x] Actualizar HTML con modal simplificado
- [x] Integrar SweetAlert2
- [x] Actualizar JavaScript con confirmaciones
- [x] Agregar validaciones frontend
- [x] Agregar validaciones backend
- [x] Agregar soporte multi-empresa
- [x] Implementar eliminación lógica
- [x] Crear documentación

---

## 🎉 ¡Listo!

El sistema de Motivo Préstamo está completamente configurado y listo para usar.

### Próximos Pasos Sugeridos:
1. Ejecutar el script SQL consolidado
2. Reiniciar el backend
3. Probar todas las funcionalidades
4. Ajustar estilos CSS si es necesario
5. Agregar más validaciones según necesidades

---

## 📞 Soporte

Si tienes algún problema:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs del backend
3. Revisa la consola del navegador (F12)
4. Verifica que todos los archivos estén en su lugar
