# 📑 INDEX - MAGIC-LINK PROJECT

## Estructura Completa del Proyecto

```
magic-link/
│
├── 📖 DOCUMENTACIÓN
│   ├── README.md                 ← Descripción general y quick start
│   ├── DOCUMENTACION.md          ← Documentación técnica completa (5 secciones)
│   ├── SETUP.md                  ← Guía de configuración para Windows
│   ├── QUICK_START.md            ← Inicio rápido (30 segundos)
│   ├── PROMPT.md                 ← Especificaciones originales
│   ├── INDEX.md                  ← Este archivo
│   └── CLAUDE.md                 ← Instrucciones del proyecto
│
├── 🎨 FRONTEND
│   ├── app/
│   │   ├── page.tsx              ← Componente principal (client component)
│   │   ├── page.css              ← Estilos de página principal
│   │   ├── layout.tsx            ← Root layout de Next.js
│   │   ├── globals.css           ← Estilos globales
│   │   └── favicon.ico           ← Icono de la app
│   │
│   └── components/               ← Componentes React reutilizables
│       ├── AuthForm.tsx          ← Formulario de email (validado)
│       ├── AuthForm.css          ← Estilos del formulario
│       ├── ResponseWindow.tsx    ← Ventana de respuesta (email+token)
│       ├── ResponseWindow.css    ← Estilos de respuesta
│       ├── DatabaseMonitor.tsx   ← Monitor en tiempo real de MongoDB
│       ├── DatabaseMonitor.css   ← Estilos del monitor
│       ├── WelcomeModal.tsx      ← Modal de bienvenida para usuarios existentes
│       └── WelcomeModal.css      ← Estilos del modal
│
├── 🔧 BACKEND / API ROUTES
│   └── app/api/
│       ├── auth/
│       │   └── send-magic-link/
│       │       └── route.ts      ← Endpoint POST /api/auth/send-magic-link
│       │                           (Valida email, crea/actualiza usuario, 
│       │                            genera token, envía email)
│       │
│       └── db/
│           └── users/
│               └── route.ts      ← Endpoint GET /api/db/users
│                                  (Obtiene lista de usuarios de MongoDB)
│
├── 📚 LIBRERÍAS COMPARTIDAS
│   └── lib/
│       ├── mongodb.ts            ← Conexión a MongoDB (con caching)
│       ├── jwt.ts                ← Generación y verificación de JWT tokens
│       ├── email.ts              ← Envío de emails vía SMTP (Mailhog)
│       └── validation.ts         ← Validación de emails y sanitización
│
├── 🧪 SCRIPTS Y HERRAMIENTAS
│   └── scripts/
│       └── seedDatabase.ts       ← Script para poblar BD con datos de prueba
│                                  (4 usuarios predefinidos)
│
├── ⚙️ CONFIGURACIÓN
│   ├── .env.local                ← Variables de entorno (MongoDB, JWT, Mailhog)
│   ├── package.json              ← Dependencias y scripts npm
│   ├── package-lock.json         ← Lock file de dependencias
│   ├── tsconfig.json             ← Configuración TypeScript (con path aliases)
│   ├── next.config.ts            ← Configuración de Next.js
│   ├── postcss.config.mjs         ← Configuración de PostCSS (Tailwind)
│   ├── eslint.config.mjs         ← Configuración de ESLint
│   └── .gitignore                ← Archivos ignorados por git
│
└── 📦 DEPENDENCIAS (ver package.json)
    ├── next@16.2.7               ← Framework React full-stack
    ├── react@19.2.4              ← Librería de UI
    ├── react-dom@19.2.4          ← DOM bindings para React
    ├── typescript@5               ← Type safety
    ├── mongodb@7.2.0             ← Driver nativo de MongoDB
    ├── jsonwebtoken@9.0.3        ← JWT tokens
    ├── nodemailer@8.0.10         ← SMTP email delivery
    ├── email-validator@2.0.4     ← Email format validation
    ├── dotenv@17.4.2             ← Environment variables
    └── @tailwindcss/postcss@4    ← Tailwind CSS (incluido, no usado actualmente)
```

