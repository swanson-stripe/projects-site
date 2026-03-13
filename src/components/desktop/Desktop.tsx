import { useState, useCallback, useEffect, useRef, forwardRef, type CSSProperties } from 'react';
import { AnimatePresence } from 'motion/react';
import { Shuffle, RotateCcw } from 'lucide-react';
import { Window } from './Window';
import { DevThemeContent } from './DevThemeContent';
import { GridBackground } from '@/components/ui/grid-background';
import { HelmWaveBackground } from '@/components/ui/helm-wave-background';
import { StatusBar, type ViewMode } from '@/components/sections/TerminalBanner';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import { InstallWindow } from '@/components/sections/Hero';
import { FeaturesContent } from '@/components/sections/Features';
import { AgentView } from '@/components/sections/AgentView';
import { ScrollView } from '@/components/sections/ScrollView';
import {
  EcosystemIcons,
  EcoFilterButton,
  PartnerDetail,
  PARTNERS,
  ECO_CONTENT_W,
  ECO_CONTENT_H,
  type Partner,
  type EcosystemHandle,
  type Category,
} from '@/components/sections/Partners';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTheme, type LayoutOverrides } from '@/components/ui/ThemeContext';

/* ── constants ────────────────────────────────────────────────────── */
const STATUSBAR_H        = 40;
const MOBILE_STATUSBAR_H = 52;
const MOBILE_MARGIN      = 12;
const MOBILE_GAP         = 12;

/* ── types ────────────────────────────────────────────────────────── */
type CoreId = 'terminal' | 'install' | 'why' | 'ecosystem' | 'users' | 'feedback' | 'join';
type WinId  = CoreId | `partner:${string}`;


interface WinState {
  id:       WinId;
  x:        number;
  y:        number;
  w:        number;
  h:        number | 'auto';
  zIndex:   number;
}

/* ── window metadata helpers ──────────────────────────────────────── */
function getTitle(id: WinId): string {
  if (id === 'terminal')  return 'terminal';
  if (id === 'install')   return 'install.sh';
  if (id === 'why')       return 'what.md';
  if (id === 'ecosystem') return 'ecosystem.json';
  if (id === 'users')     return 'users.log';
  if (id === 'feedback')  return 'feedback';
  if (id === 'join')      return 'join.md';
  return id.slice('partner:'.length).toLowerCase() + '.json';
}

function isNoScroll(id: WinId): boolean {
  return id === 'terminal';
}

/* ── initial staggered layout ─────────────────────────────────────── */
// Window dimensions = content dimensions + window chrome overhead
// Title bar height (desktop): padding 0.45rem×2 + ~0.6rem font + 1px border ≈ 27px
const ECO_TITLEBAR_H = 27;
const ECO_W = ECO_CONTENT_W;
const ECO_H = ECO_CONTENT_H + ECO_TITLEBAR_H;

const HEADLINE_H = 120; // headline text height + gap beneath it

function initialWindows(): WinState[] {
  const vw    = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh    = typeof window !== 'undefined' ? window.innerHeight : 900;
  const areaH = vh - STATUSBAR_H;

  const ww = Math.floor(vw    * 0.55);
  const wh = Math.floor(areaH * 0.55);
  const th = Math.floor(wh * 0.7); // terminal is ~30% shorter than the default window height

  // install width ~50% of base, height fixed to just contain its content
  const iw   = Math.floor(ww * 0.5);
  const ih   = 200; // titlebar(31) + tabs(34) + sep(1) + cmd(90) + copy(36) + breathing room

  const m = 20; // edge margin

  // Install sits in the top-right, starting where the terminal ends + a gap
  const installX = Math.max(ww + 40, vw - iw - m);

  const uw = 440, uh = 520;

  return [
    // terminal  — top-left, shifted down to leave room for headline
    { id: 'terminal',  x: m,         y: m * 2 + HEADLINE_H,  w: ww, h: th, zIndex: 3 },
    // install   — top-right, guaranteed right of terminal
    { id: 'install',   x: installX,  y: m,  w: iw, h: ih, zIndex: 4 },
    // what.md   — bottom-left
    { id: 'why',       x: m + 20,         y: areaH - wh - m,   w: Math.floor(ww * 0.75),    h: wh,    zIndex: 2 },
    // ecosystem — bottom-right
    { id: 'ecosystem', x: vw - ECO_W - m, y: areaH - ECO_H - m, w: ECO_W, h: ECO_H, zIndex: 1 },
    // users     — centered
    { id: 'users',     x: Math.round(vw / 2 - uw / 2), y: Math.round((areaH - uh) / 2), w: uw, h: uh, zIndex: 5 },
  ];
}

