# 📥 Cómo Descargar los Logos de tus Clientes

He actualizado el código con los **10 nombres reales** de tus clientes. Ahora solo necesitas descargar sus logos.

---

## 🎯 **Método Súper Fácil (para cada empresa)**

### **Opción 1: Desde el sitio web oficial**

Para cada empresa, sigue estos pasos:

1. **Entra al sitio web** (enlaces abajo)
2. **Click derecho en el logo** que aparece en la esquina superior
3. **"Guardar imagen como..."** o **"Copiar imagen"**
4. **Guarda en esta carpeta**: `/public/logos/clients/`
5. **Nombre del archivo**: usa minúsculas y guiones
   - ✅ `alimentos-cielo.png`
   - ✅ `master-drilling.svg`
   - ❌ `Logo Alimentos Cielo Final.jpg`

---

## 🔗 **Enlaces Directos a los Sitios Web**

Aquí están los sitios donde puedes descargar cada logo:

### 1. **Alimentos Cielo SAC**
- 🌐 Sitio: https://alimentoscielo.com
- 📸 Instagram: https://www.instagram.com/delcieloperu/
- 💾 Guarda como: `alimentos-cielo.png`

### 2. **Minera Toro de Plata SAC**
- 🔍 Busca en Google Imágenes: "Minera Toro de Plata logo"
- 💾 Guarda como: `toro-de-plata.png`

### 3. **Constructora MPM S.A**
- 🔍 Busca en Google: "Constructora MPM Peru logo"
- 💾 Guarda como: `constructora-mpm.png`

### 4. **Master Drilling Perú S.A.C**
- 🌐 Sitio global: https://masterdrilling.com
- 🔗 LinkedIn: https://pe.linkedin.com/company/masterdrillingperu
- 💾 Guarda como: `master-drilling.png`

### 5. **RESEMIN S.A**
- 🌐 Sitio oficial: https://www.resemin.com
- 🔗 LinkedIn: https://www.linkedin.com/company/resemin-s-a-
- 💾 Guarda como: `resemin.png`

### 6. **FGA Ingenieros S.A**
- 🌐 Sitio oficial: https://fga.com.pe/en/
- 🔗 LinkedIn: https://pe.linkedin.com/company/fga-ingenieros
- 💾 Guarda como: `fga-ingenieros.png`

### 7. **Kanay Seche Group**
- 🔍 Busca en Google: "Kanay Seche Group logo"
- 💾 Guarda como: `kanay-seche.png`

### 8. **Filasur**
- 🔍 Busca en Google: "Filasur Peru logo"
- 💾 Guarda como: `filasur.png`

### 9. **Hongkun Maquinarias**
- 🔍 Busca en Google: "Hongkun Maquinarias logo"
- 💾 Guarda como: `hongkun.png`

### 10. **AESA**
- 🔍 Busca en Google: "AESA Peru ingenieria logo"
- 💾 Guarda como: `aesa.png`

---

## 📋 **Después de descargar los logos**

Una vez que tengas los archivos en `/public/logos/clients/`, edita este archivo:

**`/components/sections/Clients.tsx`** (línea 49)

Cambia de:
```typescript
{ name: 'Alimentos Cielo', industry: 'Alimentos', logo: null },
```

A:
```typescript
{ name: 'Alimentos Cielo', industry: 'Alimentos', logo: '/logos/clients/alimentos-cielo.png' },
```

Repite para cada logo que descargues.

---

## 💡 **Tips para mejores resultados**

1. **Preferible PNG con fondo transparente**
2. Si solo encuentras JPG, está bien también
3. Intenta que todos tengan tamaño similar (200-400px de ancho)
4. Si no encuentras un logo, déjalo en `null` y se mostrará el placeholder

---

## 🆘 **¿Necesitas ayuda?**

Si no encuentras algún logo o no sabes cómo descargarlo:
- Mándame capturas de pantalla
- O dame acceso y lo hago yo

**Ya actualicé el código con los 10 nombres reales, solo faltan las imágenes.**
