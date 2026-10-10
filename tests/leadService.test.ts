import { describe, it, expect } from 'vitest';
import { classifyWebsite, isSocialMediaUrl, isValidUrl } from '../src/services/websiteUtils.js';
import {
  cleanPhoneDigits,
  formatDisplayPhone,
  extractWhatsAppNumber,
  buildWhatsAppUrl,
} from '../src/services/phoneUtils.js';
import { calculateDistanceKm } from '../src/services/distanceUtils.js';
import { LeadService } from '../src/services/leadService.js';
import { PlacesRepository } from '../src/repositories/placesRepository.js';

describe('Website Classification Service', () => {
  it('correctly classifies missing websites as missing', () => {
    const res1 = classifyWebsite(undefined);
    expect(res1.hasWebsite).toBe(false);
    expect(res1.websiteStatus).toBe('missing');

    const res2 = classifyWebsite('');
    expect(res2.hasWebsite).toBe(false);
    expect(res2.websiteStatus).toBe('missing');
  });

  it('detects social media only links as prime leads without official website', () => {
    expect(isSocialMediaUrl('https://instagram.com/oficina_silveira')).toBe(true);
    expect(isSocialMediaUrl('https://facebook.com/pizzaria_donatello')).toBe(true);
    expect(isSocialMediaUrl('https://linktr.ee/clinica_odonto')).toBe(true);

    const classification = classifyWebsite('https://instagram.com/oficina_silveira');
    expect(classification.hasWebsite).toBe(false);
    expect(classification.websiteStatus).toBe('social_only');
  });

  it('detects valid official websites', () => {
    expect(isValidUrl('https://oficinasilveira.com.br')).toBe(true);
    const classification = classifyWebsite('https://oficinasilveira.com.br');
    expect(classification.hasWebsite).toBe(true);
    expect(classification.websiteStatus).toBe('present');
  });

  it('marks invalid urls as invalid', () => {
    const classification = classifyWebsite('not a valid url at all %%$#');
    expect(classification.hasWebsite).toBe(false);
    expect(classification.websiteStatus).toBe('invalid');
  });
});

describe('Phone and WhatsApp Utilities', () => {
  it('cleans non-digit characters', () => {
    expect(cleanPhoneDigits('(11) 98451-2340')).toBe('11984512340');
  });

  it('formats display phone in Brazilian standard', () => {
    expect(formatDisplayPhone('11984512340')).toBe('(11) 98451-2340');
    expect(formatDisplayPhone('1138124455')).toBe('(11) 3812-4455');
  });

  it('extracts WhatsApp number with 55 country prefix', () => {
    expect(extractWhatsAppNumber('11984512340')).toBe('5511984512340');
  });

  it('builds direct wa.me link with encoded text', () => {
    const url = buildWhatsAppUrl('(11) 98451-2340', 'Olá Silveira!');
    expect(url).toContain('https://wa.me/5511984512340?text=Ol%C3%A1%20Silveira!');
  });
});

describe('Distance Calculator (Haversine)', () => {
  it('calculates approximate distance between São Paulo coordinates', () => {
    // Pinheiros (-23.5615, -46.6842) to Itaim Bibi (-23.5855, -46.6811) is ~2.7 km
    const dist = calculateDistanceKm(
      { lat: -23.5615, lng: -46.6842 },
      { lat: -23.5855, lng: -46.6811 }
    );
    expect(dist).toBeGreaterThan(2);
    expect(dist).toBeLessThan(4);
  });
});

describe('LeadService Qualification and CSV Export', () => {
  const service = new LeadService(new PlacesRepository());

  it('qualifies leads and separates businesses without websites', async () => {
    const result = await service.searchAndQualifyLeads({
      locationQuery: 'Pinheiros, São Paulo',
      categoryQuery: 'Mecânica',
      radiusKm: 10,
      onlyWithoutWebsite: true,
      minRating: 0,
      minReviews: 0,
      onlyWithPhone: false,
    });

    expect(result.success).toBe(true);
    expect(result.leads.length).toBeGreaterThan(0);
    // All leads returned must not have website
    result.leads.forEach((lead) => {
      expect(lead.hasWebsite).toBe(false);
      expect(lead.leadScore).toBeGreaterThanOrEqual(40);
    });
  });

  it('exports leads to valid CSV format with UTF-8 BOM', async () => {
    const result = await service.searchAndQualifyLeads({
      locationQuery: 'Pinheiros, São Paulo',
      categoryQuery: 'Pizzaria',
      radiusKm: 10,
      onlyWithoutWebsite: false,
      minRating: 0,
      minReviews: 0,
      onlyWithPhone: false,
    });

    const csv = service.exportToCsv(result.leads);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Nome do Negócio');
    expect(csv).toContain('Score de Oportunidade');
  });
});
