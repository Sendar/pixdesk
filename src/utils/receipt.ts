import { PixelColor, FxMode } from '../types';
import { MatrixGeo, buildFrame, drawMatrix } from './matrix';

const RECEIPT_GEO: MatrixGeo = { p: 8, pad: 6, gap: 6, w: 6 * 2 + 52 * 8 + 6, h: 6 * 2 + 16 * 8 };

export function generateReceiptImage(
  pixels: PixelColor[],
  text: string,
  color: string,
  fx: FxMode,
  speed: number,
  timestamp: Date,
  jobId = '8821a'
): string {
  const W = 640;
  const H = 780;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background Polaroid card
  ctx.fillStyle = '#f3efe6';
  ctx.fillRect(0, 0, W, H);

  // Photo viewport
  const px = 32;
  const py = 32;
  const pw = W - 64;
  const ph = 470;

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();

  // Dark studio scene
  ctx.fillStyle = '#0b0906';
  ctx.fillRect(px, py, pw, ph);

  // Ambient desk glow
  const grad = ctx.createRadialGradient(W / 2, py + 170, 10, W / 2, py + 170, 340);
  grad.addColorStop(0, 'rgba(245, 158, 11, 0.32)');
  grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(px, py, pw, ph);

  // Wooden desk surface
  const fy = py + ph * 0.6;
  const woods = ['#3a2415', '#46301c', '#33200f', '#402a18'];
  for (let i = 0, xx = px; xx < px + pw; i++) {
    const w = 6 + ((i * 7) % 9);
    ctx.fillStyle = woods[i % 4];
    ctx.fillRect(xx, fy, w, ph);
    xx += w;
  }

  // Draw ULANZI TC002 Matrix Clock
  const matrixCanvas = document.createElement('canvas');
  matrixCanvas.width = RECEIPT_GEO.w * 2;
  matrixCanvas.height = RECEIPT_GEO.h * 2;
  const mCtx = matrixCanvas.getContext('2d');
  if (mCtx) {
    const frame = buildFrame({ pixels, text, color, fx, speed }, performance.now() / 1000, true);
    drawMatrix(mCtx, frame, RECEIPT_GEO, 1.3, 2);
  }

  const bw = RECEIPT_GEO.w + 24;
  const bh = RECEIPT_GEO.h + 24;
  const bx = (W - bw) / 2;
  const by = fy - bh + 8;

  // Clock Bezel
  const bezelGrad = ctx.createLinearGradient(0, by, 0, by + bh);
  bezelGrad.addColorStop(0, '#2c3038');
  bezelGrad.addColorStop(1, '#0f1014');
  ctx.fillStyle = bezelGrad;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 16) : ctx.rect(bx, by, bw, bh);
  ctx.fill();

  // Draw Matrix Screen into Bezel
  ctx.drawImage(matrixCanvas, bx + 12, by + 12, RECEIPT_GEO.w, RECEIPT_GEO.h);

  // Scanlines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let yy = py; yy < py + ph; yy += 3) {
    ctx.fillRect(px, yy, pw, 1);
  }

  // Camera HUD
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('CAM-01 · AMSTERDAM DESK', px + 16, py + 26);
  ctx.textAlign = 'right';
  ctx.fillText(timestamp.toLocaleTimeString('en-GB', { hour12: false }) + ' CET', px + pw - 16, py + 26);

  ctx.fillStyle = '#f43f5e';
  ctx.textAlign = 'left';
  ctx.fillText('● PROOF OF PLAY', px + 16, py + ph - 18);
  ctx.restore();

  // Bottom Label Area
  ctx.fillStyle = '#0f172a';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillText('PROOF OF PLAY', px, py + ph + 64);

  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#334155';
  ctx.fillText(`Verified on Sander's Desk at ${timestamp.toLocaleTimeString('en-GB', { hour12: false })} CET`, px, py + ph + 100);

  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  const displayMsg = text.toUpperCase() || '(ICON ONLY)';
  ctx.fillText(`“${displayMsg.length > 38 ? displayMsg.slice(0, 37) + '…' : displayMsg}”`, px, py + ph + 130);

  ctx.fillStyle = '#b45309';
  ctx.fillText(`pixdesk · Cloudflare Edge & Synology · Job #${jobId}`, px, py + ph + 185);

  return canvas.toDataURL('image/png');
}
