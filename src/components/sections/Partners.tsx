import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle, type PointerEvent as RPE } from 'react';
import { motion } from 'motion/react';
import { InView } from '@/components/ui/in-view';

type Category = 'payments' | 'auth' | 'database' | 'storage' | 'monitoring' | 'analytics' | 'ai' | 'hosting';

export interface Partner {
  name:            string;
  category:        Category;
  url:             string;
  logo:            React.FC<{ className?: string }>;
  description:     string;
  longDescription: string;
  cliCommand:      string;
  /** logo is white on transparent — needs invert on light themes */
  lightInvert?:    boolean;
}

/* ── Logos — official marks, no background boxes ─────────────────────────── */

// Stripe: inlined from /public/stripe-logo.svg with brand fill
const StripeLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 16L16 12.6069V0L0 3.43278V16Z" fill="#726CF7" />
  </svg>
);

// Clerk — Simple Icons, brand colour #6C47FF
const ClerkLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='#6C47FF'>
    <path d='m21.47 20.829-2.881-2.881a.572.572 0 0 0-.7-.084 6.854 6.854 0 0 1-7.081 0 .576.576 0 0 0-.7.084l-2.881 2.881a.576.576 0 0 0-.103.69.57.57 0 0 0 .166.186 12 12 0 0 0 14.113 0 .58.58 0 0 0 .239-.423.576.576 0 0 0-.172-.453Zm.002-17.668-2.88 2.88a.569.569 0 0 1-.701.084A6.857 6.857 0 0 0 8.724 8.08a6.862 6.862 0 0 0-1.222 3.692 6.86 6.86 0 0 0 .978 3.764.573.573 0 0 1-.083.699l-2.881 2.88a.567.567 0 0 1-.864-.063A11.993 11.993 0 0 1 6.771 2.7a11.99 11.99 0 0 1 14.637-.405.566.566 0 0 1 .232.418.57.57 0 0 1-.168.448Zm-7.118 12.261a3.427 3.427 0 1 0 0-6.854 3.427 3.427 0 0 0 0 6.854Z'/>
  </svg>
);

// Supabase — Simple Icons, brand gradient
const SupabaseLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none'>
    <path fill='url(#sb-g2)' d='M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z'/>
    <defs>
      <linearGradient id='sb-g2' x1='1' y1='1' x2='22' y2='22' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#249361'/>
        <stop offset='1' stopColor='#3ECF8E'/>
      </linearGradient>
    </defs>
  </svg>
);

// PostHog — Simple Icons, brand colour #F54E00
const PostHogLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='#F54E00'>
    <path d='M9.854 14.5 5 9.647.854 5.5A.5.5 0 0 0 0 5.854V8.44a.5.5 0 0 0 .146.353L5 13.647l.147.146L9.854 18.5l.146.147v-.049c.065.03.134.049.207.049h2.586a.5.5 0 0 0 .353-.854L9.854 14.5zm0-5-4-4a.487.487 0 0 0-.409-.144.515.515 0 0 0-.356.21.493.493 0 0 0-.089.288V8.44a.5.5 0 0 0 .147.353l9 9a.5.5 0 0 0 .853-.354v-2.585a.5.5 0 0 0-.146-.354l-5-5zm1-4a.5.5 0 0 0-.854.354V8.44a.5.5 0 0 0 .147.353l4 4a.5.5 0 0 0 .853-.354V9.854a.5.5 0 0 0-.146-.354l-4-4zm12.647 11.515a3.863 3.863 0 0 1-2.232-1.1l-4.708-4.707a.5.5 0 0 0-.854.354v6.585a.5.5 0 0 0 .5.5H23.5a.5.5 0 0 0 .5-.5v-.6c0-.276-.225-.497-.499-.532zm-5.394.032a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zM.854 15.5a.5.5 0 0 0-.854.354v2.293a.5.5 0 0 0 .5.5h2.293c.222 0 .39-.135.462-.309a.493.493 0 0 0-.109-.545L.854 15.501zM5 14.647.854 10.5a.5.5 0 0 0-.854.353v2.586a.5.5 0 0 0 .146.353L4.854 18.5l.146.147h2.793a.5.5 0 0 0 .353-.854L5 14.647z'/>
  </svg>
);

