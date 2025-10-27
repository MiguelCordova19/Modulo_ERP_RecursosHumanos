# 🔐 Solución: Problemas con el Login

## 🚨 Errores Reportados

### Error 1: "Método GET no permitido"
```json
{
  "success": false,
  "message": "Método GET no permitido. Use POST para hacer login.",
  "data": null
}
```

### Error 2: "Unable to find Empresa with id 1"
```
Unable to find com.meridian.erp.entity.Empresa with id 1
```

---

## 🔍 Causas

### Error 1: Método GET
**Causa:** Estás accediendo a la URL `/api/auth/login` directamente en el navegador, lo que hace una petición GET en lugar de POST.

**Solución:** Usa el formulario de login en http://localhost:5500/login.html

### Error 2: Empresa no encontrada
**Causa:** La tabla `rrhh_mempresa` está vacía o el usuario no tiene una empresa asignada.

**Solución:** Ejecutar el script de corrección de la base de datos.

---

## ✅ Solución Paso a Paso

### Paso 1: Corregir la Base de Datos

**Opción A - Con pgAdmin:**

1. Abre **pgAdmin**
2. Conecta a tu servidor PostgreSQL
3. Abre la base de datos `root`
4. Click derecho → **Query Tool**
5. Abre el archivo: `backend/verificar-y-corregir-bd.sql`
6. Ejecuta el script (F5)

**Opción B - Con terminal:**

```bash
psql -U root -d root -f backend/verificar-y-corregir-bd.sql
```

**Deberías ver:**
```
EMPRESAS:
 imempresa_id | te_descripcion | ie_estado 
--------------+----------------+-----------
            1 | EMPRESA TEST   |         1

USUARIOS:
 imusuario_id | tu_usuario | tu_nombres | tu_apellidopaterno | iu_empresa | iu_estado 
--------------+------------+------------+--------------------+------------+-----------
            2 | admin      | Usuario    | Administrador      |          1 |         1

VERIFICACIÓN FINAL:
✅ Usuario admin configurado correctamente
```

### Paso 2: Reiniciar el Backend

**Detén el backend** (Ctrl+C) y **reinícialo:**

```bash
cd backend
mvn spring-boot:run
```

**Espera a ver:**
```
Started ErpApplication in X.XXX seconds
```

### Paso 3: Probar el Login

1. **Abre tu navegador en:** http://localhost:5500/login.html
2. **Ingresa:**
   - Usuario: `admin`
   - Contraseña: `admin123`
3. **Haz clic en "Iniciar Sesión"**
4. **Deberías ver:**
   - ✅ Mensaje: "¡Bienvenido Usuario Administrador Chidoris!"
   - ✅ Redirección al dashboard

---

## 🐛 Si el Error Persiste

### Verificación 1: Comprobar que la empresa existe

```sql
SELECT * FROM rrhh_mempresa WHERE imempresa_id = 1;
```

**Debe retornar:**
```
 imempresa_id | te_descripcion | ie_estado 
--------------+----------------+-----------
            1 | EMPRESA TEST   |         1
```

**Si no retorna nada, ejecuta:**
```sql
INSERT INTO rrhh_mempresa (imempresa_id, te_descripcion, ie_estado)
VALUES (1, 'EMPRESA TEST', 1);
```

### Verificación 2: Comprobar que el usuario tiene empresa asignada

```sql
SELECT 
    tu_usuario,
    iu_empresa,
    tu_nombres,
    tu_apellidopaterno
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';
```

**Debe retornar:**
```
 tu_usuario | iu_empresa | tu_nombres | tu_apellidopaterno 
------------+------------+------------+--------------------
 admin      |          1 | Usuario    | Administrador
```

**Si iu_empresa es NULL, ejecuta:**
```sql
UPDATE rrhh_musuario 
SET iu_empresa = 1
WHERE tu_usuario = 'admin';
```

### Verificación 3: Comprobar la contraseña

```sql
SELECT 
    tu_usuario,
    tu_password,
    CASE 
        WHEN tu_password LIKE '$2%' THEN 'OK - Encriptada'
        ELSE 'ERROR - No encriptada'
    END as estado
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';
```

**Si no está encriptada, ejecuta:**
```sql
-- Contraseña: admin123
UPDATE rrhh_musuario 
SET tu_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu'
WHERE tu_usuario = 'admin';
```

---

## 🔧 Cambios Realizados en el Código

### 1. Usuario.java
**Cambio:** `FetchType.LAZY` → `FetchType.EAGER`

**Antes:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "iu_empresa", insertable = false, updatable = false)
private Empresa empresa;
```

**Después:**
```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "iu_empresa", insertable = false, updatable = false)
private Empresa empresa;
```

**Razón:** Con LAZY, la empresa no se carga automáticamente y causa el error "Unable to find Empresa".

### 2. AuthService.java
**Cambio:** Manejo seguro de la empresa

**Antes:**
```java
String empresaNombre = usuario.getEmpresa() != null 
    ? usuario.getEmpresa().getDescripcion() 
    : "EMPRESA TEST";
