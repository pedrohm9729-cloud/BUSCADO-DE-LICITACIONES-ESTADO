# 📸 Fotos de Proyectos — Guía de Carga

## 📍 **Aquí es donde subes las fotos de tus proyectos**

Esta carpeta es para las fotos de los trabajos realizados que aparecerán en la sección **"Proyectos Realizados"** del sitio web.

---

## 📤 **Cómo subir las fotos**

### **Método 1: Subir via GitHub (Recomendado)**

1. **Ve a tu repositorio en GitHub:**
   - https://github.com/pedrohm9729-cloud/INPROMETAL

2. **Navega a esta carpeta:**
   ```
   public/images/projects/
   ```

3. **Click en "Add file" → "Upload files"**

4. **Arrastra tus fotos aquí**

5. **Click en "Commit changes"**

6. **Avísame cuando estén subidas** y yo actualizo el código

---

## 📋 **Características de las fotos**

### **Formato**
- ✅ JPG o PNG
- ✅ Buena calidad (mínimo 800px de ancho)
- ✅ Orientación: horizontal preferiblemente

### **Tamaño recomendado**
- **Ancho:** 1200-1600px
- **Alto:** 800-1200px
- **Relación:** 4:3 o 16:9

### **Nombres de archivo**
- ✅ Usa nombres descriptivos simples
- ✅ Minúsculas y guiones
- ✅ Sin espacios ni caracteres especiales

**Ejemplos buenos:**
```
soldadura-resemin-1.jpg
soldadura-resemin-2.jpg
tanque-fga-1.jpg
estructura-master-drilling.jpg
```

**Ejemplos malos:**
```
❌ Foto del trabajo final RESEMIN 2024.jpg
❌ IMG_20240315_143052.jpg
❌ WhatsApp Image 2024-03-15.jpg
```

---

## 🖼️ **Cómo funcionan múltiples fotos**

Cada proyecto puede tener **1, 2, 3 o más fotos**:

- **1 foto:** Se muestra esa foto
- **2-3+ fotos:** Aparece badge "📷 3 fotos" y al hacer click se abre un carrusel con flechas para navegar

---

## ✏️ **Después de subir las fotos**

Una vez que hayas subido las fotos aquí, necesitas:

1. **Editar el archivo:** `/components/sections/Projects.tsx`
2. **Ir a la línea 47** donde está el array `projects`
3. **Agregar o editar proyectos** con esta estructura:

```typescript
{
  id: 7,
  title: 'Nombre del Trabajo',
  category: 'mineria',  // opciones: mineria | construccion | industrial | tanques
  client: 'Nombre del Cliente',
  location: 'Lima, Perú',
  year: '2024',
  images: [
    '/images/projects/foto-1.jpg',  // Primera foto (portada)
    '/images/projects/foto-2.jpg',  // Segunda foto
    '/images/projects/foto-3.jpg',  // Tercera foto
  ],
  description: 'Descripción breve del trabajo realizado.',
  specs: ['Dato técnico 1', 'Dato técnico 2', 'Dato técnico 3'],
},
```

---

## 🆘 **¿Necesitas ayuda?**

Si no sabes cómo:
- Subir las fotos
- Editar el código
- Agregar proyectos

**Solo avísame** y yo lo hago por ti. Dame:
1. Las fotos (súbelas aquí o mándamelas)
2. Los datos de cada proyecto (nombre, cliente, año, descripción, etc.)

Y yo me encargo de todo el código.

---

**La carpeta está lista. Sube tus fotos de proyectos aquí.** 📷
