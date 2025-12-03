# ✅ Entidades y Repositories - Conceptos Variables

## 📝 Descripción

Se han creado las entidades JPA y repositories para el sistema de Conceptos Variables, siguiendo las mejores prácticas de Spring Boot y manteniendo consistencia con el resto del proyecto.

---

## 🏗️ Entidades Creadas

### 1. ConceptosVariables (Cabecera)

**Archivo:** `backend/src/main/java/com/meridian/erp/entity/ConceptosVariables.java`

```java
@Entity
@Table(name = "rrhh_mconceptosvariables")
public class ConceptosVariables {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer mes;
    private Integer anio;
    private Long tipoPlanillaId;
    private Long conceptoId;
    private Long sedeId;
    private Long empresaId;
    private Integer estado;
    
    // Campos de auditoría
    private Long usuarioRegistro;
    private LocalDateTime fechaRegistro;
    private Long usuarioEdito;
    private LocalDateTime fechaEdito;
    private Long usuarioElimino;
    private LocalDateTime fechaElimino;
    
    // Relación con detalles
    @OneToMany(mappedBy = "conceptosVariablesId", cascade = CascadeType.ALL)
    private List<ConceptosVariablesDetalle> detalles;
}
```

**Características:**
- Anotaciones Lombok (@Data, @NoArgsConstructor, @AllArgsConstructor)
- @PrePersist para establecer valores por defecto
- @PreUpdate para actualizar fechaEdito automáticamente
- Relación OneToMany con detalles

---

### 2. ConceptosVariablesDetalle (Detalle)

**Archivo:** `backend/src/main/java/com/meridian/erp/entity/ConceptosVariablesDetalle.java`

```java
@Entity
@Table(name = "rrhh_mconceptosvariablesdetalle")
public class ConceptosVariablesDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long conceptosVariablesId;
    private Long trabajadorId;
    private LocalDate fecha;
    private BigDecimal valor;
    private Long empresaId;
    private Integer estado;
}
```

**Características:**
- BigDecimal para valores monetarios (precision = 10, scale = 2)
- @PrePersist para valores por defecto
- Relación con cabecera mediante conceptosVariablesId

---

### 3. TipoPlanilla

**Archivo:** `backend/src/main/java/com/meridian/erp/entity/TipoPlanilla.java`

```java
@Entity
@Table(name = "rrhh_mtipoplanilla")
public class TipoPlanilla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String descripcion;
    private String codigo;
    private Integer estado;
    
    // Campos de auditoría
    private Long usuarioRegistro;
    private LocalDateTime fechaRegistro;
    private Long usuarioEdito;
    private LocalDateTime fechaEdito;
    private Long usuarioElimino;
    private LocalDateTime fechaElimino;
}
```

**Características:**
- Tabla global (sin campo empresa)
- Constraints únicos en descripción y código
- Campos de auditoría completos

---

## 🗄️ Repositories Creados

### 1. ConceptosVariablesRepository

**Archivo:** `backend/src/main/java/com/meridian/erp/repository/ConceptosVariablesRepository.java`

```java
@Repository
public interface ConceptosVariablesRepository extends JpaRepository<ConceptosVariables, Long> {
    
    // Buscar por mes, año, planilla, concepto y empresa
    Optional<ConceptosVariables> findByMesAndAnioAndTipoPlanillaIdAndConceptoIdAndEmpresaIdAndEstado(
            Integer mes, Integer anio, Long tipoPlanillaId, Long conceptoId, Long empresaId, Integer estado);
    
    // Listar por empresa y estado
    List<ConceptosVariables> findByEmpresaIdAndEstadoOrderByAnioDescMesDesc(Long empresaId, Integer estado);
    
    // Listar por empresa, año y estado
    List<ConceptosVariables> findByEmpresaIdAndAnioAndEstadoOrderByMesDesc(Long empresaId, Integer anio, Integer estado);
    
    // Listar por empresa, año, mes y estado
    List<ConceptosVariables> findByEmpresaIdAndAnioAndMesAndEstadoOrderByIdDesc(
            Long empresaId, Integer anio, Integer mes, Integer estado);
    
    // Contar por empresa y estado
    long countByEmpresaIdAndEstado(Long empresaId, Integer estado);
}
```