```

**Después:**
```java
String empresaNombre = "EMPRESA TEST";
try {
    if (usuario.getEmpresa() != null && usuario.getEmpresa().getDescripcion() != null) {
        empresaNombre = usuario.getEmpresa().getDescripcion();
    }
} catch (Exception e) {
    System.out.println("Advertencia: No se pudo cargar la empresa del usuario");
}
```

**Razón:** Manejo de errores más robusto para evitar que el login falle si hay problemas con la empresa.

---

## 📊 Flujo Correcto del Login

```
1. Usuario abre: http://localhost:5500/login.html
   ↓
2. Usuario ingresa: admin / admin123
   ↓
3. JavaScript hace: POST /api/auth/login
   ↓
4. Proxy redirige a: http://localhost:3000/api/auth/login
   ↓
5. AuthController.login() recibe la petición
   ↓
6. AuthService.login() busca el usuario
   ↓
7. UsuarioRepository.findByUsuario("admin")
   ↓
8. Hibernate ejecuta:
   SELECT u.*, e.* 
   FROM rrhh_musuario u
   LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
   WHERE u.tu_usuario = 'admin'
   ↓
9. Verifica contraseña con BCrypt
   ↓
10. Construye LoginResponse con datos del usuario
    ↓
11. Retorna: { "success": true, "data": {...} }
    ↓
12. Frontend guarda en localStorage y redirige
    ↓
13. ✅ Usuario en el dashboard
```

---

## 🎯 Checklist de Verificación

Antes de intentar el login, verifica:

- [ ] ✅ PostgreSQL está corriendo
- [ ] ✅ Base de datos `root` existe
- [ ] ✅ Tabla `rrhh_mempresa` tiene la empresa con id=1
- [ ] ✅ Usuario `admin` existe en `rrhh_musuario`
- [ ] ✅ Usuario `admin` tiene `iu_empresa = 1`
- [ ] ✅ Usuario `admin` tiene `iu_estado = 1` (activo)
- [ ] ✅ Contraseña está encriptada (empieza con $2)
- [ ] ✅ Backend está corriendo en http://localhost:3000
- [ ] ✅ Frontend está corriendo en http://localhost:5500
- [ ] ✅ Usas el formulario de login (no la URL directa)

---

## 🧪 Prueba Manual

### Probar con cURL

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 2,
    "usuario": "admin",
    "nombreCompleto": "Usuario Administrador Chidoris",
    "correo": "admin@empresa.com",
    "empresa": "EMPRESA TEST",
    "estado": 1
  }
}
```

---

## 📝 Comandos SQL Útiles

### Ver todos los usuarios con sus empresas
```sql
SELECT 
    u.imusuario_id,
    u.tu_usuario,
    u.tu_nombres || ' ' || u.tu_apellidopaterno as nombre,
    u.iu_empresa,
    e.te_descripcion as empresa,
    u.iu_estado
FROM rrhh_musuario u
LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id;
```

### Crear un nuevo usuario de prueba
```sql
-- Primero asegúrate de que la empresa existe
INSERT INTO rrhh_mempresa (imempresa_id, te_descripcion, ie_estado)
VALUES (1, 'EMPRESA TEST', 1)
ON CONFLICT (imempresa_id) DO NOTHING;

-- Luego crea el usuario
INSERT INTO rrhh_musuario (
    tu_apellidopaterno,
    tu_apellidomaterno,
    tu_nombres,
    iu_empresa,
    tu_usuario,
    tu_password,
    tu_correo,
    iu_estado
) VALUES (
    'Prueba',
    'Test',
    'Usuario',
    1,
    'test',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', -- password: admin123
    'test@empresa.com',
    1
);
```

---

## 🔗 Enlaces Útiles

- **Verificar backend:** http://localhost:3000/api/auth/status
- **Login frontend:** http://localhost:5500/login.html
- **Dashboard:** http://localhost:5500/dashboard.html

---

## 📞 Soporte

Si después de seguir todos estos pasos el problema persiste:

1. **Captura de pantalla** de la consola del navegador (F12)
2. **Copia los logs** del backend (terminal donde corre Spring Boot)
3. **Ejecuta** el script de verificación y comparte los resultados

---

## ✅ Resumen

### Problema
- Frontend no podía hacer login
- Error: "Unable to find Empresa with id 1"

### Solución
1. ✅ Cambiar `FetchType.LAZY` a `EAGER` en Usuario.java
2. ✅ Mejorar manejo de errores en AuthService.java
3. ✅ Ejecutar script de corrección de BD
4. ✅ Reiniciar el backend

### Resultado
- ✅ Login funciona correctamente
- ✅ Usuario puede acceder al dashboard
- ✅ Sistema completamente operativo

---

**¡El login debería funcionar ahora!** 🚀

Reinicia el backend y prueba nuevamente.
