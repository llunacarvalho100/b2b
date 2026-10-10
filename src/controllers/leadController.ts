import { Request, Response } from 'express';
import { LeadService } from '../services/leadService.js';
import { SearchFilters, Lead } from '../types/lead.js';

function parseCoordinates(lat?: unknown, lng?: unknown) {
  if (typeof lat === 'number' && typeof lng === 'number') {
    return { lat, lng };
  }
  return undefined;
}

function parseSearchFilters(body: Record<string, unknown>): SearchFilters {
  const locationQuery = String(body.locationQuery || '').trim();
  const categoryQuery = String(body.categoryQuery || '').trim();
  const radiusKm = Number(body.radiusKm) || 10;
  const onlyWithoutWebsite = body.onlyWithoutWebsite !== false;
  const minRating = Number(body.minRating) || 0;
  const minReviews = Number(body.minReviews) || 0;
  const onlyWithPhone = Boolean(body.onlyWithPhone);
  const centerCoords = parseCoordinates(body.lat, body.lng);

  return {
    locationQuery: locationQuery || 'São Paulo, SP',
    categoryQuery: categoryQuery || 'Oficina Mecânica',
    radiusKm,
    onlyWithoutWebsite,
    minRating,
    minReviews,
    onlyWithPhone,
    centerCoords,
  };
}

export class LeadController {
  private leadService: LeadService;

  constructor(leadService?: LeadService) {
    this.leadService = leadService || new LeadService();
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const filters = parseSearchFilters(req.body || {});
      const result = await this.leadService.searchAndQualifyLeads(filters);
      res.status(200).json(result);
    } catch {
      res.status(500).json({
        success: false,
        errorMessage: 'Erro interno ao processar a busca de leads.',
      });
    }
  }

  exportCsv(req: Request, res: Response): void {
    try {
      const leads = (req.body?.leads || []) as Lead[];
      if (!Array.isArray(leads) || leads.length === 0) {
        res.status(400).json({ error: 'Nenhum lead fornecido para exportação.' });
        return;
      }
      const csv = this.leadService.exportToCsv(leads);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="leads-sem-site.csv"');
      res.status(200).send(csv);
    } catch {
      res.status(500).json({ error: 'Falha ao gerar arquivo CSV.' });
    }
  }
}
