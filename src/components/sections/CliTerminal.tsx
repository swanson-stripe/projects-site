import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent as KE,
  type CSSProperties,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextEffect } from '@/components/ui/text-effect';

import { PARTNERS } from '@/components/sections/Partners';
import { useIsMobile } from '@/hooks/useIsMobile';

/* ─── imperative handle ──────────────────────────────────────────── */
export interface CliHandle {
  submit: (command: string) => void;
}

/* ─── tokens ─────────────────────────────────────────────────────── */
const PINK   = 'var(--color-pink)';
const MUTED  = 'var(--color-text-ui-muted)';
const DIM    = 'var(--color-text-ui-subtle)';
const BORDER = '1px solid var(--color-border-accent)';

/* ─── types ──────────────────────────────────────────────────────── */
type LT = 'cmd' | 'step' | 'sub' | 'done' | 'url' | 'urlsub' | 'blank' | 'kv' | 'section' | 'hint' | 'err' | 'raw' | 'col2' | 'welcome' | 'spinner' | 'choice' | 'tpl' | 'add' | 'mod';

interface Line {
  id: number;
  t: LT;
  text: string;
  lkey?: string;   // key column for kv / col2 / choice / tpl lines
  initial?: boolean;
  instant?: boolean; // skip entry animation (used when replacing a spinner)
  dim?: boolean;   // for raw lines that should use DIM color
}

/* ─── uid counter ────────────────────────────────────────────────── */
let _uid = 100;
const uid = () => _uid++;

/* Mark every line in an array as instant (skip entry animation). */
const instant = (lines: Line[]): Line[] => lines.map(l => ({ ...l, instant: true }));

/* ─── slash command registry ─────────────────────────────────────── */
interface SlashCommand { cmd: string; desc: string; isGroup?: boolean; }

/* Services that can be provisioned — used to build sub-entries */
const SERVICE_OPTIONS: Array<{ name: string; desc: string }> = [
  { name: 'stripe',      desc: 'payments · billing'              },
  { name: 'clerk',       desc: 'auth · user management'          },
  { name: 'supabase',    desc: 'storage · open source db'        },
  { name: 'vercel',      desc: 'hosting · frontend cloud'        },
  { name: 'neon',        desc: 'database · serverless postgres'  },
  { name: 'railway',     desc: 'hosting · infrastructure'        },
  { name: 'posthog',     desc: 'analytics · product events'      },
  { name: 'sentry',      desc: 'monitoring · error tracking'     },
  { name: 'chroma',      desc: 'ai · vector database'            },
  { name: 'planetscale', desc: 'database · serverless mysql'     },
];

/* Commands that take a service name as their next argument */
const SERVICE_ARG_CMDS = [
  '/services add',
  '/services import',
  '/services remove',
  '/services upgrade',
  '/services configure',
  '/services inspect',
] as const;

const SLASH_COMMANDS: SlashCommand[] = [
  { cmd: '/help',                   desc: 'show command reference'                },
  { cmd: '/partners',               desc: 'list all integrations'                 },
  { cmd: '/stack',                  desc: 'view starter templates'                },
  { cmd: '/costs',                  desc: 'view pricing info'                     },
  { cmd: '/env',                    desc: 'view environment variables'            },
  // services group — isGroup: true means Enter expands rather than submits
  { cmd: '/services add',           desc: 'add a service to your stack',       isGroup: true },
  { cmd: '/services import',        desc: 'import existing external resource', isGroup: true },
  { cmd: '/services remove',        desc: 'remove a service',                  isGroup: true },
  { cmd: '/services upgrade',       desc: 'change service tier',               isGroup: true },
  { cmd: '/services configure',     desc: 'interactive configuration wizard',  isGroup: true },
  { cmd: '/services inspect',       desc: 'show configuration options',        isGroup: true },
  { cmd: '/services connect',       desc: 'connect two services'               },
  { cmd: '/services status',        desc: 'view current stack status'          },
  { cmd: '/services list',          desc: 'list available services'            },
  // service sub-entries — shown after a group command is expanded
  ...SERVICE_ARG_CMDS.flatMap(base =>
    SERVICE_OPTIONS.map(s => ({ cmd: `${base} ${s.name}`, desc: s.desc }))
  ),
  { cmd: '/contest',                desc: 'enter to win a mac mini'           },
  { cmd: '/clear',                  desc: 'clear terminal'                     },
  { cmd: '/why',                    desc: 'why projects exists'                },
];

/* ─── install-demo constants ─────────────────────────────────────── */
const INTRO_LINES: { text: string; delay: number }[] = [
  { text: 'Stripe projects will provision resources and return ready-to-use keys. Launch or hand off to an agent to deploy your app automatically.', delay: 1000 },
];

/* ─── template data ──────────────────────────────────────────────── */
interface TplService {
  name:     string;
  category: string;
  tier:     string;
  cost:     number;
  envVars:  number;
}
interface Template {
  id:       string;
  price:    number;
  desc:     string;
  tags:     string[];
  services: TplService[];
}

const TEMPLATES: Template[] = [
  {
    id: 'saas-starter', price: 55,
    desc: 'SaaS with auth, billing, and analytics',
    tags: ['hosting', 'auth', 'payments', 'database'],
    services: [
      { name: 'Vercel',   category: 'hosting',   tier: 'pro',           cost: 20, envVars: 3  },
      { name: 'Clerk',    category: 'auth',       tier: 'growth',        cost: 25, envVars: 4  },
      { name: 'Stripe',   category: 'payments',   tier: 'pay-as-you-go', cost:  0, envVars: 3  },
      { name: 'Neon',     category: 'database',   tier: 'scale',         cost: 10, envVars: 2  },
      { name: 'PostHog',  category: 'analytics',  tier: 'free',          cost:  0, envVars: 2  },
    ],
  },
  {
    id: 'ai-app', price: 95,
    desc: 'AI-native product with model routing and vector search',
    tags: ['hosting', 'ai', 'database', 'auth'],
    services: [
      { name: 'Vercel',     category: 'hosting',    tier: 'pro',    cost: 20, envVars: 3 },
      { name: 'Clerk',      category: 'auth',        tier: 'growth', cost: 25, envVars: 4 },
      { name: 'OpenRouter', category: 'ai routing',  tier: 'usage',  cost: 30, envVars: 2 },
      { name: 'Chroma',     category: 'vector db',   tier: 'cloud',  cost: 20, envVars: 2 },
      { name: 'Neon',       category: 'database',    tier: 'scale',  cost: 10, envVars: 2 },
    ],
  },
  {
    id: 'storefront', price: 75,
    desc: 'Digital storefront with payments, storage, and tracking',
    tags: ['hosting', 'payments', 'storage', 'auth'],
    services: [
      { name: 'Vercel',   category: 'hosting',   tier: 'pro',           cost: 20, envVars: 3 },
      { name: 'Stripe',   category: 'payments',   tier: 'pay-as-you-go', cost:  0, envVars: 3 },
      { name: 'Supabase', category: 'storage',    tier: 'pro',           cost: 25, envVars: 5 },
      { name: 'Clerk',    category: 'auth',        tier: 'growth',        cost: 25, envVars: 4 },
      { name: 'PostHog',  category: 'analytics',  tier: 'free',          cost:  0, envVars: 2 },
    ],
  },
  {
    id: 'api-backend', price: 45,
    desc: 'Scalable backend API with jobs and monitoring',
    tags: ['hosting', 'database', 'auth', 'jobs'],
    services: [
      { name: 'Railway', category: 'hosting',     tier: 'developer', cost: 20, envVars: 3 },
      { name: 'Neon',    category: 'database',    tier: 'scale',     cost: 10, envVars: 2 },
      { name: 'Clerk',   category: 'auth',         tier: 'free',      cost:  0, envVars: 4 },
      { name: 'Inngest', category: 'background jobs', tier: 'basic',  cost:  5, envVars: 2 },
      { name: 'Sentry',  category: 'monitoring',  tier: 'developer', cost: 26, envVars: 2 },
    ],
  },
];

