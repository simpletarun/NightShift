# NightShift

A DOM-aware dark theme for reading. Turns bright websites into a comfortable, eye-friendly dark theme — no jarring color inversion, no white flashes.

Built for Chrome and Edge, Manifest V3, no dependencies, no network access.

## Why NightShift?

- **Eye-friendly reading** — a real dark theme, not a filter/inversion; text stays sharp and readable
- **Three modes** — *Classic* (balanced), *Pure black* (OLED, true black), *Soft* (low-light contrast)
- **DOM-aware theming** — inspects the page and darkens cards, gradients, and light surfaces while protecting logos, images, and media
- **Simple by default** — one big **Night mode** switch, a **Look** picker, a **Brightness** slider, and one-tap **Quick looks**
- **Everything a power user wants** — show **More settings** for per-site control, contrast, warmth, text size/style/spacing, custom colors, auto schedule, and custom CSS
- **Privacy-first** — no network requests, no analytics, no remote code. All settings live in `chrome.storage.local`
- **Free forever** — no premium tiers, no trials, no limits

## Features

### Main popup
- **Night mode** master switch
- **This website** — turn NightShift on/off for the current site, or force a mode for it
- **Look** — Classic / Pure black / Soft
- **Brightness** — live page dimming, drag left for softer, right for brighter
- **Quick looks** — Midnight, OLED, Warm, and Night one-tap presets

### More settings
- **Contrast** and **Warmth** fine-tuning sliders
- **Reading** — text size, font family (System/Serif/Monospace), line spacing
- **Customize** — background, text, accent, and card colors plus a live color palette (click a chip to copy its hex)
- **Advanced** — auto-schedule (turn on automatically between set times), keep-images-normal toggle, match-device-dark-mode toggle, and custom CSS injection

### Shortcuts
| Shortcut | Action |
|---|---|
| `Alt+Shift+D` | Toggle NightShift |
| `Alt+Shift+M` | Cycle mode (Classic → Pure black → Soft) |
| `Alt+Shift+S` | Toggle NightShift on this site |

You can also right-click a page and use **Toggle NightShift on this page** / **Toggle on this site** from the context menu.

## Installation

1. Download and unzip this repository
2. Open `chrome://extensions` in Chrome (or `edge://extensions` in Edge)
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the extracted `NightShift` folder
5. Visit any website and click the NightShift icon — done

## Usage

1. Click the NightShift toolbar icon to open the popup
2. Flip **Night mode** on
3. Pick a **Look** and adjust **Brightness** to taste
4. Browse anywhere — NightShift follows you automatically, and even watches live page changes (SPAs included)

The toolbar badge shows `ON`/`OFF`, and the icon tooltip shows the active mode.

## Development

```
File overview
├── manifest.json        # MV3 manifest
├── background.js        # Service worker: badge, shortcuts, context menu
├── content.js           # Page theming engine (DOM walk + CSS variables)
├── popup.html           # Popup UI
├── popup.js             # Popup logic + live preview
├── icons/               # 16/48/128 px icons
└── tests/check.ps1      # Static validation suite
```

### Tests

Run the static validation suite from the project root (PowerShell 5.1+):

```powershell
powershell -ExecutionPolicy Bypass -File tests\check.ps1
```

It validates:
- `manifest.json` — version 3, permissions, content-script wiring, shortcuts
- `content.js` / `background.js` / `popup.js` — required feature markers and banned legacy patterns
- `popup.html` — required controls and no inline scripts
- A `node --check` syntax pass on every script (skipped with a warning if Node.js isn't installed)

All checks must end in `RESULT: PASS`.

## Privacy Policy

- **No network requests** — NightShift never sends data anywhere
- **No analytics, no tracking, no cookies**
- **No third-party APIs or CDNs** — everything runs locally
- **No remote code** — nothing is downloaded at runtime
- All settings are stored only in your browser's local extension storage and never leave your device

## License

MIT