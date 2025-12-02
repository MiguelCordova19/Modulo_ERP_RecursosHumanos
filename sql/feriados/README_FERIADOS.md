# 📅 Sistema de Feriados - Guía Completa

## 🚀 Instalación Rápida

### 1. Ejecutar Script SQL
```bash
psql -U tu_usuario -d tu_base_de_datos -f sql/feriados/00_ejecutar_todo_feriados.sql
```

O desde psql:
```sql
\i sql/feriados/00_ejecutar_todo_feriados.sql
```

### 2. Reiniciar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Probar en la Aplicación
1. Login en el sistema
2. Ir a "Feriados" en el menú
3. Click en "Nuevo"
4. Seleccionar fecha → El día se calcula automáticamente
5. Ingresar denominación
6. Guardar

---

## 📋 Características

### ✅ Modal Inteligente
- **Fecha**: Selector de fecha (date picker)
- **Día**: Se calcula automáticamente al seleccionar la fecha (readonly)
- **Denominación**: Campo de texto para el nombre del feriado

### ✅ Cálculo Automático del Día
Cuando seleccionas una fecha, el sistema automáticamente calcula y muestra el día de la semana:
- 2025-01-01 → "Miércoles"
- 2025-12-25 → "Jueves"

### ✅ Validaciones
- Fecha requerida
- Denominación requerida (mínimo 3 caracteres)
- No permite duplicar feriados en la misma fecha
- Validación por empresa

### ✅ Funcionalidades CRUD
- **Crear**: Agregar nuevos feriados
- **Listar**: Ver todos los feriados activos
- **Editar**: Modificar fecha y denominación
- **Eliminar**: Cambio de estado a inactivo (lógico)

---

## 🗄️ Estructura de la Tabla

```sql
rrhh_mferiados
├── imferiado_id (PK, SERIAL)
├── ff_fechaferiado (DATE, NOT NULL)
├── tf_diaferiado (VARCHAR(50), NOT NULL)
├── tf_denominacion (VARCHAR(200), NOT NULL)
├── if_estado (INT, DEFAULT 1)
├── imempresa_id (FK, INT, NOT NULL)
├── dtf_fechacreacion (TIMESTAMP)
└── dtf_fechamodificacion (TIMESTAMP)
```

---

## 🔌 API REST Endpoints

```
GET    /api/feriados?empresaId=1          (Listar)
GET    /api/feriados/{id}?empresaId=1     (Obtener)
POST   /api/feriados                      (Crear)
PUT    /api/feriados/{id}?empresaId=1     (Actualizar)
DELETE /api/feriados/{id}?empresaId=1     (Eliminar)
```

---

## 💡 Datos de Ejemplo (Perú 2025)

Al ejecutar el script, se insertan estos feriados:

1. 01/01/2025 - Miércoles - Año Nuevo
2. 17/04/2025 - Jueves - Jueves Santo
3. 18/04/2025 - Viernes - Viernes Santo
4. 01/05/2025 - Jueves - Día del Trabajador
5. 29/06/2025 - Domingo - Día de San Pedro y San Pablo
6. 28/07/2025 - Lunes - Fiestas Patrias
7. 29/07/2025 - Martes - Fiestas Patrias
8. 30/08/2025 - Sábado - Santa Rosa de Lima
9. 08/10/2025 - Miércoles - Combate de Angamos
10. 01/11/2025 - Sábado - Todos los Santos
11. 08/12/2025 - Lunes - Inmaculada Concepción
12. 25/12/2025 - Jueves - Navidad

---

## 🧪 Probar el Sistema

### Desde PostgreSQL
```sql
-- Ver todos los feriados
SELECT * FROM rrhh_mferiados;

-- Listar feriados activos
SELECT * FROM sp_listar_feriados(1);

-- Crear un feriado
SELECT * FROM sp_crear_feriado('2025-06-24', 'Martes', 'Día del Campesino', 1);
```

### Desde la Aplicación
1. Ir a Feriados
2. Click en "Nuevo"
3. Seleccionar fecha: 24/06/2025
4. El día se muestra automáticamente: "Martes"
5. Ingresar denominación: "Día del Campesino"
6. Click en "Guardar"

---

## 🎨 Características del Frontend

### Cálculo Automático del Día
```javascript
// Al cambiar la fecha
$('#feriadoFecha').on('change', function() {
    const fecha = new Date(this.value + 'T00:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemana = dias[fecha.getDay()];
    $('#feriadoDia').val(diaSemana);
});
```

### Formato de Fecha en la Tabla
- Entrada: `2025-01-01`
- Salida: `01/01/2025`

---

## 📝 Archivos Creados

### Backend (Java)
```
backend/src/main/java/com/meridian/erp/
├── entity/Feriado.java
├── repository/FeriadoRepository.java
├── service/FeriadoService.java
└── controller/FeriadoController.java
```

### Frontend
```
frontend/
├── modules/feriados.html
└── js/modules/feriados.js
```

### SQL
```
sql/feriados/
├── 00_ejecutar_todo_feriados.sql
├── 01_crear_tabla_feriados.sql
├── 02_insertar_datos_feriados.sql
├── 03_funciones_feriados.sql
└── README_FERIADOS.md
```

---

## ✅ Checklist de Verificación

- [ ] Ejecuté el script SQL consolidado
- [ ] Vi 12 feriados de ejemplo en la tabla
- [ ] Reinicié el backend
- [ ] El backend responde en http://localhost:8080
- [ ] Puedo abrir el modal "Agregar Feriado"
- [ ] Al seleccionar una fecha, el día se calcula automáticamente
- [ ] Puedo crear un feriado
- [ ] Puedo editar un feriado
- [ ] Puedo eliminar un feriado
- [ ] La tabla se actualiza correctamente

---

## 🎉 ¡Listo!

El sistema de Feriados está completamente configurado con:
- ✅ Cálculo automático del día de la semana
- ✅ Modal simplificado y elegante
- ✅ Validaciones completas
- ✅ SweetAlert2 para confirmaciones
- ✅ Soporte multi-empresa
- ✅ Eliminación lógica

**¡Disfruta del sistema!** 🚀
