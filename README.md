# NightShift — Free, Privacy-Focused Dark Theme for Chrome

**NightShift** is a 100% free and unlimited Chrome extension that turns any website into a comfortable dark-reading experience. It applies a DOM-aware dark theme with **Dark / OLED / Dim** modes, brightness and contrast controls, warm-tone lighting, reading typography, and per-site toggles.

NightShift runs 100% locally — **zero network requests, zero tracking, zero analytics**. Every setting stays in your browser.

## Why use NightShift?

- **Eye-friendly reading** — a real dark theme, not just a color inversion; text stays sharp and readable
- **Three modes** — Dark (balanced), OLED (true black for AMOLED screens), Dim (soft contrast for low light)
- **DOM-aware theming** — analyzes page structure to darken cards, gradients, and surfaces while protecting logos, images, and media
- **Full control** — brightness, contrast, warmth, font size, font family, line height, custom colors, custom CSS
- **Per-site control** — toggle NightShift on a whole site or force a specific mode per site
- **Privacy-first** — no network requests, no analytics, no remote code. All settings live in `chrome.storage.local` only
- **Free forever** — no premium tiers, no trials, no feature limits

## Working Features

### Modes & Tuning
- **Dark / OLED / Dim** modes with one-click switching or `Alt+Shift+M` to cycle
- **Brightness** (40–160%) and **contrast** (40–160%) sliders with live preview
- **Warmth** slider for a warm, sepia reading light
- **Presets**: Midnight, OLED, Warm paper, Dim night

### DOM-Aware Theming
- Detects and re-themes light card surfaces, gradients, and backgrounds
- **Protect images & media** (on by default) — images, photos, and video are never altered
- Small inline icons are gently inverted to stay visible on dark surfaces
- Respects CSS custom properties; accent-color-aware form controls

### Per-Site Control
- Toggle NightShift **on this site** (toolbar or `Alt+Shift+S`)
- Force a mode for a specific site (per-site override)
- Right-click menu: Toggle on page / Toggle on site

### Reading Helpers
- **Font size** scaling (85–130%) with quick chips
- **Font family**: System, Serif, or Monospace
- **Line height** adjustment

### Automation
- **Follow system dark mode** — activates automatically when the OS uses dark mode
- **Auto schedule** — turn on only between a start/end time (e.g. 20:00–06:00)

### Customization
- Custom Background / Text / Accent / Card colors (with click-to-copy hex chips)
- **Custom CSS** injected while NightShift is active
- One-click **Reset** to defaults

### Shortcuts
| Shortcut | Action |
|---|---|
| `Alt+Shift+D` | Toggle NightShift |
| `Alt+Shift+M` | Cycle mode (Dark → OLED → Dim) |
| `Alt+Shift+S` | Toggle on this site |

## Installation

1. Download this repository (or the release ZIP)
2. Open `chrome://extensions` in Chrome (or `edge://extensions` for Edge)
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Visit any website and click the NightShift icon — done

## Development / Tests

NightShift ships its own no-dependency test harness:

```powershell
powershell -ExecutionPolicy Bypass -File tests/check.ps1
```

It validates the manifest, content script, background worker, and popup against
the shipped features, plus a `node --check` syntax pass on every script.

## Privacy Policy (the short version)

- **No network requests** — NightShift never phones home
- **No analytics, no tracking, no cookies**
- **No third-party APIs or CDNs** — everything runs locally
- **No remote code** — nothing is downloaded at runtime
- All settings are saved only in your browser's local extension storage

## Free & Unlimited

NightShift is **free, open source, and unlimited**. There is no premium version,
no trial, no feature limits, and no paid quota. It will stay that way.

## License

MIT