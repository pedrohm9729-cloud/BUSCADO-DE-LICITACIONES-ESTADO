'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Award } from 'lucide-react';
import Image from 'next/image';

export default function WhoWeAre() {
  return (
    <section id="quienes-somos" className="relative py-24 bg-slate-900 overflow-hidden">
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

      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg className="w-auto h-auto max-w-7xl opacity-[0.03]" viewBox="0 0 48 48" fill="currentColor">
          <path d="M42.1739 20.1739L27.8261 5.82609C26.2696 4.26957 23.7304 4.26957 22.1739 5.82609L7.82609 20.1739C6.26957 21.7304 6.26957 24.2696 7.82609 25.8261L22.1739 40.1739C23.7304 41.7304 26.2696 41.7304 27.8261 40.1739L42.1739 25.8261C43.7304 24.2696 43.7304 21.7304 42.1739 20.1739Z" className="text-white"/>
          <path d="M24 12L32 24L24 36L16 24L24 12Z" className="text-primary" opacity="0.5"/>
        </svg>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
            Quiénes Somos
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mt-3 mb-4">
            Nuestra{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Identidad Corporativa
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Conoce los principios que guían nuestro trabajo y nuestro compromiso con la excelencia en ingeniería metalmecánica.
          </p>
        </motion.div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-xl mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Misión</h3>
              <p className="text-slate-300 leading-relaxed">
                Satisfacer las necesidades de nuestros clientes industriales mediante el diseño,
                fabricación y montaje de productos metalmecánicos de alta calidad, integrando
                tecnología, ingeniería y mejora continua en todos nuestros procesos.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-xl mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Visión</h3>
              <p className="text-slate-300 leading-relaxed">
                Ser una empresa líder en soluciones metalmecánicas en Perú y Latinoamérica,
                reconocida por su capacidad técnica, innovación continua y compromiso con el
                desarrollo industrial del país.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-xl mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Valores</h3>
              <ul className="text-slate-300 space-y-3 text-left leading-relaxed">
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-xl font-black">•</span>
                  <span>Calidad en cada detalle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-xl font-black">•</span>
                  <span>Compromiso con la seguridad</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-xl font-black">•</span>
                  <span>Innovación y mejora continua</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-xl font-black">•</span>
                  <span>Responsabilidad y puntualidad</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Company Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-md border border-primary/30 rounded-2xl p-8 md:p-12"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo INPROMETAL */}
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/logos/logo-vertical.png"
                alt="INPROMETAL"
                width={250}
                height={100}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-slate-200 leading-relaxed mb-4 text-lg">
              Somos una empresa peruana especializada en brindar soluciones
              metalmecánicas integrales para los sectores industrial, minero y de construcción.
              Contamos con un equipo técnico altamente calificado y experiencia comprobada en
              proyectos de diseño, fabricación y montaje de estructuras metálicas, sistemas de
              izaje y componentes para maquinaria pesada.
            </p>
            <p className="text-slate-200 leading-relaxed text-lg">
              Nuestra propuesta de valor se basa en la ingeniería aplicada, el cumplimiento
              riguroso de estándares de calidad y una respuesta ágil a los desafíos operativos
              de nuestros clientes.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