/* ─── boot sequence ──────────────────────────────────────────────── */
const BOOT: Array<Line & { showAt: number }> = [
  // welcome box
  { id: 0,  t: 'welcome', text: '', initial: true, showAt: 0   },
  { id: 4,  t: 'blank',   text: '',                showAt: 200 },
  // init command + boot flow
  { id: 5,  t: 'cmd',   text: 'stripe projects init',                    initial: true, showAt: 700  },
  { id: 6,  t: 'blank', text: '',                                                                showAt: 900  },
  { id: 7,  t: 'step',  text: 'install stripe projects',                 initial: true, showAt: 1150 },
  { id: 8,  t: 'step',  text: 'select your desired tech stack',          initial: true, showAt: 1700 },
  { id: 9,  t: 'sub',   text: 'frontend with vercel',                    initial: true, showAt: 2100 },
  { id: 10, t: 'sub',   text: 'auth with clerk',                         initial: true, showAt: 2350 },
  { id: 11, t: 'sub',   text: 'storage with supabase',                   initial: true, showAt: 2600 },
  { id: 12, t: 'sub',   text: 'payments with stripe',                    initial: true, showAt: 2850 },
  { id: 13, t: 'sub',   text: 'analytics with posthog',                  initial: true, showAt: 3100 },
  { id: 14, t: 'blank', text: '',                                                                showAt: 3350 },
  { id: 15, t: 'done',  text: 'automatically created and provisioned for you', initial: true, showAt: 3600 },
  { id: 16, t: 'url',   text: 'app running at localhost:9999',           initial: true, showAt: 4200 },
];

