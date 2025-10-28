# 🔐 Sistema de Permisos por Rol - README

## 🎯 ¿Qué es esto?

Un sistema completo de gestión de permisos que permite controlar qué menús puede ver cada usuario según su rol y empresa.

## ⚡ Inicio Rápido (5 minutos)

### 1. Ejecutar Script SQL
```bash
psql -U root -d root -f Scripts/06_crear_tabla_rol_menu.sql
```

### 2. Reiniciar Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Usar el Sistema
1. Login con usuario admin
2. Ir a: Gestión de Seguridad → Rol
3. Crear un rol de prueba
4. Ir a: Gestión de Seguridad → Asignar Rol
5. Marcar algunos menús para el rol
6. Guardar

¡Listo! 🎉

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| [INSTRUCCIONES-PERMISOS.md](INSTRUCCIONES-PERMISOS.md) | Guía completa de uso del sistema |
| [RESUMEN-SISTEMA-PERMISOS.md](RESUMEN-SISTEMA-PERMISOS.md) | Resumen ejecutivo de la implementación |
| [PRUEBA-RAPIDA-PERMISOS.md](PRUEBA-RAPIDA-PERMISOS.md) | Guía de prueba en 5 minutos |
| [DIAGRAMA-FLUJO-PERMISOS.md](DIAGRAMA-FLUJO-PERMISOS.md) | Diagramas de flujo y casos de uso |
| [FAQ-PERMISOS.md](FAQ-PERMISOS.md) | Preguntas frecuentes |
| [CHECKLIST-IMPLEMENTACION-PERMISOS.md](CHECKLIST-IMPLEMENTACION-PERMISOS.md) | Lista de verificación completa |
| [RESUMEN-VISUAL-PERMISOS.md](RESUMEN-VISUAL-PERMISOS.md) | Resumen visual con gráficos |

## 🏗️ Arquitectura

```
Usuario → Empresa → Rol → Permisos → Menús
```

### Tablas de Base de Datos

- **rrhh_mempresa**: Empresas
- **rrhh_mrol**: Roles por empresa
- **rrhh_mmenu**: Menús del sistema
- **rrhh_drol_menu**: Permisos (Rol-Menú) ← NUEVA
- **rrhh_musuario**: Usuarios con rol

### Backend (Spring Boot)

- **Entity**: RolMenu.java
- **Repository**: RolMenuRepository.java
- **Service**: RolMenuService.java
- **Controller**: RolMenuController.java
- **DTOs**: AsignarRolRequest.java, RolMenuResponse.java

### Frontend (HTML/JS)

- **HTML**: asignar-rol.html
- **JavaScript**: asignar-rol.js
- **Dashboard**: dashboard.js (actualizado)

## 🎨 Características Principales

### ✅ Matriz Visual de Permisos

Interfaz intuitiva con:
- Filas: Menús (organizados jerárquicamente)
- Columnas: Roles de la empresa
- Checkboxes: Marcar/desmarcar permisos

### ✅ Rol DASHBOARD (Superadministrador)

- ID: 1
- Acceso: Todos los menús automáticamente
- Protección: No se puede modificar ni eliminar

### ✅ Roles por Empresa

- Cada empresa crea sus propios roles
- Permisos específicos por rol
- Usuarios ven solo menús de su rol

### ✅ Filtrado Automático

- Dashboard carga menús según rol del usuario
- Sin permisos = Sin menús
- Actualización en tiempo real

## 🔧 API Endpoints

### Obtener Matriz de Permisos
```http
GET /api/rol-menu/matriz?empresaId={empresaId}
```

### Asignar Permisos a Rol
```http
POST /api/rol-menu/asignar
Content-Type: application/json

{
  "rolId": 2,
  "menuIds": [1, 4, 5, 6, 8]
}
```

### Obtener Menús por Rol
```http
GET /api/menus/rol/{rolId}
```

## 🧪 Pruebas

### Verificar Instalación

```sql
-- Verificar tabla creada
SELECT COUNT(*) FROM rrhh_drol_menu;

-- Verificar rol DASHBOARD
SELECT * FROM rrhh_mrol WHERE imrol_id = 1;

-- Verificar permisos DASHBOARD
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = 1;
-- Debe retornar: 29
```

