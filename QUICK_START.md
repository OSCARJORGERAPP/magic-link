# 🚀 QUICK START - MAGIC-LINK

## 30 segundos de Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servicios (en terminals separadas)

**Terminal 1 - MongoDB:**
```powershell
# Windows
Start-Service MongoDB
# O si no está como servicio:
# mongod
```

**Terminal 2 - Mailhog (opcional pero recomendado):**
```powershell
mailhog
# Accede a: http://localhost:8025
```

**Terminal 3 - Aplicación:**
```bash
npm run dev
```

### 3. Poblar base de datos (primera vez)
```bash
npm run seed
```

### 4. Abrir en navegador
```
http://localhost:3000
```

---

## ✅ Testing Rápido

### Prueba 1: Email Nuevo
1. En el formulario AUTHENTICATION, ingresa: `test@example.com`
2. Click en "SEND MAGIC LINK"
3. Verás:
   - Email mostrado en sección RESPONSE
   - Token JWT en sección RESPONSE
   - NO aparece modal (usuario nuevo)
   - Nuevo usuario en DATABASE MONITOR

### Prueba 2: Email Duplicado
1. Ingresa un email de los 4 preexistentes:
   - `john.doe@example.com`
   - `jane.smith@example.com`
   - `test.user@example.com`
   - `demo@example.com`
2. Click en "SEND MAGIC LINK"
3. Verás:
   - Modal "WELCOME BACK" aparece
   - Email mostrado en modal
   - accessCount incrementado en DATABASE MONITOR

### Prueba 3: Email Inválido
1. Ingresa: `notemail`
2. Error: "Please enter a valid email address"
3. No se envía nada al servidor

---

## 📧 Ver Emails en Mailhog

1. Abre: http://localhost:8025
2. Cada email enviado aparecerá en la bandeja
3. Click para ver detalles
4. Ver magic link y token

---

## 🗄️ Ver Base de Datos

### Opción 1: MongoDB Compass (GUI)
1. Descarga desde https://www.mongodb.com/products/compass
2. Conecta a `localhost:27017`
3. Navega a `MAGIC-LINK-DB` > `users`

### Opción 2: mongosh (CLI)
```powershell
mongosh
# En la shell:
use MAGIC-LINK-DB
db.users.find().pretty()
db.users.countDocuments()
```

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| [README.md](./README.md) | Descripción general y features |
| [DOCUMENTACION.md](./DOCUMENTACION.md) | Documentación técnica completa |
| [SETUP.md](./SETUP.md) | Instrucciones detalladas de instalación |
| [PROMPT.md](./PROMPT.md) | Especificaciones originales |

---

## 🔧 Estructura de la App

```
Interface única con 3 secciones:

┌─────────────────────────────────────────┐
│  MAGIC-LINK - Secure Authentication     │
├─────────────────┬───────────────────────┤
│ AUTHENTICATION  │ RESPONSE              │
│ - Email input   │ - Email (copiable)    │
│ - Validation    │ - Token (copiable)    │
│ - Submit        │ - Message             │
├─────────────────────────────────────────┤
│ DATABASE MONITOR (Live Updates)         │
│ - Email | Access Count | Created | Last│
│ - john.doe@... | 3 | 2026-06-01 | ...  │
│ - jane.smith@..| 1 | 2026-06-04 | ...  │
└─────────────────────────────────────────┘
```

---

## 🔑 Variables de Entorno

Archivo `.env.local` (ya configurado):
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=MAGIC-LINK-DB
JWT_SECRET=your-secret-key-change-this-in-production
MAILHOG_SMTP_HOST=localhost
MAILHOG_SMTP_PORT=1025
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ⚠️ Problemas Comunes

### "Cannot connect to MongoDB"
```powershell
# Verificar servicio
Get-Service MongoDB

# Iniciar si está detenido
Start-Service MongoDB
```

### "Port 1025 already in use"
Mailhog ya está corriendo. Abre otra terminal o detén el proceso anterior.

### "No module named mongodb"
```bash
npm install
npm install mongodb
```

### "Cannot find module '@/lib/...'"
Limpiar y reinstalar:
```bash
rm -r node_modules
npm install
```

---

## 🚀 Comandos Disponibles

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Compilar para producción
npm start        # Ejecutar versión compilada
npm run seed     # Poblar BD con 4 usuarios de prueba
npm run lint     # Ejecutar linter
```

---

## 📊 Datos de Prueba

El script `npm run seed` crea 4 usuarios:

| Email | Access Count | Created | Status |
|-------|--------------|---------|--------|
| john.doe@example.com | 3 | 2026-06-01 | Returning |
| jane.smith@example.com | 1 | 2026-06-04 | New |
| test.user@example.com | 2 | 2026-06-02 | Returning |
| demo@example.com | 1 | 2026-06-04 | New |

---

## 🔒 Seguridad

✓ Email validation (formato)
✓ JWT tokens (HS256, 24h expiration)
✓ Data sanitization (trim, lowercase)
✓ Secure defaults
✓ Environment variables para secrets

---

## 📱 Responsive

- ✓ Desktop (1920px) - 2 columnas
- ✓ Tablet (768px) - 1 columna
- ✓ Mobile (375px) - 1 columna, responsive text

---

## 🎯 Flow Completo

```
1. Usuario ingresa email
   ↓
2. Validación en cliente
   ↓
3. Servidor chequea BD
   ├→ Email no existe → Crear usuario
   └→ Email existe → Incrementar contador
   ↓
4. Generar JWT token (24h expiration)
   ↓
5. Enviar email vía SMTP (capturado en Mailhog)
   ↓
6. Mostrar email y token en RESPONSE
   ↓
7. Actualizar DATABASE MONITOR
   ↓
8. Si usuario existente → Mostrar modal "WELCOME BACK"
   ↓
9. Token guardado en localStorage
```

---

## 💡 Tips

- Copia el token JWT y úsalo en postman con header `Authorization: Bearer {TOKEN}`
- Cada email genera un token único
- Los tokens expiran en 24 horas
- La BD persiste entre reinicios
- Los emails se capturan en Mailhog (no se envían realmente)

---

## 📞 Recursos

- Next.js: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com
- JWT: https://jwt.io
- Mailhog: https://github.com/mailhog/MailHog

---

**¡La app está lista para usar! 🎉**

Abre http://localhost:3000 y comienza a probar.

Para documentación detallada, ve a [DOCUMENTACION.md](./DOCUMENTACION.md)
