# 🎯 Sistema Completo de Conceptos de Planilla

## 📋 Resumen
Sistema completo para gestionar conceptos de planilla con tributos SUNAT, tipos de concepto y tipos de totales.

---

## 🗂️ Estructura de Tablas

### 1. rrhh_mconceptos (Principal)
```sql
- imconceptos_id (BIGSERIAL PK) - ID autoincremental
- ic_tributos (INT) - FK a rrhh_mtributos
- ic_tipoconcepto (INT) - FK a rrhh_mtipoconcepto
- ic_afecto (INT) - 1=SI, 0=NO
- ic_tipototales (INT) - FK a rrhh_mtipototales
- ic_empresa (INT) - ID de la empresa
- ic_estado (INT) - 1=Activo, 0=Inactivo
- ic_usuarioregistro (BIGINT) - Usuario que creó
- fc_fecharegistro (TIMESTAMP) - Fecha de creación
- ic_usuarioedito (BIGINT) - Usuario que editó
- fc_fechaedito (TIMESTAMP) - Fecha de edición
- ic_usuarioelimino (BIGINT) - Usuario que eliminó
- fc_fechaelimino (TIMESTAMP) - Fecha de eliminación
```

### 2. rrhh_mtributos (185 registros)
```sql
- imtributos_id (VARCHAR(3) PK)
- it_tid (VARCHAR(2)) - Tipo de tributo
- tt_codsunat (VARCHAR(10)) - Código SUNAT
- tt_descripcion (VARCHAR(200)) - Descripción
```

### 3. rrhh_mtipoconcepto (5 registros)
```sql
- imtipoconcepto (VARCHAR(2) PK)
- ttc_descripcion (VARCHAR(100))
```

### 4. rrhh_mtipototales (7 registros)
```sql
- imtipototales_id (VARCHAR(2) PK)
- ttt_descripcion (VARCHAR(100))
```

---

## 🚀 Pasos de Implementación

### 1. Ejecutar Scripts SQL

```bash
# En PostgreSQL, ejecutar en orden:
\i sql/crear_tabla_tipo_concepto.sql
\i sql/crear_tabla_tipo_totales.sql
\i sql/crear_tabla_tributos_parte1.sql
\i sql/crear_tabla_tributos_parte2.sql
\i sql/crear_tabla_tributos_parte3.sql
\i sql/crear_tabla_tributos_parte4.sql
\i sql/crear_tabla_tributos_parte5.sql
\i sql/crear_tabla_tributos_parte6.sql
\i sql/crear_tabla_tributos_parte7.sql
\i sql/crear_tabla_tributos_parte8_final.sql
\i sql/crear_tabla_conceptos.sql
```

### 2. Verificar Datos

```sql
-- Verificar tipos de concepto (debe retornar 5)
SELECT COUNT(*) FROM rrhh_mtipoconcepto;

-- Verificar tipos de totales (debe retornar 7)
SELECT COUNT(*) FROM rrhh_mtipototales;

-- Verificar tributos (debe retornar 185)
SELECT COUNT(*) FROM rrhh_mtributos;

-- Verificar tabla conceptos
SELECT * FROM rrhh_mconceptos LIMIT 5;
```

### 3. Reiniciar Backend

```bash
cd backend
mvn spring-boot:run
```

---

## 🎨 Funcionalidades del Frontend

### Modal "Nuevo Conceptos"

#### Campos:
1. **Tipo Concepto** (Select)
   - Carga desde: `rrhh_mtipoconcepto`
   - Endpoint: `/api/tipos-concepto`
   - Opciones: INGRESOS, DESCUENTOS, APORTES DEL TRABAJADOR, etc.

2. **Nombre Tributo** (Autocomplete)
   - Busca en: `rrhh_mtributos`
   - Endpoint: `/api/tributos/buscar?q=texto`
   - Búsqueda por: Código SUNAT o Descripción
   - Muestra: `CODIGO - DESCRIPCION`

