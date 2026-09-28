import React, { useState } from 'react';
import { PixelColor, FxMode, CamState } from '../types';
import { PixelPad } from './PixelPad';
import { MarqueeControls } from './MarqueeControls';
import { DigitalTwin } from './DigitalTwin';
import { DeskFeed } from './DeskFeed';
import { playBlip } from '../utils/audio';

interface MobileWizardProps {
  pixels: PixelColor[];
  onPixelsChange: (pixels: PixelColor[]) => void;
  text: string;
  onTextChange: (text: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  fx: FxMode;
  onFxChange: (fx: FxMode) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  camState: CamState;
  onOpenSubmit: () => void;
  soundEnabled?: boolean;
}

export const MobileWizard: React.FC<MobileWizardProps> = ({
  pixels,
  onPixelsChange,
  text,
  onTextChange,
  textColor,
  onTextColorChange,
  fx,
  onFxChange,
  speed,
  onSpeedChange,
  camState,
  onOpenSubmit,
  soundEnabled = true,
}) => {
  const [step, setStep] = useState<number>(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      playBlip(750, 0.04, 'square', 0, soundEnabled);
    } else {
      onOpenSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      playBlip(550, 0.04, 'square', 0, soundEnabled);
    }
  };

  const stepTitles = [
    'STEP 1: DRAW 16×16 ICON',
    'STEP 2: MARQUEE TEXT & FX',
    'STEP 3: REVIEW & BLAST TO DESK',
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] max-w-lg mx-auto p-3">
      {/* 3-Step Progress Pips */}
      <div className="flex gap-1.5 p-2 bg-[#0e111a] rounded-xl border border-[#232938] mb-3">
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step === 1
              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
          }`}
        />
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step === 2
              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              : step > 2
              ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
              : 'bg-[#272b38]'
          }`}
        />
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step === 3
              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              : 'bg-[#272b38]'
          }`}
        />
      </div>

      {/* Step Header */}
      <div className="flex justify-between items-center px-1 mb-3 font-mono">
        <span className="text-xs font-extrabold text-amber-400 tracking-wider">
          {stepTitles[step - 1]}
        </span>
        <span className="text-[10px] text-slate-400">{step} of 3</span>
      </div>

      {/* Wizard Body Steps */}
      <div className="flex-1 flex flex-col gap-4">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <PixelPad
              pixels={pixels}
              onChange={onPixelsChange}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <MarqueeControls
              text={text}
              onTextChange={onTextChange}
              textColor={textColor}
              onTextColorChange={onTextColorChange}
              fx={fx}
              onFxChange={onFxChange}
              speed={speed}
              onSpeedChange={onSpeedChange}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <DigitalTwin
              pixels={pixels}
              text={text}
              textColor={textColor}
              fx={fx}
              speed={speed}
            />
            <DeskFeed
              pixels={pixels}
              text={text}
              textColor={textColor}
              fx={fx}
              camState={camState}
            />
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Dock */}
      <div className="sticky bottom-0 z-30 pt-3 pb-4 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e] to-transparent flex gap-2.5">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="cursor-pointer py-3.5 px-5 rounded-xl bg-[#181c28] border border-[#2d3548] text-slate-300 font-mono text-xs font-bold hover:text-white transition"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="cursor-pointer flex-1 py-3.5 px-4 rounded-xl font-mono text-sm font-extrabold text-slate-950 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:brightness-105 active:translate-y-[1px] transition text-center"
        >
          {step === 1
            ? 'Next: Marquee Text →'
            : step === 2
            ? 'Next: Review & Blast →'
            : 'Send to Clock 🚀'}
        </button>
      </div>
    </div>
  );
};
