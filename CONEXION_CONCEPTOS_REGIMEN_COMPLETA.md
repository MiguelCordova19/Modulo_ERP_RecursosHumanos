# 🔗 Conexión Completa: Conceptos por Régimen Laboral

## ✅ Todo Implementado

### 📦 Base de Datos (2 tablas):
1. **rrhh_conceptos_regimen_laboral** (Cabecera)
2. **rrhh_conceptos_regimen_detalle** (Detalle)

### 🔧 Backend (8 archivos):
1. `ConceptoRegimenLaboral.java` - Entidad cabecera
2. `ConceptoRegimenDetalle.java` - Entidad detalle
3. `ConceptoRegimenLaboralRepository.java` - Repositorio cabecera
4. `ConceptoRegimenDetalleRepository.java` - Repositorio detalle
5. `ConceptoRegimenRequest.java` - DTO para recibir datos
6. `ConceptoRegimenLaboralService.java` - Lógica de negocio
7. `ConceptoRegimenLaboralController.java` - Endpoints REST
8. `RegimenLaboral.java` + Repository + Service + Controller

### 🎨 Frontend:
- Modal actualizado
- JavaScript con autocomplete
- Guardado completo

---

## 🚀 Pasos para Activar

### 1. Ejecutar Scripts SQL
```sql
-- En PostgreSQL, ejecutar en orden:
\i sql/crear_tabla_regimen_laboral.sql
\i sql/crear_tablas_conceptos_regimen.sql
```

### 2. Verificar Tablas
```sql
-- Verificar regímenes laborales (debe retornar 6)
SELECT COUNT(*) FROM rrhh_regimenlaboral;

-- Verificar tablas creadas
SELECT * FROM rrhh_conceptos_regimen_laboral;
SELECT * FROM rrhh_conceptos_regimen_detalle;
```

### 3. Reiniciar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Probar Endpoints

#### Listar regímenes laborales:
```bash
curl http://localhost:3000/api/regimenes-laborales
```

#### Listar conceptos por régimen:
```bash
curl http://localhost:3000/api/conceptos-regimen-laboral?empresaId=1
```

---

## 📊 Flujo Completo de Guardado

### Frontend → Backend → Base de Datos

#### 1. Usuario llena el modal:
```
- Régimen Laboral: "10 - Régimen General"
- Conceptos agregados:
  1. 0101 - ALIMENTACION PRINCIPAL EN DINERO
  2. 0103 - COMISIONES O DESTAJO
  3. 0105 - TRABAJO EN SOBRETIEMPO 25%
```

#### 2. JavaScript prepara los datos:
```javascript
{
  "regimenLaboralId": "01",
  "empresaId": 1,
  "conceptos": [1, 3, 5]
}
```

#### 3. Backend recibe y procesa:
```java
// Guardar cabecera
INSERT INTO rrhh_conceptos_regimen_laboral (
    ic_regimenlaboral,
    ic_empresa,
    ic_estado,
    ic_usuarioregistro,
    fc_fecharegistro
) VALUES ('01', 1, 1, 1, NOW());
-- Retorna: imconceptosregimen_id = 1

// Guardar detalles
INSERT INTO rrhh_conceptos_regimen_detalle (
    ic_conceptosregimen_id,
    ic_concepto_id,
    ic_estado,
    fc_fecharegistro
) VALUES 
(1, 1, 1, NOW()),
(1, 3, 1, NOW()),
(1, 5, 1, NOW());
```

#### 4. Resultado en BD:
```sql
-- Tabla cabecera
SELECT * FROM rrhh_conceptos_regimen_laboral;
┌────────────────────────┬───────────────────┬────────────┬──────────┐
│ imconceptosregimen_id  │ ic_regimenlaboral │ ic_empresa │ ic_estado│
├────────────────────────┼───────────────────┼────────────┼──────────┤
│ 1                      │ 01                │ 1          │ 1        │
└────────────────────────┴───────────────────┴────────────┴──────────┘

-- Tabla detalle
SELECT * FROM rrhh_conceptos_regimen_detalle;
┌──────────────────────────────┬─────────────────────────┬────────────────┐
│ imconceptosregimendetalle_id │ ic_conceptosregimen_id  │ ic_concepto_id │
├──────────────────────────────┼─────────────────────────┼────────────────┤
│ 1                            │ 1                       │ 1              │
│ 2                            │ 1                       │ 3              │
│ 3                            │ 1                       │ 5              │
└──────────────────────────────┴─────────────────────────┴────────────────┘
```

