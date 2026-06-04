# GUÍA DE CONFIGURACIÓN - MAGIC-LINK

## Requisitos del Sistema

### Windows 11

Esta guía está optimizada para Windows 11 con PowerShell.

## 1. MongoDB Setup

### Opción A: MongoDB Local en Windows

#### Paso 1: Descargar MongoDB
1. Ve a https://www.mongodb.com/try/download/community
2. Selecciona Windows, MSI Package
3. Descarga la versión más reciente

#### Paso 2: Instalar MongoDB
1. Ejecuta el archivo .msi descargado
2. Selecciona "Complete Setup"
3. Marca "Install MongoDB Compass" (opcional pero recomendado)
4. Completa la instalación

#### Paso 3: Iniciar MongoDB
En PowerShell (como Administrador):
```powershell
# Iniciar servicio de MongoDB
Start-Service MongoDB

# O si no está configurado como servicio:
# cd "C:\Program Files\MongoDB\Server\7.0\bin"
# .\mongod.exe
```

#### Paso 4: Verificar Conexión
```powershell
# En otra terminal, conectar a MongoDB
mongosh

# En la shell de MongoDB:
show databases

# Debería mostrar base de datos por defecto
```

### Opción B: MongoDB Atlas (Cloud)

#### Paso 1: Crear Cuenta
1. Ve a https://www.mongodb.com/cloud/atlas
2. Regístrate con email
3. Crea una organización

#### Paso 2: Crear Cluster
1. Haz click en "Create a Deployment"
2. Selecciona "Free Tier"
3. Elige tu región (preferiblemente cercana)
4. Crea el cluster

#### Paso 3: Configurar Acceso
1. Ve a "Database Access"
2. Crea un usuario con contraseña
3. Ve a "Network Access"
4. Agrega tu IP o permite acceso desde cualquier lugar (0.0.0.0/0)

#### Paso 4: Obtener Connection String
1. Haz click en "Connect" del cluster
2. Selecciona "Drivers"
3. Copia la connection string
4. Reemplaza en `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 2. Mailhog Setup

Mailhog es un servidor SMTP de desarrollo que captura emails sin enviarlos realmente.

### Opción A: Mailhog con Scoop (Recomendado en Windows)

#### Paso 1: Instalar Scoop
En PowerShell:
```powershell
iwr -useb get.scoop.sh | iex
```

#### Paso 2: Instalar Mailhog
```powershell
scoop install mailhog
```

#### Paso 3: Iniciar Mailhog
```powershell
mailhog
```

Deberías ver algo como:
```
2026-06-04 10:30:00.000 +0000 [api]  IMAPS server is listening on localhost:1143 [tls]
2026-06-04 10:30:00.000 +0000 [smtp] SMTP server is listening on localhost:1025
2026-06-04 10:30:00.000 +0000 [auth]
2026-06-04 10:30:00.000 +0000 [http] Web UI is listening on http://localhost:8025
```

#### Paso 4: Acceder a Mailhog Web UI
Abre en tu navegador: http://localhost:8025

### Opción B: Mailhog con Docker

Si tienes Docker instalado:

```powershell
# Descargar y ejecutar imagen de Mailhog
docker run -d `
  --name mailhog `
  -p 1025:1025 `
  -p 8025:8025 `
  mailhog/mailhog

# Ver logs
docker logs mailhog

# Detener
docker stop mailhog