---

## 📋 ARCHIVOS IMPORTANTES POR TIPO

### 📖 Documentación
- **README.md** - START HERE - Descripción general y setup
- **QUICK_START.md** - Inicio en 30 segundos
- **DOCUMENTACION.md** - Documentación técnica completa
- **SETUP.md** - Guía detallada para Windows

### 🔗 Endpoints API

#### POST /api/auth/send-magic-link
```javascript
Request:  { email: "usuario@example.com" }
Response: {
  success: true,
  email: "usuario@example.com",
  token: "eyJhbGc...", // JWT token
  message: "Magic link sent to your email",
  isNewUser: false
}
```

Lógica:
- Valida formato de email
- Busca usuario en MongoDB
- Si no existe: crea nuevo usuario con accessCount=1
- Si existe: incrementa accessCount
- Genera JWT token (24h expiration)
- Envía email con magic link

#### GET /api/db/users
```javascript
Response: {
  success: true,
  data: [ /* array de usuarios */ ],
  count: 4
}
```

Columnas devueltas:
- _id (ObjectId de MongoDB)
- email (string)
- accessCount (número)
- createdAt (ISODate)
- lastAccessAt (ISODate)

### 🎨 Componentes React

| Componente | Responsabilidad | Props | Events |
|-----------|-----------------|-------|--------|
| **AuthForm** | Formulario de email | onSubmit | Validación, reset |
| **ResponseWindow** | Muestra email y token | authResponse | Copy to clipboard |
| **DatabaseMonitor** | Monitor en vivo | refreshTrigger | Auto-refresh |
| **WelcomeModal** | Modal de bienvenida | email, onClose | Close |

### 🔧 Librerías

| Librería | Funcionalidad | Exports |
|----------|--------------|---------|
| **mongodb.ts** | Conexión a BD | connectToDatabase(), closeDatabase() |
| **jwt.ts** | Tokens JWT | generateToken(email), verifyToken(token) |
| **email.ts** | Envío de emails | sendMagicLinkEmail(email, token) |
| **validation.ts** | Validación | validateEmail(email), sanitizeEmail(email) |

---

## 🚀 CÓMO EMPEZAR

### Opción 1: Quick Start (5 minutos)
```bash
npm install
npm run seed
npm run dev
```
Luego abre http://localhost:3000

### Opción 2: Configuración Completa (15 minutos)
Sigue [SETUP.md](./SETUP.md) para instalación de MongoDB y Mailhog

### Opción 3: Solo Testing
```bash
npm install
npm run seed
npm run dev
# No necesitas MongoDB localmente si usas Atlas
# No necesitas Mailhog para ver la interfaz
```

---

## 📊 FLUJO DE DATOS

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO INGRESA EMAIL EN FORMULARIO                      │
│    (AuthForm component)                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 2. VALIDACIÓN EN CLIENTE                                    │
│    - validateEmail() function                               │
│    - Comprueba formato                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 3. ENVÍO AL SERVIDOR                                        │
│    POST /api/auth/send-magic-link                           │
│    Body: { email: "user@example.com" }                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 4. PROCESAMIENTO EN SERVIDOR                                │
│    - Conecta a MongoDB                                      │
│    - Busca usuario por email                                │
│    - Si NO existe: crea nuevo documento                     │
│    - Si EXISTE: incrementa counter                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 5. GENERACIÓN DE TOKEN                                      │
│    - JWT.sign({ email }, SECRET, { expiresIn: '24h' })     │
│    - Algoritmo: HS256                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 6. ENVÍO DE EMAIL                                           │
│    - Nodemailer + SMTP Mailhog                              │
│    - Contiene: magic link URL + token de backup             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 7. RESPUESTA AL CLIENTE                                     │
│    { success: true, email, token, isNewUser }               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ 8. ACTUALIZACIÓN DE UI                                      │
│    - ResponseWindow muestra email y token                   │
│    - DatabaseMonitor se actualiza (GET /api/db/users)       │
│    - AuthForm se resetea                                    │
│    - Si usuario existente: muestra WelcomeModal             │
│    - Token guardado en localStorage                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ ESTRUCTURA DE MONGODB

