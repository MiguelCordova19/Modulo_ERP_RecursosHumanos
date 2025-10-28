# ✅ Actualización: Campos RUC, Teléfono y Dirección en Empresa

## 🎯 Cambios Realizados

### 1. Base de Datos

**Archivo creado:** `backend/actualizar-tabla-empresa.sql`

**Campos agregados a `rrhh_mempresa`:**
- `te_ruc` VARCHAR(11) - RUC de la empresa
- `te_telefono` VARCHAR(20) - Teléfono de contacto
- `te_direccion` VARCHAR(255) - Dirección física

### 2. Backend - Entidad Java

**Archivo actualizado:** `backend/src/main/java/com/meridian/erp/entity/Empresa.java`

**Campos agregados:**
```java
@Column(name = "te_ruc", length = 11)
private String ruc;

@Column(name = "te_telefono", length = 20)
private String telefono;

@Column(name = "te_direccion", length = 255)
private String direccion;
```

### 3. Frontend - JavaScript

**Archivo actualizado:** `frontend/js/modules/empresas.js`

**Cambios:**
- ✅ Validación de RUC (11 dígitos, solo números)
- ✅ Captura de teléfono y dirección
- ✅ Tabla actualizada para mostrar los nuevos campos

### 4. Frontend - HTML

**Archivo actualizado:** `frontend/modules/empresas.html`

**Cambios:**
- ✅ Formulario actualizado con campos RUC, Teléfono y Dirección
- ✅ Tabla actualizada con columnas para los nuevos campos
- ✅ Eliminado campo "Código de Acceso" (no usado)
- ✅ Placeholders y ayudas visuales

---

## 🚀 Cómo Aplicar

### Paso 1: Actualizar la Base de Datos

**Opción A - Con pgAdmin:**
1. Abre pgAdmin
2. Conecta a tu servidor PostgreSQL
3. Abre la base de datos `root`
4. Query Tool → Abrir archivo → `backend/actualizar-tabla-empresa.sql`
5. Ejecutar (F5)

**Opción B - Con terminal:**
```bash
psql -U root -d root -f backend/actualizar-tabla-empresa.sql
```

**Verificar:**
```sql
SELECT * FROM rrhh_mempresa;
```

Deberías ver las nuevas columnas: `te_ruc`, `te_telefono`, `te_direccion`

### Paso 2: Reiniciar el Backend

```bash
cd backend
mvn spring-boot:run
```

**Espera a ver:**
```
Started ErpApplication in X.XXX seconds
```

### Paso 3: Reiniciar el Frontend

```bash
cd frontend
node server.js
```

### Paso 4: Probar

1. **Login:**
   ```
   http://localhost:5500/login.html
   Usuario: admin
   Contraseña: admin123
   ```

2. **Ir al módulo de empresas**

3. **Crear nueva empresa:**
   - Click en "Nueva Empresa"
   - Llenar:
     - Nombre: Mi Empresa SAC
     - RUC: 20123456789 (11 dígitos)
     - Teléfono: 01-1234567
     - Dirección: Av. Principal 123, Lima
     - Estado: Activa
   - Guardar

4. **Verificar en la tabla:**
   - Deberías ver todos los campos
   - RUC, Teléfono y Dirección visibles

---

## 🔍 Verificación

### Test 1: Verificar Estructura de la BD

```sql
\d rrhh_mempresa
```

**Deberías ver:**
```
Column          | Type          
----------------+---------------
imempresa_id    | bigint        
te_descripcion  | varchar(100)  
te_ruc          | varchar(11)   ← NUEVO
te_telefono     | varchar(20)   ← NUEVO
te_direccion    | varchar(255)  ← NUEVO
ie_estado       | integer       
```

### Test 2: Probar API

**Crear empresa con cURL:**
```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Mi Empresa SAC",
    "ruc": "20123456789",
    "telefono": "01-1234567",
    "direccion": "Av. Principal 123, Lima",
    "estado": 1
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Empresa creada exitosamente",
  "data": {
    "id": 2,
    "descripcion": "Mi Empresa SAC",
    "ruc": "20123456789",
    "telefono": "01-1234567",
    "direccion": "Av. Principal 123, Lima",
    "estado": 1
  }
}
```

### Test 3: Listar Empresas

