import { PixelColor, FxMode } from '../types';
import { textCols } from './font';

export interface MatrixGeo {
  p: number;
  pad: number;
  gap: number;
  w: number;
  h: number;
}

export const MAIN_GEO: MatrixGeo = { p: 14, pad: 14, gap: 10, w: 14 * 2 + 52 * 14 + 10, h: 14 * 2 + 16 * 14 };
export const DESK_GEO: MatrixGeo = { p: 5, pad: 4, gap: 4, w: 4 * 2 + 52 * 5 + 4, h: 4 * 2 + 16 * 5 };
export const MOBILE_GEO: MatrixGeo = { p: 6, pad: 6, gap: 4, w: 6 * 2 + 52 * 6 + 4, h: 6 * 2 + 16 * 6 };

export interface FrameSource {
  pixels: PixelColor[];
  text: string;
  color: string;
  fx: FxMode;
  speed: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16) || 0,
    parseInt(clean.slice(2, 4), 16) || 0,
    parseInt(clean.slice(4, 6), 16) || 0,
  ];
}

function hueHex(h: number): string {
  h = ((Math.round(h / 15) * 15) % 360 + 360) % 360;
  const l = 0.6;
  const a = 0.4;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255).toString(16).padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

export function buildFrame(src: FrameSource, t: number, tall = true): PixelColor[] {
  const frame: PixelColor[] = new Array(832).fill(null);
  const blinkOff = src.fx === 'blink' && Math.floor(t * 2.5) % 2 === 1;
  if (blinkOff) return frame;

  // Icon 16x16: columns 0..15
  for (let i = 0; i < 256; i++) {
    const color = src.pixels[i];
    if (color) {
      const row = i >> 4;
      const col = i & 15;
      frame[row * 52 + col] = color;
    }
  }

  // Marquee 16x36: columns 16..51
  const { cols, w } = textCols(src.text);
  if (!w) return frame;

  const fits = w <= 36;
  let x0: number;

  if (src.fx === 'static' || (src.fx === 'blink' && fits)) {
    x0 = fits ? Math.floor((36 - w) / 2) : 0;
  } else {
    const span = w + 36;
    x0 = Math.floor(36 - ((t * src.speed * 10) % span));
  }

  const y0 = tall ? 1 : 4;

  for (let c = 0; c < 36; c++) {
    const gc = c - x0;
    if (gc < 0 || gc >= w) continue;
    const bits = cols[gc];
    if (!bits) continue;

    const col = src.fx === 'rainbow' ? hueHex(t * 140 + gc * 10) : src.color;

    for (let r = 0; r < 7; r++) {
      if ((bits >> r) & 1) {
        if (tall) {
          frame[(y0 + 2 * r) * 52 + 16 + c] = col;
          frame[(y0 + 2 * r + 1) * 52 + 16 + c] = col;
        } else {
          frame[(y0 + r) * 52 + 16 + c] = col;
        }
      }
    }
  }

  return frame;
}

const spriteCache = new Map<string, HTMLCanvasElement>();

export function getDotSprite(hex: string, pitch: number, glow: number, dpr: number): HTMLCanvasElement {
  const key = `${hex}|${pitch}|${glow}|${dpr}`;
  let sprite = spriteCache.get(key);
  if (sprite) return sprite;

  const size = Math.ceil(pitch * 3 * dpr);
  sprite = document.createElement('canvas');
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;

  const [r, g, b] = hexToRgb(hex);
  const center = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center);

  const rgba = (a: number) => `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;

  grad.addColorStop(0, `rgba(${Math.round(r + (255 - r) * 0.6)},${Math.round(g + (255 - g) * 0.6)},${Math.round(b + (255 - b) * 0.6)},1)`);
  grad.addColorStop(0.1, rgba(1));
  grad.addColorStop(0.24, rgba(0.95));
  grad.addColorStop(0.3, rgba(0.38 * glow));
  grad.addColorStop(0.55, rgba(0.1 * glow));
  grad.addColorStop(1, rgba(0));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  spriteCache.set(key, sprite);
  return sprite;
}

export function drawMatrix(
  ctx: CanvasRenderingContext2D,
  frame: PixelColor[],
  geo: MatrixGeo,
  glow = 1.0,
  dpr = 1.0
) {
  const { p, pad, gap } = geo;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#040506';
  ctx.fillRect(0, 0, geo.w, geo.h);

  const getX = (c: number) => pad + c * p + p / 2 + (c >= 16 ? gap : 0);
  const getY = (r: number) => pad + r * p + p / 2;
  const radius = p * 0.36;

  // Draw unlit dot circles
  ctx.fillStyle = '#14161c';
  ctx.beginPath();
  for (let i = 0; i < 832; i++) {
    if (!frame[i]) {
      const x = getX(i % 52);
      const y = getY(Math.floor(i / 52));
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
  }
  ctx.fill();

  // Draw glowing lit dots using cached sprites
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 832; i++) {
    const color = frame[i];
    if (!color) continue;
    const x = getX(i % 52);
    const y = getY(Math.floor(i / 52));
    const sprite = getDotSprite(color, p, glow, dpr);
    ctx.drawImage(sprite, x - 1.5 * p, y - 1.5 * p, 3 * p, 3 * p);
  }
  ctx.globalCompositeOperation = 'source-over';
}

export function getThumbnailUrl(pixels: PixelColor[], scale = 4): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 16 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#07080b';
  ctx.fillRect(0, 0, 16 * scale, 16 * scale);

  pixels.forEach((color, i) => {
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect((i % 16) * scale, Math.floor(i / 16) * scale, scale, scale);
    }
  });
  return canvas.toDataURL('image/png');
}
