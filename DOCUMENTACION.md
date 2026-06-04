# DOCUMENTACIÓN - MAGIC-LINK APP

## 1. INSTRUCCIONES PARA EJECUTAR LA APP

### Requisitos Previos
- Node.js 18+ instalado
- MongoDB local o accesible en `localhost:27017`
- Mailhog instalado para capturar emails (opcional pero recomendado)

### Pasos de Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   El archivo `.env.local` ya está configurado con valores por defecto:
   - MongoDB URI: `mongodb://localhost:27017`
   - Database: `MAGIC-LINK-DB`
   - JWT Secret: `your-secret-key-change-this-in-production`
   - Mailhog SMTP: `localhost:1025`

3. **Iniciar MongoDB:**
   ```bash
   # Asegúrate que MongoDB está corriendo en tu sistema
   mongod
   ```

4. **Iniciar Mailhog (opcional):**
   ```bash
   # En otra terminal
   mailhog
   # Accede a http://localhost:8025 para ver los emails capturados
   ```

5. **Poblar la base de datos con datos de prueba:**
   ```bash
   npm run seed
   ```
   Esto creará 4 usuarios iniciales en la base de datos.

6. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

7. **Acceder a la aplicación:**
   Abre tu navegador y ve a `http://localhost:3000`

### Compilación para Producción
```bash
npm run build
npm start
```

---

## 2. DESCRIPCIÓN SECUENCIAL DE LOS PROCESOS

### Flujo de Autenticación con Magic Link

#### Paso 1: AUTHENTICATION - Ingreso de Email
**Proceso:**
- El usuario ingresa su dirección de email en el cuadro de texto
- Se valida el formato del email (expresión regular)
- Se sanitiza el email (trim y lowercase)

**Validaciones:**
- Email no vacío
- Formato válido (contiene @ y dominio)

**Resultado:**
- Si hay error de validación: Se muestra mensaje de error
- Si es válido: Se envía al servidor

#### Paso 2: PROCESSING - Verificación en Base de Datos
**Proceso:**
- El servidor recibe el email
- Conecta a MongoDB (MAGIC-LINK-DB)
- Busca si el email existe en la colección 'users'

**Lógica:**
- **Email NO existe:** 
  - Se crea nuevo documento con:
    - email: string
    - accessCount: 1
    - createdAt: timestamp actual
    - lastAccessAt: timestamp actual
  - Se marca como usuario nuevo

- **Email EXISTE:**
  - Se incrementa accessCount
  - Se actualiza lastAccessAt con timestamp actual
  - Se marca como usuario existente

#### Paso 3: TOKEN GENERATION - Generación de JWT
**Proceso:**
- Se genera token JWT con los siguientes datos:
  - Payload: { email: string }
  - Algoritmo: HS256
  - Expiración: 24 horas
  - Secret: Variable de entorno JWT_SECRET

**Token:**
```
formato: header.payload.signature
ejemplo: eyJhbGc...iOiJ...jdfQ.kl...
```

#### Paso 4: EMAIL DELIVERY - Envío de Magic Link
**Proceso:**
- Se conecta al servidor SMTP (Mailhog en desarrollo)
- Se genera URL del magic link: `http://localhost:3000?token={TOKEN}`
- Se construye email HTML con:
  - Saludo personalizado
  - Botón clickeable con el magic link
  - Token mostrado como backup
  - Aviso de expiración en 24h

**Email:**
```
De: noreply@magic-link.com
Para: {email del usuario}
Asunto: Your Magic Link - Authentication
```

#### Paso 5: RESPONSE - Respuesta al Cliente
**Proceso:**
- Se envía respuesta JSON al frontend con:
  - success: true
  - email: string
  - token: JWT
  - message: "Magic link sent to your email"
  - isNewUser: boolean

**Almacenamiento Local:**
- Token guardado en localStorage como 'authToken'
- Email guardado en localStorage como 'authEmail'

#### Paso 6: UI UPDATE - Actualización de Interfaz
**Proceso:**

**Sección RESPONSE:**
- Se muestra el email enviado (con opción de copiar)
- Se muestra el token JWT (con opción de copiar)
- Se muestra el mensaje de éxito

**Sección DATABASE MONITOR:**
- Se dispara fetch a /api/db/users
- Se obtiene lista actualizada de usuarios
- Se muestra en tabla con ordenamiento por lastAccessAt DESC
- Se actualiza timestamp de última actualización

**Sección AUTHENTICATION:**
- Se resetea el cuadro de texto
- Se limpia el formulario
- Listo para nuevo ingreso

#### Paso 7: MODAL DE BIENVENIDA
**Proceso:**
- Si el email es existente (accessCount > 1)
- Se muestra popup modal "WELCOME BACK"
- Muestra el email del usuario
- Mensaje informativo sobre el magic link enviado
- Botón CLOSE para cerrar modal

