import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Building2, Filter, Loader2 } from 'lucide-react';
import { SearchFilters } from '../types/lead.js';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const CATEGORY_SUGGESTIONS = [
  'Oficina Mecânica',
  'Dentista',
  'Barbearia',
  'Pizzaria',
  'Pet Shop',
  'Academia',
  'Restaurante',
  'Clínica Médica',
  'Salão de Beleza',
  'Autopeças',
];

const LOCATION_PRESETS = [
  'Pinheiros, São Paulo - SP',
  'Itaim Bibi, São Paulo - SP',
  'Barra da Tijuca, Rio de Janeiro - RJ',
  'Savassi, Belo Horizonte - MG',
  'Batel, Curitiba - PR',
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [locationQuery, setLocationQuery] = useState('Pinheiros, São Paulo - SP');
  const [categoryQuery, setCategoryQuery] = useState('Oficina Mecânica');
  const [radiusKm, setRadiusKm] = useState(10);
  const [onlyWithoutWebsite, setOnlyWithoutWebsite] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      locationQuery,
      categoryQuery,
      radiusKm,
      onlyWithoutWebsite,
      minRating,
      minReviews,
      onlyWithPhone,
    });
  };

  const handleApplyPreset = (cat: string, loc?: string) => {
    setCategoryQuery(cat);
    if (loc) setLocationQuery(loc);
    onSearch({
      locationQuery: loc || locationQuery,
      categoryQuery: cat,
      radiusKm,
      onlyWithoutWebsite,
      minRating,
      minReviews,
      onlyWithPhone,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Location input */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Cidade, Bairro ou CEP
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Ex: Pinheiros, São Paulo ou CEP"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Category input */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Nicho ou Tipo de Negócio
            </label>
            <div className="relative">
              <input
                type="text"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder="Ex: Mecânica, Dentista, Pet Shop..."
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Radius selector */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Raio de Busca
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value={2}>Até 2 km (Hiperlocal)</option>
              <option value={5}>Até 5 km (Bairro)</option>
              <option value={10}>Até 10 km (Região)</option>
              <option value={25}>Até 25 km (Cidade)</option>
              <option value={50}>Até 50 km (Metropolitana)</option>
            </select>
          </div>
        </div>

        {/* Toggles and action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Without website toggle */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-slate-950/60 hover:bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 transition">
              <input
                type="checkbox"
                checked={onlyWithoutWebsite}
                onChange={(e) => setOnlyWithoutWebsite(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-rose-400">
                  Apenas SEM SITE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                  Leads Qualificados
                </span>
              </div>
            </label>

            {/* Toggle advanced filters */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              <span>Filtros Extras</span>
              {(minRating > 0 || minReviews > 0 || onlyWithPhone) && (
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-600/30 transition disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rastreando Google Maps...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Rastrear Oportunidades</span>
              </>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Avaliação Mínima
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value={0}>Qualquer nota</option>
                <option value={3.5}>3.5+ Estrelas</option>
                <option value={4.0}>4.0+ Estrelas (Boa reputação)</option>
                <option value={4.5}>4.5+ Estrelas (Alta reputação)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Qtd Mínima de Avaliações
              </label>
              <select
                value={minReviews}
                onChange={(e) => setMinReviews(Number(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value={0}>Qualquer quantidade</option>
                <option value={10}>Pelo menos 10 avaliações</option>
                <option value={30}>Pelo menos 30 avaliações</option>
                <option value={50}>50+ avaliações (Consolidado)</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none p-2 rounded-lg bg-slate-900 border border-slate-700 w-full">
                <input
                  type="checkbox"
                  checked={onlyWithPhone}
                  onChange={(e) => setOnlyWithPhone(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-950 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Apenas com Telefone/WhatsApp
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Quick Category & Location suggestions */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 overflow-x-auto pb-1">
            <span className="shrink-0 flex items-center gap-1 text-slate-500 font-medium">
              <Filter className="w-3 h-3" /> Nichos comuns:
            </span>
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleApplyPreset(cat)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-xs transition border ${
                  categoryQuery.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-medium'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto pb-1">
            <span className="shrink-0 flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="w-3 h-3" /> Regiões teste:
            </span>
            {LOCATION_PRESETS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleApplyPreset(categoryQuery, loc)}
                className="shrink-0 px-2 py-0.5 rounded text-[11px] bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 transition"
              >
                {loc.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
