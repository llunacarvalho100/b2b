import React from 'react';
import {
  MapPin,
  Star,
  Phone,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Globe,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { Lead } from '../types/lead.js';

interface LeadCardProps {
  lead: Lead;
  onOpenPitch: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onOpenPitch }) => {
  const getBadge = () => {
    if (lead.websiteStatus === 'missing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
          SEM SITE (OPORTUNIDADE)
        </span>
      );
    }
    if (lead.websiteStatus === 'social_only') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Share2 className="w-3 h-3 text-amber-400" />
          APENAS REDE SOCIAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
        <Globe className="w-3 h-3 text-slate-400" />
        Site Cadastrado
      </span>
    );
  };

  const getScoreColor = () => {
    if (lead.opportunityLevel === 'alta') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (lead.opportunityLevel === 'media') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-5 shadow-lg hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {getBadge()}
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
              {lead.category}
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${getScoreColor()}`}
            title="Score de qualificação comercial"
          >
            Score: {lead.leadScore}/100
          </div>
        </div>

        {/* Business Name */}
        <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
          {lead.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          {lead.rating ? (
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{lead.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">
                ({lead.userRatingsTotal} avaliações)
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic">Sem avaliações no Google</span>
          )}

          {lead.distanceKm !== null && (
            <span className="text-slate-500">
              • a ~{lead.distanceKm} km
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-slate-400 mb-3.5 line-clamp-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>{lead.formattedAddress}</span>
        </div>

        {/* Website alert if any */}
        {lead.website && (
          <div className="text-[11px] text-slate-400 mb-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 truncate">
            <span className="text-slate-500 font-medium">Link atual: </span>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {lead.website}
            </a>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {lead.whatsappUrl ? (
            <a
              href={lead.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/40 text-slate-500 cursor-not-allowed"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Sem Whats
            </button>
          )}

          <button
            onClick={() => onOpenPitch(lead)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Ver Pitch
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 px-1">
          {lead.phone ? (
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-slate-500" />
              {lead.formattedPhone}
            </a>
          ) : (
            <span className="text-slate-600 text-[11px]">Telefone ausente</span>
          )}

          <a
            href={lead.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-400 transition"
          >
            <span>Ver no Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
