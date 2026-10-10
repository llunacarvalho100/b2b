import React from 'react';
import { Globe2, AlertTriangle, PhoneCall, Star, TrendingUp } from 'lucide-react';
import { Lead } from '../types/lead.js';

interface MetricsCardsProps {
  leads: Lead[];
  totalFound: number;
  withoutWebsiteCount: number;
  opportunityPercentage: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  leads,
  totalFound,
  withoutWebsiteCount,
  opportunityPercentage,
}) => {
  const withPhoneCount = leads.filter((l) => !!l.phone).length;
  const avgRating =
    leads.length > 0
      ? (
          leads.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          (leads.filter((l) => !!l.rating).length || 1)
        ).toFixed(1)
      : '0.0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
      {/* 1. Sem Site - Card de Ouro */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Sem Site (Oportunidade)
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {withoutWebsiteCount}
          </span>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {opportunityPercentage}% da região
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-rose-400" />
          Potenciais clientes imediatos para website
        </p>
      </div>

      {/* 2. Total de Negócios Mapeados */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Mapeado
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Globe2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {totalFound}
          </span>
          <span className="text-xs text-slate-400">estabelecimentos</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Filtrados pelo raio e nicho selecionados
        </p>
      </div>

      {/* 3. Contatos Disponíveis */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Com Telefone / WhatsApp
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {withPhoneCount}
          </span>
          <span className="text-xs text-slate-400">
            ({totalFound > 0 ? Math.round((withPhoneCount / totalFound) * 100) : 0}%)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Prontos para contato imediato via mensagem
        </p>
      </div>

      {/* 4. Reputação Média */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Média de Avaliações
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {avgRating}
          </span>
          <span className="text-xs text-slate-400">/ 5.0 estrelas</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Boa reputação local e clientes ativos
        </p>
      </div>
    </div>
  );
};
