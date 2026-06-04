# MAGIC-LINK - Autenticación Segura con Magic Links

Una aplicación moderna de autenticación que utiliza Magic Links para una experiencia de login segura y sin contraseñas.

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- MongoDB local o Atlas
- (Opcional) Mailhog para testing de emails

### Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Asegurar que MongoDB está corriendo
mongod

# 3. (Opcional) Iniciar Mailhog en otra terminal
mailhog

# 4. Poblar base de datos con datos de prueba
npm run seed

# 5. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Características

✨ **Autenticación con Magic Link**
- Ingresa tu email y recibe un magic link
- Tokens JWT seguros con expiración de 24h
- Almacenamiento en localStorage

🗄️ **Base de Datos MongoDB**
- Registro de usuarios con contador de accesos
- Timestamps de creación y último acceso
- Monitor en tiempo real de cambios

📧 **Integración de Email**
- Envío de magic links por SMTP
- Compatible con Mailhog para desarrollo
- HTML emails profesionales

🎨 **Interfaz Responsive**
- Diseño moderno con tonos negros y grises
- Completamente responsive (móvil, tablet, desktop)
- Interfaz única y clara

## 📁 Estructura del Proyecto

```
magic-link/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Autenticación
│   │   └── db/            # Base de datos
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # React components
│   ├── AuthForm.tsx       # Formulario de email
│   ├── ResponseWindow.tsx # Ventana de respuesta
│   ├── DatabaseMonitor.tsx# Monitor de BD
│   └── WelcomeModal.tsx   # Modal de bienvenida
├── lib/                   # Librerías compartidas
│   ├── mongodb.ts         # Conexión a MongoDB
│   ├── jwt.ts            # Manejo de JWT
│   ├── email.ts          # Envío de emails
│   └── validation.ts     # Validación
├── scripts/              # Scripts de utilidad
│   └── seedDatabase.ts   # Población de BD
└── DOCUMENTACION.md      # Documentación completa
```

## 🔧 Configuración

Edita `.env.local` para personalizar:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=MAGIC-LINK-DB
JWT_SECRET=your-secret-key
MAILHOG_SMTP_HOST=localhost
MAILHOG_SMTP_PORT=1025
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📚 Documentación Completa

Para documentación detallada, instrucciones de deployment y troubleshooting, consulta [DOCUMENTACION.md](./DOCUMENTACION.md)

## 🔒 Seguridad

- Validación de email en cliente y servidor
- JWT tokens con expiración
- Sanitización de datos
- Variables de entorno para secrets
- HTTPS-ready architecture

## 🧪 Testing

```bash
# Tests manuales incluidos en DOCUMENTACION.md
# Prueba con los 5 emails de seed:
npm run seed
```

## 📦 Tecnologías

- **Next.js 16** - Framework React full-stack
- **MongoDB 7** - Base de datos NoSQL
- **TypeScript 5** - Type safety
- **JWT** - Autenticación segura
- **Nodemailer** - Envío de emails
- **Tailwind CSS** - Utilidades CSS

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm start        # Inicia servidor de producción
npm run seed     # Puebla BD con datos de prueba
npm run lint     # Ejecuta linter
```

## 🚀 Deployment

```bash
# Build de producción
npm run build

# Iniciar en producción
npm start
```

Asegúrate de configurar las variables de entorno en tu host (Vercel, Heroku, etc.)

## 📄 Licencia

MIT

## 👤 Autor

Desarrollado como solución de autenticación con Magic Links.

---

Para más detalles, consulta [DOCUMENTACION.md](./DOCUMENTACION.md)
