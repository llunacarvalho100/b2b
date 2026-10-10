import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutGrid,
  Table as TableIcon,
  Download,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Header } from './components/Header.js';
import { SearchBar } from './components/SearchBar.js';
import { MetricsCards } from './components/MetricsCards.js';
import { LeadCard } from './components/LeadCard.js';
import { LeadTable } from './components/LeadTable.js';
import { PitchModal } from './components/PitchModal.js';
import { QuotaBanner } from './components/QuotaBanner.js';
import { Lead, SearchFilters, SearchResponse } from './types/lead.js';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [withoutWebsiteCount, setWithoutWebsiteCount] = useState(0);
  const [opportunityPercentage, setOpportunityPercentage] = useState(0);
  const [isMockData, setIsMockData] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'score' | 'reviews' | 'rating' | 'name'>('score');
  const [filterTerm, setFilterTerm] = useState('');
  const [selectedLeadForPitch, setSelectedLeadForPitch] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen to Google Maps quota event
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      if (response.status === 429) {
        setQuotaExceeded(true);
      }

      const data: SearchResponse = await response.json();

      if (data.quotaExceeded) {
        setQuotaExceeded(true);
      }

      setLeads(data.leads || []);
      setTotalFound(data.totalFound || 0);
      setWithoutWebsiteCount(data.withoutWebsiteCount || 0);
      setOpportunityPercentage(data.opportunityPercentage || 0);
      setIsMockData(data.isMockData || false);

      if (data.leads && data.leads.length === 0) {
        showToast('Nenhum negócio encontrado para os filtros selecionados.');
      } else {
        showToast(`${data.totalFound} estabelecimentos analisados pelo radar!`);
      }
    } catch {
      setErrorNotice('Não foi possível conectar ao servidor de busca. Usando modo offline.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search on first load
  useEffect(() => {
    handleSearch({
      locationQuery: 'Pinheiros, São Paulo - SP',
      categoryQuery: 'Oficina Mecânica',
      radiusKm: 10,
      onlyWithoutWebsite: true,
      minRating: 0,
      minReviews: 0,
      onlyWithPhone: false,
    });
  }, []);

  // Filter & Sort leads in memory
  const processedLeads = useMemo(() => {
    return leads
      .filter((l) => {
        if (!filterTerm) return true;
        const term = filterTerm.toLowerCase();
        return (
          l.name.toLowerCase().includes(term) ||
          l.category.toLowerCase().includes(term) ||
          l.formattedAddress.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.leadScore - a.leadScore;
        if (sortBy === 'reviews') return b.userRatingsTotal - a.userRatingsTotal;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [leads, filterTerm, sortBy]);

  const handleExportCsv = async () => {
    if (processedLeads.length === 0) {
      showToast('Nenhum lead disponível para exportar.');
      return;
    }

    try {
      const response = await fetch('/api/leads/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: processedLeads }),
      });

      if (!response.ok) throw new Error('Falha ao exportar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-radar-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Planilha CSV gerada com sucesso!');
    } catch {
      showToast('Erro ao exportar arquivo CSV.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <QuotaBanner visible={quotaExceeded} />
      <Header isMockData={isMockData} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner */}
        {errorNotice && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button onClick={() => setErrorNotice(null)} className="text-rose-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Search Engine & Filters */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* KPI Metrics Summary */}
        <MetricsCards
          leads={leads}
          totalFound={totalFound}
          withoutWebsiteCount={withoutWebsiteCount}
          opportunityPercentage={opportunityPercentage}
        />

        {/* Results Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Filtrar por nome ou rua..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-950 border border-slate-800 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none"
              >
                <option value="score">Maior Oportunidade (Score)</option>
                <option value="reviews">Mais Avaliações (Fluxo)</option>
                <option value="rating">Melhor Nota no Google</option>
                <option value="name">Ordem Alfabética (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            {/* View Switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização em Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização em Tabela"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Export CSV button */}
            <button
              onClick={handleExportCsv}
              disabled={processedLeads.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Planilha (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Lead Listings */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">
              Consultando estabelecimentos no Google Places e identificando negócios sem site...
            </p>
          </div>
        ) : processedLeads.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhum resultado encontrado</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Experimente aumentar o raio de busca, mudar o nicho comercial ou desmarcar a opção &quot;Apenas SEM SITE&quot;.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onOpenPitch={setSelectedLeadForPitch}
              />
            ))}
          </div>
        ) : (
          <LeadTable
            leads={processedLeads}
            onOpenPitch={setSelectedLeadForPitch}
          />
        )}
      </main>

      {/* Pitch Modal */}
      <PitchModal
        lead={selectedLeadForPitch}
        onClose={() => setSelectedLeadForPitch(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
