import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PixelColor, FxMode, CamState, QueueItem, DisplayTier, ReceiptData, SubmissionState } from './types';
import { PRESET_MAP } from './utils/presets';
import { getThumbnailUrl } from './utils/matrix';
import { generateReceiptImage } from './utils/receipt';
import { playBlip, playArpeggio } from './utils/audio';
import { DesktopStudio } from './components/DesktopStudio';
import { MobileWizard } from './components/MobileWizard';
import { TierModal } from './components/TierModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AboutModal } from './components/AboutModal';

const MOCK_QUEUE: QueueItem[] = [
  { flag: '🇳🇱', who: 'Amsterdam', text: 'HELLO FROM AMSTERDAM', icon: 'heart', color: '#f43f5e', fx: 'scroll' },
  { flag: '🇯🇵', who: 'Tokyo', text: 'KONNICHIWA FROM TOKYO', icon: 'pacman', color: '#facc15', fx: 'scroll' },
  { flag: '🇧🇷', who: 'São Paulo', text: 'BOM DIA SANDER', icon: 'heart', color: '#f43f5e', fx: 'scroll' },
  { flag: '🇺🇸', who: 'Austin', text: 'SHIP IT FAST ⚡', icon: 'flame', color: '#f59e0b', fx: 'rainbow' },
  { flag: '🇩🇪', who: 'Berlin', text: 'HALLO FREUNDE', icon: 'alien', color: '#10b981', fx: 'static' },
];

