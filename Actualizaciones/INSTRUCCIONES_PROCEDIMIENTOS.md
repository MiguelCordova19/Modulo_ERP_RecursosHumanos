# Instrucciones para Implementar Procedimientos Almacenados

## 1. Ejecutar los Scripts en PostgreSQL

Abre tu cliente de PostgreSQL (pgAdmin, DBeaver, o psql) y ejecuta el archivo `procedimientos_almacenados.sql` completo.

```bash
psql -U postgres -d root -f procedimientos_almacenados.sql
```

O copia y pega el contenido del archivo en tu cliente SQL y ejecútalo.

## 2. Cambios Realizados en el Backend

### UsuarioService.java
- Ahora usa `JdbcTemplate` en lugar de `UsuarioRepository`
- Llama a los procedimientos almacenados:
  - `sp_listar_usuarios_activos()` - Lista solo usuarios activos con JOIN a roles
  - `sp_obtener_usuario_por_id(id)` - Obtiene un usuario específico
  - `sp_guardar_usuario(...)` - Crea o actualiza usuario (siempre activo al crear)
  - `sp_eliminar_usuario(id)` - Cambia estado a 0 (eliminación lógica)

### UsuarioController.java
- Adaptado para manejar las respuestas de los procedimientos almacenados
- Retorna mensajes más descriptivos

## 3. Cambios en el Frontend

### Dashboard de Empresas (frontend/empresas/js/dashboard-empresa.js)
- **Eliminado el campo "Estado"** del formulario de usuarios
- Los usuarios siempre se crean con estado = 1 (activo)
- Solo se muestran usuarios activos en la tabla
- El botón "Eliminar" cambia el estado a 0 (no elimina físicamente)
- La tabla ahora muestra el **nombre del rol** en lugar del ID

## 4. Características Implementadas

### Usuarios
✅ Solo se muestran usuarios activos (estado = 1)
✅ Al crear un usuario, automáticamente se asigna estado = 1
✅ No hay opción de seleccionar activo/inactivo al crear
✅ La tabla muestra el nombre del rol (JOIN con rrhh_mroldashboard)
✅ Eliminar = cambiar estado a 0 (eliminación lógica)
✅ Encriptación de contraseñas con BCrypt

### Empresas
✅ Solo se muestran empresas activas
✅ Validación de RUC duplicado
✅ Eliminación lógica (estado = 0)

### Roles
✅ Solo se muestran roles activos
✅ Eliminación lógica (estado = 0)

## 5. Estructura de las Tablas

### rrhh_musuario
- `iu_estado = 1` → Activo (visible en la aplicación)
- `iu_estado = 0` → Inactivo (eliminado lógicamente)

### rrhh_mempresa
- `iu_estado = 1` → Activa
- `iu_estado = 0` → Inactiva

### rrhh_mroldashboard
- `iu_estado = 1` → Activo
- `iu_estado = 0` → Inactivo

## 6. Ejemplos de Uso de los Procedimientos

### Listar usuarios activos
```sql
SELECT * FROM sp_listar_usuarios_activos();
```

### Obtener usuario por ID
```sql
SELECT * FROM sp_obtener_usuario_por_id(1);
```

### Crear nuevo usuario
```sql
SELECT * FROM sp_guardar_usuario(
    0,                          -- ID (0 para nuevo)
    'juan.perez',              -- usuario
    'password123',             -- password
    'Juan',                    -- nombres
    'Pérez',                   -- apellido_paterno
    'García',                  -- apellido_materno
    1,                         -- empresa_id
    NULL,                      -- sede_id
    1,                         -- tipo_documento_id
    '12345678',                -- nro_documento
    '1990-01-01',              -- fecha_nacimiento
    1,                         -- rol_id
    1,                         -- puesto_id
    '987654321',               -- nro_celular
    'juan@empresa.com'         -- correo
);
```

### Actualizar usuario existente
```sql
SELECT * FROM sp_guardar_usuario(
    5,                         -- ID del usuario a actualizar
    'juan.perez',              -- usuario
    NULL,                      -- password (NULL para mantener el actual)
    'Juan Carlos',             -- nombres
    'Pérez',                   -- apellido_paterno
    'García',                  -- apellido_materno
    1,                         -- empresa_id
    NULL,                      -- sede_id
    1,                         -- tipo_documento_id
    '12345678',                -- nro_documento
    '1990-01-01',              -- fecha_nacimiento
    2,                         -- rol_id
    2,                         -- puesto_id
    '987654321',               -- nro_celular
    'juan@empresa.com'         -- correo
);
```

### Eliminar usuario (cambiar estado a 0)
```sql
SELECT * FROM sp_eliminar_usuario(5);
```

## 7. Ventajas de Usar Procedimientos Almacenados

✅ **Mejor rendimiento**: La lógica se ejecuta en el servidor de BD
✅ **Seguridad**: Validaciones centralizadas en la BD
✅ **Mantenibilidad**: Cambios en la lógica sin modificar código Java
✅ **Consistencia**: Misma lógica para todas las aplicaciones
✅ **Transacciones**: Manejo automático de transacciones
✅ **Reutilización**: Pueden ser llamados desde cualquier aplicación

## 8. Próximos Pasos

1. Ejecutar `procedimientos_almacenados.sql` en PostgreSQL
2. Reiniciar el backend de Spring Boot
3. Probar la creación de usuarios desde el dashboard
4. Verificar que solo se muestren usuarios activos
5. Probar la eliminación (debe cambiar estado a 0)
6. Verificar que el rol se muestre como texto, no como ID

## 9. Notas Importantes

⚠️ **Contraseñas**: Se encriptan con BCrypt antes de guardar
⚠️ **Sede**: En el dashboard de empresas, sede_id siempre es NULL
⚠️ **Estado**: No se puede seleccionar al crear, siempre es 1
⚠️ **Eliminación**: Es lógica, no física (los datos permanecen en la BD)
⚠️ **Roles**: Deben existir en rrhh_mroldashboard antes de asignar a usuarios