/* ─── command responses ──────────────────────────────────────────── */
function respond(input: string): Line[] {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  /* ── /help ── */
  /* ── ? ── */
  if (lower === '?') {
    return [
      { id: uid(), t: 'blank', text: '' },
      { id: uid(), t: 'done',  text: 'Stripe Projects eliminates manual infrastructure setup and dashboard-hopping. Developers and AI agents can connect, pay, and provision hosting, databases, AI, auth, messaging and more, directly in their own cloud accounts - securely, deterministically, and without lock-in.' },
      { id: uid(), t: 'blank', text: '' },
      { id: uid(), t: 'done',   text: 'Get started by installing via npm or homebrew.' },
      { id: uid(), t: 'blank',  text: '' },
      { id: uid(), t: 'choice', lkey: '└ npm ', text: 'npx @stripe/projects init my-app' },
      { id: uid(), t: 'choice', lkey: '  brew', text: 'brew install stripe-cli' },
      { id: uid(), t: 'choice', lkey: '      ', text: 'stripe projects init my-app' },
      { id: uid(), t: 'blank',  text: '' },
    ];
  }

  if (lower === '/help' || lower === 'help') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'usage' },
      { id: uid(), t: 'raw',     text: 'projects <command> [flags]' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'getting started' },
      { id: uid(), t: 'col2', lkey: 'init [name]',          text: 'Initialize a new stack'              },
      { id: uid(), t: 'col2', lkey: 'init --guided',        text: 'Interactive wizard (recommended)'   },
      { id: uid(), t: 'col2', lkey: 'init --template <n>',  text: 'Initialize from a starter template' },
      { id: uid(), t: 'col2', lkey: 'templates list',       text: 'List available starter templates'   },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'services' },
      { id: uid(), t: 'col2', lkey: 'services add <provider/service>',    text: 'Add a service to your stack'           },
      { id: uid(), t: 'col2', lkey: 'services import <provider/service>', text: 'Import existing external resource'     },
      { id: uid(), t: 'col2', lkey: 'services remove <service-id>',       text: 'Remove a service'                      },
      { id: uid(), t: 'col2', lkey: 'services upgrade <service>',         text: 'Change service tier'                   },
      { id: uid(), t: 'col2', lkey: 'services connect <src> <dst>',       text: 'Connect two services'                  },
      { id: uid(), t: 'col2', lkey: 'services status',                    text: 'View current stack status'             },
      { id: uid(), t: 'col2', lkey: 'services list',                      text: 'List available services (marketplace)' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'portability' },
      { id: uid(), t: 'col2', lkey: 'export [--format=<f>]', text: 'Export stack (yaml, terraform, pulumi)' },
      { id: uid(), t: 'col2', lkey: 'apply <file>',           text: 'Import/apply stack configuration'      },
      { id: uid(), t: 'col2', lkey: 'offboard',               text: 'Interactive migration wizard'          },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'more' },
      { id: uid(), t: 'col2', lkey: 'env ?',    text: 'environments command list'     },
      { id: uid(), t: 'col2', lkey: 'secret ?', text: 'secrets & credentials list'   },
      { id: uid(), t: 'col2', lkey: 'costs ?',  text: 'costs & billing command list'  },
      { id: uid(), t: 'col2', lkey: 'flags',    text: 'global flags list'             },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'type any question in plain english' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /partners or "what services" ── */
  if (lower === '/partners' || lower.includes('what services') || lower.includes('integrations')) {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'supported integrations' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'stripe',      text: 'payments processing'   },
      { id: uid(), t: 'col2', lkey: 'clerk',       text: 'authentication'        },
      { id: uid(), t: 'col2', lkey: 'supabase',    text: 'storage & database'    },
      { id: uid(), t: 'col2', lkey: 'posthog',     text: 'product analytics'     },
      { id: uid(), t: 'col2', lkey: 'neon',        text: 'serverless postgres'   },
      { id: uid(), t: 'col2', lkey: 'sentry',      text: 'error monitoring'      },
      { id: uid(), t: 'col2', lkey: 'chroma',      text: 'vector database'       },
      { id: uid(), t: 'col2', lkey: 'planetscale', text: 'mysql platform'        },
      { id: uid(), t: 'col2', lkey: 'railway',     text: 'cloud deployment'      },
      { id: uid(), t: 'col2', lkey: 'vercel',      text: 'frontend hosting'      },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'run services add <name> to provision any integration' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /stack ── */
  if (lower === '/stack') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'starter templates' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'web',      text: 'next.js · vercel · supabase · clerk'  },
      { id: uid(), t: 'col2', lkey: 'saas',     text: 'remix · railway · neon · stripe'      },
      { id: uid(), t: 'col2', lkey: 'ai',       text: 'next.js · vercel · chroma · openai'   },
      { id: uid(), t: 'col2', lkey: 'commerce', text: 'next.js · vercel · stripe · supabase' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'run init --template <name> to bootstrap a stack' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /costs ── */
  if (lower === '/costs' || lower.includes('cost') || lower.includes('pricing') || lower.includes('how much')) {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'pricing' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'projects itself is free — you pay only for what you provision' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'example free-tier stack' },
      { id: uid(), t: 'col2', lkey: 'vercel hobby',    text: '$0/mo  · 100GB bandwidth'         },
      { id: uid(), t: 'col2', lkey: 'clerk free',      text: '$0/mo  · 10,000 MAUs'             },
      { id: uid(), t: 'col2', lkey: 'supabase free',   text: '$0/mo  · 500MB database'          },
      { id: uid(), t: 'col2', lkey: 'neon free',       text: '$0/mo  · 0.5GB storage'           },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'example paid stack' },
      { id: uid(), t: 'col2', lkey: 'vercel pro',      text: '$20/mo · unlimited deployments'   },
      { id: uid(), t: 'col2', lkey: 'clerk growth',    text: '$25/mo · unlimited MAUs'          },
      { id: uid(), t: 'col2', lkey: 'supabase pro',    text: '$25/mo · 8GB database'            },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'run costs ? for full billing commands' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /env ── */
  if (lower === '/env') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'environment commands' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'env list',             text: 'List all provisioned credentials'   },
      { id: uid(), t: 'col2', lkey: 'env list --reveal',    text: 'Show full credential values'        },
      { id: uid(), t: 'col2', lkey: 'env set <key> <val>',  text: 'Set an environment variable'        },
      { id: uid(), t: 'col2', lkey: 'env use <name>',       text: 'Switch active environment'          },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services add ── */
  if (lower === '/services add') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services add <provider/service>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'vercel',      text: 'hosting · frontend cloud'    },
      { id: uid(), t: 'col2', lkey: 'clerk',       text: 'auth · user management'      },
      { id: uid(), t: 'col2', lkey: 'supabase',    text: 'storage · open source db'    },
      { id: uid(), t: 'col2', lkey: 'neon',        text: 'database · serverless postgres' },
      { id: uid(), t: 'col2', lkey: 'planetscale', text: 'database · serverless mysql' },
      { id: uid(), t: 'col2', lkey: 'railway',     text: 'hosting · infrastructure'    },
      { id: uid(), t: 'col2', lkey: 'posthog',     text: 'analytics · product events'  },
      { id: uid(), t: 'col2', lkey: 'sentry',      text: 'monitoring · error tracking' },
      { id: uid(), t: 'col2', lkey: 'chroma',      text: 'ai · vector database'        },
      { id: uid(), t: 'col2', lkey: 'stripe',      text: 'payments · billing'          },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'e.g.  services add vercel' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services import ── */
  if (lower === '/services import') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services import <provider/service>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'connects an existing external resource to your stack' },
      { id: uid(), t: 'step',    text: 'credentials are read from your environment and stored securely' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'e.g.  services import supabase' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services remove ── */
  if (lower === '/services remove') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services remove <service-id>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'deprovisions the service and removes its credentials' },
      { id: uid(), t: 'step',    text: 'run services status to see service IDs' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services upgrade ── */
  if (lower === '/services upgrade') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services upgrade <service>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'launches an interactive tier selector for the service' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services configure ── */
  if (lower === '/services configure') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services configure <service>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'opens an interactive wizard to update service settings' },
      { id: uid(), t: 'step',    text: 'changes are applied to the active environment' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services inspect ── */
  if (lower === '/services inspect') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services inspect <service>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'prints all configuration options and current values for a service' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services connect ── */
  if (lower === '/services connect') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'usage: services connect <src> <dst>' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'auto-wires credentials from src into dst environment variables' },
      { id: uid(), t: 'step',    text: 'no manual env configuration required' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'e.g.  services connect supabase vercel' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services status ── */
  if (lower === '/services status') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'stack · my-app' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: '✓ vercel',      text: 'hosting    · active   · $20/mo' },
      { id: uid(), t: 'col2', lkey: '✓ clerk',       text: 'auth       · active   · $25/mo' },
      { id: uid(), t: 'col2', lkey: '✓ supabase',    text: 'storage    · active   · $25/mo' },
      { id: uid(), t: 'col2', lkey: '✓ stripe',      text: 'payments   · active   · $0/mo'  },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'total',          text: '$70/mo across 4 services'       },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /services list ── */
  if (lower === '/services list') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'marketplace' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'vercel',      text: 'hosting · frontend cloud platform'     },
      { id: uid(), t: 'col2', lkey: 'clerk',       text: 'auth · user management & social login' },
      { id: uid(), t: 'col2', lkey: 'supabase',    text: 'storage · open source firebase alt'   },
      { id: uid(), t: 'col2', lkey: 'neon',        text: 'database · serverless postgres'        },
      { id: uid(), t: 'col2', lkey: 'planetscale', text: 'database · serverless mysql'           },
      { id: uid(), t: 'col2', lkey: 'railway',     text: 'hosting · zero-ops infrastructure'     },
      { id: uid(), t: 'col2', lkey: 'posthog',     text: 'analytics · product events & replay'  },
      { id: uid(), t: 'col2', lkey: 'sentry',      text: 'monitoring · error tracking'           },
      { id: uid(), t: 'col2', lkey: 'chroma',      text: 'ai · vector database'                  },
      { id: uid(), t: 'col2', lkey: 'stripe',      text: 'payments · billing & subscriptions'    },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'run services add <name> to provision any service' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── natural language: capabilities ── */
  if (lower.includes('capabilit') || lower.includes('what can you') || lower.includes('what do you')) {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'capabilities' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'scaffold a full-stack project in seconds with projects init' },
      { id: uid(), t: 'step',    text: 'provision any combination of services from the marketplace'  },
      { id: uid(), t: 'step',    text: 'manage environments, credentials, and secrets in one place'  },
      { id: uid(), t: 'step',    text: 'connect services automatically — no manual env wiring'       },
      { id: uid(), t: 'step',    text: 'export your stack to terraform, pulumi, or raw yaml'         },
      { id: uid(), t: 'step',    text: 'migrate off any service with the interactive offboard wizard' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'run /help for the full command reference' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /why ── */
  if (lower === '/why') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: 'noboa' },
      { id: uid(), t: 'hint',    text: 'not obvious before, obvious after' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'as incredible tools for developers and agents have proliferated,' },
      { id: uid(), t: 'step',    text: 'we have a wealth of choices as builders. when building with an'  },
      { id: uid(), t: 'step',    text: 'agentic toolkit, a significant set of roadblocks appeared:'      },
      { id: uid(), t: 'step',    text: 'choice, provisioning, and management. projects aims to simplify' },
      { id: uid(), t: 'step',    text: 'all of that, in a way that feels so obvious now.'                },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── stripe projects services add <name>  OR  /services add <name> ── */
  const addMatch = raw.match(/^(?:(?:stripe\s+)?projects\s+services?\s+add|\/services\s+add)\s+(\S+)/i);
  if (addMatch) {
    const svcSlug    = addMatch[1].toLowerCase();
    const partner    = PARTNERS.find(p => p.name.toLowerCase() === svcSlug);
    const displayName = partner?.name ?? svcSlug;
    const category   = partner?.category ?? 'service';
    return [
      { id: uid(), t: 'blank', text: '' },
      { id: uid(), t: 'step',  text: `provisioning ${displayName} for ${category}...` },
      { id: uid(), t: 'sub',   text: 'allocating resources' },
      { id: uid(), t: 'sub',   text: `configuring ${category} instance` },
      { id: uid(), t: 'sub',   text: 'generating credentials' },
      { id: uid(), t: 'done',  text: `${displayName} added to your stack` },
      { id: uid(), t: 'sub',   text: 'run env list to view new credentials' },
      { id: uid(), t: 'blank', text: '' },
    ];
  }

  /* ── /contest ── */
  if (lower === '/contest') {
    return [
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'section', text: '🎁  contest entry' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'done',    text: 'entry received — good luck!' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'step',    text: 'the email associated with your stripe account' },
      { id: uid(), t: 'step',    text: 'has been entered into the drawing.' },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'col2', lkey: 'prize',   text: 'mac mini + openclaw + projects credits' },
      { id: uid(), t: 'col2', lkey: 'winners', text: '10 randomly chosen'                     },
      { id: uid(), t: 'blank',   text: '' },
      { id: uid(), t: 'hint',    text: 'results announced at the close of the event' },
      { id: uid(), t: 'blank',   text: '' },
    ];
  }

  /* ── /clear ── */
  if (lower === '/clear') {
    return []; // handled separately in submit()
  }

  /* ── fallback ── */
  return [
    { id: uid(), t: 'blank', text: '' },
    { id: uid(), t: 'err',   text: `command not found: ${raw}` },
    { id: uid(), t: 'hint',  text: 'type /help to see available commands, or ask a question in plain english' },
    { id: uid(), t: 'blank', text: '' },
  ];
}

