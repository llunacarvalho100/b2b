import {
  Lead,
  RawPlace,
  SearchFilters,
  SearchResponse,
  OpportunityLevel,
  LocationCoordinates,
} from '../types/lead.js';
import { classifyWebsite } from './websiteUtils.js';
import {
  formatDisplayPhone,
  extractWhatsAppNumber,
  buildWhatsAppUrl,
} from './phoneUtils.js';
import { calculateDistanceKm } from './distanceUtils.js';
import { createWhatsAppPitch } from './pitchUtils.js';
import { PlacesRepository, FetchPlacesResult } from '../repositories/placesRepository.js';

function computeScore(hasWebsite: boolean, hasPhone: boolean, rating: number, reviews: number): number {
  let score = 0;
  if (!hasWebsite) score += 45;
  if (hasPhone) score += 25;
  if (rating >= 4.0) score += 15;
  if (reviews >= 30) score += 15;
  return Math.min(100, Math.max(0, score));
}

function resolveOpportunity(score: number): OpportunityLevel {
  if (score >= 70) return 'alta';
  if (score >= 45) return 'media';
  return 'baixa';
}

function buildLeadFromRaw(place: RawPlace, center?: LocationCoordinates): Lead {
  const name = place.displayName?.text || 'Estabelecimento Comercial';
  const category = place.primaryTypeDisplayName?.text || 'Comércio Local';
  const rawPhone = place.nationalPhoneNumber || place.internationalPhoneNumber || null;
  const webClassification = classifyWebsite(place.websiteUri);
  const waNum = extractWhatsAppNumber(rawPhone);
  const waPitch = createWhatsAppPitch(name, category);
  const waUrl = buildWhatsAppUrl(rawPhone, waPitch);
  const rating = place.rating || null;
  const reviews = place.userRatingCount || 0;
  const score = computeScore(webClassification.hasWebsite, !!rawPhone, rating || 0, reviews);
  const loc = place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null;
  const dist = loc && center ? calculateDistanceKm(center, loc) : null;

  return {
    id: place.id || `lead_${Math.random().toString(36).slice(2, 9)}`,
    name,
    category,
    formattedAddress: place.formattedAddress || 'Endereço não disponível',
    phone: rawPhone,
    formattedPhone: rawPhone ? formatDisplayPhone(rawPhone) : null,
    whatsappNumber: waNum,
    whatsappUrl: waUrl,
    website: place.websiteUri || null,
    hasWebsite: webClassification.hasWebsite,
    websiteStatus: webClassification.websiteStatus,
    rating,
    userRatingsTotal: reviews,
    googleMapsUri: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`,
    location: loc,
    distanceKm: dist,
    leadScore: score,
    opportunityLevel: resolveOpportunity(score),
    primaryType: place.primaryType,
  };
}

function applyLeadFilters(lead: Lead, filters: SearchFilters): boolean {
  if (filters.onlyWithoutWebsite && lead.hasWebsite) return false;
  if (filters.onlyWithPhone && !lead.phone) return false;
  if (filters.minRating > 0 && (lead.rating || 0) < filters.minRating) return false;
  if (filters.minReviews > 0 && lead.userRatingsTotal < filters.minReviews) return false;
  return true;
}

export class LeadService {
  private repository: PlacesRepository;

  constructor(repository?: PlacesRepository) {
    this.repository = repository || new PlacesRepository();
  }

  async searchAndQualifyLeads(filters: SearchFilters): Promise<SearchResponse> {
    const rawResult: FetchPlacesResult = await this.repository.searchPlacesByText(
      filters.categoryQuery,
      filters.locationQuery
    );

    const allLeads = rawResult.places.map((p) =>
      buildLeadFromRaw(p, filters.centerCoords)
    );

    const filteredLeads = allLeads
      .filter((lead) => applyLeadFilters(lead, filters))
      .sort((a, b) => b.leadScore - a.leadScore);

    const withoutWebCount = filteredLeads.filter((l) => !l.hasWebsite).length;
    const withWebCount = filteredLeads.length - withoutWebCount;
    const oppPct = filteredLeads.length > 0
      ? Math.round((withoutWebCount / filteredLeads.length) * 100)
      : 0;

    return {
      success: true,
      leads: filteredLeads,
      totalFound: filteredLeads.length,
      withoutWebsiteCount: withoutWebCount,
      withWebsiteCount: withWebCount,
      opportunityPercentage: oppPct,
      isMockData: rawResult.isMockData,
      quotaExceeded: rawResult.quotaExceeded,
      searchCenter: filters.centerCoords,
    };
  }

  exportToCsv(leads: Lead[]): string {
    const headers = [
      'ID',
      'Nome do Negócio',
      'Categoria',
      'Status do Site',
      'Site Atual',
      'Telefone',
      'WhatsApp Direto',
      'Avaliação (Rating)',
      'Total de Avaliações',
      'Score de Oportunidade',
      'Nível de Oportunidade',
      'Endereço Completo',
      'Link Google Maps',
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category.replace(/"/g, '""')}"`,
      `"${l.websiteStatus}"`,
      `"${l.website || ''}"`,
      `"${l.formattedPhone || ''}"`,
      `"${l.whatsappUrl || ''}"`,
      `"${l.rating || ''}"`,
      `"${l.userRatingsTotal}"`,
      `"${l.leadScore}"`,
      `"${l.opportunityLevel}"`,
      `"${l.formattedAddress.replace(/"/g, '""')}"`,
      `"${l.googleMapsUri}"`,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    return `\uFEFF${csvContent}`;
  }
}
