/**
 * Exact ink bounding box for the SVG subset the provider logo components use.
 *
 * The Stack Share card and the OG image both size a logo by HEIGHT inside a
 * fixed box, so any padding baked into the viewBox makes that logo render
 * smaller than the ones either side of it. Cropping the viewBox to the ink is
 * what keeps optical weight consistent down a column of them — 18 of the 31
 * logos that shipped before this file existed were cropped that way by hand.
 *
 * Everything is reduced to cubic Béziers in the element's own user space, then
 * the control points are pushed through the accumulated CTM. A cubic's bbox is
 * exact under an affine transform when you transform the control points first
 * and solve for extrema after, which is why arcs, circles, and rects all become
 * cubics rather than getting special-cased per transform.
 *
 * Deliberately NOT handled, because it does not arise in the 65 components and
 * guessing would be worse than reporting it:
 *   - <text>: the box depends on a font this process has no reason to have.
 *   - <image>: the box depends on fetching the referenced asset.
 * Both are reported via `skipped` so the caller can decline to crop.
 *
 * Clip paths and masks are ignored, matching SVGGraphicsElement.getBBox(). The
 * one masked logo (steel) masks its full canvas, so this costs nothing there.
 */

const KAPPA = 0.5522847498307936;

/* ── matrices: [a, b, c, d, e, f] as in the SVG spec ───────────────── */

const IDENTITY = [1, 0, 0, 1, 0, 0];

function multiply(m, n) {
    return [
        m[0] * n[0] + m[2] * n[1],
        m[1] * n[0] + m[3] * n[1],
        m[0] * n[2] + m[2] * n[3],
        m[1] * n[2] + m[3] * n[3],
        m[0] * n[4] + m[2] * n[5] + m[4],
        m[1] * n[4] + m[3] * n[5] + m[5],
    ];
}

