# 🔍 Diagnóstico: Conceptos No Se Muestran en el Modal

## 🐛 Problema
Al abrir el modal de conceptos del trabajador, no se muestran los datos guardados en `rrhh_mconceptostrabajador`.

## 🎯 Posibles Causas

### 1. La tabla no existe en la base de datos
### 2. El procedimiento almacenado no está creado
### 3. No hay datos guardados
### 4. Error en el endpoint del backend
### 5. Error en la consulta SQL

## ✅ Pasos de Diagnóstico

### Paso 1: Verificar que la Tabla Existe

Ejecuta este script SQL:
```bash
psql -U usuario -d nombre_bd -f sql/verificar_conceptos_trabajador.sql
```

O ejecuta manualmente:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'rrhh_mconceptostrabajador';
```

**Resultado esperado:** Debe retornar 1 fila

**Si no existe la tabla:**
```bash
psql -U usuario -d nombre_bd -f sql/crear_tabla_conceptos_trabajador.sql
```

### Paso 2: Verificar la Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca estos mensajes:

```javascript
// Al abrir el modal
🔍 Cargando conceptos del contrato: 123

// Si hay datos
✅ Cargados X conceptos guardados del trabajador

// Si no hay datos
⚠️ No hay conceptos guardados para este contrato
```

### Paso 3: Verificar la Pestaña Network

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Abre el modal de conceptos
4. Busca la petición: `conceptos-trabajador/contrato/123?empresaId=1`
5. Haz clic en ella
6. Ve a la pestaña "Response"

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "concepto_id": 45,
      "concepto_codigo": "0121",
      "concepto_descripcion": "REMUNERACION BASICA",
      "tipo": "FIJO",
      "tipo_valor": "MONTO",
      "valor": 1500.00
    }
  ]
}
```

**Si data está vacío:**
- No hay conceptos guardados para ese contrato
- Necesitas crear el contrato primero

**Si hay error 500:**
- Problema en el backend
- Revisa logs del servidor

### Paso 4: Verificar que el Procedimiento Existe

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'sp_obtener_conceptos_trabajador';
```

**Si no existe:**
```bash
psql -U usuario -d nombre_bd -f sql/crear_tabla_conceptos_trabajador.sql
```

### Paso 5: Probar el Procedimiento Manualmente

```sql
-- Reemplaza 1, 1 con un contrato_id y empresa_id reales
SELECT * FROM public.sp_obtener_conceptos_trabajador(1, 1);
```

**Resultado esperado:** Debe retornar filas con conceptos

### Paso 6: Verificar que Hay Datos en la Tabla

```sql
SELECT COUNT(*) FROM rrhh_mconceptostrabajador WHERE ict_estado = 1;
```

**Si retorna 0:**
- No hay conceptos guardados
- Necesitas crear un contrato para que se guarden automáticamente

## 🔧 Soluciones

### Solución 1: Crear la Tabla

Si la tabla no existe:
```bash
psql -U usuario -d nombre_bd -f sql/crear_tabla_conceptos_trabajador.sql
```

### Solución 2: Agregar Campo Empresa (si la tabla ya existía)

Si la tabla existe pero no tiene el campo `ict_empresa`:
```bash
psql -U usuario -d nombre_bd -f sql/agregar_campo_empresa_conceptos_trabajador.sql
```

### Solución 3: Crear un Contrato de Prueba

1. Ve al módulo de Contratos
2. Haz clic en "Nuevo"
3. Llena el formulario
4. Selecciona un régimen laboral
5. Haz clic en "Guardar"
6. El sistema guardará conceptos automáticamente
7. Se abrirá el modal mostrando los conceptos

### Solución 4: Verificar Logs del Backend

Si hay error 500, revisa los logs del servidor:
```bash
# En la consola donde corre Spring Boot
# Busca errores como:
# ERROR: relation "rrhh_mconceptostrabajador" does not exist
# ERROR: function sp_obtener_conceptos_trabajador does not exist
```

### Solución 5: Verificar empresaId

Asegúrate de que `localStorage.getItem('empresa_id')` tenga un valor:

```javascript
// En la consola del navegador
console.log(localStorage.getItem('empresa_id'));
console.log(window.EMPRESA_ID);
```

**Si retorna null:**
```javascript
// Establecer manualmente
localStorage.setItem('empresa_id', '1');
```

## 🧪 Prueba Completa

### Paso 1: Crear Datos de Prueba

```sql
-- Insertar un concepto de prueba (ajusta los IDs según tu BD)
INSERT INTO rrhh_mconceptostrabajador (
    ict_contratotrabajador,
    ict_conceptos,
    ict_tipo,
    ict_tipovalor,
    dct_valor,
    ict_empresa,
    ict_estado,
    ict_usuarioregistro,
    fct_fecharegistro
) VALUES (
    1,              -- ID del contrato (ajustar)
    1,              -- ID del concepto (ajustar)
    2,              -- FIJO
    1,              -- MONTO
    1500.00,        -- Valor
    1,              -- Empresa
    1,              -- Activo
    1,              -- Usuario
    CURRENT_TIMESTAMP
);
```

### Paso 2: Verificar en el Frontend

1. Abre el módulo de Contratos
2. Haz clic en el menú de acciones (⋮) del contrato
3. Selecciona "Modificar conceptos"
4. Deberías ver el concepto en la tabla

## 📊 Checklist de Verificación

- [ ] La tabla `rrhh_mconceptostrabajador` existe
- [ ] El campo `ict_empresa` existe en la tabla
- [ ] El procedimiento `sp_obtener_conceptos_trabajador` existe
- [ ] Hay datos en la tabla (COUNT > 0)
- [ ] El endpoint `/api/conceptos-trabajador/contrato/{id}` responde
- [ ] `localStorage.getItem('empresa_id')` tiene un valor
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores 500 en Network

## 🎯 Flujo Esperado

```
Usuario abre modal de conceptos
    ↓
Frontend llama: GET /api/conceptos-trabajador/contrato/123?empresaId=1
    ↓
Backend ejecuta: sp_obtener_conceptos_trabajador(123, 1)
    ↓
Procedimiento consulta: rrhh_mconceptostrabajador
    ↓
Retorna datos con JOINs a rrhh_mconceptos y rrhh_mtributos
    ↓
Frontend recibe JSON con conceptos
    ↓
Frontend llena la tabla del modal
```

## 🔍 Comandos Útiles

### Ver estructura de la tabla
```sql
\d rrhh_mconceptostrabajador
```

### Ver últimos conceptos insertados
```sql
SELECT * FROM rrhh_mconceptostrabajador 
ORDER BY imconceptostrabajador_id DESC 
LIMIT 10;
```

### Ver conceptos de un contrato específico
```sql
SELECT * FROM public.sp_obtener_conceptos_trabajador(123, 1);
```

### Contar conceptos por contrato
```sql
SELECT 
    ict_contratotrabajador,
    COUNT(*) as total
FROM rrhh_mconceptostrabajador
WHERE ict_estado = 1
GROUP BY ict_contratotrabajador;
```

## 📞 Si Nada Funciona

Comparte esta información:

1. **Resultado de:** `SELECT COUNT(*) FROM rrhh_mconceptostrabajador;`
2. **Resultado de:** Verificar tabla existe
3. **Captura de pantalla** de la pestaña Network en DevTools
4. **Captura de pantalla** de la consola del navegador
5. **Logs del backend** (si hay errores)

---

**Fecha:** 2025-12-02
