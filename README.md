## Why use NightShift?

- **Eye-friendly reading** — a real dark theme, not just a color inversion; text stays sharp and readable
- **Three modes** — Dark (balanced), OLED (true black for AMOLED screens), Dim (soft contrast for low light)
- **DOM-aware theming** — analyzes page structure to darken cards, gradients, and surfaces while protecting logos, images, and media
- **Full control** — brightness, contrast, warmth, font size, font family, line height, custom colors, custom CSS
- **Per-site control** — toggle NightShift on a whole site or force a specific mode per site
- **Privacy-first** — no network requests, no analytics, no remote code. All settings live in `chrome.storage.local` only
- **Free forever** — no premium tiers, no trials, no feature limits

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

It validates the manifest, content script, background worker, and popup against
the shipped features, plus a `node --check` syntax pass on every script.

## Privacy Policy (the short version)

- **No network requests** — NightShift never phones home
- **No analytics, no tracking, no cookies**
- **No third-party APIs or CDNs** — everything runs locally
- **No remote code** — nothing is downloaded at runtime
- All settings are saved only in your browser's local extension storage

## License

MIT
