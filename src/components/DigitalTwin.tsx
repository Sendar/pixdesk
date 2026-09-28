import React, { useEffect, useRef } from 'react';
import { PixelColor, FxMode } from '../types';
import { MAIN_GEO, buildFrame, drawMatrix } from '../utils/matrix';

interface DigitalTwinProps {
  pixels: PixelColor[];
  text: string;
  textColor: string;
  fx: FxMode;
  speed: number;
  glow?: number;
  tallFont?: boolean;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  pixels,
  text,
  textColor,
  fx,
  speed,
  glow = 1.0,
  tallFont = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = MAIN_GEO.w * dpr;
    canvas.height = MAIN_GEO.h * dpr;

    let animId: number;
    const loop = (ts: number) => {
      animId = requestAnimationFrame(loop);
      const frame = buildFrame(
        { pixels, text, color: textColor, fx, speed },
        ts / 1000,
        tallFont
      );
      drawMatrix(ctx, frame, MAIN_GEO, glow, dpr);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pixels, text, textColor, fx, speed, glow, tallFont]);

  return (
    <section className="bg-gradient-to-b from-[#151821] to-[#101218] border border-[#272b38] rounded-2xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#272b38]">
        <div className="flex items-center gap-2.5">
          <span className="font-['Press_Start_2P'] text-[9px] px-1.5 py-1 rounded bg-[#06b6d4] text-[#0a0b0e] font-bold">
            TWIN
          </span>
          <span className="text-xs tracking-wider font-bold text-slate-100 font-mono">
            DIGITAL TWIN · TC002 16×52
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-slate-400 font-mono">
          60 FPS REAL-TIME
        </span>
      </div>

      <div className="p-6 md:p-8 bg-[radial-gradient(ellipse_80%_70%_at_50%_60%,rgba(6,182,212,0.06),transparent_70%)] flex flex-col items-center">
        {/* Physical TC002 Hardware Shell */}
        <div className="relative w-full max-w-[620px]">
          {/* Top Bezel Buttons */}
          <div className="absolute -top-2 left-[9%] flex gap-2.5 z-10">
            <span className="w-8 h-2 rounded-t-md bg-gradient-to-b from-[#3a3e48] to-[#22252c] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
            <span className="w-8 h-2 rounded-t-md bg-gradient-to-b from-[#3a3e48] to-[#22252c] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
            <span className="w-8 h-2 rounded-t-md bg-gradient-to-b from-[#3a3e48] to-[#22252c] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
          </div>

          <div className="relative p-3.5 md:p-4 rounded-3xl bg-gradient-to-b from-[#2c3038] via-[#191b21] to-[#0f1014] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_30px_60px_-20px_rgba(0,0,0,0.95)]">
            <div className="rounded-xl p-1 bg-[#030405] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)]">
              <canvas
                ref={canvasRef}
                className="block w-full h-auto rounded-lg"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="absolute right-6 bottom-1 text-[7px] tracking-[0.3em] text-[#4b5263] font-mono">
              ULANZI TC002
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[16fr_36fr] gap-4 w-full max-w-[620px] mt-4 px-2 text-[10px] tracking-wider text-slate-400 font-mono">
          <div className="border-t border-dashed border-[#272b38] pt-1.5">
            COL 0–15 · ICON 16×16
          </div>
          <div className="border-t border-dashed border-[#272b38] pt-1.5 text-right">
            COL 16–51 · MARQUEE 16×36 · <span className="text-amber-300 font-bold">{fx.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