// Neon — official N mark from neon.tech brand SVG, brand colour #34D59A
const NeonLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 27.542 28' fill='none'>
    <path fill='#34D59A' fillRule='evenodd' d='M27.542.008V28l-10.747-9.508v9.323H0V0zM3.376 24.439H13.42V11.084l10.747 9.508V3.382l-20.79-.005z'/>
  </svg>
);

// Sentry — white fill for dark backgrounds
const SentryLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M13.91 2.505c-.873-1.448-2.972-1.448-3.844 0L6.904 7.92a15.478 15.478 0 0 1 8.53 12.811h-2.221A13.301 13.301 0 0 0 5.784 9.814l-2.926 5.06a7.65 7.65 0 0 1 4.435 5.848H2.194a.365.365 0 0 1-.298-.534l1.413-2.402a5.16 5.16 0 0 0-1.614-.913L.296 19.275a2.182 2.182 0 0 0 .812 2.999 2.24 2.24 0 0 0 1.086.288h6.983a9.322 9.322 0 0 0-3.845-8.318l1.11-1.922a11.47 11.47 0 0 1 4.95 10.24h5.915a17.242 17.242 0 0 0-7.885-15.28l2.244-3.845a.37.37 0 0 1 .504-.13c.255.14 9.75 16.708 9.928 16.9a.365.365 0 0 1-.327.543h-2.287c.029.612.029 1.223 0 1.831h2.297a2.206 2.206 0 0 0 1.922-3.31z'/>
  </svg>
);

// Chroma — official two-circle mark from trychroma.com, no background
const ChromaLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 2 52.5 36' fill='none'>
    <path d='M17.503 2.501c-9.665 0-17.5 7.835-17.5 17.5s7.835 17.5 17.5 17.5 17.5-7.835 17.5-17.5-7.835-17.5-17.5-17.5z' fill='#327EFF'/>
    <path d='M35.003 2.501c-9.665 0-17.5 7.835-17.5 17.5s7.835 17.5 17.5 17.5 17.5-7.834 17.5-17.5c0-9.665-7.835-17.5-17.5-17.5z' fill='#FFDE2D'/>
    <path d='M17.503 20.002c0-9.665 7.835-17.5 17.5-17.5v17.5h-17.5z' fill='#FF6446'/>
    <path d='M35.003 20.001c0 9.665-7.835 17.5-17.5 17.5v-17.5h17.5z' fill='#FF6446'/>
  </svg>
);

// PlanetScale — Simple Icons, white (brand is black, inverted for dark bg)
const PlanetScaleLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z'/>
  </svg>
);

// Railway — Simple Icons, white (brand is black, inverted for dark bg)
const RailwayLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M.113 10.27A13.026 13.026 0 000 11.48h18.23c-.064-.125-.15-.237-.235-.347-3.117-4.027-4.793-3.677-7.19-3.78-.8-.034-1.34-.048-4.524-.048-1.704 0-3.555.005-5.358.01-.234.63-.459 1.24-.567 1.737h9.342v1.216H.113v.002zm18.26 2.426H.009c.02.326.05.645.094.961h16.955c.754 0 1.179-.429 1.315-.96zm-17.318 4.28s2.81 6.902 10.93 7.024c4.855 0 9.027-2.883 10.92-7.024H1.056zM11.988 0C7.5 0 3.593 2.466 1.531 6.108l4.75-.005v-.002c3.71 0 3.849.016 4.573.047l.448.016c1.563.052 3.485.22 4.996 1.364.82.621 2.007 1.99 2.712 2.965.654.902.842 1.94.396 2.934-.408.914-1.289 1.458-2.353 1.458H.391s.099.42.249.886h22.748A12.026 12.026 0 0024 12.005C24 5.377 18.621 0 11.988 0z'/>
  </svg>
);

// Vercel — Simple Icons, white (brand is black, inverted for dark bg)
const VercelLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='m12 1.608 12 20.784H0Z'/>
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────────────── */

