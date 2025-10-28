# Orden de Ejecución de Scripts SQL

Ejecuta estos scripts en el siguiente orden para solucionar todos los problemas:

## 1. Configurar Autoincremento en la Tabla de Usuarios
**Archivo:** `agregar_autoincremento_usuarios.sql`

Este script:
- ✅ Agrega autoincremento a `imusuario_id` sin perder datos
- ✅ Configura PRIMARY KEY
- ✅ Agrega campo `iu_primerlogin`
- ✅ Crea índices

```sql
-- Ejecutar en PostgreSQL
\i agregar_autoincremento_usuarios.sql
```

## 2. Corregir Procedimiento de Insertar Usuario
**Archivo:** `corregir_sp_insertar_usuario.sql`

Este script:
- ✅ Corrige el procedimiento `sp_insertar_usuario`
- ✅ Asegura que el estado se guarde correctamente
- ✅ Usa delimitadores correctos `$$`

```sql
-- Ejecutar en PostgreSQL
\i corregir_sp_insertar_usuario.sql
```

## 3. Actualizar Procedimiento de Listar Usuarios
**Archivo:** `actualizar_sp_listar_usuarios.sql`

Este script:
- ✅ Actualiza `sp_listar_usuarios_activos`
- ✅ Incluye campo `primer_login`
- ✅ Usa nombres correctos de columnas

```sql
-- Ejecutar en PostgreSQL
\i actualizar_sp_listar_usuarios.sql
```

## 4. Crear Procedimientos de Cambio de Contraseña
**Archivo:** `procedimiento_cambiar_password.sql`

Este script:
- ✅ Crea `sp_cambiar_password_validado` (valida contraseña actual)
- ✅ Crea `sp_cambiar_password` (sin validar)
- ✅ Actualiza `iu_primerlogin` a 0 después del cambio

```sql
-- Ejecutar en PostgreSQL
\i procedimiento_cambiar_password.sql
```

---

## Verificación

Después de ejecutar todos los scripts, verifica que todo funciona:

### 1. Verificar autoincremento:
```sql
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'rrhh_musuario' 
    AND column_name = 'imusuario_id';
```

### 2. Verificar procedimientos:
```sql
-- Listar procedimientos
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name LIKE '%usuario%'
ORDER BY routine_name;
```

### 3. Probar inserción:
```sql
-- Esto debería funcionar sin errores
SELECT * FROM sp_insertar_usuario(
    'test.usuario',
    '$2a$10$test',
    'Test',
    'Usuario',
    'Prueba',
    1,
    NULL,
    1,
    '12345678',
    '1990-01-01',
    1,
    NULL,
    '999999999',
    'test@test.com',
    1,
    1
);
```

---

## Problemas Resueltos

✅ **Problema 1:** Usuarios no aparecen en la tabla
- **Solución:** Procedimiento `sp_listar_usuarios_activos` actualizado

✅ **Problema 2:** Estado no se guarda como 1
- **Solución:** Procedimiento `sp_insertar_usuario` corregido

✅ **Problema 3:** Cambio de contraseña no funciona
- **Solución:** Nuevo endpoint `/cambiar-password-validado` que valida la contraseña actual

---

## Después de Ejecutar los Scripts

1. **Reinicia el backend** de Spring Boot
2. **Limpia la caché** del navegador (Ctrl + Shift + Delete)
3. **Prueba el flujo completo:**
   - Crear un nuevo usuario
   - Verificar que aparece en la tabla
   - Verificar que el estado es 1 (Activo)
   - Hacer login con el nuevo usuario
   - Cambiar la contraseña en el primer login
   - Verificar que puede acceder normalmente

---

## Notas Importantes

- Los scripts están diseñados para **no perder datos existentes**
- Si algo falla, revisa los logs de PostgreSQL
- Asegúrate de tener permisos de superusuario en PostgreSQL
- Haz un backup antes de ejecutar si tienes datos importantes
