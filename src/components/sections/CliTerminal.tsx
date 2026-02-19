import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  type KeyboardEvent as KE,
} from 'react';
import { motion } from 'motion/react';
import { TextEffect } from '@/components/ui/text-effect';

/* ─── tokens ─────────────────────────────────────────────────────── */
const PINK   = 'var(--color-pink)';
const MUTED  = 'var(--color-text-ui-muted)';
const DIM    = 'var(--color-text-ui-subtle)';
const BORDER = '1px solid var(--color-border-accent)';

/* ─── types ──────────────────────────────────────────────────────── */
type LT = 'cmd' | 'step' | 'sub' | 'done' | 'url' | 'blank' | 'kv' | 'section' | 'hint' | 'err';

interface Line {
  id: number;
  t: LT;
  text: string;
  lkey?: string;   // key column for kv lines
  initial?: boolean; // use TextEffect on entry
}

/* ─── uid counter ────────────────────────────────────────────────── */
let _uid = 100; // start high to avoid boot/dynamic ID clash
const uid = () => _uid++;

/* ─── boot sequence ──────────────────────────────────────────────── */
const BOOT: Array<Line & { showAt: number }> = [
  { id: 0,  t: 'cmd',   text: 'stripe projects init',                         initial: true, showAt: 0    },
  { id: 1,  t: 'blank', text: '',                                                            showAt: 200  },
  { id: 2,  t: 'step',  text: 'install stripe projects',                       initial: true, showAt: 550  },
  { id: 3,  t: 'step',  text: 'select your desired tech stack',                initial: true, showAt: 1100 },
  { id: 4,  t: 'sub',   text: 'frontend with vercel',                          initial: true, showAt: 1500 },
  { id: 5,  t: 'sub',   text: 'auth with clerk',                               initial: true, showAt: 1750 },
  { id: 6,  t: 'sub',   text: 'storage with supabase',                         initial: true, showAt: 2000 },
  { id: 7,  t: 'sub',   text: 'payments with stripe',                          initial: true, showAt: 2250 },
  { id: 8,  t: 'sub',   text: 'analytics with posthog',                        initial: true, showAt: 2500 },
  { id: 9,  t: 'blank', text: '',                                                            showAt: 2750 },
  { id: 10, t: 'done',  text: 'automatically created and provisioned for you', initial: true, showAt: 3000 },
  { id: 11, t: 'url',   text: 'app running at localhost:9999',                 initial: true, showAt: 3600 },
];

/* ─── command responses ──────────────────────────────────────────── */
function respond(input: string): Line[] {
  switch (input.trim().toLowerCase()) {
    case '/partners':
      return [
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'section', text: 'supported partners' },
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'kv', lkey: 'stripe',      text: 'payments processing'   },
        { id: uid(), t: 'kv', lkey: 'clerk',       text: 'authentication'        },
        { id: uid(), t: 'kv', lkey: 'supabase',    text: 'storage & database'    },
        { id: uid(), t: 'kv', lkey: 'posthog',     text: 'product analytics'     },
        { id: uid(), t: 'kv', lkey: 'neon',        text: 'serverless postgres'   },
        { id: uid(), t: 'kv', lkey: 'sentry',      text: 'error monitoring'      },
        { id: uid(), t: 'kv', lkey: 'chroma',      text: 'vector database'       },
        { id: uid(), t: 'kv', lkey: 'planetscale', text: 'mysql platform'        },
        { id: uid(), t: 'kv', lkey: 'railway',     text: 'cloud deployment'      },
        { id: uid(), t: 'kv', lkey: 'vercel',      text: 'frontend hosting'      },
        { id: uid(), t: 'blank',   text: '' },
      ];

    case '/stack':
      return [
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'section', text: 'available stacks' },
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'step', text: 'web  — next.js · vercel · supabase · clerk'   },
        { id: uid(), t: 'step', text: 'saas — remix · railway · neon · stripe'        },
        { id: uid(), t: 'step', text: 'ai   — next.js · vercel · chroma · openai'    },
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'hint', text: 'use /partners to see all available integrations' },
        { id: uid(), t: 'blank',   text: '' },
      ];

    case '/help':
      return [
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'section', text: 'commands' },
        { id: uid(), t: 'blank',   text: '' },
        { id: uid(), t: 'kv', lkey: '/partners', text: 'list all supported partners'  },
        { id: uid(), t: 'kv', lkey: '/stack',    text: 'view available tech stacks'   },
        { id: uid(), t: 'kv', lkey: '/clear',    text: 'clear the terminal'           },
        { id: uid(), t: 'kv', lkey: '/help',     text: 'show this message'            },
        { id: uid(), t: 'blank',   text: '' },
      ];

    case '/clear':
      return []; // handled separately in submit()

    default:
      return [
        { id: uid(), t: 'blank', text: '' },
        { id: uid(), t: 'err',   text: `command not found: ${input.trim()}` },
        { id: uid(), t: 'hint',  text: 'type /help to see available commands' },
        { id: uid(), t: 'blank', text: '' },
      ];
  }
}

