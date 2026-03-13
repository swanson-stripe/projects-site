/* ── Helm Wave animated gradient mesh background ─────────────────────
   Color order (bottom → top): purple → pink → warm peach/orange → white.
   Radial ellipse anchored at bottom-center creates a subtle upward arc
   so the center sits higher than the edges, preventing linear banding.
   Soft mask fades the top edge into white. Slow sine-wave drift.
────────────────────────────────────────────────────────────────────── */
export function HelmWaveBackground() {
  return (
    <div
      aria-hidden
      style={{
        position:      'absolute',
        inset:          0,
        zIndex:         0,
        pointerEvents: 'none',
        background:    '#FFFFFF',
        overflow:      'hidden',
      }}
    >
      {/* Gradient region — bottom 72%, soft mask at the top edge */}
      <div
        style={{
          position: 'absolute',
          left:      0,
          right:     0,
          bottom:    0,
          height:   '72%',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%)',
          maskImage:       'linear-gradient(to bottom, transparent 0%, black 16%)',
          overflow: 'hidden',
        }}
      >
        {/* Wave container — 112% wide for clean sine drift */}
        <div
          style={{
            position:  'absolute',
            left:      '-6%',
            top:        0,
            width:     '112%',
            height:    '115%',
            filter:    'blur(55px)',
            animation: 'helm-wave 14s linear infinite',
          }}
        >
          {/* Arced gradient: ellipse anchored at bottom-center creates a dome
              so the center rises higher than the edges — no flat banding. */}
          <div
            style={{
              position:   'absolute',
              inset:       0,
              background: [
                'radial-gradient(ellipse 180% 92% at 50% 100%,',
                '  rgba(130, 85, 220, 1.00)  0%,',   /* blurple — floor */
                '  rgba(215, 90, 165, 0.90) 30%,',   /* pink */
                '  rgba(250, 165, 100, 0.78) 62%,',  /* warm peach-orange */
                '  transparent               88%',   /* fades to white */
                ')',
              ].join(' '),
            }}
          />
        </div>
      </div>
    </div>
  );
}