3. **Descripción** (Input text)
   - Campo informativo (no se guarda actualmente)

4. **Afecto** (Radio buttons)
   - Opciones: Sí (1) / No (0)

5. **Tipo** (Select)
   - Carga desde: `rrhh_mtipototales`
   - Endpoint: `/api/tipos-totales`
   - Opciones: Apoyo Bono, Tardanza, Vacaciones, etc.

---

## 🔧 Endpoints del Backend

### Conceptos

#### 1. Listar conceptos por empresa
```http
GET /api/conceptos?empresaId=1
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Conceptos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "tributoId": 1,
      "tipoConceptoId": 1,
      "afecto": 1,
      "tipoTotalesId": 1,
      "empresaId": 1,
      "estado": 1,
      "tributoCodigoSunat": "0101",
      "tributoDescripcion": "ALIMENTACION PRINCIPAL EN DINERO",
      "tipoConceptoDescripcion": "INGRESOS",
      "tipoTotalesDescripcion": "Apoyo Bono"
    }
  ]
}
```

#### 2. Crear concepto
```http
POST /api/conceptos?usuarioId=1
Content-Type: application/json

{
  "tributoId": 1,
  "tipoConceptoId": 1,
  "afecto": 1,
  "tipoTotalesId": 1,
  "empresaId": 1
}
```

#### 3. Actualizar concepto
```http
PUT /api/conceptos/1?usuarioId=1
Content-Type: application/json

{
  "tributoId": 2,
  "tipoConceptoId": 1,
  "afecto": 0,
  "tipoTotalesId": 2,
  "empresaId": 1
}
```

#### 4. Eliminar concepto (soft delete)
```http
DELETE /api/conceptos/1?usuarioId=1
```

### Tributos

#### 1. Buscar tributos (Autocomplete)
```http
GET /api/tributos/buscar?q=vacacion
```

#### 2. Listar tributos activos
```http
GET /api/tributos
```

#### 3. Listar tributos por tipo
```http
GET /api/tributos/tipo/01
```

### Tipos de Concepto

```http
GET /api/tipos-concepto
```

### Tipos de Totales

```http
GET /api/tipos-totales
```

---

## 💾 Flujo de Guardado

### 1. Usuario llena el formulario:
```
- Tipo Concepto: "01 - INGRESOS"
- Nombre Tributo: "0101 - ALIMENTACION PRINCIPAL EN DINERO"
- Afecto: Sí
- Tipo: "01 - Apoyo Bono"
```

### 2. JavaScript prepara los datos:
```javascript
{
  tributoId: 1,
  tipoConceptoId: 1,
  afecto: 1,
  tipoTotalesId: 1,
  empresaId: 1  // Del localStorage
}
```

### 3. Backend guarda en la BD:
```sql
INSERT INTO rrhh_mconceptos (
  ic_tributos, 
  ic_tipoconcepto, 
  ic_afecto, 
  ic_tipototales, 
  ic_empresa,
  ic_estado,
  ic_usuarioregistro,
  fc_fecharegistro
) VALUES (1, 1, 1, 1, 1, 1, 1, NOW());
```

### 4. Tabla se actualiza automáticamente

---

## 📊 Tabla de Conceptos

### Columnas mostradas:
1. **#** - ID del concepto
2. **Descripción** - Descripción del tributo
3. **Concepto Plame** - Código SUNAT del tributo
4. **Tipo** - Tipo de concepto (badge con color)
5. **Afecto** - SI/NO (badge con color)
6. **Acciones** - Editar / Eliminar

---

## 🧪 Pruebas

### 1. Probar Autocomplete de Tributos
```
1. Abrir modal "Nuevo"
2. En "Nombre Tributo" escribir: "vaca"
3. Debe mostrar:
   - 0114 - VACACIONES TRUNCAS
   - 0118 - REMUNERACION VACACIONAL
   - 0210 - ASIGNACION VACACIONAL
4. Seleccionar una opción
5. Verificar que se muestre completo
```

