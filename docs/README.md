# Documentación Técnica - Agenda Cultural

## Índice de Documentación

Esta carpeta contiene toda la documentación técnica del proyecto Agenda Cultural, desarrollado con TypeScript, Node.js, Express, Sequelize (backend) y Angular (frontend).

---

## Documentos Disponibles

### 1. [Diagrama de Clases](./01-diagrama-clases.md)
**Contenido**: Representación UML de las entidades del sistema, sus atributos, métodos y relaciones.

**Incluye**:
- Diagrama UML completo en formato PlantUML
- Descripción detallada de cada clase (Usuario, Categoria, Evento, Flyer, SolicitudFlyer)
- Enumeraciones (RolUsuario, EstadoSolicitudFlyer, PrioridadSolicitud, TipoMoneda)
- Relaciones y cardinalidades entre entidades
- Métodos principales de cada clase
- Notas de implementación con Sequelize ORM

**Tecnologías**: TypeScript, Sequelize ORM, POO

---

### 2. [Casos de Uso](./02-casos-de-uso.md)
**Contenido**: Descripción detallada de las interacciones entre usuarios y el sistema.

**Incluye**:
- Diagrama general de casos de uso en PlantUML
- 26 casos de uso detallados con:
  - Actores involucrados
  - Precondiciones y postcondiciones
  - Flujos principales
  - Flujos alternativos
  - Flujos de excepción
- Casos de uso organizados por módulos:
  - Autenticación y gestión de usuarios (10 CU)
  - Gestión de eventos (5 CU)
  - Gestión de solicitudes de flyers (5 CU)
  - Administración (6 CU)
- Matriz de trazabilidad con prioridades y estado

**Actores**: Usuario Invitado, Usuario Registrado, Administrador

---

### 3. [Diagrama Entidad-Relación](./03-diagrama-entidad-relacion.md)
**Contenido**: Modelo lógico de la base de datos con todas las entidades, atributos y relaciones.

**Incluye**:
- Diagrama ER completo en PlantUML
- 5 entidades principales:
  - usuarios (13 campos + timestamps)
  - categorias (8 campos + timestamps)
  - eventos (33 campos + timestamps)
  - flyers (10 campos + timestamps)
  - solicitudes_flyer (22 campos + timestamps)
- Descripción detallada de cada tabla con:
  - Tipos de datos
  - Restricciones (NOT NULL, UNIQUE, FK, etc.)
  - Valores por defecto
  - Validaciones
  - Índices de rendimiento
- Relaciones y cardinalidades (1:N, 1:0..1)
- Reglas de integridad referencial
- Scripts SQL de creación
- Normalización 3FN
- Estimación de volumen de datos
- Consideraciones de rendimiento

**Base de Datos**: MySQL / MariaDB / PostgreSQL compatible

---

### 4. [Documentación API Backend](./04-documentacion-api-backend.md)
**Contenido**: Documentación completa de todos los endpoints REST de la API.

**Incluye**:
- 50+ endpoints documentados organizados en 6 módulos:
  - **Autenticación** (10 endpoints): Registro, login, verificación email, recuperación de contraseña
  - **Eventos** (7 endpoints): CRUD completo, filtros, búsqueda, destacados
  - **Categorías** (6 endpoints): Gestión de categorías culturales
  - **Flyers** (7 endpoints): Galería de imágenes promocionales
  - **Solicitudes** (9 endpoints): Sistema de solicitudes de diseño
  - **Usuarios** (7 endpoints): Administración de usuarios
- Para cada endpoint se detalla:
  - Método HTTP y ruta
  - Autenticación requerida
  - Permisos necesarios
  - Rate limiting aplicado
  - Parámetros de entrada (body, query, path)
  - Validaciones completas con express-validator
  - Formato de respuesta exitosa
  - Códigos de estado HTTP
  - Errores posibles
  - Ejemplos de request/response en JSON
- Documentación de:
  - Formatos y convenciones
  - Autenticación JWT
  - Paginación
  - Subida de archivos
  - Rate limiting
  - Medidas de seguridad
  - Códigos de error comunes

**Base URL**: `http://localhost:5000/api`
**Formato**: JSON
**Autenticación**: JWT Bearer Token

---

## Estructura del Proyecto

```
agendacultural2/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de BD y servidor
│   │   ├── controladores/   # Lógica de negocio
│   │   ├── middlewares/     # Autenticación, validación, errores
│   │   ├── modelos/         # Modelos Sequelize (entidades)
│   │   ├── rutas/           # Definición de endpoints
│   │   ├── servicios/       # Servicios auxiliares (email, tokens, etc.)
│   │   ├── tipos/           # Enumeraciones y tipos TypeScript
│   │   ├── utilidades/      # Utilidades (paginación, errores, etc.)
│   │   └── validaciones/    # Validaciones con express-validator
│   └── dist/                # Código compilado
├── frontend/
│   └── src/
│       └── app/
│           ├── core/        # Servicios, guards, interceptors
│           ├── features/    # Módulos por funcionalidad
│           └── shared/      # Componentes compartidos
├── docker/                  # Configuración Docker
├── docs/                    # Esta carpeta - Documentación técnica
└── docker-compose.yml       # Orquestación de contenedores
```

