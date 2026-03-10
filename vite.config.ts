import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

/* ── in-memory stacks API for local dev (mirrors api/stacks/*) ───── */
interface StackEntry { appName: string; services: string[]; createdAt: string }
const devStore = new Map<string, StackEntry>();

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
function genCode() {
  let s = 'STACK-';
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
  });
}

function devStacksPlugin(): Plugin {
  return {
    name: 'dev-stacks-api',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        const url = req.url ?? '';

        // POST /api/stacks/create
        if (req.method === 'POST' && url === '/api/stacks/create') {
          const raw = await readBody(req);
          const { appName, services } = JSON.parse(raw) as { appName?: string; services?: string[] };
          if (!appName || !Array.isArray(services)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid payload' }));
            return;
          }
          let code: string;
          do { code = genCode(); } while (devStore.has(code));
          devStore.set(code, { appName, services, createdAt: new Date().toISOString() });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ code }));
          return;
        }

        // GET /api/stacks/:code
        const getMatch = url.match(/^\/api\/stacks\/(STACK-[a-z0-9]{4})$/i);
        if (req.method === 'GET' && getMatch) {
          const entry = devStore.get(getMatch[1]);
          if (!entry) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'not found' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(entry));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devStacksPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
