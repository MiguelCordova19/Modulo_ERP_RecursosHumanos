# 🎯 SISTEMA COMPLETO: Grupos y Puestos

## 📋 Flujo de Trabajo

### 1. **Crear Puestos** (Independientes)
- El usuario crea puestos con código y descripción
- Los puestos NO tienen grupo asignado inicialmente
- Aparecen en la tabla de puestos sin grupo

### 2. **Crear Grupos y Asignar Puestos**
- El usuario crea un grupo con nombre y descripción
- Selecciona puestos existentes para agregar al grupo
- Marca las evaluaciones (grados A, B, C, D) para cada item
- Al guardar, se crea el grupo y se asignan los puestos con sus evaluaciones

### 3. **Visualización**
- En la tabla de puestos se muestra el grupo al que pertenece cada uno
- En la tabla de grupos se muestra cuántos puestos tiene cada grupo
- Al editar un grupo, se cargan los puestos asignados y las evaluaciones

## 🗄️ Estructura de Tablas

### RRHH_MGRUPOS (Grupos)
```
├── imgrupo_id (PK)
├── tg_nombre (VARCHAR(20))
├── tg_descripcion (VARCHAR(100))
├── ig_estado
└── ig_empresa
```

### RRHH_MPUESTOS (Puestos)
```
├── impuesto_id (PK)
├── tp_nombre (VARCHAR(20))
├── tp_descripcion (VARCHAR(100))
├── ip_estado
└── ip_empresa
```

### RRHH_GRUPO_PUESTO_DETALLE (Relación + Evaluaciones)
```
├── imgrupo_puesto_detalle_id (PK)
├── igpd_grupo_id (FK → rrhh_mgrupos)
├── igpd_puesto_id (FK → rrhh_mpuestos)
├── tgpd_evaluacion (JSONB) ← Guarda los grados seleccionados
└── igpd_estado
```

**Constraint importante:** Un puesto solo puede estar en UN grupo activo a la vez.

## 📊 Ejemplo de Datos

### 1. Crear Puestos
```sql
INSERT INTO rrhh_mpuestos (tp_nombre, tp_descripcion, ip_empresa, ip_usuarioregistro) VALUES
('GERENTE', 'Gerente General', 1, 1),
('ASISTENTE', 'Asistente Administrativo', 1, 1),
('CONTADOR', 'Contador General', 1, 1);
```

### 2. Crear Grupo
```sql
INSERT INTO rrhh_mgrupos (tg_nombre, tg_descripcion, ig_empresa, ig_usuarioregistro) VALUES
('ADMIN', 'Grupo Administrativo', 1, 1);
```

### 3. Asignar Puestos al Grupo con Evaluaciones
```sql
INSERT INTO rrhh_grupo_puesto_detalle (igpd_grupo_id, igpd_puesto_id, tgpd_evaluacion, igpd_usuarioregistro) VALUES
(1, 1, '{"formacion":"A","pasado_profesional":"B","motivo_solicitud":"C","comportamiento":"A","potencial":"B","condiciones_personales":"C","situacion_familiar":"D","proceso_seleccion":"A"}', 1),
(1, 2, '{"formacion":"B","pasado_profesional":"C","motivo_solicitud":"D","comportamiento":"B","potencial":"C","condiciones_personales":"D","situacion_familiar":"A","proceso_seleccion":"B"}', 1);
```

## 🔄 Consultas Útiles

### Listar Puestos con su Grupo
```sql
SELECT 
    p.impuesto_id,
    p.tp_nombre as puesto_nombre,
    p.tp_descripcion as puesto_descripcion,
    g.tg_nombre as grupo_nombre,
    g.tg_descripcion as grupo_descripcion
FROM rrhh_mpuestos p
LEFT JOIN rrhh_grupo_puesto_detalle gpd ON p.impuesto_id = gpd.igpd_puesto_id AND gpd.igpd_estado = 1
LEFT JOIN rrhh_mgrupos g ON gpd.igpd_grupo_id = g.imgrupo_id AND g.ig_estado = 1
WHERE p.ip_empresa = 1 AND p.ip_estado = 1;
```

### Listar Puestos de un Grupo con Evaluaciones
```sql
SELECT 
    p.impuesto_id,
    p.tp_nombre,
    p.tp_descripcion,
    gpd.tgpd_evaluacion
FROM rrhh_grupo_puesto_detalle gpd
INNER JOIN rrhh_mpuestos p ON gpd.igpd_puesto_id = p.impuesto_id
WHERE gpd.igpd_grupo_id = 1 AND gpd.igpd_estado = 1;
```

