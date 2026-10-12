# NightShift

A DOM-aware dark theme for reading. Turns bright websites into a comfortable, eye-friendly dark theme — no jarring color inversion, no white flashes.

Built for Chrome and Edge, Manifest V3, no dependencies, no network access.

## Why NightShift?

- **Eye-friendly reading** — a real dark theme, not a filter/inversion; text stays sharp and readable
- **Three modes** — *Classic* (balanced), *Pure black* (OLED, true black), *Soft* (low-light contrast)
- **DOM-aware theming** — inspects the page and darkens cards, gradients, and light surfaces while protecting logos, images, and media
- **Simple by default** — one big **Night mode** switch, a **Look** picker, and a **Brightness** slider
- **Per-site by default** — tone, brightness, contrast, warmth, text, and colors are saved per website, so tweaking one site never affects another
- **Privacy-first** — no network requests, no analytics, no remote code. All settings live in `chrome.storage.local`
- **Free forever** — no premium tiers, no trials, no limits

## Features

### Main popup
- **Night mode** master switch
- **This website** — turn NightShift on/off for the current site, or force a mode for it
- **Look** — Classic / Pure black / Soft, saved for the current site
- **Brightness** — live page dimming, drag left for softer, right for brighter, saved for the current site

Everything below is saved **per site**: changing a setting on one website never changes another. Sites you have not customised use the built-in defaults.

### More settings
- **Contrast** and **Warmth** fine-tuning sliders
- **Reading** — text size, font family (System/Serif/Monospace), line spacing
- **Customize** — background, text, accent, and card colors
- **Advanced** — auto-schedule (turn on automatically between set times) and custom CSS injection
- **Reset** — the ↺ button in the *More settings* header returns this site's settings to their defaults


## Installation

1. Download and unzip this repository
2. Open `chrome://extensions` in Chrome (or `edge://extensions` in Edge)
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the extracted `NightShift` folder
5. Visit any website and click the NightShift icon — done


## Privacy Policy

- **No network requests** — NightShift never sends data anywhere
- **No analytics, no tracking, no cookies**
- **No third-party APIs or CDNs** — everything runs locally
- **No remote code** — nothing is downloaded at runtime
- All settings are stored only in your browser's local extension storage and never leave your device

## License

MIT