# Iniciar nuevamente
docker start mailhog
```

Accede a: http://localhost:8025

### Opción C: Instalación Manual

1. Descarga el binario desde https://github.com/mailhog/MailHog/releases
2. Extrae a una carpeta
3. Ejecuta `MailHog.exe`

## 3. Node.js y NPM

### Verificar Instalación Existente
```powershell
node --version
npm --version
```

### Si no está instalado:
1. Ve a https://nodejs.org
2. Descarga LTS (18+)
3. Ejecuta el instalador
4. Reinicia PowerShell

## 4. Configuración Final

### Paso 1: Clonar/Descargar el Proyecto
```powershell
cd C:\Users\tuusuario\Documents
# Si clonaste desde git:
# git clone <repo-url>
# Si ya tienes la carpeta, entra:
cd magic-link
```

### Paso 2: Instalar Dependencias
```powershell
npm install
```

Esperado: "added X packages"

### Paso 3: Verificar .env.local
Abre `C:\Users\ojrap\magic-link\.env.local` y verifica:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=MAGIC-LINK-DB
JWT_SECRET=your-secret-key-change-this-in-production
MAILHOG_SMTP_HOST=localhost
MAILHOG_SMTP_PORT=1025
MAILHOG_WEB_PORT=8025
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 4: Iniciar Componentes

**Terminal 1 - MongoDB:**
```powershell
Start-Service MongoDB
# o si no está como servicio: mongod
```

**Terminal 2 - Mailhog:**
```powershell
mailhog
```

**Terminal 3 - Aplicación:**
```powershell
cd "C:\Users\ojrap\magic-link"
npm run dev
```

### Paso 5: Población de Base de Datos

**Terminal 4 - Seed (ejecutar una sola vez):**
```powershell
cd "C:\Users\ojrap\magic-link"
npm run seed
```

Esperado: "Inserted 4 users" + lista de emails

### Paso 6: Acceder a la Aplicación
- App: http://localhost:3000
- Mailhog: http://localhost:8025
- MongoDB Compass (si tienes): conecta a localhost:27017

## 5. Verificación de Setup

### Checklist:
- [ ] MongoDB está corriendo y accesible
- [ ] Mailhog está corriendo en puerto 1025
- [ ] npm dependencies instaladas
- [ ] .env.local configurado
- [ ] Base de datos poblada con seed
- [ ] App visible en http://localhost:3000

### Tests Rápidos:

**Verificar MongoDB:**
```powershell
mongosh
# En la shell:
use MAGIC-LINK-DB
db.users.find()
# Debería mostrar 4 usuarios
```

**Verificar Mailhog:**
- Abre http://localhost:8025
- Debería mostrar interfaz web

**Verificar App:**
- Abre http://localhost:3000
- Debería cargar la interfaz MAGIC-LINK

## 6. Troubleshooting

### "Port 1025 is already in use"
Mailhog ya está corriendo en otra terminal o proceso.
```powershell
# Encontrar proceso en puerto 1025
netstat -ano | findstr :1025

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### "Cannot connect to MongoDB"
```powershell
# Verificar si MongoDB está corriendo
Get-Service MongoDB

# Si no está:
Start-Service MongoDB

# Si falla el inicio:
mongod --logpath "C:\data\log\mongod.log" --logappend --dbpath "C:\data\db" --serviceName "MongoDB"
```

### "Node modules no encontrado"
```powershell
rm -r node_modules
npm install
```

### "Port 3000 is already in use"
```powershell
# Matar proceso en puerto 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force

# O cambiar puerto en .env.local:
# Crear .env.local.local con:
# PORT=3001
```

## 7. Información del Sistema

Verifica tu sistema:

```powershell
# Windows version
[System.Environment]::OSVersion.VersionString

# PowerShell version
$PSVersionTable.PSVersion

# Node version
node --version

# NPM version
npm --version

# Git (si lo usas)
git --version
```

## 8. Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mailhog GitHub](https://github.com/mailhog/MailHog)
- [JWT.io](https://jwt.io)

## 9. Notas Importantes

⚠️ **Desarrollo:**
- Los emails NO se envían realmente, se capturan en Mailhog
- MongoDB local es suficiente para desarrollo
- JWT_SECRET debe ser más fuerte en producción

⚠️ **Producción:**
- Usa MongoDB Atlas en lugar de local
- Cambia JWT_SECRET a un valor secreto fuerte
- Usa SMTP real (SendGrid, Mailgun, etc.)
- Habilita HTTPS
- Configura CORS adecuadamente

## 10. Quick Commands Reference

```powershell
# Desarrollo
npm run dev              # Inicia servidor

# Build
npm run build            # Compila para prod
npm start                # Inicia servidor prod

# Base de datos
npm run seed             # Puebla BD con datos de prueba

# Verificación
npm run lint             # Ejecuta linter

# MongoDB
Start-Service MongoDB    # Inicia servicio
Stop-Service MongoDB     # Detiene servicio
mongosh                  # Conecta a MongoDB

# Mailhog
mailhog                  # Inicia Mailhog
# Accede a: http://localhost:8025
```

---

**Última actualización:** 2026-06-04  
**Versión:** 1.0.0
