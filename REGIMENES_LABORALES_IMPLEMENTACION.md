# 📋 Implementación de Regímenes Laborales

## 🎯 Resumen
Se ha implementado la tabla de **Regímenes Laborales SUNAT** con 6 regímenes predefinidos.

---

## 📦 Base de Datos

### Script SQL creado:
```
sql/crear_tabla_regimen_laboral.sql
```

### Estructura de la tabla:
```sql
CREATE TABLE rrhh_regimenlaboral (
    imregimenlaboral_id VARCHAR(2) PRIMARY KEY,
    trl_codsunat VARCHAR(10) NOT NULL,
    trl_regimenlaboral VARCHAR(100) NOT NULL,
    trl_descripcion VARCHAR(500),
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Datos insertados (6 regímenes):
```
ID | Cód.SUNAT | Régimen Laboral      | Descripción
---+-----------+----------------------+----------------------------------
01 | 10        | Régimen General      | Beneficios completos: CTS...
02 | 60        | Pequeña Empresa      | Beneficios parciales: CTS...
03 | 70        | Microempresa         | Beneficios reducidos: sin CTS...
04 | 50        | Agrario              | Régimen especial para...
05 | 20        | Construcción Civil   | Régimen especial para el...
06 | 80        | CAS                  | Contrato Administrativo de...
```

---

## 🔧 Backend (Spring Boot)

### Archivos creados:
```
backend/src/main/java/com/meridian/erp/
├── entity/RegimenLaboral.java
├── repository/RegimenLaboralRepository.java
├── service/RegimenLaboralService.java
└── controller/RegimenLaboralController.java
```

### Endpoints disponibles:

#### 1. Listar regímenes activos
```http
GET /api/regimenes-laborales
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Regímenes laborales obtenidos exitosamente",
  "data": [
    {
      "id": "01",
      "codSunat": "10",
      "regimenLaboral": "Régimen General",
      "descripcion": "Beneficios completos: CTS, gratificaciones...",
      "estado": 1
    },
    ...
  ]
}
```

#### 2. Listar todos (activos e inactivos)
```http
GET /api/regimenes-laborales/todos
```

#### 3. Obtener por ID
```http
GET /api/regimenes-laborales/01
```

---

## 🎨 Frontend

### Combobox actualizado:
```javascript
cargarRegimenesLaborales: async function() {
    const response = await fetch('/api/regimenes-laborales');
    const result = await response.json();
    
    result.data.forEach(regimen => {
        // Formato: CodSunat - Nombre del régimen
        const optionText = `${regimen.codSunat} - ${regimen.regimenLaboral}`;
        selectModal.append(`<option value="${regimen.id}">${optionText}</option>`);
    });
}
```

### Opciones mostradas en el combobox:
```
* SELECCIONE *
10 - Régimen General
20 - Construcción Civil
50 - Agrario
60 - Pequeña Empresa
70 - Microempresa
80 - CAS
```

---

## 🚀 Pasos de Implementación

### 1. Ejecutar Script SQL
```bash
# En PostgreSQL:
\i sql/crear_tabla_regimen_laboral.sql
```

### 2. Verificar datos
```sql
SELECT * FROM rrhh_regimenlaboral ORDER BY trl_codsunat;
```

**Resultado esperado: 6 registros**

### 3. Reiniciar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Probar Endpoint
```bash
# En el navegador o Postman:
http://localhost:3000/api/regimenes-laborales
```

### 5. Probar en Frontend
```
1. Abrir "Conceptos por Régimen Laboral"
2. Click en "Nuevo"
3. Verificar que el combobox "Regimen Laboral" muestre:
   - 10 - Régimen General
   - 20 - Construcción Civil
   - 50 - Agrario
   - 60 - Pequeña Empresa
   - 70 - Microempresa
   - 80 - CAS
```

---

## 📊 Detalles de los Regímenes

### 1. Régimen General (Código 10)
- **Beneficios completos**
- CTS
- Gratificaciones
- Vacaciones 30 días
- ESSALUD

### 2. Pequeña Empresa (Código 60)
- **Beneficios parciales**
- CTS desde el 2° año
- Vacaciones 15 días

### 3. Microempresa (Código 70)
- **Beneficios reducidos**
- Sin CTS
- Sin gratificación
- Vacaciones 15 días

### 4. Agrario (Código 50)
- **Régimen especial**
- Para trabajadores del sector agrario

### 5. Construcción Civil (Código 20)
- **Régimen especial**
- Para el sector construcción

### 6. CAS (Código 80)
- **Contrato Administrativo de Servicios**
- Sector público

---

## 🧪 Pruebas

### Prueba 1: Verificar tabla en BD
```sql
SELECT 
    imregimenlaboral_id,
    trl_codsunat,
    trl_regimenlaboral,
    estado
FROM rrhh_regimenlaboral
ORDER BY trl_codsunat;
```

### Prueba 2: Probar endpoint
```bash
curl http://localhost:3000/api/regimenes-laborales
```

### Prueba 3: Verificar combobox
```
1. Abrir modal "Nuevo Conceptos Por Regimen Laboral"
2. Click en combobox "Regimen Laboral"
3. Verificar que aparezcan 6 opciones
4. Verificar formato: "CodSunat - Nombre"
```

---

## 📝 Formato de Visualización

### En el combobox:
```
┌─────────────────────────────────────┐
│ * SELECCIONE *                      │
│ 10 - Régimen General                │
│ 20 - Construcción Civil             │
│ 50 - Agrario                        │
│ 60 - Pequeña Empresa                │
│ 70 - Microempresa                   │
│ 80 - CAS                            │
└─────────────────────────────────────┘
```

### Valor guardado:
```javascript
// Al seleccionar "10 - Régimen General"
value = "01"  // ID del régimen (no el código SUNAT)
```

---

## 🔍 Relaciones

Esta tabla se relaciona con:
- **rrhh_conceptos_regimen_laboral** - Tabla de asignación de conceptos a regímenes
- **rrhh_trabajadores** - Trabajadores asignados a un régimen

---

## ✅ Checklist

- [x] Script SQL creado
- [x] Entidad Java creada
- [x] Repository creado
- [x] Service creado
- [x] Controller creado
- [x] Frontend actualizado
- [ ] Ejecutar script SQL
- [ ] Reiniciar backend
- [ ] Probar endpoint
- [ ] Probar combobox en frontend

---

## 📌 Notas Importantes

- Los códigos SUNAT son oficiales del sistema de planillas
- El ID es secuencial (01-06) pero el código SUNAT varía
- El combobox muestra: `CodSunat - Nombre`
- El value del option es el ID (01-06)
- Ordenados por código SUNAT ascendente

---

**¡Regímenes Laborales implementados!** ✅

Total de regímenes: **6 regímenes SUNAT**
