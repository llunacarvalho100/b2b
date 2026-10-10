import { WebsiteStatus } from '../types/lead.js';

const SOCIAL_DOMAINS = [
  'instagram.com',
  'facebook.com',
  'fb.me',
  'linktr.ee',
  'tiktok.com',
  'linkedin.com',
  'wa.me',
  'api.whatsapp.com',
  'youtube.com',
];

export function isSocialMediaUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return SOCIAL_DOMAINS.some((domain) => lower.includes(domain));
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function classifyWebsite(websiteUri?: string | null): {
  hasWebsite: boolean;
  websiteStatus: WebsiteStatus;
} {
  const cleanUrl = websiteUri?.trim();
  if (!cleanUrl) {
    return { hasWebsite: false, websiteStatus: 'missing' };
  }
  if (!isValidUrl(cleanUrl)) {
    return { hasWebsite: false, websiteStatus: 'invalid' };
  }
  if (isSocialMediaUrl(cleanUrl)) {
    return { hasWebsite: false, websiteStatus: 'social_only' };
  }
  return { hasWebsite: true, websiteStatus: 'present' };
}