export function App() {
  const [pixels, setPixels] = useState<PixelColor[]>(() => PRESET_MAP.heart.px?.slice() || new Array(256).fill(null));
  const [text, setText] = useState<string>('HELLO FROM AMSTERDAM');
  const [textColor, setTextColor] = useState<string>('#f59e0b');
  const [fx, setFx] = useState<FxMode>('scroll');
  const [speed, setSpeed] = useState<number>(1.5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [activeQueueIdx, setActiveQueueIdx] = useState<number>(0);
  const [camState, setCamState] = useState<CamState>('idle');

  // Modals
  const [showTierModal, setShowTierModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  // Queue submission tracking
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  // Viewport resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Queue item rotation
  useEffect(() => {
    const timer = setInterval(() => {
      if (!submission || submission.status === 'queued') {
        setActiveQueueIdx(prev => (prev + 1) % MOCK_QUEUE.length);
      }
    }, 9000);
    return () => clearInterval(timer);
  }, [submission]);

  const currentQueueItem = MOCK_QUEUE[activeQueueIdx];

  // Submission countdown & display trigger
  const handleTierSubmit = (_tier: DisplayTier) => {
    setShowTierModal(false);
    playArpeggio([523, 659, 784, 1047], soundEnabled);

    // Enter simulated queue
    setSubmission({ pos: 1, status: 'queued' });

    // Transition to LIVE after 2 seconds
    setTimeout(() => {
      setSubmission({ pos: 0, status: 'playing' });
      setCamState('message_playing');
      playArpeggio([880, 1175, 1400], soundEnabled);

      // Trigger photo snapshot after 5 seconds
      setTimeout(() => {
        setSubmission({ pos: 0, status: 'capturing' });
        setCamState('capturing_receipt');
        playBlip(1400, 0.12, 'triangle', 0, soundEnabled);

        // Complete receipt creation
        setTimeout(() => {
          const now = new Date();
          const receiptImg = generateReceiptImage(pixels, text, textColor, fx, speed, now);
          setReceipt({
            img: receiptImg,
            time: now,
            jobId: Math.random().toString(36).substring(2, 7),
            text: text,
          });

          setCamState('idle');
          setSubmission(null);
          playArpeggio([784, 988, 1175], soundEnabled);

          // Confetti celebratory burst
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch (_) {}
        }, 1200);
      }, 5000);
    }, 2000);
  };

  const handleDownloadPng = () => {
    const thumbUrl = getThumbnailUrl(pixels, 20);
    const link = document.createElement('a');
    link.href = thumbUrl;
    link.download = 'pixdesk-art.png';
    link.click();
  };

  const handleDownloadJson = () => {
    const data = {
      device: 'ULANZI_TC002',
      matrix: '16x52',
      pixels,
      text,
      textColor,
      fx,
      speed,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pixdesk-art.json';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(6,182,212,0.07),transparent_60%),radial-gradient(900px_500px_at_100%_0%,rgba(245,158,11,0.06),transparent_60%),#0a0b0e] text-slate-200 font-mono">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 bg-[#0a0b0e]/85 backdrop-blur-md border-b border-[#272b38]">
        {/* Brand & Live Dot */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="grid grid-cols-3 gap-0.5 p-1 rounded-md bg-[#050607] border border-[#272b38]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1d26]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1d26]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1d26]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1d26]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
            </div>
            <span className="font-['Press_Start_2P'] text-xs text-white tracking-wider">
              PixDesk
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="hidden sm:inline">DESK CLOCK ONLINE</span>
            <span className="text-slate-400 font-normal">(Amsterdam, NL)</span>
          </div>
        </div>

        {/* Now Playing Ticker */}
        <div className="hidden lg:flex items-center gap-2.5 max-w-sm flex-1 px-3 py-1.5 rounded-full bg-[#050607] border border-[#272b38] shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]">
          <span className="font-['Press_Start_2P'] text-[7px] text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-full font-bold">
            NOW ON DESK
          </span>
          <span className="text-sm">{submission ? '📍' : currentQueueItem.flag}</span>
          <span className="text-xs font-bold text-amber-300 truncate max-w-[180px]">
            {submission ? text.toUpperCase() : currentQueueItem.text}
          </span>
          <span className="ml-auto text-[10px] text-slate-400">
            {submission ? 'YOU' : currentQueueItem.who}
          </span>
        </div>

        {/* Queue Counter & Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-[11px] text-slate-300 px-3 py-1.5 rounded-lg border border-[#272b38] bg-[#12141a]">
            <span className="text-white font-bold">{submission ? '1' : '3'} in queue</span>
            <span className="text-slate-400"> · Est. wait {submission ? '0s' : '45s'}</span>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playBlip(990, 0.04, 'square', 0, !soundEnabled);
            }}
            className="cursor-pointer text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#232733] to-[#1a1d26] border border-[#2f3444] border-b-2 transition"
            style={{ color: soundEnabled ? '#10b981' : '#64748b' }}
          >
            {soundEnabled ? '♪ SFX ON' : '♪ SFX OFF'}
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="cursor-pointer text-[11px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#232733] to-[#1a1d26] border border-[#2f3444] border-b-2 text-slate-300 hover:text-white transition"
          >
            About
          </button>
        </div>
      </header>

      {/* Main Responsive Viewport: Desktop Studio vs Mobile 3-Step Wizard */}
      <main className="pb-16">
        {isMobile ? (
          <MobileWizard
            pixels={pixels}
            onPixelsChange={setPixels}
            text={text}
            onTextChange={setText}
            textColor={textColor}
            onTextColorChange={setTextColor}
            fx={fx}
            onFxChange={setFx}
            speed={speed}
            onSpeedChange={setSpeed}
            camState={camState}
            onOpenSubmit={() => setShowTierModal(true)}
            soundEnabled={soundEnabled}
          />
        ) : (
          <DesktopStudio
            pixels={pixels}
            onPixelsChange={setPixels}
            text={text}
            onTextChange={setText}
            textColor={textColor}
            onTextColorChange={setTextColor}
            fx={fx}
            onFxChange={setFx}
            speed={speed}
            onSpeedChange={setSpeed}
            camState={camState}
            onOpenSubmit={() => setShowTierModal(true)}
            onDownloadPng={handleDownloadPng}
            onDownloadJson={handleDownloadJson}
            isSubmitting={!!submission}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Bottom Live Queue Toast Pill */}
      {submission && (
        <div className="fixed left-1/2 bottom-5 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#050607] border border-amber-400 shadow-[0_0_30px_-6px_#f59e0b,0_20px_40px_rgba(0,0,0,0.8)] text-xs font-bold text-amber-300 whitespace-nowrap font-mono animate-bounce">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span>
            {submission.status === 'queued'
              ? 'QUEUED · POSITION 1 · APPEARING SHORTLY…'
              : submission.status === 'playing'
              ? 'LIVE ON SANDER’S DESK NOW!'
              : 'CAPTURING PROOF OF PLAY PHOTO…'}
          </span>
        </div>
      )}

      {/* Modals */}
      {showTierModal && (
        <TierModal
          pixels={pixels}
          text={text}
          onClose={() => setShowTierModal(false)}
          onSubmit={handleTierSubmit}
          soundEnabled={soundEnabled}
        />
      )}

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  );
}
