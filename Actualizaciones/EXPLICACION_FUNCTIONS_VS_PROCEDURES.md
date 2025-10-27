# ¿Por qué usar FUNCTION para consultas y PROCEDURE para operaciones?

## Resumen Ejecutivo

En PostgreSQL, el enfoque **híbrido** es el estándar de la industria:
- **FUNCTION con RETURNS TABLE** → Para consultas (SELECT)
- **PROCEDURE con OUT parameters** → Para operaciones (INSERT/UPDATE/DELETE)

## Comparación: C# vs Java con PostgreSQL

### En C# (SQL Server/PostgreSQL)
```csharp
// C# puede manejar ambos fácilmente
using (var cmd = new NpgsqlCommand("sp_listar_usuarios", conn))
{
    cmd.CommandType = CommandType.StoredProcedure;
    using (var reader = cmd.ExecuteReader())
    {
        // Lee los resultados
    }
}
```

### En Java (PostgreSQL)
```java
// Con FUNCTION (más simple):
String sql = "SELECT * FROM sp_listar_usuarios_activos()";
List<Usuario> usuarios = jdbcTemplate.query(sql, rowMapper);

// Con PROCEDURE (más complejo):
String sql = "{CALL sp_listar_usuarios(?)}";
jdbcTemplate.execute(sql, (CallableStatement cs) -> {
    cs.registerOutParameter(1, Types.REF_CURSOR);
    cs.execute();
    ResultSet rs = (ResultSet) cs.getObject(1);
    // Procesar manualmente...
});
```

## ¿Por qué FUNCTION para consultas?

### 1. **Sintaxis más simple**
```sql
-- FUNCTION (simple)
SELECT * FROM sp_listar_usuarios_activos();

-- PROCEDURE (complejo)
CALL sp_listar_usuarios_activos('cursor_name');
FETCH ALL FROM cursor_name;
```

### 2. **Compatible con cualquier lenguaje**
- ✅ Java: `SELECT * FROM funcion()`
- ✅ Python: `cursor.execute("SELECT * FROM funcion()")`
- ✅ Node.js: `await pool.query("SELECT * FROM funcion()")`
- ✅ C#: `cmd.CommandText = "SELECT * FROM funcion()"`
- ✅ PHP: `$result = pg_query("SELECT * FROM funcion()")`

### 3. **Retorna datos directamente**
```sql
CREATE FUNCTION sp_listar_usuarios()
RETURNS TABLE (id BIGINT, nombre VARCHAR, ...)
AS $$
BEGIN
    RETURN QUERY SELECT ...;
END;
$$;
```

### 4. **No requiere transacciones especiales**
Las FUNCTION se pueden llamar sin BEGIN/COMMIT.

### 5. **Mejor rendimiento**
PostgreSQL optimiza mejor las FUNCTION que retornan tablas.

## ¿Por qué PROCEDURE para operaciones?

### 1. **Mejor control de transacciones**
```sql
CREATE PROCEDURE sp_guardar_usuario(...)
AS $$
BEGIN
    -- Puede hacer COMMIT/ROLLBACK interno
    INSERT INTO ...;
    UPDATE ...;
    -- Control total de la transacción
END;
$$;
```

### 2. **Múltiples valores de retorno**
```sql
CREATE PROCEDURE sp_guardar_usuario(
    IN p_nombre VARCHAR,
    OUT p_id BIGINT,
    OUT p_mensaje VARCHAR
)
```

### 3. **Operaciones complejas**
Ideal para INSERT/UPDATE/DELETE con lógica de negocio.

### 4. **Estándar SQL**
Los PROCEDURE son parte del estándar SQL:2003.

## Comparación Técnica

