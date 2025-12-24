# Casos de Uso - Agenda Cultural

## Descripción General
Este documento describe los casos de uso principales del sistema de Agenda Cultural, detallando las interacciones entre los usuarios (administradores y usuarios regulares) y el sistema, incluyendo flujos principales, alternativos y excepcionales.

---

## Diagrama General de Casos de Uso

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome
skinparam backgroundColor #FFFFFF

actor "Usuario Invitado" as Invitado
actor "Usuario Registrado" as Usuario
actor "Administrador" as Admin

rectangle "Sistema Agenda Cultural" {
  ' Casos de uso públicos
  usecase "Visualizar Eventos" as UC1
  usecase "Buscar Eventos" as UC2
  usecase "Filtrar por Categoría" as UC3
  usecase "Ver Detalle de Evento" as UC4
  usecase "Ver Galería de Flyers" as UC5

  ' Casos de uso de autenticación
  usecase "Registrarse" as UC6
  usecase "Iniciar Sesión" as UC7
  usecase "Verificar Email" as UC8
  usecase "Recuperar Contraseña" as UC9
  usecase "Cerrar Sesión" as UC10

  ' Casos de uso de usuario registrado
  usecase "Gestionar Perfil" as UC11
  usecase "Crear Evento" as UC12
  usecase "Editar Evento Propio" as UC13
  usecase "Eliminar Evento Propio" as UC14
  usecase "Solicitar Diseño de Flyer" as UC15
  usecase "Ver Mis Solicitudes" as UC16
  usecase "Calificar Solicitud" as UC17
  usecase "Cancelar Solicitud" as UC18

  ' Casos de uso de administrador
  usecase "Gestionar Categorías" as UC19
  usecase "Gestionar Todos los Eventos" as UC20
  usecase "Gestionar Flyers" as UC21
  usecase "Gestionar Solicitudes" as UC22
  usecase "Cambiar Estado de Solicitud" as UC23
  usecase "Gestionar Usuarios" as UC24
  usecase "Ver Estadísticas" as UC25
  usecase "Cambiar Rol de Usuario" as UC26
}

' Relaciones - Usuario Invitado
Invitado --> Visualizar Eventos
Invitado --> Buscar Eventos
Invitado --> Filtrar por Categoría
Invitado --> Ver Detalle de Evento
Invitado --> Ver Galería de Flyers
Invitado --> Registrarse
Invitado --> Iniciar Sesión
Invitado --> Verificar Email
Invitado --> Recuperar Contraseña

' Relaciones - Usuario Registrado (hereda de Invitado)
Usuario --> Cerrar Sesión
Usuario --> Gestionar Perfil
Usuario --> Crear Evento
Usuario --> Editar Evento Propio
Usuario --> Eliminar Evento Propio
Usuario --> Solicitar Diseño de Flyer
Usuario --> Ver Mis Solicitudes
Usuario --> Calificar Solicitud
Usuario --> Cancelar Solicitud

' Relaciones - Administrador (hereda de Usuario)
Admin --> Gestionar Categorías
Admin --> Gestionar Todos los Eventos
Admin --> Gestionar Flyers
Admin --> Gestionar Solicitudes
Admin --> Cambiar Estado de Solicitud
Admin --> Gestionar Usuarios
Admin --> Ver Estadísticas
Admin --> Cambiar Rol de Usuario

' Extensiones y dependencias
UC6 ..> UC8 : <<extend>>
UC7 ..> UC9 : <<extend>>
UC15 ..> UC16 : <<include>>
UC22 ..> UC23 : <<include>>

