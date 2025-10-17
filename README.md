# Docuu - Prueba Técnica Fullstack (Frontend Angular)

## Descripción
Este proyecto implementa el **módulo de gestión de órdenes de impresión** en Angular, según los lineamientos de la prueba técnica para el cargo de Desarrollador Fullstack Semi-Senior en Docuu.

El frontend permite:
- Autenticación con JWT.
- Protección de rutas y roles (`viewer`, `operator`, `admin`).
- CRUD completo de órdenes (crear, listar, editar, eliminar, ver detalle).
- Validaciones reactivas y verificación de duplicados en cliente.
- Manejo de errores HTTP y mensajes amigables en UI.

---

## Tecnologías
- **Angular 19+**
- **TypeScript**
- **RxJS / Reactive Forms**
- **Angular Material** (para interfaz y paginación)
- **JWT Auth (interceptor + guard)**

---

## Estructura del módulo

```
src/app/order-management/
│
├── components/
│   ├── order-list/
│   ├── order-form/
│   └── order-detail/
│
├── services/
│   └── order.service.ts
│
├── guards/
│   ├── auth.guard.ts
│   └── role.guard.ts
│
└── interceptors/
    └── auth.interceptor.ts
```

---

## Instalación y ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar el entorno (`src/environments/environment.ts`):
   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8000/api'
   };
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   ng serve
   ```

   Acceso local: [http://localhost:4200](http://localhost:4200)

---

## Roles y acceso

| Rol       | Acceso                                        |
|------------|----------------------------------------------|
| viewer     | Solo ver y listar órdenes                    |
| operator   | Listar, Crear, editar y eliminar órdenes     |
| admin      | Acceso completo                              |

---

## Validación de duplicados
El formulario de creación y edición consulta al backend (`GET /api/orders?client_name=&delivery_date=`) para validar si ya existe una orden con la misma combinación. Si existe, bloquea el envío y muestra un mensaje claro al usuario.

---

## Autenticación
- Login con `/api/auth/login` (email, password).
- Token almacenado en `localStorage`.
- `HttpInterceptor` adjunta `Authorization: Bearer <token>`.
- Redirección automática a `/login` si el token expira o es inválido.

---

## Scripts útiles
```bash
npm run build      # Compila para producción
npm run lint       # Revisa estilo y errores de código
```

---

## Autor
Prueba técnica desarrollada por **Camilo Lopez** para **Docuu**.  
Frontend desarrollado con **Angular 19**.

## Preguntas

1️⃣ Si el sistema debiera procesar más de 100.000 órdenes diarias, ¿qué cambios harías en la arquitectura del backend para asegurar rendimiento, observabilidad y mantenibilidad?

Escalaría la arquitectura hacia un entorno distribuido y observable, manteniendo Laravel como API principal pero eliminando cuellos de botella:

Escalabilidad: contenedores con Docker + Kubernetes, balanceo de carga y API stateless.

Procesos asíncronos: mover tareas pesadas (notificaciones, validaciones masivas, reportes) a jobs en Redis o RabbitMQ.

Base de datos: índices, read replicas, y particionamiento por fecha para mantener consultas rápidas.

Cacheo: Redis para resultados frecuentes y control de tráfico.

Búsqueda: Elasticsearch para consultas complejas.

Patrones: aplicar CQRS y event-driven para separar lectura/escritura y desacoplar servicios.

Observabilidad: logs estructurados (ELK/Loki), métricas (Prometheus + Grafana), tracing (OpenTelemetry) y alertas.

Mantenibilidad: arquitectura modular (Clean o Hexagonal), CI/CD automatizado y versionado de API.

Con eso el sistema puede crecer sin perder control ni romper la operación diaria.

2️⃣ ¿Cómo implementarías una capa de autenticación y autorización segura para estos endpoints sin deteriorar la experiencia de usuario?

Usaría JWT con refresh tokens rotativos, combinando seguridad con fluidez:

Backend (Laravel)

access_token corto (5–15 min) con datos mínimos.

refresh_token largo (7–30 días), guardado en cookie HttpOnly Secure y rotado en cada uso.

Middleware auth:api + role:operator|admin o spatie/laravel-permission.

Logout revoca refresh token y borra cookie.

Frontend (Angular)

Guarda el access token en memoria.

Usa HttpInterceptor para agregar Authorization: Bearer <token>.

Si el token expira (401), el interceptor llama una sola vez a /auth/refresh, actualiza el token y reintenta la petición.

AuthGuard protege rutas; RoleGuard valida permisos (viewer, operator, admin).

Extras de seguridad

HTTPS obligatorio, rate limiting en login, bloqueo tras intentos fallidos y auditoría de tokens.

Este enfoque mantiene sesiones seguras, sin recargas innecesarias ni interrupciones en la experiencia del usuario.