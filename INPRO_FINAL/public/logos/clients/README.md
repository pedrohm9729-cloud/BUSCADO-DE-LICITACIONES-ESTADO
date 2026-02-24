# 📁 Logos de Clientes — Guía de Carga

## 📍 **Dónde subir tus logos**

Sube todos los archivos de logos **AQUÍ**, en esta carpeta:
```
/public/logos/clients/
```

---

## 🎨 **Características de los logos**

### **Formato recomendado**
1. **SVG** (mejor opción) — escala perfecta sin perder calidad
2. **PNG con fondo transparente** — si no tienes SVG

### **Tamaño recomendado**
- **Ancho:** 200–400px
- **Alto:** 80–150px
- **Relación de aspecto:** Horizontal (landscape)

### **Colores**
- Preferiblemente logos **monocromáticos** (blanco, negro, o escala de grises)
- Si tiene color, que sea **versión corporativa** limpia

### **Fondo**
- Debe ser **TRANSPARENTE** (PNG con canal alpha o SVG sin relleno de fondo)
- NO incluir fondos blancos, cuadrados o bordes

---

## ✅ **Ejemplos de buenos logos**

```
✅ logo-minera-del-sur.svg       (SVG limpio, sin fondo)
✅ constructora-abc.png           (PNG transparente, 300x120px)
✅ industrias-pacifico.svg        (Monocromático, bien escalado)
```

## ❌ **Evita estos errores**

```
❌ logo-con-fondo-blanco.jpg     (Fondo blanco visible, no es transparente)
❌ logo-muy-pequeño.png          (50x20px — se verá pixelado)
❌ logo-con-borde.png            (Tiene marco o cuadrado alrededor)
```

---

## 🔧 **Cómo añadir logos al código**

Después de subir el archivo aquí, edita este archivo:
```
/components/sections/Clients.tsx
```

Busca la línea 48 y modifica el array `clients`:

```typescript
const clients = [
  // Reemplaza esto:
  { name: 'Tu Empresa', industry: 'Minería', logo: null },

  // Por esto (con el nombre del archivo que subiste):
  { name: 'Minera del Sur', industry: 'Minería', logo: '/logos/clients/minera-del-sur.svg' },
  { name: 'Constructora ABC', industry: 'Construcción', logo: '/logos/clients/constructora-abc.png' },
  { name: 'Industrias Pacífico', industry: 'Industria', logo: '/logos/clients/industrias-pacifico.svg' },
];
```

---

## 💡 **Tips profesionales**

1. **Nombre de archivos:** usa minúsculas y guiones, sin espacios
   - ✅ `minera-del-sur.svg`
   - ❌ `Minera Del Sur Logo Final.svg`

2. **Optimiza SVG:** usa herramientas como [SVGOMG](https://jakearchibald.github.io/svgomg/) para reducir peso

3. **Comprime PNG:** usa [TinyPNG](https://tinypng.com/) para reducir tamaño sin perder calidad

4. **Cuantos más logos, mejor:** el marquee se ve más profesional con 8–15 logos

---

**¿Necesitas ayuda?** Pregúntame cualquier duda sobre cómo procesar o subir tus logos.