@enduml
```

---

## Casos de Uso Detallados

### CU-01: Visualizar Eventos
**Actor**: Usuario Invitado, Usuario Registrado, Administrador
**Precondiciones**: Ninguna
**Postcondiciones**: Se muestra el listado de eventos activos

**Flujo Principal**:
1. El usuario accede a la página principal
2. El sistema carga y muestra los eventos destacados
3. El sistema muestra los próximos eventos
4. El usuario puede navegar por la lista de eventos

**Flujos Alternativos**:
- **FA-01**: Si no hay eventos, se muestra un mensaje informativo
- **FA-02**: El usuario puede ordenar eventos por fecha o popularidad

**Flujos de Excepción**:
- **FE-01**: Si hay error de conexión, se muestra mensaje de error

---

### CU-02: Buscar Eventos
**Actor**: Usuario Invitado, Usuario Registrado, Administrador
**Precondiciones**: Ninguna
**Postcondiciones**: Se muestran eventos que coinciden con la búsqueda

**Flujo Principal**:
1. El usuario ingresa términos de búsqueda en el campo correspondiente
2. El sistema busca coincidencias en título, descripción y ubicación
3. Se muestran los resultados ordenados por relevancia
4. El usuario puede seleccionar un evento para ver más detalles

**Flujos Alternativos**:
- **FA-01**: Si no hay resultados, se sugieren eventos similares
- **FA-02**: El usuario puede aplicar filtros adicionales

**Flujos de Excepción**:
- **FE-01**: Si la búsqueda contiene caracteres inválidos, se sanitiza automáticamente

---

### CU-03: Filtrar por Categoría
**Actor**: Usuario Invitado, Usuario Registrado, Administrador
**Precondiciones**: Existen categorías creadas
**Postcondiciones**: Se muestran eventos de la categoría seleccionada

**Flujo Principal**:
1. El sistema muestra las categorías disponibles
2. El usuario selecciona una categoría
3. El sistema filtra y muestra solo eventos de esa categoría
4. El usuario puede ver los eventos filtrados

**Flujos Alternativos**:
- **FA-01**: El usuario puede seleccionar múltiples categorías
- **FA-02**: Puede combinar categorías con otros filtros

---

### CU-04: Ver Detalle de Evento
**Actor**: Usuario Invitado, Usuario Registrado, Administrador
**Precondiciones**: El evento existe y está activo
**Postcondiciones**: Se incrementa el contador de vistas

**Flujo Principal**:
1. El usuario hace clic en un evento
2. El sistema carga todos los detalles del evento
3. Se incrementa el contador de vistas
4. Se muestra información completa: fecha, hora, ubicación, precio, descripción, imágenes
5. Se muestran eventos relacionados de la misma categoría

**Flujos Alternativos**:
- **FA-01**: Si hay link de tickets, se muestra botón para comprar
- **FA-02**: Si hay ubicación con coordenadas, se muestra mapa

**Flujos de Excepción**:
- **FE-01**: Si el evento no existe, se redirige a página de error 404

---

### CU-05: Ver Galería de Flyers
**Actor**: Usuario Invitado, Usuario Registrado, Administrador
**Precondiciones**: Ninguna
**Postcondiciones**: Se muestran los flyers visibles

**Flujo Principal**:
1. El usuario accede a la sección de galería
2. El sistema carga los flyers destacados primero
3. Se muestran flyers en formato de galería con miniaturas
4. El usuario puede hacer clic para ampliar

**Flujos Alternativos**:
- **FA-01**: El usuario puede filtrar por etiquetas
- **FA-02**: Si el flyer está relacionado con un evento, se puede navegar a él

---

### CU-06: Registrarse
**Actor**: Usuario Invitado
**Precondiciones**: El usuario no está registrado
**Postcondiciones**: Se crea una cuenta y se envía email de verificación

**Flujo Principal**:
1. El usuario accede al formulario de registro
2. Ingresa nombre, email y contraseña
3. El sistema valida que el email no esté registrado
4. Se valida que la contraseña cumpla requisitos de seguridad
5. Se encripta la contraseña
6. Se crea el usuario con rol "USUARIO"
7. Se genera token de verificación
8. Se envía email de verificación
9. Se muestra mensaje de éxito

**Flujos Alternativos**:
- **FA-01**: El usuario puede registrarse con redes sociales (futuro)

**Flujos de Excepción**:
- **FE-01**: Si el email ya existe, se muestra error
- **FE-02**: Si la contraseña es débil, se solicita una más segura
- **FE-03**: Si falla el envío del email, se reintenta

---

### CU-07: Iniciar Sesión
**Actor**: Usuario Invitado
**Precondiciones**: El usuario está registrado
**Postcondiciones**: El usuario obtiene acceso autenticado

**Flujo Principal**:
1. El usuario accede al formulario de login
2. Ingresa email y contraseña
3. El sistema valida las credenciales
4. Se verifica que la cuenta esté activa
5. Se genera token JWT
6. Se redirige al usuario a su perfil o página anterior

**Flujos Alternativos**:
- **FA-01**: Si el email no está verificado, se ofrece reenviar verificación

**Flujos de Excepción**:
- **FE-01**: Si las credenciales son incorrectas, se muestra error
- **FE-02**: Si la cuenta está inactiva, se muestra mensaje correspondiente
- **FE-03**: Después de 5 intentos fallidos, se bloquea temporalmente

---

### CU-08: Verificar Email
**Actor**: Usuario Invitado
**Precondiciones**: El usuario se ha registrado
**Postcondiciones**: La cuenta queda verificada

**Flujo Principal**:
1. El usuario recibe email con link de verificación
2. Hace clic en el link
3. El sistema valida el token
4. Se marca emailVerificado como true
5. Se elimina el token de verificación
6. Se muestra mensaje de éxito y redirige a login

**Flujos de Excepción**:
- **FE-01**: Si el token es inválido o expiró, se ofrece reenviar
- **FE-02**: Si ya está verificado, se informa y redirige

---

### CU-09: Recuperar Contraseña
**Actor**: Usuario Invitado
**Precondiciones**: El usuario tiene cuenta registrada
**Postcondiciones**: Se envía email con instrucciones

**Flujo Principal**:
1. El usuario accede a "Olvidé mi contraseña"
2. Ingresa su email
3. El sistema verifica que el email existe
4. Se genera token de recuperación con expiración
5. Se envía email con link de restablecimiento
6. El usuario hace clic en el link
7. Ingresa nueva contraseña
8. El sistema valida la contraseña
9. Se encripta y actualiza
10. Se elimina el token de recuperación

**Flujos de Excepción**:
- **FE-01**: Si el email no existe, se muestra mensaje genérico por seguridad
- **FE-02**: Si el token expiró, debe solicitar uno nuevo

---

### CU-10: Cerrar Sesión
**Actor**: Usuario Registrado, Administrador
**Precondiciones**: El usuario está autenticado
**Postcondiciones**: Se cierra la sesión

**Flujo Principal**:
1. El usuario hace clic en "Cerrar sesión"
2. El sistema invalida el token del lado del cliente
3. Se redirige a la página principal

---

### CU-11: Gestionar Perfil
**Actor**: Usuario Registrado, Administrador
**Precondiciones**: El usuario está autenticado
**Postcondiciones**: Los datos del perfil se actualizan

**Flujo Principal**:
1. El usuario accede a su perfil
2. El sistema carga los datos actuales
3. El usuario modifica nombre, avatar u otros datos
4. El sistema valida los cambios
5. Se actualizan los datos
6. Se muestra mensaje de confirmación

**Flujos Alternativos**:
- **FA-01**: El usuario puede cambiar su contraseña (requiere contraseña actual)

**Flujos de Excepción**:
- **FE-01**: Si intenta cambiar a email ya existente, se muestra error
- **FE-02**: Si la imagen de avatar es muy grande, se rechaza

---

### CU-12: Crear Evento
**Actor**: Usuario Registrado, Administrador
**Precondiciones**: El usuario está autenticado
**Postcondiciones**: Se crea un nuevo evento

**Flujo Principal**:
1. El usuario accede al formulario de creación
2. Completa información obligatoria: título, descripción, categoría, fecha, ubicación, precio
3. Opcionalmente agrega: imagen, horarios, links, contacto
4. El sistema valida todos los campos
5. Se genera slug único a partir del título
6. Se crea el evento asociado al usuario
7. Se muestra mensaje de éxito
8. Se redirige al detalle del evento creado

**Flujos Alternativos**:
- **FA-01**: El usuario puede cargar imagen desde su dispositivo
- **FA-02**: Puede establecer ubicación mediante mapa

**Flujos de Excepción**:
- **FE-01**: Si faltan campos obligatorios, se marcan en rojo
- **FE-02**: Si la imagen es muy grande, se rechaza
- **FE-03**: Si hay rate limiting activo, se informa al usuario

---

### CU-13: Editar Evento Propio
**Actor**: Usuario Registrado
**Precondiciones**: El usuario creó el evento o es administrador
**Postcondiciones**: El evento se actualiza

**Flujo Principal**:
1. El usuario accede al evento
2. Hace clic en "Editar"
3. El sistema verifica permisos (creador o admin)
4. Se carga el formulario con datos actuales
5. El usuario modifica los campos deseados
6. El sistema valida los cambios
7. Se actualiza el evento
8. Se muestra confirmación

**Flujos de Excepción**:
- **FE-01**: Si no tiene permisos, se muestra error 403
- **FE-02**: Si el evento ya no existe, error 404

---

### CU-14: Eliminar Evento Propio
**Actor**: Usuario Registrado
**Precondiciones**: El usuario creó el evento o es administrador
**Postcondiciones**: El evento se marca como inactivo

**Flujo Principal**:
1. El usuario accede al evento
2. Hace clic en "Eliminar"
3. El sistema pide confirmación
4. El usuario confirma
5. El sistema verifica permisos
6. Se marca el evento como inactivo (soft delete)
7. Se muestra confirmación

**Flujos Alternativos**:
- **FA-01**: El administrador puede eliminar permanentemente

---

### CU-15: Solicitar Diseño de Flyer
**Actor**: Usuario Registrado
**Precondiciones**: El usuario está autenticado
**Postcondiciones**: Se crea una solicitud de diseño

**Flujo Principal**:
1. El usuario accede al formulario de solicitud
2. Completa información del evento
3. Especifica preferencias: colores, estilo, información a incluir
4. Agrega referencias visuales o links
5. Indica fecha límite y presupuesto (opcional)
6. Proporciona datos de contacto
7. El sistema valida la información
8. Se crea la solicitud con estado PENDIENTE
9. Se envía notificación a administradores
10. Se muestra confirmación al usuario

**Flujos Alternativos**:
- **FA-01**: El usuario puede adjuntar archivos de referencia

**Flujos de Excepción**:
- **FE-01**: Si falta información obligatoria, se marca
- **FE-02**: Si hay rate limiting, se informa

---

### CU-16: Ver Mis Solicitudes
**Actor**: Usuario Registrado
**Precondiciones**: El usuario está autenticado
**Postcondiciones**: Se muestran las solicitudes del usuario

**Flujo Principal**:
1. El usuario accede a "Mis Solicitudes"
2. El sistema carga todas sus solicitudes
3. Se muestran ordenadas por fecha (más recientes primero)
4. Para cada solicitud se muestra: nombre, estado, prioridad, fecha
5. El usuario puede hacer clic para ver detalles

**Flujos Alternativos**:
- **FA-01**: Puede filtrar por estado
- **FA-02**: Puede buscar por nombre de evento

---

### CU-17: Calificar Solicitud
**Actor**: Usuario Registrado
**Precondiciones**: La solicitud está COMPLETADA y no ha sido calificada
**Postcondiciones**: Se registra la calificación

**Flujo Principal**:
1. El usuario accede a su solicitud completada
2. Se muestra opción para calificar
3. Selecciona puntuación de 1 a 5 estrellas
4. Opcionalmente agrega comentario
5. El sistema valida la calificación
6. Se guardan calificación y comentario
7. Se muestra agradecimiento

**Flujos de Excepción**:
- **FE-01**: Si ya calificó, se muestra la calificación anterior
- **FE-02**: Si la solicitud no está completada, no puede calificar

---

### CU-18: Cancelar Solicitud
**Actor**: Usuario Registrado
**Precondiciones**: La solicitud no está COMPLETADA ni CANCELADA
**Postcondiciones**: La solicitud cambia a estado CANCELADO

**Flujo Principal**:
1. El usuario accede a su solicitud
2. Hace clic en "Cancelar solicitud"
3. El sistema pide confirmación
4. El usuario confirma
5. Se actualiza estado a CANCELADO
6. Se notifica a administradores
7. Se muestra confirmación

**Flujos de Excepción**:
- **FE-01**: Si ya está completada, no se puede cancelar

---

### CU-19: Gestionar Categorías
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Las categorías se crean/modifican/eliminan

**Flujo Principal - Crear**:
1. El administrador accede a gestión de categorías
2. Hace clic en "Nueva categoría"
3. Ingresa nombre, color, icono, descripción
4. El sistema genera slug único
5. Se valida que el color sea hexadecimal válido
6. Se crea la categoría
7. Se muestra en la lista

**Flujo Principal - Editar**:
1. Selecciona una categoría existente
2. Modifica los campos deseados
3. Se valida y actualiza

**Flujo Principal - Eliminar**:
1. Selecciona una categoría
2. Si tiene eventos asociados, se advierte
3. Puede marcar como inactiva o eliminar si no tiene eventos

---

### CU-20: Gestionar Todos los Eventos
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Los eventos se gestionan

**Flujo Principal**:
1. El administrador accede al panel de eventos
2. Ve todos los eventos (propios y de otros usuarios)
3. Puede editar cualquier evento
4. Puede destacar o quitar destacado
5. Puede activar o desactivar eventos
6. Puede eliminar eventos

**Flujos Alternativos**:
- **FA-01**: Puede filtrar por estado, categoría, usuario
- **FA-02**: Puede ver estadísticas de vistas

---

### CU-21: Gestionar Flyers
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Los flyers se gestionan

**Flujo Principal - Subir Flyer**:
1. El administrador accede a gestión de flyers
2. Hace clic en "Subir flyer"
3. Carga la imagen
4. Completa título y descripción
5. Opcionalmente asocia a un evento existente
6. Agrega etiquetas
7. Define si es visible y/o destacado
8. Establece orden de visualización
9. Se crea el flyer

**Flujo Principal - Editar**:
1. Selecciona un flyer
2. Modifica campos
3. Puede cambiar imagen
4. Se actualiza

**Flujo Principal - Eliminar**:
1. Selecciona flyer
2. Confirma eliminación
3. Se elimina permanentemente

---

### CU-22: Gestionar Solicitudes
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Las solicitudes se gestionan

**Flujo Principal**:
1. El administrador accede a gestión de solicitudes
2. Ve todas las solicitudes de todos los usuarios
3. Puede filtrar por estado, prioridad, fecha
4. Selecciona una solicitud para ver detalles completos
5. Puede agregar notas administrativas
6. Puede cambiar prioridad
7. Puede cambiar estado (ver CU-23)
8. Puede subir archivo resultante

**Flujos Alternativos**:
- **FA-01**: Ver estadísticas de solicitudes

---

### CU-23: Cambiar Estado de Solicitud
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN y existe la solicitud
**Postcondiciones**: El estado de la solicitud se actualiza

**Flujo Principal**:
1. El administrador accede a una solicitud
2. Selecciona nuevo estado del dropdown
3. Si es COMPLETADO, debe adjuntar archivo resultante
4. Agrega notas administrativas (opcional)
5. El sistema valida el cambio de estado
6. Se actualiza el estado
7. Si cambia a COMPLETADO, se registra fecha
8. Se notifica al usuario por email
9. Se muestra confirmación

**Flujos de Validación**:
- PENDIENTE → REVISANDO, EN_PROCESO, RECHAZADO
- REVISANDO → EN_PROCESO, RECHAZADO
- EN_PROCESO → COMPLETADO, RECHAZADO
- COMPLETADO → (estado final, no se puede cambiar)
- RECHAZADO → (estado final, no se puede cambiar)

---

### CU-24: Gestionar Usuarios
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Los usuarios se gestionan

**Flujo Principal**:
1. El administrador accede a gestión de usuarios
2. Ve listado de todos los usuarios
3. Puede buscar por nombre o email
4. Puede filtrar por rol o estado
5. Selecciona un usuario para ver detalles
6. Puede editar información del usuario
7. Puede activar/desactivar usuarios
8. Puede cambiar rol (ver CU-26)
9. Puede reactivar usuarios inactivos

**Flujos Alternativos**:
- **FA-01**: Ver estadísticas de usuarios

---

### CU-25: Ver Estadísticas
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: Se muestran estadísticas del sistema

**Flujo Principal**:
1. El administrador accede al dashboard
2. Se muestran estadísticas generales:
   - Total de usuarios registrados
   - Nuevos usuarios este mes
   - Total de eventos activos
   - Eventos destacados
   - Total de solicitudes
   - Solicitudes por estado
   - Flyers publicados
   - Eventos más vistos
   - Categorías más populares
3. Puede seleccionar rangos de fecha
4. Puede exportar reportes

---

### CU-26: Cambiar Rol de Usuario
**Actor**: Administrador
**Precondiciones**: El usuario tiene rol ADMIN
**Postcondiciones**: El rol del usuario objetivo se modifica

**Flujo Principal**:
1. El administrador accede a la gestión de usuarios
2. Selecciona el usuario a modificar
3. Selecciona el nuevo rol (ADMIN o USUARIO)
4. El sistema pide confirmación
5. El administrador confirma
6. Se actualiza el rol del usuario
7. Se muestra confirmación
8. Opcionalmente se notifica al usuario

**Flujos de Excepción**:
- **FE-01**: No puede cambiar su propio rol si es el único admin

---

## Matriz de Trazabilidad

| Caso de Uso | Actor | Prioridad | Complejidad | Estado |
|-------------|-------|-----------|-------------|--------|
| CU-01 | Todos | Alta | Baja | Implementado |
| CU-02 | Todos | Alta | Media | Implementado |
| CU-03 | Todos | Alta | Baja | Implementado |
| CU-04 | Todos | Alta | Media | Implementado |
| CU-05 | Todos | Media | Baja | Implementado |
| CU-06 | Invitado | Alta | Media | Implementado |
| CU-07 | Invitado | Alta | Media | Implementado |
| CU-08 | Invitado | Alta | Media | Implementado |
| CU-09 | Invitado | Media | Media | Implementado |
| CU-10 | Usuario/Admin | Alta | Baja | Implementado |
| CU-11 | Usuario/Admin | Media | Media | Implementado |
| CU-12 | Usuario/Admin | Alta | Alta | Implementado |
| CU-13 | Usuario/Admin | Alta | Media | Implementado |
| CU-14 | Usuario/Admin | Media | Media | Implementado |
| CU-15 | Usuario | Alta | Alta | Implementado |
| CU-16 | Usuario | Alta | Media | Implementado |
| CU-17 | Usuario | Media | Baja | Implementado |
| CU-18 | Usuario | Media | Baja | Implementado |
| CU-19 | Admin | Alta | Media | Implementado |
| CU-20 | Admin | Alta | Alta | Implementado |
| CU-21 | Admin | Alta | Media | Implementado |
| CU-22 | Admin | Alta | Alta | Implementado |
| CU-23 | Admin | Alta | Media | Implementado |
| CU-24 | Admin | Media | Media | Implementado |
| CU-25 | Admin | Media | Media | Implementado |
| CU-26 | Admin | Media | Baja | Implementado |

---

**Versión**: 1.0
**Fecha**: 2025-11-14
**Total de Casos de Uso**: 26
