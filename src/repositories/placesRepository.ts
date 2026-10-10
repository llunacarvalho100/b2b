import { RawPlace } from '../types/lead.js';
import { MOCK_PLACES_DATABASE } from './mockPlaces.js';

const SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
const PLACES_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'places.location',
  'places.primaryTypeDisplayName',
  'places.types',
].join(',');

export interface FetchPlacesResult {
  places: RawPlace[];
  isMockData: boolean;
  quotaExceeded: boolean;
  error?: string;
}

function buildHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': FIELD_MASK,
    'X-Goog-Maps-Solution-ID': SOLUTION_ID,
  };
}

function buildRequestBody(query: string) {
  return JSON.stringify({
    textQuery: query,
    languageCode: 'pt-BR',
    pageSize: 20,
  });
}

function filterMockPlaces(category: string, location: string): RawPlace[] {
  const normCat = category.toLowerCase().trim();
  const normLoc = location.toLowerCase().trim();
  return MOCK_PLACES_DATABASE.filter((place) => {
    const nameMatch = place.displayName?.text.toLowerCase().includes(normCat);
    const typeMatch = place.primaryTypeDisplayName?.text
      .toLowerCase()
      .includes(normCat);
    const locMatch =
      place.formattedAddress?.toLowerCase().includes(normLoc) || true;
    return (nameMatch || typeMatch || !normCat) && locMatch;
  });
}

async function executePlacesRequest(
  query: string,
  apiKey: string
): Promise<Response> {
  return fetch(PLACES_SEARCH_URL, {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: buildRequestBody(query),
  });
}

async function handleApiSuccess(
  res: Response
): Promise<FetchPlacesResult> {
  const data = (await res.json()) as { places?: RawPlace[] };
  return {
    places: data.places || [],
    isMockData: false,
    quotaExceeded: false,
  };
}

function handleApiError(
  status: number,
  category: string,
  location: string
): FetchPlacesResult {
  const quotaExceeded = status === 429;
  const mockFallback = filterMockPlaces(category, location);
  return {
    places: mockFallback.length > 0 ? mockFallback : MOCK_PLACES_DATABASE,
    isMockData: true,
    quotaExceeded,
    error: quotaExceeded ? 'Quota exceeded' : `Status error: ${status}`,
  };
}

export class PlacesRepository {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY;
  }

  async searchPlacesByText(
    category: string,
    location: string
  ): Promise<FetchPlacesResult> {
    if (!this.apiKey) {
      return {
        places: filterMockPlaces(category, location),
        isMockData: true,
        quotaExceeded: false,
      };
    }
    try {
      const fullQuery = `${category} em ${location}`.trim();
      const res = await executePlacesRequest(fullQuery, this.apiKey);
      if (!res.ok) {
        return handleApiError(res.status, category, location);
      }
      return await handleApiSuccess(res);
    } catch {
      return handleApiError(500, category, location);
    }
  }
}