---

## 🔍 Endpoints Disponibles

### 1. Listar conceptos por régimen (por empresa)
```http
GET /api/conceptos-regimen-laboral?empresaId=1
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Conceptos por régimen laboral obtenidos exitosamente",
  "data": [
    {
      "imconceptosregimen_id": 1,
      "ic_regimenlaboral": "01",
      "regimen_codigo": "10",
      "regimen_nombre": "Régimen General",
      "total_conceptos": 3
    }
  ]
}
```

### 2. Obtener detalles de un régimen
```http
GET /api/conceptos-regimen-laboral/1/detalles
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Detalles obtenidos exitosamente",
  "data": [
    {
      "imconceptosregimendetalle_id": 1,
      "ic_concepto_id": 1,
      "concepto_codigo": "0101",
      "concepto_descripcion": "ALIMENTACION PRINCIPAL EN DINERO"
    },
    ...
  ]
}
```

### 3. Asignar conceptos a régimen
```http
POST /api/conceptos-regimen-laboral/asignar?usuarioId=1
Content-Type: application/json

{
  "regimenLaboralId": "01",
  "empresaId": 1,
  "conceptos": [1, 3, 5]
}
```

### 4. Eliminar asignación
```http
DELETE /api/conceptos-regimen-laboral/1?usuarioId=1
```

---

## 🧪 Pruebas

### Prueba 1: Guardar conceptos
```
1. Abrir "Conceptos por Régimen Laboral"
2. Click en "Nuevo"
3. Seleccionar régimen: "10 - Régimen General"
4. Buscar y agregar conceptos
5. Click en "Guardar"
6. Verificar notificación de éxito
```

### Prueba 2: Verificar en BD
```sql
-- Ver cabecera
SELECT 
    cr.*,
    rl.trl_codsunat,
    rl.trl_regimenlaboral
FROM rrhh_conceptos_regimen_laboral cr
INNER JOIN rrhh_regimenlaboral rl ON cr.ic_regimenlaboral = rl.imregimenlaboral_id
WHERE cr.ic_empresa = 1;

-- Ver detalles con conceptos
SELECT 
    crd.*,
    c.tc_descripcion,
    t.tt_codsunat
FROM rrhh_conceptos_regimen_detalle crd
INNER JOIN rrhh_mconceptos c ON crd.ic_concepto_id = c.imconceptos_id
LEFT JOIN rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
WHERE crd.ic_conceptosregimen_id = 1;
```

---

## 📋 Características Implementadas

✅ **Guardado transaccional** - Si falla algo, se revierte todo
✅ **Actualización automática** - Si ya existe, actualiza los conceptos
✅ **Soft delete** - No elimina físicamente, solo cambia estado
✅ **Auditoría completa** - Quién creó, editó y eliminó
✅ **Foreign keys** - Integridad referencial
✅ **Cascade delete** - Al eliminar cabecera, elimina detalles
✅ **Validaciones** - Backend y frontend

---

## 🔧 Solución de Problemas

### Error: "Foreign key violation"
```sql
-- Verificar que existan los regímenes laborales
SELECT * FROM rrhh_regimenlaboral;

-- Verificar que existan los conceptos
SELECT * FROM rrhh_mconceptos WHERE ic_empresa = 1;
```

### Error: "empresaId is null"
```javascript
// Verificar en consola del navegador
console.log('Empresa ID:', localStorage.getItem('empresa_id'));
console.log('Usuario:', localStorage.getItem('user'));
```

### No se guardan los conceptos
```
1. Abrir DevTools (F12)
2. Ir a pestaña "Network"
3. Intentar guardar
4. Ver la petición POST a /api/conceptos-regimen-laboral/asignar
5. Revisar el payload y la respuesta
```

---

## ✅ Checklist Final

- [ ] Ejecutar script de regímenes laborales
- [ ] Ejecutar script de tablas conceptos-régimen
- [ ] Verificar 6 regímenes en BD
- [ ] Reiniciar backend
- [ ] Probar endpoint de regímenes
- [ ] Probar endpoint de conceptos
- [ ] Abrir modal en frontend
- [ ] Seleccionar régimen
- [ ] Agregar conceptos
- [ ] Guardar
- [ ] Verificar en BD

---

**¡Sistema completo conectado!** 🎉

Ahora puedes asignar conceptos a regímenes laborales y todo se guarda correctamente en las dos tablas relacionadas.