function mobileInitialWindows(): WinState[] {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const ww = vw - MOBILE_MARGIN * 2;

  const defs: { id: CoreId; h: number }[] = [
    { id: 'install',   h: 220 },
    { id: 'why',       h: 400 },
    // Mobile title bar is taller (~39px vs ~27px desktop), compensate accordingly.
    { id: 'ecosystem', h: ECO_CONTENT_H + 39 },
    // Terminal boot sequence is ~450px of content; give the output area enough room.
    { id: 'terminal',  h: 560 },
    { id: 'users',     h: 520 },
  ];

  // Small gap from the top of the window area so the first window doesn't butt up against the status bar
  let y = 8;
  return defs.map((d, i) => {
    const win: WinState = { id: d.id, x: MOBILE_MARGIN, y, w: ww, h: d.h, zIndex: defs.length - i };
    y += d.h + MOBILE_GAP;
    return win;
  });
}

/** Total canvas height needed for a tiled mobile layout */
function mobileTotalH(wins: WinState[]): number {
  const maxBottom = wins.reduce((m, w) => Math.max(m, w.y + (typeof w.h === 'number' ? w.h : 0)), 0);
  return maxBottom + 32; // small bottom breathing room only — treasure is hidden inside the terminal window
}

/* ── Layout overrides ─────────────────────────────────────────────── */
function applyLayoutOverrides(wins: WinState[], overrides?: LayoutOverrides): WinState[] {
  if (!overrides?.windows) return wins;
  return wins
    .filter(w => overrides.windows![w.id]?.visible !== false)
    .map(w => {
      const override = overrides.windows![w.id];
      return override ? { ...w, ...override } : w;
    });
}

/**
 * Helm-wave positions the terminal in the right ~42% of the viewport so the
 * hero headline is fully visible on the left. Values are computed from the
 * live viewport so they adapt across screen sizes.
 */
function helmWaveWindowOverrides(): LayoutOverrides {
  const vw    = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh    = typeof window !== 'undefined' ? window.innerHeight : 900;
  const areaH = vh - STATUSBAR_H;
  const m     = 20;

  const tw = Math.floor(vw * 0.42);
  const th = Math.floor(areaH * 0.44);
  const tx = vw - tw - m;           // flush-right with a small margin
  const ty = Math.floor(areaH * 0.1); // ~10% from top — sits below the headline

  return {
    windows: {
      terminal: { x: tx, y: ty, w: tw, h: th },
    },
  };
}

