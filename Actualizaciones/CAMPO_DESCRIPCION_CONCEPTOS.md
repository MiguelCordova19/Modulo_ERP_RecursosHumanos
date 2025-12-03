# 📝 Campo Descripción en Conceptos

## 🎯 Funcionalidad Implementada

Se ha agregado un campo **descripción editable** a los conceptos que:
1. Se auto-llena con la descripción del tributo seleccionado
2. Puede ser editado por el usuario
3. Se guarda en la base de datos

---

## 📊 Cambios en Base de Datos

### Nuevo campo agregado:
```sql
ALTER TABLE rrhh_mconceptos 
    ADD COLUMN tc_descripcion VARCHAR(200);
```

### Estructura actualizada:
```sql
CREATE TABLE rrhh_mconceptos (
    imconceptos_id BIGSERIAL PRIMARY KEY,
    ic_tributos VARCHAR(3),
    ic_tipoconcepto VARCHAR(2),
    tc_descripcion VARCHAR(200),      -- ✅ NUEVO CAMPO
    ic_afecto INTEGER,
    ic_tipototales VARCHAR(2),
    ic_empresa INTEGER,
    ic_estado INTEGER DEFAULT 1,
    ...
);
```

---

## 🔧 Cambios en Backend

### 1. Entidad Java actualizada:
```java
@Column(name = "tc_descripcion", length = 200)
private String descripcion;
```

### 2. Service actualizado:
- RowMapper incluye `tc_descripcion`
- SQL SELECT incluye el campo
- Método `actualizar()` guarda la descripción

---

## 🎨 Cambios en Frontend

### 1. Auto-llenado al seleccionar tributo:
```javascript
seleccionarTributo: function(tributo) {
    // Auto-llenar descripción con el nombre del tributo
    if (!$('#conceptoDescripcion').val()) {
        $('#conceptoDescripcion').val(tributo.descripcion);
    }
}
```

**Comportamiento:**
- Usuario selecciona tributo: "0101 - ALIMENTACION PRINCIPAL EN DINERO"
- Campo descripción se llena automáticamente con: "ALIMENTACION PRINCIPAL EN DINERO"
- Usuario puede editar la descripción si lo desea

### 2. Validación agregada:
```javascript
if (!descripcion) {
    showNotification('Por favor ingrese una descripción', 'warning');
    return;
}
```

### 3. Guardado incluye descripción:
```javascript
const datos = {
    tributoId: tributoId,
    tipoConceptoId: tipoConceptoId,
    descripcion: descripcion,  // ✅ Nuevo campo
    afecto: afectoRadio === 'SI' ? 1 : 0,
    tipoTotalesId: tipoTotalesId || null,
    empresaId: parseInt(empresaId)
};
```

### 4. Tabla muestra descripción personalizada:
```javascript
{
    data: 'descripcion',
    render: function(data, type, row) {
        // Mostrar descripción personalizada o la del tributo
        const descripcion = data || row.tributoDescripcion || 'Sin descripción';
        return descripcion;
    }
}
```

---

## 🧪 Flujo de Uso

### Caso 1: Crear nuevo concepto

```
1. Usuario abre modal "Nuevo"
2. Selecciona Tipo Concepto: "01 - INGRESOS"
3. Busca tributo: "alimentacion"
4. Selecciona: "0101 - ALIMENTACION PRINCIPAL EN DINERO"
   
   ✅ Campo "Descripción" se llena automáticamente con:
   "ALIMENTACION PRINCIPAL EN DINERO"
   
5. Usuario puede:
   - Dejar la descripción como está
   - Editarla (ej: "ALIMENTACION PRINCIPAL")
   
6. Completa los demás campos y guarda
7. En la tabla se muestra la descripción personalizada
```

### Caso 2: Editar concepto existente

```
1. Usuario hace click en "Editar"
2. Modal se abre con todos los campos llenos
3. Campo "Descripción" muestra la descripción guardada
4. Usuario puede modificar la descripción
5. Guarda los cambios
6. Tabla se actualiza con la nueva descripción
```

---

## 📋 Pasos para Aplicar

### 1. Actualizar Base de Datos
```sql
-- Ejecutar:
\i sql/actualizar_tabla_conceptos.sql
```

O manualmente:
```sql
ALTER TABLE rrhh_mconceptos 
    ADD COLUMN IF NOT EXISTS tc_descripcion VARCHAR(200);
```

### 2. Reiniciar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Limpiar caché del navegador
```
Ctrl + Shift + R
```

---

## ✅ Verificación

### 1. Verificar campo en BD:
```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mconceptos'
AND column_name = 'tc_descripcion';
```

**Resultado esperado:**
```
column_name     | data_type         | character_maximum_length
----------------+-------------------+-------------------------
tc_descripcion  | character varying | 200
```

### 2. Probar auto-llenado:
```
1. Abrir modal "Nuevo"
2. Seleccionar un tributo
3. Verificar que el campo "Descripción" se llene automáticamente
4. Editar la descripción
5. Guardar
6. Verificar en la tabla que se muestre la descripción editada
```

### 3. Verificar en BD:
```sql
SELECT 
    imconceptos_id,
    tc_descripcion,
    ic_tributos
FROM rrhh_mconceptos
ORDER BY imconceptos_id DESC
LIMIT 5;
```

---

## 💡 Ventajas

1. ✅ **Flexibilidad**: Usuario puede personalizar la descripción
2. ✅ **Productividad**: Auto-llenado ahorra tiempo
3. ✅ **Claridad**: Descripciones más cortas y específicas
4. ✅ **Trazabilidad**: Se mantiene la relación con el tributo original

---

## 📝 Ejemplos

### Tributo original:
```
0101 - ALIMENTACION PRINCIPAL EN DINERO
```

### Descripciones personalizadas posibles:
```
- "ALIMENTACION PRINCIPAL"
- "ALIMENTACION EN DINERO"
- "ALIM. PRINCIPAL"
- "ALIMENTACION"
```

### En la tabla se mostrará:
```
┌────┬─────────────────────────┬──────────┬─────────┬────────┐
│ #  │ Descripción             │ Concepto │ Tipo    │ Afecto │
├────┼─────────────────────────┼──────────┼─────────┼────────┤
│ 1  │ ALIMENTACION PRINCIPAL  │ 0101     │ INGRESO │ SI     │
│ 2  │ ALIM. EN DINERO        │ 0101     │ INGRESO │ SI     │
└────┴─────────────────────────┴──────────┴─────────┴────────┘
```

---

## 🔍 Notas Importantes

- El campo descripción es **obligatorio**
- Se auto-llena **solo si está vacío** (no sobrescribe)
- Máximo **200 caracteres**
- Se puede editar en cualquier momento
- Si no hay descripción personalizada, la tabla muestra la del tributo

---

**¡Campo descripción implementado!** ✅

Ahora los conceptos tienen descripciones personalizables y editables.
