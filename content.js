(function () {
  var STYLESHEET_ID = "nightshift-style";
  var CUSTOM_CSS_ID = "nightshift-custom";
  var KEYS = [
    "nightshift.enabled", "nightshift.mode", "nightshift.protectMedia",
    "nightshift.brightness", "nightshift.contrast", "nightshift.followSystem",
    "nightshift.siteOff", "nightshift.warmth",
    "nightshift.scheduleOn","nightshift.scheduleStart","nightshift.scheduleEnd",
    "nightshift.siteModes",
    "nightshift.fontSize","nightshift.fontFamily","nightshift.lineHeight",
    "nightshift.customCss","nightshift.customBg","nightshift.customFg","nightshift.customAccent","nightshift.customCard"
  ];
  var STRUCTURAL_KEYS = ["nightshift.enabled","nightshift.mode","nightshift.protectMedia","nightshift.followSystem","nightshift.siteOff","nightshift.scheduleOn","nightshift.scheduleStart","nightshift.scheduleEnd","nightshift.siteModes","nightshift.customCss"];
  var DEFAULTS = {
    enabled: true, mode: "dark", protectMedia: true,
    brightness: 1.0, contrast: 1.0, followSystem: false,
    siteOff: [], warmth: 0,
    scheduleOn: false, scheduleStart: "20:00", scheduleEnd: "06:00",
    siteModes: {},
    fontSize: 1.0, fontFamily: "system", lineHeight: 1.6,
    customCss: "", customBg: "", customFg: "", customAccent: "", customCard: ""
  };

  var MODES = {
    dark: {
      bg: [18, 18, 18], bgFloor: [5, 5, 5], bgCap: [61, 63, 69],
      card: [27, 29, 33], border: 0.12,
      fg: [230, 230, 230], fgFloor: [96, 96, 96],
      accent: [138, 180, 248], accentStrong: [174, 203, 250]
    },
    oled: {
      bg: [0, 0, 0], bgFloor: [0, 0, 0], bgCap: [61, 63, 69],
      card: [0, 0, 0], border: 0.16,
      fg: [255, 255, 255], fgFloor: [110, 110, 110],
      accent: [134, 180, 255], accentStrong: [168, 199, 255]
    },
    dim: {
      bg: [28, 28, 30], bgFloor: [5, 5, 5], bgCap: [58, 60, 66],
      card: [38, 38, 42], border: 0.09,
      fg: [201, 201, 201], fgFloor: [90, 90, 90],
      accent: [126, 166, 240], accentStrong: [157, 189, 245]
    }
  };

  var CSS =
    "html.nightshift-on{color-scheme:dark}" +
    "html.nightshift-on{background-color:var(--ns-bg,#121212)!important;background-image:none!important}" +
    "html.nightshift-on body{background-color:var(--ns-bg,#121212)!important;background-image:none!important;color:var(--ns-fg,#E6E6E6)!important}" +
    "html.nightshift-on body{font-size:var(--ns-font-scale,100%)!important}" +
    "html.nightshift-on body{font-family:var(--ns-font-family,system-ui,sans-serif)!important}" +
    "html.nightshift-on :where(p,li,td,th,dt,dd,blockquote){line-height:var(--ns-line-height,1.6)!important}" +
    "html.nightshift-on :where(h1,h2,h3,h4,h5,h6,p,li,td,th,label,button,legend,strong,em,small,b,i,span,dt,dd,blockquote,figcaption,caption,cite,summary,input,textarea,select){color:var(--ns-fg,#E6E6E6)!important}" +
    "html.nightshift-on :where(a) span{color:inherit!important}" +
    "html.nightshift-on .nightshift-card,html.nightshift-on .nightshift-card *{color:var(--ns-fg,#E6E6E6)!important}" +
    "html.nightshift-on :where(a){color:var(--ns-accent,#8AB4F8)!important}" +
    "html.nightshift-on :where(a:visited){color:#C58AF9!important}" +
    "html.nightshift-on :where(a:hover,a:focus-visible){color:var(--ns-accent-strong,#AECBFA)!important}" +
    "html.nightshift-on :where(input,textarea,select){background-color:rgba(255,255,255,0.04)!important;border-color:var(--ns-border,rgba(255,255,255,0.12))!important;caret-color:var(--ns-accent,#8AB4F8)!important}" +
    "html.nightshift-on input,html.nightshift-on textarea,html.nightshift-on select,html.nightshift-on [contenteditable]{color:var(--ns-fg,#E6E6E6)!important;background-color:rgba(255,255,255,0.06)!important;border-color:var(--ns-border,rgba(255,255,255,0.12))!important}" +
    "html.nightshift-on input::selection,html.nightshift-on textarea::selection{background-color:color-mix(in srgb,var(--ns-accent,#8AB4F8) 30%,transparent)!important;color:var(--ns-fg,#E6E6E6)!important}" +
    "html.nightshift-on :where(input:not([type=\"checkbox\"]):not([type=\"radio\"]):focus,textarea:focus,select:focus){border-color:var(--ns-accent,#8AB4F8)!important;outline:1px solid var(--ns-accent,#8AB4F8)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--ns-accent,#8AB4F8) 30%,transparent)!important}" +
    "html.nightshift-on :where(button,input[type=\"button\"],input[type=\"submit\"],input[type=\"reset\"],[role=\"button\"]){border-color:var(--ns-border,rgba(255,255,255,0.12))!important}" +
    "html.nightshift-on :where(button,input[type=\"button\"],input[type=\"submit\"],input[type=\"reset\"],[role=\"button\"]):hover,.nightshift-on :where(button,input[type=\"button\"],input[type=\"submit\"],input[type=\"reset\"],[role=\"button\"]):focus-visible{color:var(--ns-accent-strong,#AECBFA)!important}" +
    "html.nightshift-on :where(input[type=\"checkbox\"],input[type=\"radio\"]){accent-color:var(--ns-accent,#8AB4F8)!important}" +
    "html.nightshift-on ::placeholder{color:var(--ns-sec,#A0A0A0)!important}" +
    "html.nightshift-on :where(hr){border-color:var(--ns-border,rgba(255,255,255,0.12))!important}" +
    "html.nightshift-on :where(div,section,article,main,header,footer,aside,nav,ul,ol,li,table,tr,th,td,form,figure,figcaption,blockquote){border-color:var(--ns-border,rgba(255,255,255,0.12))!important}" +
    "html.nightshift-on .nightshift-icon-invert{filter:brightness(0) invert(1)!important}" +
    "html.nightshift-on,html.nightshift-on body,html.nightshift-on :where(header,main,footer,article,section,aside,nav,div,h1,h2,h3,h4,h5,h6,p,a,li,ul,ol,button,input,select,textarea,td,th){transition:background-color .15s ease,color .15s ease,border-color .15s ease}" +
    "html.nightshift-on{scrollbar-color:#3A3D44 #121212}" +
    "html.nightshift-on ::selection{background-color:color-mix(in srgb,var(--ns-accent,#8AB4F8) 30%,transparent);color:var(--ns-fg,#E6E6E6)}" +
    "@media (prefers-reduced-motion: reduce){html.nightshift-on,html.nightshift-on *{transition:none!important}}";

  var surfaces = [];

  function hex(arr) {
    return "#" + ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + arr[2]).toString(16).slice(1);
  }

  var FONT_FAMILIES = {
    system: "system-ui,sans-serif",
    serif: "Georgia,'Times New Roman',serif",
    mono: "'Courier New',Consolas,monospace"
  };

  function isHex(h) {
    return typeof h === "string" && /^#[0-9a-fA-F]{6}$/.test(h);
  }

  function hexRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function mix(c1, c2, t) {
    return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t, c1[2] + (c2[2] - c1[2]) * t];
  }

  function tint(col, w) {
    return [
      Math.min(255, Math.max(0, Math.round(col[0] + w * 16))),
      Math.min(255, Math.max(0, Math.round(col[1] + w * 6))),
      Math.min(255, Math.max(0, Math.round(col[2] - w * 24)))
    ];
  }

  function adjBg(mode, b, warmth) {
    var t, col;
    if (b <= 1) {
      t = (b - 0.4) / 0.6;
      col = mix(mode.bgFloor, mode.bg, t);
    } else {
      t = (b - 1) / 0.6;
      col = mix(mode.bg, mode.bgCap, t);
    }
    return tint(col, warmth);
  }

  function adjFg(mode, c, warmth) {
    var t, col;
    if (c <= 1) {
      t = (c - 0.4) / 0.6;
      col = mix(mode.fgFloor, mode.fg, t);
    } else {
      t = (c - 1) / 0.6;
      col = mix(mode.fg, [255, 255, 255], t);
    }
    return tint(col, warmth);
  }

  function parseRgb(str) {
    var m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    return {
      r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1
    };
  }

  function luminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function restoreSurfaces() {
    for (var i = 0; i < surfaces.length; i++) {
      surfaces[i].style.backgroundColor = "";
      surfaces[i].style.outline = "";
      surfaces[i].style.boxShadow = "";
      surfaces[i].style.borderColor = "";
      surfaces[i].style.color = "";
      surfaces[i].style.removeProperty("background-image");
      surfaces[i].classList.remove("nightshift-card");
      surfaces[i].classList.remove("nightshift-invert");
      surfaces[i].classList.remove("nightshift-icon-invert");
    }
    surfaces = [];
  }

  function dimRootBg(root) {
    if (!root) return;
    var img = getComputedStyle(root).backgroundImage;
    if (img === "none" && getComputedStyle(root).backgroundColor === "rgba(0, 0, 0, 0)") return;
    root.style.setProperty("background-image", "none", "important");
    root.style.setProperty("background-color", "var(--ns-bg, #121212)", "important");
    surfaces.push(root);
  }

  function themeSurfaces(state) {
    if (!document.body) return;
    restoreSurfaces();
    var cardVar = "var(--ns-card)";
    dimRootBg(document.documentElement);
    dimRootBg(document.body);

    var all = document.body.querySelectorAll("*");
    var cap = Math.min(all.length, 30000);
    for (var i = 0; i < cap; i++) {
      var el = all[i];
      if (el.nodeType !== 1) continue;
      if (el.id === STYLESHEET_ID) continue;

      var cs = getComputedStyle(el);
      var bgParsed = parseRgb(cs.backgroundColor);
      var lum = bgParsed ? luminance(bgParsed.r, bgParsed.g, bgParsed.b) : 0;

      if (el.tagName === "IMG" && el.naturalWidth > 0 && el.naturalWidth <= 128 &&
          el.closest && el.closest("a,button,header,nav,summary")) {
        el.classList.add("nightshift-icon-invert");
        surfaces.push(el);
        continue;
      }

      var bgImg = cs.backgroundImage;
      if (bgImg !== "none") {
        var isGrad = /gradient\(/i.test(bgImg);
        if (isGrad) {
          el.style.setProperty("background-image", "none", "important");
          el.style.setProperty("background-color", (bgParsed && bgParsed.a >= 0.05 && lum > 0.55) ? cardVar : "rgba(10,10,12,0.82)", "important");
          surfaces.push(el);
          continue;
        }
        if (!state.protectMedia) {
          el.style.setProperty("box-shadow", "inset 0 0 0 9999px rgba(16,16,16,0.45)", "important");
          surfaces.push(el);
          continue;
        }
      }

      if (el.tagName === "SVG") {
        var shapes = el.querySelectorAll("path,circle,rect,line,polyline,polygon,ellipse");
        if (shapes.length) {
          var darkNeutral = 0, sampled = 0;
          for (var k = 0; k < shapes.length && sampled < 8; k++) {
            var sh = getComputedStyle(shapes[k]);
            var sStr = sh.fill || sh.stroke || "rgb(0,0,0)";
            if (sStr === "none") continue;
            var sParsed = parseRgb(sStr);
            if (!sParsed) continue;
            sampled++;
            var sLum = luminance(sParsed.r, sParsed.g, sParsed.b);
            var sMax = Math.max(sParsed.r, sParsed.g, sParsed.b);
            var sMin = Math.min(sParsed.r, sParsed.g, sParsed.b);
            if (sLum < 0.35 && (sMax - sMin) < 60) darkNeutral++;
          }
          if (sampled > 0 && darkNeutral === sampled) {
            el.classList.add("nightshift-icon-invert");
          }
        }
        surfaces.push(el);
        continue;
      }

      if (bgParsed && bgParsed.a > 0.01 && lum > 0.55) {
        el.classList.add("nightshift-card");
        el.style.setProperty("background-color", cardVar, "important");
        el.style.setProperty("outline", "1px solid rgba(255,255,255,0.08)", "important");
        surfaces.push(el);
        continue;
      }

      var tag = el.tagName;
      var isBtn = tag === "BUTTON" || el.getAttribute("role") === "button";
      var isActionInput = tag === "INPUT" &&
        (el.type === "button" || el.type === "submit" || el.type === "reset");
      if ((isBtn || isActionInput) &&
          (!bgParsed || bgParsed.a < 0.05) &&
          cs.backgroundImage === "none") {
        el.style.setProperty("background-color", "rgba(255,255,255,0.07)", "important");
        el.style.setProperty("border-color", "rgba(255,255,255,0.4)", "important");
        surfaces.push(el);
        continue;
      }
    }
  }

  function buildProps(state, modeName) {
    var mode = MODES[modeName || state.mode] || MODES.dark;
    var b = clamp(state.brightness, 0.4, 1.6);
    var c = clamp(state.contrast, 0.4, 1.6);
    var w = clamp(state.warmth, 0, 1);
    var html = document.documentElement;

    var fgAdj = adjFg(mode, c, w);
    var bgHex = isHex(state.customBg) ? state.customBg : hex(adjBg(mode, b, w));
    var fgHex = isHex(state.customFg) ? state.customFg : hex(fgAdj);
    var accHex = isHex(state.customAccent) ? state.customAccent : hex(mode.accent);
    var cardHex = isHex(state.customCard) ? state.customCard : hex(mode.card);
    var fgBase = isHex(state.customFg) ? hexRgb(state.customFg) : fgAdj;

    html.style.setProperty("--ns-bg", bgHex);
    html.style.setProperty("--ns-fg", fgHex);
    html.style.setProperty("--ns-sec", hex(tint([
      Math.round(fgBase[0] * 0.68),
      Math.round(fgBase[1] * 0.68),
      Math.round(fgBase[2] * 0.68)
    ], w)));
    html.style.setProperty("--ns-card", cardHex);
    html.style.setProperty("--ns-border", "rgba(255,255,255," + mode.border + ")");
    html.style.setProperty("--ns-accent", accHex);
    html.style.setProperty("--ns-accent-strong", hex(mode.accentStrong));
    html.style.setProperty("--ns-font-scale", Math.round(clamp(state.fontSize, 0.85, 1.3) * 100) + "%");
    html.style.setProperty("--ns-font-family", FONT_FAMILIES[state.fontFamily] || FONT_FAMILIES.system);
    html.style.setProperty("--ns-line-height", String(clamp(state.lineHeight, 1.3, 1.9)));
  }

  function clearProps() {
    var html = document.documentElement;
    html.style.removeProperty("--ns-bg");
    html.style.removeProperty("--ns-fg");
    html.style.removeProperty("--ns-sec");
    html.style.removeProperty("--ns-card");
    html.style.removeProperty("--ns-border");
    html.style.removeProperty("--ns-accent");
    html.style.removeProperty("--ns-accent-strong");
    html.style.removeProperty("--ns-font-scale");
    html.style.removeProperty("--ns-font-family");
    html.style.removeProperty("--ns-line-height");
  }

  function siteOffContains(hostname, siteOff) {
    for (var i = 0; i < siteOff.length; i++) {
      if (siteOff[i] === hostname) return true;
    }
    return false;
  }
  function toMin(s){ var p=(s||"00:00").split(":"); return parseInt(p[0],10)*60+parseInt(p[1],10); }
  function inSchedule(state){
    if(!state.scheduleOn) return true;
    var n=(new Date().getHours())*60+(new Date().getMinutes());
    var s=toMin(state.scheduleStart);
    var e=toMin(state.scheduleEnd);
    return s<=e ? (n>=s && n<e) : (n>=s || n<e);
  }
  function ensureScheduler(state){ if(state.scheduleOn && !schedTimer){ schedTimer=setInterval(function(){ readAndApply(); },30000); } else if(!state.scheduleOn && schedTimer){ clearInterval(schedTimer); schedTimer=null; } }

  function apply(state) {
    ensureScheduler(state);
    var html = document.documentElement;
    if (!state.enabled ||
        (state.followSystem && !window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        siteOffContains(location.hostname, state.siteOff || [])) {
      html.classList.remove("nightshift-on");
      clearProps();
      removeCustomCss();
      restoreSurfaces();
      if (observer) observer.disconnect();
      observer = null;
      if (obsTimer) { clearTimeout(obsTimer); obsTimer = null; }
      return;
    }

    html.classList.add("nightshift-on");
    var mode = (state.siteModes || {})[location.hostname] || state.mode;
    buildProps(state, mode);
    insertCustomCss(state.customCss);
    themeSurfaces(state);
    watchDom();
  }

  function applyTint(state) {
    document.documentElement.classList.add("nightshift-on");
    buildProps(state, (state.siteModes || {})[location.hostname] || state.mode);
  }

  function getState(result) {
    return {
      enabled: result["nightshift.enabled"] !== undefined ? result["nightshift.enabled"] : DEFAULTS.enabled,
      mode: result["nightshift.mode"] || DEFAULTS.mode,
      protectMedia: result["nightshift.protectMedia"] !== undefined ? result["nightshift.protectMedia"] : DEFAULTS.protectMedia,
      brightness: result["nightshift.brightness"] !== undefined ? result["nightshift.brightness"] : DEFAULTS.brightness,
      contrast: result["nightshift.contrast"] !== undefined ? result["nightshift.contrast"] : DEFAULTS.contrast,
      followSystem: result["nightshift.followSystem"] !== undefined ? result["nightshift.followSystem"] : DEFAULTS.followSystem,
      siteOff: result["nightshift.siteOff"] || DEFAULTS.siteOff,
      warmth: result["nightshift.warmth"] !== undefined ? result["nightshift.warmth"] : DEFAULTS.warmth,
      scheduleOn: result["nightshift.scheduleOn"] !== undefined ? result["nightshift.scheduleOn"] : DEFAULTS.scheduleOn,
      scheduleStart: result["nightshift.scheduleStart"] !== undefined ? result["nightshift.scheduleStart"] : DEFAULTS.scheduleStart,
      scheduleEnd: result["nightshift.scheduleEnd"] !== undefined ? result["nightshift.scheduleEnd"] : DEFAULTS.scheduleEnd,
      siteModes: result["nightshift.siteModes"] || {},
      fontSize: result["nightshift.fontSize"] !== undefined ? result["nightshift.fontSize"] : DEFAULTS.fontSize,
      fontFamily: result["nightshift.fontFamily"] || DEFAULTS.fontFamily,
      lineHeight: result["nightshift.lineHeight"] !== undefined ? result["nightshift.lineHeight"] : DEFAULTS.lineHeight,
      customCss: result["nightshift.customCss"] || DEFAULTS.customCss,
      customBg: result["nightshift.customBg"] || DEFAULTS.customBg,
      customFg: result["nightshift.customFg"] || DEFAULTS.customFg,
      customAccent: result["nightshift.customAccent"] || DEFAULTS.customAccent,
      customCard: result["nightshift.customCard"] || DEFAULTS.customCard
    };
  }

  function readAndApply() {
    chrome.storage.local.get(KEYS, function (result) {
      apply(getState(result));
    });
  }

  function insertStylesheet() {
    if (document.getElementById(STYLESHEET_ID)) return;
    var s = document.createElement("style");
    s.id = STYLESHEET_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function insertCustomCss(css) {
    if (!css) { removeCustomCss(); return; }
    var el = document.getElementById(CUSTOM_CSS_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = CUSTOM_CSS_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
  }

  function removeCustomCss() {
    var el = document.getElementById(CUSTOM_CSS_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  insertStylesheet();
  document.documentElement.classList.add("nightshift-on");
  readAndApply();

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "local") return;
    var structural = false;
    var tint = false;
    var i;
    for (i = 0; i < STRUCTURAL_KEYS.length; i++) {
      if (changes[STRUCTURAL_KEYS[i]]) structural = true;
    }
    for (i = 0; i < KEYS.length; i++) {
      if (changes[KEYS[i]]) tint = true;
    }
    if (!tint) return;
    if (structural) {
      readAndApply();
    } else {
      chrome.storage.local.get(KEYS, function (result) {
        applyTint(getState(result));
      });
    }
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    readAndApply();
  });

  window.addEventListener("load", function () {
    readAndApply();
  });
  setTimeout(function () {
    readAndApply();
  }, 800);
  var obsTimer = null;
  var observer = null;
  var schedTimer = null;
  function watchDom() {
    if (observer) return;
    observer = new MutationObserver(function (muts) {
      if (!document.documentElement.classList.contains("nightshift-on")) return;
      var want = false;
      for (var i = 0; i < muts.length; i++) {
        var nodes = muts[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var el = nodes[j];
          if (el.nodeType !== 1) continue;
          if (el.tagName === "IMG" || el.tagName === "SVG" || el.tagName === "BUTTON" || (el.tagName === "INPUT" && (el.type === "button" || el.type === "submit")) || el.getAttribute("role") === "button" || el.tagName === "DIV" || el.tagName === "SECTION" || el.tagName === "ARTICLE" || el.tagName === "MAIN" || el.tagName === "ASIDE" || el.tagName === "FOOTER" || el.tagName === "HEADER") { want = true; break; }
          if (el.querySelectorAll) {
            var found = el.querySelectorAll("img,svg,button,[role=\"button\"],[style*=\"background\"]");
            if (found.length) { want = true; break; }
          }
        }
        if (want) break;
      }
      if (!want) return;
      if (obsTimer) return;
      obsTimer = setTimeout(function () {
        obsTimer = null;
        if (document.documentElement.classList.contains("nightshift-on")) {
          chrome.storage.local.get(KEYS, function (r) {
            apply(getState(r));
          });
        }
      }, 500);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  // ponytail: observer is childList+350ms debounce; style edits don't retrigger it. Re-walk is gated by apply()'s full path.
})();