#### Paso 8: VERIFICACIÓN DE TOKEN (Optional)
**Endpoint:** `GET /api/auth/verify-token?token={TOKEN}`
- Valida que el token sea válido
- Verifica que no haya expirado
- Retorna email y datos del usuario

---

## 3. TESTS REALIZADOS

### Test Manual 1: Registro de Nuevo Usuario
**Caso:** Ingresar email no registrado
**Pasos:**
1. Abrir aplicación en navegador
2. Ingresar email: `newuser@test.com`
3. Hacer click en "SEND MAGIC LINK"

**Resultado Esperado:**
- ✓ Email mostrado en sección RESPONSE
- ✓ Token JWT mostrado en sección RESPONSE
- ✓ NO aparece modal de bienvenida (es nuevo usuario)
- ✓ Base de datos se actualiza con nuevo usuario
- ✓ accessCount = 1

**Resultado Actual:** PASADO

### Test Manual 2: Email Duplicado
**Caso:** Ingresar email ya registrado
**Pasos:**
1. Ejecutar script seed (crea usuarios de prueba)
2. Ingresar email: `john.doe@example.com`
3. Hacer click en "SEND MAGIC LINK"

**Resultado Esperado:**
- ✓ Modal "WELCOME BACK" aparece
- ✓ Email mostrado en modal
- ✓ Sección RESPONSE se actualiza
- ✓ AccessCount se incrementa
- ✓ lastAccessAt se actualiza

**Resultado Actual:** PASADO

### Test Manual 3: Validación de Email
**Caso 1:** Email vacío
**Pasos:**
1. Dejar cuadro vacío
2. Click en "SEND MAGIC LINK"

**Resultado Esperado:**
- ✓ Mensaje de error: "Please enter an email address"
- ✓ No se envía al servidor

**Resultado Actual:** PASADO

**Caso 2:** Email inválido
**Pasos:**
1. Ingresar: `notanemail`
2. Click en "SEND MAGIC LINK"

**Resultado Esperado:**
- ✓ Mensaje de error: "Please enter a valid email address"
- ✓ Input tiene borde rojo
- ✓ No se envía al servidor

**Resultado Actual:** PASADO

### Test Manual 4: Database Monitor
**Pasos:**
1. Ejecutar script seed
2. Verificar que lista de usuarios aparece

**Resultado Esperado:**
- ✓ Se muestra tabla con 4 usuarios
- ✓ Columnas: Email, Access Count, Created At, Last Access
- ✓ Ordenados por Last Access descendente
- ✓ Contador muestra "4 users"

**Resultado Actual:** PASADO

### Test Manual 5: Responsive Design
**Casos:**
- Desktop (1920x1080): Layout 2 columnas + 1 fila
- Tablet (768px): Layout 1 columna
- Mobile (375px): Layout 1 columna, textos ajustados

**Resultado Esperado:**
- ✓ Interfaz se adapta correctamente
- ✓ Todos los elementos visibles
- ✓ Scrolling funciona en móvil

**Resultado Actual:** PASADO

### Test Manual 6: Copy to Clipboard
**Pasos:**
1. Enviar email válido
2. Click en icono ⋮⋮ junto a email
3. Click en icono ⋮⋮ junto a token

**Resultado Esperado:**
- ✓ Icono cambia a ✓ temporalmente
- ✓ Contenido copiado al portapapeles
- ✓ Se revierte a ⋮⋮ después de 2 segundos

**Resultado Actual:** PASADO

### Test Manual 7: Mailhog Integration
**Pasos:**
1. Enviar email válido
2. Abrir http://localhost:8025

**Resultado Esperado:**
- ✓ Email aparece en bandeja de Mailhog
- ✓ Contiene magic link URL
- ✓ Contiene token como backup
- ✓ HTML formateado correctamente

**Resultado Actual:** PASADO

---

## 4. ERRORES DURANTE EL DESARROLLO Y SUS SOLUCIONES

### Error 0: Conflicto de Versiones - Next.js 9.3.3 con React 19.2.4
**Síntoma:** Error `ERESOLVE could not resolve` durante `npm install`
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: next@9.3.3
npm error Found: react@19.2.4
npm error Could not resolve dependency:
npm error peer react@"^16.6.0" from next@9.3.3
```

**Causa:** 
- El proyecto fue inicializado con `create-next-app` que usó una versión antigua de Next.js (9.3.3)
- Next.js 9.3.3 requiere React ^16.6.0, pero necesitábamos React 19.2.4 para características modernas
- Las versiones son completamente incompatibles

**Solución:**
```bash
# 1. Actualizar package.json: cambiar next de "^9.3.3" a "16.2.7"
# En package.json, dependencias:
"next": "16.2.7",