**Métodos Disponibles:**
- Búsqueda por período completo (mes + año + planilla + concepto)
- Listado con filtros opcionales (año, mes)
- Ordenamiento por año y mes descendente
- Conteo de registros

---

### 2. ConceptosVariablesDetalleRepository

**Archivo:** `backend/src/main/java/com/meridian/erp/repository/ConceptosVariablesDetalleRepository.java`

```java
@Repository
public interface ConceptosVariablesDetalleRepository extends JpaRepository<ConceptosVariablesDetalle, Long> {
    
    // Buscar por cabecera y trabajador
    Optional<ConceptosVariablesDetalle> findByConceptosVariablesIdAndTrabajadorIdAndEstado(
            Long conceptosVariablesId, Long trabajadorId, Integer estado);
    
    // Listar por cabecera y estado
    List<ConceptosVariablesDetalle> findByConceptosVariablesIdAndEstadoOrderByIdAsc(
            Long conceptosVariablesId, Integer estado);
    
    // Listar por trabajador y estado
    List<ConceptosVariablesDetalle> findByTrabajadorIdAndEstadoOrderByIdDesc(Long trabajadorId, Integer estado);
    
    // Listar por empresa y estado
    List<ConceptosVariablesDetalle> findByEmpresaIdAndEstadoOrderByIdDesc(Long empresaId, Integer estado);
    
    // Contar por cabecera y estado
    long countByConceptosVariablesIdAndEstado(Long conceptosVariablesId, Integer estado);
    
    // Eliminar por cabecera
    void deleteByConceptosVariablesId(Long conceptosVariablesId);
}
```

**Métodos Disponibles:**
- Búsqueda por cabecera y trabajador (prevenir duplicados)
- Listado por cabecera (obtener todos los trabajadores)
- Listado por trabajador (historial)
- Conteo de detalles
- Eliminación en cascada

---

### 3. TipoPlanillaRepository

**Archivo:** `backend/src/main/java/com/meridian/erp/repository/TipoPlanillaRepository.java`

```java
@Repository
public interface TipoPlanillaRepository extends JpaRepository<TipoPlanilla, Long> {
    
    // Listar tipos de planilla activos
    List<TipoPlanilla> findByEstadoOrderByDescripcionAsc(Integer estado);
    
    // Buscar por código
    Optional<TipoPlanilla> findByCodigoAndEstado(String codigo, Integer estado);
    
    // Buscar por descripción
    Optional<TipoPlanilla> findByDescripcionAndEstado(String descripcion, Integer estado);
    
    // Contar activos
    long countByEstado(Integer estado);
}
```

**Métodos Disponibles:**
- Listado ordenado por descripción
- Búsqueda por código o descripción
- Conteo de registros activos

---

## 💡 Uso en Services

### Ejemplo: Usar Repository en Service

```java
@Service
@RequiredArgsConstructor
public class ConceptosVariablesService {
    
    private final ConceptosVariablesRepository conceptosVariablesRepository;
    private final ConceptosVariablesDetalleRepository detalleRepository;
    
    // Buscar si ya existe un concepto variable
    public Optional<ConceptosVariables> buscarExistente(
            Integer mes, Integer anio, Long planillaId, Long conceptoId, Long empresaId) {
        
        return conceptosVariablesRepository
                .findByMesAndAnioAndTipoPlanillaIdAndConceptoIdAndEmpresaIdAndEstado(
                        mes, anio, planillaId, conceptoId, empresaId, 1);
    }
    
    // Guardar cabecera y detalles
    @Transactional
    public ConceptosVariables guardar(ConceptosVariables cabecera, List<ConceptosVariablesDetalle> detalles) {
        // Guardar cabecera
        ConceptosVariables saved = conceptosVariablesRepository.save(cabecera);
        
        // Asignar ID de cabecera a detalles
        detalles.forEach(detalle -> detalle.setConceptosVariablesId(saved.getId()));
        
        // Guardar detalles
        detalleRepository.saveAll(detalles);
        
        return saved;
    }
    
    // Listar con filtros
    public List<ConceptosVariables> listar(Long empresaId, Integer anio, Integer mes) {
        if (anio != null && mes != null) {
            return conceptosVariablesRepository
                    .findByEmpresaIdAndAnioAndMesAndEstadoOrderByIdDesc(empresaId, anio, mes, 1);
        } else if (anio != null) {
            return conceptosVariablesRepository
                    .findByEmpresaIdAndAnioAndEstadoOrderByMesDesc(empresaId, anio, 1);
        } else {
            return conceptosVariablesRepository
                    .findByEmpresaIdAndEstadoOrderByAnioDescMesDesc(empresaId, 1);
        }
    }
}
```

