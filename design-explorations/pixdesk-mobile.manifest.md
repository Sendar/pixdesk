# Data Grounding Manifest — PixDesk Mobile Explorations

Data bindings and fixtures for the PixDesk mobile explorations (~390px viewport width).

| UI Element | Data Field / Binding | Class | Notes |
| :--- | :--- | :--- | :--- |
| **16×52 Matrix Twin** | `canvas.digital_twin` | ✅ Real | Scaled to ~320px–360px width with touch-optimized DPI |
| **Desk Cam Snapshot** | `r2.latest_snapshot_url` | ✅ Real | `/latest.jpg` cached with 3s refresh bar |
| **16×16 Touch Pad** | `touch.grid[256]` | ✅ Real | Touch-capture pointer drag with min 18px touch targets |
| **Marquee Input** | `form.text` | ✅ Real | Max 60 ASCII characters, on-screen keyboard compatible |
| **Scroll FX / Speed** | `form.fx`, `form.speed` | ✅ Real | Segmented pills + touch slider |
| **Queue Pill** | `queue.active_count` | ✅ Real | Compact mobile badge ("3 in queue · 45s") |
| **Live Proof of Play** | `modal.receipt_image` | ✅ Real | Responsive polaroid receipt snapshot |
| **1-Click Mobile Pay** | `stripe.payment_request` | ✅ Real | Native Apple Pay / Google Pay bottom sheet trigger |