# 2. Limpiar node_modules e instalar nuevamente
rm -r node_modules
rm package-lock.json
npm install

# O con PowerShell en Windows:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Resultado:** ✓ Ahora Next.js 16.2.7 es compatible con React 19.2.4

**Notas Importantes:**
- Next.js 16.2.7 es compatible con React 19.2.4 (ambos son versiones modernas)
- Si tienes este error, SIEMPRE actualiza Next.js primero
- Versión recomendada: Next.js 16.2.7 (como en este proyecto)
- No usar versiones antiguas de Next.js (< 13) con React 19

---

### Error 1: MongoDB Connection Failed
**Síntoma:** Error "connect ECONNREFUSED 127.0.0.1:27017"
**Causa:** MongoDB no está corriendo
**Solución:** 
```bash
# Iniciar MongoDB
mongod

# O usar MongoDB Cloud (Atlas)
# Actualizar MONGODB_URI en .env.local
```

### Error 2: TypeScript Path Aliases
**Síntoma:** Error "Cannot find module '@/lib/mongodb'"
**Causa:** tsconfig.json no tenía paths configurados
**Solución:** Actualizar tsconfig.json con:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error 3: Next.js 16 API Routes
**Síntoma:** Routes no se compilaban correctamente
**Causa:** Estructura de carpetas incorrecta para API routes
**Solución:** Usar estructura App Router:
```
app/
  api/
    auth/
      send-magic-link/
        route.ts
    db/
      users/
        route.ts
```

### Error 4: CORS con Mailhog
**Síntoma:** Email no se enviaba
**Causa:** Puerto SMTP incorrecto
**Solución:** Usar puerto 1025 (SMTP) en lugar de 8025 (UI web)

### Error 5: Modal Z-Index
**Síntoma:** Modal detrás de otros elementos
**Causa:** Z-index insuficiente
**Solución:** Establecer z-index: 1000 en .modal-overlay

### Error 6: Database Updates No Reflected
**Síntoma:** Database monitor no se actualizaba
**Causa:** Falta de trigger de refresh
**Solución:** Implementar refreshTrigger state que se incrementa después de envío de email

### Error 7: Mailhog SMTP Authentication Failed
**Síntoma:** Error "Missing credentials for PLAIN" al intentar enviar email
```
[EMAIL] Failed to send email: Error: Missing credentials for "PLAIN"
    code: 'EAUTH',
    command: 'API'
```

**Causa:** 
- Nodemailer estaba enviando credenciales vacías (`user: '', pass: ''`)
- Mailhog estaba pidiendo autenticación PLAIN
- La configuración no tenía `ignoreTLS` para desarrollo

**Solución:**
En `lib/email.ts`, actualizar la configuración de nodemailer:
```typescript
const transporter = nodemailer.createTransport({
  host: MAILHOG_HOST,
  port: MAILHOG_PORT,
  secure: false,
  ignoreTLS: true,           // ← Agregar esto
  tls: {
    rejectUnauthorized: false,
  },
  // ← QUITAR auth completamente (no enviar credenciales vacías)
});
```

**Resultado:** ✓ Email se envía correctamente a Mailhog

**Notas Importantes:**
- Mailhog no requiere autenticación (es solo para desarrollo)
- No enviar `auth` vacío: Nodemailer interpretará que hay credenciales
- Usar `ignoreTLS: true` para Mailhog (no soporta TLS)
- En producción, usar SMTP real (SendGrid, AWS SES) con credenciales válidas

---

## 5. TECNOLOGÍAS, HERRAMIENTAS Y LIBRERÍAS

### Frontend
- **React 19.2.4** - Librería de UI
- **Next.js 16.2.7** - Framework full-stack
- **Tailwind CSS 4** - Utilidades CSS (incluido, no usado actualmente)
- **TypeScript 5** - Type safety

### Backend
- **Node.js** - Runtime de JavaScript
- **MongoDB 7.2.0** - Base de datos NoSQL con driver nativo
- **jsonwebtoken 9.0.3** - Generación y verificación de JWT
- **nodemailer 8.0.10** - Envío de emails SMTP
- **email-validator 2.0.4** - Validación de formato de email
- **dotenv 17.4.2** - Gestión de variables de entorno

### Development
- **ts-node 10.9.2** - Ejecutor de TypeScript para scripts
- **ESLint 9** - Linting de código
- **Mailhog** - Servidor SMTP de desarrollo para testing de emails

### Estilos
- **CSS Puro** - Estilos personalizados sin frameworks
  - Gradientes lineales
  - Animaciones keyframe
  - Media queries responsivas
  - Scrollbar personalizado

### Arquitectura

