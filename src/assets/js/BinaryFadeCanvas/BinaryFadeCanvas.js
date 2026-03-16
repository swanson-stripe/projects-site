/**
 * BinaryFadeCanvas – fills a canvas with binary digits that subtly fade in/out in tapered clusters.
 * Usage: mount on a container with data-js-target="binary-fade-canvas" (canvas is created inside).
 *
 * Data attributes:
 *   data-wave-colors           "true" | "1" to lerp text color through wave-like palette
 *   data-cell-width             number (default 14)
 *   data-cell-height            number (default 18)
 *   data-font-size              number (default 13)
 *   data-text-color             CSS color when wave-colors is off
 *   data-mouse-cluster-opacity  number 0–1, opacity boost at cursor on hover (default 0.42)
 *   data-mouse-hover-color      CSS color for digits under the hover cluster (default #533afd)
 */

const DEFAULT_OPTIONS = {
  cellWidth: 14,
  cellHeight: 18,
  fontSize: 13,
  fontFamily: 'ui-monospace, "SF Mono", Monaco, "Cascadia Mono", monospace',
  baseOpacity: 0.1,
  clusterOpacity: 0.35,
  numClusters: 12,
  clusterRadius: 280,
  phaseSpeedMin: 0.0004,
  phaseSpeedMax: 0.0012,
  clusterDriftAmp: 0.22,
  clusterDriftSpeed: 0.00055,
  textColor: 'currentColor',
  waveColors: false,
  waveColorLerpSpeed: 0.00035,
  flipSpeedBase: 0.0022,
  flipSpeedCluster: 0.004,
  mouseClusterRadius: 50,
  mouseClusterOpacity: 0.42,
  mouseHoverColor: '#533afd',
  mouseSmooth: 0.24,
  mouseTrail: 0.12,
  mouseTrailDecay: 0.88,
  mouseTrailMaxPoints: 55,
  burstRadiusMax: 70,
  burstRadiusGrowth: 5,
  burstDecay: 0.91,
  burstOpacity: 0.7,
};

/** Wave-like palette: brighter so they read on dark bg (similar to bloom wave). */
const WAVE_PALETTE = [
  [0.55, 0.75, 0.7, 1],   // soft green
  [0.5, 0.72, 0.78, 1],   // soft teal
  [0.7, 0.65, 0.85, 1],   // soft lavender
  [0.8, 0.6, 0.7, 1],     // soft pink
  [0.6, 0.75, 0.82, 1],   // soft blue-green
  [0.68, 0.65, 0.82, 1],  // soft violet
].map(([r, g, b, a]) => ({ r, g, b, a }));

/**
 * Simple seeded pseudo-random for reproducible cluster positions (optional).
 */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Soft tapered falloff: 1 at center, gentle Gaussian-style fade so clusters stay bright
 * over a large area then ease off gradually (large, more tapered).
 */
function taperWeight(dist, radius) {
  const r = Math.max(radius, 1);
  const x = dist / r;
  return Math.exp(-2.2 * x * x);
}

/** Parse CSS color to normalized rgba [0-1]. */
function parseColorToRgba(str) {
  if (!str || typeof str !== 'string') return { r: 1, g: 1, b: 1, a: 1 };
  str = str.trim();
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.exec(str);
  if (hex) {
    const s = hex[1];
    const n = s.length;
    const v = (i) => {
      const part = n === 3 ? s.slice(i, i + 1).padEnd(2, s[i]) : s.slice(i * 2, i * 2 + 2);
      return parseInt(part, 16) / (n === 3 ? 15 : 255);
    };
    return { r: v(0), g: v(1), b: v(2), a: n === 8 ? v(3) : 1 };
  }
  const rgba = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(str);
  if (rgba) {
    return {
      r: Math.min(1, parseFloat(rgba[1]) / 255),
      g: Math.min(1, parseFloat(rgba[2]) / 255),
      b: Math.min(1, parseFloat(rgba[3]) / 255),
      a: rgba[4] != null ? parseFloat(rgba[4]) : 1,
    };
  }
  return { r: 1, g: 1, b: 1, a: 1 };
}

function lerpRgba(a, b, t) {
  const s = 1 - t;
  return {
    r: a.r * s + b.r * t,
    g: a.g * s + b.g * t,
    b: a.b * s + b.b * t,
    a: a.a * s + b.a * t,
  };
}

