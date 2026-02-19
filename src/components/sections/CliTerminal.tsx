import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent as KE,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextEffect } from '@/components/ui/text-effect';
import { PARTNERS } from '@/components/sections/Partners';

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
type LT = 'cmd' | 'step' | 'sub' | 'done' | 'url' | 'blank' | 'kv' | 'section' | 'hint' | 'err' | 'raw' | 'col2';

interface Line {
  id: number;
  t: LT;
  text: string;
  lkey?: string;   // key column for kv / col2 lines
  initial?: boolean;
  dim?: boolean;   // for raw lines that should use DIM color
}

/* ─── uid counter ────────────────────────────────────────────────── */
let _uid = 100;
const uid = () => _uid++;

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

/* ─── welcome table ──────────────────────────────────────────────── */
const W = 46; // inner width of the box
const border_top = '╔' + '═'.repeat(W) + '╗';
const border_bot = '╚' + '═'.repeat(W) + '╝';
const row = (text: string) => '║  ' + text.padEnd(W - 2) + '║';

/* ─── boot sequence ──────────────────────────────────────────────── */
const BOOT: Array<Line & { showAt: number }> = [
  // welcome table
  { id: 0,  t: 'raw',   text: border_top,                                             dim: true, showAt: 0    },
  { id: 1,  t: 'raw',   text: row('stripe projects  ·  v1.0.0'),                      dim: true, showAt: 60   },
  { id: 2,  t: 'raw',   text: row('unified developer infrastructure'),                 dim: true, showAt: 60   },
  { id: 3,  t: 'raw',   text: border_bot,                                             dim: true, showAt: 60   },
  { id: 4,  t: 'blank', text: '',                                                                showAt: 200  },
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

  /* ── projects service add <name>  OR  /services add <name> ── */
  const addMatch = raw.match(/^(?:projects\s+service(?:s)?\s+add|\/services\s+add)\s+(\S+)/i);
  if (addMatch) {
    const svcSlug    = addMatch[1].toLowerCase();
    const partner    = PARTNERS.find(p => p.name.toLowerCase() === svcSlug);
    const displayName = partner?.name ?? svcSlug;
    const category   = partner?.category ?? 'service';
    return [
      { id: uid(), t: 'blank', text: '' },
      { id: uid(), t: 'step',  text: `provisioning ${displayName}...` },
      { id: uid(), t: 'sub',   text: 'allocating resources' },
      { id: uid(), t: 'sub',   text: `configuring ${category} instance` },
      { id: uid(), t: 'sub',   text: 'generating credentials' },
      { id: uid(), t: 'done',  text: `${displayName} added to your stack` },
      { id: uid(), t: 'blank', text: '' },
      { id: uid(), t: 'hint',  text: 'run env list to view new credentials' },
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
  cmd:     { prefix: '$',  prefixColor: PINK,       textColor: 'var(--color-text-ui)',  indent: false },
  step:    { prefix: '·',  prefixColor: MUTED,      textColor: 'var(--color-text-ui)',  indent: false },
  sub:     { prefix: '↳',  prefixColor: DIM,        textColor: MUTED,                   indent: true  },
  done:    { prefix: '✓',  prefixColor: '#4ade80',  textColor: 'var(--color-text-ui)',  indent: false },
  url:     { prefix: '▸',  prefixColor: PINK,       textColor: PINK,                    indent: false },
  blank:   { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  kv:      { prefix: '',   prefixColor: '',         textColor: MUTED,                   indent: false },
  section: { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  hint:    { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  err:     { prefix: '✗',  prefixColor: '#f87171',  textColor: '#f87171',               indent: false },
  raw:     { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  col2:    { prefix: '',   prefixColor: '',         textColor: MUTED,                   indent: false },
};

/* ─── stable animation targets ───────────────────────────────────── */
const ANIM_TARGET     = { opacity: 1, y: 0 } as const;
const ANIM_INIT_NEW   = { opacity: 0, y: 5 } as const;
const ANIM_INIT_BOOT  = { opacity: 1 }        as const;

/* ─── individual line renderer ────────────────────────────────────── */
const LineRow = memo(function LineRow({ line }: { line: Line }) {
  if (line.t === 'blank') {
    return <div style={{ height: '0.9em' }} />;
  }

  const { prefix, prefixColor, textColor, indent } = LINE_PROPS[line.t];

  return (
    <motion.div
      initial={line.initial ? ANIM_INIT_BOOT : ANIM_INIT_NEW}
      animate={ANIM_TARGET}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.65em',
        marginBottom: '0.15em',
        paddingLeft: indent ? '2.4em' : 0,
        lineHeight: 1.75,
      }}
    >
      {prefix && (
        <span style={{ color: prefixColor, flexShrink: 0, userSelect: 'none', minWidth: '1ch' }}>
          {prefix}
        </span>
      )}

      {line.t === 'raw' ? (
        <span style={{ color: line.dim ? DIM : textColor, whiteSpace: 'pre' }}>{line.text}</span>
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
        <span style={{ color: DIM, fontStyle: 'italic' }}>{line.text}</span>
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
                display:         'grid',
                gridTemplateColumns: '12em 1fr',
                gap:             '1em',
                padding:         '0.35rem clamp(1.5rem, 5vw, 4rem)',
                background:      active ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft:      active ? `2px solid ${PINK}` : '2px solid transparent',
              }}
            >
              <span style={{ color: PINK }}>{item.cmd}</span>
              <span style={{ color: MUTED }}>{item.desc}</span>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
});

/* ─── main component ─────────────────────────────────────────────── */
export const CliTerminal = forwardRef<CliHandle>(function CliTerminal(_, ref) {
  const [lines, setLines]       = useState<Line[]>([]);
  const [value, setValue]       = useState('');
  const [menuIdx, setMenuIdx]   = useState(0);
  const outputRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const historyRef              = useRef<string[]>([]);
  const histIdxRef              = useRef(-1);

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

  /* progressive boot reveal */
  useEffect(() => {
    const ts = BOOT.map(({ showAt, ...line }) =>
      setTimeout(() => setLines(prev => [...prev, line as Line]), showAt)
    );
    return () => ts.forEach(clearTimeout);
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

    historyRef.current.unshift(val);
    histIdxRef.current = -1;

    if (val.toLowerCase() === '/clear') {
      setLines([]);
      setValue('');
      return;
    }

    const cmdLine: Line = { id: uid(), t: 'cmd', text: val };
    setLines(prev => [...prev, cmdLine, ...respond(val)]);
    setValue('');
  }, [value]);

  /* keep submitRef current so the imperative handle always calls latest */
  useEffect(() => { submitRef.current = submit; }, [submit]);

  const onKeyDown = (e: KE<HTMLInputElement>) => {
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
            setValue(selected.cmd + ' ');
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
        return;
      }
    }

    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdxRef.current + 1, historyRef.current.length - 1);
      histIdxRef.current = next;
      if (historyRef.current[next] !== undefined) setValue(historyRef.current[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = next;
      setValue(next === -1 ? '' : (historyRef.current[next] ?? ''));
    }
  };

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
        <div style={{ padding: 'clamp(1.75rem, 5vw, 2.5rem) clamp(1.5rem, 5vw, 4rem)' }}>
          {lines.map(line => (
            <LineRow key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* ── input row (relative so menu can anchor to it) ─────────── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {menuOpen && <SlashMenu items={menuItems} selectedIdx={menuIdx} />}
        <div
          style={{
            borderTop: BORDER,
            padding:   'clamp(0.8rem, 1.5vw, 1.1rem) clamp(1.5rem, 5vw, 4rem)',
            display:   'flex',
            alignItems:'center',
            gap:       '0.75rem',
            fontSize:  '14px',
          }}
        >
          <span style={{ color: PINK, userSelect: 'none', flexShrink: 0 }}>›</span>
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            placeholder='type /help for commands'
            className='cli-input'
            style={{
              flex:        1,
              background:  'transparent',
              border:      'none',
              outline:     'none',
              color:       'var(--color-text-ui)',
              fontFamily:  'inherit',
              fontSize:    'inherit',
              caretColor:  PINK,
              letterSpacing:'inherit',
            }}
          />
        </div>
      </div>
    </div>
  );
});
