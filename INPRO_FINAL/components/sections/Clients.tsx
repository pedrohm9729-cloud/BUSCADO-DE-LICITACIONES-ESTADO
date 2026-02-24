'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const certifications = [
  {
    icon: Award,
    title: 'Normas AISC',
    description: 'Diseño y fabricación de estructuras de acero',
  },
  {
    icon: FileCheck,
    title: 'AWS D1.1',
    description: 'Código de soldadura estructural',
  },
  {
    icon: CheckCircle2,
    title: 'ASME',
    description: 'Estándares para recipientes a presión',
  },
  {
    icon: ShieldCheck,
    title: 'Control de Calidad',
    description: 'Inspección y verificación en cada etapa',
  },
];

/**
 * ─────────────────────────────────────────────────────────────────
 *  CÓMO AÑADIR LOGOS DE CLIENTES
 * ─────────────────────────────────────────────────────────────────
 *  1. Sube el logo a la carpeta: /public/logos/clients/
 *     (Formatos recomendados: .svg, .png con fondo transparente)
 *
 *  2. En el array "clients" de abajo, añade una entrada:
 *     {
 *       name: 'Nombre de la Empresa',
 *       industry: 'Minería',               ← sector (opcional)
 *       logo: '/logos/clients/empresa.svg' ← ruta al archivo
 *     }
 *
 *  3. Si todavía no tienes el logo, deja logo: null y se mostrará
 *     un placeholder profesional con las iniciales.
 * ─────────────────────────────────────────────────────────────────
 */
const clients = [
  { name: 'Alimentos Cielo', industry: 'Alimentos', logo: '/logos/clients/alimentos-cielo.png' },
  { name: 'Minera Toro de Plata', industry: 'Minería', logo: '/logos/clients/minera toro de plata.jpg' },
  { name: 'Constructora MPM', industry: 'Construcción', logo: '/logos/clients/Constructora mpm.jpg' },
  { name: 'Master Drilling Perú', industry: 'Minería', logo: '/logos/clients/Master-drilling.png' },
  { name: 'RESEMIN', industry: 'Minería', logo: '/logos/clients/Logo-RESEMIN.png' },
  { name: 'FGA Ingenieros', industry: 'Ingeniería', logo: '/logos/clients/FGA LOGO.png' },
  { name: 'Kanay Seche Group', industry: 'Minería', logo: '/logos/clients/kanay seche group.jpg' },
  { name: 'Filasur', industry: 'Minería', logo: '/logos/clients/filasur.jpg' },
  { name: 'Hongkun Maquinarias', industry: 'Maquinaria', logo: '/logos/clients/hongkun maquinarias.jpg' },
  { name: 'AESA', industry: 'Ingeniería', logo: '/logos/clients/AESA.jpg' },
];

// Paleta de colores para los placeholders
const placeholderColors = [
  { bg: 'from-blue-900/20 to-blue-800/10', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
  { bg: 'from-slate-800/20 to-slate-700/10', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-100 text-slate-700' },
  { bg: 'from-amber-800/20 to-amber-700/10', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
  { bg: 'from-emerald-800/20 to-emerald-700/10', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700' },
];

type Client = {
  name: string;
  industry: string;
  logo: string | null;
};

function ClientCard({ client, index }: { client: Client; index: number }) {
  const color = placeholderColors[index % placeholderColors.length];
  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="flex-shrink-0 w-[280px] h-[140px] flex items-center justify-center p-8 transition-all duration-300 group cursor-default bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10">
      {client.logo ? (
        <Image
          src={client.logo}
          alt={`Logo ${client.name}`}
          width={240}
          height={120}
          className="object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          style={{ width: 'auto', height: 'auto', maxWidth: '240px', maxHeight: '100px' }}
        />
      ) : (
        <div className="flex flex-col items-center gap-1.5 w-full transition-opacity duration-300">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.bg} border ${color.border} flex items-center justify-center`}>
            <span className={`text-base font-bold ${color.text}`}>{initials}</span>
          </div>
          <p className="text-xs font-semibold text-white text-center leading-tight">{client.name}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${color.badge}`}>
            {client.industry}
          </span>
        </div>
      )}
    </div>
  );
}

function ClientCarousel() {
  // Duplicamos 3 veces para loop infinito perfecto
  const track = [...clients, ...clients, ...clients];

  return (
    <div className="marquee-container overflow-hidden relative py-6">
      {/* Fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      {/* Track de logos con animación continua */}
      <div className="flex gap-8 animate-marquee-left" style={{ width: 'max-content' }}>
        {track.map((client, i) => (
          <ClientCard key={i} client={client} index={i % clients.length} />
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section id="calidad" className="relative py-24 bg-slate-900 overflow-hidden">
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
        {/* Technical Standards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
              Estándares Industriales
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mt-3 mb-4">
              Normas Técnicas{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                que Aplicamos
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Trabajamos bajo las normas técnicas más estrictas de la industria metalmecánica
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-primary/20 text-primary flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2">{cert.title}</h3>
                    <p className="text-sm text-slate-400">{cert.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Confían en Nosotros ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
              Nuestros Clientes
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mt-3 mb-4">
              Confían en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Nosotros
              </span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-lg">
              Empresas líderes de minería, construcción e industria eligen INPROMETAL para sus proyectos estructurales
            </p>
          </div>

          {/* Carousel */}
          <ClientCarousel />
        </motion.div>
      </div>
    </section>
  );
}
