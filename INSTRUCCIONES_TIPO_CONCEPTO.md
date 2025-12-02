# 📋 Implementación de Tipo Concepto

## 🎯 Resumen
Se ha implementado el módulo de **Tipos de Concepto** para el sistema de planillas, incluyendo:
- Tabla en PostgreSQL
- Backend (Spring Boot)
- Frontend (Modal con combobox dinámico)

---

## 📦 1. Base de Datos

### Ejecutar Script SQL
Ejecuta el siguiente archivo en PostgreSQL:
```bash
sql/crear_tabla_tipo_concepto.sql
```

Este script crea:
- ✅ Tabla `rrhh_mtipoconcepto`
- ✅ 5 tipos de concepto:
  - 01 - INGRESOS
  - 02 - DESCUENTOS
  - 03 - APORTES DEL TRABAJADOR
  - 04 - APORTES DEL EMPLEADOR
  - 05 - TOTALES

### Verificar datos
```sql
SELECT * FROM rrhh_mtipoconcepto ORDER BY imtipoconcepto;
```

---

## 🔧 2. Backend (Spring Boot)

### Archivos creados:
```
backend/src/main/java/com/meridian/erp/
├── entity/TipoConcepto.java
├── repository/TipoConceptoRepository.java
├── service/TipoConceptoService.java
└── controller/TipoConceptoController.java
```

### Endpoints disponibles:

#### 1. Listar tipos activos
```http
GET http://localhost:3000/api/tipos-concepto
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tipos de concepto obtenidos exitosamente",
  "data": [
    {
      "id": "01",
      "descripcion": "INGRESOS",
      "estado": 1,
      "fechaCreacion": "2025-11-30T...",
      "fechaModificacion": "2025-11-30T..."
    },
    ...
  ]
}
```

#### 2. Listar todos (activos e inactivos)
```http
GET http://localhost:3000/api/tipos-concepto/todos
```

#### 3. Obtener por ID
```http
GET http://localhost:3000/api/tipos-concepto/01
```

---

## 🎨 3. Frontend

### Archivos modificados:
- `frontend/modules/concepto.html` - Modal actualizado
- `frontend/js/modules/concepto.js` - Función para cargar tipos

### Modal "Nuevo Conceptos"
Cuando presionas el botón **"Nuevo"** en el módulo de Conceptos:

1. Se abre el modal con los campos:
   - **Tipo Concepto** (combobox dinámico - carga desde BD)
   - **Nombre Tributo** (input text)
   - **Descripción** (input text)
   - **Afecto** (radio buttons: Sí/No)
   - **Tipo** (input readonly con "* SELECCIONAR *")

2. El combobox "Tipo Concepto" se llena automáticamente con los datos de la BD

---

## 🧪 4. Pruebas

### Paso 1: Verificar Backend
```bash
# Iniciar el backend
cd backend
mvn spring-boot:run
```

### Paso 2: Probar endpoint
Abre tu navegador o Postman:
```
http://localhost:3000/api/tipos-concepto
```

Deberías ver los 5 tipos de concepto en formato JSON.

### Paso 3: Probar Frontend
1. Inicia sesión en el sistema
2. Ve al módulo **"Conceptos"**
3. Presiona el botón **"Nuevo"**
4. Verifica que el combobox "Tipo Concepto" muestre las opciones:
   - --SELECCIONAR--
   - INGRESOS
   - DESCUENTOS
   - APORTES DEL TRABAJADOR
   - APORTES DEL EMPLEADOR
   - TOTALES

---

## 🐛 Solución de Problemas

### El combobox no carga datos
1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12)
3. Busca errores en la pestaña "Console"
4. Verifica que el endpoint responda: `http://localhost:3000/api/tipos-concepto`

### Error 404 en el endpoint
- Asegúrate de que el backend se haya reiniciado después de agregar los nuevos archivos
- Verifica que los archivos Java estén en las rutas correctas

### El modal no se abre
- Verifica que jQuery y Bootstrap estén cargados
- Revisa la consola del navegador para errores JavaScript

---

## 📝 Notas Adicionales

### Estructura de la tabla
```sql
CREATE TABLE rrhh_mtipoconcepto (
    imtipoconcepto VARCHAR(2) PRIMARY KEY,
    ttc_descripcion VARCHAR(100) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Próximos pasos
- [ ] Implementar guardado de conceptos con tipo_concepto_id
- [ ] Agregar validaciones en el formulario
- [ ] Implementar edición de conceptos
- [ ] Agregar filtros por tipo de concepto en la tabla

---

## ✅ Checklist de Implementación

- [x] Script SQL creado
- [x] Entidad Java creada
- [x] Repository creado
- [x] Service creado
- [x] Controller creado
- [x] Modal actualizado en frontend
- [x] Función JavaScript para cargar tipos
- [ ] Ejecutar script SQL en PostgreSQL
- [ ] Reiniciar backend
- [ ] Probar endpoint
- [ ] Probar modal en frontend

---

**¡Listo para usar!** 🚀