export const PARTNERS: Partner[] = [
  {
    name: 'Stripe', category: 'payments', url: 'https://stripe.com', logo: StripeLogo,
    description: 'Payments infrastructure',
    longDescription: 'Accept one-time payments, subscriptions, and invoices from day one. Stripe is pre-wired — no boilerplate required. Used by millions of businesses worldwide.',
    cliCommand: 'projects service add stripe',
  },
  {
    name: 'PlanetScale', category: 'database', url: 'https://planetscale.com', logo: PlanetScaleLogo, lightInvert: true,
    description: 'Serverless MySQL platform',
    longDescription: 'MySQL-compatible serverless database with non-blocking schema changes, automatic sharding, and branching workflows built for modern development teams.',
    cliCommand: 'projects service add planetscale',
  },
  {
    name: 'Supabase', category: 'storage', url: 'https://supabase.com', logo: SupabaseLogo,
    description: 'Open source Firebase alt.',
    longDescription: 'Open-source Firebase alternative with Postgres, realtime subscriptions, file storage, and auto-generated APIs. Fully managed and infinitely scalable.',
    cliCommand: 'projects service add supabase',
  },
  {
    name: 'Railway', category: 'hosting', url: 'https://railway.app', logo: RailwayLogo, lightInvert: true,
    description: 'Infrastructure for devs',
    longDescription: 'Deploy servers, databases, and cron jobs with zero ops overhead. Railway handles provisioning, networking, and scaling so you can stay focused on code.',
    cliCommand: 'projects service add railway',
  },
  {
    name: 'Neon', category: 'database', url: 'https://neon.tech', logo: NeonLogo,
    description: 'Serverless Postgres',
    longDescription: 'Serverless Postgres with autoscaling to zero, database branching, and a generous free tier. Spin up a new branch for every PR automatically.',
    cliCommand: 'projects service add neon',
  },
  {
    name: 'Chroma', category: 'ai', url: 'https://trychroma.com', logo: ChromaLogo,
    description: 'AI-native vector database',
    longDescription: 'The open-source embedding database for AI applications. Store, search, and manage vector embeddings at any scale, with a simple Python and JavaScript API.',
    cliCommand: 'projects service add chroma',
  },
  {
    name: 'Sentry', category: 'monitoring', url: 'https://sentry.io', logo: SentryLogo, lightInvert: true,
    description: 'Error monitoring',
    longDescription: 'Catch errors before your users do. Sentry provides full-stack error monitoring, performance tracing, and alerting — all pre-configured with zero setup.',
    cliCommand: 'projects service add sentry',
  },
  {
    name: 'Clerk', category: 'auth', url: 'https://clerk.dev', logo: ClerkLogo,
    description: 'Auth & user management',
    longDescription: 'Drop-in authentication with social login, magic links, MFA, and full user management UI. Works out of the box with zero configuration.',
    cliCommand: 'projects service add clerk',
  },
  {
    name: 'PostHog', category: 'analytics', url: 'https://posthog.com', logo: PostHogLogo,
    description: 'Product analytics',
    longDescription: 'Self-hostable product analytics with event capture, session replay, feature flags, and A/B testing. Everything you need to understand and improve your product.',
    cliCommand: 'projects service add posthog',
  },
  {
    name: 'Vercel', category: 'hosting', url: 'https://vercel.com', logo: VercelLogo, lightInvert: true,
    description: 'Frontend cloud platform',
    longDescription: 'Deploy frontend apps to the edge with automatic CI/CD, edge functions, and global CDN distribution. Seamless integration with Next.js and all major frameworks.',
    cliCommand: 'projects service add vercel',
  },
];


function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    payments:   '#635BFF',
    auth:       '#6C47FF',
    database:   '#22c55e',
    storage:    '#3ECF8E',
    monitoring: '#ef4444',
    analytics:  '#F54E00',
    ai:         '#FF6B35',
    hosting:    '#00b3d4',
  };
  return colors[category];
}

/* ── EcosystemIcons ──────────────────────────────────────────────────────────
   Desktop window content: draggable app-icon grid of partners.
   Double-click an icon → onOpen(partner) to open a detail window.
─────────────────────────────────────────────────────────────────────────── */

const ICON_W    = 80;            // cell width — wide enough for longest label
const ICON_BOX  = 32;            // icon render size (px)
const HIGHLIGHT = ICON_BOX + 16; // highlight box = icon + 8px padding each side
const GAP_X     = 40;            // horizontal gap between icon cells
const GAP_Y     = 40;            // vertical gap between icon rows
const PAD       = 40;            // padding inside window on all sides
const COLS    = 4;

export interface EcosystemHandle {
  shuffle:            () => void;
  resetIconPosition:  (name: string) => void;
}

