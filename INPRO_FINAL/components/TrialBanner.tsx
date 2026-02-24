"use client";

import React, { useEffect, useState } from 'react';
import { Rocket, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TrialBannerProps {
    trialEndDate: string; // ISO string from server
}

export const TrialBanner = ({ trialEndDate }: TrialBannerProps) => {
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        const end = new Date(trialEndDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
    }, [trialEndDate]);

    if (daysLeft === null) return null;

    const isExpiringSoon = daysLeft <= 3;

    return (
        <div className={`w-full py-2 px-6 flex items-center justify-between transition-all ${isExpiringSoon ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-slate-900'
            }`}>
            <div className="flex items-center gap-3">
                {isExpiringSoon ? <AlertCircle size={18} /> : <Rocket size={18} />}
                <p className="text-sm font-black uppercase tracking-wider">
                    {daysLeft > 0
                        ? `Tu prueba gratuita de Licitador Pro termina en ${daysLeft} días.`
                        : "Tu prueba gratuita ha expirado."}
                </p>
            </div>

            <Link
                href="/billing"
                className={`px-4 py-1 rounded-lg text-xs font-black uppercase transition-all shadow-sm ${isExpiringSoon
                        ? 'bg-white text-red-600 hover:bg-slate-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
            >
                {isExpiringSoon ? "¡Actualizar Ahora!" : "Mejorar mi Plan"}
            </Link>
        </div>
    );
};