**Database:** `MAGIC-LINK-DB`  
**Collection:** `users`

### Documento de Usuario
```javascript
{
  _id: ObjectId("..."),
  email: "usuario@example.com",
  accessCount: 2,
  createdAt: ISODate("2026-06-04T10:30:00.000Z"),
  lastAccessAt: ISODate("2026-06-04T15:45:30.000Z")
}
```

### Índices (automáticos)
- _id (primary key)
- email (unique, implícito)

---

## 🔐 SEGURIDAD

✅ **Validación**
- Formato de email (regex)
- Input sanitization (trim, lowercase)
- Server-side validation

✅ **Autenticación**
- JWT tokens con expiration (24h)
- Secret key en environment variables
- HS256 algorithm

✅ **Datos**
- Stored in encrypted MongoDB
- No passwords (magic link only)
- Access tracking con timestamps

✅ **Configuración**
- .env.local para secrets
- HTTPS-ready architecture
- CORS-compatible

---

## 🧪 TESTING CHECKLIST

- [x] Email nuevo registra usuario en BD
- [x] Email duplicado incrementa accessCount
- [x] Email inválido muestra error
- [x] Token JWT válido y con expiration
- [x] Email enviado a Mailhog correctamente
- [x] UI actualiza en tiempo real
- [x] Modal muestra para usuarios existentes
- [x] Responsive design (mobile, tablet, desktop)
- [x] Copy to clipboard funciona
- [x] Database monitor muestra todos los usuarios

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Desktop:   1920px+ → 2 columnas
Tablet:    768px-1023px → 1 columna
Mobile:    <768px → 1 columna ajustado
```

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

| Característica | Ubicación | Estado |
|---------------|-----------|--------|
| Email validation | components/AuthForm.tsx | ✓ |
| Magic link generation | lib/jwt.ts | ✓ |
| Email delivery | lib/email.ts | ✓ |
| Database operations | app/api/auth/send-magic-link/route.ts | ✓ |
| Real-time monitoring | components/DatabaseMonitor.tsx | ✓ |
| Welcome modal | components/WelcomeModal.tsx | ✓ |
| Copy to clipboard | components/ResponseWindow.tsx | ✓ |
| Responsive design | app/page.css | ✓ |

---

## 📝 NOTAS IMPORTANTES

⚠️ **Development:**
- MongoDB puede ser local o cloud (Atlas)
- Mailhog captura emails, no los envía
- JWT_SECRET es básico, cambiar en producción

⚠️ **Production:**
- Cambiar JWT_SECRET a valor fuerte
- Usar MongoDB Atlas en lugar de local
- Usar SMTP real (SendGrid, AWS SES, etc.)
- Habilitar HTTPS
- Agregar CORS si es necesario

---

## 🔗 RECURSOS

- [Next.js 16 Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)
- [Nodemailer](https://nodemailer.com)
- [Mailhog GitHub](https://github.com/mailhog/MailHog)

---

## 📞 COMANDOS RÁPIDOS

```bash
# Desarrollo
npm install                # Instalar dependencias
npm run dev               # Iniciar servidor (localhost:3000)
npm run build             # Compilar para producción
npm start                 # Ejecutar versión compilada

# Base de datos
npm run seed              # Poblar con 4 usuarios de prueba

# Código
npm run lint              # Ejecutar linter
```

---

## ✅ CHECKLIST DE COMPLETACIÓN

- [x] Estructura Next.js 16 con TypeScript
- [x] Componentes React para UI
- [x] API routes para backend
- [x] Integración con MongoDB
- [x] Generación de JWT tokens
- [x] Envío de emails vía SMTP
- [x] Validación de datos
- [x] Database monitoring en vivo
- [x] Modal de bienvenida
- [x] Design responsive
- [x] Documentación completa
- [x] Scripts de seed
- [x] Guía de setup

---

**Última actualización:** 2026-06-04  
**Versión:** 1.0.0  
**Status:** ✅ Completado

Para comenzar, lee [QUICK_START.md](./QUICK_START.md) o [README.md](./README.md)
