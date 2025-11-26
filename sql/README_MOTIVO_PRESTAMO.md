# Instrucciones para Configurar Motivo Préstamo

## Orden de Ejecución de Scripts SQL

Ejecuta los siguientes scripts en SQL Server Management Studio en este orden:

### 1. Crear la tabla
```sql
-- Ejecutar: sql/01_crear_tabla_motivo_prestamo.sql
```
Este script crea la tabla `RRHH_MMOTIVOPRESTAMO` con:
- Campo ID autoincremental
- Campo descripción (VARCHAR 100)
- Campo estado (INT, default 1)
- Campo empresaId (INT, con FK a RRHH_MEMPRESA)
- Campos de auditoría (fechaCreacion, fechaModificacion)
- Índices para optimizar consultas

### 2. Insertar datos de ejemplo
```sql
-- Ejecutar: sql/02_insertar_datos_motivo_prestamo.sql
```
Este script inserta motivos de préstamo de ejemplo:
- Emergencia médica
- Educación
- Vivienda
- Vehículo
- Calamidad doméstica
- Gastos personales
- Consolidación de deudas

### 3. Crear procedimientos almacenados
```sql
-- Ejecutar: sql/03_procedimientos_motivo_prestamo.sql
```
Este script crea los siguientes procedimientos:
- `SP_LISTAR_MOTIVOS_PRESTAMO` - Lista motivos por empresa
- `SP_OBTENER_MOTIVO_PRESTAMO` - Obtiene un motivo por ID
- `SP_CREAR_MOTIVO_PRESTAMO` - Crea un nuevo motivo
- `SP_ACTUALIZAR_MOTIVO_PRESTAMO` - Actualiza un motivo existente
- `SP_ELIMINAR_MOTIVO_PRESTAMO` - Cambia el estado a inactivo (0)

## Verificación

Después de ejecutar los scripts, verifica que todo esté correcto:

```sql
-- Verificar que la tabla existe
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'RRHH_MMOTIVOPRESTAMO';

-- Verificar datos insertados
SELECT * FROM RRHH_MMOTIVOPRESTAMO;

-- Verificar procedimientos almacenados
SELECT name FROM sys.procedures 
WHERE name LIKE '%MOTIVO_PRESTAMO%';

-- Probar listar motivos
DECLARE @EmpresaId INT = 1;
EXEC SP_LISTAR_MOTIVOS_PRESTAMO @EmpresaId;
```

## Características del Sistema

### Frontend
- Modal simplificado con diseño moderno
- SweetAlert2 para confirmaciones elegantes
- Validaciones en tiempo real
- DataTables con filtros por columna
- Botones de acción (Editar/Eliminar)

### Backend (Java Spring Boot)
- Entity: `MotivoPrestamo.java`
- Repository: `MotivoPrestamoRepository.java`
- Service: `MotivoPrestamoService.java`
- Controller: `MotivoPrestamoController.java`
- API REST completa (GET, POST, PUT, DELETE)

### Base de Datos
- Tabla con soporte multi-empresa
- Procedimientos almacenados con validaciones
- Eliminación lógica (cambio de estado)
- Auditoría con fechas de creación/modificación

## Funcionalidades

1. **Crear Motivo**: Abre modal, ingresa descripción, confirma con SweetAlert
2. **Editar Motivo**: Click en botón editar, modifica descripción, confirma
3. **Eliminar Motivo**: Click en botón eliminar, confirma, cambia estado a 0
4. **Listar Motivos**: Tabla con filtros, paginación y búsqueda
5. **Actualizar**: Recarga datos de la tabla

## Notas Importantes

- Todos los motivos están asociados a una empresa
- La eliminación es lógica (estado = 0), no física
- Las validaciones previenen duplicados por empresa
- SweetAlert2 proporciona confirmaciones para todas las acciones
- El sistema usa el empresaId del localStorage del usuario logueado
