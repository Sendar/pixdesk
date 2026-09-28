import React, { useEffect, useRef, useState } from 'react';
import { PixelColor, FxMode, CamState } from '../types';
import { DESK_GEO, buildFrame, drawMatrix } from '../utils/matrix';

interface DeskFeedProps {
  pixels: PixelColor[];
  text: string;
  textColor: string;
  fx: FxMode;
  camState: CamState;
  onRefresh?: () => void;
  tallFont?: boolean;
}

export const DeskFeed: React.FC<DeskFeedProps> = ({
  pixels,
  text,
  textColor,
  fx,
  camState,
  onRefresh,
  tallFont = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [updatedAgo, setUpdatedAgo] = useState('just now');
  const [lastSnapTime, setLastSnapTime] = useState<number>(Date.now());
  const [scanlines] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = DESK_GEO.w * dpr;
    canvas.height = DESK_GEO.h * dpr;

    const frame = buildFrame(
      { pixels, text, color: textColor, fx, speed: 1.5 },
      performance.now() / 1000,
      tallFont
    );
    drawMatrix(ctx, frame, DESK_GEO, 1.25, dpr);
  }, [pixels, text, textColor, fx, tallFont]);

  // Periodic 3s snapshot timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSnapTime(Date.now());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Updated seconds counter
  useEffect(() => {
    const timer = setInterval(() => {
      const diffSec = Math.floor((Date.now() - lastSnapTime) / 1000);
      setUpdatedAgo(diffSec <= 1 ? 'just now' : `${diffSec}s ago`);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSnapTime]);

  const handleManualRefresh = () => {
    setLastSnapTime(Date.now());
    if (onRefresh) onRefresh();
  };

  const getStatusLabel = () => {
    switch (camState) {
      case 'message_playing':
        return '▶ LIVE MESSAGE PLAYING';
      case 'capturing_receipt':
        return '◉ CAPTURING PROOF OF PLAY…';
      default:
        return '■ DESK STANDBY';
    }
  };

  const getStatusColor = () => {
    switch (camState) {
      case 'message_playing':
        return '#10b981';
      case 'capturing_receipt':
        return '#f43f5e';
      default:
        return '#94a3b8';
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#151821] to-[#101218] border border-[#272b38] rounded-2xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#272b38] flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-rose-200 bg-rose-500/15 border border-rose-500/50 px-2.5 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
            LIVE DESK FEED
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Updated {updatedAgo}
          </span>
        </div>
        <button
          onClick={handleManualRefresh}
          className="cursor-pointer text-[11px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#232733] to-[#1a1d26] border border-[#2f3444] border-b-2 text-slate-300 hover:text-white transition active:translate-y-[1px]"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="p-3.5 md:p-4">
        <div className="relative p-2.5 rounded-xl bg-gradient-to-b from-[#1b1e26] to-[#0c0d11] border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-[#0b0906]">
            {/* Ambient Room Lighting Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_36%,rgba(245,158,11,0.24),transparent_70%),radial-gradient(ellipse_40%_40%_at_88%_10%,rgba(6,182,212,0.12),transparent_70%)]" />

            {/* Wooden Desk Horizon */}
            <div className="absolute left-0 right-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.7)),repeating-linear-gradient(91deg,#3a2415_0_7px,#46301c_7px_15px,#33200f_15px_21px,#402a18_21px_26px)]" />

            {/* Reflection on Wood */}
            <div className="absolute left-1/2 bottom-[19%] w-[58%] h-[20%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.35),transparent_70%)] blur-md" />

            {/* Mini ULANZI TC002 Physical Device sitting on Desk */}
            <div className="absolute left-1/2 bottom-[36%] w-[62%] -translate-x-1/2 [perspective:700px] [transform:translateX(-50%)_rotateX(7deg)] p-1.5 md:p-2 rounded-xl bg-gradient-to-b from-[#2a2d34] to-[#111216] shadow-[0_16px_26px_-6px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <canvas
                ref={canvasRef}
                className="block w-full h-auto rounded-md [filter:blur(0.45px)_saturate(1.15)]"
              />
            </div>

            {/* CRT Scanline Overlay */}
            {scanlines && (
              <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_3px)] mix-blend-screen" />
            )}

            {/* CCTV Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />

            {/* CCTV Telemetry Overlay */}
            <div className="absolute top-2.5 left-3 right-3 flex justify-between gap-2 text-[10px] tracking-wider text-white/80 [text-shadow:0_1px_2px_#000] font-mono">
              <span>CAM-01 · AMSTERDAM DESK</span>
              <span>{new Date().toLocaleTimeString('en-GB', { hour12: false })} CET</span>
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end gap-2 text-[10px] tracking-wider [text-shadow:0_1px_2px_#000] font-mono">
              <span style={{ color: getStatusColor() }} className="font-bold">
                {getStatusLabel()}
              </span>
              <span className="text-white/40 text-[9px]">
                CLOUDFLARE R2 · SYNOLOGY BRIDGE
              </span>
            </div>
          </div>

          {/* 3s Snapshot Refresh Bar */}
          <div className="mt-2.5 h-[3px] rounded-full bg-[#1a1d26] overflow-hidden">
            <div
              key={lastSnapTime}
              className="h-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-[pdbar_3s_linear_forwards]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2.5 mt-3 text-[11px] text-slate-400 font-mono italic">
          <span>Photo captures every 3s via Synology NAS & Cloudflare R2</span>
        </div>
      </div>
    </section>
  );
};
