'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X, ChevronLeft, ChevronRight, Images, Maximize2 } from 'lucide-react';
import Image from 'next/image';

type Category = 'all' | 'mineria' | 'civil' | 'industrial';

interface Project {
  id: number;
  title: string;
  category: Category;
  client: string;
  location: string;
  year: string;
  images: string[];   // ← Array: puede tener 1, 2, 3 o más fotos
  description: string;
  specs: string[];
}

/**
 * ─────────────────────────────────────────────────────────────────
 *  CÓMO AGREGAR PROYECTOS CON FOTOS
 * ─────────────────────────────────────────────────────────────────
 *  1. Sube las fotos a: /public/images/projects/
 *     Ejemplo: trabajo-soldadura-1.jpg, trabajo-soldadura-2.jpg
 *
 *  2. Agrega o edita un proyecto en el array "projects" de abajo:
 *     {
 *       id: 7,
 *       title: 'Nombre del Trabajo',
 *       category: 'mineria',        ← mineria | construccion | industrial | tanques
 *       client: 'Nombre Cliente',
 *       location: 'Lima, Perú',
 *       year: '2024',
 *       images: [                   ← Pon todas las fotos del trabajo aquí
 *         '/images/projects/trabajo-1.jpg',
 *         '/images/projects/trabajo-2.jpg',
 *         '/images/projects/trabajo-3.jpg',
 *       ],
 *       description: 'Descripción del trabajo realizado.',
 *       specs: ['Dato 1', 'Dato 2', 'Dato 3'],
 *     },
 * ─────────────────────────────────────────────────────────────────
 */
