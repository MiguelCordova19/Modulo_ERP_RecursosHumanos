# 🚀 Guía de Implementación: Empresas y Usuarios con Base de Datos

## ✅ Lo que se ha Implementado

### 1. Backend - API REST para Empresas

**Archivos creados:**

#### `EmpresaController.java`
Endpoints disponibles:
- `GET /api/empresas` - Listar todas las empresas
- `GET /api/empresas/activas` - Listar empresas activas
- `GET /api/empresas/{id}` - Obtener empresa por ID
- `POST /api/empresas` - Crear nueva empresa
- `PUT /api/empresas/{id}` - Actualizar empresa
- `DELETE /api/empresas/{id}` - Eliminar empresa (cambia estado a inactivo)

#### `EmpresaService.java`
Lógica de negocio para empresas

#### `EmpresaRepository.java` (actualizado)
Agregado método `findByEstado(Integer estado)`

### 2. Frontend - Módulo de Empresas

**Archivo actualizado:** `frontend/js/modules/empresas.js`

**Funcionalidades:**
- ✅ Cargar empresas desde la API
- ✅ Crear nueva empresa
- ✅ Eliminar empresa
- ✅ Notificaciones de éxito/error
- ✅ Tabla dinámica con datos de la BD

---

## 🚀 Cómo Usar

### Paso 1: Reiniciar el Backend

```bash
cd backend
mvn spring-boot:run
```

### Paso 2: Verificar los Endpoints

**Probar en el navegador:**
```
http://localhost:3000/api/empresas
```

**Deberías ver:**
```json
{
  "success": true,
  "message": "Empresas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "descripcion": "EMPRESA TEST",
      "estado": 1
    }
  ]
}
```

### Paso 3: Usar el Módulo de Empresas

1. **Login en el sistema:**
   ```
   http://localhost:5500/login.html
   Usuario: admin
   Contraseña: admin123
   ```

2. **Ir al módulo de empresas:**
   - En el menú lateral, busca "Empresas" (si está disponible)
   - O carga directamente: `http://localhost:5500/modules/empresas.html`

3. **Crear una nueva empresa:**
   - Click en "Nueva Empresa"
   - Llenar el formulario:
     - Nombre de la Empresa: (requerido)
     - Estado: Activa/Inactiva
   - Click en "Guardar"

4. **Ver la empresa creada:**
   - La tabla se actualizará automáticamente
   - Los datos vienen directamente de la base de datos

---

## 📊 Estructura de la Tabla Empresa

```sql
CREATE TABLE rrhh_mempresa (
    imempresa_id BIGSERIAL PRIMARY KEY,
    te_descripcion VARCHAR(100),
    ie_estado INTEGER
);
```

**Campos:**
- `imempresa_id`: ID autoincremental
- `te_descripcion`: Nombre de la empresa
- `ie_estado`: Estado (1 = Activa, 0 = Inactiva)

---

## 🔄 Flujo de Creación de Empresa

```
1. Usuario hace click en "Nueva Empresa"
   ↓
2. Se abre el modal con el formulario
   ↓
3. Usuario llena los datos:
   - Nombre de la Empresa
   - Estado
   ↓
4. Click en "Guardar"
   ↓
5. JavaScript hace POST a /api/empresas
   {
     "descripcion": "Mi Empresa",
     "estado": 1
   }
   ↓
6. Backend (Spring Boot):
   - EmpresaController recibe la petición
   - EmpresaService guarda en la BD
   - PostgreSQL inserta el registro
   ↓
7. Backend responde:
   {
     "success": true,
     "message": "Empresa creada exitosamente",
     "data": { "id": 2, "descripcion": "Mi Empresa", "estado": 1 }
   }
   ↓
8. Frontend:
   - Muestra notificación de éxito
   - Cierra el modal
   - Recarga la tabla con los datos actualizados
   ↓
9. ✅ Empresa visible en la tabla
```

---

## 👥 Próximo Paso: Usuarios con Empresas

### Modificaciones Necesarias

#### 1. Actualizar el formulario de usuarios

**En `frontend/modules/usuarios.html`:**

```html
<select class="form-select" id="empresa" required>
    <option value="">Seleccionar empresa...</option>
    <!-- Se llenará dinámicamente desde la API -->
</select>
```

#### 2. Cargar empresas en el select

**En `frontend/js/modules/usuarios.js`:**

