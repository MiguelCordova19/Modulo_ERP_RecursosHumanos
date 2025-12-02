# Instrucciones para Implementar Módulo de Trabajadores

## 📋 Resumen
Se ha implementado el módulo completo de Trabajadores con validaciones y campos obligatorios según los requerimientos.

## 🗄️ Base de Datos

### 1. Crear la tabla de trabajadores
Ejecutar el script SQL:
```sql
sql/crear_tabla_trabajador.sql
```

Este script crea la tabla `rrhh_trabajador` con todos los campos necesarios.

## 🔧 Backend (Java Spring Boot)

Se han creado los siguientes archivos:

### Entidades y DTOs
- `backend/src/main/java/com/meridian/erp/entity/Trabajador.java` - Entidad JPA
- `backend/src/main/java/com/meridian/erp/dto/TrabajadorDTO.java` - DTO para transferencia de datos

### Repositorio
- `backend/src/main/java/com/meridian/erp/repository/TrabajadorRepository.java`

### Servicio
- `backend/src/main/java/com/meridian/erp/service/TrabajadorService.java`
  - Validaciones de campos obligatorios
  - Validación de formato de documentos (DNI 8 dígitos, CE 9 dígitos, Pasaporte 7-12 caracteres)
  - Validación de cuentas bancarias (10-20 dígitos)
  - Verificación de documentos duplicados

### Controlador
- `backend/src/main/java/com/meridian/erp/controller/TrabajadorController.java`

## 📡 Endpoints Disponibles

### Listar trabajadores por empresa
```
GET /api/trabajadores/empresa/{empresaId}
```

### Listar trabajadores activos
```
GET /api/trabajadores/empresa/{empresaId}/activos
```

### Obtener trabajador por ID
```
GET /api/trabajadores/{id}
```

### Crear trabajador
```
POST /api/trabajadores
Headers: Usuario-Id: {usuarioId}
Body: TrabajadorDTO (JSON)
```

### Actualizar trabajador
```
PUT /api/trabajadores/{id}
Headers: Usuario-Id: {usuarioId}
Body: TrabajadorDTO (JSON)
```

### Eliminar trabajador (lógico)
```
DELETE /api/trabajadores/{id}
Headers: Usuario-Id: {usuarioId}
```

## 🎨 Frontend

### Archivos actualizados
- `frontend/js/modules/trabajador.js` - Lógica completa del módulo

### Funcionalidades implementadas
- ✅ Listar trabajadores en DataTable
- ✅ Crear nuevo trabajador
- ✅ Editar trabajador existente
- ✅ Eliminar trabajador (lógico)
- ✅ Validaciones de formulario
- ✅ Carga dinámica de selects (tipos documento, géneros, estados civiles, etc.)

## ✅ Campos Obligatorios Implementados

### Pestaña Datos Personales
- ✅ Tipo de Trabajador (PLANILLA/RRHH)
- ✅ Tipo de Documento
- ✅ Número de Documento (con validaciones por tipo)
- ✅ Apellido Paterno
- ✅ Nombres
- ✅ Número de Celular
- ✅ Correo Electrónico
- ✅ Fecha de Nacimiento
- ✅ Sexo/Género
- ✅ Estado Civil
- ✅ Régimen Laboral

**Nota:** Apellido Materno NO es obligatorio

### Pestaña Remuneración
- ✅ Tipo de Pago
- ✅ Banco
- ✅ Tipo de Cuenta
- ✅ Número de Cuenta (con validaciones)

### Pestaña CTS
- ✅ Banco CTS
- ✅ Número de Cuenta CTS (con validaciones)

### Pestañas Dinámicas (no obligatorias por ahora)
- Datos Laborales
- Datos de Pensión
- Adjuntos

## 🔍 Validaciones Implementadas

### Documentos
- **DNI:** Exactamente 8 dígitos numéricos
- **Carnet de Extranjería:** Exactamente 9 dígitos numéricos
- **Pasaporte:** Entre 7 y 12 caracteres alfanuméricos

### Cuentas Bancarias
- Solo números y guiones permitidos
- Entre 10 y 20 dígitos (sin contar guiones)
- Validación tanto para cuenta de remuneración como CTS

### Duplicados
- No se permite registrar el mismo documento en la misma empresa
- Validación en backend antes de guardar

## 🚀 Pasos para Probar

1. **Ejecutar script SQL:**
   ```sql
   -- Ejecutar en PostgreSQL
   \i sql/crear_tabla_trabajador.sql
   ```

2. **Reiniciar el backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Abrir el módulo en el navegador:**
   - Ir a la sección "Trabajadores"
   - Hacer clic en "Nuevo"
   - Llenar los campos obligatorios en las 3 pestañas principales
   - Guardar

4. **Verificar:**
   - El trabajador debe aparecer en la tabla
   - Debe poder editarse
   - Debe poder eliminarse (cambio de estado)

## 📝 Notas Importantes

1. **Empresa ID:** Se obtiene automáticamente del localStorage o variable global
2. **Usuario ID:** Se envía en el header de las peticiones para auditoría
3. **Estado:** Por defecto se crea como ACTIVO (1)
4. **Eliminación:** Es lógica, cambia el estado a 0 (INACTIVO)
5. **Campos dinámicos:** Las pestañas de Datos Laborales y Pensión se llenarán dinámicamente más adelante

## 🔄 Próximos Pasos

- Implementar carga dinámica de Sedes según Empresa
- Implementar carga dinámica de Puestos
- Implementar módulo de Adjuntos con subida de archivos PDF
- Agregar más validaciones de negocio según requerimientos
- Implementar exportación a Excel/PDF

## ⚠️ Troubleshooting

### Error: "Ya existe un trabajador con este documento"
- Verificar que no exista otro trabajador con el mismo tipo y número de documento en la empresa

### Error: "El DNI debe tener 8 dígitos"
- Asegurarse de ingresar exactamente 8 números sin espacios ni guiones

### Error: "El número de cuenta debe tener entre 10 y 20 dígitos"
- Verificar que la cuenta bancaria tenga el formato correcto
- Puede incluir guiones pero debe tener entre 10-20 dígitos numéricos

### No se cargan los selects
- Verificar que los endpoints de maestros estén funcionando:
  - `/api/tipos-documento`
  - `/api/generos`
  - `/api/estados-civiles`
  - `/api/regimenes-laborales`
  - `/api/tipos-pago`
  - `/api/bancos`
  - `/api/tipos-cuenta`
