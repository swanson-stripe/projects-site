import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar } from '@/components/sections/TerminalBanner';
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

/* ── category badge ────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  payments:   '#635BFF',
  auth:       '#6C47FF',
  database:   '#34D59A',
  storage:    '#3ECF8E',
  monitoring: '#F87171',
  analytics:  '#F54E00',
  ai:         '#4FF8D2',
  hosting:    '#FFFFFF',
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

/* ── window shell ──────────────────────────────────────────────────── */
function WindowShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: BORDER,
      background: 'var(--color-surface-dark)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 640,
    }}>
      {/* title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5em',
        padding: '0.4em 0.75em',
        borderBottom: BORDER,
        flexShrink: 0,
      }}>
        {/* traffic lights */}
        {(['#F6F9FC', 'var(--color-border-accent)', 'var(--color-border-accent)'] as const).map((c, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: c,
            border: `1px solid var(--color-border-accent)`,
          }} />
        ))}
        <span style={{
          color: DIM,
          fontFamily: 'inherit',
          fontSize: '0.8em',
          marginLeft: '0.25em',
          letterSpacing: '0.03em',
        }}>
          {title}
        </span>
      </div>

      {/* content */}
      <div style={{ padding: '1.25em 1.25em 1em', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────────────── */
export function StackPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const code = `STACK-${id}`;

  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!id) { navigate('/'); return; }

    fetch(`/api/stacks/${code}`)
      .then(async res => {
        if (res.status === 404) { setState({ status: 'expired' }); return; }
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json() as StackData;
        setState({ status: 'ok', data });
      })
      .catch(() => setState({ status: 'error' }));
  }, [code, id, navigate]);

  /* enrich services with registry data */
  const enriched = state.status === 'ok'
    ? state.data.services.map(s => ({ svc: s, info: lookupService(s) }))
    : [];

  /* fallback: all known services when payload has none */
  const fallbackServices = REGISTRY.slice(0, 5);

  return (
    <div
      className="font-mono"
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <GridBackground />

      {/* toolbar */}
      <StatusBar gateMode />

      {/* centered content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        zIndex: 1,
      }}>

        {state.status === 'loading' && (
          <span style={{ color: MUTED, fontSize: '0.85em', letterSpacing: '0.04em' }}>
            loading stack…
          </span>
        )}

        {state.status === 'error' && (
          <WindowShell title="error.txt">
            <p style={{ color: '#f87171', fontFamily: 'inherit', margin: 0 }}>
              ✗ could not load stack. please try again.
            </p>
          </WindowShell>
        )}

        {state.status === 'expired' && (
          <WindowShell title="expired.txt">
            <p style={{ color: DIM, fontFamily: 'inherit', margin: '0 0 0.75em' }}>
              • this stack link has expired or does not exist.
            </p>
            <p style={{ color: MUTED, fontFamily: 'inherit', margin: 0, fontSize: '0.88em' }}>
              stack URLs are valid for 30 days. generate a new one from the projects terminal.
            </p>
          </WindowShell>
        )}

        {state.status === 'ok' && (
          <WindowShell title={`${state.data.appName}.stack`}>
            {/* header */}
            <div style={{ marginBottom: '1.25em' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6em', marginBottom: '0.35em' }}>
                <span style={{ color: PINK }}>→</span>
                <span style={{ color: 'var(--color-text-ui)', fontSize: '1em', fontWeight: 'bold' }}>
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
          </WindowShell>
        )}
      </div>
    </div>
  );
}
