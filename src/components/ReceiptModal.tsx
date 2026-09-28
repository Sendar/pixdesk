import React from 'react';
import { ReceiptData } from '../types';

interface ReceiptModalProps {
  receipt: ReceiptData;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const shareText = encodeURIComponent(
    `My pixel art just illuminated Sander's real desk clock in Amsterdam via PixDesk ▞`
  );
  const shareUrl = encodeURIComponent(window.location.href);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = receipt.img;
    link.download = `pixdesk-proof-of-play-${receipt.jobId || 'snap'}.png`;
    link.click();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md flex flex-col items-center gap-4 my-6"
      >
        <div className="font-['Press_Start_2P'] text-xs text-white [text-shadow:0_0_12px_rgba(244,63,94,0.8)]">
          PROOF OF PLAY
        </div>

        {/* Polaroid Card */}
        <div className="w-full rounded-lg overflow-hidden border-2 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4),0_30px_60px_rgba(0,0,0,0.9)] transform -rotate-1 transition hover:rotate-0">
          <img src={receipt.img} alt="Desk Snapshot Receipt" className="w-full h-auto block" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
          <span>✓</span>
          <span>Verified on Sander's Desk in Amsterdam</span>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={() =>
              window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')
            }
            className="cursor-pointer font-mono font-bold text-xs py-3 rounded-xl bg-white text-slate-900 border border-white hover:bg-slate-200 transition"
          >
            Share on X
          </button>
          <button
            onClick={() =>
              window.open(`https://bsky.app/intent/compose?text=${shareText}%20${shareUrl}`, '_blank')
            }
            className="cursor-pointer font-mono font-bold text-xs py-3 rounded-xl bg-[#0b63f6] text-white border border-[#3b82f6] hover:bg-[#0952cc] transition"
          >
            Share on Bluesky
          </button>
          <button
            onClick={() =>
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')
            }
            className="cursor-pointer font-mono font-bold text-xs py-3 rounded-xl bg-[#0a66c2] text-white border border-[#3b8ad6] hover:bg-[#084e94] transition"
          >
            Share on LinkedIn
          </button>
          <button
            onClick={handleDownload}
            className="cursor-pointer font-mono font-bold text-xs py-3 rounded-xl bg-gradient-to-b from-[#232733] to-[#1a1d26] text-slate-200 border border-[#2f3444] border-b-2 hover:text-white transition"
          >
            ↓ Download Receipt
          </button>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer font-mono text-xs text-slate-400 hover:text-slate-200 tracking-wider pt-2"
        >
          CLOSE · MAKE ANOTHER
        </button>
      </div>
    </div>
  );
};