### Probar API

```bash
# Obtener matriz
curl http://localhost:3000/api/rol-menu/matriz?empresaId=1

# Asignar permisos
curl -X POST http://localhost:3000/api/rol-menu/asignar \
  -H "Content-Type: application/json" \
  -d '{"rolId":2,"menuIds":[1,4,5]}'
```

## 🐛 Problemas Comunes

### Error: "No se puede modificar el rol DASHBOARD"

**Solución**: El rol DASHBOARD (id=1) está protegido. Solo modifica roles personalizados.

### Error: "No hay roles creados para esta empresa"

**Solución**: Crea roles en el módulo "Rol" primero.

### Los cambios no se reflejan

**Solución**: Cierra sesión y vuelve a entrar.

## 📊 Ejemplo de Uso

### Escenario: Empresa con 3 Roles

```
Empresa: "Mi Empresa SAC"

Roles:
1. DASHBOARD (admin) → Ve todo
2. Administrador → Ve gestión completa
3. Operador → Ve solo asistencia

Permisos:
- Administrador: 20 menús
- Operador: 2 menús

Usuarios:
- admin (DASHBOARD) → 29 menús
- jperez (Administrador) → 20 menús
- mgarcia (Operador) → 2 menús
```

## 🔐 Seguridad

### Validaciones Backend

- ✅ Rol DASHBOARD no modificable
- ✅ Filtrado por empresa
- ✅ Transacciones atómicas
- ✅ Cascada en eliminación
- ✅ Constraint UNIQUE

### Validaciones Frontend

- ✅ Usuario logueado
- ✅ Empresa válida
- ✅ Confirmación antes de guardar
- ✅ Feedback visual
- ✅ Manejo de errores

## 📈 Ventajas

| Ventaja | Descripción |
|---------|-------------|
| 🎯 **Escalable** | Fácil agregar nuevos menús y roles |
| 🔄 **Flexible** | Cada empresa gestiona sus permisos |
| 👁️ **Visual** | Matriz intuitiva para asignar |
| 🔒 **Seguro** | Rol DASHBOARD protegido |
| ⚡ **Eficiente** | Índices para consultas rápidas |
| 🛠️ **Mantenible** | Código organizado y documentado |

## 🚀 Próximos Pasos

### Para Administradores

1. Definir roles de tu empresa
2. Asignar permisos según responsabilidades
3. Crear usuarios con roles
4. Probar con usuarios reales

### Para Desarrolladores

1. Revisar documentación técnica
2. Entender flujo de datos
3. Personalizar según necesidades
4. Agregar mejoras sugeridas

## 📞 Soporte

### Documentación

- **Guía completa**: [INSTRUCCIONES-PERMISOS.md](INSTRUCCIONES-PERMISOS.md)
- **FAQ**: [FAQ-PERMISOS.md](FAQ-PERMISOS.md)
- **Diagramas**: [DIAGRAMA-FLUJO-PERMISOS.md](DIAGRAMA-FLUJO-PERMISOS.md)

### Contacto

- 📧 Email: soporte@empresa.com
- 💬 Chat: Sistema de tickets interno
- 📚 Docs: /docs/permisos/

## 📝 Changelog

### v1.0 (2025-10-27)

- ✅ Implementación inicial
- ✅ Tabla rrhh_drol_menu
- ✅ Backend completo
- ✅ Frontend completo
- ✅ Documentación completa
- ✅ Pruebas exitosas

## 📄 Licencia

Este sistema es parte del ERP de Recursos Humanos.  
Todos los derechos reservados.

---

**¿Necesitas ayuda?** Lee la [documentación completa](INSTRUCCIONES-PERMISOS.md) o contacta al equipo de soporte.

**¿Encontraste un bug?** Revisa el [FAQ](FAQ-PERMISOS.md) o reporta el problema.

**¿Quieres contribuir?** Revisa el [checklist de implementación](CHECKLIST-IMPLEMENTACION-PERMISOS.md).

---

**Sistema de Permisos v1.0** | Implementado con ❤️ por el equipo de desarrollo