### Contar Puestos por Grupo
```sql
SELECT 
    g.imgrupo_id,
    g.tg_nombre,
    COUNT(gpd.igpd_puesto_id) as total_puestos
FROM rrhh_mgrupos g
LEFT JOIN rrhh_grupo_puesto_detalle gpd ON g.imgrupo_id = gpd.igpd_grupo_id AND gpd.igpd_estado = 1
WHERE g.ig_empresa = 1 AND g.ig_estado = 1
GROUP BY g.imgrupo_id, g.tg_nombre;
```

## 📡 API Endpoints Necesarios

### Puestos
- `GET /api/puestos?empresaId=1` - Listar puestos (con grupo si tiene)
- `POST /api/puestos` - Crear puesto (sin grupo)
- `PUT /api/puestos/{id}` - Actualizar puesto
- `DELETE /api/puestos/{id}` - Eliminar puesto

### Grupos
- `GET /api/grupos?empresaId=1` - Listar grupos
- `GET /api/grupos/{id}` - Obtener grupo por ID
- `POST /api/grupos` - Crear grupo
- `PUT /api/grupos/{id}` - Actualizar grupo
- `DELETE /api/grupos/{id}` - Eliminar grupo

### Grupo-Puesto (Asignaciones)
- `GET /api/grupo-puesto/grupo/{grupoId}` - Listar puestos de un grupo con evaluaciones
- `POST /api/grupo-puesto/asignar` - Asignar puestos a un grupo con evaluaciones
- `DELETE /api/grupo-puesto/grupo/{grupoId}` - Eliminar todas las asignaciones de un grupo

## 🎨 Frontend - Flujo de Usuario

### Crear Puesto
1. Click en "Nuevo" en tabla de Puestos
2. Llenar: Código, Descripción
3. Guardar
4. Aparece en tabla sin grupo asignado

### Crear Grupo y Asignar Puestos
1. Click en "Nuevo" en tabla de Grupos
2. Llenar: Nombre del Grupo
3. Click en "Agregar Puesto"
4. Seleccionar puestos de una lista (solo puestos sin grupo o del grupo actual)
5. Marcar evaluaciones (checkboxes A, B, C, D) para cada item
6. Guardar
7. Se crea el grupo y se asignan los puestos

### Editar Grupo
1. Click en "Editar" en tabla de Grupos
2. Se carga el nombre del grupo
3. Se cargan los puestos asignados
4. Se cargan las evaluaciones marcadas
5. Puede agregar más puestos o quitar existentes
6. Puede cambiar las evaluaciones
7. Guardar actualiza todo

### Visualización en Tabla de Puestos
```
┌────┬──────────┬─────────────────────────┬─────────────────┐
│ #  │ Código   │ Descripción             │ Grupo           │
├────┼──────────┼─────────────────────────┼─────────────────┤
│ 1  │ GERENTE  │ Gerente General         │ ADMIN           │
│ 2  │ ASISTENTE│ Asistente Administrativo│ ADMIN           │
│ 3  │ VENDEDOR │ Vendedor de Campo       │ Sin asignar     │
└────┴──────────┴─────────────────────────┴─────────────────┘
```

## 🔧 Estructura JSON de Evaluaciones

```json
{
  "formacion": "A",
  "pasado_profesional": "B",
  "motivo_solicitud": "C",
  "comportamiento": "A",
  "potencial": "B",
  "condiciones_personales": "C",
  "situacion_familiar": "D",
  "proceso_seleccion": "A"
}
```

## 📝 Pasos de Implementación

### 1. Ejecutar Scripts SQL (en orden)
```bash
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupos.sql
psql -U usuario -d bd_rrhh -f sql/crear_tabla_puestos.sql
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupo_puesto_detalle.sql
```

### 2. Backend
- ✅ Entidad `Grupo` - Ya creada
- ✅ Entidad `Puesto` - Ya actualizada (sin grupoId)
- ⏳ Entidad `GrupoPuestoDetalle` - Por crear
- ⏳ Service para asignar puestos a grupos - Por crear
- ⏳ Controller para asignaciones - Por crear

### 3. Frontend
- ⏳ Modal de grupo con selector de puestos
- ⏳ Tabla de puestos agregados en el modal
- ⏳ Checkboxes de evaluación
- ⏳ Lógica para guardar asignaciones

## ✅ Ventajas de este Diseño

1. **Flexibilidad:** Puestos pueden existir sin grupo
2. **Historial:** Se puede ver qué puestos tuvo un grupo en el pasado
3. **Evaluaciones:** Cada asignación tiene sus propias evaluaciones
4. **Constraint:** Un puesto solo puede estar en un grupo activo
5. **Escalable:** Fácil agregar más campos a las evaluaciones

¡Sistema completo y bien estructurado! 🚀
