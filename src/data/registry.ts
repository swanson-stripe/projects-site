export interface RegistryService {
  name: string;
  category: string;
  description: string;
  url: string;
}

/**
 * Canonical list of supported services/providers.
 * This file is the single source of truth used by the terminal, the stack page,
 * and (eventually) replaced by an API endpoint fetch.
 */
export const REGISTRY: RegistryService[] = [
  { name: 'stripe',      category: 'payments',   description: 'Payments infrastructure',      url: 'https://stripe.com'       },
  { name: 'clerk',       category: 'auth',        description: 'Auth & user management',       url: 'https://clerk.dev'        },
  { name: 'supabase',    category: 'storage',     description: 'Open source Firebase alt.',    url: 'https://supabase.com'     },
  { name: 'vercel',      category: 'hosting',     description: 'Frontend cloud platform',      url: 'https://vercel.com'       },
  { name: 'neon',        category: 'database',    description: 'Serverless Postgres',          url: 'https://neon.tech'        },
  { name: 'railway',     category: 'hosting',     description: 'Infrastructure for devs',      url: 'https://railway.app'      },
  { name: 'posthog',     category: 'analytics',   description: 'Product analytics',            url: 'https://posthog.com'      },
  { name: 'sentry',      category: 'monitoring',  description: 'Error monitoring',             url: 'https://sentry.io'        },
  { name: 'chroma',      category: 'ai',          description: 'AI-native vector database',    url: 'https://trychroma.com'    },
  { name: 'planetscale', category: 'database',    description: 'Serverless MySQL platform',    url: 'https://planetscale.com'  },
  { name: 'turso',       category: 'database',    description: 'SQLite for the agentic era',   url: 'https://turso.tech'       },
  { name: 'runloop',     category: 'ai',          description: 'AI dev infrastructure',        url: 'https://runloop.ai'       },
];

export function lookupService(name: string): RegistryService | undefined {
  return REGISTRY.find(s => s.name.toLowerCase() === name.toLowerCase());
}
