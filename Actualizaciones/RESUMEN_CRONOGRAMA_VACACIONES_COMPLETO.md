# Sistema de Cronograma de Vacaciones - Implementación Completa

## ✅ Archivos Creados

### Frontend:
1. **frontend/modules/cronograma-vacaciones.html** - Vista con tabla y modal de generación
2. **frontend/js/modules/cronograma-vacaciones.js** - Lógica completa del módulo

### Backend (SQL):
3. **sql/crear_tablas_cronograma_vacaciones.sql** - Script completo con:
   - Tabla `rrhh_mcronogramavacaciones` (cabecera)
   - Tabla `rrhh_mcronogramavacacionesdetalle` (detalle)
   - Procedimiento `sp_generar_cronograma_vacaciones`
   - Procedimiento `sp_listar_cronogramas_vacaciones`

## 📊 Estructura de Tablas

### Tabla Cabecera: rrhh_mcronogramavacaciones
```sql
- imcronogramavacaciones_id (BIGSERIAL PK)
- fcv_fechadesde (DATE) - Fecha desde
- fcv_fechahasta (DATE) - Fecha hasta
- icv_anio (INTEGER) - Año del cronograma
- icv_empresa (BIGINT) - ID empresa
- icv_estado (INTEGER) - Estado
- Campos de auditoría (usuario/fecha registro, edición, eliminación)
```

### Tabla Detalle: rrhh_mcronogramavacacionesdetalle
```sql
- imcronogramavacacionesdetalle_id (BIGSERIAL PK)
- icvd_cronogramavacaciones (BIGINT FK) - ID cronograma
- icvd_trabajador (BIGINT FK) - ID trabajador
- fcvd_fechainicio (DATE) - Fecha inicio vacaciones
- fcvd_fechafin (DATE) - Fecha fin vacaciones
- icvd_dias (INTEGER) - Días de vacaciones
- tcvd_observaciones (VARCHAR) - Observaciones
- icvd_empresa (BIGINT) - ID empresa
- icvd_estado (INTEGER) - Estado
```

## 🔄 Lógica de Generación

1. **Usuario selecciona rango de fechas** (Desde/Hasta)
2. **Sistema extrae el año** de la fecha desde
3. **Verifica si existe cronograma** para ese año y empresa
4. **Si existe**: Actualiza cabecera y elimina detalles anteriores
5. **Si no existe**: Crea nueva cabecera
6. **Inserta detalles**: Un registro por cada trabajador activo que tenga contrato vigente en el rango de fechas
7. **Campos iniciales**: fechainicio, fechafin y días quedan NULL (para que el usuario los complete después)

## 🔌 Endpoints Necesarios (Backend Java)

### 1. Generar Cronograma
```
POST /api/cronograma-vacaciones/generar
Body: {
  "fechaDesde": "2025-01-01",
  "fechaHasta": "2025-12-31",
  "empresaId": 3,
  "usuarioId": 1
}
Response: {
  "success": true,
  "message": "Cronograma generado exitosamente",
  "data": cronogramaId
}
```

### 2. Listar Cronogramas
```
GET /api/cronograma-vacaciones?empresaId=3
Response: {
  "success": true,
  "data": [
    {
      "cronograma_id": 1,
      "fecha_desde": "2025-01-01",
      "fecha_hasta": "2025-12-31",
      "anio": 2025,
      "total_trabajadores": 109
    }
  ]
}
```

### 3. Obtener Detalle de Cronograma
```
GET /api/cronograma-vacaciones/{id}/detalle
Response: {
  "success": true,
  "data": [
    {
      "trabajador_id": 1,
      "numero_documento": "75782001",
      "apellidos_nombres": "AGUILAR RAMIREZ ANDY LIONEL",
      "sede": "CHIMBOTE",
      "cargo": "AGENTE DE SERVICIO",
      "fecha_ingreso": "2025-04-01",
      "fecha_inicio": null,
      "fecha_fin": null,
      "dias": null,
      "observaciones": null
    }
  ]
}
```

### 4. Eliminar Cronograma
```
DELETE /api/cronograma-vacaciones/{id}?usuarioId=1
Response: {
  "success": true,
  "message": "Cronograma eliminado exitosamente"
}
```

## 📝 Próximos Pasos

1. **Ejecutar el script SQL** en PostgreSQL
2. **Crear entidades Java**:
   - CronogramaVacaciones.java
   - CronogramaVacacionesDetalle.java
3. **Crear servicio**: CronogramaVacacionesService.java
4. **Crear controlador**: CronogramaVacacionesController.java
5. **Probar generación** desde el frontend

## 🎯 Funcionalidades Implementadas

- ✅ Modal de generación con rango de fechas
- ✅ Tabla con DataTables
- ✅ Botones Ver y Eliminar
- ✅ Script SQL completo
- ✅ Procedimientos almacenados
- ⏳ Endpoints backend (pendiente)
- ⏳ Modal de detalle para ver/editar vacaciones por trabajador (pendiente)

## 💡 Notas Importantes

- Un cronograma por año por empresa (constraint único)
- Si se regenera, actualiza cabecera y recrea detalles
- Los trabajadores se agregan automáticamente según contratos activos
- Las fechas de vacaciones se completan después manualmente
- El modal "Ver" mostrará todos los trabajadores con opción de asignar fechas
