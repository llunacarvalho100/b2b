import type { VercelRequest, VercelResponse } from '@vercel/node';
import { LeadController } from '../src/controllers/leadController.js';

const leadController = new LeadController();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Method not allowed' });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return leadController.search(req as any, res as any);
}