function rgbaToCss({ r, g, b, a }) {
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`;
}

/** Global time for wave color (so all instances stay in sync). */
let waveColorTime = 0;

export class BinaryFadeCanvas {
  constructor(container, options = {}) {
    if (!container) return;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cells = [];
    this.clusters = [];
    this.raf = null;
    this.resizeObserver = null;
    this.rng = mulberry32(0x1a2b3c4d);
    this.initialized = false;
    this.driftTime = 0;
    this.mouseX = null;
    this.mouseY = null;
    this.smoothMouseX = null;
    this.smoothMouseY = null;
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.mouseStrength = 0;
    this.mouseOver = false;
    this.mouseOverlayEls = [];
    this.mouseBound = false;
    this.logicalWidth = 0;
    this.logicalHeight = 0;
    this.mouseTrail = [];
    this.bursts = [];
  }

  init() {
    if (this.initialized) return;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'auto';
    this.canvas.style.cursor = 'default';
    this.container.appendChild(this.canvas);
    this.bindMouse();
    this.ctx = this.canvas.getContext('2d');
    this.buildClusters();
    this.resize();
    this.initialized = true;
    if (this.resizeObserver == null && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.container);
    }
    this.tick();
  }

  buildClusters() {
    const { numClusters, clusterDriftAmp, clusterDriftSpeed } = this.options;
    this.clusters = [];
    for (let i = 0; i < numClusters; i++) {
      const baseX = this.rng();
      const baseY = this.rng();
      this.clusters.push({
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        phase: this.rng(),
        phaseSpeed: this.options.phaseSpeedMin + this.rng() * (this.options.phaseSpeedMax - this.options.phaseSpeedMin),
        direction: this.rng() > 0.5 ? 1 : -1,
        driftPhaseX: this.rng() * Math.PI * 2,
        driftPhaseY: this.rng() * Math.PI * 2,
        driftFreqX: 0.4 + this.rng() * 0.5,
        driftFreqY: 0.35 + this.rng() * 0.5,
      });
    }
  }

  buildCells() {
    this.cells = [];
    const { cellWidth, cellHeight } = this.options;
    const w = this.logicalWidth || this.canvas.width;
    const h = this.logicalHeight || this.canvas.height;
    const cols = Math.max(1, Math.floor(w / cellWidth));
    const rows = Math.max(1, Math.floor(h / cellHeight));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        this.cells.push({
          x,
          y,
          char: this.rng() > 0.5 ? '1' : '0',
          flipPhase: this.rng(),
        });
      }
    }
  }

  bindMouse() {
    if (!this.canvas || this.mouseBound) return;
    const toCanvas = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const lw = this.logicalWidth || rect.width;
      const lh = this.logicalHeight || rect.height;
      return {
        x: (e.clientX - rect.left) * (lw / rect.width),
        y: (e.clientY - rect.top) * (lh / rect.height),
      };
    };
    const isHoverTarget = (el) => {
      if (!el) return false;
      return el === this.canvas || this.mouseOverlayEls.includes(el) || this.mouseOverlayEls.some((o) => o.contains(el));
    };
    this._onMouseEnter = () => {
      this.mouseOver = true;
    };
    this._onMouseLeave = (e) => {
      if (!isHoverTarget(e.relatedTarget)) this.mouseOver = false;
    };
    this._onMouseMove = (e) => {
      const p = toCanvas(e);
      this.mouseX = p.x;
      this.mouseY = p.y;
    };
    this._onClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const lw = this.logicalWidth || rect.width || 1;
      const lh = this.logicalHeight || rect.height || 1;
      const scaleX = rect.width ? lw / rect.width : 1;
      const scaleY = rect.height ? lh / rect.height : 1;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const initialRadius = Math.min(25, (this.options.burstRadiusMax ?? 70) * 0.4);
      this.bursts.push({ x, y, radius: initialRadius, strength: 1 });
    };

    this.canvas.addEventListener('mouseenter', this._onMouseEnter);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('click', this._onClick);

    const parent = this.container.parentElement;
    const overlays = parent ? parent.querySelectorAll('[data-page-contents]') : [];
    this.mouseOverlayEls = Array.from(overlays);
    this.mouseOverlayEls.forEach((el) => {
      el.addEventListener('mouseenter', this._onMouseEnter);
      el.addEventListener('mouseleave', this._onMouseLeave);
      el.addEventListener('mousemove', this._onMouseMove);
      el.addEventListener('click', this._onClick);
    });
    this.mouseBound = true;
  }

  unbindMouse() {
    if (!this.mouseBound) return;
    if (this.canvas) {
      this.canvas.removeEventListener('mouseenter', this._onMouseEnter);
      this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
      this.canvas.removeEventListener('click', this._onClick);
    }
    this.mouseOverlayEls.forEach((el) => {
      el.removeEventListener('mouseenter', this._onMouseEnter);
      el.removeEventListener('mouseleave', this._onMouseLeave);
      el.removeEventListener('mousemove', this._onMouseMove);
      el.removeEventListener('click', this._onClick);
    });
    this.mouseOverlayEls = [];
    this.mouseBound = false;
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lw = Math.max(1, Math.floor(rect.width));
    const lh = Math.max(1, Math.floor(rect.height));
    const bufW = Math.max(1, Math.floor(rect.width * dpr));
    const bufH = Math.max(1, Math.floor(rect.height * dpr));
    if (this.canvas.width !== bufW || this.canvas.height !== bufH) {
      this.canvas.width = bufW;
      this.canvas.height = bufH;
      this.logicalWidth = lw;
      this.logicalHeight = lh;
      this.buildCells();
    }
    this.logicalWidth = lw;
    this.logicalHeight = lh;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  getCellOpacity(cell) {
    const { baseOpacity, mouseClusterRadius, mouseClusterOpacity, burstOpacity } = this.options;
    let add = 0;
    for (const p of this.mouseTrail) {
      const dist = Math.hypot(cell.x - p.x, cell.y - p.y);
      add += taperWeight(dist, mouseClusterRadius) * p.strength * mouseClusterOpacity;
    }
    if (this.smoothMouseX != null && this.smoothMouseY != null && this.mouseStrength > 0.001) {
      const dist = Math.hypot(cell.x - this.smoothMouseX, cell.y - this.smoothMouseY);
      add += taperWeight(dist, mouseClusterRadius) * this.mouseStrength * mouseClusterOpacity;
    }
    for (const b of this.bursts) {
      const dist = Math.hypot(cell.x - b.x, cell.y - b.y);
      add += taperWeight(dist, b.radius) * b.strength * (burstOpacity ?? 0.55);
    }
    return Math.min(1, baseOpacity + add);
  }

  /** Mouse cluster influence 0..1 for this cell (head + trail). */
  getMouseInfluence(cell) {
    const { mouseClusterRadius } = this.options;
    let influence = 0;
    for (const p of this.mouseTrail) {
      const dist = Math.hypot(cell.x - p.x, cell.y - p.y);
      influence += taperWeight(dist, mouseClusterRadius) * p.strength;
    }
    if (this.smoothMouseX != null && this.smoothMouseY != null && this.mouseStrength > 0.001) {
      const dist = Math.hypot(cell.x - this.smoothMouseX, cell.y - this.smoothMouseY);
      influence += taperWeight(dist, mouseClusterRadius) * this.mouseStrength;
    }
    return Math.min(1, influence);
  }

  /** Click burst influence 0..1 for this cell (blurple tint). */
  getBurstInfluence(cell) {
    let influence = 0;
    for (const b of this.bursts) {
      const dist = Math.hypot(cell.x - b.x, cell.y - b.y);
      influence += taperWeight(dist, b.radius) * b.strength;
    }
    return Math.min(1, influence);
  }

  /** When waveColors is true, return lerped color for this cell (optional cluster tint). */
  getCellColor(cell) {
    const w = this.logicalWidth || this.canvas.width;
    const h = this.logicalHeight || this.canvas.height;
    let baseRgba;
    if (this.options.waveColors && WAVE_PALETTE.length) {
      const n = WAVE_PALETTE.length;
      const cycle = ((waveColorTime % 1) + 1) % 1;
      const idx = cycle * n;
      const i0 = Math.floor(idx) % n;
      const i1 = (i0 + 1) % n;
      const t = idx - Math.floor(idx);
      const a = WAVE_PALETTE[i0];
      const b = WAVE_PALETTE[i1];
      let offset = 0;
      for (const c of this.clusters) {
        const cx = c.x * w;
        const cy = c.y * h;
        const dist = Math.hypot(cell.x - cx, cell.y - cy);
        const taper = taperWeight(dist, this.options.clusterRadius);
        offset += taper * (0.5 + 0.5 * Math.sin(c.phase * Math.PI * 2)) * 0.2;
      }
      const t2 = Math.max(0, Math.min(1, t + offset));
      baseRgba = lerpRgba(a, b, t2);
    } else {
      baseRgba = parseColorToRgba(this.options.textColor);
    }
    const mouseInfluence = this.getMouseInfluence(cell);
    const burstInfluence = this.getBurstInfluence(cell);
    const hoverInfluence = Math.min(1, mouseInfluence + burstInfluence);
    if (hoverInfluence > 0.001 && this.options.mouseHoverColor) {
      const hoverRgba = parseColorToRgba(this.options.mouseHoverColor);
      baseRgba = lerpRgba(baseRgba, hoverRgba, hoverInfluence);
    }
    baseRgba.a = 1;
    return rgbaToCss(baseRgba);
  }

  /** Cluster influence 0..1 for this cell (used for opacity and flip rate). */
  getClusterInfluence(cell) {
    const { clusterRadius } = this.options;
    const w = this.logicalWidth || this.canvas.width;
    const h = this.logicalHeight || this.canvas.height;
    let influence = 0;
    for (const c of this.clusters) {
      const cx = c.x * w;
      const cy = c.y * h;
      const dist = Math.hypot(cell.x - cx, cell.y - cy);
      const taper = taperWeight(dist, clusterRadius);
      const wave = 0.5 + 0.5 * Math.sin(c.phase * Math.PI * 2);
      influence += taper * wave;
    }
    return Math.min(1, influence);
  }

  /** Advance cell flip phases and flip 0/1 in tapered clusters. */
  updateCellChars() {
    const { flipSpeedBase, flipSpeedCluster } = this.options;
    for (const cell of this.cells) {
      const influence = this.getClusterInfluence(cell);
      const rate = flipSpeedBase + influence * flipSpeedCluster;
      cell.flipPhase = (cell.flipPhase || 0) + rate;
      if (cell.flipPhase >= 1) {
        cell.flipPhase = 0;
        cell.char = cell.char === '0' ? '1' : '0';
      }
    }
  }

  applyDataAttributes() {
    if (!this.container) return;
    const cw = parseNum(this.container.getAttribute('data-cell-width'), DEFAULT_OPTIONS.cellWidth);
    const ch = parseNum(this.container.getAttribute('data-cell-height'), DEFAULT_OPTIONS.cellHeight);
    const fs = parseNum(this.container.getAttribute('data-font-size'), DEFAULT_OPTIONS.fontSize);
    const wc = parseBool(this.container.getAttribute('data-wave-colors'));
    const mco = parseNum(this.container.getAttribute('data-mouse-cluster-opacity'), DEFAULT_OPTIONS.mouseClusterOpacity);
    const mhc = this.container.getAttribute('data-mouse-hover-color');
    const sizeChanged = this.options.cellWidth !== cw || this.options.cellHeight !== ch;
    this.options.cellWidth = cw;
    this.options.cellHeight = ch;
    this.options.fontSize = fs;
    this.options.waveColors = wc;
    this.options.mouseClusterOpacity = Math.max(0, Math.min(1, mco));
    if (mhc != null && mhc !== '') this.options.mouseHoverColor = String(mhc).trim();
    if (sizeChanged && this.canvas) {
      this.buildCells();
    }
  }

  tick = () => {
    if (!this.ctx || !this.canvas) return;
    this.applyDataAttributes();
    const lw = this.logicalWidth || this.canvas.width;
    const lh = this.logicalHeight || this.canvas.height;
    if (lw <= 0 || lh <= 0) {
      this.raf = requestAnimationFrame(this.tick);
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (this.options.waveColors) {
      waveColorTime += this.options.waveColorLerpSpeed;
    }

    const smooth = this.options.mouseSmooth ?? 0.065;
    const trail = this.options.mouseTrail ?? 0.35;
    this.mouseStrength += this.mouseOver ? 0.06 : -0.03;
    this.mouseStrength = Math.max(0, Math.min(1, this.mouseStrength));
    if (this.mouseOver && this.mouseX != null && this.mouseY != null) {
      let velX = 0;
      let velY = 0;
      if (this.lastMouseX != null && this.lastMouseY != null) {
        velX = this.mouseX - this.lastMouseX;
        velY = this.mouseY - this.lastMouseY;
      }
      if (this.smoothMouseX == null) this.smoothMouseX = this.mouseX;
      if (this.smoothMouseY == null) this.smoothMouseY = this.mouseY;
      this.smoothMouseX += (this.mouseX - this.smoothMouseX) * smooth + velX * trail;
      this.smoothMouseY += (this.mouseY - this.smoothMouseY) * smooth + velY * trail;
      this.lastMouseX = this.mouseX;
      this.lastMouseY = this.mouseY;
      this.mouseTrail.push({
        x: this.smoothMouseX,
        y: this.smoothMouseY,
        strength: 1,
      });
    } else {
      this.lastMouseX = null;
      this.lastMouseY = null;
    }
    const trailDecay = this.options.mouseTrailDecay ?? 0.88;
    const trailMax = this.options.mouseTrailMaxPoints ?? 55;
    this.mouseTrail.forEach((p) => {
      p.strength *= trailDecay;
    });
    this.mouseTrail = this.mouseTrail.filter((p) => p.strength >= 0.008);
    if (this.mouseTrail.length > trailMax) this.mouseTrail = this.mouseTrail.slice(-trailMax);

    const burstGrowth = this.options.burstRadiusGrowth ?? 5;
    const burstMaxR = this.options.burstRadiusMax ?? 70;
    const burstDecay = this.options.burstDecay ?? 0.91;
    this.bursts.forEach((b) => {
      b.radius = Math.min(b.radius + burstGrowth, burstMaxR);
      b.strength *= burstDecay;
    });
    this.bursts = this.bursts.filter((b) => b.strength >= 0.008);

    this.driftTime += this.options.clusterDriftSpeed ?? 0.00055;
    const amp = this.options.clusterDriftAmp ?? 0.22;

    for (const c of this.clusters) {
      c.x = c.baseX + amp * Math.sin(this.driftTime * c.driftFreqX + c.driftPhaseX);
      c.y = c.baseY + amp * Math.sin(this.driftTime * c.driftFreqY + c.driftPhaseY);
      c.x = (c.x % 1 + 1) % 1;
      c.y = (c.y % 1 + 1) % 1;

      c.phase += c.phaseSpeed * c.direction;
      if (c.phase <= 0) {
        c.phase = 0;
        c.direction = 1;
      } else if (c.phase >= 1) {
        c.phase = 1;
        c.direction = -1;
      }
    }

    this.updateCellChars();

    this.ctx.clearRect(0, 0, lw, lh);
    const { fontSize, fontFamily, cellWidth, cellHeight } = this.options;
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.imageSmoothingEnabled = false;

    for (const cell of this.cells) {
      const opacity = this.getCellOpacity(cell);
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = this.getCellColor(cell);
      this.ctx.fillText(cell.char, Math.round(cell.x), Math.round(cell.y));
    }
    this.ctx.globalAlpha = 1;

    this.raf = requestAnimationFrame(this.tick);
  };

  destroy() {
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.unbindMouse();
    if (this.resizeObserver && this.container) this.resizeObserver.unobserve(this.container);
    this.resizeObserver = null;
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
    this.ctx = null;
    this.initialized = false;
  }
}

function parseBool(val) {
  if (val == null || val === '') return false;
  const v = String(val).trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function parseNum(val, fallback) {
  if (val == null || val === '') return fallback;
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : fallback;
}

function mountBinaryFadeCanvases() {
  const containers = document.querySelectorAll('[data-js-target="binary-fade-canvas"]');
  const instances = [];
  containers.forEach((el) => {
    const textColor =
      el.getAttribute('data-text-color') ||
      getComputedStyle(el).getPropertyValue('color').trim() ||
      getComputedStyle(document.documentElement).getPropertyValue('color').trim() ||
      'rgba(255,255,255,0.85)';
    const mco = parseNum(el.getAttribute('data-mouse-cluster-opacity'), DEFAULT_OPTIONS.mouseClusterOpacity);
    const mhc = el.getAttribute('data-mouse-hover-color');
    const options = {
      textColor,
      waveColors: parseBool(el.getAttribute('data-wave-colors')),
      cellWidth: parseNum(el.getAttribute('data-cell-width'), DEFAULT_OPTIONS.cellWidth),
      cellHeight: parseNum(el.getAttribute('data-cell-height'), DEFAULT_OPTIONS.cellHeight),
      fontSize: parseNum(el.getAttribute('data-font-size'), DEFAULT_OPTIONS.fontSize),
      mouseClusterOpacity: Math.max(0, Math.min(1, mco)),
      mouseHoverColor: mhc != null && mhc !== '' ? String(mhc).trim() : DEFAULT_OPTIONS.mouseHoverColor,
    };
    const instance = new BinaryFadeCanvas(el, options);
    instance.init();
    instances.push({ el, instance });
  });
  return instances;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountBinaryFadeCanvases());
  } else {
    mountBinaryFadeCanvases();
  }
}

export default BinaryFadeCanvas;
