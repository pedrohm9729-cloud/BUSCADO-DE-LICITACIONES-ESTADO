import React from 'react';
import { BarChart3, TrendingUp, Users, Info } from 'lucide-react';

export const CompetitorInsights = () => {
    const topCompetitors = [
        { name: "METÁLICAS PERÚ S.A.", wins: 12, avgDiscount: "-5.2%" },
        { name: "CONSTRUCCIONES LIMA E.I.R.L.", wins: 8, avgDiscount: "-2.1%" },
        { name: "INVERSIONES FERRO SAC", wins: 7, avgDiscount: "-8.4%" },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Inteligencia de Competidores</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Análisis de Adjudicaciones en tu Rubro</p>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <TrendingUp size={20} />
                </div>
            </div>

            <div className="space-y-6">
                {topCompetitors.map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-700">
                                {i + 1}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800 dark:text-slate-200">{comp.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                        <Users size={10} /> {comp.wins} Ganadas
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Dscto. Promedio</p>
                            <p className="text-sm font-black text-red-500">{comp.avgDiscount}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex gap-3">
                <Info size={18} className="text-primary shrink-0" />
                <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    <strong>Consejo B2B:</strong> El competidor #1 suele ganar ofertando un 5% debajo del valor referencial. La IA te sugiere ajustar tu margen en procesos donde ellos estén presentes.
                </p>
            </div>
        </div>
    );
};