function apply(m, x, y) {
    return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

function parseTransform(value) {
    let m = IDENTITY;
    if (!value) return m;
    const re = /([a-zA-Z]+)\s*\(([^)]*)\)/g;
    for (const match of value.matchAll(re)) {
        const name = match[1];
        const n = match[2].split(/[\s,]+/).filter(s => s !== "").map(Number);
        if (n.some(Number.isNaN)) continue;
        switch (name) {
            case "translate":
                m = multiply(m, [1, 0, 0, 1, n[0] ?? 0, n[1] ?? 0]);
                break;
            case "scale":
                m = multiply(m, [n[0] ?? 1, 0, 0, n[1] ?? n[0] ?? 1, 0, 0]);
                break;
            case "rotate": {
                const rad = ((n[0] ?? 0) * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const rot = [cos, sin, -sin, cos, 0, 0];
                if (n.length >= 3) {
                    m = multiply(m, [1, 0, 0, 1, n[1], n[2]]);
                    m = multiply(m, rot);
                    m = multiply(m, [1, 0, 0, 1, -n[1], -n[2]]);
                } else {
                    m = multiply(m, rot);
                }
                break;
            }
            case "matrix":
                if (n.length === 6) m = multiply(m, n);
                break;
            case "skewX":
                m = multiply(m, [1, 0, Math.tan(((n[0] ?? 0) * Math.PI) / 180), 1, 0, 0]);
                break;
            case "skewY":
                m = multiply(m, [1, Math.tan(((n[0] ?? 0) * Math.PI) / 180), 0, 1, 0, 0]);
                break;
            default:
                break;
        }
    }
    return m;
}

/* ── path data → cubic segments ────────────────────────────────────── */

/**
 * Command-aware scanner over path data.
 *
 * A flat number-then-command tokenizer is wrong for arcs: the large-arc and
 * sweep parameters are single-digit flags that the grammar lets you write with
 * no separator at all, so `a5 5 0 013.5 0` is (rx 5, ry 5, rot 0, large 0,
 * sweep 1, x 3.5, y 0) and not (…, 0, 13, .5, 0). logo-flyio.webc is written
 * that way. Flags therefore have to be read one character at a time, which only
 * works if the reader already knows which command it is in.
 */
function pathScanner(d) {
    let i = 0;
    const skipSeparators = () => {
        while (i < d.length && (d[i] === " " || d[i] === "," || d[i] === "\t" || d[i] === "\n" || d[i] === "\r")) i++;
    };
    const numberRe = /-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
    return {
        atEnd() {
            skipSeparators();
            return i >= d.length;
        },
        peekCommand() {
            skipSeparators();
            return i < d.length && /[MmZzLlHhVvCcSsQqTtAa]/.test(d[i]) ? d[i] : null;
        },
        takeCommand() {
            const c = this.peekCommand();
            if (c !== null) i++;
            return c;
        },
        number() {
            skipSeparators();
            numberRe.lastIndex = i;
            const m = numberRe.exec(d);
            if (!m || m.index !== i) return null;
            i = numberRe.lastIndex;
            return Number(m[0]);
        },
        /** A flag is exactly one character: "0" or "1". */
        flag() {
            skipSeparators();
            if (d[i] === "0" || d[i] === "1") return d[i++] === "1";
            // Malformed, but a full number is the most likely intent.
            const n = this.number();
            return n === null ? false : n !== 0;
        },
    };
}

/**
 * Endpoint-parameterized elliptical arc → up to 4 cubics (F.6.5 in the spec).
 */
function arcToCubics(x0, y0, rx, ry, rotationDeg, largeArc, sweep, x1, y1) {
    if (rx === 0 || ry === 0) return [[x0, y0, x0, y0, x1, y1, x1, y1]];
    rx = Math.abs(rx);
    ry = Math.abs(ry);

    const phi = (rotationDeg * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const dx2 = (x0 - x1) / 2;
    const dy2 = (y0 - y1) / 2;
    const x1p = cosPhi * dx2 + sinPhi * dy2;
    const y1p = -sinPhi * dx2 + cosPhi * dy2;

    // Scale the radii up if they cannot span the chord (F.6.6).
    const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lambda > 1) {
        const s = Math.sqrt(lambda);
        rx *= s;
        ry *= s;
    }

    const sign = largeArc === sweep ? -1 : 1;
    const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
    const co = sign * Math.sqrt(Math.max(0, num / den));
    const cxp = (co * rx * y1p) / ry;
    const cyp = (-co * ry * x1p) / rx;

    const cx = cosPhi * cxp - sinPhi * cyp + (x0 + x1) / 2;
    const cy = sinPhi * cxp + cosPhi * cyp + (y0 + y1) / 2;

    const angleOf = (ux, uy) => Math.atan2(uy, ux);
    const theta1 = angleOf((x1p - cxp) / rx, (y1p - cyp) / ry);
    let dTheta = angleOf((-x1p - cxp) / rx, (-y1p - cyp) / ry) - theta1;
    if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
    else if (sweep && dTheta < 0) dTheta += 2 * Math.PI;

    const count = Math.max(1, Math.ceil(Math.abs(dTheta) / (Math.PI / 2)));
    const delta = dTheta / count;
    const alpha = ((4 / 3) * Math.tan(delta / 4));

    const onArc = t => {
        const ct = Math.cos(t);
        const st = Math.sin(t);
        return [
            cx + rx * cosPhi * ct - ry * sinPhi * st,
            cy + rx * sinPhi * ct + ry * cosPhi * st,
        ];
    };
    const slopeAt = t => {
        const ct = Math.cos(t);
        const st = Math.sin(t);
        return [
            -rx * cosPhi * st - ry * sinPhi * ct,
            -rx * sinPhi * st + ry * cosPhi * ct,
        ];
    };

    const cubics = [];
    let t = theta1;
    let [px, py] = onArc(t);
    for (let i = 0; i < count; i++) {
        const tNext = t + delta;
        const [nx, ny] = onArc(tNext);
        const [d1x, d1y] = slopeAt(t);
        const [d2x, d2y] = slopeAt(tNext);
        cubics.push([
            px, py,
            px + alpha * d1x, py + alpha * d1y,
            nx - alpha * d2x, ny - alpha * d2y,
            nx, ny,
        ]);
        t = tNext;
        px = nx;
        py = ny;
    }
    return cubics;
}

function pathToCubics(d) {
    const s = pathScanner(d);
    const cubics = [];
    let cmd = null;
    let cx = 0;
    let cy = 0;
    let startX = 0;
    let startY = 0;
    // Reflected control point for S/s and T/t.
    let lastCubicCtrl = null;
    let lastQuadCtrl = null;

    const line = (x, y) => {
        cubics.push([cx, cy, cx, cy, x, y, x, y]);
        cx = x;
        cy = y;
    };
    const cubic = (x1, y1, x2, y2, x, y) => {
        cubics.push([cx, cy, x1, y1, x2, y2, x, y]);
        lastCubicCtrl = [x2, y2];
        cx = x;
        cy = y;
    };
    const quad = (x1, y1, x, y) => {
        // Exact degree elevation, so no precision is lost going Q → C.
        cubic(
            cx + (2 / 3) * (x1 - cx), cy + (2 / 3) * (y1 - cy),
            x + (2 / 3) * (x1 - x), y + (2 / 3) * (y1 - y),
            x, y,
        );
        lastQuadCtrl = [x1, y1];
    };

    while (!s.atEnd()) {
        const next = s.takeCommand();
        if (next !== null) {
            cmd = next;
            if (cmd === "Z" || cmd === "z") {
                if (cx !== startX || cy !== startY) line(startX, startY);
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                continue;
            }
        } else if (cmd === null) {
            // Leading garbage before any command.
            return cubics;
        } else if (cmd === "M") {
            // An implicit repeat of moveto is a lineto, per the grammar.
            cmd = "L";
        } else if (cmd === "m") {
            cmd = "l";
        }

        const rel = cmd === cmd.toLowerCase();
        const ox = rel ? cx : 0;
        const oy = rel ? cy : 0;
        const n = () => s.number();

        switch (cmd.toUpperCase()) {
            case "M": {
                const x = n();
                const y = n();
                if (x === null || y === null) return cubics;
                cx = x + ox;
                cy = y + oy;
                startX = cx;
                startY = cy;
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                break;
            }
            case "L": {
                const x = n();
                const y = n();
                if (x === null || y === null) return cubics;
                line(x + ox, y + oy);
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                break;
            }
            case "H": {
                const x = n();
                if (x === null) return cubics;
                line(x + ox, cy);
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                break;
            }
            case "V": {
                const y = n();
                if (y === null) return cubics;
                line(cx, y + oy);
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                break;
            }
            case "C": {
                const a = [n(), n(), n(), n(), n(), n()];
                if (a.some(v => v === null)) return cubics;
                cubic(a[0] + ox, a[1] + oy, a[2] + ox, a[3] + oy, a[4] + ox, a[5] + oy);
                lastQuadCtrl = null;
                break;
            }
            case "S": {
                const a = [n(), n(), n(), n()];
                if (a.some(v => v === null)) return cubics;
                const [rx, ry] = lastCubicCtrl ? [2 * cx - lastCubicCtrl[0], 2 * cy - lastCubicCtrl[1]] : [cx, cy];
                cubic(rx, ry, a[0] + ox, a[1] + oy, a[2] + ox, a[3] + oy);
                lastQuadCtrl = null;
                break;
            }
            case "Q": {
                const a = [n(), n(), n(), n()];
                if (a.some(v => v === null)) return cubics;
                quad(a[0] + ox, a[1] + oy, a[2] + ox, a[3] + oy);
                break;
            }
            case "T": {
                const a = [n(), n()];
                if (a.some(v => v === null)) return cubics;
                const [rx, ry] = lastQuadCtrl ? [2 * cx - lastQuadCtrl[0], 2 * cy - lastQuadCtrl[1]] : [cx, cy];
                quad(rx, ry, a[0] + ox, a[1] + oy);
                break;
            }
            case "A": {
                const rx = n();
                const ry = n();
                const rot = n();
                const largeArc = s.flag();
                const sweep = s.flag();
                const ex = n();
                const ey = n();
                if ([rx, ry, rot, ex, ey].some(v => v === null)) return cubics;
                const x = ex + ox;
                const y = ey + oy;
                for (const c of arcToCubics(cx, cy, rx, ry, rot, largeArc, sweep, x, y)) {
                    cubics.push(c);
                }
                cx = x;
                cy = y;
                lastCubicCtrl = null;
                lastQuadCtrl = null;
                break;
            }
            default:
                // Unrecognised command: bail rather than loop forever.
                return cubics;
        }
    }
    return cubics;
}

/* ── shape → cubic segments ────────────────────────────────────────── */

function ellipseToCubics(cx, cy, rx, ry) {
    const ox = rx * KAPPA;
    const oy = ry * KAPPA;
    return [
        [cx + rx, cy, cx + rx, cy + oy, cx + ox, cy + ry, cx, cy + ry],
        [cx, cy + ry, cx - ox, cy + ry, cx - rx, cy + oy, cx - rx, cy],
        [cx - rx, cy, cx - rx, cy - oy, cx - ox, cy - ry, cx, cy - ry],
        [cx, cy - ry, cx + ox, cy - ry, cx + rx, cy - oy, cx + rx, cy],
    ];
}

function polylineToCubics(points, close) {
    const n = points.split(/[\s,]+/).filter(s => s !== "").map(Number);
    const cubics = [];
    for (let i = 2; i + 1 < n.length; i += 2) {
        cubics.push([n[i - 2], n[i - 1], n[i - 2], n[i - 1], n[i], n[i + 1], n[i], n[i + 1]]);
    }
    if (close && n.length >= 4) {
        const lx = n[n.length - 2];
        const ly = n[n.length - 1];
        cubics.push([lx, ly, lx, ly, n[0], n[1], n[0], n[1]]);
    }
    return cubics;
}

function shapeToCubics(tag, attrs) {
    const num = (name, fallback = 0) => {
        const v = attrs[name];
        if (v === undefined) return fallback;
        const parsed = parseFloat(v);
        return Number.isNaN(parsed) ? fallback : parsed;
    };
    switch (tag) {
        case "path":
            return attrs.d ? pathToCubics(attrs.d) : [];
        case "rect": {
            const x = num("x");
            const y = num("y");
            const w = num("width");
            const h = num("height");
            if (w <= 0 || h <= 0) return [];
            return polylineToCubics(`${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`, true);
        }
        case "circle": {
            const r = num("r");
            return r > 0 ? ellipseToCubics(num("cx"), num("cy"), r, r) : [];
        }
        case "ellipse": {
            const rx = num("rx");
            const ry = num("ry");
            return rx > 0 && ry > 0 ? ellipseToCubics(num("cx"), num("cy"), rx, ry) : [];
        }
        case "line":
            return polylineToCubics(`${num("x1")},${num("y1")} ${num("x2")},${num("y2")}`, false);
        case "polygon":
            return attrs.points ? polylineToCubics(attrs.points, true) : [];
        case "polyline":
            return attrs.points ? polylineToCubics(attrs.points, false) : [];
        default:
            return [];
    }
}

/* ── cubic bbox ────────────────────────────────────────────────────── */

function extendAxis(box, key, p0, p1, p2, p3) {
    const min = `min${key}`;
    const max = `max${key}`;
    const at = t => {
        const u = 1 - t;
        return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    };
    const seen = [p0, p3];
    // Roots of the derivative: 3(-p0+3p1-3p2+p3)t² + 6(p0-2p1+p2)t + 3(p1-p0)
    const a = -p0 + 3 * p1 - 3 * p2 + p3;
    const b = 2 * (p0 - 2 * p1 + p2);
    const c = p1 - p0;
    if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) > 1e-12) {
            const t = -c / b;
            if (t > 0 && t < 1) seen.push(at(t));
        }
    } else {
        const disc = b * b - 4 * a * c;
        if (disc >= 0) {
            const root = Math.sqrt(disc);
            for (const t of [(-b + root) / (2 * a), (-b - root) / (2 * a)]) {
                if (t > 0 && t < 1) seen.push(at(t));
            }
        }
    }
    for (const v of seen) {
        if (v < box[min]) box[min] = v;
        if (v > box[max]) box[max] = v;
    }
}