const projects: Project[] = [
  {
    id: 1,
    title: 'fabricación e instalación de Pórticos Grúa de 3 y 7 ton',
    category: 'mineria',
    client: 'Master Drilling Perú S.A.C',
    location: 'Arequipa, Perú',
    year: '2025',
    images: [
      '/images/projects/imagen 1 proyecto 1.jpg',
      '/images/projects/imagen 2 proyecto 1.jpeg',
      '/images/projects/imagen 3 proyecto 1.png',
      '/images/projects/imagen 4 proyecto 1.jpeg',
      '/images/projects/imagen 5 proyecto 1.jpeg',
      '/images/projects/imagen 6 proyecto 1.jpg',
    ],
    description: 'Diseño y fabricación de pórticos grúa móvil y estatico en acero estructural, desde la manufactura en taller hasta la instalación final con tecle eléctrico. Estructura con patas en perfil tubular, arriostres diagonales y base con ruedas para desplazamiento. Proyecto ejecutado para uso en planta industrial.',
    specs: ['3 ton de acero estructural', 'Norma AISC', '20 días de ejecución'],
  },
  {
    id: 2,
    title: 'Fabricación de Estructuras Metálicas Ligeras y Pesadas para Uso Industrial',
    category: 'industrial',
    client: 'Confidencial',
    location: 'Lima, Perú',
    year: '2025',
    images: [
      '/images/projects/imagen 1 proyecto 2.jpg',
      '/images/projects/imagen 2 proyecto 2.png',
      '/images/projects/imagen 3 proyecto 2.jpeg',
      '/images/projects/imagen 4 proyecto 2.png',
      '/images/projects/imagen 5 proyecto 2.jpeg',
      '/images/projects/imagen 6 proyecto 2.jpeg',
      '/images/projects/imagen 7 proyecto 2.jpg',
      '/images/projects/imagen 8 proyecto 2.jpeg',
    ],
    description: 'Capacidad de fabricación en acero estructural para proyectos de distintas escalas: desde estructuras ligeras como barandas de seguridad con malla electrosoldada, racks cantilever, soportes angulares y escaleras con grating, hasta estructuras pesadas como cajas de protección para motores eléctricos y encofrados metálicos planos. Todos los trabajos incluyen acabado en pintura epóxica y cumplen con estándares de seguridad industrial. Diseño previo en 3D disponible para validación dimensional antes de fabricación.',
    specs: ['Estructuras ligeras: barandas, racks, soportes y escaleras',
    'Estructuras pesadas: cajas de protección',
    'Acabado epóxico en colores según estándar cliente',
    'Modelado 3D previo a fabricación',
    'Producción unitaria y en serie',
    'Cumplimiento normas seguridad industrial'],
  },
  {
    id: 3,
    title: 'Fabricación de Encofrados Metálicos Circulares Para concreto',
    category: 'civil',
    client: 'Confidencial',
    location: 'Lima, Perú',
    year: '2026',
    images: [
      '/images/projects/imagen 1 poyecto 3.jpg',
      '/images/projects/imagen 2 poyecto 3.jpeg',
      '/images/projects/imagen 3 poyecto 3.jpeg',
    ],
    description: 'Producción en serie de encofrados metálicos circulares en plancha de acero rolada de 2mm, con brida perimetral para ensamble y acabado en pintura epóxica azul. Diseñados para vaciado de elementos estructurales cilíndricos como columnas y pilotes. Fabricación con control dimensional estricto para garantizar intercambiabilidad y reutilización en múltiples vaciados de obra.',
    specs: ['Plancha de acero e=2mm', 'Brida perimetral de ensamble', 'Acabado epóxico anticorrosivo','Apto para múltiples usos'],
  },
  {
    id: 4,
    title: 'Mantenimiento e Instalación de Racks de Almacenamiento Industrial',
    category: 'industrial',
    client: 'Confindencial',
    location: 'Lurin, Perú',
    year: '2025',
    images: [
      '/images/projects/imagen 1 proyecto 4.jpeg',
      '/images/projects/imagen 2 proyecto 4.jpeg',
      '/images/projects/imagen 3 proyecto 4.jpeg',
      '/images/projects/imagen 4 proyecto 4.jpeg',
      '/images/projects/imagen 5 proyecto 4.jpeg',
      '/images/projects/imagen 6 proyecto 4.jpeg',
    ],
    description: 'Fabricación, instalación y mantenimiento de sistemas de racks industriales para almacén de gran escala. El proyecto incluyó la fabricación de vigas largueras en perfil estructural con acabado epóxico naranja, instalación de guardas de protección antisplit en perfil amarillo para protección de columnas contra impactos de montacargas, y anclaje al piso con placa base empernada. Trabajo ejecutado en almacén operativo con cumplimiento de protocolos de seguridad.',
    specs: ['Vigas largueras en perfil estructural',
    'Acabado epóxico naranja y amarillo',
    'Guardas antisplit para protección de columnas',
    'Anclaje con placa base empernada al piso',
    'Instalación en almacén operativo',
    'Demarcación de pasillos incluida'],
  },
  {
    id: 5,
    title: 'Fabricación de Mobiliario Metálico Industrial a Medida',
    category: 'industrial',
    client: 'Confindencial',
    location: 'Lima, Perú',
    year: '2023',
    images: [
      '/images/projects/imagen 2 proyecto 6.jpeg',
      '/images/projects/imagen 1 proyecto 6.png',
      '/images/projects/imagen 3 proyecto 6.jpg',
      '/images/projects/imagen 4 proyecto 6.jpeg',
      '/images/projects/imagen 5 proyecto 6.jpeg',
    ],
    description: 'Diseño y fabricación de mobiliario metálico industrial a medida, incluyendo: gabinete organizador con puertas de vidrio y cajones para almacenamiento de herramientas y repuestos, locker metálico multiuso con ventilación en puertas, gabinete de emergencias en plancha roja con soporte independiente para uso exterior, y armario industrial con puertas de malla expandida y estantes interiores. Todos los proyectos desarrollados desde modelado 3D hasta producto terminado con acabado epóxico.',
    specs: ['Gabinete organizador con puertas de vidrio y cajones',
    'Locker metálico con ventilación incorporada',
    'Gabinete de equipos de emergencia para exterior',
    'Armario industrial con malla expandida',
    'Modelado 3D previo a fabricación',
    'Acabado epóxico en colores según requerimiento',
    'Fabricación 100% a medida'],
  },
  {
    id: 6,
    title: 'Fabricación e Instalación de Techo Metálico para Estacionamiento',
    category: 'industrial',
    client: 'Confidencial',
    location: 'Ica, Perú',
    year: '2025',
    images: [
      '/images/projects/imagen 1 proyecto 5.jpeg',
      '/images/projects/imagen 2 proyecto 5.jpeg',
    ],
    description: 'Fabricación e instalación de marquesina metálica para estacionamiento vehicular en instalación industrial. Estructura en perfil tubular y perfiles de acero estructural con columnas en pórtico tipo V invertida, correas de techo y cobertura en plancha ondulada. Acabado en pintura epóxica gris. Las fotos muestran el proceso desde el montaje de estructura hasta la obra terminada con cobertura instalada.',
    specs: ['Estructuras ligeras: barandas, racks, soportes y escaleras',
    'Estructura en perfil tubular acero estructural',
    'Columnas en pórtico tipo V invertida',
    'Correas de techo para soporte de cobertura',
    'Cobertura en plancha ondulada',
    'Placa base empernada al piso',
    'Acabado epóxico gris',
    'Incluye suministro e instalación'],
  },
];

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'mineria', label: 'Minería' },
  { id: 'civil', label: 'Civil' },
  { id: 'industrial', label: 'Industrial' },
];

