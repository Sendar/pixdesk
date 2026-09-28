import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg p-6 bg-gradient-to-b from-[#171a23] to-[#101218] border border-[#2f3444] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.85)] flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <span className="font-['Press_Start_2P'] text-xs text-white">
            How PixDesk Works
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-lg bg-[#1a1d26] border border-[#2f3444] text-slate-400 hover:text-white flex items-center justify-center font-mono"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-300 font-mono">
          <div className="flex gap-3">
            <span className="text-amber-400 font-bold">01</span>
            <span>You compose 16×16 pixel art and a scrolling neon marquee in your browser.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-cyan-400 font-bold">02</span>
            <span>Submissions hit Cloudflare Edge (Workers + D1 queue) with Turnstile verification.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-emerald-400 font-bold">03</span>
            <span>A Synology NAS daemon bridges approved jobs to the ULANZI TC002 clock over local Wi-Fi.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-rose-400 font-bold">04</span>
            <span>A webcam snaps the illuminated clock every 3s to Cloudflare R2, generating your verified Proof-of-Play receipt.</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#232938] flex justify-between items-center text-xs font-mono">
          <a
            href="https://github.com/Sendar/pixdesk"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline font-bold"
          >
            View on GitHub →
          </a>
          <span className="text-slate-500">ULANZI TC002 16×52</span>
        </div>
      </div>
    </div>
  );
};
