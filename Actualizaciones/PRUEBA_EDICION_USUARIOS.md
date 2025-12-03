# 🧪 Guía de Prueba - Edición de Usuarios

## Pasos para Probar la Funcionalidad

### 1️⃣ Preparación
```bash
# Asegúrate de que el backend esté corriendo
cd backend
mvn spring-boot:run

# En otra terminal, asegúrate de que el frontend esté servido
# (o abre directamente el archivo HTML en el navegador)
```

### 2️⃣ Acceder al Sistema
1. Abre el navegador en `http://localhost:3000` (o donde tengas el frontend)
2. Inicia sesión con tus credenciales
3. Navega al módulo "Gestión de Usuarios"

### 3️⃣ Probar Modo CREACIÓN (sin cambios)
1. Click en botón "Nuevo Usuario"
2. Verifica que el título diga: **"Registrar Usuario"**
3. Llena el formulario con datos de prueba
4. Click en **"Siguiente"**
5. Verifica que aparezca el modal de credenciales
6. Ingresa usuario y contraseña
7. Click en **"Guardar Usuario"**
8. Verifica que el usuario se cree correctamente
9. Verifica que vuelvas a la lista de usuarios

### 4️⃣ Probar Modo EDICIÓN (nueva funcionalidad)
1. En la tabla de usuarios, localiza el usuario recién creado
2. Click en el botón **"Editar"** (ícono de lápiz ✏️)
3. **Verificaciones importantes:**
   - ✅ El título debe cambiar a: **"Editar Usuario"**
   - ✅ El formulario debe estar pre-cargado con los datos del usuario
   - ✅ El botón debe decir: **"Actualizar"** (no "Siguiente")
4. Modifica algunos campos (ej: teléfono, email, nombres)
5. Click en **"Actualizar"**
6. **Verificaciones:**
   - ✅ NO debe aparecer el modal de credenciales
   - ✅ Debe guardar directamente
   - ✅ Debe mostrar mensaje de éxito
   - ✅ Debe volver a la lista de usuarios
7. Verifica en la tabla que los cambios se hayan guardado

### 5️⃣ Casos de Prueba Adicionales

#### Caso 1: Validaciones en Edición
- Intenta dejar campos requeridos vacíos
- Verifica que las validaciones funcionen igual que en creación

#### Caso 2: Cancelar Edición
- Abre un usuario para editar
- Modifica algunos campos
- Click en "Cancelar"
- Verifica que vuelva a la lista sin guardar cambios

#### Caso 3: Editar Múltiples Usuarios
- Edita varios usuarios consecutivamente
- Verifica que cada uno cargue sus propios datos correctamente

#### Caso 4: Volver a Lista desde Edición
- Abre un usuario para editar
- Click en "Volver a Lista"
- Verifica que regrese sin problemas

### 6️⃣ Verificación en Base de Datos

```sql
-- Verificar que el usuario se actualizó correctamente
SELECT 
    id,
    tu_usuario,
    tu_nombres,
    tu_apellido_paterno,
    tu_apellido_materno,
    tu_correo,
    tu_nro_celular,
    iu_estado
FROM rrhh_musuario
WHERE id = [ID_DEL_USUARIO_EDITADO];
```

### 7️⃣ Verificación en Consola del Navegador

Abre las DevTools (F12) y verifica los logs:

**Al abrir para editar:**
```
✅ Módulo Registro Usuario inicializado
📝 Modo EDICIÓN - Usuario ID: [ID]
📥 Cargando datos del usuario: [ID]
✅ Datos del usuario cargados: {...}
✅ Formulario cargado con datos del usuario
```

**Al actualizar:**
```
💾 Actualizando usuario...
📤 Enviando actualización al backend: {...}
✅ Respuesta del backend: {...}
```

### 8️⃣ Verificación de Endpoints

Puedes probar los endpoints directamente con curl o Postman:

```bash
# Obtener usuario por ID
curl http://localhost:3000/api/usuarios/1

# Actualizar usuario
curl -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan Modificado",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "empresaId": 1,
    "sedeId": null,
    "tipoDocumentoId": 1,
    "nroDocumento": "12345678",
    "fechaNacimiento": "1990-01-01",
    "rolId": 2,
    "puestoId": null,
    "nroCelular": "999888777",
    "correo": "juan.modificado@test.com",
    "estado": 1
  }'
```

## ✅ Checklist de Funcionalidad

- [ ] El botón "Editar" en la tabla funciona
- [ ] El formulario se carga con datos del usuario
- [ ] El título cambia a "Editar Usuario"
- [ ] El botón cambia a "Actualizar"
- [ ] NO aparece el modal de credenciales en edición
- [ ] Los cambios se guardan correctamente
- [ ] Vuelve a la lista después de actualizar
- [ ] Las validaciones funcionan en modo edición
- [ ] El botón "Cancelar" funciona
- [ ] El botón "Volver a Lista" funciona
- [ ] El modo creación sigue funcionando normal
- [ ] Los logs en consola son correctos

## 🐛 Problemas Comunes y Soluciones

### Problema: El formulario no se carga con datos
**Solución:** Verifica que el endpoint `GET /api/usuarios/{id}` esté funcionando

### Problema: El modal de credenciales aparece en edición
**Solución:** Verifica que `window.MODULE_PARAM` tenga el ID del usuario

### Problema: Los cambios no se guardan
**Solución:** Verifica que el endpoint `PUT /api/usuarios/{id}` esté funcionando

### Problema: Error "Usuario no encontrado"
**Solución:** Verifica que el ID del usuario sea válido y exista en la BD

## 📊 Resultados Esperados

✅ **Modo Creación:** Funciona igual que antes
✅ **Modo Edición:** Nuevo, funciona correctamente
✅ **Sin Duplicación:** Un solo formulario para ambos modos
✅ **UX Mejorada:** Interfaz clara y consistente
