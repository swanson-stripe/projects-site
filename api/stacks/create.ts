import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 4;
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export interface StackPayload {
  appName: string;
  services: string[];
  createdAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { appName, services } = req.body as { appName?: string; services?: string[] };

  if (!appName || typeof appName !== 'string') {
    return res.status(400).json({ error: 'appName is required' });
  }
  if (!Array.isArray(services)) {
    return res.status(400).json({ error: 'services must be an array' });
  }

  // Generate a unique code, retrying on the rare collision
  let code: string;
  let attempts = 0;
  do {
    code = `STACK-${generateCode()}`;
    attempts++;
    if (attempts > 10) {
      return res.status(500).json({ error: 'Could not generate unique code' });
    }
  } while (await kv.exists(code));

  const payload: StackPayload = {
    appName: appName.trim(),
    services: services.map(s => String(s).toLowerCase().trim()),
    createdAt: new Date().toISOString(),
  };

  await kv.set(code, payload, { ex: TTL_SECONDS });

  return res.status(200).json({ code });
}
