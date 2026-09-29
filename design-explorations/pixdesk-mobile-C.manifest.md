# Implementation Manifest — PixDesk Mobile Variant C (3-Step Wizard)

Reference: [pixdesk-mobile-C.reference.html](./pixdesk-mobile-C.reference.html)

| UI Element | Data Binding / Field | Class | Status / Count | Gap Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **16×16 Touch Pad** | `client.pixels[256]` | ✅ Real | Always populated (default Pacman or Heart) | Bind directly to touch/pointer handlers |
| **Marquee Text** | `client.text` | ✅ Real | 1–60 ASCII characters | Default: "HELLO FROM AMSTERDAM" |
| **FX & Speed** | `client.fx`, `client.speed` | ✅ Real | Always set (`scroll-left`, `static`, etc.) | Segmented pill state |
| **16×52 Matrix Review** | `canvas.frame[832]` | ✅ Real | Composed of 256 icon pixels + 576 marquee pixels | Rendered via canvas sprite engine |
| **Desk Cam Snapshot** | `r2.latest_snapshot_url` | ✅ Real | `/latest.jpg` from Cloudflare R2 | Image tag with 3s refresh bar |
| **Pricing Tiers** | `config.tiers[]` | ✅ Real | €0.00 Free, €1.50 Interrupt, €9.00 Sponsor | Native selection radio |
| **Turnstile Token** | `auth.cf_turnstile_token` | ✅ Real | Injected on Step 3 for €0.00 submissions | Cloudflare Turnstile widget |
| **1-Click Mobile Pay** | `stripe.payment_request` | ✅ Real | Apple Pay / Google Pay sheet on €1.50+ | Stripe Elements PaymentRequest |
| **Buzzer Acoustic Alert** | `tc002.buzzer` | ⚠️ Sometimes | Triggered on Fast Track Interrupt (€1.50) | **Derive:** Only send buzzer flag when tier !== 'free' |
| **Ambient Desk Glow** | `hue.desk_flash` | ⚠️ Sometimes | Optional Home Assistant trigger | **Designed placeholder:** Omit from payload if HA unconfigured |
| **Social Proof Receipt** | `r2.receipt_url` | ✅ Real | `receipt_<job_id>.jpg` rendered upon completion | Polaroid modal triggered on job end |
