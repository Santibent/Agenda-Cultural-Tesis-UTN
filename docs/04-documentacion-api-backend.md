# Documentación API Backend - Agenda Cultural

## Descripción General
Esta documentación describe todos los endpoints expuestos por la API REST del backend de Agenda Cultural, incluyendo métodos HTTP, parámetros de entrada, respuestas, validaciones y códigos de estado.

**Base URL**: `http://localhost:5000/api`
**Versión**: 1.0
**Formato de respuesta**: JSON
**Autenticación**: JWT (JSON Web Token)

---

## Índice de Endpoints

### Autenticación
- [POST /api/auth/registro](#post-apiauthregistro) - Registrar nuevo usuario
- [POST /api/auth/login](#post-apiauthlogin) - Iniciar sesión
- [GET /api/auth/perfil](#get-apiauthperfil) - Obtener perfil del usuario
- [PUT /api/auth/perfil](#put-apiauthperfil) - Actualizar perfil
- [GET /api/auth/verificar-email](#get-apiauthverificar-email) - Verificar email
- [POST /api/auth/reenviar-verificacion](#post-apiauthreenviar-verificacion) - Reenviar verificación
- [POST /api/auth/recuperar-password](#post-apiauthrecuperar-password) - Recuperar contraseña
- [POST /api/auth/restablecer-password](#post-apiauthrestablecer-password) - Restablecer contraseña
- [POST /api/auth/cambiar-password](#post-apiauthcambiar-password) - Cambiar contraseña
- [POST /api/auth/refresh-token](#post-apiauthrefresh-token) - Refrescar token

### Eventos
- [GET /api/eventos](#get-apieventos) - Listar eventos
- [GET /api/eventos/destacados](#get-apieventosdestacados) - Obtener eventos destacados
- [GET /api/eventos/proximos](#get-apieventosproximos) - Obtener próximos eventos
- [GET /api/eventos/:idOSlug](#get-apieventosidoslug) - Obtener evento por ID o slug
- [POST /api/eventos](#post-apieventos) - Crear evento
- [PUT /api/eventos/:id](#put-apieventosid) - Actualizar evento
- [DELETE /api/eventos/:id](#delete-apieventosid) - Eliminar evento

### Categorías
- [GET /api/categorias](#get-apicategorias) - Listar categorías
- [GET /api/categorias/con-eventos](#get-apicategoriascon-eventos) - Listar categorías con eventos
- [GET /api/categorias/:idOSlug](#get-apicategoriasidoslug) - Obtener categoría
- [POST /api/categorias](#post-apicategorias) - Crear categoría (Admin)
- [PUT /api/categorias/:id](#put-apicategoriasid) - Actualizar categoría (Admin)
- [DELETE /api/categorias/:id](#delete-apicategoriasid) - Eliminar categoría (Admin)

### Flyers
- [GET /api/flyers](#get-apiflyers) - Listar flyers
- [GET /api/flyers/destacados](#get-apiflyersdestacados) - Obtener flyers destacados
- [GET /api/flyers/galeria](#get-apiflyersgaleria) - Obtener galería de flyers
- [GET /api/flyers/:id](#get-apiflyersid) - Obtener flyer por ID
- [POST /api/flyers](#post-apiflyers) - Crear flyer (Admin)
- [PUT /api/flyers/:id](#put-apiflyersid) - Actualizar flyer (Admin)
- [DELETE /api/flyers/:id](#delete-apiflyersid) - Eliminar flyer (Admin)

### Solicitudes de Flyers
- [GET /api/solicitudes](#get-apisolicitudes) - Listar solicitudes
- [GET /api/solicitudes/estadisticas](#get-apisolicitudesestadisticas) - Obtener estadísticas (Admin)
- [GET /api/solicitudes/:id](#get-apisolicitudesid) - Obtener solicitud por ID
- [POST /api/solicitudes](#post-apisolicitudes) - Crear solicitud
- [PUT /api/solicitudes/:id](#put-apisolicitudesid) - Actualizar solicitud
- [PATCH /api/solicitudes/:id/estado](#patch-apisolicitudesidestado) - Cambiar estado (Admin)
- [PATCH /api/solicitudes/:id/cancelar](#patch-apisolicitudesidcancelar) - Cancelar solicitud
- [POST /api/solicitudes/:id/calificar](#post-apisolicitudesidcalificar) - Calificar solicitud
- [DELETE /api/solicitudes/:id](#delete-apisolicitudesid) - Eliminar solicitud

### Usuarios
- [GET /api/usuarios](#get-apiusuarios) - Listar usuarios (Admin)
- [GET /api/usuarios/estadisticas](#get-apiusuariosestadisticas) - Obtener estadísticas (Admin)
- [GET /api/usuarios/:id](#get-apiusuariosid) - Obtener usuario por ID
- [PUT /api/usuarios/:id](#put-apiusuariosid) - Actualizar usuario
- [DELETE /api/usuarios/:id](#delete-apiusuariosid) - Eliminar usuario (Admin)
- [PATCH /api/usuarios/:id/reactivar](#patch-apiusuariosidreactivar) - Reactivar usuario (Admin)
- [PATCH /api/usuarios/:id/cambiar-rol](#patch-apiusuariosidcambiar-rol) - Cambiar rol (Admin)

---

## Convenciones y Formatos

### Formato de Respuesta Exitosa
```json
{
  "exito": true,
  "mensaje": "Descripción de la operación",
  "datos": { /* objeto o array de datos */ },
  "paginacion": { /* solo en listados paginados */
    "paginaActual": 1,
    "totalPaginas": 5,
    "totalElementos": 45,
    "elementosPorPagina": 10
  }
}
```

### Formato de Respuesta de Error
```json
{
  "exito": false,
  "mensaje": "Descripción del error",
  "errores": [ /* array opcional de errores de validación */
    {
      "campo": "email",
      "mensaje": "El email es obligatorio"
    }
  ]
}
```

### Códigos de Estado HTTP
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación o solicitud incorrecta
- `401 Unauthorized` - No autenticado o token inválido
- `403 Forbidden` - Sin permisos suficientes
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado)
- `429 Too Many Requests` - Límite de peticiones excedido
- `500 Internal Server Error` - Error del servidor

### Autenticación
La mayoría de endpoints requieren autenticación mediante JWT. El token debe enviarse en el header:
```
Authorization: Bearer <token>
```

---

## Endpoints de Autenticación

### POST /api/auth/registro
Registra un nuevo usuario en el sistema.

**Autenticación**: No requerida
**Rate Limiting**: 5 peticiones por hora por IP

**Request Body**:
```json
{
  "nombre": "string (2-100 caracteres)",
  "email": "string (formato email válido)",
  "password": "string (mínimo 8 caracteres, mayúscula, minúscula, número, carácter especial)",
  "confirmarPassword": "string (debe coincidir con password)"
}
```

**Validaciones**:
- `nombre`: Obligatorio, 2-100 caracteres
- `email`: Obligatorio, formato email válido, único en el sistema
- `password`: Obligatorio, mínimo 8 caracteres, debe contener al menos:
  - Una letra mayúscula
  - Una letra minúscula
  - Un número
  - Un carácter especial (@$!%*?&)
- `confirmarPassword`: Debe coincidir con password

**Response 201 Created**:
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente. Por favor verifica tu email.",
  "datos": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario",
    "emailVerificado": false,
    "activo": true,
    "createdAt": "2025-11-14T10:00:00.000Z"
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación
- `409`: Email ya registrado
- `429`: Límite de peticiones excedido

---

### POST /api/auth/login
Inicia sesión y obtiene token de autenticación.

**Autenticación**: No requerida
**Rate Limiting**: 10 peticiones por 15 minutos por IP

**Request Body**:
```json
{
  "email": "string (formato email)",
  "password": "string"
}
```

**Validaciones**:
- `email`: Obligatorio, formato email válido
- `password`: Obligatorio

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Inicio de sesión exitoso",
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "usuario",
      "emailVerificado": true,
      "avatarUrl": null,
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiraEn": "24h"
  }
}
```

**Errores Posibles**:
- `400`: Datos faltantes o inválidos
- `401`: Credenciales incorrectas
- `403`: Cuenta inactiva
- `429`: Demasiados intentos fallidos

---

### GET /api/auth/perfil
Obtiene la información del usuario autenticado.

**Autenticación**: Requerida (JWT)

**Request**: Sin parámetros

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario",
    "emailVerificado": true,
    "avatarUrl": "https://...",
    "activo": true,
    "createdAt": "2025-11-14T10:00:00.000Z",
    "updatedAt": "2025-11-14T10:00:00.000Z"
  }
}
```

**Errores Posibles**:
- `401`: No autenticado o token inválido

---

### PUT /api/auth/perfil
Actualiza la información del perfil del usuario autenticado.

**Autenticación**: Requerida (JWT)

**Request Body** (todos los campos son opcionales):
```json
{
  "nombre": "string (2-100 caracteres)",
  "avatarUrl": "string (URL válida)"
}
```

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Perfil actualizado exitosamente",
  "datos": {
    "id": 1,
    "nombre": "Juan Pérez Actualizado",
    "email": "juan@example.com",
    "avatarUrl": "https://..."
  }
}
```

**Errores Posibles**:
- `400`: Datos de validación incorrectos
- `401`: No autenticado

---

### GET /api/auth/verificar-email
Verifica el email del usuario mediante token.

**Autenticación**: No requerida

**Query Parameters**:
- `token` (string, obligatorio): Token de verificación enviado por email

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Email verificado exitosamente"
}
```

**Errores Posibles**:
- `400`: Token inválido o expirado
- `404`: Usuario no encontrado

---

### POST /api/auth/recuperar-password
Solicita recuperación de contraseña. Envía email con instrucciones.

**Autenticación**: No requerida
**Rate Limiting**: 3 peticiones por hora por email

**Request Body**:
```json
{
  "email": "string (formato email)"
}
```

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

**Nota**: Por seguridad, siempre devuelve 200 aunque el email no exista.

---

### POST /api/auth/restablecer-password
Restablece la contraseña usando el token de recuperación.

**Autenticación**: No requerida

**Request Body**:
```json
{
  "token": "string (token de recuperación)",
  "password": "string (nueva contraseña, requisitos iguales a registro)",
  "confirmarPassword": "string"
}
```

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Contraseña restablecida exitosamente"
}
```

**Errores Posibles**:
- `400`: Token inválido, expirado o validación de contraseña fallida
- `404`: Token no encontrado

---

### POST /api/auth/cambiar-password
Cambia la contraseña del usuario autenticado.

**Autenticación**: Requerida (JWT)

**Request Body**:
```json
{
  "passwordActual": "string",
  "passwordNueva": "string (requisitos iguales a registro)",
  "confirmarPasswordNueva": "string"
}
```

**Validaciones**:
- `passwordActual`: Debe ser correcta
- `passwordNueva`: Debe ser diferente a la actual y cumplir requisitos
- `confirmarPasswordNueva`: Debe coincidir

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Contraseña cambiada exitosamente"
}
```

---

### POST /api/auth/refresh-token
Refresca el token JWT antes de que expire.

**Autenticación**: Requerida (JWT)

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    "token": "nuevo_token_jwt",
    "expiraEn": "24h"
  }
}
```

---

## Endpoints de Eventos

### GET /api/eventos
Lista todos los eventos activos con filtros y paginación.

**Autenticación**: No requerida

**Query Parameters** (todos opcionales):
- `pagina` (integer, min: 1, default: 1): Número de página
- `limite` (integer, 1-10000, default: 10): Elementos por página
- `categoriaId` (integer): Filtrar por categoría
- `destacado` (boolean): Filtrar eventos destacados
- `ciudad` (string, max: 100): Filtrar por ciudad
- `fechaDesde` (ISO8601): Filtrar desde fecha
- `fechaHasta` (ISO8601): Filtrar hasta fecha
- `busqueda` (string, max: 200): Búsqueda en título, descripción, ubicación
- `ordenarPor` (enum: `fechaInicio`, `titulo`, `precio`, `vistas`, `createdAt`, default: `fechaInicio`)
- `orden` (enum: `ASC`, `DESC`, default: `ASC`)

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "titulo": "Concierto de Rock",
      "slug": "concierto-de-rock",
      "descripcion": "Gran concierto de rock...",
      "descripcionCorta": "Concierto imperdible",
      "categoriaId": 1,
      "categoria": {
        "id": 1,
        "nombre": "Música",
        "slug": "musica",
        "color": "#FF5733"
      },
      "fechaInicio": "2025-12-01",
      "fechaFin": null,
      "horaInicio": "20:00",
      "horaFin": "23:00",
      "ubicacion": "Teatro Municipal",
      "direccion": "Av. Principal 123",
      "ciudad": "Venado Tuerto",
      "provincia": "Santa Fe",
      "pais": "Argentina",
      "latitud": -33.7456,
      "longitud": -61.9689,
      "imagenPrincipal": "https://...",
      "imagenBanner": null,
      "precio": 5000.00,
      "moneda": "ARS",
      "capacidad": 500,
      "linkExterno": "https://...",
      "linkTickets": "https://...",
      "organizador": "Productora XYZ",
      "contactoEmail": "info@evento.com",
      "contactoTelefono": "+54 9 123456789",
      "destacado": true,
      "vistas": 245,
      "usuarioCreadorId": 1,
      "usuarioCreador": {
        "id": 1,
        "nombre": "Juan Pérez"
      },
      "createdAt": "2025-11-01T10:00:00.000Z",
      "updatedAt": "2025-11-01T10:00:00.000Z"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "totalPaginas": 3,
    "totalElementos": 25,
    "elementosPorPagina": 10
  }
}
```

---

### GET /api/eventos/destacados
Obtiene los eventos marcados como destacados.

**Autenticación**: No requerida

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    /* Array de eventos destacados con la misma estructura que GET /api/eventos */
  ]
}
```

---

### GET /api/eventos/proximos
Obtiene los próximos eventos ordenados por fecha.

**Autenticación**: No requerida

**Query Parameters**:
- `limite` (integer, default: 10): Cantidad de eventos a retornar

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    /* Array de próximos eventos */
  ]
}
```

---

### GET /api/eventos/:idOSlug
Obtiene un evento específico por ID o slug. Incrementa el contador de vistas.

**Autenticación**: No requerida

**Path Parameters**:
- `idOSlug` (integer o string): ID numérico o slug del evento

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    /* Objeto evento completo con categoría y usuario creador */
  }
}
```

**Errores Posibles**:
- `404`: Evento no encontrado

---

### POST /api/eventos
Crea un nuevo evento.

**Autenticación**: Requerida (JWT)
**Rate Limiting**: 10 creaciones por hora por usuario

**Request Body**:
```json
{
  "titulo": "string (3-200 caracteres, obligatorio)",
  "descripcion": "string (min 10 caracteres, obligatorio)",
  "descripcionCorta": "string (max 300 caracteres, opcional)",
  "categoriaId": "integer (obligatorio)",
  "fechaInicio": "ISO8601 (obligatorio, no puede ser pasada)",
  "fechaFin": "ISO8601 (opcional, posterior a fechaInicio)",
  "horaInicio": "HH:MM (opcional)",
  "horaFin": "HH:MM (opcional)",
  "ubicacion": "string (max 200, obligatorio)",
  "direccion": "string (max 255, opcional)",
  "ciudad": "string (max 100, opcional, default: 'Venado Tuerto')",
  "provincia": "string (max 100, opcional, default: 'Santa Fe')",
  "pais": "string (max 100, opcional, default: 'Argentina')",
  "latitud": "float (-90 a 90, opcional)",
  "longitud": "float (-180 a 180, opcional)",
  "precio": "float (min 0, opcional, default: 0)",
  "moneda": "enum (ARS, USD, EUR, opcional, default: ARS)",
  "capacidad": "integer (min 1, opcional)",
  "linkExterno": "URL (opcional)",
  "linkTickets": "URL (opcional)",
  "organizador": "string (max 200, opcional)",
  "contactoEmail": "email (opcional)",
  "contactoTelefono": "string (formato teléfono, opcional)",
  "destacado": "boolean (opcional, default: false)",
  "activo": "boolean (opcional, default: true)"
}
```

**Soporte de Archivos**:
- `imagen`: Archivo de imagen (opcional, max 5MB, formatos: jpg, jpeg, png, gif, webp)

**Response 201 Created**:
```json
{
  "exito": true,
  "mensaje": "Evento creado exitosamente",
  "datos": {
    /* Objeto evento completo creado */
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación
- `401`: No autenticado
- `404`: Categoría no encontrada
- `429`: Límite de creaciones excedido

---

### PUT /api/eventos/:id
Actualiza un evento existente.

**Autenticación**: Requerida (JWT)
**Permisos**: Creador del evento o administrador

**Path Parameters**:
- `id` (integer): ID del evento

**Request Body**: Mismos campos que POST, todos opcionales

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Evento actualizado exitosamente",
  "datos": {
    /* Objeto evento actualizado */
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación
- `401`: No autenticado
- `403`: Sin permisos (no es creador ni admin)
- `404`: Evento no encontrado

---

### DELETE /api/eventos/:id
Elimina (desactiva) un evento.

**Autenticación**: Requerida (JWT)
**Permisos**: Creador del evento o administrador

**Path Parameters**:
- `id` (integer): ID del evento

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Evento eliminado exitosamente"
}
```

**Nota**: Se realiza un soft delete (marca como inactivo), no se elimina de la base de datos.

**Errores Posibles**:
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Evento no encontrado

---

## Endpoints de Categorías

### GET /api/categorias
Lista todas las categorías activas.

**Autenticación**: No requerida

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "nombre": "Música",
      "slug": "musica",
      "descripcion": "Eventos musicales de todo tipo",
      "color": "#FF5733",
      "icono": "music",
      "activo": true,
      "orden": 1,
      "createdAt": "2025-11-01T10:00:00.000Z",
      "updatedAt": "2025-11-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/categorias/con-eventos
Lista categorías activas que tienen al menos un evento activo asociado.

**Autenticación**: No requerida

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "nombre": "Música",
      "slug": "musica",
      "color": "#FF5733",
      "cantidadEventos": 15
    }
  ]
}
```

---

### GET /api/categorias/:idOSlug
Obtiene una categoría específica por ID o slug.

**Autenticación**: No requerida

**Path Parameters**:
- `idOSlug` (integer o string): ID o slug de la categoría

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    /* Objeto categoría completo */
  }
}
```

**Errores Posibles**:
- `404`: Categoría no encontrada

---

### POST /api/categorias
Crea una nueva categoría.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Request Body**:
```json
{
  "nombre": "string (max 50, obligatorio)",
  "descripcion": "string (opcional)",
  "color": "string (formato hexadecimal #RRGGBB, obligatorio)",
  "icono": "string (max 50, opcional)",
  "orden": "integer (opcional, default: 0)"
}
```

**Validaciones**:
- `nombre`: Obligatorio, max 50 caracteres
- `color`: Formato hexadecimal válido (ej: #FF5733)
- `slug`: Generado automáticamente desde el nombre

**Response 201 Created**:
```json
{
  "exito": true,
  "mensaje": "Categoría creada exitosamente",
  "datos": {
    /* Objeto categoría creado */
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación
- `401`: No autenticado
- `403`: No es administrador
- `409`: Slug duplicado

---

### PUT /api/categorias/:id
Actualiza una categoría existente.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID de la categoría

**Request Body**: Mismos campos que POST, todos opcionales

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Categoría actualizada exitosamente",
  "datos": {
    /* Objeto categoría actualizado */
  }
}
```

---

### DELETE /api/categorias/:id
Elimina una categoría.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID de la categoría

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Categoría eliminada exitosamente"
}
```

**Errores Posibles**:
- `400`: No se puede eliminar si tiene eventos asociados
- `401`: No autenticado
- `403`: No es administrador
- `404`: Categoría no encontrada

---

## Endpoints de Flyers

### GET /api/flyers
Lista todos los flyers con filtros y paginación.

**Autenticación**: Opcional (algunos filtros solo para admin)

**Query Parameters**:
- `pagina` (integer, default: 1)
- `limite` (integer, default: 10)
- `visible` (boolean): Filtrar por visibilidad (solo admin puede ver no visibles)
- `destacado` (boolean): Filtrar destacados
- `etiqueta` (string): Filtrar por etiqueta
- `ordenarPor` (enum: `orden`, `vistas`, `createdAt`, default: `orden`)
- `orden` (enum: `ASC`, `DESC`, default: `ASC`)

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "titulo": "Flyer Concierto Rock",
      "descripcion": "Flyer promocional",
      "imagenUrl": "https://...",
      "imagenThumbnail": "https://...",
      "eventoRelacionadoId": 5,
      "eventoRelacionado": {
        "id": 5,
        "titulo": "Concierto de Rock",
        "slug": "concierto-de-rock"
      },
      "etiquetas": ["música", "rock", "concierto"],
      "orden": 1,
      "visible": true,
      "destacado": true,
      "vistas": 150,
      "createdAt": "2025-11-01T10:00:00.000Z"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "totalPaginas": 2,
    "totalElementos": 15,
    "elementosPorPagina": 10
  }
}
```

---

### GET /api/flyers/destacados
Obtiene los flyers destacados.

**Autenticación**: No requerida

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    /* Array de flyers destacados */
  ]
}
```

---

### GET /api/flyers/galeria
Obtiene flyers visibles para la galería pública ordenados por orden.

**Autenticación**: No requerida

**Query Parameters**:
- `limite` (integer, default: 20)

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    /* Array de flyers visibles */
  ]
}
```

---

### GET /api/flyers/:id
Obtiene un flyer específico por ID. Incrementa contador de vistas.

**Autenticación**: Opcional

**Path Parameters**:
- `id` (integer): ID del flyer

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    /* Objeto flyer completo */
  }
}
```

**Errores Posibles**:
- `404`: Flyer no encontrado

---

### POST /api/flyers
Crea un nuevo flyer.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Request Body**:
```json
{
  "titulo": "string (3-200 caracteres, obligatorio)",
  "descripcion": "string (opcional)",
  "eventoRelacionadoId": "integer (opcional)",
  "etiquetas": "array de strings (opcional)",
  "orden": "integer (opcional, default: 0)",
  "visible": "boolean (opcional, default: true)",
  "destacado": "boolean (opcional, default: false)"
}
```

**Soporte de Archivos**:
- `imagen`: Archivo de imagen (obligatorio, max 5MB)

**Response 201 Created**:
```json
{
  "exito": true,
  "mensaje": "Flyer creado exitosamente",
  "datos": {
    /* Objeto flyer creado */
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación o falta imagen
- `401`: No autenticado
- `403`: No es administrador
- `404`: Evento relacionado no encontrado

---

### PUT /api/flyers/:id
Actualiza un flyer existente.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID del flyer

**Request Body**: Mismos campos que POST, todos opcionales

**Soporte de Archivos**:
- `imagen`: Nueva imagen (opcional)

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Flyer actualizado exitosamente",
  "datos": {
    /* Objeto flyer actualizado */
  }
}
```

---

### DELETE /api/flyers/:id
Elimina un flyer permanentemente.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID del flyer

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Flyer eliminado exitosamente"
}
```

**Nota**: La imagen también se elimina del almacenamiento.

---

## Endpoints de Solicitudes de Flyers

### GET /api/solicitudes
Lista solicitudes de flyers.

**Autenticación**: Requerida (JWT)
**Permisos**:
- Usuarios ven solo sus solicitudes
- Administradores ven todas

**Query Parameters**:
- `pagina` (integer, default: 1)
- `limite` (integer, default: 10)
- `estado` (enum: `pendiente`, `revisando`, `en_proceso`, `completado`, `rechazado`, `cancelado`)
- `prioridad` (enum: `baja`, `media`, `alta`, `urgente`)
- `ordenarPor` (enum: `fechaEvento`, `fechaLimite`, `prioridad`, `createdAt`, default: `createdAt`)
- `orden` (enum: `ASC`, `DESC`, default: `DESC`)

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "usuarioId": 2,
      "usuario": {
        "id": 2,
        "nombre": "María González",
        "email": "maria@example.com"
      },
      "nombreEvento": "Fiesta de Graduación",
      "tipoEvento": "Celebración",
      "fechaEvento": "2025-12-15",
      "descripcion": "Necesito un flyer para mi fiesta...",
      "referencias": "https://pinterest.com/...",
      "coloresPreferidos": "Azul y dorado",
      "estiloPreferido": "Moderno y elegante",
      "informacionIncluir": "Fecha, hora, lugar, dress code",
      "presupuesto": 3000.00,
      "contactoEmail": "maria@example.com",
      "contactoTelefono": "+54 9 123456789",
      "contactoWhatsapp": "+54 9 123456789",
      "fechaLimite": "2025-12-01",
      "estado": "en_proceso",
      "prioridad": "alta",
      "notasAdmin": "Diseño en progreso",
      "archivoResultado": null,
      "fechaCompletado": null,
      "calificacion": null,
      "comentarioUsuario": null,
      "createdAt": "2025-11-10T15:30:00.000Z",
      "updatedAt": "2025-11-12T10:00:00.000Z"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "totalPaginas": 1,
    "totalElementos": 5,
    "elementosPorPagina": 10
  }
}
```

---

### GET /api/solicitudes/estadisticas
Obtiene estadísticas de solicitudes.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    "total": 45,
    "porEstado": {
      "pendiente": 8,
      "revisando": 3,
      "en_proceso": 12,
      "completado": 18,
      "rechazado": 2,
      "cancelado": 2
    },
    "porPrioridad": {
      "baja": 10,
      "media": 25,
      "alta": 8,
      "urgente": 2
    },
    "calificacionPromedio": 4.5,
    "tiempoPromedioCompletado": "5 días"
  }
}
```

---

### GET /api/solicitudes/:id
Obtiene una solicitud específica.

**Autenticación**: Requerida (JWT)
**Permisos**: Propietario o administrador

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    /* Objeto solicitud completo con usuario */
  }
}
```

**Errores Posibles**:
- `401`: No autenticado
- `403`: Sin permisos (no es propietario ni admin)
- `404`: Solicitud no encontrada

---

### POST /api/solicitudes
Crea una nueva solicitud de diseño de flyer.

**Autenticación**: Requerida (JWT)
**Rate Limiting**: 5 solicitudes por hora por usuario

**Request Body**:
```json
{
  "nombreEvento": "string (3-200 caracteres, obligatorio)",
  "tipoEvento": "string (max 100, opcional)",
  "fechaEvento": "ISO8601 (opcional, no puede ser pasada)",
  "descripcion": "string (min 20 caracteres, obligatorio)",
  "referencias": "string (max 1000, opcional)",
  "coloresPreferidos": "string (max 200, opcional)",
  "estiloPreferido": "string (max 200, opcional)",
  "informacionIncluir": "string (max 1000, opcional)",
  "presupuesto": "float (min 0, opcional)",
  "contactoEmail": "email (obligatorio)",
  "contactoTelefono": "string (formato teléfono, opcional)",
  "contactoWhatsapp": "string (formato teléfono, opcional)",
  "fechaLimite": "ISO8601 (opcional, no puede ser pasada)"
}
```

**Response 201 Created**:
```json
{
  "exito": true,
  "mensaje": "Solicitud creada exitosamente",
  "datos": {
    /* Objeto solicitud creado */
  }
}
```

**Errores Posibles**:
- `400`: Errores de validación
- `401`: No autenticado
- `429`: Límite de solicitudes excedido

---

### PUT /api/solicitudes/:id
Actualiza una solicitud existente.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo propietario puede actualizar si estado es PENDIENTE o REVISANDO

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Request Body**: Mismos campos que POST, todos opcionales

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Solicitud actualizada exitosamente",
  "datos": {
    /* Objeto solicitud actualizado */
  }
}
```

**Errores Posibles**:
- `400`: No se puede editar (estado no permite edición)
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Solicitud no encontrada

---

### PATCH /api/solicitudes/:id/estado
Cambia el estado de una solicitud.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Request Body**:
```json
{
  "estado": "enum (obligatorio: pendiente, revisando, en_proceso, completado, rechazado, cancelado)",
  "prioridad": "enum (opcional: baja, media, alta, urgente)",
  "notasAdmin": "string (max 2000, opcional)"
}
```

**Validaciones de Transición de Estados**:
- PENDIENTE → REVISANDO, EN_PROCESO, RECHAZADO
- REVISANDO → EN_PROCESO, RECHAZADO
- EN_PROCESO → COMPLETADO, RECHAZADO
- COMPLETADO → (estado final)
- RECHAZADO → (estado final)
- CANCELADO → (estado final)

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Estado actualizado exitosamente",
  "datos": {
    /* Objeto solicitud con estado actualizado */
  }
}
```

**Errores Posibles**:
- `400`: Transición de estado no válida
- `401`: No autenticado
- `403`: No es administrador
- `404`: Solicitud no encontrada

---

### PATCH /api/solicitudes/:id/cancelar
Cancela una solicitud.

**Autenticación**: Requerida (JWT)
**Permisos**: Propietario o administrador

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Solicitud cancelada exitosamente"
}
```

**Errores Posibles**:
- `400`: No se puede cancelar (ya está completada o rechazada)
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Solicitud no encontrada

---

### POST /api/solicitudes/:id/calificar
Califica una solicitud completada.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo propietario

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Request Body**:
```json
{
  "calificacion": "integer (1-5, obligatorio)",
  "comentarioUsuario": "string (max 1000, opcional)"
}
```

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Calificación registrada exitosamente",
  "datos": {
    /* Objeto solicitud con calificación */
  }
}
```

**Errores Posibles**:
- `400`: Solicitud no está completada o ya fue calificada
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Solicitud no encontrada

---

### DELETE /api/solicitudes/:id
Elimina una solicitud.

**Autenticación**: Requerida (JWT)
**Permisos**: Propietario o administrador

**Path Parameters**:
- `id` (integer): ID de la solicitud

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Solicitud eliminada exitosamente"
}
```

**Errores Posibles**:
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Solicitud no encontrada

---

## Endpoints de Usuarios

### GET /api/usuarios
Lista todos los usuarios del sistema.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Query Parameters**:
- `pagina` (integer, default: 1)
- `limite` (integer, default: 10)
- `rol` (enum: `admin`, `usuario`)
- `activo` (boolean)
- `busqueda` (string): Buscar en nombre y email

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "usuario",
      "emailVerificado": true,
      "activo": true,
      "createdAt": "2025-10-01T10:00:00.000Z"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "totalPaginas": 3,
    "totalElementos": 25,
    "elementosPorPagina": 10
  }
}
```

---

### GET /api/usuarios/estadisticas
Obtiene estadísticas de usuarios.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    "totalUsuarios": 125,
    "usuariosActivos": 118,
    "usuariosInactivos": 7,
    "administradores": 3,
    "usuariosRegulares": 122,
    "emailsVerificados": 110,
    "nuevosMesActual": 8
  }
}
```

---

### GET /api/usuarios/:id
Obtiene información de un usuario específico.

**Autenticación**: Requerida (JWT)
**Permisos**: Usuario mismo o administrador

**Path Parameters**:
- `id` (integer): ID del usuario

**Response 200 OK**:
```json
{
  "exito": true,
  "datos": {
    /* Objeto usuario completo (sin datos sensibles) */
  }
}
```

**Errores Posibles**:
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Usuario no encontrado

---

### PUT /api/usuarios/:id
Actualiza información de un usuario.

**Autenticación**: Requerida (JWT)
**Permisos**: Usuario mismo o administrador

**Path Parameters**:
- `id` (integer): ID del usuario

**Request Body** (todos opcionales):
```json
{
  "nombre": "string (2-100 caracteres)",
  "avatarUrl": "URL"
}
```

**Nota**: Los administradores pueden actualizar más campos.

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Usuario actualizado exitosamente",
  "datos": {
    /* Objeto usuario actualizado */
  }
}
```

---

### DELETE /api/usuarios/:id
Desactiva un usuario.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID del usuario

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Usuario desactivado exitosamente"
}
```

**Nota**: Soft delete (marca como inactivo).

---

### PATCH /api/usuarios/:id/reactivar
Reactiva un usuario desactivado.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID del usuario

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Usuario reactivado exitosamente"
}
```

---

### PATCH /api/usuarios/:id/cambiar-rol
Cambia el rol de un usuario.

**Autenticación**: Requerida (JWT)
**Permisos**: Solo administradores

**Path Parameters**:
- `id` (integer): ID del usuario

**Request Body**:
```json
{
  "rol": "enum (admin, usuario)"
}
```

**Response 200 OK**:
```json
{
  "exito": true,
  "mensaje": "Rol actualizado exitosamente",
  "datos": {
    /* Objeto usuario con rol actualizado */
  }
}
```

**Errores Posibles**:
- `400`: No puede cambiar su propio rol si es el último admin
- `401`: No autenticado
- `403`: No es administrador
- `404`: Usuario no encontrado

---

## Rate Limiting

El sistema implementa limitación de peticiones para prevenir abuso:

| Endpoint | Límite |
|----------|--------|
| POST /api/auth/registro | 5 peticiones / hora / IP |
| POST /api/auth/login | 10 peticiones / 15 min / IP |
| POST /api/auth/recuperar-password | 3 peticiones / hora / email |
| POST /api/auth/reenviar-verificacion | 3 peticiones / hora / email |
| POST /api/eventos | 10 creaciones / hora / usuario |
| POST /api/solicitudes | 5 creaciones / hora / usuario |
| Otros endpoints autenticados | 100 peticiones / 15 min / usuario |
| Endpoints públicos | 1000 peticiones / hora / IP |

**Respuesta cuando se excede el límite (429)**:
```json
{
  "exito": false,
  "mensaje": "Demasiadas peticiones. Por favor intenta más tarde.",
  "retryAfter": 3600
}
```

Headers de respuesta incluyen:
- `X-RateLimit-Limit`: Límite total
- `X-RateLimit-Remaining`: Peticiones restantes
- `X-RateLimit-Reset`: Timestamp de reset
- `Retry-After`: Segundos hasta poder reintentar (solo en 429)

---

## Seguridad

### Autenticación JWT
- Los tokens expiran en 24 horas
- Se incluye el ID y rol del usuario en el payload
- Algoritmo: HS256
- Header requerido: `Authorization: Bearer <token>`

### Validación y Sanitización
- Todos los inputs son validados con express-validator
- Los campos de texto son sanitizados para prevenir XSS
- Las búsquedas son sanitizadas para prevenir SQL injection
- Los emails son normalizados

### Protección de Contraseñas
- Hasheadas con bcrypt (10 rounds)
- Nunca se devuelven en respuestas
- Requisitos: 8+ caracteres, mayúscula, minúscula, número, carácter especial

### CORS
- Configurado para permitir solo orígenes autorizados
- Headers permitidos: Authorization, Content-Type
- Métodos: GET, POST, PUT, PATCH, DELETE

### Otras Medidas
- Helmet.js para headers de seguridad
- Prevención de ataques de fuerza bruta con rate limiting
- Tokens de recuperación expiran en 1 hora
- Soft delete para preservar integridad de datos

---

## Códigos de Error Comunes

### Validación (400)
```json
{
  "exito": false,
  "mensaje": "Errores de validación",
  "errores": [
    {
      "campo": "email",
      "mensaje": "El email es obligatorio"
    },
    {
      "campo": "password",
      "mensaje": "La contraseña debe tener al menos 8 caracteres"
    }
  ]
}
```

### No Autenticado (401)
```json
{
  "exito": false,
  "mensaje": "No autenticado. Token inválido o expirado."
}
```

### Sin Permisos (403)
```json
{
  "exito": false,
  "mensaje": "No tienes permisos para realizar esta acción"
}
```

### No Encontrado (404)
```json
{
  "exito": false,
  "mensaje": "Recurso no encontrado"
}
```

### Conflicto (409)
```json
{
  "exito": false,
  "mensaje": "El email ya está registrado"
}
```

### Error del Servidor (500)
```json
{
  "exito": false,
  "mensaje": "Error interno del servidor"
}
```

---

## Paginación

Todos los endpoints de listado soportan paginación mediante query parameters:

**Parámetros**:
- `pagina`: Número de página (default: 1, min: 1)
- `limite`: Elementos por página (default: 10, min: 1, max: 10000)
- `ordenarPor`: Campo para ordenar (varía por endpoint)
- `orden`: Dirección de orden (ASC o DESC)

**Respuesta**:
```json
{
  "exito": true,
  "datos": [ /* array de elementos */ ],
  "paginacion": {
    "paginaActual": 1,
    "totalPaginas": 5,
    "totalElementos": 48,
    "elementosPorPagina": 10
  }
}
```

---

## Formato de Fechas y Horas

### Fechas
- Formato: ISO 8601 (YYYY-MM-DD)
- Ejemplo: `"2025-12-25"`

### Timestamps
- Formato: ISO 8601 con timezone
- Ejemplo: `"2025-11-14T10:30:00.000Z"`

### Horas
- Formato: HH:MM (24 horas)
- Ejemplo: `"20:30"`

---

## Subida de Archivos

### Endpoints que aceptan archivos:
- POST/PUT /api/eventos (campo: `imagen`)
- POST/PUT /api/flyers (campo: `imagen`)

### Configuración:
- Tamaño máximo: 5MB
- Formatos aceptados: jpg, jpeg, png, gif, webp
- Campo en multipart/form-data: `imagen`

### Ejemplo con curl:
```bash
curl -X POST http://localhost:5000/api/eventos \
  -H "Authorization: Bearer <token>" \
  -F "titulo=Nuevo Evento" \
  -F "descripcion=Descripción del evento..." \
  -F "categoriaId=1" \
  -F "fechaInicio=2025-12-25" \
  -F "ubicacion=Teatro Municipal" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

---

**Versión de la Documentación**: 1.0
**Última Actualización**: 2025-11-14
**Soporte**: Para reportar errores o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.
