# 🚨 EJECUTA ESTO PARA SOLUCIONAR EL ERROR

## ⚡ Solución Rápida (Copia y Pega)

### Paso 1: Abrir Terminal/CMD

```bash
# Navega a la carpeta del proyecto
cd "C:\Users\User\Documents\ERP RRHH\Modulo_ERP_RecursosHumanos"
```

### Paso 2: Ejecutar Script SQL

```bash
psql -U root -d root -f Scripts/fix_sp_guardar_usuario.sql
```

### Paso 3: Verificar que Funcionó

```bash
psql -U root -d root -f verificar_procedimiento.sql
```

**Deberías ver:**
```
nombre_procedimiento | sp_guardar_usuario
argumentos           | IN p_id bigint, IN p_usuario character varying...
```

### Paso 4: Reiniciar Backend

```bash
# Si el backend está corriendo, detenerlo (Ctrl+C)
# Luego ejecutar:
cd backend
mvn spring-boot:run
```

---

## 🔍 Si Aún No Funciona

### Verificar Conexión a Base de Datos

```bash
psql -U root -d root
```

Dentro de psql:
```sql
-- Ver si la tabla de usuarios existe
\dt rrhh_musuario

-- Ver procedimientos existentes
\df sp_*

-- Salir
\q
```

### Verificar Logs del Backend

Busca en los logs del backend si hay algún error específico sobre el procedimiento.

---

## 📋 Checklist

- [ ] Ejecuté `Scripts/fix_sp_guardar_usuario.sql`
- [ ] Vi el mensaje "✅ Procedimiento sp_guardar_usuario creado exitosamente"
- [ ] Reinicié el backend
- [ ] Probé editar un usuario
- [ ] Funcionó correctamente

---

## 🆘 Si Sigue Sin Funcionar

Ejecuta este comando y envíame el resultado:

```bash
psql -U root -d root -c "\df sp_guardar_usuario"
```

Y también este:

```bash
psql -U root -d root -c "SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'sp_guardar_usuario';"
```

---

**¡Ejecuta el Paso 1 y 2 ahora!** ⚡
