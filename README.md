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
- **Angular 15+**
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
Prueba técnica desarrollada por **[Tu nombre]** para **Docuu**.  
Frontend desarrollado con **Angular 15**.
