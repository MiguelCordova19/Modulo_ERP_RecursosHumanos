# Endpoint para Trabajadores Activos en Asistencia

## Resumen
Se implementó un nuevo endpoint en el backend para obtener la lista de trabajadores activos filtrados por sede, turno y fecha, necesario para el módulo de asistencia.

## Cambios Realizados

### 1. Backend - Controller
**Archivo:** `backend/src/main/java/com/meridian/erp/controller/ContratoTrabajadorController.java`

Se agregó el endpoint:
```java
GET /api/contratos/trabajadores-activos
```

**Parámetros:**
- `empresaId` (Integer) - ID de la empresa
- `sedeId` (Long) - ID de la sede
- `turnoId` (String) - ID del turno
- `fecha` (String) - Fecha en formato YYYY-MM-DD

**Respuesta:**
```json
{
  "success": true,
  "message": "Trabajadores obtenidos exitosamente",
  "data": [
    {
      "contratoid": 1,
      "trabajadorid": 123,
      "numerodocumento": "74125874",
      "apellidopaterno": "GARCIA",
      "apellidomaterno": "TORRES",
      "nombres": "MIGUEL ANGEL",
      "fechainiciolaboral": "2025-07-03",
      "fechainiciocontrato": "2025-07-03",
      "horaentrada": "08:00:00",
      "horasalida": "17:00:00",
      "turnoid": "MA",
      "turnodescripcion": "MAÑANA",
      "sedeid": 1,
      "sededescripcion": "CHIHUOTE"
    }
  ]
}
```

### 2. Backend - Service
**Archivo:** `backend/src/main/java/com/meridian/erp/service/ContratoTrabajadorService.java`

Se agregó el método:
```java
public List<Map<String, Object>> listarTrabajadoresActivosPorSedeTurno(
    Integer empresaId, 
    Long sedeId, 
    String turnoId, 
    LocalDate fecha)
```

**Lógica:**
- Consulta la tabla `rrhh_mcontratotrabajador` con JOINs a:
  - `rrhh_trabajador` - Datos del trabajador
  - `rrhh_msede` - Datos de la sede
  - `rrhh_mturno` - Datos del turno
- Filtra por:
  - Empresa
  - Sede
  - Turno
  - Estado activo (ict_estado = 1)
  - Fecha dentro del rango del contrato
- Ordena por apellidos y nombres

### 3. Frontend - JavaScript
**Archivo:** `frontend/js/modules/asistencia.js`

El método `consultarTrabajadores()` ya está configurado para consumir este endpoint:
```javascript
const url = `/api/contratos/trabajadores-activos?empresaId=${empresaId}&sedeId=${sedeId}&turnoId=${turnoId}&fecha=${fecha}`;
```

## Flujo de Uso

1. Usuario abre el modal "Nueva Asistencia"
2. Selecciona: Fecha, Sede y Turno
3. Hace clic en "Consultar"
4. El sistema llama al endpoint con los filtros
5. Se cargan los trabajadores que cumplen con:
   - Estar asignados a esa sede
   - Estar asignados a ese turno
   - Tener contrato activo en esa fecha
6. Se muestra la tabla con los campos:
   - Nro. Documento
   - Apellidos y Nombres
   - Fecha Inicio
   - Checkboxes: Día Descanso, Compró Día Descanso, Día Feriado, Día Feriado Trabajó, Faltó
   - Campos de tiempo: Hora Entrada, Hora Ingreso, Hora Tardanza
   - Campo de texto: Observación

## Próximos Pasos

### 1. Compilar y Reiniciar el Backend

**Opción A - Desde la terminal (recomendado):**
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**Opción B - Si usas IDE (IntelliJ/Eclipse):**
- Ejecutar la clase principal con el método `main()`
- Generalmente está en: `src/main/java/com/meridian/erp/Application.java` o similar

### 2. Verificar que el Backend esté Corriendo

El backend debería estar corriendo en: `http://localhost:8080`

Puedes verificar accediendo a:
```
http://localhost:8080/api/contratos/trabajadores-activos?empresaId=3&sedeId=1&turnoId=MA&fecha=2025-12-03
```

### 3. Probar desde el Frontend

1. Abrir el módulo de Asistencia
2. Hacer clic en "Nuevo"
3. Seleccionar: Fecha, Sede y Turno
4. Hacer clic en "Consultar"
5. Verificar que se carguen los trabajadores

### 4. Implementar el Guardado de Asistencia Masiva

Una vez que los trabajadores se carguen correctamente, el siguiente paso será implementar el guardado completo en la base de datos.

## Notas Técnicas

- La consulta SQL usa los nombres correctos de las columnas según las entidades JPA
- Se valida que la fecha del contrato esté vigente (fecha inicio <= fecha consulta AND (fecha fin IS NULL OR fecha fin >= fecha consulta))
- Los resultados se ordenan alfabéticamente por apellidos y nombres
