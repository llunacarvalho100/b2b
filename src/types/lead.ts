/**
 * Types and interfaces for B2B Lead Prospecting and Places API
 */

export type WebsiteStatus = 'missing' | 'social_only' | 'present' | 'invalid';

export type OpportunityLevel = 'alta' | 'media' | 'baixa';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  formattedAddress: string;
  phone: string | null;
  formattedPhone: string | null;
  whatsappNumber: string | null;
  whatsappUrl: string | null;
  website: string | null;
  hasWebsite: boolean;
  websiteStatus: WebsiteStatus;
  rating: number | null;
  userRatingsTotal: number;
  googleMapsUri: string;
  location: LocationCoordinates | null;
  distanceKm: number | null;
  leadScore: number;
  opportunityLevel: OpportunityLevel;
  primaryType?: string;
}

export interface RawPlace {
  id?: string;
  name?: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  primaryTypeDisplayName?: {
    text: string;
  };
  primaryType?: string;
  types?: string[];
}

export interface SearchFilters {
  locationQuery: string;
  categoryQuery: string;
  radiusKm: number;
  onlyWithoutWebsite: boolean;
  minRating: number;
  minReviews: number;
  onlyWithPhone: boolean;
  centerCoords?: LocationCoordinates;
}

export interface SearchResponse {
  success: boolean;
  leads: Lead[];
  totalFound: number;
  withoutWebsiteCount: number;
  withWebsiteCount: number;
  opportunityPercentage: number;
  isMockData: boolean;
  quotaExceeded?: boolean;
  searchCenter?: LocationCoordinates;
  errorMessage?: string;
}

export interface PitchTemplates {
  whatsapp: string;
  phoneScript: string;
  emailScript: string;
}