| Característica | FUNCTION | PROCEDURE |
|----------------|----------|-----------|
| **Retorna tabla** | ✅ Sí (RETURNS TABLE) | ❌ No (usa cursores) |
| **Llamada simple** | ✅ SELECT * FROM | ❌ CALL + FETCH |
| **Compatible JDBC** | ✅ Muy fácil | ⚠️ Complejo |
| **Parámetros OUT** | ❌ No | ✅ Sí |
| **Transacciones** | ⚠️ Limitado | ✅ Control total |
| **Modificar datos** | ⚠️ Posible pero no recomendado | ✅ Ideal |
| **Rendimiento consultas** | ✅ Excelente | ⚠️ Bueno |
| **Fácil de modificar** | ✅ CREATE OR REPLACE | ✅ CREATE OR REPLACE |

## Ejemplo Real: Tu Caso de Uso

### ❌ Todo con PROCEDURE (Complejo)
```java
// Listar usuarios (complejo con cursores)
String sql = "{CALL sp_listar_usuarios(?)}";
jdbcTemplate.execute(sql, (CallableStatement cs) -> {
    cs.registerOutParameter(1, Types.REF_CURSOR);
    cs.execute();
    ResultSet rs = (ResultSet) cs.getObject(1);
    List<Usuario> usuarios = new ArrayList<>();
    while (rs.next()) {
        // Mapear manualmente cada campo...
    }
    return usuarios;
});

// Guardar usuario (bien con PROCEDURE)
String sql = "{CALL sp_guardar_usuario(?, ?, ?, ...)}";
jdbcTemplate.execute(sql, (CallableStatement cs) -> {
    cs.setString(1, usuario.getNombre());
    cs.registerOutParameter(16, Types.BIGINT);
    cs.execute();
    return cs.getLong(16);
});
```

### ✅ Híbrido: FUNCTION + PROCEDURE (Simple)
```java
// Listar usuarios (simple con FUNCTION)
String sql = "SELECT * FROM sp_listar_usuarios_activos()";
List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper);

// Guardar usuario (bien con PROCEDURE)
String sql = "{CALL sp_guardar_usuario(?, ?, ?, ...)}";
jdbcTemplate.execute(sql, (CallableStatement cs) -> {
    cs.setString(1, usuario.getNombre());
    cs.registerOutParameter(16, Types.BIGINT);
    cs.execute();
    return cs.getLong(16);
});
```

## Ventajas del Enfoque Híbrido

### 1. **Código más limpio**
```java
// Antes (todo PROCEDURE)
50 líneas de código para listar usuarios

// Después (FUNCTION para consultas)
2 líneas de código para listar usuarios
```

### 2. **Más fácil de mantener**
- Cambias la FUNCTION en PostgreSQL
- No tocas el código Java
- Todo sigue funcionando

### 3. **Mejor rendimiento**
- PostgreSQL optimiza mejor las FUNCTION
- Menos overhead de red
- Menos procesamiento en Java

### 4. **Más portable**
- El mismo código Java funciona con:
  - PostgreSQL
  - MySQL (con ajustes menores)
  - Oracle (con ajustes menores)

## Recomendación Final

### ✅ USA FUNCTION para:
- Listar registros (SELECT)
- Obtener un registro por ID (SELECT)
- Consultas con JOIN
- Reportes
- Búsquedas

### ✅ USA PROCEDURE para:
- Crear registros (INSERT)
- Actualizar registros (UPDATE)
- Eliminar registros (UPDATE estado = 0)
- Operaciones complejas con múltiples tablas
- Transacciones que requieren COMMIT/ROLLBACK

## Conclusión

El enfoque híbrido (FUNCTION + PROCEDURE) es:
- ✅ **Más simple** de implementar
- ✅ **Más fácil** de mantener
- ✅ **Más rápido** en ejecución
- ✅ **Más compatible** con diferentes lenguajes
- ✅ **Estándar de la industria** en PostgreSQL

**No es una limitación, es una mejor práctica.**

En C# puedes usar PROCEDURE para todo porque ADO.NET maneja cursores automáticamente. En Java con JDBC, es más eficiente usar FUNCTION para consultas.

## Referencias

- [PostgreSQL Documentation - Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [PostgreSQL Documentation - Procedures](https://www.postgresql.org/docs/current/sql-createprocedure.html)
- [Spring JDBC Best Practices](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc)
