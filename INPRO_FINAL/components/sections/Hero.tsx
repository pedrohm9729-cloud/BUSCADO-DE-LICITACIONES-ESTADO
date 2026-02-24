'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Eye, ChevronDown } from 'lucide-react';

export default function Hero() {
  const openQuoteModal = () => {
    const modal = document.getElementById('quote-modal');
    if (modal) modal.click();
  };

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('proyectos');
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      });
    }
  };

  const stats = [
    { value: '5+', label: 'Años de Experiencia' },
    { value: '+500', label: 'Toneladas Fabricadas' },
    { value: '100+', label: 'Proyectos Completados' },
    { value: '50+', label: 'Clientes Satisfechos' },
  ];

  return (
    <main className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-dark to-slate-800" />

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 z-10 w-full h-full object-cover opacity-60"
          src="/videos/hero-background.mp4"
        />

        {/* Directional gradient overlay */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background: 'linear-gradient(to right, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.5) 50%, rgba(15,23,42,0.3) 100%)'
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-30 container-custom pt-32 pb-10">
        <div className="max-w-4xl">
          {/* ISO Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/30 border border-primary/50 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Calidad Garantizada
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl lg:text-7xl font-black leading-none tracking-tight text-white mb-6"
          >
            Expertos en Ingeniería y{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Fabricación Metalmecánica
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-light"
          >
            Soluciones integrales de alta precisión y confiabilidad. Operamos bajo los más estrictos estándares internacionales para garantizar la excelencia en cada componente industrial.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={openQuoteModal}
              className="group flex items-center justify-center px-8 min-w-[200px] h-14 rounded-lg bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Solicitar Cotización
            </button>
            <button
              onClick={scrollToProjects}
              className="flex items-center justify-center gap-2 px-8 min-w-[200px] h-14 rounded-lg bg-white/10 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              Ver Proyectos
              <Eye className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Industrial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 border-t border-white/10 pt-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="flex flex-col gap-1"
              >
                <span className="text-3xl font-black text-white">{stat.value}</span>
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce z-30"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explorar</span>
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </main>
  );
}