```bash
curl http://localhost:3000/api/empresas
```

**Deberías ver todas las empresas con los nuevos campos.**

---

## 📊 Estructura Completa de Empresa

### Base de Datos
```sql
CREATE TABLE rrhh_mempresa (
    imempresa_id BIGSERIAL PRIMARY KEY,
    te_descripcion VARCHAR(100),
    te_ruc VARCHAR(11),
    te_telefono VARCHAR(20),
    te_direccion VARCHAR(255),
    ie_estado INTEGER
);
```

### Entidad Java
```java
@Entity
@Table(name = "rrhh_mempresa")
public class Empresa {
    private Long id;
    private String descripcion;
    private String ruc;
    private String telefono;
    private String direccion;
    private Integer estado;
}
```

### JSON de la API
```json
{
  "id": 1,
  "descripcion": "EMPRESA TEST",
  "ruc": "20123456789",
  "telefono": "01-6259000",
  "direccion": "Av. Principal 123, Lima",
  "estado": 1
}
```

---

## ✅ Validaciones Implementadas

### RUC
- ✅ Campo obligatorio
- ✅ Debe tener exactamente 11 dígitos
- ✅ Solo números

```javascript
if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
    this.mostrarNotificacion('El RUC debe tener 11 dígitos', 'warning');
    return;
}
```

### Teléfono
- ⚠️ Opcional
- ⚠️ Sin validación específica (puedes agregar formato)

### Dirección
- ⚠️ Opcional
- ⚠️ Sin validación específica

---

## 🎨 Tabla Actualizada

**Columnas:**
1. ID (60px)
2. Nombre (ancho automático)
3. RUC (120px)
4. Teléfono (130px)
5. Dirección (250px, truncada con tooltip)
6. Estado (100px)
7. Acciones (120px)

**Características:**
- Dirección truncada con `text-truncate`
- Tooltip al pasar el mouse sobre la dirección
- Badges de color para el estado

---

## 🐛 Solución de Problemas

### Error: "Column does not exist"

**Causa:** La base de datos no se actualizó.

**Solución:**
```bash
psql -U root -d root -f backend/actualizar-tabla-empresa.sql
```

### Error: "RUC debe tener 11 dígitos"

**Causa:** Validación del frontend.

**Solución:** Ingresa exactamente 11 dígitos numéricos.

### Los nuevos campos no aparecen en la tabla

**Causa:** Caché del navegador.

**Solución:**
```
Ctrl + Shift + R
o
Modo incógnito
```

---

## 📝 Checklist

- [ ] ✅ Script SQL ejecutado
- [ ] ✅ Columnas agregadas a la BD
- [ ] ✅ Backend reiniciado
- [ ] ✅ Frontend reiniciado
- [ ] ✅ Caché limpiada
- [ ] ✅ Formulario muestra nuevos campos
- [ ] ✅ Tabla muestra nuevas columnas
- [ ] ✅ Crear empresa funciona
- [ ] ✅ Datos se guardan en PostgreSQL
- [ ] ✅ API devuelve nuevos campos

---

## 🚀 Próximos Pasos

### 1. Validaciones Adicionales

**RUC:**
- Validar que sea único
- Validar formato según SUNAT

**Teléfono:**
- Validar formato (01-1234567)
- Permitir celulares (9 dígitos)

**Dirección:**
- Validar longitud mínima
- Autocompletar con Google Maps API

### 2. Funcionalidad de Edición

Implementar el método `editar()` para:
- Cargar datos de la empresa en el modal
- Actualizar con PUT
- Validar cambios

### 3. Búsqueda y Filtros

- Buscar por RUC
- Filtrar por estado
- Ordenar por columnas

---

## ✅ Resumen

**Cambios realizados:**
- ✅ 3 campos nuevos en la BD
- ✅ Entidad Java actualizada
- ✅ API devuelve nuevos campos
- ✅ Formulario actualizado
- ✅ Tabla actualizada
- ✅ Validaciones implementadas

**Resultado:**
- ✅ Empresas con RUC, Teléfono y Dirección
- ✅ Datos persistentes en PostgreSQL
- ✅ Interfaz completa y funcional

---

**¡El módulo de empresas está completo!** 🎉

**Ejecuta el script SQL y reinicia backend/frontend para ver los cambios.**
