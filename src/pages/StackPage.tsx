import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar } from '@/components/sections/TerminalBanner';
import { Window } from '@/components/desktop/Window';
import { lookupService, REGISTRY, type RegistryService } from '@/data/registry';

interface StackData {
  appName: string;
  services: string[];
  createdAt: string;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ok'; data: StackData }
  | { status: 'expired' }
  | { status: 'error' };

const PINK  = 'var(--color-pink)';
const MUTED = 'var(--color-text-ui-muted)';
const DIM   = 'var(--color-text-ui-subtle)';
const BORDER = '1px solid var(--color-border-accent)';
const WIN_W  = 560;

/* ── category badge ────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  payments:   '#635BFF',
  auth:       '#6C47FF',
  database:   '#34D59A',
  storage:    '#3ECF8E',
  monitoring: '#F87171',
  analytics:  '#F54E00',
  ai:         '#4FF8D2',
  hosting:    'var(--color-text-ui)',
};

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? DIM;
  return (
    <span style={{
      fontSize: '0.72em',
      border: `1px solid ${color}`,
      color,
      padding: '0 0.5em',
      lineHeight: 1.7,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
    }}>
      {category}
    </span>
  );
}

/* ── service row ───────────────────────────────────────────────────── */
function ServiceRow({ svc, info }: { svc: string; info: RegistryService | undefined }) {
  const name = info?.name ?? svc;
  const desc = info?.description ?? '';
  const url  = info?.url;
  const cat  = info?.category ?? '';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75em',
      padding: '0.65em 0',
      borderBottom: BORDER,
    }}>
      <span style={{ color: PINK, minWidth: '1em', fontFamily: 'inherit' }}>✓</span>
      <span style={{ color: 'var(--color-text-ui)', fontFamily: 'inherit', minWidth: '10ch' }}>
        {name}
      </span>
      {cat && <CategoryBadge category={cat} />}
      <span style={{ color: MUTED, fontFamily: 'inherit', flex: 1, fontSize: '0.9em' }}>
        {desc}
      </span>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: DIM, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          aria-label={`Open ${name}`}
        >
          <ExternalLink size={11} strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}

/* ── stack window content ──────────────────────────────────────────── */
function StackContent({ state, code }: { state: LoadState; code: string }) {
  const fallbackServices = REGISTRY.slice(0, 5);

  if (state.status === 'loading') {
    return (
      <div style={{ padding: '1.5em 1.25em', color: MUTED, fontFamily: 'inherit', fontSize: '0.85em' }}>
        loading stack…
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div style={{ padding: '1.5em 1.25em', color: '#f87171', fontFamily: 'inherit' }}>
        ✗ could not load stack. please try again.
      </div>
    );
  }

  if (state.status === 'expired') {
    return (
      <div style={{ padding: '1.5em 1.25em', fontFamily: 'inherit' }}>
        <p style={{ color: DIM, margin: '0 0 0.75em' }}>
          • this stack link has expired or does not exist.
        </p>
        <p style={{ color: MUTED, margin: 0, fontSize: '0.88em' }}>
          stack URLs are valid for 30 days. generate a new one from the projects terminal.
        </p>
      </div>
    );
  }

  const enriched = state.data.services.map(s => ({ svc: s, info: lookupService(s) }));

  return (
    <div style={{ padding: '1.25em 1.25em 1em', fontFamily: 'inherit' }}>
      {/* header */}
      <div style={{ marginBottom: '1.25em' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6em', marginBottom: '0.35em' }}>
          <span style={{ color: PINK }}>→</span>
          <span style={{ color: 'var(--color-text-ui)', fontWeight: 'bold' }}>
            {state.data.appName}
          </span>
        </div>
        <div style={{ color: DIM, fontSize: '0.82em', paddingLeft: '1.4em' }}>
          {enriched.length} service{enriched.length !== 1 ? 's' : ''}
          {' · '}
          generated {new Date(state.data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* service list */}
      <div style={{ borderTop: BORDER }}>
        {enriched.length > 0
          ? enriched.map(({ svc, info }) => (
              <ServiceRow key={svc} svc={svc} info={info} />
            ))
          : fallbackServices.map(svc => (
              <ServiceRow key={svc.name} svc={svc.name} info={svc} />
            ))
        }
      </div>

      {/* init command */}
      <div style={{ marginTop: '1.25em', paddingTop: '1em', borderTop: BORDER }}>
        <div style={{ color: DIM, fontSize: '0.8em', marginBottom: '0.4em' }}>
          run this in your stripe cli:
        </div>
        <div style={{
          background: 'var(--color-surface)',
          border: BORDER,
          padding: '0.55em 0.85em',
          color: PINK,
          fontSize: '0.88em',
          letterSpacing: '0.02em',
          userSelect: 'all',
          wordBreak: 'break-all',
        }}>
          stripe projects init --from https://projects.dev/{code}
        </div>
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────────────── */
export function StackPage() {
  const { code } = useParams<{ code: string }>();
  const navigate  = useNavigate();

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [isActive, setIsActive] = useState(true);
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(20, Math.round(window.innerWidth  / 2 - WIN_W / 2)) : 100,
    y: typeof window !== 'undefined' ? Math.max(20, Math.round(window.innerHeight / 2 - 200))       : 80,
  }));

  useEffect(() => {
    if (!code?.startsWith('STACK-')) { navigate('/'); return; }

    fetch(`/api/stacks/${code}`)
      .then(async res => {
        if (res.status === 404) { setState({ status: 'expired' }); return; }
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json() as StackData;
        setState({ status: 'ok', data });
      })
      .catch(() => setState({ status: 'error' }));
  }, [code, navigate]);

  const title =
    state.status === 'ok'      ? `${state.data.appName}.stack` :
    state.status === 'expired' ? 'expired.txt' :
    state.status === 'error'   ? 'error.txt' :
    'loading…';

  return (
    <div
      className="font-mono"
      style={{
        position: 'relative',
        width:    '100vw',
        height:   '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        display:  'flex',
        flexDirection: 'column',
      }}
    >
      <GridBackground />
      <StatusBar gateMode />

      {/* desktop area — click outside window to deactivate */}
      <div
        style={{ position: 'relative', flex: 1, zIndex: 1 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setIsActive(false);
        }}
      >
        <Window
          title={title}
          x={pos.x}
          y={pos.y}
          w={WIN_W}
          h="auto"
          zIndex={10}
          isActive={isActive}
          onFocus={() => setIsActive(true)}
          onMove={(x, y) => setPos({ x, y })}
          onResize={(x, y) => setPos({ x, y })}
          onClose={() => navigate('/')}
        >
          <StackContent state={state} code={code ?? ''} />
        </Window>
      </div>
    </div>
  );
}