/* ─── line style lookup ──────────────────────────────────────────── */
const LINE_PROPS: Record<LT, { prefix: string; prefixColor: string; textColor: string; indent: boolean }> = {
  cmd:     { prefix: '›',  prefixColor: PINK,       textColor: 'var(--color-text-ui)',  indent: false },
  step:    { prefix: '•',  prefixColor: MUTED,      textColor: 'var(--color-text-ui)',  indent: false },
  sub:     { prefix: '↳',  prefixColor: DIM,        textColor: MUTED,                   indent: true  },
  done:    { prefix: '✓',  prefixColor: PINK,  textColor: 'var(--color-text-ui)',  indent: false },
  url:     { prefix: '→',  prefixColor: PINK,       textColor: PINK,                    indent: false },
  urlsub:  { prefix: '↳',  prefixColor: DIM,        textColor: PINK,                    indent: true  },
  blank:   { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  kv:      { prefix: '',   prefixColor: '',         textColor: MUTED,                   indent: false },
  section: { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  hint:    { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  err:     { prefix: '✗',  prefixColor: '#f87171',  textColor: '#f87171',               indent: false },
  raw:     { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  col2:    { prefix: '',   prefixColor: '',         textColor: MUTED,                   indent: false },
  welcome: { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  spinner: { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  choice:  { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  tpl:     { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  add:     { prefix: '+',  prefixColor: PINK, textColor: MUTED, indent: true  },
  mod:     { prefix: '~',  prefixColor: 'var(--color-amber)',  textColor: MUTED, indent: true  },
};

/* ─── stable animation targets ───────────────────────────────────── */
const ANIM_TARGET      = { opacity: 1, y: 0 } as const;
const ANIM_INIT_NEW    = { opacity: 0, y: 5 } as const;
const ANIM_INIT_BOOT   = { opacity: 1 }        as const;
const ANIM_INIT_INSTANT = { opacity: 1, y: 0 } as const; // no animation

/* ─── welcome box ────────────────────────────────────────────────── */
function WelcomeBox() {
  const timeStr = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    return `${mm}.${dd} ${hh}:${mi}`;
  }, []);

  const cell: CSSProperties = { padding: '0.4em 0.7em' };
  const vdiv: CSSProperties = { borderRight: BORDER };

  return (
    <div style={{ border: BORDER, display: 'flex', lineHeight: 1.45, userSelect: 'none', marginBottom: '0.25em' }}>
      {/* three-row grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* row 1: ·  projects  |  v1.0.1  |  powered by stripe */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', borderBottom: BORDER }}>
          <div style={{ ...cell, ...vdiv, display: 'flex', alignItems: 'center', gap: '0.45em' }}>
            <span style={{ color: PINK }}>⡜</span>
            <span style={{ color: 'var(--color-text-ui)' }}>projects</span>
          </div>
          <div style={{ ...cell, ...vdiv, color: MUTED }}>v 1.0.1</div>
          <div style={{ ...cell, color: MUTED }}>powered by stripe</div>
        </div>

        {/* row 2: current project  |  stack hint */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: BORDER }}>
          <div style={{ ...cell, ...vdiv, color: MUTED }}>
            currently working on{' '}
            <span style={{ color: 'var(--color-text-ui)' }}>vaporblaze</span>
          </div>
          <div style={{ ...cell, color: MUTED }}>
            <span style={{ color: 'var(--color-text-ui)' }}>/services status</span>{' '}to view current stack
          </div>
        </div>

        {/* row 3: commands  |  shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
          <div style={{ ...cell, ...vdiv, color: MUTED, whiteSpace: 'nowrap' }}>/ for commands</div>
          <div style={{ ...cell, color: MUTED }}>? for more info</div>
        </div>
      </div>

      {/* right column: rotated date/time */}
      <div style={{
        borderLeft:  BORDER,
        display:     'flex',
        alignItems:  'center',
        justifyContent: 'center',
        padding:     '0 0.45em',
        writingMode: 'vertical-rl',
        color:       MUTED,
        fontSize:    '0.78em',
        letterSpacing: '0.04em',
        minWidth:    '2em',
        lineHeight:  1,
      }}>
        {timeStr}
      </div>
    </div>
  );
}

/* ─── individual line renderer ────────────────────────────────────── */
const LineRow = memo(function LineRow({ line }: { line: Line }) {
  if (line.t === 'blank') {
    return <div style={{ height: '0.9em' }} />;
  }

  if (line.t === 'welcome') {
    return (
      <motion.div
        initial={line.instant ? ANIM_INIT_INSTANT : line.initial ? ANIM_INIT_BOOT : ANIM_INIT_NEW}
        animate={ANIM_TARGET}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <WelcomeBox />
      </motion.div>
    );
  }

  if (line.t === 'spinner') {
    return null;
  }

  if (line.t === 'choice') {
    return (
      <motion.div
        initial={ANIM_INIT_NEW}
        animate={ANIM_TARGET}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ display: 'flex', alignItems: 'baseline', gap: '0.6em', marginBottom: '0.15em', lineHeight: 1.75 }}
      >
        <span style={{ color: DIM, userSelect: 'none', minWidth: '3.2em', fontFamily: 'inherit', whiteSpace: 'pre' }}>{line.lkey}</span>
        <span style={{ color: 'var(--color-text-ui)' }}>{line.text}</span>
      </motion.div>
    );
  }

  if (line.t === 'tpl') {
    const tplIdx = parseInt(line.lkey ?? '1') - 1;
    const tpl    = TEMPLATES[tplIdx];
    if (!tpl) return null;
    return (
      <motion.div
        initial={line.instant ? ANIM_INIT_INSTANT : ANIM_INIT_NEW}
        animate={ANIM_TARGET}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ marginBottom: '0.5em' }}
      >
        {/* number · name · description */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9em', lineHeight: 1.75 }}>
          <span style={{ color: DIM, userSelect: 'none', minWidth: '1.4em', textAlign: 'right', flexShrink: 0 }}>{line.lkey}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9em' }}>
              <span style={{ color: PINK, minWidth: '17ch' }}>{tpl.id}</span>
              <span style={{ color: MUTED }}>{tpl.desc}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4em', paddingLeft: 'calc(17ch + 0.9em)', marginTop: '0.1em', flexWrap: 'wrap' }}>
              {tpl.services.map(svc => (
                <span key={svc.name} style={{
                  color:        DIM,
                  fontSize:     '0.72em',
                  border:       `1px solid ${DIM}`,
                  padding:      '0 0.45em',
                  lineHeight:   1.6,
                  letterSpacing:'0.02em',
                  whiteSpace:   'nowrap',
                }}>{svc.name}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const { prefix, prefixColor, textColor, indent } = LINE_PROPS[line.t];

  return (
    <motion.div
      initial={line.instant ? ANIM_INIT_INSTANT : line.initial ? ANIM_INIT_BOOT : ANIM_INIT_NEW}
      animate={ANIM_TARGET}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.65em',
        marginBottom: '0.15em',
        paddingLeft: line.t === 'cmd' ? 'clamp(0.75rem, 2.5vw, 2rem)' : indent ? '2.4em' : 0,
        paddingRight: line.t === 'cmd' ? 'clamp(0.75rem, 2.5vw, 2rem)' : 0,
        paddingTop:   line.t === 'cmd' ? '0.25em' : 0,
        paddingBottom:line.t === 'cmd' ? '0.25em' : 0,
        marginLeft:   line.t === 'cmd' ? 'calc(-1 * clamp(0.75rem, 2.5vw, 2rem))' : 0,
        marginRight:  line.t === 'cmd' ? 'calc(-1 * clamp(0.75rem, 2.5vw, 2rem))' : 0,
        background:   line.t === 'cmd' ? 'rgba(0,0,0,0.12)' : 'transparent',
        lineHeight: 1.75,
      }}
    >
      {prefix && (
        <span style={{ color: prefixColor, flexShrink: 0, userSelect: 'none', minWidth: '1ch' }}>
          {prefix}
        </span>
      )}

      {line.t === 'raw' ? (
        <span style={{ color: line.dim ? DIM : textColor, whiteSpace: 'pre-wrap' }}>{line.text}</span>
      ) : line.t === 'col2' ? (
        <span style={{ display: 'inline-grid', gridTemplateColumns: '18em 1fr', gap: '1.5em', width: '100%' }}>
          <span style={{ color: PINK }}>{line.lkey}</span>
          <span style={{ color: MUTED }}>{line.text}</span>
        </span>
      ) : line.t === 'kv' ? (
        <span style={{ display: 'inline-grid', gridTemplateColumns: '9em 1fr', gap: '1.5em', width: '100%' }}>
          <span style={{ color: PINK }}>{line.lkey}</span>
          <span style={{ color: MUTED }}>{line.text}</span>
        </span>
      ) : line.t === 'section' ? (
        <span style={{ color: DIM, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.72em' }}>
          {line.text}
        </span>
      ) : line.t === 'hint' ? (
        <span style={{ color: DIM }}>{line.text}</span>
      ) : line.initial ? (
        <TextEffect as='span' per='word' preset='fade' speedReveal={2.5} style={{ color: textColor }}>
          {line.text}
        </TextEffect>
      ) : (
        <span style={{ color: textColor }}>{line.text}</span>
      )}
    </motion.div>
  );
});

/* ─── slash command menu ─────────────────────────────────────────── */
const SlashMenu = memo(function SlashMenu({
  items,
  selectedIdx,
}: {
  items: typeof SLASH_COMMANDS;
  selectedIdx: number;
}) {
  if (items.length === 0) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.12 }}
        style={{
          position:   'absolute',
          bottom:     '100%',
          left:       0,
          right:      0,
          background: 'var(--color-surface-dark)',
          border:     BORDER,
          borderBottom: 'none',
          zIndex:     50,
          fontFamily: 'inherit',
          fontSize:   'inherit',
        }}
      >
        {items.map((item, i) => {
          const active = i === selectedIdx;
          return (
            <div
              key={item.cmd}
              style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1fr',
                gap:                 '1em',
                padding:             '0.35rem clamp(0.75rem, 2.5vw, 2rem)',
                background:          active ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft:          active ? `2px solid ${PINK}` : '2px solid transparent',
                alignItems:          'baseline',
              }}
            >
              <span style={{ color: PINK }}>{item.cmd}</span>
              <span style={{ color: MUTED, textAlign: 'right' }}>{item.desc}</span>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
});

/* ─── props ──────────────────────────────────────────────────────── */
export interface CliTerminalProps {
  /** When true: skip boot sequence, pre-fill the install command, and run
   *  a guided 2-step demo (install → init) before falling back to normal mode. */
  installDemo?: boolean;
  /** When true: auto-submit the pre-filled install command 2s after mount. */
  autoSubmit?: boolean;
  /** When set, overrides the placeholder text with "projects add <name>" */
  dragService?: string | null;
  /** Called once on the first user-initiated submit */
  onFirstSubmit?: () => void;
}

/* ─── main component ─────────────────────────────────────────────── */
export const CliTerminal = forwardRef<CliHandle, CliTerminalProps>(function CliTerminal({ installDemo = false, autoSubmit = false, dragService = null, onFirstSubmit }, ref) {
  const isMobile                = useIsMobile();
  const [lines, setLines]       = useState<Line[]>([]);
  const [value, setValue]       = useState('');
  const [menuIdx, setMenuIdx]   = useState(0);
  const [selStart, setSelStart] = useState(0);
  const [focused, setFocused]       = useState(!isMobile);
  const [showEnterHint, setShowEnterHint]     = useState(false);
  const [awaitingName, setAwaitingName]       = useState(installDemo);
  const [normalMode, setNormalMode]           = useState(!installDemo);
  const [footerAppName, setFooterAppName]     = useState('stack');
  const [placeholderService, setPlaceholderService] = useState('vercel');
  const [pendingChoiceHint, setPendingChoiceHint]   = useState<string | null>(null);
  const [commandPlaceholder, setCommandPlaceholder] = useState<string | null>(null);
  const commandPlaceholderRef = useRef<string | null>(null);
  const stackUrlRef = useRef<string | null>(null);
  const demoStepRef             = useRef(0); // 0 = pre-install, 1 = pre-init, 2+ = normal
  const pendingChoiceRef        = useRef<((key: string) => void) | null>(null);
  const appNameRef              = useRef('my-app'); // set from the init command
  const sessionServicesRef      = useRef<string[]>([]); // services added in this session
  const outputRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const historyRef              = useRef<string[]>([]);
  const histIdxRef              = useRef(-1);
  const submitCountRef          = useRef(0);  // total user submissions so far
  const firstSubmitFiredRef     = useRef(false);
  const onFirstSubmitRef        = useRef(onFirstSubmit);
  useEffect(() => { onFirstSubmitRef.current = onFirstSubmit; }, [onFirstSubmit]);

  /* sync cursor position after browser processes events */
  const syncSel = useCallback(() => {
    requestAnimationFrame(() => {
      setSelStart(inputRef.current?.selectionStart ?? 0);
    });
  }, []);

  /* expose submit imperatively so Desktop can drive the CLI */
  useImperativeHandle(ref, () => ({
    submit: (command: string) => {
      submitRef.current(command);
    },
  }));

  /* stable ref so useImperativeHandle doesn't re-run when submit changes */
  const submitRef = useRef<(cmd: string) => void>(() => {});

  /* filtered slash commands for menu — capped at 5 */
  const menuItems = value.startsWith('/')
    ? SLASH_COMMANDS.filter(s => s.cmd.startsWith(value)).slice(0, 5)
    : [];
  const menuOpen = menuItems.length > 0;

  /* reset menu selection when filtered list changes */
  useEffect(() => { setMenuIdx(0); }, [value]);

  /* progressive boot reveal — skipped in installDemo mode */
  useEffect(() => {
    if (installDemo) return;
    const ts = BOOT.map(({ showAt, ...line }) =>
      setTimeout(() => setLines(prev => [...prev, line as Line]), showAt)
    );
    return () => ts.forEach(clearTimeout);
  }, [installDemo]);

  /* cascade intro lines — naming phase handles the prompt pre-fill */
  useEffect(() => {
    if (!autoSubmit || !installDemo) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    INTRO_LINES.forEach(({ text, delay }) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, { id: uid(), t: 'done', text, initial: true }]);
      }, delay));
    });
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  /* focus input on mount so typing works immediately on desktop */
  useEffect(() => {
    if (!isMobile) inputRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* auto-scroll */
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  /* submit */
  const submit = useCallback((override?: string) => {
    const val = (override ?? value).trim();
    if (!val) return;

    // Clear any post-flow command placeholder and stack URL on submit
    if (commandPlaceholderRef.current !== null) {
      commandPlaceholderRef.current = null;
      setCommandPlaceholder(null);
    }
    if (stackUrlRef.current !== null) {
      stackUrlRef.current = null;
    }

    submitCountRef.current += 1;
    if (!firstSubmitFiredRef.current) {
      // ? → expand immediately; anything else → wait for the second submission
      if (val === '?' || submitCountRef.current >= 2) {
        firstSubmitFiredRef.current = true;
        onFirstSubmitRef.current?.();
      }
    }

    /* ── naming phase: first interaction captures the project name ── */
    if (awaitingName && val !== '?') {
      const appName = val;
      appNameRef.current = appName;
      setFooterAppName(appName);
      historyRef.current.unshift(val);
      const initCmd = `stripe projects init ${appName}`;
      setLines(prev => [...prev,
        { id: uid(), t: 'cmd',   text: val },
        { id: uid(), t: 'blank', text: '' },
        { id: uid(), t: 'step',  text: `${appName} sounds cool. let's build with stripe projects.` },
        { id: uid(), t: 'blank', text: '' },
      ]);
      setValue(initCmd);
      setSelStart(initCmd.length);
      setAwaitingName(false);
      setShowEnterHint(true);
      inputRef.current?.focus();
      return;
    }

    /* ── demo step 1: npx @stripe/projects init → interactive install flow ── */
    const initMatch = val.match(/(?:npx\s+@stripe\/projects\s+|stripe\s+)?projects\s+init(?:\s+(\S+))?/i);
    if (installDemo && demoStepRef.current === 0 && initMatch) {
      demoStepRef.current = 1;
      if (initMatch[1]) { appNameRef.current = initMatch[1]; setFooterAppName(initMatch[1]); }
      historyRef.current.unshift(val);
      const cmdLine: Line = { id: uid(), t: 'cmd', text: val };
      const stepId        = uid();
      const spinnerId     = uid();
      setLines(prev => [...prev, cmdLine]);
      setValue('');
      setSelStart(0);
      setShowEnterHint(false);
      setPendingChoiceHint(''); // blank placeholder during install animation
      setTimeout(() => {
        setLines(prev => [...prev,
          { id: stepId,    t: 'step',    text: 'installing stripe projects...' },
          { id: spinnerId, t: 'spinner', text: '' },
        ]);
        setTimeout(() => runInstallFlow(stepId, spinnerId), 1800 + Math.random() * 500);
      }, 350);
      return;
    }

    /* ── normal behaviour (with thinking delay) ── */
    historyRef.current.unshift(val);
    histIdxRef.current = -1;

    if (val.toLowerCase() === '/clear') {
      setLines([]);
      setValue('');
      setSelStart(0);
      return;
    }

    setShowEnterHint(false);

    /* ── service add: cascade sub-items one by one ── */
    const svcAddMatch = val.match(/^(?:(?:stripe\s+)?projects\s+services?\s+add|\/services\s+add)\s+(\S+)/i);
    if (svcAddMatch) {
      const svcSlug     = svcAddMatch[1].toLowerCase();
      if (!sessionServicesRef.current.includes(svcSlug)) {
        sessionServicesRef.current.push(svcSlug);
      }
      const partner     = PARTNERS.find(p => p.name.toLowerCase() === svcSlug);
      const displayName = partner?.name ?? svcSlug;
      const category    = partner?.category ?? 'service';
      setLines(prev => [...prev,
        { id: uid(), t: 'cmd',   text: val },
        { id: uid(), t: 'blank', text: '' },
        { id: uid(), t: 'step',  text: `provisioning ${displayName} for ${category}...` },
      ]);
      setValue('');
      setSelStart(0);
      const SUB_STEP = 280;
      ['allocating resources', `configuring ${category} instance`, 'generating credentials'].forEach((text, i) => {
        setTimeout(() => setLines(prev => [...prev, { id: uid(), t: 'sub', text }]), 400 + i * SUB_STEP);
      });
      setTimeout(() => {
        setLines(prev => [...prev,
          { id: uid(), t: 'done',  text: `${displayName} added to your stack` },
          { id: uid(), t: 'sub',   text: 'run env list to view new credentials' },
          { id: uid(), t: 'blank', text: '' },
        ]);
        setPlaceholderService(pickSuggestedService(sessionServicesRef.current));
      }, 400 + 3 * SUB_STEP + 200);
      return;
    }

    /* ── projects export: async URL generation ── */
    const exportMatch = val.match(/^(?:stripe\s+)?projects\s+export(?:\s+(\S+))?/i);
    if (exportMatch) {
      const exportAppName = exportMatch[1] ?? appNameRef.current;
      const services = [...sessionServicesRef.current];
      historyRef.current.unshift(val);
      histIdxRef.current = -1;
      setShowEnterHint(false);
      const exportCmdLine: Line = { id: uid(), t: 'cmd', text: val };
      const exportSpinnerId = uid();
      setLines(prev => [...prev,
        exportCmdLine,
        { id: uid(),          t: 'blank',   text: '' },
        { id: uid(),          t: 'step',    text: 'generating stack url...' },
        { id: exportSpinnerId, t: 'spinner', text: '' },
      ]);
      setValue('');
      setSelStart(0);
      fetch('/api/stacks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: exportAppName, services }),
      })
        .then(r => r.ok ? r.json() as Promise<{ code: string }> : Promise.reject(r))
        .then(({ code }) => {
          const url = `https://projects.dev/${code}`;
          setLines(prev => prev.filter(l => l.id !== exportSpinnerId).concat([
            { id: uid(), t: 'done',   text: 'your stack is ready',                      instant: true },
            { id: uid(), t: 'urlsub', text: url,                                         instant: true },
            { id: uid(), t: 'sub',    text: 'or run this command in your stripe cli:',   instant: true },
            { id: uid(), t: 'sub',    text: `stripe projects init --from ${url}`,        instant: true },
            { id: uid(), t: 'blank',  text: '',                                          instant: true },
          ]));
          stackUrlRef.current = url;
          commandPlaceholderRef.current = 'enter to open URL';
          setCommandPlaceholder('enter to open URL');
        })
        .catch(() => {
          setLines(prev => prev.filter(l => l.id !== exportSpinnerId).concat([
            { id: uid(), t: 'err',   text: 'could not generate stack url. try again.',    instant: true },
            { id: uid(), t: 'blank', text: '',                                             instant: true },
          ]));
        });
      return;
    }

    const cmdLine: Line = { id: uid(), t: 'cmd', text: val };
    const response = respond(val);

    // Informational lookups return instantly — no spinner, no delay
    const isLookup = /^(\?|help|\/help|\/shortcuts|\/why|\/contest|\/services\s+list|\/services\s+status)/i.test(val.trim());
    if (isLookup) {
      setLines(prev => [...prev, cmdLine, ...instant(response)]);
      setValue('');
      setSelStart(0);
      return;
    }

    const spinnerId = uid();
    setLines(prev => [...prev, cmdLine, { id: spinnerId, t: 'spinner', text: '' }]);
    setValue('');
    setSelStart(0);
    setTimeout(() => {
      setLines(prev => [...prev.filter(l => l.id !== spinnerId), ...instant(response)]);
    }, 1400 + Math.random() * 1200);
  }, [value, installDemo, awaitingName]);

  /* keep submitRef current so the imperative handle always calls latest */
  useEffect(() => { submitRef.current = submit; }, [submit]);

  const onKeyDown = (e: KE<HTMLInputElement>) => {
    /* ── interactive choice intercept ── */
    if (pendingChoiceRef.current) {
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        pendingChoiceRef.current(e.key); // handler clears or restores ref
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault(); // block accidental submit while waiting for choice
        return;
      }
    }

    if (menuOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuIdx(i => (i + 1) % menuItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMenuIdx(i => (i - 1 + menuItems.length) % menuItems.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = menuItems[menuIdx];
        if (selected) {
          if (selected.isGroup) {
            // Expand the group: set input to the command + space and show its sub-entries
            const expanded = selected.cmd + ' ';
            setValue(expanded);
            setSelStart(expanded.length);
            setMenuIdx(0);
          } else {
            submit(selected.cmd);
          }
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setValue('');
        setSelStart(0);
        return;
      }
    }

    if (e.key === 'Enter') {
      // If a stack URL is pending and the input is empty, open the URL in a new tab
      if (value === '' && stackUrlRef.current) {
        e.preventDefault();
        window.open(stackUrlRef.current, '_blank', 'noopener,noreferrer');
        stackUrlRef.current = null;
        setStackUrl(null);
        commandPlaceholderRef.current = null;
        setCommandPlaceholder(null);
        return;
      }
      // In normal mode with empty input, run the export command
      if (value === '' && normalMode) {
        e.preventDefault();
        submit(`stripe projects export ${footerAppName}`);
        return;
      }
      submit();
    } else if (e.key === 'ArrowRight' && value === '' && !awaitingName && pendingChoiceHint === null && placeholder) {
      // Fill input with the command placeholder so the user can edit/submit it
      e.preventDefault();
      setValue(placeholder);
      setSelStart(placeholder.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdxRef.current + 1, historyRef.current.length - 1);
      histIdxRef.current = next;
      const histVal = historyRef.current[next];
      if (histVal !== undefined) { setValue(histVal); setSelStart(histVal.length); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = next;
      const histVal = next === -1 ? '' : (historyRef.current[next] ?? '');
      setValue(histVal);
      setSelStart(histVal.length);
    } else {
      syncSel();
    }
  };

  /* ── install demo flow ── act 1: installing → act 2: choose path ──
     All setLines calls use functional updates so no stale closures.
     pendingChoiceRef handlers clear themselves when a valid key is received. */

  function runInstallFlow(stepId: number, spinnerId: number) {
    // Update the step line in-place (no remove+re-add) so it doesn't jump,
    // then drop only the spinner.
    setLines(prev => prev
      .filter(l => l.id !== spinnerId)
      .map(l => l.id === stepId ? { ...l, t: 'done' as LT, text: 'stripe projects installed' } : l)
      .concat([{ id: uid(), t: 'blank', text: '' }])
    );
    setTimeout(showChoosePath, 400);
  }

  function showChoosePath() {
    setLines(prev => [...prev,
      { id: uid(), t: 'hint',   text: 'how do you want to build?' },
      { id: uid(), t: 'choice', lkey: '└ 1  ', text: 'use a starter template' },
      { id: uid(), t: 'choice', lkey: '  2  ', text: 'start with a blank project' },
    ]);
    setPendingChoiceHint('choose 1 or 2');
    inputRef.current?.focus();
    pendingChoiceRef.current = (key: string) => {
      if (key === '1') {
        pendingChoiceRef.current = null;
        setPendingChoiceHint(''); // blank while showTemplates loads
        setLines(prev => [...prev, { id: uid(), t: 'cmd', text: '1' }]);
        setTimeout(showTemplates, 300);
      } else if (key === '2') {
        pendingChoiceRef.current = null;
        setPendingChoiceHint(null); // back to normal mode
        setLines(prev => [...prev,
          { id: uid(), t: 'cmd',   text: '2' },
          { id: uid(), t: 'blank', text: '' },
          { id: uid(), t: 'hint',  text: 'run services add <name> to provision services individually' },
          { id: uid(), t: 'blank', text: '' },
        ]);
        demoStepRef.current = 2; // normal terminal mode
        setNormalMode(true);
      }
      // invalid key → do nothing, ref stays set
    };
  }

  function showTemplates() {
    setLines(prev => [...prev,
      { id: uid(), t: 'hint', text: 'choose a starter template:' },
      { id: uid(), t: 'blank', text: '' },
      ...TEMPLATES.map((_, i) => ({
        id: uid(), t: 'tpl' as LT, lkey: String(i + 1), text: '',
      })),
    ]);
    setPendingChoiceHint('choose a template');
    inputRef.current?.focus();
    pendingChoiceRef.current = (key: string) => {
      const idx = parseInt(key) - 1;
      if (idx >= 0 && idx < TEMPLATES.length) {
        pendingChoiceRef.current = null;
        setPendingChoiceHint(''); // blank while provisioning runs
        const tpl = TEMPLATES[idx];
        setLines(prev => [...prev,
          { id: uid(), t: 'cmd',   text: key },
          { id: uid(), t: 'blank', text: '' },
        ]);
        provisionNext(tpl.services, 0);
      }
      // invalid key → do nothing
    };
  }

  function provisionNext(services: TplService[], idx: number) {
    if (idx >= services.length) {
      // All done — show final summary and update placeholder to export command
      const name        = appNameRef.current;
      const serviceList = services.map(s => s.name.toLowerCase()).join(', ');
      setLines(prev => [...prev,
        { id: uid(), t: 'done',  text: `${name} is fully provisioned` },
        { id: uid(), t: 'sub',   text: `running ${serviceList}` },
        { id: uid(), t: 'sub',   text: 'stripe projects status to view tech stack' },
      ]);
      const exportCmd = `stripe projects export ${name}`;
      commandPlaceholderRef.current = exportCmd;
      setCommandPlaceholder(exportCmd);
      setPlaceholderService(pickSuggestedService(services.map(s => s.name)));
      setPendingChoiceHint(null);
      setNormalMode(true);
      return;
    }
    const svc    = services[idx];
    const stepId = uid();
    const spinId = uid();
    setLines(prev => [...prev,
      { id: stepId, t: 'step',    text: `provisioning ${svc.name} for ${svc.category}...` },
      { id: spinId, t: 'spinner', text: '' },
    ]);
    setTimeout(() => {
      const costLabel = svc.cost === 0 ? '$0/mo' : `$${svc.cost}/mo`;
      const SUB_STEP  = 220;
      const subs      = [
        'allocated resources',
        `configured ${svc.category} instance`,
        'generated credentials',
        'updated stack configuration',
      ];
      // Swap spinner → step header
      setLines(prev => [
        ...prev.filter(l => l.id !== stepId && l.id !== spinId),
        { id: uid(), t: 'step', instant: true, text: `provisioning ${svc.name} for ${svc.category}.` },
      ]);
      // Cascade sub-items
      subs.forEach((text, i) => {
        setTimeout(() => setLines(prev => [...prev, { id: uid(), t: 'sub', text }]), (i + 1) * SUB_STEP);
      });
      // Summary block after subs
      const summaryDelay = (subs.length + 1) * SUB_STEP;
      setTimeout(() => {
        setLines(prev => [...prev,
          { id: uid(), t: 'blank', instant: true, text: '' },
          { id: uid(), t: 'done',  instant: true, text: `${svc.name} provisioned and added to your project.` },
          { id: uid(), t: 'add',   instant: true, text: `account created · ${svc.tier} tier · ${costLabel}` },
          { id: uid(), t: 'add',   instant: true, text: `injected ${svc.envVars} environment variables` },
          { id: uid(), t: 'mod',   instant: true, text: 'modified stack.yaml' },
          { id: uid(), t: 'mod',   instant: true, text: 'modified .env' },
          { id: uid(), t: 'blank', instant: true, text: '' },
        ]);
        setTimeout(() => provisionNext(services, idx + 1), 500);
      }, summaryDelay);
    }, 1500 + Math.random() * 700);
  }

  /* pick a suggested service not already in usedNames */
  function pickSuggestedService(usedNames: string[]): string {
    const used = new Set(usedNames.map(n => n.toLowerCase()));
    const available = SERVICE_OPTIONS.filter(s => !used.has(s.name));
    return available.length > 0
      ? available[Math.floor(Math.random() * available.length)].name
      : 'stripe';
  }

  /* current placeholder text — shared between render and onKeyDown.
     pendingChoiceHint null  → use computed service/name placeholder (normal mode)
     pendingChoiceHint ''    → show blank (between choice steps)
     pendingChoiceHint other → show that choice hint
     commandPlaceholder      → override with a specific command suggestion */
  const placeholder = pendingChoiceHint !== null
    ? pendingChoiceHint
    : commandPlaceholder !== null
      ? commandPlaceholder
      : awaitingName
      ? 'give your project a name'
      : dragService
        ? `stripe projects services add ${dragService.toLowerCase()}`
        : `stripe projects services add ${placeholderService}`;

  return (
    <div
      className='font-mono'
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── output area ──────────────────────────────────────────── */}
      <div
        ref={outputRef}
        style={{
          flex:          1,
          overflowY:     'auto',
          display:       'flex',
          flexDirection: 'column',
          scrollbarWidth:'none',
          fontSize:      '14px',
        }}
      >
        <div style={{ flex: 1 }} />
        <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.75rem, 2.5vw, 2rem)' }}>
          {lines.map(line => (
            <LineRow key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* ── input + footer section ─────────────────────────────────── */}
      <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.12)' }}>
        {/* input row (relative so menu can anchor to it) */}
        <div style={{ position: 'relative' }}>
          {menuOpen && <SlashMenu items={menuItems} selectedIdx={menuIdx} />}
          <div
            onClick={() => { inputRef.current?.focus(); }}
            style={{
              borderTop: BORDER,
              padding:   'clamp(0.6rem, 1.2vw, 0.9rem) clamp(0.75rem, 2.5vw, 2rem)',
              display:   'flex',
              alignItems:'center',
              gap:       '0.75rem',
              fontSize:  '14px',
              cursor:    'text',
            }}
          >
            <span style={{ color: PINK, userSelect: 'none', flexShrink: 0 }}>›</span>

            {/* text display + block cursor overlay over a transparent input */}
            <div style={{ flex: 1, position: 'relative', lineHeight: '1.4' }}>
              {/* rendered text with block cursor — pointer-events: none so input stays clickable */}
              <div
                aria-hidden
                style={{
                  position:      'absolute',
                  inset:         0,
                  display:       'flex',
                  alignItems:    'center',
                  pointerEvents: 'none',
                  whiteSpace:    'pre',
                  overflow:      'hidden',
                }}
              >
                {value === '' ? (
                  /* placeholder area — always show pink cursor when focused */
                  placeholder ? (
                    /* normal: cursor on first char + dim rest */
                    <>
                      {focused ? (
                        <>
                          <span style={{
                            display:    'inline-block',
                            minWidth:   '0.6em',
                            background: PINK,
                            color:      'var(--color-surface-dark)',
                            flexShrink: 0,
                            textAlign:  'center',
                          }}>{placeholder[0]}</span>
                          <span style={{ color: DIM }}>{placeholder.slice(1)}</span>
                        </>
                      ) : (
                        <span style={{ color: DIM }}>{placeholder}</span>
                      )}
                    </>
                  ) : focused ? (
                    /* blank placeholder but still show cursor block */
                    <span style={{
                      display:    'inline-block',
                      minWidth:   '0.6em',
                      background: PINK,
                      flexShrink: 0,
                    }}>&nbsp;</span>
                  ) : null
                ) : (
                  /* text before cursor | block cursor | text after cursor */
                  <>
                    <span style={{ color: 'var(--color-text-ui)' }}>{value.slice(0, selStart)}</span>
                    {focused ? (
                      <span style={{
                        display:    'inline-block',
                        minWidth:   '0.6em',
                        background: PINK,
                        color:      'var(--color-surface-dark)',
                        flexShrink: 0,
                        textAlign:  'center',
                      }}>
                        {value[selStart] ?? '\u00a0'}
                      </span>
                    ) : (
                      /* unfocused: no cursor, just show char normally */
                      <span style={{ color: 'var(--color-text-ui)' }}>{value[selStart] ?? ''}</span>
                    )}
                    <span style={{ color: 'var(--color-text-ui)' }}>{value.slice(selStart + 1)}</span>
                  </>
                )}
              </div>

              {/* transparent input — captures all keyboard + mouse input */}
              <input
                ref={inputRef}
                value={value}
                onChange={e => { setValue(e.target.value); syncSel(); }}
                onKeyDown={onKeyDown}
                onSelect={syncSel}
                onFocus={() => { setFocused(true); syncSel(); }}
                onBlur={() => setFocused(false)}
                autoFocus={!isMobile}
                autoComplete='off'
                autoCorrect='off'
                spellCheck={false}
                className='cli-input'
                style={{
                  display:      'block',
                  width:        '100%',
                  background:   'transparent',
                  border:       'none',
                  outline:      'none',
                  color:        'transparent',
                  caretColor:   'transparent',
                  fontFamily:   'inherit',
                  fontSize:     'inherit',
                  letterSpacing:'inherit',
                  padding:      0,
                  margin:       0,
                  cursor:       'text',
                  /* give it a line-height so the container has natural height */
                  lineHeight:   '1.4',
                }}
              />
            </div>
          </div>
        </div>

        {/* pinned footer */}
        <div
          style={{
            borderTop:      '1px solid var(--color-border-subtle)',
            padding:        '0.35rem clamp(0.75rem, 2.5vw, 2rem)',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            fontSize:       '11px',
            color:          DIM,
            userSelect:     'none',
          }}
        >
          {(showEnterHint || value.length > 0)
            ? <span>enter to submit</span>
            : normalMode
              ? <span>stripe projects export {footerAppName}</span>
              : null}
          <span style={{ marginLeft: 'auto' }}>? for more info</span>
        </div>
      </div>
    </div>
  );
});
