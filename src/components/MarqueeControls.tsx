import React, { useRef } from 'react';
import { FxMode } from '../types';
import { TEXT_COLORS } from '../utils/presets';
import { validateText, textCols } from '../utils/font';
import { playBlip } from '../utils/audio';

interface MarqueeControlsProps {
  text: string;
  onTextChange: (text: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  fx: FxMode;
  onFxChange: (fx: FxMode) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  soundEnabled?: boolean;
}

export const MarqueeControls: React.FC<MarqueeControlsProps> = ({
  text,
  onTextChange,
  textColor,
  onTextColorChange,
  fx,
  onFxChange,
  speed,
  onSpeedChange,
  soundEnabled = true,
}) => {
  const knobRef = useRef<{ startY: number; startSpeed: number } | null>(null);
  const validation = validateText(text);
  const textWidth = textCols(text).w;
  const isStaticClipped = fx === 'static' && textWidth > 36;

  const handleKnobPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    knobRef.current = { startY: e.clientY, startSpeed: speed };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleKnobPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!knobRef.current) return;
    const dy = knobRef.current.startY - e.clientY;
    const delta = (dy / 70);
    const newSpeed = Math.max(1, Math.min(3, Math.round((knobRef.current.startSpeed + delta) * 10) / 10));
    if (newSpeed !== speed) {
      onSpeedChange(newSpeed);
      playBlip(300 + newSpeed * 150, 0.015, 'square', 0, soundEnabled);
    }
  };

  const handleKnobPointerUp = () => {
    knobRef.current = null;
  };

  const knobAngle = -135 + ((speed - 1) / 2) * 270;

  return (
    <section className="bg-gradient-to-b from-[#151821] to-[#101218] border border-[#272b38] rounded-2xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#272b38]">
        <div className="flex items-center gap-2.5">
          <span className="font-['Press_Start_2P'] text-[9px] px-1.5 py-1 rounded bg-[#10b981] text-[#0a0b0e] font-bold">
            B
          </span>
          <span className="text-xs tracking-wider font-bold text-slate-100 font-mono">
            MARQUEE TEXT & FX
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-slate-400 font-mono">
          16×36 COLUMNS
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Message Input */}
        <div>
          <div className="flex justify-between items-center text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
            <span>MESSAGE</span>
            <span className={text.length >= 55 ? 'text-amber-400 font-bold' : ''}>
              {text.length}/60
            </span>
          </div>
          <input
            type="text"
            value={text}
            onChange={e => onTextChange(e.target.value.slice(0, 60))}
            placeholder="Type your marquee message..."
            spellCheck={false}
            className="w-full font-mono text-base font-bold uppercase tracking-wider text-slate-100 bg-[#060709] border border-[#272b38] focus:border-emerald-500 rounded-xl px-3.5 py-3 outline-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.7)] transition"
          />
          {!validation.isValid && (
            <div className="mt-2 text-[11px] text-amber-300 flex gap-1.5 items-start font-mono">
              <span>⚠</span>
              <span>{validation.warning}</span>
            </div>
          )}
        </div>

        {/* Neon Colors */}
        <div>
          <div className="text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
            TEXT ACCENT COLOR
          </div>
          <div className="flex flex-wrap gap-2">
            {TEXT_COLORS.map(item => {
              const isSelected = textColor === item.c && fx !== 'rainbow';
              return (
                <button
                  key={item.c}
                  onClick={() => {
                    onTextColorChange(item.c);
                    if (fx === 'rainbow') onFxChange('scroll');
                    playBlip(880, 0.03, 'square', 0, soundEnabled);
                  }}
                  className={`cursor-pointer flex items-center gap-2 text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-lg border bg-[#0a0b0e] transition ${
                    isSelected
                      ? 'border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                      : 'border-[#272b38] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.c, boxShadow: `0 0 6px ${item.c}` }}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display FX Selector */}
        <div>
          <div className="text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
            DISPLAY ANIMATION FX
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#060709] border border-[#272b38]">
            {[
              { id: 'scroll' as FxMode, label: '⟵ Scroll Left' },
              { id: 'static' as FxMode, label: '⏹ Static Center' },
              { id: 'blink' as FxMode, label: '⚡ Blink Alert' },
              { id: 'rainbow' as FxMode, label: '◐ Rainbow Cycle' },
            ].map(f => {
              const isSelected = fx === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    onFxChange(f.id);
                    playBlip(760, 0.04, 'square', 0, soundEnabled);
                  }}
                  className={`cursor-pointer font-mono text-[11px] font-bold tracking-wide py-2.5 px-2 rounded-lg border transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          {isStaticClipped && (
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Static fits ~5–6 letters. Long messages clip unless you choose Scroll Left.
            </div>
          )}
        </div>

        {/* Scroll Speed Rotary Knob & Range */}
        <div className="flex items-center gap-4 pt-1">
          {/* Rotary Knob */}
          <div
            onPointerDown={handleKnobPointerDown}
            onPointerMove={handleKnobPointerMove}
            onPointerUp={handleKnobPointerUp}
            title="Drag up or down to adjust speed"
            className="flex-none relative w-14 h-14 rounded-full cursor-ns-resize touch-none select-none bg-[repeating-conic-gradient(#3a3f4c_0deg_6deg,#1c1f27_6deg_12deg)] shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]"
            style={{ transform: `rotate(${knobAngle}deg)` }}
          >
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#3b404c,#15171d)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />
            <div className="absolute left-1/2 top-2 w-[3px] h-3 -ml-[1.5px] rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-[10px] tracking-widest text-slate-400 mb-1.5 font-mono">
              <span>SCROLL SPEED</span>
              <span className="text-amber-300 font-bold">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={speed}
              onChange={e => onSpeedChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1.0x SLOW</span>
              <span>2.0x</span>
              <span>3.0x FAST</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
