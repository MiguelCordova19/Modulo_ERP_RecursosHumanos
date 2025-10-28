# 🔧 Solución: Error sp_guardar_usuario

## 🐛 Error Encontrado

```
CallableStatementCallback; bad SQL grammar [{CALL sp_guardar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}]
```

## 📋 Causa del Problema

El stored procedure `sp_guardar_usuario` no existe en la base de datos o tiene una firma diferente.

## ✅ Solución

### Opción 1: Ejecutar Script Completo (Recomendado)

```bash
# Conectar a PostgreSQL
psql -U root -d root

# Ejecutar el script que crea todos los procedimientos
\i Scripts/limpiar_y_crear_procedimientos.sql

# O alternativamente:
\i Scripts/procedimientos_corregidos_final.sql

# Salir
\q
```

### Opción 2: Crear Solo el Procedimiento sp_guardar_usuario

```sql
-- Conectar a PostgreSQL
psql -U root -d root

-- Eliminar versión anterior si existe
DROP PROCEDURE IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR, BIGINT, VARCHAR, VARCHAR) CASCADE;

-- Crear el procedimiento
CREATE OR REPLACE PROCEDURE sp_guardar_usuario(
    IN p_id BIGINT,
    IN p_usuario VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_nombres VARCHAR(50),
    IN p_apellido_paterno VARCHAR(50),
    IN p_apellido_materno VARCHAR(50),
    IN p_empresa_id BIGINT,
    IN p_sede_id BIGINT,
    IN p_tipo_documento_id INTEGER,
    IN p_nro_documento VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_rol_id INTEGER,
    IN p_puesto_id INTEGER,
    IN p_nro_celular VARCHAR(20),
    IN p_correo VARCHAR(50),
    OUT p_resultado_id BIGINT,
    OUT p_resultado_usuario VARCHAR(50),
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
    v_usuario_existe INTEGER;
BEGIN
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Verificar si el usuario existe
        SELECT COUNT(*) INTO v_existe
        FROM rrhh_musuario
        WHERE imusuario_id = p_id;
        
        IF v_existe = 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'Usuario no encontrado';
            RETURN;
        END IF;
        
        -- Verificar si el nombre de usuario ya existe (excepto el actual)
        SELECT COUNT(*) INTO v_usuario_existe
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario
          AND imusuario_id != p_id;
        
        IF v_usuario_existe > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        -- Actualizar usuario
        UPDATE rrhh_musuario SET
            tu_usuario = p_usuario,
            tu_password = COALESCE(p_password, tu_password), -- Solo actualizar si se proporciona
            tu_nombres = p_nombres,
            tu_apellidopaterno = p_apellido_paterno,
            tu_apellidomaterno = p_apellido_materno,
            iu_empresa = p_empresa_id,
            iu_sede = p_sede_id,
            iu_tipodocumento = p_tipo_documento_id,
            tu_nrodocumento = p_nro_documento,
            fu_fechanacimiento = p_fecha_nacimiento,
            iu_rol = p_rol_id,
            iu_puesto = p_puesto_id,
            tu_nrocelular = p_nro_celular,
            tu_correo = p_correo
        WHERE imusuario_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_usuario := p_usuario;
        p_resultado_mensaje := 'Usuario actualizado exitosamente';
        
    ELSE
        -- Verificar si el nombre de usuario ya existe
        SELECT COUNT(*) INTO v_usuario_existe
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario;
        
        IF v_usuario_existe > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        -- Insertar nuevo usuario (siempre con estado = 1)
        INSERT INTO rrhh_musuario (
            tu_usuario,
            tu_password,
            tu_nombres,
            tu_apellidopaterno,
            tu_apellidomaterno,
            iu_empresa,
            iu_sede,
            iu_tipodocumento,
            tu_nrodocumento,
            fu_fechanacimiento,
            iu_rol,
            iu_puesto,
            tu_nrocelular,
            tu_correo,
            iu_estado
        ) VALUES (
            p_usuario,
            p_password,
            p_nombres,
            p_apellido_paterno,
            p_apellido_materno,
            p_empresa_id,
            p_sede_id,
            p_tipo_documento_id,
            p_nro_documento,
            p_fecha_nacimiento,
            p_rol_id,
            p_puesto_id,
            p_nro_celular,
            p_correo,
            1
        )
        RETURNING imusuario_id INTO p_resultado_id;
        
        p_resultado_usuario := p_usuario;
        p_resultado_mensaje := 'Usuario creado exitosamente';
    END IF;
END;
$$;

-- Verificar que se creó correctamente
\df sp_guardar_usuario
```

