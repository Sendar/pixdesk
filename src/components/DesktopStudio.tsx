import React from 'react';
import { PixelColor, FxMode, CamState } from '../types';
import { DigitalTwin } from './DigitalTwin';
import { DeskFeed } from './DeskFeed';
import { PixelPad } from './PixelPad';
import { MarqueeControls } from './MarqueeControls';

interface DesktopStudioProps {
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
  onDownloadPng: () => void;
  onDownloadJson: () => void;
  isSubmitting?: boolean;
  soundEnabled?: boolean;
}

export const DesktopStudio: React.FC<DesktopStudioProps> = ({
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
  onDownloadPng,
  onDownloadJson,
  isSubmitting,
  soundEnabled = true,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 max-w-[1560px] mx-auto p-4 md:p-6 items-start">
      {/* Left Column: Dual Displays (Twin + Desk Cam) */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-24">
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

      {/* Right Column: Studio Composer Controls */}
      <div className="flex flex-col gap-6">
        <PixelPad
          pixels={pixels}
          onChange={onPixelsChange}
          soundEnabled={soundEnabled}
        />

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

        {/* Action Drawer */}
        <section className="bg-gradient-to-b from-[#151821] to-[#101218] border border-[#272b38] rounded-2xl p-4 md:p-5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] flex flex-col gap-3">
          <button
            onClick={onOpenSubmit}
            disabled={isSubmitting}
            className="cursor-pointer w-full font-mono font-extrabold text-base tracking-wider py-4 px-6 rounded-xl text-slate-950 bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] border border-[#fcd34d] border-b-4 border-b-[#92400e] shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:brightness-105 active:translate-y-[2px] active:border-b-2 transition"
          >
            {isSubmitting ? 'Message In Queue…' : 'Send to Desk Clock 🚀'}
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onDownloadPng}
              className="cursor-pointer flex-1 min-w-[140px] font-mono font-semibold text-xs py-2.5 px-3 rounded-lg bg-gradient-to-b from-[#232733] to-[#1a1d26] border border-[#2f3444] border-b-2 text-slate-300 hover:text-white transition"
            >
              ↓ Download Pixel Art .png
            </button>
            <button
              onClick={onDownloadJson}
              className="cursor-pointer flex-1 min-w-[140px] font-mono font-semibold text-xs py-2.5 px-3 rounded-lg bg-gradient-to-b from-[#232733] to-[#1a1d26] border border-[#2f3444] border-b-2 text-slate-300 hover:text-white transition"
            >
              ↓ Download .json
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
