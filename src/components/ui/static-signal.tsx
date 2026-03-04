/* ── StaticSignal ──────────────────────────────────────────────────────────
   Browser port of the "static to signal" terminal-processing indicator.
   Characters emerge from block-glyph noise and dissolve back in random order,
   cycling through a shuffled word library indefinitely until unmounted.

   Phases per word:
     1. Noise     — N random glyphs, ~4-6 frames @ 75 ms
     2. Resolve   — chars appear in random batches of 1-3 @ 65 ms; newly
                    resolved chars render as 'resolving' (pink) for one frame,
                    then shift to 'resolved' (white) on the next
     3. Hold      — fully resolved word visible for 900 ms
     4. Dissolve  — chars revert to noise in random batches of 1-3 @ 55 ms,
                    going through 'fading' for one frame first
     5. Transition— noise field grows/shrinks one char at a time to match the
                    next word's width, @ 40 ms per character
────────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';

/* ── word library ──────────────────────────────────────────────────────────── */
const WORDS = [
  'flux-aligning',
  'tessellating',
  'partitioning',
  'folding',
  'multiplexing',
  'correlating',
  'convolving',
  'spanning',
  'fourier-transforming',
  'bifurcating',
  'quenching',
  'phase-shifting',
  'entropy-minimizing',
  'geodesicking',
  'quaternioning',
  'renormalizing',
  'lagrangifying',
  'monte-carloing',
  'superposing',
];

const GLYPHS = '▓▒░█▉▊▋▌▍▎▏▐▄▀▖▗▘▙▚▛▜▝▞▟';

/* ── types ─────────────────────────────────────────────────────────────────── */
type CS = 'noise' | 'resolving' | 'resolved' | 'fading';
interface AC { char: string; state: CS; }

/* ── helpers ───────────────────────────────────────────────────────────────── */
const rg  = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const noise = (n: number): AC[] => Array.from({ length: n }, () => ({ char: rg(), state: 'noise' as CS }));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── colors (mapped to terminal CSS variables) ──────────────────────────────── */
const COL: Record<CS, string> = {
  noise:     'var(--color-text-ui-subtle)',   // very dim
  resolving: 'var(--color-pink)',             // first-frame accent (signal emerging)
  resolved:  'var(--color-text-ui)',          // bright white
  fading:    'var(--color-text-ui-muted)',    // dimming on dissolve
};

/* ── component ─────────────────────────────────────────────────────────────── */
export function StaticSignal() {
  const [chars, setChars] = useState<AC[]>(() => noise(10));
  const dead = useRef(false);

  useEffect(() => {
    dead.current = false;

    /* Cancellable sleep — resolves immediately if component has unmounted */
    function sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function run() {
      const wordList = shuffle([...WORDS]);
      let wi = 0;

      while (!dead.current) {
        if (wi >= wordList.length) {
          wordList.splice(0, wordList.length, ...shuffle([...WORDS]));
          wi = 0;
        }

        const word     = wordList[wi];
        const fullWord = word + '…';
        const width    = fullWord.length;

        /* ── Phase 1: pure noise ─────────────────────────────────────────── */
        const noiseFrames = 4 + Math.floor(Math.random() * 3);
        for (let f = 0; f < noiseFrames && !dead.current; f++) {
          setChars(noise(width));
          await sleep(113);
        }
        if (dead.current) break;

        /* ── Phase 2: resolve in random order ───────────────────────────── */
        const resolveOrder = shuffle(Array.from({ length: width }, (_, i) => i));
        const resolved  = new Set<number>();
        const resolving = new Set<number>();
        let ri = 0;

        while (ri < resolveOrder.length && !dead.current) {
          const batch = Math.min(1 + Math.floor(Math.random() * 3), resolveOrder.length - ri);

          /* Promote last resolving batch → resolved */
          for (const x of resolving) resolved.add(x);
          resolving.clear();
          for (let b = 0; b < batch; b++) resolving.add(resolveOrder[ri + b]);
          ri += batch;

          setChars(Array.from({ length: width }, (_, i) => {
            if (resolved.has(i))  return { char: fullWord[i], state: 'resolved'  };
            if (resolving.has(i)) return { char: fullWord[i], state: 'resolving' };
            return { char: rg(), state: 'noise' };
          }));
          await sleep(98);
        }
        if (dead.current) break;

        /* Flush final resolving batch */
        for (const x of resolving) resolved.add(x);
        setChars(Array.from({ length: width }, (_, i) => ({ char: fullWord[i], state: 'resolved' })));

        /* ── Phase 3: hold ───────────────────────────────────────────────── */
        await sleep(900);
        if (dead.current) break;

        /* ── Phase 4: dissolve in random order ───────────────────────────── */
        const dissolveOrder = shuffle(Array.from({ length: width }, (_, i) => i));
        const fading = new Set<number>();
        const gone   = new Set<number>();
        let di = 0;

        while (di < dissolveOrder.length && !dead.current) {
          const batch = Math.min(1 + Math.floor(Math.random() * 3), dissolveOrder.length - di);

          /* Promote last fading batch → gone (noise) */
          for (const x of fading) gone.add(x);
          fading.clear();
          for (let b = 0; b < batch; b++) fading.add(dissolveOrder[di + b]);
          di += batch;

          setChars(Array.from({ length: width }, (_, i) => {
            if (gone.has(i))   return { char: rg(),       state: 'noise'    };
            if (fading.has(i)) return { char: fullWord[i], state: 'fading'   };
            return                    { char: fullWord[i], state: 'resolved' };
          }));
          await sleep(83);
        }
        if (dead.current) break;

        /* ── Phase 5: width transition to next word ──────────────────────── */
        const nextWord  = wordList[(wi + 1) % wordList.length] ?? wordList[0];
        const nextWidth = (nextWord + '…').length;

        if (nextWidth !== width) {
          const dir = nextWidth > width ? 1 : -1;
          let w = width;
          while (w !== nextWidth && !dead.current) {
            w += dir;
            setChars(noise(w));
            await sleep(60);
          }
        } else {
          setChars(noise(width));
          await sleep(90);
        }

        wi++;
      }
    }

    run();

    return () => { dead.current = true; };
  }, []);

  return (
    <span
      style={{
        whiteSpace:    'pre',
        fontFamily:    'inherit',
        fontSize:      'inherit',
        letterSpacing: '0.02em',
        lineHeight:    'inherit',
      }}
      aria-label='processing'
      aria-live='off'
    >
      {chars.map((c, i) => (
        <span key={i} style={{ color: COL[c.state] }}>{c.char}</span>
      ))}
    </span>
  );
}
