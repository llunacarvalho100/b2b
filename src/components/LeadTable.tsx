import React from 'react';
import { Star, MessageSquare, Sparkles, ExternalLink, Globe, AlertTriangle, Share2 } from 'lucide-react';
import { Lead } from '../types/lead.js';

interface LeadTableProps {
  leads: Lead[];
  onOpenPitch: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onOpenPitch }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-left text-xs sm:text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Empresa / Categoria</th>
            <th className="py-3.5 px-4 font-semibold">Status do Site</th>
            <th className="py-3.5 px-4 font-semibold">Avaliações</th>
            <th className="py-3.5 px-4 font-semibold">Score</th>
            <th className="py-3.5 px-4 font-semibold">Contato</th>
            <th className="py-3.5 px-4 font-semibold text-right">Ações de Prospecção</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-800/40 transition">
              {/* Name & category */}
              <td className="py-3.5 px-4">
                <div className="font-semibold text-white">{lead.name}</div>
                <div className="text-slate-400 text-xs flex items-center gap-2 mt-0.5">
                  <span className="text-blue-400">{lead.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="truncate max-w-xs">{lead.formattedAddress.split(',')[0]}</span>
                </div>
              </td>

              {/* Website Status */}
              <td className="py-3.5 px-4">
                {lead.websiteStatus === 'missing' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    SEM SITE
                  </span>
                )}
                {lead.websiteStatus === 'social_only' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Share2 className="w-3 h-3 text-amber-400" />
                    APENAS SOCIAL
                  </span>
                )}
                {lead.websiteStatus === 'present' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    <Globe className="w-3 h-3 text-slate-500" />
                    Com Site
                  </span>
                )}
              </td>

              {/* Ratings */}
              <td className="py-3.5 px-4">
                {lead.rating ? (
                  <div className="flex items-center gap-1 font-semibold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{lead.rating.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs font-normal">({lead.userRatingsTotal})</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs italic">Sem notas</span>
                )}
              </td>

              {/* Opportunity Score */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lead.opportunityLevel === 'alta'
                          ? 'bg-emerald-500'
                          : lead.opportunityLevel === 'media'
                          ? 'bg-amber-500'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${lead.leadScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{lead.leadScore}</span>
                </div>
              </td>

              {/* Phone */}
              <td className="py-3.5 px-4 text-xs">
                {lead.formattedPhone ? (
                  <span className="text-slate-300 font-mono">{lead.formattedPhone}</span>
                ) : (
                  <span className="text-slate-600 italic">Não informado</span>
                )}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {lead.whatsappUrl && (
                    <a
                      href={lead.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
                      title="Enviar WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => onOpenPitch(lead)}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition"
                    title="Copiar Pitch de Vendas"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <a
                    href={lead.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Abrir no Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
