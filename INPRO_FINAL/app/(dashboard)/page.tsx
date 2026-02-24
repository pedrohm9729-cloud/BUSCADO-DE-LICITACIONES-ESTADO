import React from 'react';
import { CompetitorInsights } from '@/components/CompetitorInsights';
import { AIConsultant } from '@/components/AIConsultant';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header del Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel de Inteligencia</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Licitador Pro • Gestión B2G</p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-black flex items-center gap-2">
                        <LayoutGrid size={14} /> KANBAN
                    </button>
                    <button className="px-4 py-2 text-slate-400 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-50">
                        <List size={14} /> FILTRO SEACE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Izquierda: Buscador / Kanban (Simulado) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden min-h-[600px]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Busca en títulos o especificaciones técnicas..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600">
                                <Filter size={18} />
                            </button>
                        </div>

                        {/* Placeholder de Resultados */}
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">Licitación Pública</span>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">REPARACIÓN DE PUENTE PEATONAL METAL EN ESTADIO MUNICIPAL</h4>
                                        <p className="text-xs text-slate-500 font-medium">MUNICIPALIDAD DE LIMA • LIMA, CALLAO</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Presupuesto</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">S/ 2,028,556</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary">Detalle</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Overlay sutil de "Walled Garden" para el MVP */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 pointer-events-none" />
                    </div>
                </div>

                {/* Columna Derecha: Inteligencia B2B */}
                <div className="lg:col-span-4 space-y-8">
                    <CompetitorInsights />
                    <AIConsultant />
                </div>
            </div>
        </div>
    );
}
