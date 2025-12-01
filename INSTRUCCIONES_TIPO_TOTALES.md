# 📋 Implementación de Tipo Totales

## 🎯 Resumen
Se ha implementado el módulo de **Tipos de Totales** para el sistema de planillas, incluyendo:
- Tabla en PostgreSQL
- Backend (Spring Boot)
- Frontend (Select dinámico en modal de Conceptos)

---

## 📦 1. Base de Datos

### Ejecutar Script SQL
Ejecuta el siguiente archivo en PostgreSQL:
```bash
sql/crear_tabla_tipo_totales.sql
```

Este script crea:
- ✅ Tabla `rrhh_mtipototales`
- ✅ 7 tipos de totales:
  - 01 - Apoyo Bono
  - 02 - Trabajo Dia Feriado
  - 03 - Tardanza
  - 04 - Falta Sin Goce
  - 05 - Falta Con Goce
  - 06 - Comisiones AFP
  - 07 - Vacaciones

### Verificar datos
```sql
SELECT * FROM rrhh_mtipototales ORDER BY imtipototales_id;
```

---

## 🔧 2. Backend (Spring Boot)

### Archivos creados:
```
backend/src/main/java/com/meridian/erp/
├── entity/TipoTotales.java
├── repository/TipoTotalesRepository.java
├── service/TipoTotalesService.java
└── controller/TipoTotalesController.java
```

### Endpoints disponibles:

#### 1. Listar tipos activos
```http
GET http://localhost:3000/api/tipos-totales
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tipos de totales obtenidos exitosamente",
  "data": [
    {
      "id": "01",
      "descripcion": "Apoyo Bono",
      "estado": 1,
      "fechaCreacion": "2025-11-30T...",
      "fechaModificacion": "2025-11-30T..."
    },
    ...
  ]
}
```

#### 2. Listar todos (activos e inactivos)
```http
GET http://localhost:3000/api/tipos-totales/todos
```

#### 3. Obtener por ID
```http
GET http://localhost:3000/api/tipos-totales/01
```

---

## 🎨 3. Frontend

### Archivos modificados:
- `frontend/modules/concepto.html` - Campo "Tipo" convertido a select
- `frontend/js/modules/concepto.js` - Función `cargarTiposTotales()`

### Modal "Nuevo Conceptos"
Ahora tiene **2 combobox dinámicos**:

1. **Tipo Concepto** (carga desde `rrhh_mtipoconcepto`):
   - INGRESOS
   - DESCUENTOS
   - APORTES DEL TRABAJADOR
   - APORTES DEL EMPLEADOR
   - TOTALES

2. **Tipo** (carga desde `rrhh_mtipototales`):
   - Apoyo Bono
   - Trabajo Dia Feriado
   - Tardanza
   - Falta Sin Goce
   - Falta Con Goce
   - Comisiones AFP
   - Vacaciones

Ambos se cargan **en paralelo** al abrir el modal para mejor rendimiento.

---

## 🧪 4. Pruebas

### Paso 1: Ejecutar scripts SQL
```sql
-- Ejecutar en orden:
1. sql/crear_tabla_tipo_concepto.sql
2. sql/crear_tabla_tipo_totales.sql
```

### Paso 2: Verificar Backend
```bash
# Reiniciar el backend
cd backend
mvn spring-boot:run
```

### Paso 3: Probar endpoints
```bash
# Tipos de Concepto
http://localhost:3000/api/tipos-concepto

# Tipos de Totales
http://localhost:3000/api/tipos-totales
```

### Paso 4: Probar Frontend
1. Inicia sesión en el sistema
2. Ve al módulo **"Conceptos"**
3. Presiona el botón **"Nuevo"**
4. Verifica que ambos combobox se llenen automáticamente:
   - ✅ Tipo Concepto (5 opciones)
   - ✅ Tipo (7 opciones)

---

## 📊 Estructura de las Tablas

### rrhh_mtipoconcepto
```sql
imtipoconcepto | ttc_descripcion
01             | INGRESOS
02             | DESCUENTOS
03             | APORTES DEL TRABAJADOR
04             | APORTES DEL EMPLEADOR
05             | TOTALES
```

### rrhh_mtipototales
```sql
imtipototales_id | ttt_descripcion
01               | Apoyo Bono
02               | Trabajo Dia Feriado
03               | Tardanza
04               | Falta Sin Goce
05               | Falta Con Goce
06               | Comisiones AFP
07               | Vacaciones
```

---

## 🔄 Flujo de Carga

```
Usuario presiona "Nuevo"
    ↓
Modal se abre
    ↓
Se ejecutan en paralelo:
    ├─→ cargarTiposConcepto() → /api/tipos-concepto
    └─→ cargarTiposTotales() → /api/tipos-totales
    ↓
Ambos combobox se llenan
    ↓
Usuario puede seleccionar opciones
```

---

## ✅ Checklist de Implementación

### Base de Datos
- [x] Script SQL tipo_concepto creado
- [x] Script SQL tipo_totales creado
- [ ] Ejecutar script tipo_concepto en PostgreSQL
- [ ] Ejecutar script tipo_totales en PostgreSQL

### Backend
- [x] Entidad TipoConcepto
- [x] Repository TipoConcepto
- [x] Service TipoConcepto
- [x] Controller TipoConcepto
- [x] Entidad TipoTotales
- [x] Repository TipoTotales
- [x] Service TipoTotales
- [x] Controller TipoTotales
- [ ] Reiniciar backend

### Frontend
- [x] Modal actualizado con 2 selects
- [x] Función cargarTiposConcepto()
- [x] Función cargarTiposTotales()
- [x] Carga en paralelo implementada

### Pruebas
- [ ] Probar endpoint /api/tipos-concepto
- [ ] Probar endpoint /api/tipos-totales
- [ ] Probar modal en frontend
- [ ] Verificar que ambos combobox se llenen

---

## 🚀 Comandos Rápidos

```bash
# 1. Ejecutar scripts SQL (en PostgreSQL)
psql -U tu_usuario -d tu_base_datos -f sql/crear_tabla_tipo_concepto.sql
psql -U tu_usuario -d tu_base_datos -f sql/crear_tabla_tipo_totales.sql

# 2. Reiniciar backend
cd backend
mvn spring-boot:run

# 3. Probar endpoints
curl http://localhost:3000/api/tipos-concepto
curl http://localhost:3000/api/tipos-totales
```

---

**¡Todo listo para usar!** 🎉