function makeGridPositions(partners: Partner[]): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {};
  partners.forEach((p, i) => {
    out[p.name] = {
      x: PAD + (i % COLS) * (ICON_W + GAP_X),
      y: PAD + Math.floor(i / COLS) * (HIGHLIGHT + 16 + 14 + GAP_Y), // highlight + gap + label + row gap
    };
  });
  return out;
}

export interface EcosystemIconsProps {
  onOpen:             (p: Partner) => void;
  onCrossDragStart?:  (p: Partner) => void;
  onCrossDragMove?:   (x: number, y: number) => void;
  onCrossDragEnd?:    (p: Partner, x: number, y: number) => void;
}

export const EcosystemIcons = forwardRef<EcosystemHandle, EcosystemIconsProps>(
  function EcosystemIcons({ onOpen, onCrossDragStart, onCrossDragMove, onCrossDragEnd }, ref) {
    const [order,        setOrder]        = useState<Partner[]>(PARTNERS);
    const [positions,    setPositions]    = useState(() => makeGridPositions(PARTNERS));
    const [dragging,     setDragging]     = useState<string | null>(null);
    const [selected,     setSelected]     = useState<number | null>(null);
    const [displaySlots, setDisplaySlots] = useState<Partner[]>(PARTNERS);
    const [isShuffling,  setIsShuffling]  = useState(false);
    const shuffleTimers  = useRef<ReturnType<typeof setTimeout>[]>([]);
    const containerRef   = useRef<HTMLDivElement>(null);

    useEffect(() => () => {
      shuffleTimers.current.forEach(id => { clearTimeout(id); clearInterval(id as unknown as ReturnType<typeof setInterval>); });
    }, []);

    /* ── shuffle: cascade slot-machine animation ─────────────── */
    const shuffle = useCallback(() => {
      // Cancel any in-progress shuffle
      shuffleTimers.current.forEach(id => { clearTimeout(id); clearInterval(id as unknown as ReturnType<typeof setInterval>); });
      shuffleTimers.current = [];

      const nextOrder = [...PARTNERS].sort(() => Math.random() - 0.5);
      const n = PARTNERS.length;

      setIsShuffling(true);
      setSelected(null);
      // Seed displaySlots from current order so positions don't jump
      setDisplaySlots([...order]);

      const STAGGER       = 150; // ms between each slot starting
      const CYCLE_DURATION = 480; // ms each slot spins before settling
      const CYCLE_SPEED   = 70;  // ms between random icon swaps

      for (let i = 0; i < n; i++) {
        const startAt = i * STAGGER;
        const endAt   = startAt + CYCLE_DURATION;

        let cycleInterval: ReturnType<typeof setInterval>;

        const startId = setTimeout(() => {
          cycleInterval = setInterval(() => {
            const rand = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];
            setDisplaySlots(prev => { const s = [...prev]; s[i] = rand; return s; });
          }, CYCLE_SPEED);
          shuffleTimers.current.push(cycleInterval as unknown as ReturnType<typeof setTimeout>);
        }, startAt);

        const endId = setTimeout(() => {
          clearInterval(cycleInterval);
          setDisplaySlots(prev => { const s = [...prev]; s[i] = nextOrder[i]; return s; });

          if (i === n - 1) {
            setOrder(nextOrder);
            setPositions(makeGridPositions(nextOrder));
            setIsShuffling(false);
          }
        }, endAt);

        shuffleTimers.current.push(startId, endId);
      }
    }, [order]);

    const resetIconPosition = useCallback((name: string) => {
      setPositions(prev => {
        const gridPos = makeGridPositions(order)[name];
        if (!gridPos) return prev;
        return { ...prev, [name]: gridPos };
      });
    }, [order]);

    useImperativeHandle(ref, () => ({ shuffle, resetIconPosition }), [shuffle, resetIconPosition]);

    /* ── drag ─────────────────────────────────────────────────── */
    function startDrag(e: RPE<HTMLDivElement>, name: string) {
      if (e.button !== 0 || isShuffling) return;
      e.preventDefault();
      e.stopPropagation();
      setDragging(name);
      const partner = order.find(p => p.name === name)!;
      onCrossDragStart?.(partner);
      const sx = e.clientX, sy = e.clientY;
      const sp = { ...positions[name] };
      function onMove(ev: globalThis.PointerEvent) {
        setPositions(prev => ({ ...prev, [name]: { x: sp.x + ev.clientX - sx, y: sp.y + ev.clientY - sy } }));
        onCrossDragMove?.(ev.clientX, ev.clientY);
      }
      function onUp(ev: globalThis.PointerEvent) {
        setDragging(null);
        onCrossDragEnd?.(partner, ev.clientX, ev.clientY);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup',   onUp);
      }
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup',   onUp);
    }

    /* ── keyboard navigation ──────────────────────────────────── */
    function handleKeyDown(e: React.KeyboardEvent) {
      const n = order.length;
      if (selected === null) {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)) {
          e.preventDefault();
          setSelected(0);
        }
        return;
      }
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); setSelected(Math.min(n - 1, selected + 1)); break;
        case 'ArrowLeft':  e.preventDefault(); setSelected(Math.max(0, selected - 1)); break;
        case 'ArrowDown':  e.preventDefault(); setSelected(Math.min(n - 1, selected + COLS)); break;
        case 'ArrowUp':    e.preventDefault(); setSelected(Math.max(0, selected - COLS)); break;
        case 'Enter':      e.preventDefault(); onOpen(order[selected]); break;
        case 'Escape':     setSelected(null); break;
      }
    }

    /* ── focus container when an icon is clicked ──────────────── */
    function handleIconClick(idx: number) {
      setSelected(idx);
      containerRef.current?.focus();
    }

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ position: 'relative', flex: 1, overflow: 'hidden', outline: 'none' }}
      >
        {(isShuffling ? displaySlots : order).map((partner, idx) => {
          const pos = isShuffling
            ? { x: PAD + (idx % COLS) * (ICON_W + GAP_X), y: PAD + Math.floor(idx / COLS) * (HIGHLIGHT + 16 + 14 + GAP_Y) }
            : positions[partner.name];
          const isDragging = !isShuffling && dragging === partner.name;
          const isSelected = !isShuffling && selected === idx;

          return (
            <div
              key={isShuffling ? idx : partner.name}
              style={{
                position:  'absolute',
                left:       pos.x,
                top:        pos.y,
                width:      ICON_W,
                cursor:     isDragging ? 'grabbing' : 'pointer',
                userSelect: 'none',
                zIndex:     isDragging ? 5 : 1,
              }}
              onPointerDown={e => startDrag(e, partner.name)}
              onClick={() => handleIconClick(idx)}
              onDoubleClick={() => onOpen(partner)}
            >
              {/* highlight — corner brackets only when selected, no fill */}
              <div style={{
                width:    HIGHLIGHT,
                height:   HIGHLIGHT,
                margin:  '0 auto',
                position: 'relative',
                display:  'flex',
                alignItems:    'center',
                justifyContent:'center',
              }}>
                {/* corner brackets — visible only when selected */}
                {isSelected && (() => {
                  const C = 6;
                  const S = 'var(--color-pink)';
                  const b = `1px solid ${S}`;
                  const corners: React.CSSProperties[] = [
                    { top: 0, left: 0,  borderTop: b, borderLeft:  b },
                    { top: 0, right: 0, borderTop: b, borderRight: b },
                    { bottom: 0, right: 0, borderBottom: b, borderRight: b },
                    { bottom: 0, left: 0,  borderBottom: b, borderLeft:  b },
                  ];
                  return corners.map((s, i) => (
                    <span key={i} aria-hidden style={{
                      position: 'absolute', width: C, height: C, pointerEvents: 'none', ...s,
                    }} />
                  ));
                })()}
                <div style={{ width: ICON_BOX, height: ICON_BOX, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     className={partner.lightInvert ? 'logo-on-light' : ''}>
                  <partner.logo className='w-full h-full object-contain' />
                </div>
              </div>

              {/* label — 16px below the highlight box */}
              <p style={{
                textAlign:  'center',
                fontSize:   '0.62rem',
                marginTop:   16,
                color:      isSelected ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
                fontFamily: 'var(--font-mono)',
                transition: 'color 0.1s',
                lineHeight:  1.2,
              }}>
                {partner.name}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
);

/* ── PartnerDetail ────────────────────────────────────────────────────────────
   Content rendered inside a partner detail window.
─────────────────────────────────────────────────────────────────────────── */

const CATEGORY_COLOR: Record<Category, string> = {
  payments:   '#635BFF',
  auth:       '#6C47FF',
  database:   '#22c55e',
  storage:    '#3ECF8E',
  monitoring: '#ef4444',
  analytics:  '#F54E00',
  ai:         '#FF6B35',
  hosting:    '#00b3d4',
};

export function PartnerDetail({ partner, onShowMe }: { partner: Partner; onShowMe?: (cmd: string) => void }) {
  const catColor = CATEGORY_COLOR[partner.category];
  return (
    <div style={{
      padding:    '1.25rem',
      fontFamily: 'var(--font-mono)',
      display:    'flex',
      flexDirection: 'column',
      gap:        '1rem',
    }}>
      {/* header: logo + name + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--color-border-accent)', background: 'var(--color-surface)',
        }} className={partner.lightInvert ? 'logo-on-light' : ''}>
          <partner.logo className='w-7 h-7 object-contain' />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: 0, lineHeight: 1.2 }}>
            {partner.name}
          </h2>
          <span style={{
            display: 'inline-block', marginTop: 4,
            fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            color: catColor, border: `1px solid ${catColor}33`,
            padding: '1px 6px',
          }}>
            {partner.category}
          </span>
        </div>
      </div>

      {/* description */}
      <p style={{
        fontSize: '0.75rem', color: 'var(--color-text-ui-muted)',
        lineHeight: 1.65, margin: 0,
      }}>
        {partner.longDescription}
      </p>

      {/* CLI install command */}
      <div style={{ border: '1px solid var(--color-border-accent)', background: 'var(--color-surface)' }}>
        <div style={{
          padding: '0.4rem 0.875rem',
          borderBottom: '1px solid var(--color-border-accent)',
          fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--color-text-ui-subtle)',
        }}>
          install command
        </div>
        <div style={{ padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--color-pink)', fontSize: '0.75rem' }}>›</span>
          <code style={{ fontSize: '0.78rem', color: 'var(--color-text-ui)', letterSpacing: '0.02em' }}>
            {partner.cliCommand}
          </code>
        </div>
        <button
          onClick={() => onShowMe?.(partner.cliCommand)}
          style={{
            display:      'block',
            width:        '100%',
            padding:      '0.5rem 0.875rem',
            borderTop:    '1px solid var(--color-border-accent)',
            background:   'transparent',
            border:       'none',
            borderTop:    '1px solid var(--color-border-accent)',
            textAlign:    'left',
            fontFamily:   'var(--font-mono)',
            fontSize:     '0.72rem',
            color:        'var(--color-pink)',
            cursor:       onShowMe ? 'pointer' : 'default',
            letterSpacing:'0.02em',
          }}
        >
          show me →
        </button>
      </div>
    </div>
  );
}

/* ── Partners (original scroll section) ─────────────────────────────────── */

export function Partners() {
  return (
    <section id='integrations' className='relative py-24 px-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Section heading */}
        <InView
          className='text-center mb-14'
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className='text-xs font-medium tracking-widest uppercase mb-3' style={{ color: 'var(--color-text-muted)' }}>
            Ecosystem
          </p>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>Works with your stack</h2>
          <p className='text-lg max-w-xl mx-auto' style={{ color: 'var(--color-text-secondary)' }}>
            Stripe Projects integrates with the tools you already use. Pick your preferred providers during setup.
          </p>
        </InView>

        {/* Partner grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {PARTNERS.map((partner, i) => (
            <motion.a
              key={partner.name}
              href={partner.url}
              target='_blank'
              rel='noopener noreferrer'
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              className='group relative flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-200'
              style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-strong)';
                (e.currentTarget as HTMLAnchorElement).style.background  = 'var(--color-surface-2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
                (e.currentTarget as HTMLAnchorElement).style.background  = 'var(--color-surface)';
              }}
            >
              <span
                className='absolute top-3 right-3 w-1.5 h-1.5 rounded-full'
                style={{ background: getCategoryColor(partner.category) }}
              />
              <div className={`w-10 h-10 flex items-center justify-center${partner.lightInvert ? ' logo-on-light' : ''}`}>
                <partner.logo className='w-10 h-10 object-contain' />
              </div>
              <div>
                <p className='text-sm font-semibold' style={{ color: 'var(--color-text-primary)' }}>{partner.name}</p>
                <p className='text-xs mt-0.5 leading-tight' style={{ color: 'var(--color-text-disabled)' }}>{partner.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
