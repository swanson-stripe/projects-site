import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { InstallModal } from '@/components/ui/InstallModal';
import { GridBackground } from '@/components/ui/grid-background';
import { HelmWaveBackground } from '@/components/ui/helm-wave-background';
import { StatusBar, type ViewMode } from '@/components/sections/TerminalBanner';
import { Window } from '@/components/desktop/Window';
import { AgentView } from '@/components/sections/AgentView';
import { PARTNERS } from '@/components/sections/Partners';
import { lookupService, REGISTRY, type RegistryService } from '@/data/registry';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTheme } from '@/components/ui/ThemeContext';

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

const PINK   = 'var(--color-pink)';
const MUTED  = 'var(--color-text-ui-muted)';
const DIM    = 'var(--color-text-ui-subtle)';
const BORDER = '1px solid var(--color-border-accent)';

const STACK_W          = 560;
const INSTALL_W        = 560;
const VERTICAL_GAP     = 40;
const STACK_ESTIMATED_H = 200;

const BREW_COMMAND = 'brew install stripe/stripe-cli/stripe\nstripe plugin install projects';

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

/* ── provider logo ─────────────────────────────────────────────────── */
function ProviderLogo({ name }: { name: string }) {
  const { theme, themeConfig } = useTheme();
  const partner = PARTNERS.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!partner) {
    return <span style={{ color: PINK, fontSize: '0.75em' }}>✓</span>;
  }
  const isLightTheme = themeConfig.isLight ?? (theme === 'vaporwave' || theme === '配色事典');
  const filter =
    partner.lightInvert && isLightTheme  ? 'invert(1)' :
    partner.darkWhite   && !isLightTheme ? 'brightness(0) invert(1)' :
    undefined;
  return (
    <div style={{
      width: 16, height: 16, flexShrink: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      filter,
    }}>
      <partner.logo className="w-full h-full" />
    </div>
  );
}

/* ── service row ───────────────────────────────────────────────────── */
function ProviderRow({ svc, info, isLast }: { svc: string; info: RegistryService | undefined; isLast: boolean }) {
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
      borderBottom: isLast ? 'none' : BORDER,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', width: 16, flexShrink: 0 }}>
        <ProviderLogo name={svc} />
      </span>
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
          <ArrowUpRight size={13} strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}

/* ── add provider inline form ───────────────────────────────────────── */
const CATEGORIES = Object.keys(CATEGORY_COLORS);

interface UserProvider { name: string; category: string }