/* ─── line style lookup ──────────────────────────────────────────── */
const LINE_PROPS: Record<LT, { prefix: string; prefixColor: string; textColor: string; indent: boolean }> = {
  cmd:     { prefix: '$',  prefixColor: PINK,       textColor: 'var(--color-text-ui)',  indent: false },
  step:    { prefix: '·',  prefixColor: MUTED,      textColor: 'var(--color-text-ui)',  indent: false },
  sub:     { prefix: '↳',  prefixColor: DIM,        textColor: MUTED,                   indent: true  },
  done:    { prefix: '✓',  prefixColor: '#4ade80',  textColor: 'var(--color-text-ui)',   indent: false },
  url:     { prefix: '▸',  prefixColor: PINK,       textColor: PINK,                    indent: false },
  blank:   { prefix: '',   prefixColor: '',         textColor: '',                      indent: false },
  kv:      { prefix: '',   prefixColor: '',         textColor: MUTED,                   indent: false },
  section: { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  hint:    { prefix: '',   prefixColor: '',         textColor: DIM,                     indent: false },
  err:     { prefix: '✗',  prefixColor: '#f87171',  textColor: '#f87171',               indent: false },
};

/* ─── stable animation targets (must not be inline objects — prevents
       framer-motion from seeing a new reference on every parent re-render
       and re-firing the animation, which causes blinking when typing) ── */
const ANIM_TARGET     = { opacity: 1, y: 0 }  as const;
const ANIM_INIT_NEW   = { opacity: 0, y: 5 }  as const;
const ANIM_INIT_BOOT  = { opacity: 1 }         as const;

/* ─── individual line renderer ────────────────────────────────────── */
// memo prevents re-renders when only the input `value` state changes
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
      {/* prefix glyph */}
      {prefix && (
        <span style={{ color: prefixColor, flexShrink: 0, userSelect: 'none', minWidth: '1ch' }}>
          {prefix}
        </span>
      )}

      {/* content */}
      {line.t === 'kv' ? (
        /* key-value grid: rendered directly (multi-color, no TextEffect) */
        <span style={{ display: 'inline-grid', gridTemplateColumns: '9em 1fr', gap: '1.5em', width: '100%' }}>
          <span style={{ color: PINK }}>{line.lkey}</span>
          <span style={{ color: MUTED }}>{line.text}</span>
        </span>
      ) : line.t === 'section' ? (
        <span style={{
          color: DIM,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '0.72em',
        }}>
          {line.text}
        </span>
      ) : line.t === 'hint' ? (
        <span style={{ color: DIM, fontStyle: 'italic' }}>{line.text}</span>
      ) : line.initial ? (
        /* initial boot lines — use TextEffect word-by-word fade */
        <TextEffect
          as='span'
          per='word'
          preset='fade'
          speedReveal={2.5}
          style={{ color: textColor }}
        >
          {line.text}
        </TextEffect>
      ) : (
        /* dynamic lines — plain span (motion.div wrapper handles animation) */
        <span style={{ color: textColor }}>{line.text}</span>
      )}
    </motion.div>
  );
});

/* ─── main component ─────────────────────────────────────────────── */
export function CliTerminal() {
  const [lines, setLines]   = useState<Line[]>([]);
  const [value, setValue]   = useState('');
  const outputRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);
  const historyRef          = useRef<string[]>([]);
  const histIdxRef          = useRef(-1);

  /* progressive reveal of boot sequence */
  useEffect(() => {
    const ts = BOOT.map(({ showAt, ...line }) =>
      setTimeout(() => setLines(prev => [...prev, line as Line]), showAt)
    );
    return () => ts.forEach(clearTimeout);
  }, []);

  /* auto-scroll output to bottom whenever lines change */
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  /* command submission */
  const submit = useCallback(() => {
    const val = value.trim();
    if (!val) return;

    /* save to history */
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

  const onKeyDown = (e: KE<HTMLInputElement>) => {
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
      {/*
        Display: flex + flex-direction: column lets the spacer push
        content to the bottom. When content overflows the container,
        the spacer shrinks to 0 and auto-scroll handles the rest.
      */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none',
          fontSize: '14px',
        }}
      >
        {/* spacer — pushes lines to the bottom when content is short */}
        <div style={{ flex: 1 }} />

        {/* actual lines, padded identically to the input row */}
        <div style={{ padding: 'clamp(1.75rem, 5vw, 2.5rem) clamp(1.5rem, 5vw, 4rem)' }}>
          {lines.map(line => (
            <LineRow key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* ── input row ────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: BORDER,
          padding: 'clamp(0.8rem, 1.5vw, 1.1rem) clamp(1.5rem, 5vw, 4rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '14px',
          flexShrink: 0,
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
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-ui)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            caretColor: PINK,
            letterSpacing: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
