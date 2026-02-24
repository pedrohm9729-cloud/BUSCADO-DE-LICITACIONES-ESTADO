'use client';

import { motion } from 'framer-motion';
import { Cpu, Factory, Cog, Wrench, ArrowRight } from 'lucide-react';

const services = [
  {
    number: '01',
    label: 'ENGINEERING',
    icon: Cpu,
    title: 'Diseño e Ingeniería',
    description: 'Desarrollo de soluciones metalmecánicas mediante ingeniería aplicada, modelado 3D y cálculo estructural con software especializado. Cumplimiento de normas AISC, AWS y ASME.',
    features: [
      'Modelado 3D y simulación estructural',
      'Cálculo de cargas y resistencia',
      'Ingeniería de valor aplicada',
      'Cumplimiento normativo internacional',
    ],
  },
  {
    number: '02',
    label: 'FABRICATION',
    icon: Factory,
    title: 'Fabricación Metalmecánica',
    description: 'Manufactura de alta precisión en acero estructural para proyectos industriales. Desde estructuras ligeras hasta componentes de maquinaria pesada con acabados certificados.',
    features: [
      'Estructuras metálicas industriales',
      'Componentes para maquinaria pesada',
      'Sistemas de izaje (puentes grúa, pórticos)',
      'Mobiliario y racks industriales',
    ],
  },
  {
    number: '03',
    label: 'ASSEMBLY',
    icon: Cog,
    title: 'Montaje Industrial',
    description: 'Instalación y montaje completo de estructuras metálicas, sistemas de izaje y equipos industriales en sitio, con protocolos de seguridad y control de calidad certificados.',
    features: [
      'Instalación de estructuras metálicas',
      'Montaje de puentes grúa y pórticos',
      'Anclaje y nivelación especializada',
      'Puesta en marcha de equipos',
    ],
  },
  {
    number: '04',
    label: 'MAINTENANCE',
    icon: Wrench,
    title: 'Mantenimiento Industrial',
    description: 'Servicios de mantenimiento preventivo y correctivo para estructuras metálicas, sistemas de izaje y maquinaria industrial. Reparación y reconstrucción de componentes críticos.',
    features: [
      'Mantenimiento preventivo y correctivo',
      'Reparación de estructuras metálicas',
      'Reconstrucción de componentes',
      'Refuerzos y adaptaciones mecánicas',
    ],
  },
];

export default function Services() {
  const openQuoteModal = () => {
    const modal = document.getElementById('quote-modal');
    if (modal) modal.click();
  };

  return (
    <section id="servicios" className="relative min-h-screen bg-slate-900 py-24 overflow-hidden">
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
          className="text-center mb-16"
        >
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
            Nuestros Servicios
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mt-3 mb-4">
            Soluciones Metalmecánicas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Integrales
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Servicio completo desde el diseño hasta el mantenimiento, garantizando calidad y cumplimiento en cada etapa del proyecto.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors duration-300">
                  {service.number}
                </div>

                {/* Icon & Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                    {service.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Link */}
                <button
                  onClick={openQuoteModal}
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all duration-300"
                >
                  Solicitar Cotización
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-slate-400 mb-6">
            ¿No encuentras el servicio que necesitas?
          </p>
          <button
            onClick={openQuoteModal}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-lg font-bold text-base transition-all hover:scale-105"
          >
            Consultar Proyecto Personalizado
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
