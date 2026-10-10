import React, { useState } from 'react';
import { X, MessageSquare, Phone, Mail, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { Lead } from '../types/lead.js';
import { generateLeadPitches } from '../services/pitchUtils.js';

interface PitchModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ lead, onClose }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const pitches = generateLeadPitches(lead.name, lead.category);

  const currentText =
    activeTab === 'whatsapp'
      ? pitches.whatsapp
      : activeTab === 'phone'
      ? pitches.phoneScript
      : pitches.emailScript;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white">
                Roteiro de Abordagem Comercial
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Personalizado para: <strong className="text-slate-200">{lead.name}</strong> ({lead.category})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'whatsapp'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp (Mais Eficaz)
          </button>
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'phone'
                ? 'text-blue-400 border-blue-500 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Ligação (Cold Call)
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'email'
                ? 'text-purple-400 border-purple-500 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            E-mail Proposta
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 space-y-4 flex-1">
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed selection:bg-blue-600">
              {currentText}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copiar Roteiro</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {lead.phone ? (
                <span>Telefone registrado: <strong className="text-slate-200">{lead.formattedPhone}</strong></span>
              ) : (
                <span>Sem telefone cadastrado na ficha do Google.</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {lead.whatsappUrl && (
                <a
                  href={lead.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm w-full sm:w-auto"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Abrir WhatsApp Direto
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition w-full sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