## 🧪 Verificar que Funciona

```sql
-- Probar el procedimiento
CALL sp_guardar_usuario(
    0,                      -- p_id (0 = nuevo)
    'test_user',            -- p_usuario
    'password123',          -- p_password
    'Test',                 -- p_nombres
    'Usuario',              -- p_apellido_paterno
    'Prueba',               -- p_apellido_materno
    1,                      -- p_empresa_id
    NULL,                   -- p_sede_id
    1,                      -- p_tipo_documento_id
    '99999999',             -- p_nro_documento
    '1990-01-01',           -- p_fecha_nacimiento
    1,                      -- p_rol_id
    1,                      -- p_puesto_id
    '999999999',            -- p_nro_celular
    'test@test.com',        -- p_correo
    NULL,                   -- p_resultado_id (OUT)
    NULL,                   -- p_resultado_usuario (OUT)
    NULL                    -- p_resultado_mensaje (OUT)
);
```

## 📊 Parámetros del Procedimiento

### Parámetros IN (15)

| # | Nombre | Tipo | Descripción |
|---|--------|------|-------------|
| 1 | p_id | BIGINT | ID del usuario (0 = nuevo) |
| 2 | p_usuario | VARCHAR(50) | Nombre de usuario |
| 3 | p_password | VARCHAR(255) | Contraseña encriptada |
| 4 | p_nombres | VARCHAR(50) | Nombres |
| 5 | p_apellido_paterno | VARCHAR(50) | Apellido paterno |
| 6 | p_apellido_materno | VARCHAR(50) | Apellido materno |
| 7 | p_empresa_id | BIGINT | ID de empresa |
| 8 | p_sede_id | BIGINT | ID de sede (puede ser NULL) |
| 9 | p_tipo_documento_id | INTEGER | ID tipo documento |
| 10 | p_nro_documento | VARCHAR(20) | Número de documento |
| 11 | p_fecha_nacimiento | DATE | Fecha de nacimiento |
| 12 | p_rol_id | INTEGER | ID del rol |
| 13 | p_puesto_id | INTEGER | ID del puesto |
| 14 | p_nro_celular | VARCHAR(20) | Número celular |
| 15 | p_correo | VARCHAR(50) | Correo electrónico |

### Parámetros OUT (3)

| # | Nombre | Tipo | Descripción |
|---|--------|------|-------------|
| 16 | p_resultado_id | BIGINT | ID del usuario guardado |
| 17 | p_resultado_usuario | VARCHAR(50) | Nombre de usuario guardado |
| 18 | p_resultado_mensaje | VARCHAR(200) | Mensaje de resultado |

**Total: 18 parámetros** (15 IN + 3 OUT)

## 🔍 Verificar Procedimientos Existentes

```sql
-- Ver todos los procedimientos de usuarios
SELECT 
    p.proname AS nombre_procedimiento,
    pg_get_function_arguments(p.oid) AS argumentos
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%usuario%'
ORDER BY p.proname;
```

## 📝 Scripts Disponibles

Los siguientes scripts contienen el procedimiento `sp_guardar_usuario`:

1. **Scripts/limpiar_y_crear_procedimientos.sql** ✅ Recomendado
   - Elimina y recrea todos los procedimientos
   - Incluye todos los procedimientos del sistema

2. **Scripts/procedimientos_corregidos_final.sql** ✅ Alternativa
   - Versión corregida de todos los procedimientos

3. **Scripts/procedimientos_almacenados.sql**
   - Versión original

## 🚀 Pasos Recomendados

1. **Ejecutar script completo:**
   ```bash
   psql -U root -d root -f Scripts/limpiar_y_crear_procedimientos.sql
   ```

2. **Reiniciar backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Probar edición de usuario:**
   - Ir a: Gestión de Seguridad → Usuarios
   - Editar un usuario
   - Guardar
   - Debe funcionar correctamente

## ✅ Resultado Esperado

Después de ejecutar el script:

```
✅ Procedimiento sp_guardar_usuario creado
✅ Backend puede llamar al procedimiento
✅ Edición de usuarios funciona
✅ Creación de usuarios funciona
```

---

**Solución aplicada:** 27/10/2025  
**Estado:** ✅ Documentado
