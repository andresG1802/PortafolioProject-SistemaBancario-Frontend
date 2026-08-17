# Sistema Bancario — Frontend (React + TypeScript + Vite)

Frontend para `PortafolioProject-SistemaBancario-Backend`. Sigue el patron de carpetas del
repo [react-mern-calendar](https://github.com/Klerith/react-mern-calendar) (feature folders con
`components/` + `pages/` + barrel `index.ts`, un slice de Redux Toolkit por dominio en
`store/`, un hook por dominio en `hooks/` que envuelve `useDispatch`/`useSelector`), adaptado a
los 5 dominios del banco y con Framer Motion para las animaciones.

## Stack

Vite + React 19 + TypeScript, Yarn, Redux Toolkit + React Redux, React Router, Axios,
Framer Motion, date-fns.

## Como levantarlo

Requiere el backend corriendo (`PortafolioProject-SistemaBancario-Backend`: Postgres +
Keycloak via `docker compose up -d`, y los 7 servicios Java).

```bash
yarn install
yarn dev       # http://localhost:5173
```

Variables de entorno (`.env`, ver `.env.example`):

```
VITE_API_URL=http://localhost:8080          # api-gateway
VITE_KEYCLOAK_URL=http://localhost:8181
VITE_KEYCLOAK_REALM=banco-realm
VITE_KEYCLOAK_CLIENT_ID=banco-gateway
```

Usuarios de prueba (los mismos del realm de Keycloak): `cliente.perez`/`cliente123`,
`cajero.diaz`/`cajero123`, `admin.sistema`/`admin123`.

## Estructura

```
src/
├── BancoApp.tsx        <- Provider + BrowserRouter + AppRouter
├── main.tsx
├── api/bancoApi.ts      <- axios unico hacia el api-gateway, interceptor agrega el JWT
├── types/                <- interfaces que espejan los DTOs del backend
├── helpers/               <- jwt, idempotencyKey, format, errors, roles
├── styles/                 <- variables.css, global.css, motion.ts (variants de Framer Motion)
├── store/                   <- store.ts + un slice por dominio (auth, ui, clientes, cuentas,
│                                transacciones, prestamos, notificaciones)
├── hooks/                    <- un hook por dominio (useClientesStore, useCuentasStore, ...)
├── router/AppRouter.tsx       <- auth vs dashboard segun el status de useAuthStore
├── auth/                       <- LoginPage (password grant contra Keycloak)
├── layout/                      <- Navbar, Sidebar, Toast, DashboardLayout (rutas anidadas)
├── components/                   <- Modal y Badge, compartidos entre dominios
└── clientes/ cuentas/ transacciones/ prestamos/ notificaciones/
    (cada uno: components/ + pages/ + index.ts, mismo patron que el feature "calendar" del repo de referencia)
```

## Flujo de uso

Cada uno de `cuentas`, `transacciones`, `prestamos` y `notificaciones` esta escopeado a un
cliente: primero se elige uno en el selector compartido (`ClienteSelector`, vive en
`clientes/` pero lo importan los demas dominios). Como el backend no expone busqueda de cuentas
por numero, las operaciones que requieren el id de OTRA cuenta (transferencias, desembolso de
prestamos) piden ese id pegado a mano — la tabla de cuentas tiene un boton "copiar" para
facilitarlo, replicando el mismo flujo que ya estaba documentado por `curl` en el README del
backend.

## Notas / limitaciones conocidas

- El JWT no se refresca solo: cuando expira, `bancoApi` seguira mandando un token vencido hasta
  que el usuario recargue o el backend responda 401 (no hay interceptor de reintento con
  refresh_token todavia).
- El RBAC en la UI (mostrar/ocultar botones segun rol) es solo cosmetico; la autoridad real la
  valida el `api-gateway`, igual que en el backend.
- `yarn build` usa Vite 6 (Rollup, JS puro) a proposito en vez de la version mas nueva de Vite
  (que por defecto usa Rolldown, un bundler nativo en Rust): en este entorno ese binario nativo
  quedo bloqueado por una politica de seguridad de Windows, y Rollup evita depender de un
  binario que podria bloquearse igual en otras maquinas restringidas.
