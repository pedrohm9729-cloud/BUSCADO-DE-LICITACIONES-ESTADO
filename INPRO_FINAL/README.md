# INPROMETAL - Sitio Web Corporativo

Sitio web profesional para INPROMETAL, empresa líder en ingeniería y fabricación metalmecánica en Lima, Perú.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
INPROMETAL/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal con metadata y SEO
│   ├── page.tsx           # Página de inicio
│   ├── globals.css        # Estilos globales
│   └── sitemap.ts         # Generador de sitemap
├── components/
│   ├── sections/          # Secciones de la página
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   ├── Clients.tsx
│   │   └── Contact.tsx
│   └── ui/                # Componentes UI reutilizables
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── WhatsAppButton.tsx
│       └── QuoteModal.tsx
├── public/                # Archivos estáticos
│   ├── images/           # Imágenes del sitio
│   ├── logos/            # Logos de la empresa
│   └── robots.txt        # Configuración de robots
└── package.json
```

## 🎨 Paleta de Colores

- **Primario:** `#1E3A5F` (Azul industrial)
- **Secundario:** `#6B7280` (Gris metálico)
- **Acento:** `#F97316` (Naranja seguridad)
- **Fondo:** `#FFFFFF`, `#F3F4F6`

## 📝 Contenido a Actualizar

Busca comentarios `TODO:` en el código para identificar contenido que debe ser reemplazado:

### Información de Contacto
- Teléfono: Buscar `+51 XXX XXX XXX`
- Email: Buscar `contacto@inprometal.com`
- Dirección: Buscar `Lima, Perú`
- WhatsApp: `components/ui/WhatsAppButton.tsx`

### Logos e Imágenes
- Logo de la empresa: `public/logos/`
- Imágenes de proyectos: `public/images/projects/`
- Fotos del equipo: `public/images/team/`
- Logos de clientes: `public/images/clients/`

### Datos de la Empresa
- `app/layout.tsx`: Schema.org y metadata
- `components/sections/About.tsx`: Historia, misión, visión
- `components/sections/Projects.tsx`: Proyectos reales
- `components/sections/Clients.tsx`: Testimonios y logos de clientes

### Redes Sociales
- `components/ui/Footer.tsx`: Enlaces de redes sociales

## 🔧 Configuración del Formulario

Los formularios actualmente muestran datos en consola. Para implementar envío real:

### Opción 1: API de Email (Recomendado)
```typescript
// En Contact.tsx y QuoteModal.tsx
const onSubmit = async (data) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // ...
};
```

### Opción 2: Servicio de Email Externo
- [SendGrid](https://sendgrid.com/)
- [Resend](https://resend.com/)
- [EmailJS](https://www.emailjs.com/)

## 🗺️ Google Maps

Para agregar el mapa en la sección de contacto:

1. Obtén una API Key de [Google Cloud Console](https://console.cloud.google.com/)
2. Actualiza `components/sections/Contact.tsx`:

```tsx
<iframe
  width="100%"
  height="256"
  frameBorder="0"
  src="https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=TU_DIRECCION"
  allowFullScreen
/>
```

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Mobile: < 768px
- 📊 Tablet: 768px - 1024px
- 🖥️ Desktop: > 1024px

## 🚀 Deployment en Vercel

1. Sube el código a GitHub
2. Conecta el repositorio a [Vercel](https://vercel.com)
3. Configura las variables de entorno si es necesario
4. Deploy automático con cada push a main

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Variables de Entorno (opcional)

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
NEXT_PUBLIC_WHATSAPP_NUMBER=51999999999
SENDGRID_API_KEY=tu_sendgrid_key
CONTACT_EMAIL=contacto@inprometal.com
```

## 📊 SEO y Analytics

### Google Analytics (opcional)
1. Crea una propiedad en [Google Analytics](https://analytics.google.com)
2. Agrega el script en `app/layout.tsx`

### Google Search Console
1. Verifica la propiedad en [Search Console](https://search.google.com/search-console)
2. Actualiza el código de verificación en `app/layout.tsx`

## 🎯 Características Implementadas

- ✅ Hero con gradiente y estadísticas
- ✅ Servicios expandibles con animaciones
- ✅ Portafolio filtrable de proyectos
- ✅ Sección "Nosotros" con contador animado
- ✅ Certificaciones y testimonios
- ✅ Formulario de contacto con validación
- ✅ Modal de cotización multi-paso
- ✅ Botón flotante de WhatsApp
- ✅ Navbar responsive con menú mobile
- ✅ Footer completo
- ✅ SEO optimizado
- ✅ Schema.org markup
- ✅ Animaciones con Framer Motion
- ✅ Mobile-first responsive

## 🔒 Seguridad

- Validación de formularios con Zod
- Sanitización de inputs
- Headers de seguridad en `next.config.mjs` (agregar si es necesario)

## 📄 Licencia

© 2025 INPROMETAL. Todos los derechos reservados.

## 📞 Soporte

Para consultas técnicas sobre el sitio web, contactar al desarrollador.
