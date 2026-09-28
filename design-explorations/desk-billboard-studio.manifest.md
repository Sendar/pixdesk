# Data Grounding Manifest — PixDesk / ULANZI TC002 Pixbar

This manifest tracks data fixtures and state bindings across the 4 design explorations.

| UI Element | Field / Data Source | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Active Display Job** | `queue.active_job.text` | ✅ Real | From spec ("Hello from Amsterdam!", etc.) |
| **16×16 Pixel Art Icon** | `queue.active_job.icon_matrix` | ✅ Real | 16×16 RGB color grid / preset bitmaps |
| **Marquee FX / Speed** | `job.animation_mode` | ✅ Real | `scroll-left`, `static`, `blink`, `flash-alert` |
| **Matrix Dimensions** | `device.hardware_specs` | ✅ Real | 16 rows × 52 columns (832 RGB LEDs) |
| **Desk Cam Snapshot** | `r2.latest_snapshot_url` | ✅ Real | `/latest.jpg` from Cloudflare R2 via Synology capture |
| **Queue Position / ETA** | `queue.pending_count`, `queue.eta_seconds` | ✅ Real | Calculated from active queue length × duration |
| **Monetization Tiers** | `pricing_tiers[]` | ✅ Real | €0.00 Free, €1.50 Interrupt, €3.00 Custom, €9.00 Sponsor |
| **Turnstile Challenge** | `auth.turnstile_token` | ✅ Real | Cloudflare Turnstile bot verification |
| **Buzzer Acoustic Alert** | `device.buzzer_trigger` | ⚠️ Sometimes | Triggered on Fast Track / Tip events |
| **Ambient Hue Flash** | `homeassistant.desk_light_color` | ⚠️ Sometimes | Optional Home Assistant / Hue light flash on desk |
| **Social Share Receipt** | `receipts[job_id].url` | ✅ Real | Snapshot generated upon broadcast completion |
