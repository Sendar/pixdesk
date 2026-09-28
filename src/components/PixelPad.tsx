import React, { useRef, useState } from 'react';
import { PixelColor, ToolType } from '../types';
import { PRESETS, SWATCHES } from '../utils/presets';
import { getThumbnailUrl } from '../utils/matrix';
import { playBlip, playArpeggio } from '../utils/audio';

interface PixelPadProps {
  pixels: PixelColor[];
  onChange: (pixels: PixelColor[]) => void;
  soundEnabled?: boolean;
}

export const PixelPad: React.FC<PixelPadProps> = ({
  pixels,
  onChange,
  soundEnabled = true,
}) => {
  const [tool, setTool] = useState<ToolType>('pencil');
  const [activeColor, setActiveColor] = useState<string>('#f59e0b');
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastIndexRef = useRef<number>(-1);

  const getCellIndex = (e: React.PointerEvent<HTMLDivElement>): number => {
    const el = gridRef.current;
    if (!el) return -1;
    const rect = el.getBoundingClientRect();
    const pad = 6;
    const col = Math.floor(((e.clientX - rect.left - pad) / (rect.width - 2 * pad)) * 16);
    const row = Math.floor(((e.clientY - rect.top - pad) / (rect.height - 2 * pad)) * 16);
    if (col < 0 || col > 15 || row < 0 || row > 15) return -1;
    return row * 16 + col;
  };

  const paintCell = (idx: number) => {
    const val = tool === 'eraser' ? null : activeColor;
    if (pixels[idx] === val) return;

    const next = [...pixels];
    next[idx] = val;
    onChange(next);

    if (idx !== lastIndexRef.current) {
      lastIndexRef.current = idx;
      playBlip(tool === 'eraser' ? 220 : 880, 0.02, 'square', 0, soundEnabled);
    }
  };

  const floodFill = (startIdx: number) => {
    const target = pixels[startIdx];
    const fillVal = activeColor;
    if (target === fillVal) return;

    const next = [...pixels];
    const stack = [startIdx];

    while (stack.length > 0) {
      const idx = stack.pop()!;
      if (next[idx] !== target) continue;
      next[idx] = fillVal;

      const col = idx % 16;
      const row = Math.floor(idx / 16);

      if (col > 0) stack.push(idx - 1);
      if (col < 15) stack.push(idx + 1);
      if (row > 0) stack.push(idx - 16);
      if (row < 15) stack.push(idx + 16);
    }

    onChange(next);
    playArpeggio([520, 780], soundEnabled);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const idx = getCellIndex(e);
    if (idx < 0) return;

    if (tool === 'fill') {
      floodFill(idx);
      return;
    }
    if (tool === 'pick') {
      const color = pixels[idx];
      if (color) {
        setActiveColor(color);
        setTool('pencil');
        playBlip(1200, 0.04, 'square', 0, soundEnabled);
      }
      return;
    }

    setIsDrawing(true);
    lastIndexRef.current = -1;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    paintCell(idx);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const idx = getCellIndex(e);
    if (idx >= 0) paintCell(idx);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Image Downscaler & Color Quantizer
  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        16,
        16
      );

      const imgData = ctx.getImageData(0, 0, 16, 16).data;
      const quant = (v: number) => Math.round(v / 85) * 85;
      const nextPixels: PixelColor[] = [];

      for (let i = 0; i < 256; i++) {
        const r = imgData[i * 4];
        const g = imgData[i * 4 + 1];
        const b = imgData[i * 4 + 2];
        const a = imgData[i * 4 + 3];

        if (a < 100 || r + g + b < 48) {
          nextPixels.push(null);
        } else {
          const hex =
            '#' +
            [quant(r), quant(g), quant(b)]
              .map(n => n.toString(16).padStart(2, '0'))
              .join('');
          nextPixels.push(hex);
        }
      }

      onChange(nextPixels);
      setUploadName(file.name);
      playArpeggio([440, 660, 880], soundEnabled);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const litCount = pixels.filter(Boolean).length;

  return (
    <section className="bg-gradient-to-b from-[#151821] to-[#101218] border border-[#272b38] rounded-2xl shadow-[0_20px_40px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#272b38]">
        <div className="flex items-center gap-2.5">
          <span className="font-['Press_Start_2P'] text-[9px] px-1.5 py-1 rounded bg-[#f59e0b] text-[#0a0b0e] font-bold">
            A
          </span>
          <span className="text-xs tracking-wider font-bold text-slate-100 font-mono">
            16×16 PIXEL STUDIO
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-slate-400 font-mono">
          {litCount} / 256 LIT
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          {/* 16x16 Interactive Drawing Pad */}
          <div className="flex-1 min-w-[260px] max-w-[340px]">
            <div
              ref={gridRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="grid grid-cols-16 gap-[2px] p-2 aspect-square bg-[#060709] rounded-xl border border-[#272b38] shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] touch-none cursor-crosshair select-none"
            >
              {pixels.map((col, i) => (
                <div
                  key={i}
                  className="rounded-[2px] transition-colors duration-75"
                  style={{
                    backgroundColor: col || '#0e1016',
                    boxShadow: col
                      ? `0 0 6px ${col}99, inset 0 0 0 1px rgba(255,255,255,0.15)`
                      : 'inset 0 0 0 1px #1a1d26',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tools & Palette Deck */}
          <div className="flex-1 min-w-[200px] flex flex-col gap-3">
            {/* Tool Selection */}
            <div>
              <div className="text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
                TOOLS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'pencil' as ToolType, label: 'PEN (B)', glyph: '✎' },
                  { id: 'eraser' as ToolType, label: 'ERASE (E)', glyph: '⌫' },
                  { id: 'fill' as ToolType, label: 'FILL (G)', glyph: '◧' },
                  { id: 'pick' as ToolType, label: 'PICK (I)', glyph: '◉' },
                ].map(t => {
                  const isActive = tool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTool(t.id);
                        playBlip(700, 0.04, 'square', 0, soundEnabled);
                      }}
                      className={`cursor-pointer flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider px-2.5 py-1.5 rounded-lg border transition ${
                        isActive
                          ? 'border-[#f59e0b] text-amber-300 bg-gradient-to-b from-[#2a2e3d] to-[#1c1f2b] shadow-[0_0_12px_rgba(245,158,11,0.25)] translate-y-[1px]'
                          : 'border-[#2f3444] text-slate-300 bg-gradient-to-b from-[#232733] to-[#1a1d26] border-b-2'
                      }`}
                    >
                      <span>{t.glyph}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    onChange(new Array(256).fill(null));
                    playBlip(160, 0.12, 'square', 0, soundEnabled);
                  }}
                  className="cursor-pointer text-[11px] font-mono font-semibold tracking-wider px-2.5 py-1.5 rounded-lg border border-[#374151] border-b-2 text-rose-400 bg-[#161a24] hover:bg-rose-950/30 transition"
                >
                  ✕ CLEAR
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
                COLOR PALETTE
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {SWATCHES.map(color => {
                  const isSelected = activeColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setActiveColor(color);
                        if (tool === 'eraser' || tool === 'pick') setTool('pencil');
                        playBlip(900, 0.03, 'square', 0, soundEnabled);
                      }}
                      style={{ backgroundColor: color }}
                      className={`cursor-pointer aspect-square rounded-md border border-black/50 transition transform hover:scale-105 ${
                        isSelected
                          ? 'ring-2 ring-white shadow-[0_0_12px_currentColor]'
                          : 'shadow-[inset_0_-2px_0_rgba(0,0,0,0.35)]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Active Hex Input */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0a0b0e] border border-[#272b38]">
              <input
                type="color"
                value={activeColor}
                onChange={e => setActiveColor(e.target.value)}
                className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer rounded overflow-hidden"
              />
              <div className="flex flex-col text-left">
                <span className="text-[9px] tracking-widest text-slate-400 font-mono">
                  ACTIVE RGB
                </span>
                <span className="text-xs font-bold font-mono text-slate-100">
                  {activeColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Preset Sprites */}
        <div>
          <div className="text-[10px] tracking-widest text-slate-400 mb-2 font-mono">
            PRESET LIBRARY · 1-CLICK LOAD
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  if (p.px) onChange([...p.px]);
                  setUploadName(null);
                  playArpeggio([660, 990], soundEnabled);
                }}
                className="cursor-pointer flex flex-col items-center gap-1.5 p-2 rounded-lg bg-[#0a0b0e] border border-[#272b38] hover:border-amber-500/80 text-slate-300 font-mono text-[10px] transition hover:text-amber-300"
              >
                {p.px && (
                  <img
                    src={getThumbnailUrl(p.px, 3)}
                    alt={p.name}
                    className="w-8 h-8 rounded [image-rendering:pixelated]"
                  />
                )}
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Image Converter */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) processImageFile(e.dataTransfer.files[0]);
          }}
          className={`cursor-pointer flex items-center gap-3.5 p-3 rounded-xl border-1.5 border-dashed transition ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-[#2f3444] bg-[#0a0b0e] hover:border-slate-400'
          }`}
        >
          <span className="flex-none grid place-items-center w-9 h-9 rounded-lg bg-[#1a1d26] border border-[#2f3444] text-cyan-400 font-mono text-base font-bold">
            ⇪
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-100 font-mono">
              Image Auto-Downscaler
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {uploadName
                ? `Quantized “${uploadName}” → 16×16. Drop another to replace.`
                : 'Drop any PNG/JPG image to auto-quantize into 16×16 pixels.'}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files?.[0]) processImageFile(e.target.files[0]);
            }}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
};
