var DEFAULTS = {
  "nightshift.enabled": true,
  "nightshift.mode": "dark",
  "nightshift.protectMedia": true,
  "nightshift.brightness": 1.0,
  "nightshift.contrast": 1.0,
  "nightshift.followSystem": false,
  "nightshift.siteOff": [],
  "nightshift.siteModes": {},
  "nightshift.warmth": 0
};
var LABELS = { dark: "Dark", oled: "OLED", dim: "Dim" };

function ensureDefaults() {
  chrome.storage.local.get(Object.keys(DEFAULTS), function (result) {
    var toSet = {};
    Object.keys(DEFAULTS).forEach(function (k) {
      if (result[k] === undefined) toSet[k] = DEFAULTS[k];
    });
    if (Object.keys(toSet).length > 0) chrome.storage.local.set(toSet);
  });
}

function updateBadge() {
  chrome.storage.local.get(["nightshift.enabled", "nightshift.mode"], function (r) {
    var enabled = r["nightshift.enabled"] !== undefined ? r["nightshift.enabled"] : true;
    var mode = r["nightshift.mode"] || "dark";
    var text = enabled ? "ON" : "OFF";
    var title = enabled ? "NightShift: " + (LABELS[mode] || "Dark") : "NightShift (off)";
    chrome.action.setBadgeText({ text: text });
    chrome.action.setTitle({ title: title });
  });
}

function createMenu() {
  chrome.contextMenus.create({ id: "ns-page", title: "Toggle NightShift on this page", contexts: ["page", "frame"] }, function () { if (chrome.runtime.lastError) { } });
  chrome.contextMenus.create({ id: "ns-site", title: "Toggle NightShift on this site", contexts: ["page", "frame"] }, function () { if (chrome.runtime.lastError) { } });
}

chrome.runtime.onInstalled.addListener(function () {
  ensureDefaults();
  updateBadge();
  chrome.contextMenus.removeAll(function () { createMenu(); });
});

chrome.runtime.onStartup.addListener(function () {
  ensureDefaults();
  updateBadge();
});

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "local" && (changes["nightshift.enabled"] || changes["nightshift.mode"])) {
    updateBadge();
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-nightshift") {
    chrome.storage.local.get({ "nightshift.enabled": true }, function (r) {
      chrome.storage.local.set({ "nightshift.enabled": !r["nightshift.enabled"] });
    });
  }
  if (command === "cycle-mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var host = null;
      try { host = tabs[0] && tabs[0].url ? new URL(tabs[0].url).hostname : null; } catch (e) { host = null; }
      chrome.storage.local.get({ "nightshift.mode": "dark", "nightshift.siteModes": {} }, function (d) {
        var ring = ["dark", "oled", "dim"];
        var sm = d["nightshift.siteModes"] || {};
        var cur = (host && sm[host]) || d["nightshift.mode"];
        var next = ring[(ring.indexOf(cur) + 1) % ring.length];
        if (host) { sm[host] = next; chrome.storage.local.set({ "nightshift.siteModes": sm }); }
        else chrome.storage.local.set({ "nightshift.mode": next });
      });
    });
  }
  if (command === "toggle-site") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var host = null;
      try { host = tabs[0] && tabs[0].url ? new URL(tabs[0].url).hostname : null; } catch (e) { return; }
      if (!host) return;
      chrome.storage.local.get({ "nightshift.siteOff": [] }, function (d) {
        var off = d["nightshift.siteOff"];
        var i = off.indexOf(host);
        if (i === -1) off.push(host); else off.splice(i, 1);
        chrome.storage.local.set({ "nightshift.siteOff": off });
      });
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "ns-page") {
    chrome.storage.local.get({ "nightshift.enabled": true }, function (d) {
      chrome.storage.local.set({ "nightshift.enabled": !d["nightshift.enabled"] });
    });
  } else if (info.menuItemId === "ns-site") {
    var host = null;
    try { host = new URL(tab.url).hostname; } catch (e) { return; }
    chrome.storage.local.get({ "nightshift.siteOff": [] }, function (d) {
      var off = d["nightshift.siteOff"];
      var i = off.indexOf(host);
      if (i === -1) off.push(host); else off.splice(i, 1);
      chrome.storage.local.set({ "nightshift.siteOff": off });
    });
  }
});