/* ── document walk ─────────────────────────────────────────────────── */

const SHAPES = new Set(["path", "rect", "circle", "ellipse", "line", "polygon", "polyline"]);
const UNMEASURABLE = new Set(["text", "image", "foreignObject", "tspan", "textPath", "use"]);
// Subtrees that paint nothing where they sit.
const NON_RENDERING = new Set(["defs", "clipPath", "mask", "symbol", "marker", "pattern", "linearGradient", "radialGradient", "filter", "style", "title", "desc", "metadata"]);

function parseAttrs(raw) {
    const attrs = {};
    for (const m of raw.matchAll(/([:@a-zA-Z_][-:.a-zA-Z0-9_]*)\s*=\s*"([^"]*)"/g)) {
        attrs[m[1]] = m[2];
    }
    return attrs;
}

function strokeOutset(attrs, inherited) {
    const stroke = attrs.stroke ?? inherited.stroke;
    if (!stroke || stroke === "none" || stroke === "transparent") return 0;
    const width = attrs["stroke-width"] ?? inherited["stroke-width"];
    const w = width === undefined ? 1 : parseFloat(width);
    return Number.isNaN(w) ? 0.5 : w / 2;
}

/**
 * @param {string} svg  A complete <svg> element.
 * @returns {{box: {x,y,width,height}|null, skipped: string[]}}
 *   `skipped` lists tag names whose geometry could not be measured; a non-empty
 *   value means the returned box is a lower bound on the real ink.
 */
