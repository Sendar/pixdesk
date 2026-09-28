import React, { useState } from 'react';
import { DisplayTier, TierDefinition, PixelColor } from '../types';
import { getThumbnailUrl } from '../utils/matrix';
import { playBlip } from '../utils/audio';

interface TierModalProps {
  pixels: PixelColor[];
  text: string;
  onClose: () => void;
  onSubmit: (tier: DisplayTier) => void;
  soundEnabled?: boolean;
}

const TIERS: TierDefinition[] = [
  {
    id: 'free',
    name: 'COMMUNITY FREE',
    price: '€0.00',
    unit: '',
    slot: '10-second display',
    accent: '#10b981',
    perks: ['Standard queue rotation', 'Human Signal approval', 'Bot check verification'],
  },
  {
    id: 'priority',
    name: 'FAST-TRACK PRIORITY',
    price: '€1.50',
    unit: 'one-time',
    slot: '20-second display',
    accent: '#f59e0b',
    perks: ['Cuts straight to front of line', 'Triggers acoustic buzzer on clock', 'Automated filter check'],
  },
  {
    id: 'sponsor',
    name: 'SPONSOR BILLBOARD',
    price: '€9.00',
    unit: '/ 24h',
    slot: 'Permanent 24h loop',
    accent: '#d946ef',
    perks: ['Pins 16×16 logo + marquee', 'Rotates continuously for 24 hours', 'Permanent photo receipt link'],
  },
];

export const TierModal: React.FC<TierModalProps> = ({
  pixels,
  text,
  onClose,
  onSubmit,
  soundEnabled = true,
}) => {
  const [selectedTier, setSelectedTier] = useState<DisplayTier>('free');
  const [verifyState, setVerifyState] = useState<'idle' | 'checking' | 'verified'>('idle');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const thumbUrl = getThumbnailUrl(pixels, 4);

  const handleVerify = () => {
    if (verifyState !== 'idle') return;
    setVerifyState('checking');
    setTimeout(() => {
      setVerifyState('verified');
      playBlip(1100, 0.05, 'square', 0, soundEnabled);
    }, 800);
  };

  const handlePay = () => {
    setIsProcessingPay(true);
    playBlip(700, 0.05, 'square', 0, soundEnabled);
    setTimeout(() => {
      onSubmit(selectedTier);
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl bg-gradient-to-b from-[#171a23] to-[#101218] border border-[#2f3444] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.85)] overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-b border-[#272b38]">
          <div className="flex items-center gap-3">
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt="Your pixel icon"
                className="w-10 h-10 rounded border border-[#272b38] [image-rendering:pixelated]"
              />
            )}
            <div className="flex flex-col">
              <span className="font-['Press_Start_2P'] text-[11px] text-white">
                Choose Display Slot
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[340px]">
                “{text.toUpperCase() || '(ICON ONLY)'}”
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-lg bg-[#1a1d26] border border-[#2f3444] text-slate-400 hover:text-white flex items-center justify-center font-mono"
          >
            ✕
          </button>
        </div>

        {/* Tier Cards Grid */}
        <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {TIERS.map(t => {
            const isSelected = selectedTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTier(t.id);
                  playBlip(t.id === 'free' ? 600 : t.id === 'priority' ? 800 : 1000, 0.04, 'square', 0, soundEnabled);
                }}
                className={`cursor-pointer text-left flex flex-col gap-3 p-4 rounded-xl font-mono border-1.5 transition ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_24px_-6px_rgba(245,158,11,0.4)]'
                    : 'border-[#272b38] bg-[#0a0b0e] hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-[11px] font-extrabold tracking-wider"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </span>
                  <span
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: t.accent,
                      backgroundColor: isSelected ? t.accent : 'transparent',
                    }}
                  />
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{t.price}</span>
                  <span className="text-[11px] text-slate-400">{t.unit}</span>
                </div>

                <div className="text-xs font-bold text-slate-200">{t.slot}</div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#1d222e]">
                  {t.perks.map((p, i) => (
                    <div key={i} className="flex gap-2 text-[11px] text-slate-400 leading-tight">
                      <span style={{ color: t.accent }}>▸</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bottom Area */}
        <div className="px-4 pb-5 md:px-5">
          {selectedTier === 'free' ? (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0a0b0e] border border-[#272b38]">
              {/* Turnstile Bot Check Simulator */}
              <button
                onClick={handleVerify}
                className="cursor-pointer flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-mono text-xs font-semibold"
              >
                <span
                  className={`grid place-items-center w-5 h-5 rounded border text-xs font-bold ${
                    verifyState === 'verified'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {verifyState === 'verified' ? '✓' : verifyState === 'checking' ? '…' : ''}
                </span>
                <span>
                  {verifyState === 'verified'
                    ? "Verified — you're human"
                    : verifyState === 'checking'
                    ? 'Verifying…'
                    : "I'm not a bot"}
                </span>
                <span className="ml-auto text-[9px] text-slate-500 tracking-wider">
                  TURNSTILE
                </span>
              </button>

              <button
                disabled={verifyState !== 'verified'}
                onClick={() => onSubmit('free')}
                className={`cursor-pointer flex-1 min-w-[200px] font-mono font-bold text-xs tracking-wider py-3.5 px-4 rounded-xl text-emerald-950 bg-emerald-400 border border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] transition ${
                  verifyState === 'verified' ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Join Free Queue · €0.00
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-[#0a0b0e] border border-[#272b38]">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>1-Click Priority Checkout</span>
                <span className="text-white font-bold">
                  Total {selectedTier === 'priority' ? '€1.50' : '€9.00'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handlePay}
                  disabled={isProcessingPay}
                  className="cursor-pointer py-3 rounded-lg font-mono font-bold text-xs bg-black text-white border border-[#3a3f4c] hover:bg-neutral-900 transition flex items-center justify-center gap-1.5"
                >
                  <span>🍎 Apple Pay</span>
                </button>
                <button
                  onClick={handlePay}
                  disabled={isProcessingPay}
                  className="cursor-pointer py-3 rounded-lg font-mono font-bold text-xs bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                >
                  <span>G Pay</span>
                </button>
                <button
                  onClick={handlePay}
                  disabled={isProcessingPay}
                  className="cursor-pointer py-3 rounded-lg font-mono font-bold text-xs bg-[#635bff] text-white border border-[#8b85ff] hover:bg-[#534be0] transition flex items-center justify-center gap-1.5"
                >
                  <span>Card ····</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-center">
                Securely processed via Stripe · Instant queue bypass & clock sound alert
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
