'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Download, FileText, ArrowRight, ShieldCheck, Wrench, HardHat } from 'lucide-react';

const stats = [
  { value: 5, suffix: '+', label: 'Años de Experiencia' },
  { value: 100, suffix: '+', label: 'Proyectos Completados' },
  { value: 500, suffix: '+', label: 'Toneladas Fabricadas' },
  { value: 50, suffix: '+', label: 'Clientes Satisfechos' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Calidad Garantizada',
    description: 'Procesos estandarizados bajo rigurosos controles de calidad para garantizar la durabilidad de cada estructura.',
  },
  {
    icon: Wrench,
    title: 'Ingeniería Avanzada',
    description: 'Uso de tecnología de punta y software especializado para el diseño y fabricación de piezas complejas.',
  },
  {
    icon: HardHat,
    title: 'Personal Experto',
    description: 'Contamos con un equipo de ingenieros y técnicos altamente capacitados y con amplia experiencia en campo.',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(value);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = Math.floor(value * 0.7);
      const duration = 1500;
      const increment = (value - start) / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-blue-400 text-3xl font-black">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  return (
    <section
      id="nosotros"
      className="relative py-24 overflow-hidden bg-slate-900"
    >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAOZFTVSlaTYvOCmjQRuHOgKeBitoXexbTjmS-qacHDEDM6NN2DrXaMZh4M0TtzoGGLmAEeiGf2pbOGqg63p4lFtnAld6ps7dxGc3X-ZV9OLJU0Zz9CwZe_iGiIRy9m-dpoMbKM9r4OFZme18FbAo-bGXRITd4_SL32zkHcRYt26PwXd8hr4aiJzTvZ_rVaAMS4sZL180JAoTvYp4DQA9vWtd-OFTkNuW49VnXpaBO4JYQ_2YG_jAy_rIgv4Xrc7RbWyyn8L4CR6Cc)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Directional overlay: strong left, fades right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.5) 50%, rgba(15,23,42,0.3) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 container-custom w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left — Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-4"
            >
              <div className="space-y-2">
                <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-sm">
                  Nosotros
                </span>
                <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-white">
                  Expertos en <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    Metalmecánica
                  </span>
                </h2>
              </div>

              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Empresa peruana especializada en brindar soluciones integrales de metalmecánica
                de alta precisión para los sectores industrial, minero y de construcción.
                Comprometidos con la excelencia y la ingeniería de vanguardia.
              </p>

              <div className="pt-2">
                <a
                  href="#proyectos"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('proyectos');
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-lg font-bold text-base group transition-all hover:scale-105"
                >
                  Ver Proyectos
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Right — Stats + Brochure */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              {/* Stats 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 p-5 rounded-xl transition-colors duration-300"
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider leading-tight mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Brochure Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden group"
              >
                {/* Ghost icon bg */}
                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <FileText className="w-32 h-32" />
                </div>

                {/* PDF Thumbnail */}
                <div className="w-full sm:w-24 aspect-[3/4] rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-slate-400" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Brochure Corporativo</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Conozca más sobre nuestra capacidad instalada y experiencia técnica en el sector industrial.
                  </p>
                  <a
                    href="/brochure-inprometal.pdf"
                    download="Brochure-INPROMETAL.pdf"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </a>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Company Values - Integrated */}
        <div className="relative z-10 container-custom mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-slate-300 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  );
}