**Estructura de Carpetas:**
```
magic-link/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── send-magic-link/
│   │   │       └── route.ts
│   │   └── db/
│   │       └── users/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.css
│   └── globals.css
├── components/
│   ├── AuthForm.tsx
│   ├── AuthForm.css
│   ├── ResponseWindow.tsx
│   ├── ResponseWindow.css
│   ├── DatabaseMonitor.tsx
│   ├── DatabaseMonitor.css
│   ├── WelcomeModal.tsx
│   └── WelcomeModal.css
├── lib/
│   ├── mongodb.ts       - Conexión a BD
│   ├── jwt.ts          - Generación de tokens
│   ├── email.ts        - Envío de emails
│   └── validation.ts   - Validación de datos
├── scripts/
│   └── seedDatabase.ts  - Población de BD con datos de prueba
├── .env.local          - Variables de entorno
├── package.json
├── tsconfig.json
└── DOCUMENTACION.md    - Este archivo
```

### Patrones de Diseño
- **Client Components:** Para UI interactiva
- **Server Routes:** Para API backend
- **Custom Hooks:** Para lógica reutilizable
- **Ref Forwarding:** Para control de componentes hijos
- **Context-like Pattern:** Mediante props y callbacks

### Características de Seguridad
- **JWT Tokens:** Con expiración de 24h
- **Email Validation:** Formato básico y extended
- **Data Sanitization:** Trim y lowercase en emails
- **Secure Defaults:** Variables de entorno para secrets
- **HTTPS Ready:** Estructura preparada para HTTPS

### Performance
- **Database Connection Caching:** En lib/mongodb.ts
- **Optimized Re-renders:** React 19 strict mode
- **CSS Optimized:** Minimal styles, no duplicates
- **Lazy Loading:** Components loaded on demand

---

## 6. INFORMACIÓN ADICIONAL

### Variables de Entorno Disponibles
```
MONGODB_URI          - URL de conexión a MongoDB
MONGODB_DB           - Nombre de la base de datos
JWT_SECRET           - Secret para firmar JWT
MAILHOG_SMTP_HOST    - Host del servidor SMTP
MAILHOG_SMTP_PORT    - Puerto del servidor SMTP
NEXT_PUBLIC_APP_URL  - URL pública de la aplicación
```

### Estructura de Documento en MongoDB
```javascript
{
  _id: ObjectId,
  email: "usuario@example.com",
  accessCount: 2,
  createdAt: ISODate("2026-06-04T00:00:00.000Z"),
  lastAccessAt: ISODate("2026-06-04T10:30:00.000Z")
}
```

### Payload del Token JWT
```json
{
  "email": "usuario@example.com",
  "iat": 1717460400,
  "exp": 1717546800
}
```

### Endpoints de la API

**POST /api/auth/send-magic-link**
```
Body: { "email": "usuario@example.com" }
Response: {
  "success": true,
  "message": "Magic link sent to your email",
  "email": "usuario@example.com",
  "token": "JWT_TOKEN_HERE",
  "isNewUser": false
}
```

**GET /api/db/users**
```
Response: {
  "success": true,
  "data": [
    {
      "_id": "...",
      "email": "usuario@example.com",
      "accessCount": 2,
      "createdAt": "2026-06-04T00:00:00.000Z",
      "lastAccessAt": "2026-06-04T10:30:00.000Z"
    }
  ],
  "count": 4
}
```

### Troubleshooting

**Problema:** "Emails no se envían"
- Verificar que Mailhog está corriendo en puerto 1025
- Revisar logs en http://localhost:8025

**Problema:** "Database vacía después de seed"
- Ejecutar nuevamente: `npm run seed`
- Verificar que MongoDB está corriendo

**Problema:** "Token no válido"
- Cambiar JWT_SECRET en .env.local requiere logout
- Tokens generados no serán válidos con nuevo secret

**Problema:** "Interfaz no responsive"
- Limpiar cache del navegador (Ctrl+Shift+Delete)
- Verificar que CSS no está cacheado

---

## 7. RESUMEN

La aplicación **MAGIC-LINK** es una solución completa de autenticación que:

✓ Permite a usuarios registrarse/loguearse con email  
✓ Genera tokens JWT seguros con expiración de 24h  
✓ Envía magic links por email mediante SMTP  
✓ Mantiene registro en MongoDB con contador de accesos  
✓ Proporciona interfaz responsive y profesional  
✓ Monitorea cambios en BD en tiempo real  
✓ Personaliza experiencia para usuarios existentes  
✓ Valida datos en cliente y servidor  
✓ Implementa mejores prácticas de seguridad  

**Desarrollada con:** Next.js 16, MongoDB, JWT, Mailhog  
**Fecha de creación:** 2026-06-04  
**Versión:** 1.0.0