export function inkBox(svg) {
    const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    const skipped = new Set();

    // A flat scan with an explicit stack, so a self-closing <g/> or an
    // unbalanced tag cannot desynchronise the transform chain.
    const stack = [{ tag: "#root", matrix: IDENTITY, inherited: {}, suppressed: false }];
    const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|[^>"])*?)(\/?)>/g;

    for (const m of svg.matchAll(tagRe)) {
        const closing = m[1] === "/";
        const tag = m[2].replace(/^.*:/, "");
        const selfClosing = m[4] === "/";

        if (closing) {
            if (stack.length > 1) stack.pop();
            continue;
        }

        const top = stack[stack.length - 1];
        const attrs = parseAttrs(m[3]);
        const suppressed = top.suppressed || NON_RENDERING.has(tag);
        const matrix = attrs.transform ? multiply(top.matrix, parseTransform(attrs.transform)) : top.matrix;
        const inherited = {
            stroke: attrs.stroke ?? top.inherited.stroke,
            "stroke-width": attrs["stroke-width"] ?? top.inherited["stroke-width"],
        };

        if (!suppressed) {
            if (UNMEASURABLE.has(tag)) {
                skipped.add(tag);
            } else if (SHAPES.has(tag)) {
                // Accumulate this element alone, so a stroke outset widens only
                // the stroked element and not whatever the running box held.
                const local = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
                for (const c of shapeToCubics(tag, attrs)) {
                    const p = [];
                    for (let k = 0; k < 8; k += 2) p.push(apply(matrix, c[k], c[k + 1]));
                    extendAxis(local, "X", p[0][0], p[1][0], p[2][0], p[3][0]);
                    extendAxis(local, "Y", p[0][1], p[1][1], p[2][1], p[3][1]);
                }
                if (local.minX !== Infinity) {
                    const outset = strokeOutset(attrs, top.inherited);
                    if (outset > 0) {
                        /*
                         * getBBox() reports the fill geometry only, so a box
                         * cropped to it clips half the stroke off. Every stroked
                         * logo here is uniformly scaled, so a single factor from
                         * the determinant is exact.
                         */
                        const scale = Math.sqrt(Math.abs(matrix[0] * matrix[3] - matrix[1] * matrix[2])) || 1;
                        const o = outset * scale;
                        local.minX -= o;
                        local.minY -= o;
                        local.maxX += o;
                        local.maxY += o;
                    }
                    if (local.minX < box.minX) box.minX = local.minX;
                    if (local.minY < box.minY) box.minY = local.minY;
                    if (local.maxX > box.maxX) box.maxX = local.maxX;
                    if (local.maxY > box.maxY) box.maxY = local.maxY;
                }
            }
        }

        if (!selfClosing && tag !== "svg") {
            stack.push({ tag, matrix, inherited, suppressed });
        } else if (!selfClosing && tag === "svg") {
            stack.push({ tag, matrix, inherited, suppressed });
        }
    }

    if (box.minX === Infinity) return { box: null, skipped: [...skipped] };
    return {
        box: {
            x: box.minX,
            y: box.minY,
            width: box.maxX - box.minX,
            height: box.maxY - box.minY,
        },
        skipped: [...skipped],
    };
}
