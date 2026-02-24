"use client";

import React, { useState } from 'react';
import { Bot, Send, Table, ShieldCheck, FileText } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIConsultant = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hola. He analizado el expediente técnico de este proceso. ¿Quieres que extraiga los requisitos habilitantes o el cuadro de partidas a cotizar?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulación de respuesta IA con el Prompt Estratégico
        setTimeout(() => {
            let response = "He revisado el expediente. Basado en el Capítulo 3, se requiere certificación ISO 9001 y experiencia en servicios similares por un monto acumulado de 2 veces el valor referencial.";

            const q = input.toLowerCase();
            if (q.includes('partida') || q.includes('tabla')) {
                response = "Aquí tienes el cuadro de partidas extraído:\n\n| Item | Descripción | Cantidad | Unidad |\n|---|---|---|---|\n| 01 | Estructura Principal Acero | 12 | TON |\n| 02 | Pintura Anticorrosiva | 450 | M2 |\n| 03 | Pernos de Anclaje | 48 | UND |";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500 rounded-lg text-white">
                        <Bot size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Consultor IA Nativo</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Expediente Técnico Analizado</p>
                    </div>
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user'
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                            }`}>
                            {m.content.includes('|') ? (
                                <div className="overflow-x-auto my-2">
                                    <pre className="font-sans whitespace-pre-wrap">{m.content}</pre>
                                </div>
                            ) : (
                                m.content
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ej: ¿Qué partidas debo cotizar?"
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                    <button
                        onClick={handleSend}
                        className="p-3 bg-primary text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
