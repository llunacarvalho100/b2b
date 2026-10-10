import React, { useState } from 'react';
import { Radar, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  isMockData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMockData }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Radar className="w-6 h-6 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  LeadRadar <span className="text-blue-400">B2B</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Radar Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prospecção de empresas sem site via Google Maps para venda de desenvolvimento web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                isMockData
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isMockData ? 'Modo de Demonstração / Fallback' : 'Google Places API (New)'}
            </span>

            <button
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Guia de abordagem comercial"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Guia de Prospecção</span>
            </button>
          </div>
        </div>

        {showGuide && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-blue-500/30 text-xs sm:text-sm text-slate-300 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Como fechar contratos com negócios sem site:
              </span>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-medium text-blue-400 mb-1">1. Qualificação Rápida</p>
                <p className="text-slate-400 text-xs">
                  Priorize empresas com mais de 30 avaliações e nota acima de 4.2. Elas já têm fluxo e dinheiro para investir.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-medium text-emerald-400 mb-1">2. Abordagem WhatsApp</p>
                <p className="text-slate-400 text-xs">
                  Não tente vender de cara. Mostre que os clientes que buscam no Google não acham o cardápio/serviço e vão para concorrentes.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-medium text-purple-400 mb-1">3. Oferta Irresistível</p>
                <p className="text-slate-400 text-xs">
                  Ofereça uma Landing Page moderna com botão direto para WhatsApp e Google Maps configurado em até 48 horas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
