/**
 * Kinetic Core geometry, in the 1240 by 760 Figma frame (44:5079).
 * Pure functions shared by the static (server) and the interactive diagram.
 */
export const BOX = { w: 1240, h: 760 };
export const CORE = { x: 620, y: 400, r: 96 };

/** Card rectangles for steps 01 to 06 (x, y, width). */
export const NODES = [
  { x: 32, y: 100, w: 236 },
  { x: 972, y: 100, w: 236 },
  { x: 1012, y: 370, w: 236 },
  { x: 782, y: 610, w: 236 },
  { x: 222, y: 610, w: 236 },
  { x: -8, y: 370, w: 236 },
] as const;

/** Where each tentacle ends behind its card. */
export const ANCHORS = [
  { x: 185, y: 160 },
  { x: 1055, y: 160 },
  { x: 1090, y: 429 },
  { x: 870, y: 645 },
  { x: 370, y: 645 },
  { x: 150, y: 429 },
] as const;

export type Pt = { x: number; y: number };

/** Cubic Bezier from the core edge (radially out) into the card (horizontally). */
export function tentacle(hub: Pt, anchor: Pt) {
  const dx = anchor.x - hub.x;
  const dy = anchor.y - hub.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const p0 = { x: hub.x + ux * CORE.r, y: hub.y + uy * CORE.r };
  const d = len - CORE.r;
  const c1 = { x: p0.x + ux * d * 0.38, y: p0.y + uy * d * 0.38 };
  const c2 = { x: anchor.x - Math.sign(dx || 1) * d * 0.5, y: anchor.y };
  return { p0, c1, c2, p3: anchor };
}

export function pathD(t: ReturnType<typeof tentacle>) {
  const f = (n: number) => n.toFixed(1);
  return `M${f(t.p0.x)} ${f(t.p0.y)} C${f(t.c1.x)} ${f(t.c1.y)} ${f(t.c2.x)} ${f(t.c2.y)} ${f(t.p3.x)} ${f(t.p3.y)}`;
}

export function pointAt(t: ReturnType<typeof tentacle>, s: number): Pt {
  const u = 1 - s;
  const a = u * u * u;
  const b = 3 * u * u * s;
  const c = 3 * u * s * s;
  const e = s * s * s;
  return {
    x: a * t.p0.x + b * t.c1.x + c * t.c2.x + e * t.p3.x,
    y: a * t.p0.y + b * t.c1.y + c * t.c2.y + e * t.p3.y,
  };
}

/** Sucker dots: position along the curve and radius. */
export const SUCKERS = [
  { s: 0.12, r: 4.5 },
  { s: 0.32, r: 3.8 },
  { s: 0.52, r: 3.1 },
  { s: 0.72, r: 2.4 },
] as const;
