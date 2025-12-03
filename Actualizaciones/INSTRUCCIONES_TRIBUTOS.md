# 📋 Implementación de Tabla TRIBUTOS

## 🎯 Resumen
Se ha creado la tabla **RRHH_MTRIBUTOS** con **185 registros** de tributos SUNAT para el sistema de planillas.

---

## 📦 Scripts SQL Creados

### Archivos por partes:
```
sql/
├── crear_tabla_tributos_parte1.sql      (Registros 01-26)   - 26 registros
├── crear_tabla_tributos_parte2.sql      (Registros 27-55)   - 29 registros
├── crear_tabla_tributos_parte3.sql      (Registros 56-75)   - 20 registros
├── crear_tabla_tributos_parte4.sql      (Registros 76-92)   - 17 registros
├── crear_tabla_tributos_parte5.sql      (Registros 93-131)  - 39 registros
├── crear_tabla_tributos_parte6.sql      (Registros 132-149) - 18 registros
├── crear_tabla_tributos_parte7.sql      (Registros 150-169) - 20 registros
├── crear_tabla_tributos_parte8_final.sql (Registros 170-185) - 16 registros
└── crear_tabla_tributos_completo.sql    (Guía de ejecución)
```

**Total: 185 registros**

---

## 🗂️ Estructura de la Tabla

```sql
CREATE TABLE rrhh_mtributos (
    imtributos_id VARCHAR(3) PRIMARY KEY,
    it_tid VARCHAR(2) NOT NULL,
    tt_codsunat VARCHAR(10) NOT NULL,
    tt_descripcion VARCHAR(200) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Campos:
- **imtributos_id**: ID único del tributo (01-185)
- **it_tid**: Tipo de tributo (01-11)
- **tt_codsunat**: Código SUNAT (0101, 0102, etc.)
- **tt_descripcion**: Descripción completa del tributo
- **estado**: 1=Activo, 0=Inactivo
- **fecha_creacion**: Fecha de creación
- **fecha_modificacion**: Fecha de última modificación

---

## 📊 Distribución por Tipo

| Tipo | Descripción | Cantidad |
|------|-------------|----------|
| 01 | Ingresos | 27 |
| 02 | Asignaciones | 15 |
| 03 | Bonificaciones | 13 |
| 04 | Gratificaciones | 7 |
| 05 | Indemnizaciones | 7 |
| 06 | Otros ingresos | 28 |
| 07 | Otros conceptos | 20 |
| 08 | Sector público | 41 |
| 09 | Descuentos trabajador | 13 |
| 10 | Otros descuentos | 7 |
| 11 | Aportaciones empleador | 11 |
| **TOTAL** | | **185** |

---

## 🚀 Instrucciones de Ejecución

### Opción 1: Ejecutar por partes (RECOMENDADO)

```bash
# 1. Conectarse a PostgreSQL
psql -U tu_usuario -d tu_base_datos

# 2. Ejecutar los scripts en orden
\i sql/crear_tabla_tributos_parte1.sql
\i sql/crear_tabla_tributos_parte2.sql
\i sql/crear_tabla_tributos_parte3.sql
\i sql/crear_tabla_tributos_parte4.sql
\i sql/crear_tabla_tributos_parte5.sql
\i sql/crear_tabla_tributos_parte6.sql
\i sql/crear_tabla_tributos_parte7.sql
\i sql/crear_tabla_tributos_parte8_final.sql

# 3. Verificar
SELECT COUNT(*) FROM rrhh_mtributos;
-- Debe retornar: 185
```

### Opción 2: Copiar y pegar manualmente

1. Abre cada archivo SQL en orden
2. Copia el contenido
3. Pégalo en tu cliente PostgreSQL (pgAdmin, DBeaver, etc.)
4. Ejecuta cada script

---

## ✅ Verificación

### Verificar total de registros:
```sql
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
-- Resultado esperado: 185
```

### Verificar por tipo:
```sql
SELECT it_tid, COUNT(*) as cantidad 
FROM rrhh_mtributos 
GROUP BY it_tid 
ORDER BY it_tid;
```

### Ver primeros registros:
```sql
SELECT * FROM rrhh_mtributos 
ORDER BY imtributos_id 
LIMIT 10;
```

### Buscar un tributo específico:
```sql
SELECT * FROM rrhh_mtributos 
WHERE tt_descripcion ILIKE '%vacacion%';
```

---

## 🔗 Relación con otras tablas

Esta tabla se relaciona con:
- **rrhh_mtipoconcepto** (campo `it_tid`)
- **rrhh_mconceptos** (futura relación)

---

## 📝 Ejemplos de Registros

```sql
-- Tipo 01: Ingresos
01 | 01 | 0101 | ALIMENTACION PRINCIPAL EN DINERO
03 | 01 | 0103 | COMISIONES O DESTAJO
21 | 01 | 0121 | REMUNERACION O JORNAL BASICO

-- Tipo 02: Asignaciones
28 | 02 | 0201 | ASIGNACION FAMILIAR
32 | 02 | 0205 | ASIGNACION POR NACIMIENTO DE HIJOS

-- Tipo 09: Descuentos trabajador
161 | 09 | 0607 | SISTEMA NACIONAL DE PENSIONES - D.L 19990
162 | 09 | 0608 | SISTEMA PRIVADO DE PENSIONES - APORTACION OBLIGATORIA

-- Tipo 11: Aportaciones empleador
178 | 11 | 0804 | ESSALUD (SEGURO REGULAR, CBBSP, AGRARIO/ACUICULTOR) - TRABAJADOR
181 | 11 | 0807 | SENATI
```

---

## 🐛 Solución de Problemas

### Error: "relation already exists"
```sql
-- Eliminar la tabla y volver a crearla
DROP TABLE IF EXISTS rrhh_mtributos CASCADE;
-- Luego ejecutar los scripts nuevamente
```

### Error: "duplicate key value"
```sql
-- Limpiar la tabla antes de insertar
TRUNCATE TABLE rrhh_mtributos;
-- Luego ejecutar los scripts de inserción
```

### Verificar si la tabla existe:
```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'rrhh_mtributos'
);
```

---

## 📌 Próximos Pasos

1. ✅ Ejecutar scripts SQL en PostgreSQL
2. ⏳ Crear backend (Entity, Repository, Service, Controller)
3. ⏳ Integrar con frontend (combobox en modal de Conceptos)
4. ⏳ Implementar búsqueda y filtrado de tributos

---

## 📚 Notas Adicionales

- Los códigos SUNAT son oficiales del sistema de planillas electrónicas
- Cada tributo tiene un tipo asociado (it_tid)
- Los tributos están ordenados por ID para facilitar la búsqueda
- Se pueden agregar más tributos en el futuro manteniendo la secuencia

---

**¡Tabla de Tributos lista para usar!** 🎉

Total de registros: **185 tributos SUNAT**