```javascript
async cargarEmpresas() {
    const response = await fetch('/api/empresas/activas');
    const result = await response.json();
    
    if (result.success) {
        const select = document.getElementById('empresa');
        select.innerHTML = '<option value="">Seleccionar empresa...</option>';
        
        result.data.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = empresa.descripcion;
            select.appendChild(option);
        });
    }
}
```

#### 3. Guardar usuario con empresa

```javascript
async guardarUsuario() {
    const usuario = {
        apellidoPaterno: $('#apellidos').val().split(' ')[0],
        apellidoMaterno: $('#apellidos').val().split(' ')[1] || '',
        nombres: $('#nombres').val(),
        empresaId: parseInt($('#empresa').val()), // ← ID de la empresa
        tipoDocumentoId: parseInt($('#tipo-doc').val()),
        nroDocumento: $('#nro-doc').val(),
        fechaNacimiento: $('#fecha-nacimiento').val(),
        rolId: parseInt($('#rol').val()),
        nroCelular: $('#telefono').val(),
        correo: $('#email').val(),
        estado: parseInt($('#estado').val()),
        usuario: $('#username').val(),
        password: $('#password').val()
    };
    
    const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    
    const result = await response.json();
    
    if (result.success) {
        // Éxito
        this.mostrarNotificacion('Usuario creado exitosamente', 'success');
        this.cargarUsuarios(); // Recargar tabla
    }
}
```

#### 4. Mostrar empresa en la tabla

La tabla ya mostrará la empresa porque el backend devuelve el objeto `Empresa` relacionado.

---

## 🧪 Pruebas

### Test 1: Crear Empresa

```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Mi Nueva Empresa",
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
    "descripcion": "Mi Nueva Empresa",
    "estado": 1
  }
}
```

### Test 2: Listar Empresas

```bash
curl http://localhost:3000/api/empresas
```

### Test 3: Crear Usuario con Empresa

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type": application/json" \
  -d '{
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "nombres": "Juan",
    "empresaId": 1,
    "usuario": "juan.perez",
    "password": "password123",
    "correo": "juan@empresa.com",
    "estado": 1
  }'
```

---

## 📝 Checklist de Implementación

### Backend
- [x] ✅ EmpresaController creado
- [x] ✅ EmpresaService creado
- [x] ✅ EmpresaRepository actualizado
- [x] ✅ Endpoints funcionando

### Frontend - Empresas
- [x] ✅ empresas.js actualizado
- [x] ✅ Carga empresas desde API
- [x] ✅ Crea empresas en BD
- [x] ✅ Elimina empresas
- [x] ✅ Notificaciones

### Frontend - Usuarios (Pendiente)
- [ ] ⏳ Cargar empresas en el select
- [ ] ⏳ Guardar usuario con empresa
- [ ] ⏳ Mostrar empresa en la tabla
- [ ] ⏳ Filtrar por empresa

---

## 🎯 Próximos Pasos

### 1. Actualizar Módulo de Usuarios

Necesitas decidir si quieres que actualice el archivo `usuarios.js` para:
- Cargar usuarios desde la API (`GET /api/usuarios`)
- Crear usuarios en la BD (`POST /api/usuarios`)
- Cargar empresas en el select
- Mostrar la empresa en la tabla

### 2. Agregar Más Campos a Empresa

Si necesitas más campos (RUC, teléfono, dirección), hay que:
1. Actualizar la entidad `Empresa.java`
2. Actualizar la tabla en la BD
3. Actualizar el formulario en el frontend

### 3. Validaciones

Agregar validaciones como:
- Nombre de empresa único
- RUC válido (11 dígitos)
- Email válido

---

## 📞 Comandos Útiles

### Reiniciar Backend
```bash
cd backend
mvn spring-boot:run
```

### Reiniciar Frontend
```bash
cd frontend
node server.js
```

### Ver logs del backend
Los logs aparecen en la terminal donde corre Spring Boot

### Probar API con navegador
```
http://localhost:3000/api/empresas
http://localhost:3000/api/usuarios
```

---

## ✅ Resumen

**Lo que funciona ahora:**
- ✅ API REST de empresas completa
- ✅ Módulo frontend de empresas conectado a la BD
- ✅ Crear, listar y eliminar empresas
- ✅ Datos persistentes en PostgreSQL

**Lo que falta:**
- ⏳ Actualizar módulo de usuarios para usar la API
- ⏳ Conectar usuarios con empresas
- ⏳ Cargar empresas en el select de usuarios

**¿Quieres que continúe con la actualización del módulo de usuarios?**
