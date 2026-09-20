const DEFAULTS={"nightshift.enabled":true,"nightshift.mode":"dark","nightshift.protectMedia":true,"nightshift.brightness":1.0,"nightshift.contrast":1.0,"nightshift.warmth":0,"nightshift.followSystem":false,"nightshift.siteOff":[],"nightshift.siteModes":{},"nightshift.scheduleOn":false,"nightshift.scheduleStart":"20:00","nightshift.scheduleEnd":"06:00","nightshift.fontSize":1,"nightshift.fontFamily":"system","nightshift.lineHeight":1.6,"nightshift.customCss":"","nightshift.customBg":"","nightshift.customFg":"","nightshift.customAccent":"","nightshift.customCard":""};
const KEYS=Object.keys(DEFAULTS);
const els={
  enabled:document.getElementById("ns-enabled"),
  site:document.getElementById("ns-site"),
  siteMode:document.getElementById("ns-site-mode"),
  host:document.getElementById("ns-host"),
  brightness:document.getElementById("ns-brightness"),
  brightnessVal:document.getElementById("ns-brightness-val"),
  contrast:document.getElementById("ns-contrast"),
  contrastVal:document.getElementById("ns-contrast-val"),
  warmth:document.getElementById("ns-warmth"),
  warmthVal:document.getElementById("ns-warmth-val"),
  media:document.getElementById("ns-media"),
  follow:document.getElementById("ns-follow"),
  schedule:document.getElementById("ns-schedule"),
  schedStart:document.getElementById("ns-sched-start"),
  schedEnd:document.getElementById("ns-sched-end"),
  reset:document.getElementById("ns-reset"),
  rBrightness:document.getElementById("ns-reset-brightness"),
  rContrast:document.getElementById("ns-reset-contrast"),
  rWarmth:document.getElementById("ns-reset-warmth"),
  preview:document.getElementById("ns-preview"),
  fontSize:document.getElementById("ns-font-size"),
  fontSizeVal:document.getElementById("ns-font-size-val"),
  fontFamily:document.getElementById("ns-font-family"),
  lineHeight:document.getElementById("ns-line-height"),
  lineHeightVal:document.getElementById("ns-line-height-val"),
  resetFontSize:document.getElementById("ns-reset-font-size"),
  resetLineHeight:document.getElementById("ns-reset-line-height"),
  customBg:document.getElementById("ns-custom-bg"),
  customFg:document.getElementById("ns-custom-fg"),
  customAccent:document.getElementById("ns-custom-accent"),
  customCard:document.getElementById("ns-custom-card"),
  resetColors:document.getElementById("ns-reset-colors"),
  customCss:document.getElementById("ns-custom-css")
};
els.brightness.min=40;els.brightness.max=160;
els.contrast.min=40;els.contrast.max=160;
els.fontSize.min=85;els.fontSize.max=130;
els.lineHeight.min=130;els.lineHeight.max=190;
let siteHost="";
let state={};
const PALETTE={dark:{bg:[18,18,18],bgFloor:[5,5,5],bgCap:[61,63,69],card:[27,29,33],fg:[230,230,230],fgFloor:[96,96,96],accent:[138,180,248]},oled:{bg:[0,0,0],bgFloor:[0,0,0],bgCap:[61,63,69],card:[0,0,0],fg:[255,255,255],fgFloor:[110,110,110],accent:[134,180,255]},dim:{bg:[28,28,30],bgFloor:[5,5,5],bgCap:[58,60,66],card:[38,38,42],fg:[201,201,201],fgFloor:[90,90,90],accent:[126,166,240]}};
const PRESETS={
  midnight:{["nightshift.mode"]:"dark",["nightshift.brightness"]:1,["nightshift.contrast"]:1,["nightshift.warmth"]:0},
  oled:{["nightshift.mode"]:"oled",["nightshift.brightness"]:1,["nightshift.contrast"]:1,["nightshift.warmth"]:0},
  paper:{["nightshift.mode"]:"dark",["nightshift.brightness"]:1.2,["nightshift.contrast"]:1.1,["nightshift.warmth"]:0.6},
  night:{["nightshift.mode"]:"dim",["nightshift.brightness"]:0.9,["nightshift.contrast"]:0.85,["nightshift.warmth"]:0.4}
};
function mix(c1,c2,t){return[c1[0]+(c2[0]-c1[0])*t,c1[1]+(c2[1]-c1[1])*t,c1[2]+(c2[2]-c1[2])*t]}
function tint(col,w){return[Math.min(255,Math.max(0,Math.round(col[0]+w*16))),Math.min(255,Math.max(0,Math.round(col[1]+w*6))),Math.min(255,Math.max(0,Math.round(col[2]-w*24)))]}
function adjBg(mode,b,w){var t;var col=b<=1?(t=(b-0.4)/0.6,mix(mode.bgFloor,mode.bg,t)):(t=(b-1)/0.6,mix(mode.bg,mode.bgCap,t));return tint(col,w)}
function adjCard(mode,b,w){var floor=[Math.round(mode.card[0]*0.5),Math.round(mode.card[1]*0.5),Math.round(mode.card[2]*0.5)];var cap=[Math.min(255,mode.card[0]+46),Math.min(255,mode.card[1]+46),Math.min(255,mode.card[2]+46)];var t;var col=b<=1?(t=(b-0.4)/0.6,mix(floor,mode.card,t)):(t=(b-1)/0.6,mix(mode.card,cap,t));return tint(col,w)}
function adjFg(mode,c,w){var t;var col=c<=1?(t=(c-0.4)/0.6,mix(mode.fgFloor,mode.fg,t)):(t=(c-1)/0.6,mix(mode.fg,[255,255,255],t));return tint(col,w)}
function hex(arr){return"#"+((1<<24)+(arr[0]<<16)+(arr[1]<<8)+arr[2]).toString(16).slice(1).toUpperCase()}
function fallbackCopy(h){var t=document.createElement("textarea");t.value=h;t.style.position="fixed";t.style.opacity="0";document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t)}
function paletteOf(d){
  var mode=PALETTE[d["nightshift.mode"]]||PALETTE.dark;
  var b=d["nightshift.brightness"]||1;
  var c=d["nightshift.contrast"]||1;
  var w=d["nightshift.warmth"]||0;
  var bgc=adjBg(mode,b,w);
  var fgc=adjFg(mode,c,w);
  return{bg:d["nightshift.customBg"]||hex([Math.round(bgc[0]),Math.round(bgc[1]),Math.round(bgc[2])]),fg:d["nightshift.customFg"]||hex([Math.round(fgc[0]),Math.round(fgc[1]),Math.round(fgc[2])]),card:d["nightshift.customCard"]||hex(adjCard(mode,b,w)),acc:d["nightshift.customAccent"]||hex(mode.accent)}
}
function renderPreview(d){
  var p=paletteOf(d);
  els.preview.innerHTML='<button class="chip" data-hex="'+p.bg+'" title="Copy '+p.bg+'">BG '+p.bg+'</button> '+'<button class="chip" data-hex="'+p.fg+'" title="Copy '+p.fg+'">Text '+p.fg+'</button> '+'<button class="chip" data-hex="'+p.card+'" title="Copy '+p.card+'">Card '+p.card+'</button> '+'<button class="chip" data-hex="'+p.acc+'" title="Copy '+p.acc+'">Accent '+p.acc+'</button>';
}
function round(n){return Math.round(n*100)/100}
function syncUI(d){
  els.enabled.checked=!!d["nightshift.enabled"];
  els.media.checked=!!d["nightshift.protectMedia"];
  els.follow.checked=!!d["nightshift.followSystem"];
  const bv=round(d["nightshift.brightness"]*100);
  const cv=round(d["nightshift.contrast"]*100);
  const wv=round((d["nightshift.warmth"]||0)*100);
  els.brightness.value=bv;
  els.brightnessVal.textContent=bv+"%";
  els.contrast.value=cv;
  els.contrastVal.textContent=cv+"%";
  els.warmth.value=wv;
  els.warmthVal.textContent=wv+"%";
  els.schedule.checked=!!d["nightshift.scheduleOn"]; els.schedStart.value=d["nightshift.scheduleStart"]||"20:00"; els.schedEnd.value=d["nightshift.scheduleEnd"]||"06:00";
  document.querySelectorAll("#ns-mode button").forEach(b=>{b.classList.toggle("active",b.dataset.value===d["nightshift.mode"])});
  const off=d["nightshift.siteOff"]||[];
  const on=siteHost&&off.indexOf(siteHost)===-1;
  els.site.textContent="On this site: "+(on?"ON":"OFF");
  els.site.className="btn-site"+(on?" on":"");
  els.siteMode.disabled=els.site.disabled;
  var sm=d["nightshift.siteModes"]||{};
  els.siteMode.value=(siteHost&&sm[siteHost])?sm[siteHost]:"";
  const fsz=Math.round((d["nightshift.fontSize"]||1)*100);
  els.fontSize.value=fsz;els.fontSizeVal.textContent=fsz+"%";
  document.querySelectorAll(".fs-chip").forEach(b=>{b.classList.toggle("active",fsz==Number(b.dataset.fs))});
  els.fontFamily.value=d["nightshift.fontFamily"]||"system";
  const lh=Math.round((d["nightshift.lineHeight"]||1.6)*100);
  els.lineHeight.value=lh;els.lineHeightVal.textContent=(lh/100).toFixed(1);
  var p=paletteOf(d);
  els.customBg.value=d["nightshift.customBg"]||p.bg;
  els.customFg.value=d["nightshift.customFg"]||p.fg;
  els.customAccent.value=d["nightshift.customAccent"]||p.acc;
  els.customCard.value=d["nightshift.customCard"]||p.card;
  els.customCss.value=d["nightshift.customCss"]||"";
  renderPreview(d);
}
function getHost(cb){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    if(!tabs[0]||!/https?:/.test(tabs[0].url||"")){els.host.textContent="Browser page — not applicable";els.site.disabled=true;cb();return}
    siteHost=new URL(tabs[0].url).hostname;
    els.host.textContent=siteHost;
    cb();
  });
}
function init(){
  let pending=2;
  function done(){
    if(--pending)return;
    chrome.storage.local.get(DEFAULTS,function(d){state=d;syncUI(d)});
  }
  chrome.storage.local.get(DEFAULTS,function(d){
    const missing={};KEYS.forEach(k=>{if(!(k in d))missing[k]=DEFAULTS[k]});
    if(Object.keys(missing).length)chrome.storage.local.set(missing,done);else done();
  });
  getHost(done);
}
els.preview.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest(".chip");
  if(!b||!b.dataset||!b.dataset.hex)return;
  var h=b.dataset.hex;
  function done(){var t=b.textContent;b.textContent="✓ Copied "+t;setTimeout(function(){b.textContent=t},900)}
  if(navigator.clipboard){navigator.clipboard.writeText(h).then(done,function(){fallbackCopy(h);done()})}
  else{fallbackCopy(h);done()}
});
els.rBrightness.addEventListener("click",function(){state["nightshift.brightness"]=1;els.brightness.value=100;els.brightnessVal.textContent="100%";renderPreview(state);chrome.storage.local.set({"nightshift.brightness":1})});
els.rContrast.addEventListener("click",function(){state["nightshift.contrast"]=1;els.contrast.value=100;els.contrastVal.textContent="100%";renderPreview(state);chrome.storage.local.set({"nightshift.contrast":1})});
els.rWarmth.addEventListener("click",function(){state["nightshift.warmth"]=0;els.warmth.value=0;els.warmthVal.textContent="0%";renderPreview(state);chrome.storage.local.set({"nightshift.warmth":0})});
els.enabled.addEventListener("change",function(){chrome.storage.local.set({"nightshift.enabled":this.checked})});
els.media.addEventListener("change",function(){chrome.storage.local.set({"nightshift.protectMedia":this.checked})});
els.follow.addEventListener("change",function(){chrome.storage.local.set({"nightshift.followSystem":this.checked})});
els.brightness.addEventListener("input",function(){const v=parseInt(this.value);els.brightnessVal.textContent=v+"%";state["nightshift.brightness"]=v/100;renderPreview(state);chrome.storage.local.set({"nightshift.brightness":v/100})});
els.contrast.addEventListener("input",function(){const v=parseInt(this.value);els.contrastVal.textContent=v+"%";state["nightshift.contrast"]=v/100;renderPreview(state);chrome.storage.local.set({"nightshift.contrast":v/100})});
els.warmth.addEventListener("input",function(){const v=parseInt(this.value);els.warmthVal.textContent=v+"%";state["nightshift.warmth"]=v/100;renderPreview(state);chrome.storage.local.set({"nightshift.warmth":v/100})});
document.querySelectorAll(".preset").forEach(function(b){b.addEventListener("click",function(){chrome.storage.local.set(PRESETS[b.dataset.preset],function(){chrome.storage.local.get(DEFAULTS,function(d){state=d;syncUI(d)})})})});
els.schedule.addEventListener("change",function(){chrome.storage.local.set({"nightshift.scheduleOn":this.checked})});
els.schedStart.addEventListener("change",function(){var v=this.value||"20:00";els.schedStart.value=v;chrome.storage.local.set({"nightshift.scheduleStart":v})});
els.schedEnd.addEventListener("change",function(){var v=this.value||"06:00";els.schedEnd.value=v;chrome.storage.local.set({"nightshift.scheduleEnd":v})});
document.querySelectorAll("#ns-mode button").forEach(function(b){b.addEventListener("click",function(){chrome.storage.local.set({"nightshift.mode":b.dataset.value})})});
els.site.addEventListener("click",function(){
  if(els.site.disabled||!siteHost)return;
  chrome.storage.local.get({"nightshift.siteOff":[]},function(d){
    const off=d["nightshift.siteOff"];
    const idx=off.indexOf(siteHost);
    if(idx===-1)off.push(siteHost);else off.splice(idx,1);
    chrome.storage.local.set({"nightshift.siteOff":off},function(){chrome.storage.local.get(DEFAULTS,syncUI)});
  });
});
els.siteMode.addEventListener("change",function(){
  if(els.siteMode.disabled||!siteHost)return;
  var v=els.siteMode.value;
  chrome.storage.local.get({"nightshift.siteModes":{}},function(d){
    var sm=d["nightshift.siteModes"]||{};
    if(v)sm[siteHost]=v;else delete sm[siteHost];
    chrome.storage.local.set({"nightshift.siteModes":sm},function(){
      chrome.storage.local.get(DEFAULTS,function(r){state=r;syncUI(r)});
    });
  });
});
els.reset.addEventListener("click",function(){chrome.storage.local.set(DEFAULTS,function(){chrome.storage.local.get(DEFAULTS,syncUI)})});
els.fontSize.addEventListener("input",function(){const v=parseInt(this.value);els.fontSizeVal.textContent=v+"%";document.querySelectorAll(".fs-chip").forEach(x=>x.classList.toggle("active",Number(x.dataset.fs)===v));state["nightshift.fontSize"]=v/100;chrome.storage.local.set({"nightshift.fontSize":v/100})});
document.querySelectorAll(".fs-chip").forEach(function(b){b.addEventListener("click",function(){var v=parseInt(b.dataset.fs);state["nightshift.fontSize"]=v/100;els.fontSize.value=v;els.fontSizeVal.textContent=v+"%";document.querySelectorAll(".fs-chip").forEach(x=>x.classList.toggle("active",x===b));chrome.storage.local.set({"nightshift.fontSize":v/100})})});
els.resetFontSize.addEventListener("click",function(){state["nightshift.fontSize"]=1;els.fontSize.value=100;els.fontSizeVal.textContent="100%";chrome.storage.local.set({"nightshift.fontSize":1})});
els.lineHeight.addEventListener("input",function(){const v=parseInt(this.value);els.lineHeightVal.textContent=(v/100).toFixed(1);state["nightshift.lineHeight"]=v/100;chrome.storage.local.set({"nightshift.lineHeight":v/100})});
els.resetLineHeight.addEventListener("click",function(){state["nightshift.lineHeight"]=1.6;els.lineHeight.value=160;els.lineHeightVal.textContent="1.6";chrome.storage.local.set({"nightshift.lineHeight":1.6})});
els.fontFamily.addEventListener("change",function(){chrome.storage.local.set({"nightshift.fontFamily":this.value})});
els.customBg.addEventListener("change",function(){state["nightshift.customBg"]=this.value;chrome.storage.local.set({"nightshift.customBg":this.value})});
els.customFg.addEventListener("change",function(){state["nightshift.customFg"]=this.value;chrome.storage.local.set({"nightshift.customFg":this.value})});
els.customAccent.addEventListener("change",function(){state["nightshift.customAccent"]=this.value;chrome.storage.local.set({"nightshift.customAccent":this.value})});
els.customCard.addEventListener("change",function(){state["nightshift.customCard"]=this.value;chrome.storage.local.set({"nightshift.customCard":this.value})});
els.resetColors.addEventListener("click",function(){state["nightshift.customBg"]="";state["nightshift.customFg"]="";state["nightshift.customAccent"]="";state["nightshift.customCard"]="";chrome.storage.local.set({"nightshift.customBg":"","nightshift.customFg":"","nightshift.customAccent":"","nightshift.customCard":""},function(){chrome.storage.local.get(DEFAULTS,syncUI)})});
els.customCss.addEventListener("change",function(){chrome.storage.local.set({"nightshift.customCss":this.value})});
init();