### 2. Probar Guardado
```
1. Llenar todos los campos
2. Click en "Guardar"
3. Verificar notificación de éxito
4. Verificar que aparezca en la tabla
```

### 3. Probar Edición
```
1. Click en botón "Editar" de un concepto
2. Modificar campos
3. Guardar
4. Verificar cambios en la tabla
```

### 4. Probar Eliminación
```
1. Click en botón "Eliminar"
2. Confirmar
3. Verificar que desaparezca de la tabla
4. En BD verificar que ic_estado = 0
```

---

## 🔍 Validaciones

### Frontend:
- ✅ Tributo seleccionado (no vacío)
- ✅ Tipo de concepto seleccionado
- ✅ Afecto seleccionado (Sí o No)
- ✅ Tipo de totales seleccionado
- ✅ Empresa ID presente
- ✅ Usuario ID presente

### Backend:
- ✅ Campos requeridos no nulos
- ✅ IDs válidos
- ✅ Usuario autenticado

---

## 📁 Archivos Creados

### Backend (8 archivos):
```
backend/src/main/java/com/meridian/erp/
├── entity/
│   ├── Concepto.java
│   ├── Tributo.java
│   ├── TipoConcepto.java
│   └── TipoTotales.java
├── repository/
│   ├── ConceptoRepository.java
│   ├── TributoRepository.java
│   ├── TipoConceptoRepository.java
│   └── TipoTotalesRepository.java
├── service/
│   ├── ConceptoService.java
│   ├── TributoService.java
│   ├── TipoConceptoService.java
│   └── TipoTotalesService.java
└── controller/
    ├── ConceptoController.java
    ├── TributoController.java
    ├── TipoConceptoController.java
    └── TipoTotalesController.java
```

### Frontend (2 archivos):
```
frontend/
├── modules/concepto.html (actualizado)
└── js/modules/concepto.js (actualizado)
```

### SQL (11 archivos):
```
sql/
├── crear_tabla_tipo_concepto.sql
├── crear_tabla_tipo_totales.sql
├── crear_tabla_tributos_parte1.sql
├── crear_tabla_tributos_parte2.sql
├── crear_tabla_tributos_parte3.sql
├── crear_tabla_tributos_parte4.sql
├── crear_tabla_tributos_parte5.sql
├── crear_tabla_tributos_parte6.sql
├── crear_tabla_tributos_parte7.sql
├── crear_tabla_tributos_parte8_final.sql
└── crear_tabla_conceptos.sql
```

---

## 🐛 Solución de Problemas

### No se cargan los conceptos:
1. Verificar que `empresa_id` esté en localStorage
2. Abrir consola del navegador (F12)
3. Verificar endpoint: `http://localhost:3000/api/conceptos?empresaId=1`

### No se guardan los conceptos:
1. Verificar que todos los campos estén llenos
2. Verificar que `usuario_id` esté en localStorage
3. Revisar consola del navegador para errores

### Autocomplete no funciona:
1. Verificar endpoint: `http://localhost:3000/api/tributos/buscar?q=test`
2. Verificar que la tabla `rrhh_mtributos` tenga datos
3. Revisar consola del navegador

---

## ✅ Checklist Final

- [ ] Ejecutar todos los scripts SQL
- [ ] Verificar 185 tributos en BD
- [ ] Verificar 5 tipos de concepto en BD
- [ ] Verificar 7 tipos de totales en BD
- [ ] Reiniciar backend
- [ ] Probar autocomplete de tributos
- [ ] Probar guardado de concepto
- [ ] Probar edición de concepto
- [ ] Probar eliminación de concepto
- [ ] Verificar que la tabla se actualice

---

**¡Sistema de Conceptos Completo!** 🎉

Total de registros maestros:
- **185 tributos SUNAT**
- **5 tipos de concepto**
- **7 tipos de totales**
- **Conceptos ilimitados por empresa**