function AddProviderForm({ onAdd, onCancel }: {
  onAdd: (p: UserProvider) => void;
  onCancel: () => void;
}) {
  const [name, setName]         = useState('');
  const [category, setCategory] = useState('');

  function commit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ name: trimmed, category });
    setName('');
    setCategory('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter')  { commit(); }
    if (e.key === 'Escape') { onCancel(); }
  }

  return (
    <div style={{ paddingTop: '0.85em', display: 'flex', flexDirection: 'column', gap: '0.6em' }}>
      {/* name input */}
      <input
        autoFocus
        placeholder="provider name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKey}
        style={{
          background:   'none',
          border:       'none',
          borderBottom: BORDER,
          color:        'var(--color-text-ui)',
          fontFamily:   'inherit',
          fontSize:     '0.88em',
          padding:      '0.15em 0 0.3em',
          outline:      'none',
          width:        '100%',
        }}
      />

      {/* category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35em' }}>
        {CATEGORIES.map(cat => {
          const color    = CATEGORY_COLORS[cat];
          const selected = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(selected ? '' : cat)}
              style={{
                fontSize:      '0.72em',
                border:        `1px solid ${selected ? color : 'var(--color-border-accent)'}`,
                color:         selected ? color : DIM,
                padding:       '0 0.5em',
                lineHeight:    1.7,
                letterSpacing: '0.03em',
                background:    'none',
                cursor:        'pointer',
                fontFamily:    'inherit',
                transition:    'border-color 0.12s, color 0.12s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* confirm / cancel */}
      <div style={{ display: 'flex', gap: '1.25em', fontSize: '0.8em', paddingBottom: '0.1em' }}>
        <button
          onClick={commit}
          disabled={!name.trim()}
          style={{
            color:      name.trim() ? PINK : DIM,
            background: 'none',
            border:     'none',
            cursor:     name.trim() ? 'pointer' : 'default',
            fontFamily: 'inherit',
            padding:    0,
            transition: 'color 0.12s',
          }}
        >
          add
        </button>
        <button
          onClick={onCancel}
          style={{ color: DIM, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}

/* ── stack window content ──────────────────────────────────────────── */
function StackContent({ state }: { state: LoadState }) {
  const fallbackProviders = REGISTRY.slice(0, 5);
  const [extras,   setExtras]   = useState<UserProvider[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd(p: UserProvider) {
    setExtras(prev => [...prev, p]);
    setIsAdding(false);
  }

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
  const baseRows = enriched.length > 0
    ? enriched
    : fallbackProviders.map(p => ({ svc: p.name, info: p }));

  const extraRows = extras.map(p => ({
    svc:  p.name,
    info: { name: p.name, category: p.category, description: '', url: '' } as RegistryService,
  }));

  const allRows = [...baseRows, ...extraRows];
  const totalCount = baseRows.length + extras.length;

  return (
    <div style={{ padding: '1.25em 1.25em 1.25em', fontFamily: 'inherit' }}>
      {/* header */}
      <div style={{ marginBottom: '1.25em' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6em', marginBottom: '0.35em' }}>
          <span style={{ color: PINK }}>→</span>
          <span style={{ color: 'var(--color-text-ui)', fontWeight: 'bold' }}>
            {state.data.appName}
          </span>
        </div>
        <div style={{ color: DIM, fontSize: '0.82em', paddingLeft: '1.4em' }}>
          {totalCount} provider{totalCount !== 1 ? 's' : ''}
          {' · '}
          generated {new Date(state.data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* provider list */}
      <div style={{ borderTop: BORDER }}>
        {allRows.map(({ svc, info }, i) => (
          <ProviderRow key={`${svc}-${i}`} svc={svc} info={info} isLast={i === allRows.length - 1} />
        ))}

        {/* add provider form or trigger */}
        <div style={{ borderTop: allRows.length > 0 ? BORDER : 'none', paddingTop: allRows.length > 0 ? 0 : undefined }}>
          {isAdding ? (
            <AddProviderForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              style={{
                display:    'block',
                marginTop:  '0.7em',
                background: 'none',
                border:     'none',
                padding:    0,
                cursor:     'pointer',
                color:      DIM,
                fontFamily: 'inherit',
                fontSize:   '0.8em',
                letterSpacing: '0.01em',
                transition: 'color 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = PINK)}
              onMouseLeave={e => (e.currentTarget.style.color = DIM)}
            >
              + add a provider
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── install window content ────────────────────────────────────────── */
function InstallContent({ state, code }: { state: LoadState; code: string }) {
  const [copied, setCopied]         = useState(false);
  const [copiedInit, setCopiedInit] = useState(false);
  const [showModal, setShowModal]   = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BREW_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInit = () => {
    navigator.clipboard.writeText(`stripe projects init --from https://projects.dev/${code}`);
    setCopiedInit(true);
    setTimeout(() => setCopiedInit(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      {showModal && <InstallModal onClose={() => setShowModal(false)} />}

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: BORDER, padding: '0.55em 1.25em' }}>
        <span style={{ fontSize: '0.8em', color: 'var(--color-blue)' }}>Install</span>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2em',
            fontSize: '0.75em',
            color: DIM,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-ui)')}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}
        >
          more install options <ArrowUpRight size={10} strokeWidth={1.5} />
        </button>
      </div>

      {/* command — click to copy */}
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Click to copy'}
        style={{
          display: 'block',
          width: '100%',
          padding: '1.1em 1.25em',
          background: 'none',
          border: 'none',
          borderBottom: BORDER,
          textAlign: 'left',
          cursor: 'pointer',
          color: copied ? 'var(--color-yellow)' : 'var(--color-text-ui)',
          fontSize: '0.82em',
          lineHeight: 1.7,
          fontFamily: 'inherit',
          transition: 'color 0.15s',
        }}
      >
        {BREW_COMMAND.split('\n').map((line, i) => <div key={i}>{line}</div>)}
      </button>

      {/* init command — only show once stack is loaded */}
      {state.status === 'ok' && (
        <div>
          <div style={{ padding: '0.6em 1.25em 0.5em', color: 'var(--color-blue)', fontSize: '0.75em' }}>
            then run this in your stripe cli:
          </div>
          <button
            onClick={handleCopyInit}
            title={copiedInit ? 'Copied!' : 'Click to copy'}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.6em 1.25em 0.85em',
              background: 'none',
              border: 'none',
              borderTop: BORDER,
              textAlign: 'left',
              cursor: 'pointer',
              color: copiedInit ? 'var(--color-yellow)' : 'var(--color-text-ui)',
              fontSize: '0.78em',
              letterSpacing: '0.02em',
              wordBreak: 'break-all',
              lineHeight: 1.5,
              fontFamily: 'inherit',
              transition: 'color 0.15s',
            }}
          >
            stripe projects init --from https://projects.dev/{code}
          </button>
        </div>
      )}

    </div>
  );
}

/* ── cta button row ─────────────────────────────────────────────────── */
const BTN_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4em',
  flex: 1,
  fontFamily: 'inherit',
  fontSize: '0.75em',
  letterSpacing: '0.04em',
  color: 'var(--color-text-ui)',
  border: '1px solid var(--color-border-accent)',
  background: 'var(--color-bg)',
  padding: '0.55em 0.85em',
  textDecoration: 'none',
  transition: 'border-color 0.15s, color 0.15s',
  cursor: 'pointer',
};

function CtaButtons({ width }: { width?: number }) {
  function hoverOn(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.borderColor = 'var(--color-pink)';
    e.currentTarget.style.color = 'var(--color-pink)';
  }
  function hoverOff(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.borderColor = 'var(--color-border-accent)';
    e.currentTarget.style.color = 'var(--color-text-ui)';
  }

  return (
    <div style={{
      display: 'flex',
      gap: 20,
      width: width ? `${width}px` : '100%',
    }}>
      <a
        href="/"
        style={BTN_STYLE}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        How it works <ArrowUpRight size={11} strokeWidth={1.5} />
      </a>
      <a
        href="https://docs.stripe.com/projects"
        target="_blank"
        rel="noopener noreferrer"
        style={BTN_STYLE}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        View docs <ArrowUpRight size={11} strokeWidth={1.5} />
      </a>
    </div>
  );
}

/* ── mobile card shell ─────────────────────────────────────────────── */
function MobileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: BORDER,
      background: 'var(--color-surface-dark)',
      width: '100%',
      maxWidth: 520,
    }}>
      <div style={{
        padding: '0.45em 0.75em',
        borderBottom: BORDER,
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: DIM,
        textAlign: 'center',
        fontFamily: 'inherit',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ── initial window positions ──────────────────────────────────────── */
function defaultPositions(stackH = 0) {
  const sH = stackH || STACK_ESTIMATED_H;
  if (typeof window === 'undefined') {
    return {
      stack:   { x: 60, y: 80 },
      install: { x: 60, y: 80 + sH + VERTICAL_GAP },
    };
  }
  const totalH   = sH + VERTICAL_GAP + 180;
  const stackX   = Math.max(20, Math.round((window.innerWidth  - STACK_W)   / 2));
  const installX = Math.max(20, Math.round((window.innerWidth  - INSTALL_W) / 2));
  const y        = Math.max(20, Math.round((window.innerHeight - totalH) * 0.25));
  return {
    stack:   { x: stackX,   y },
    install: { x: installX, y: y + sH + VERTICAL_GAP },
  };
}

/* ── main page ─────────────────────────────────────────────────────── */
export function StackPage() {
  useDynamicFavicon();

  const { code }  = useParams<{ code: string }>();
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const { themeConfig } = useTheme();
  const isHelmWave = themeConfig.backgroundVariant === 'helm-wave';

  const [state, setState]   = useState<LoadState>({ status: 'loading' });
  const [activeWin, setActiveWin] = useState<'stack' | 'install' | null>('stack');
  const [viewMode, setViewMode]   = useState<ViewMode>('scroll');
  const stackRef   = useRef<HTMLDivElement>(null);
  const installRef = useRef<HTMLDivElement>(null);
  const [stackH,   setStackH]   = useState(0);
  const [installH, setInstallH] = useState(0);

  useEffect(() => {
    if (!stackRef.current) return;
    const obs = new ResizeObserver(entries => setStackH(entries[0].contentRect.height));
    obs.observe(stackRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!installRef.current) return;
    const obs = new ResizeObserver(entries => setInstallH(entries[0].contentRect.height));
    obs.observe(installRef.current);
    return () => obs.disconnect();
  }, []);

  const [stackPos,   setStackPos]   = useState(() => defaultPositions().stack);
  const [installPos, setInstallPos] = useState(() => defaultPositions().install);

  function handleReset() {
    const pos = defaultPositions(stackH);
    setStackPos(pos.stack);
    setInstallPos(pos.install);
    setActiveWin('stack');
  }

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

  const stackTitle =
    state.status === 'ok'      ? `${state.data.appName}.stack` :
    state.status === 'expired' ? 'expired.txt' :
    state.status === 'error'   ? 'error.txt' :
    'loading…';

  /* ── mobile layout ─────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div
        className="font-mono"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isHelmWave ? <HelmWaveBackground /> : <GridBackground />}
        <StatusBar onReset={handleReset} viewMode={viewMode} onViewModeChange={setViewMode} />
        {viewMode === 'agent' && <AgentView />}
        {viewMode === 'scroll' && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: '1.5rem 1rem',
          }}>
            <MobileCard title={stackTitle}>
              <StackContent state={state} />
            </MobileCard>
            <MobileCard title="install.sh">
              <InstallContent state={state} code={code ?? ''} />
            </MobileCard>
            <CtaButtons />
          </div>
        )}
      </div>
    );
  }

  /* ── desktop layout ────────────────────────────────────────────── */
  return (
    <div
      className="font-mono"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isHelmWave ? <HelmWaveBackground /> : <GridBackground />}
      <StatusBar onReset={handleReset} viewMode={viewMode} onViewModeChange={setViewMode} />

      {viewMode === 'agent' && <AgentView />}

      <div
        style={{ position: 'relative', flex: 1, zIndex: 1, display: viewMode === 'agent' ? 'none' : undefined }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setActiveWin(null);
        }}
      >
        {/* stack window */}
        <Window
          ref={stackRef}
          title={stackTitle}
          x={stackPos.x}
          y={stackPos.y}
          w={STACK_W}
          h="auto"
          zIndex={activeWin === 'stack' ? 20 : 10}
          isActive={activeWin === 'stack'}
          onFocus={() => setActiveWin('stack')}
          onMove={(x, y) => setStackPos({ x, y })}
          onResize={(x, y) => setStackPos({ x, y })}
          onClose={() => navigate('/')}
        >
          <StackContent state={state} />
        </Window>

        {/* install window */}
        <Window
          ref={installRef}
          title="install.sh"
          x={installPos.x}
          y={installPos.y}
          w={INSTALL_W}
          h="auto"
          zIndex={activeWin === 'install' ? 20 : 10}
          isActive={activeWin === 'install'}
          background='var(--color-bg)'
          onFocus={() => setActiveWin('install')}
          onMove={(x, y) => setInstallPos({ x, y })}
          onResize={(x, y) => setInstallPos({ x, y })}
          onClose={() => navigate('/')}
        >
          <InstallContent state={state} code={code ?? ''} />
        </Window>

        {/* view docs — floats below the install window */}
        {installH > 0 && (
          <div style={{
            position: 'absolute',
            left: installPos.x,
            top: installPos.y + installH + 40,
            zIndex: 5,
          }}>
            <CtaButtons width={INSTALL_W} />
          </div>
        )}
      </div>
    </div>
  );
}
