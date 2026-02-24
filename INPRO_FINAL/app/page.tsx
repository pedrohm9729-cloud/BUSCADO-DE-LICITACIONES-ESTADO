import React from 'react';
import Link from 'next/link';
import { Rocket, Bot, Target, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-amber-500 text-xs font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Nueva Era B2G: IA Nativa
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
            Deja de "buscar" en el SEACE.<br />
            Empieza a <span className="text-primary italic">ganar</span> con IA.
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Licitador Pro es el primer consultor inteligente que lee expedientes de 200 páginas en segundos y te dice cuánto cotizar para ganar.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up" className="px-10 py-5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.05]">
              Iniciar Prueba Gratuita (15 días)
            </Link>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Sin tarjeta de crédito • Registro en 30 segundos
            </p>
          </div>
        </div>
      </section>

      {/* Features - El Valor del Producto */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">El Consultor que tu equipo comercial necesita</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 group hover:border-primary transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Chat con el Expediente</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                <strong>No leas, pregunta.</strong> Dile a nuestra IA: "¿Qué ISOs piden?" o "¿Cuáles son las penalidades?". Obtén respuestas precisas con la cláusula exacta en segundos.
              </p>
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase">
                <span>Función Inteligente</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 group hover:border-amber-500 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Inteligencia de Precios</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                <strong>Cotiza con puntería quirúrgica.</strong> Analizamos tu competencia y te sugerimos el precio ideal para ganar sin sacrificar tu margen comercial.
              </p>
              <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase">
                <span>Estrategia de Datos</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 group hover:border-green-500 transition-all duration-300">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">Control de Pipeline</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                <strong>Tu oficina en orden.</strong> Mueve licitaciones de "Evaluación" a "Ganadas" con un clic. Recibe alertas inteligentes si las fechas de cierre cambian.
              </p>
              <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase">
                <span>Gestión Comercial</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Conversión */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tight">Selecciona el plan para escalar tu empresa</h2>

          <div className="max-w-md mx-auto bg-slate-900 rounded-[48px] p-12 text-white relative shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-amber-500 text-slate-900 text-[10px] font-black uppercase rounded-full shadow-lg">
              Más Popular para Pymes
            </div>

            <p className="text-lg font-bold opacity-60 mb-2 uppercase tracking-widest">Plan Profesional</p>
            <div className="flex items-end justify-center gap-1 mb-10">
              <span className="text-2xl font-bold opacity-60 mb-2">S/</span>
              <span className="text-7xl font-black tracking-tighter">149</span>
              <span className="text-xl font-bold opacity-60 mb-2">/mes</span>
            </div>

            <ul className="text-left space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-green-400" /> Búsquedas y Alertas Ilimitadas</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-green-400" /> Chat con Expediente (IA Pro)</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-green-400" /> Predicción de Precio Ganador</li>
              <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-green-400" /> Tablero de Gestión Kanban</li>
            </ul>

            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-[1.02]">
              Empezar ahora gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Licitador PE © 2026 • Consultoría B2G Aumentada por IA</p>
        </div>
      </footer>
    </div>
  );
}