---

## Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **ORM**: Sequelize
- **Base de Datos**: MySQL / MariaDB / PostgreSQL
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: express-validator
- **Encriptación**: bcrypt
- **Email**: Nodemailer
- **Subida de archivos**: Multer
- **Seguridad**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Angular 20.3
- **Lenguaje**: TypeScript
- **Gestión de Estado**: RxJS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Formularios**: Reactive Forms

### DevOps
- **Containerización**: Docker
- **Orquestación**: Docker Compose
- **Control de Versiones**: Git

---

## Características Principales

### Funcionalidades del Sistema

1. **Gestión de Usuarios**
   - Registro con verificación de email
   - Login con JWT
   - Recuperación de contraseña
   - Roles: Administrador y Usuario
   - Gestión de perfiles

2. **Gestión de Eventos Culturales**
   - CRUD completo de eventos
   - Categorización (música, teatro, cine, etc.)
   - Búsqueda y filtros avanzados
   - Geolocalización con mapas
   - Sistema de vistas/estadísticas
   - Eventos destacados

3. **Galería de Flyers**
   - Visualización pública
   - Relación con eventos
   - Sistema de etiquetas
   - Flyers destacados

4. **Sistema de Solicitudes**
   - Usuarios pueden solicitar diseño de flyers
   - Workflow con estados (pendiente → revisando → en proceso → completado)
   - Sistema de prioridades
   - Calificación de trabajos completados
   - Notificaciones por email

5. **Panel de Administración**
   - Gestión de usuarios y roles
   - Gestión de categorías
   - Aprobación y gestión de eventos
   - Gestión de solicitudes de diseño
   - Estadísticas del sistema

### Seguridad Implementada

- Autenticación JWT con expiración
- Contraseñas hasheadas con bcrypt
- Validación y sanitización de inputs
- Protección contra XSS y SQL injection
- Rate limiting para prevenir abuso
- CORS configurado
- Helmet.js para headers de seguridad
- Soft delete para integridad de datos
- Tokens de verificación y recuperación con expiración

### Optimizaciones

- Índices de base de datos en campos frecuentes
- Paginación en listados
- Eager loading de relaciones
- Cache de datos estáticos
- Compresión de respuestas
- Lazy loading en frontend

---

## Cómo Usar Esta Documentación

### Para Desarrolladores Backend
1. Revisa el [Diagrama de Clases](./01-diagrama-clases.md) para entender la estructura OOP
2. Consulta el [Diagrama ER](./03-diagrama-entidad-relacion.md) para el modelo de datos
3. Usa la [Documentación de API](./04-documentacion-api-backend.md) como referencia de endpoints

### Para Desarrolladores Frontend
1. Revisa los [Casos de Uso](./02-casos-de-uso.md) para entender los flujos
2. Consulta la [Documentación de API](./04-documentacion-api-backend.md) para integración
3. Revisa el [Diagrama de Clases](./01-diagrama-clases.md) para tipos de datos

### Para DBAs
1. Consulta el [Diagrama ER](./03-diagrama-entidad-relacion.md) completo
2. Revisa los scripts SQL de creación
3. Consulta las consideraciones de rendimiento e índices

### Para QA/Testers
1. Usa los [Casos de Uso](./02-casos-de-uso.md) para crear casos de prueba
2. Consulta la [Documentación de API](./04-documentacion-api-backend.md) para pruebas de endpoints
3. Revisa los flujos alternativos y de excepción

### Para Project Managers
1. Revisa la matriz de trazabilidad en [Casos de Uso](./02-casos-de-uso.md)
2. Consulta las características principales (arriba)
3. Revisa el stack tecnológico para planificación

---

## Visualización de Diagramas PlantUML

Los diagramas están escritos en PlantUML. Para visualizarlos:

### Opción 1: Online
- Copia el código del diagrama
- Pégalo en [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)

### Opción 2: VS Code
- Instala la extensión "PlantUML"
- Abre el archivo .md
- Usa `Alt+D` para previsualizar

### Opción 3: Generar Imágenes
```bash
# Instalar PlantUML
npm install -g node-plantuml

# Generar PNG
plantuml diagrama.puml
```

---

## Mantenimiento de la Documentación

### Responsabilidades
- Mantener actualizada con cada cambio en el código
- Versionar junto con el código
- Revisar en cada sprint/release

### Versionado
- **Versión Actual**: 1.0
- **Fecha**: 2025-11-14
- **Próxima Revisión**: Antes de release a producción

### Contribuir
1. Al agregar nuevas funcionalidades, actualizar casos de uso
2. Al modificar modelos, actualizar diagrama de clases y ER
3. Al agregar/modificar endpoints, actualizar documentación de API
4. Mantener los ejemplos sincronizados con el código real

---

## Contacto y Soporte

Para preguntas, sugerencias o reportar errores en la documentación:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

## Licencia

Este proyecto y su documentación son propiedad de [Nombre del Proyecto/Empresa].

---

**Última Actualización**: 2025-11-14
**Versión de la Documentación**: 1.0
