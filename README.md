# PixDesk ▞ — Interactive Live Desk Billboard (ULANZI TC002)

A viral, low-latency web application designed to run on **Cloudflare's Free Tier** (Pages, Workers, D1, Turnstile, Tunnel) that allows online visitors and sponsors to compose 16×16 pixel art, write scrolling neon marquee messages, and watch them illuminate a real **ULANZI TC002 Smart Pixel Clock** live on desk webcam stream snapshots.

---

## 🌟 Key Features

* **Digital Twin Simulator (16×52 RGB LED Matrix):**
  * Hardware-accurate curved casing matching the physical ULANZI TC002.
  * 60 FPS HTML5 Canvas dot-matrix bloom shader with radial-gradient glow caching.
  * Split geometry: Columns 0–15 (16×16 icon) + Columns 16–51 (16×36 text marquee).
  * Built-in 5×7 and 5×14 tall pixel bitmask typography engine with ASCII validation.

* **Live Desk Camera Snapshot (Cloudflare R2):**
  * Zero-cost, privacy-safe alternative to an always-on 24/7 video broadcast.
  * High-resolution snapshot captures from a local Synology NAS every 3 seconds to Cloudflare R2 (`/latest.jpg`).

* **Ergonomic Responsive Layouts:**
  * **Desktop ($> 768\text{px}$):** Studio Workbench (Dual Monitor: Digital Twin + Live Desk Feed, 16×16 PixelPad, Marquee FX controller, rotary speed knob).
  * **Mobile ($\le 768\text{px}$):** Progressive 3-Step Wizard:
    * **Step 1:** Draw 16×16 Icon with fat-finger touch targets, presets, and image converter.
    * **Step 2:** Marquee Text & FX without keyboard occlusion.
    * **Step 3:** Review 16×52 twin & desk feed, select display tier, and submit.

* **Monetization & Moderation Tiers:**
  * **Community Free (€0.00):** 10-second slot, Cloudflare Turnstile bot verification, Signal push approval.
  * **Fast Track Priority (€1.50):** 20-second slot, cuts to the front of the line, triggers the physical clock buzzer alert.
  * **Sponsor Billboard (€9.00 / 24h):** Pins 16×16 brand logo + text message into the permanent 24-hour rotating loop.

* **"Proof of Play" Social Share Receipt:**
  * Generates a retro Polaroid-style desk webcam snapshot with a verified timestamp (*"Verified on Sander's Desk at 18:04:12 CET"*).
  * 1-click sharing to X, Bluesky, LinkedIn, or instant PNG download.

* **Synthesizer Web Audio:**
  * 8-bit sound blips, arpeggios, and buzzer chimes generated dynamically using browser oscillator nodes.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
* **Hosting:** Cloudflare Pages (Free Tier).
* **Edge Backend:** Cloudflare Workers, Cloudflare D1 (Queue), Cloudflare Turnstile.
* **Bridge:** Cloudflare Tunnel (`cloudflared`) to Synology NAS / Home Assistant.
* **Hardware:** ULANZI TC002 Smart Pixel Clock (16×52 RGB LED Matrix).

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone git@github.com:Sendar/pixdesk.git
cd pixdesk

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production (Cloudflare Pages)
npm run build
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── DigitalTwin.tsx        # 16x52 LED Matrix Canvas & Bezel
│   │   ├── DeskFeed.tsx           # Live Desk Cam & Snapshot Feed
│   │   ├── PixelPad.tsx           # 16x16 Interactive Drawing Pad
│   │   ├── MarqueeControls.tsx    # Text marquee input & rotary knob
│   │   ├── DesktopStudio.tsx      # Desktop Direction A Workbench
│   │   ├── MobileWizard.tsx       # Mobile Direction C 3-Step Wizard
│   │   ├── TierModal.tsx          # Stripe & Turnstile selection modal
│   │   ├── ReceiptModal.tsx       # Proof-of-Play Polaroid card
│   │   └── AboutModal.tsx         # How it works info modal
│   ├── utils/
│   │   ├── audio.ts               # Web Audio API 8-bit synth
│   │   ├── font.ts                # 5x7 dot-matrix font & validator
│   │   ├── matrix.ts              # 832 LED frame builder & sprite cache
│   │   ├── presets.ts             # 16x16 icon library & palettes
│   │   └── receipt.ts             # Canvas receipt snapshot generator
│   ├── App.tsx                    # Root state & responsive layout switcher
│   └── main.tsx                   # React DOM entry
├── design-explorations/           # Standalone visual exploration references
├── package.json
└── vite.config.ts
```

---

## 📄 License

MIT © [Sander Hendriks](https://github.com/Sendar)