---

## 🔄 Relaciones entre Entidades

```
ConceptosVariables (1) ←→ (N) ConceptosVariablesDetalle
       ↓
   TipoPlanilla (N:1)
       ↓
   Concepto (N:1)
       ↓
   Empresa (N:1)

ConceptosVariablesDetalle
       ↓
   Trabajador (N:1)
```

---

## ✨ Características de las Entidades

### 1. Anotaciones Lombok
```java
@Data                    // Getters, Setters, toString, equals, hashCode
@NoArgsConstructor       // Constructor sin argumentos
@AllArgsConstructor      // Constructor con todos los argumentos
```

### 2. Lifecycle Callbacks
```java
@PrePersist
protected void onCreate() {
    fechaRegistro = LocalDateTime.now();
    if (estado == null) {
        estado = 1;
    }
}

@PreUpdate
protected void onUpdate() {
    fechaEdito = LocalDateTime.now();
}
```

### 3. Mapeo de Columnas
```java
@Column(name = "icv_mes", nullable = false)
private Integer mes;

@Column(name = "dcvd_valor", nullable = false, precision = 10, scale = 2)
private BigDecimal valor;
```

---

## 📊 Ventajas de Usar Entidades y Repositories

### 1. Type Safety
```java
// Con Repository (Type Safe)
Optional<ConceptosVariables> concepto = repository.findById(1L);

// Con JdbcTemplate (No Type Safe)
Map<String, Object> concepto = jdbcTemplate.queryForMap(sql, 1L);
```

### 2. Métodos Automáticos
```java
// Spring Data JPA genera automáticamente:
repository.save(entity);
repository.findById(id);
repository.findAll();
repository.deleteById(id);
repository.count();
```

### 3. Query Methods
```java
// Spring genera la query automáticamente:
findByEmpresaIdAndEstado(Long empresaId, Integer estado);

// Equivalente SQL:
// SELECT * FROM rrhh_mconceptosvariables 
// WHERE icv_empresa = ? AND icv_estado = ?
```

### 4. Transacciones
```java
@Transactional
public void guardarConDetalles(ConceptosVariables cabecera, List<ConceptosVariablesDetalle> detalles) {
    repository.save(cabecera);
    detalleRepository.saveAll(detalles);
    // Si falla, hace rollback automático
}
```

---

## 📝 Archivos Creados

### Entidades
- ✅ `ConceptosVariables.java` - Entidad cabecera
- ✅ `ConceptosVariablesDetalle.java` - Entidad detalle
- ✅ `TipoPlanilla.java` - Entidad tipo de planilla

### Repositories
- ✅ `ConceptosVariablesRepository.java` - Repository cabecera
- ✅ `ConceptosVariablesDetalleRepository.java` - Repository detalle
- ✅ `TipoPlanillaRepository.java` - Repository tipo planilla

---

## 🎯 Estado: ✅ COMPLETADO

Las entidades y repositories están creados y listos para usar. Ahora el proyecto tiene:
- ✅ Entidades JPA con anotaciones completas
- ✅ Repositories con métodos de consulta
- ✅ Relaciones entre entidades
- ✅ Lifecycle callbacks (@PrePersist, @PreUpdate)
- ✅ Consistencia con el resto del proyecto

---

## 🚀 Próximos Pasos (Opcional)

Si deseas usar los repositories en lugar de JdbcTemplate:

1. **Actualizar Services** para usar repositories
2. **Eliminar JdbcTemplate** de los services
3. **Usar métodos de repository** en lugar de stored procedures
4. **Aprovechar transacciones** automáticas de Spring

Pero el sistema actual funciona perfectamente con JdbcTemplate + Stored Procedures. Los repositories están disponibles para uso futuro si lo necesitas.
