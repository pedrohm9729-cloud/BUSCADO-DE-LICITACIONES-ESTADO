'use client';

import { motion } from 'framer-motion';
import { Award, Target, ShieldCheck } from 'lucide-react';

const excellence = [
  {
    icon: Award,
    title: 'Estándares Internacionales',
    description: 'Implementamos normas AWS y ASME en todos nuestros procesos de soldadura y ensamble.',
  },
  {
    icon: Target,
    title: 'Alta Precisión',
    description: 'Equipamiento CNC de última generación para acabados milimétricos en cada pieza.',
  },
  {
    icon: ShieldCheck,
    title: 'Fiabilidad Industrial',
    description: 'Estructuras diseñadas bajo rigurosos análisis de estrés para máxima durabilidad.',
  },
];

export default function TechnicalExcellence() {
  return (
    <section className="relative bg-slate-900 py-12 px-6 lg:px-20 border-t border-white/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {excellence.map((item, index) => {
            const Icon = item.icon;
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
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