// Visor de pantalla completa
function FullscreenViewer({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/25 text-white p-2.5 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Contador */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Imagen */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[current]}
            alt={`Foto ${current + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Flechas */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-colors"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-colors"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Puntos */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// Mini carrusel para el modal — navegación entre fotos del mismo proyecto
function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
        {/* Imagen actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`Foto ${current + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Flechas — solo si hay más de 1 foto */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicador de fotos */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute top-3 right-14 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {current + 1} / {images.length}
            </div>
          </>
        )}

        {/* Botón ampliar — siempre visible, esquina inferior derecha */}
        <button
          onClick={() => setFullscreen(true)}
          title="Ver en pantalla completa"
          className="absolute bottom-3 right-3 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Visor fullscreen */}
      <AnimatePresence>
        {fullscreen && (
          <FullscreenViewer
            images={images}
            initialIndex={current}
            onClose={() => setFullscreen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardFullscreen, setCardFullscreen] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cardFullscreen) { setCardFullscreen(null); return; }
        if (selectedProject) setSelectedProject(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, cardFullscreen]);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="proyectos" className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
            Portafolio
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mt-3 mb-4">
            Proyectos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Realizados
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Algunos de nuestros trabajos más destacados en diferentes sectores industriales
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
              >
                {/* Foto portada (primera del array) */}
                <div className="relative w-full aspect-[4/3] bg-slate-800 overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Badge si tiene más de 1 foto */}
                  {project.images.length > 1 && (
                    <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      {project.images.length} fotos
                    </div>
                  )}
                  {/* Botón ampliar en la tarjeta */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setCardFullscreen({ images: project.images, index: 0 }); }}
                    title="Ver en pantalla completa"
                    className="absolute bottom-3 right-3 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-16 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Ver Detalles
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-white mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="space-y-1 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                  {/* Dato cuantitativo destacado */}
                  {project.specs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Alcance</p>
                      <p className="text-sm text-slate-300 mt-1">{project.specs[0]}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen desde tarjeta */}
      <AnimatePresence>
        {cardFullscreen && (
          <FullscreenViewer
            images={cardFullscreen.images}
            initialIndex={cardFullscreen.index}
            onClose={() => setCardFullscreen(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal con carrusel de fotos */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Carrusel de fotos en el modal */}
              <div className="relative">
                <ImageCarousel images={selectedProject.images} />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-8 bg-slate-900">
                <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {categories.find((c) => c.id === selectedProject.category)?.label}
                </span>
                <h3 className="text-2xl font-black text-white mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{selectedProject.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Cliente</div>
                    <div className="font-bold text-white">{selectedProject.client}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Año</div>
                    <div className="font-bold text-white">{selectedProject.year}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-slate-500 mb-2">Ubicación</div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-bold text-white">{selectedProject.location}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-3">Especificaciones</div>
                  <ul className="space-y-2">
                    {selectedProject.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