/* ── Desktop ──────────────────────────────────────────────────────── */
export function Desktop() {
  const isMobile                      = useIsMobile();
  const { theme, themeConfig }        = useTheme();

  const buildWindows = (cfg: typeof themeConfig) => {
    const base = (typeof window !== 'undefined' && window.innerWidth < 768)
      ? mobileInitialWindows()
      : initialWindows();
    const layout = cfg.backgroundVariant === 'helm-wave'
      ? helmWaveWindowOverrides()
      : cfg.layout;
    return applyLayoutOverrides(base, layout);
  };

  const [wins, setWins]               = useState<WinState[]>(() => buildWindows(themeConfig));
  const [viewMode, setViewMode]       = useState<ViewMode>('scroll');
  const [feedbackKey, setFeedbackKey]   = useState(0);
  const [scrollViewKey, setScrollViewKey] = useState(0);
  const [terminalKey, setTerminalKey]   = useState(0);
  const ecoRef                          = useRef<EcosystemHandle>(null);
  const cliRef                          = useRef<CliHandle>(null);
  const featuresRef                     = useRef<{ shuffle?: () => void } | null>(null);
  const windowAreaRef                   = useRef<HTMLDivElement>(null);
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [ghostPos,        setGhostPos]        = useState<{ x: number; y: number } | null>(null);
  const [ecoFilter,       setEcoFilter]       = useState<Category | null>(null);

  /* reset window positions whenever the active theme changes */
  useEffect(() => {
    setWins(buildWindows(themeConfig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  /* bring clicked window to front */
  const bringToFront = useCallback((id: WinId) => {
    setWins(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      if (prev.find(w => w.id === id)?.zIndex === maxZ) return prev;
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  }, []);

  /* drag */
  const handleMove = useCallback((id: WinId, x: number, y: number) => {
    setWins(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  /* resize */
  const handleResize = useCallback((id: WinId, x: number, y: number, ww: number, h: number) => {
    setWins(prev => prev.map(w => w.id === id ? { ...w, x, y, w: ww, h } : w));
  }, []);

  /* open a partner-spawned window (feedback/join) or bring to front */
  const openCoreWindow = useCallback((id: CoreId) => {
    if (id === 'feedback') setFeedbackKey(k => k + 1);
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = window.innerWidth;
      const vh        = window.innerHeight;
      const scrollTop = windowAreaRef.current?.scrollTop ?? 0;
      const areaH     = vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H);
      const w         = isMobile ? vw - MOBILE_MARGIN * 2 : (id === 'feedback' || id === 'join' ? 420 : 440);
      const h: number | 'auto' = id === 'join' ? 'auto' : id === 'feedback' ? 380 : 520;
      return [...prev, {
        id,
        x: isMobile ? MOBILE_MARGIN : Math.round(vw / 2 - w / 2),
        y: h === 'auto' ? Math.round(scrollTop + areaH / 4) : Math.round(scrollTop + (areaH - h) / 2),
        w,
        h,
        zIndex: maxZ + 1,
      }];
    });
  }, [bringToFront, isMobile]);

  /* cross-window drag: icon released — check if over CLI window */
  const handleCrossDragEnd = useCallback((partner: Partner, clientX: number, clientY: number) => {
    setDraggingPartner(null);
    setGhostPos(null);
    const cli     = wins.find(w => w.id === 'terminal');
    const areaTop = windowAreaRef.current?.getBoundingClientRect().top ?? STATUSBAR_H;
    if (
      cli &&
      clientX >= cli.x && clientX <= cli.x + cli.w &&
      clientY >= areaTop + cli.y && clientY <= areaTop + cli.y + (typeof cli.h === 'number' ? cli.h : 0)
    ) {
      cliRef.current?.submit(`stripe projects services add ${partner.name.toLowerCase()}`);
      bringToFront('terminal');
      ecoRef.current?.resetIconPosition(partner.name);
    }
  }, [wins, bringToFront]);

  /* open a partner detail window — or bring to front if already open */
  const openPartner = useCallback((partner: Partner, _iconOrigin?: { x: number; y: number }) => {
    const id: WinId = `partner:${partner.name}`;
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = window.innerWidth;
      const vh        = window.innerHeight;
      const scrollTop = windowAreaRef.current?.scrollTop ?? 0;
      const areaH     = vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H);
      const w         = isMobile ? vw - MOBILE_MARGIN * 2 : 380;
      return [...prev, {
        id,
        x: isMobile ? MOBILE_MARGIN : Math.round(vw / 2 - 190 + (prev.length - 4) * 24),
        y: isMobile
          ? Math.round(scrollTop + areaH / 4)
          : Math.round(vh / 4 + (prev.length - 4) * 24),
        w,
        h: 'auto' as const,
        zIndex: maxZ + 1,
      }];
    });
  }, [isMobile]);

  /* mobile canvas height — tall enough for all tiled windows */
  const mobileCanvasH = isMobile ? mobileTotalH(wins) : undefined;

  return (
    <div
      style={{
        width:      '100vw',
        height:     '100vh',
        overflow:   'hidden',
        position:   'relative',
        background: 'var(--color-surface-dark)',
        display:    'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Full-viewport background — behind everything ─────────── */}
      {themeConfig.backgroundVariant === 'helm-wave'
        ? <HelmWaveBackground />
        : <GridBackground />
      }

      {/* ── Drag ghost — follows cursor when dragging an icon cross-window */}
      {draggingPartner && ghostPos && (
        <div
          aria-hidden
          style={{
            position:       'fixed',
            left:            ghostPos.x - 20,
            top:             ghostPos.y - 20,
            pointerEvents:  'none',
            zIndex:          9999,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:             6,
            opacity:         0.85,
          }}
        >
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               className={[draggingPartner.lightInvert && 'logo-on-light', draggingPartner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}>
            <draggingPartner.logo className='w-full h-full object-contain' />
          </div>
          <span style={{
            fontSize:   '0.55rem',
            fontFamily: 'var(--font-mono)',
            color:      'var(--color-text-ui)',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {draggingPartner.name}
          </span>
        </div>
      )}

      {/* ── Global status bar — always on top ─────────────────────── */}
      <StatusBar
        onReset={() => {
          if (viewMode === 'scroll') {
            setScrollViewKey(k => k + 1);
          } else {
            setWins(buildWindows(themeConfig));
          }
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* ── Dev theme — plain terminal-style content ──────────────── */}
      {theme === 'dev' && <DevThemeContent />}

      {/* ── Agent view — replaces window area when active ─────────── */}
      {theme !== 'dev' && viewMode === 'agent' && <AgentView />}

      {/* ── Scroll view ───────────────────────────────────────────── */}
      {theme !== 'dev' && viewMode === 'scroll' && <ScrollView key={scrollViewKey} />}

      {/* ── Window area — fills remaining height ──────────────────── */}
      <div
        ref={windowAreaRef}
        style={{
          flex:          1,
          position:      'relative',
          overflowX:     'hidden',
          overflowY:     isMobile ? 'auto' : 'hidden',
          scrollbarWidth:'none',
          display:       'none',
        }}
      >
        {/* ── Inner canvas — gives absolute-positioned children a scrollable height context */}
        <div style={{ position: 'relative', width: '100%', minHeight: isMobile ? mobileCanvasH : '100%' }}>

        {/* ── Headline above the terminal window ───────────────────── */}
        {!isMobile && (() => {
          const termWin = wins.find(w => w.id === 'terminal');
          if (!termWin) return null;
          return (
            <p style={{
              position:      'absolute',
              left:           termWin.x,
              top:            termWin.y - HEADLINE_H,
              width:          termWin.w,
              margin:         0,
              fontFamily:    'var(--font-mono)',
              fontSize:      '1.9rem',
              fontWeight:     600,
              lineHeight:     1.3,
              color:         'var(--color-text-ui)',
              textAlign:     'center',
              userSelect:    'none',
              pointerEvents: 'none',
            }}>
              Your whole stack, provisioned instantly and managed centrally.
            </p>
          );
        })()}

        <AnimatePresence>
        {wins.map(win => {
            const partnerName = win.id.startsWith('partner:') ? win.id.slice('partner:'.length) : null;
            const partner     = partnerName ? PARTNERS.find(p => p.name === partnerName) : null;
            const maxZ        = Math.max(...wins.map(w => w.zIndex));

            const isEcosystem  = win.id === 'ecosystem';
            const isWhy        = win.id === 'why';
            const isActive     = win.zIndex === maxZ;
            const darkBg       = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

            return (
              <Window
                key={win.id}
                title={getTitle(win.id)}
                noScroll={isNoScroll(win.id)}
                isActive={isActive}
                x={win.x}
                y={win.y}
                w={win.w}
                h={win.h}
                zIndex={win.zIndex}
                background={darkBg}
                headerRight={win.id === 'terminal' ? (
                  <button
                    aria-label='Reset terminal'
                    onClick={e => { e.stopPropagation(); setTerminalKey(k => k + 1); }}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      background: 'none',
                      border:     'none',
                      padding:     0,
                      cursor:     'pointer',
                      color:      'var(--color-text-ui-muted)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-ui)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-ui-muted)')}
                  >
                    <RotateCcw size={10} strokeWidth={1.5} />
                  </button>
                ) : isEcosystem ? (
                  <EcoFilterButton activeFilter={ecoFilter} onFilter={setEcoFilter} />
                ) : isWhy ? (
                  <button
                    aria-label='Shuffle'
                    onClick={e => { e.stopPropagation(); featuresRef.current?.shuffle?.(); }}
                    style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-text-ui-muted)' }}
                  >
                    <Shuffle size={10} strokeWidth={1.5} />
                  </button>
                ) : undefined}
                onFocus={() => bringToFront(win.id)}
                onMove={(x, y) => handleMove(win.id, x, y)}
                onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
              >
                {win.id === 'terminal'  && (
                  <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {draggingPartner && (
                      <div aria-hidden style={{
                        position:     'absolute',
                        inset:         0,
                        zIndex:        10,
                        background:   'var(--color-pink)',
                        opacity:       0.1,
                        pointerEvents:'none',
                      }} />
                    )}
                    <TerminalContent key={terminalKey} ref={cliRef} />
                  </div>
                )}
                {win.id === 'install'   && <InstallWindow />}
                {win.id === 'why'       && <FeaturesContent ref={featuresRef} />}
                {win.id === 'ecosystem' && (
                  <EcosystemIcons
                    ref={ecoRef}
                    onOpen={openPartner}
                    onOpenJoin={() => openCoreWindow('join')}
                    onCrossDragStart={p => setDraggingPartner(p)}
                    onCrossDragMove={(x, y) => setGhostPos({ x, y })}
                    onCrossDragEnd={handleCrossDragEnd}
                    activeFilter={ecoFilter}
                  />
                )}
                {win.id === 'users'     && <UsersContent />}
                {win.id === 'feedback'  && <FeedbackContent key={feedbackKey} />}
                {win.id === 'join'      && <JoinContent />}
                {partner && (
                  <PartnerDetail
                    partner={partner}
                    onShowMe={cmd => { cliRef.current?.submit(cmd); bringToFront('terminal'); }}
                  />
                )}
              </Window>
            );
        })}
        </AnimatePresence>
        </div>{/* end inner canvas */}
      </div>
    </div>
  );
}

/* ── Users / testimonials window content ─────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Stripe Projects completely changed how I spin up new services. What used to take a full day of config is now a single command.",
    name:  "Priya Nambiar",
    role:  "Staff Engineer, Vercel",
  },
  {
    quote: "The ecosystem integrations are killer. I dropped in Supabase and Redis in under two minutes. The CLI just works.",
    name:  "Marcus Weil",
    role:  "Founding Engineer, Loom",
  },
  {
    quote: "Finally a developer tool that doesn't make me feel like I'm fighting it. The terminal window alone is worth the install.",
    name:  "Anya Solberg",
    role:  "Senior SWE, Linear",
  },
  {
    quote: "We standardized our entire team on Stripe Projects. Onboarding a new service went from a two-day ordeal to about fifteen minutes.",
    name:  "Daniel Osei",
    role:  "Platform Lead, Retool",
  },
  {
    quote: "Honestly surprised this is free. The DX is better than tools I've paid thousands for.",
    name:  "Camille Tran",
    role:  "CTO, Meridian Labs",
  },
  {
    quote: "The `projects service add` command is pure magic. My whole infra is version-controlled and reproducible now.",
    name:  "Soren Holt",
    role:  "DevOps Engineer, Shopify",
  },
];

function UsersContent() {
  return (
    <div style={{
      padding:       '1.25rem 1.25rem 1.5rem',
      fontFamily:    'var(--font-mono)',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.75rem',
      overflowY:     'auto',
      scrollbarWidth:'none',
    }}>
      <p style={{
        margin:        0,
        fontSize:      '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color:         'var(--color-text-ui-subtle)',
        paddingBottom: '0.25rem',
        borderBottom:  '1px solid var(--color-border-accent)',
      }}>
        {TESTIMONIALS.length} entries
      </p>

      {TESTIMONIALS.map((t, i) => (
        <div
          key={i}
          style={{
            padding:      '0.85rem 1rem',
            background:   'var(--color-surface-2)',
            border:       '1px solid var(--color-border-accent)',
            display:      'flex',
            flexDirection:'column',
            gap:          '0.6rem',
          }}
        >
          <p style={{
            margin:     0,
            fontSize:   '0.75rem',
            color:      'var(--color-text-ui)',
            lineHeight: 1.65,
            fontStyle:  'italic',
          }}>
            "{t.quote}"
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontSize:   '0.65rem',
              fontWeight: 700,
              color:      'var(--color-pink)',
            }}>
              {t.name}
            </span>
            <span style={{
              fontSize:   '0.6rem',
              color:      'var(--color-text-ui-subtle)',
            }}>
              — {t.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Feedback window content ──────────────────────────────────────── */
function FeedbackContent() {
  const [text, setText]       = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle');
  const [thanked, setThanked] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || status !== 'idle') return;
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
    await new Promise(r => setTimeout(r, 800));
    setThanked(true);
  }

  if (thanked) {
    return (
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '2rem',
        gap:            '1rem',
      }}>
        <img
          src='/thankyou.png'
          alt='thank you'
          draggable={false}
          style={{ width: 80, height: 80, imageRendering: 'pixelated' }}
        />
        <p style={{
          margin:     0,
          fontFamily: 'var(--font-mono)',
          fontSize:   '0.8rem',
          color:      'var(--color-text-ui)',
          textAlign:  'center',
          lineHeight: 1.6,
        }}>
          Thanks for the feedback.
        </p>
      </div>
    );
  }

  const submitLabel =
    status === 'sending' ? 'Sending...' :
    status === 'sent'    ? 'Sent'       :
    'Send feedback';

  const btnColor =
    status === 'sent'    ? 'var(--color-yellow)' :
    status === 'sending' ? 'var(--color-text-ui-muted)' :
    'var(--color-pink)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-mono)' }}>
      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65 }}>
          Let us know what you think about projects. What's good? What's not so good? What would you change? What works well for you?
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          rows={6}
          style={{
            resize:     'none',
            background: 'var(--color-surface-2)',
            border:     '1px solid var(--color-border-accent)',
            outline:    'none',
            color:      'var(--color-text-ui)',
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.78rem',
            lineHeight: 1.65,
            padding:    '0.6rem 0.75rem',
            caretColor: 'var(--color-pink)',
            width:      '100%',
            boxSizing:  'border-box',
          }}
        />

        <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--color-text-ui-subtle)', lineHeight: 1.6 }}>
          Have a specific issue?{' '}
          <a href='https://stripe.com/docs' target='_blank' rel='noreferrer'
            style={{ color: 'var(--color-pink)', textDecoration: 'none' }}>
            Contact support
          </a>
          {' '}or{' '}
          <a href='https://stripe.com/docs' target='_blank' rel='noreferrer'
            style={{ color: 'var(--color-pink)', textDecoration: 'none' }}>
            read our docs
          </a>.
        </p>
      </div>

      {/* button bar — same height as install Copy button */}
      <div style={{
        borderTop:      '1px solid var(--color-border-accent)',
        padding:        '0.6rem',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          style={{
            background: 'none',
            border:     'none',
            padding:    0,
            color:      btnColor,
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.8rem',
            cursor:     status === 'idle' ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Join window content ──────────────────────────────────────────── */
const JOIN_CATEGORIES = ['payments', 'auth', 'database', 'storage', 'monitoring', 'analytics', 'ai', 'hosting', 'other'] as const;

export function JoinContent() {
  const [category, setCategory] = useState('');
  const [name,     setName]     = useState('');
  const [url,      setUrl]      = useState('');
  const [status,   setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle');
  const [thanked,  setThanked]  = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !url.trim() || status !== 'idle') return;
    setStatus('sending');
    const subject = encodeURIComponent('Provider Suggestion');
    const body = encodeURIComponent(
      `Category: ${category || 'not specified'}\nName: ${name.trim()}\nURL: ${url.trim()}`
    );
    window.location.href = `mailto:provider-request@stripe.com?subject=${subject}&body=${body}`;
    await new Promise(r => setTimeout(r, 800));
    setStatus('sent');
    await new Promise(r => setTimeout(r, 800));
    setThanked(true);
  }

  if (thanked) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', gap: '1rem',
      }}>
        <img
          src='/thankyou.png'
          alt='thank you'
          draggable={false}
          style={{ width: 80, height: 80, imageRendering: 'pixelated' }}
        />
        <p style={{
          margin: 0, fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem', color: 'var(--color-text-ui)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Thanks! We'll be in touch.
        </p>
      </div>
    );
  }

  const submitLabel =
    status === 'sending' ? 'Submitting...' :
    status === 'sent'    ? 'Submitted'     :
    'Submit';

  const btnColor =
    status === 'sent'    ? 'var(--color-yellow)'        :
    status === 'sending' ? 'var(--color-text-ui-muted)' :
    'var(--color-pink)';

  const inputStyle: CSSProperties = {
    background:  'var(--color-surface-2)',
    border:      '1px solid var(--color-border-accent)',
    outline:     'none',
    color:       'var(--color-text-ui)',
    fontFamily:  'var(--font-mono)',
    fontSize:    '0.78rem',
    lineHeight:   1.65,
    padding:     '0.5rem 0.75rem',
    caretColor:  'var(--color-pink)',
    width:       '100%',
    boxSizing:   'border-box',
  };

  const labelStyle: CSSProperties = {
    margin:         0,
    fontSize:       '0.6rem',
    textTransform:  'uppercase',
    letterSpacing:  '0.1em',
    color:          'var(--color-text-ui-subtle)',
    marginBottom:   '0.3rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-mono)' }}>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>Category</p>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          >
            <option value="">Select a category</option>
            {JOIN_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>Project or company</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>URL</p>
          <input
            type="url"
            placeholder="https://"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            style={inputStyle}
          />
        </div>

      </div>

      <div style={{
        borderTop:      '1px solid var(--color-border-accent)',
        padding:        '0.6rem',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          style={{
            background: 'none',
            border:     'none',
            padding:    0,
            color:      btnColor,
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.8rem',
            cursor:     status === 'idle' ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Terminal window content: just the CLI ────────────────────────── */
const TerminalContent = forwardRef<CliHandle>(function TerminalContent(_, ref) {
  return <CliTerminal ref={ref} installDemo autoSubmit />;
});

