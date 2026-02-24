"use client";

import React from 'react';
import { Lock, CreditCard, ArrowRight } from 'lucide-react';

export const PaywallLock = () => {
    const handleUpgrade = () => {
        // Aquí se llamaría a la API de /api/checkout de Stripe
        window.location.href = "/api/checkout";
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4">
            {/* El fondo desenfocado (Blur) que deja ver el contenido operativo bloqueado */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[10px]" />

            {/* Caja de Muro de Pago (Paywall) */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl border border-white/20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-8">
                    <Lock size={40} strokeWidth={2.5} />
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                    Tu prueba gratuita ha terminado
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-base mb-10 leading-relaxed font-medium">
                    Tu tablero de licitaciones y alertas inteligentes están pausados.
                    <span className="block mt-2 font-bold text-slate-700 dark:text-slate-200">
                        Selecciona tu plan para reactivar tu flujo de trabajo, acceder a tus análisis de IA y seguir cotizando.
                    </span>
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <CreditCard size={18} />
                        Suscribirse y Reactivar Acceso
                        <ArrowRight size={18} />
                    </button>

                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        Facturación segura vía Stripe • Cancela en cualquier momento
                    </p>
                </div>

                {/* Decoración sutil de estatus PRO */}
                <div className="absolute -top-3 -right-3 bg-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg rotate-12">
                    Licitador Pro
                </div>
            </div>
        </div>
    );
};
