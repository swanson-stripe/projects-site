import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required' });
  }

  const data = await kv.get(code);
  if (!data) {
    return res.status(404).json({ error: 'Stack not found or expired' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(data);
}
