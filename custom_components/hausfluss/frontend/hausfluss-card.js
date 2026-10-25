/* Hausfluss – Modul 3 Energiefluss · Version 0.0.2 */
const VERSION = '0.0.2';
const POS = {
  top_1: [2, 1, 'in', '#facc15'], top_2: [3, 1, 'in', '#fbbf24'],
  left_1: [1, 2, 'out', '#f97316'], left_2: [1, 3, 'out', '#38bdf8'], left_3: [1, 4, 'out', '#a78bfa'],
  right_1: [4, 2, 'out', '#38bdf8'], right_2: [4, 3, 'out', '#2dd4bf'], right_3: [4, 4, 'out', '#f472b6'],
  bottom: [2, 5, 'out', '#4ade80'],
};
const POSNAME = { top_1: 'Oben 1', top_2: 'Oben 2', left_1: 'Links 1', left_2: 'Links 2', left_3: 'Links 3', right_1: 'Rechts 1', right_2: 'Rechts 2', right_3: 'Rechts 3', bottom: 'Unten' };
const SIDES = ['top', 'bottom', 'left', 'right'];
const FL = { top: 'Oben', bottom: 'Unten', left: 'Links', right: 'Rechts' };
const SW = ['#facc15', '#f97316', '#38bdf8', '#a78bfa', '#2dd4bf', '#f472b6', '#4ade80'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const img = (v) => /^(\/|https?:)/.test(v) ? `<img src="${esc(v)}" alt="">` : /^mdi:/.test(v) ? `<ha-icon icon="${esc(v)}"></ha-icon>` : esc(v);
const toW = (st) => { const v = parseFloat(st?.state); return isNaN(v) ? NaN : /^kW$/i.test(st.attributes.unit_of_measurement || '') ? v * 1000 : v; };

const CSS = `
:host{display:block}
ha-card{display:block;background:none;box-shadow:none;border:none;color:#e8eef8;font-family:inherit}
.wrap{display:grid;gap:14px}
.head{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:700}
.head i{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#2dd4bf,#0f766e);display:grid;place-items:center;font-style:normal}
.hero{border-radius:20px;padding:20px 22px;background:linear-gradient(120deg,#14b8a6 0%,#0f766e 45%,#0b3b45 100%);position:relative;overflow:hidden;color:#fff}
.hero::after{content:"";position:absolute;right:-40px;top:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.2),transparent 70%)}
.hero small{font-size:12px;opacity:.85}.big{font-size:44px;font-weight:800;line-height:1.1;letter-spacing:-.02em}
.big span{font-size:18px;font-weight:500;margin-left:4px;opacity:.9}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;position:relative;z-index:1}.chip{background:rgba(255,255,255,.14);border-radius:999px;padding:6px 12px;font-size:12px}
.board{background:#162033;border:1px solid #26344d;border-radius:20px;padding:18px;position:relative}
.grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;z-index:1}
svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:visible}
.cell{display:flex;justify-content:center;align-items:center}.span2{grid-column:2/4}.span2 .node{width:calc(50% - 6px)}
.node{--c:#2dd4bf;container-type:inline-size;width:100%;aspect-ratio:1;position:relative;border-radius:20px;background:#1c2940;border:1.5px solid color-mix(in srgb,var(--c) 45%,transparent);transition:border-color .2s,box-shadow .2s}
.node.on{border-color:var(--c);box-shadow:0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent),0 8px 28px -10px var(--c)}
.edit .node{cursor:pointer}.node.sel{outline:2px solid #fff;outline-offset:3px}
.img{position:absolute;left:50%;top:50%;width:30%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;font-size:14cqw;overflow:hidden;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c) 38%,transparent),color-mix(in srgb,var(--c) 10%,#1c2940) 75%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent)}
.img img{width:100%;height:100%;object-fit:cover}.img ha-icon{--mdc-icon-size:14cqw}
.node:not(.on) .img{filter:saturate(.45) brightness(.8)}
.s{position:absolute;font-size:8.5cqw;font-weight:700;color:#8a98b3;white-space:nowrap;line-height:1.15;text-align:center;cursor:pointer}
.node.on .s{color:#e8eef8}.s i{display:block;font-style:normal;font-size:.72em;font-weight:500;color:#8a98b3}
.s.e{color:#2dd4bf;opacity:.55}
.s.t{top:8%;left:50%;transform:translateX(-50%)}.s.b{bottom:8%;left:50%;transform:translateX(-50%)}
.s.l{left:3%;top:50%;transform:translateY(-50%);width:28%}.s.r{right:3%;top:50%;transform:translateY(-50%);width:28%}
.hub .s.t{font-size:10cqw}.hub .s.b{font-size:9cqw}
@media (prefers-reduced-motion:reduce){.node{transition:none}}
`;

class HausflussCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._edit = false; this._sel = null; }
  static getConfigElement() { return document.createElement('hausfluss-card-editor'); }
  static getStubConfig() { return { title: 'Modul 3 – Energiefluss', hub: { name: 'Haus' }, nodes: [{ position: 'top_1', name: 'PV Dach', image: '☀️' }] }; }
  getCardSize() { return 10; }
  setConfig(c) { if (!c) throw new Error('Konfiguration fehlt'); this._c = { nodes: [], ...c }; this._build(); }
  set hass(h) { this._h = h; this._upd(); }
  setEdit(on, sel) { this._edit = !!on; this._sel = sel || null; this._upd(); }
  disconnectedCallback() { this._ro && this._ro.disconnect(); }

  _build() {
    const c = this._c, hub = { ...c.hub, position: 'hub' };
    const ns = (c.nodes || []).filter((n) => POS[n.position] && n.enabled !== false);
    this._map = { hub }; ns.forEach((n) => (this._map[n.position] = n));
    const node = (n) => {
      const col = n.color || (POS[n.position] || [])[3] || '#2dd4bf';
      return `<div class="node${n.position === 'hub' ? ' hub on' : ''}" data-p="${n.position}" style="--c:${col}">${SIDES.map((s) => `<div class="s ${s[0]}" data-e="${esc(n[s])}"></div>`).join('')}<div class="img">${img(n.image || (n.position === 'hub' ? '🏠' : '⚡'))}</div></div>`;
    };
    const cells = ns.map((n) => { const p = POS[n.position], b = n.position === 'bottom'; return `<div class="cell${b ? ' span2' : ''}" style="grid-column:${b ? '2/4' : p[0]};grid-row:${p[1]}">${node(n)}</div>`; }).join('');
    const head = c.hide_header ? '' : `<div class="head"><i>⚡</i>${esc(c.title || 'Modul 3 – Energiefluss')}</div>`;
    const hero = c.show_hero === false ? '' : '<div class="hero"><small id="hl">Hausverbrauch jetzt</small><div class="big"><b id="hv">–</b><span>W</span></div><div class="chips" id="hc"></div></div>';
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap" id="w">${head}${hero}<div class="board"><svg></svg><div class="grid">${cells}<div class="cell span2" style="grid-row:3">${node(hub)}</div></div></div></div></ha-card>`;
    this.shadowRoot.querySelectorAll('.s').forEach((el) => (el.onclick = () => !this._edit && el.dataset.e && this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: el.dataset.e }, bubbles: true, composed: true }))));
    this.shadowRoot.querySelectorAll('.node[data-p]').forEach((el) => (el.onclick = () => this._edit && this.dispatchEvent(new CustomEvent('hausfluss-select', { detail: { position: el.dataset.p }, bubbles: true, composed: true }))));
    this._sig = null; this._ro && this._ro.disconnect();
    this._ro = new ResizeObserver(() => this._lines()); this._ro.observe(this.shadowRoot.querySelector('.board'));
    this._upd();
  }

  _fmt(id) {
    const st = this._h.states[id]; if (!st) return ['–', '', ''];
    const v = parseFloat(st.state), u = st.attributes.unit_of_measurement || '';
    const val = isNaN(v) ? st.state : v.toLocaleString(this._h.locale?.language || 'de', { maximumFractionDigits: Math.abs(v) >= 100 ? 0 : 2 });
    return [val, u, (st.attributes.friendly_name || id).split(' ').pop()];
  }

  _upd() {
    const h = this._h, r = this.shadowRoot; if (!h || !r.querySelector('.grid')) return;
    const lang = h.locale?.language || 'de';
    r.getElementById('w').classList.toggle('edit', this._edit);
    r.querySelectorAll('.s').forEach((el) => {
      const id = el.dataset.e; let html = '';
      if (id) { const [v, u, l] = this._fmt(id); html = /[lr]/.test(el.className.split(' ')[1]) ? `${v}<i>${esc(u)}</i>` : `${v} ${esc(u)}<i>${esc(l)}</i>`; el.title = h.states[id]?.attributes.friendly_name || id; }
      else if (this._edit) html = '+';
      el.classList.toggle('e', !id && this._edit);
      if (el._v !== html) { el._v = html; el.innerHTML = html; }
    });
    const hv = r.getElementById('hv');
    if (hv) {
      const hb = this._map.hub, pe = hb.power || hb.bottom, w = pe && h.states[pe] ? toW(h.states[pe]) : NaN;
      hv.textContent = isNaN(w) ? '–' : Math.abs(Math.round(w)).toLocaleString(lang);
      r.getElementById('hl').textContent = !isNaN(w) && w < 0 ? 'Einspeisung jetzt' : 'Hausverbrauch jetzt';
      const ch = []; let sol = 0, has = false;
      Object.values(this._map).forEach((n) => {
        if (n.position === 'hub' || (n.direction || POS[n.position][2]) !== 'in') return;
        const e = n.power || n.bottom, v = e && h.states[e] ? toW(h.states[e]) : NaN; if (!isNaN(v)) { sol += v; has = true; }
      });
      if (has) ch.push(`Solar ${Math.round(sol).toLocaleString(lang)} W`);
      if (hb.top && h.states[hb.top]) { const [v, u] = this._fmt(hb.top); ch.push(`Hausverbrauch heute ${v} ${u}`); }
      (hb.chips || []).forEach((id) => { if (h.states[id]) { const [v, u] = this._fmt(id); ch.push(`${h.states[id].attributes.friendly_name || id} ${v} ${u}`); } });
      const html = ch.map((t) => `<div class="chip">${esc(t)}</div>`).join(''), hc = r.getElementById('hc');
      if (hc._v !== html) { hc._v = html; hc.innerHTML = html; }
    }
    let sig = '';
    r.querySelectorAll('.node[data-p]').forEach((el) => {
      const n = this._map[el.dataset.p], pe = n.power || n.bottom, v = pe && h.states[pe] ? toW(h.states[pe]) : 0;
      const on = el.dataset.p === 'hub' || Math.abs(v) > 5; el.classList.toggle('on', on); sig += el.dataset.p + (on ? 1 : 0);
      el.classList.toggle('sel', this._edit && el.dataset.p === this._sel);
    });
    if (sig !== this._sig) { this._sig = sig; this._lines(); }
  }

  _lines() {
    const r = this.shadowRoot, b = r.querySelector('.board'), hub = r.querySelector('.hub'); if (!b || !hub) return;
    const g = b.getBoundingClientRect(), hb = hub.getBoundingClientRect(), hx = hb.left - g.left + hb.width / 2, hy = hb.top - g.top + hb.height / 2; let o = '';
    r.querySelectorAll('.node[data-p]:not(.hub)').forEach((el) => {
      const n = this._map[el.dataset.p], p = POS[n.position], q = el.getBoundingClientRect(), nx = q.left - g.left + q.width / 2, ny = q.top - g.top + q.height / 2;
      const vert = p[1] === 1 || p[1] === 5, mx = (hx + nx) / 2, my = (hy + ny) / 2, on = el.classList.contains('on'), col = n.color || p[3];
      const d = vert ? `M${hx},${hy} C${hx},${my} ${nx},${my} ${nx},${ny}` : `M${hx},${hy} C${mx},${hy} ${mx},${ny} ${nx},${ny}`;
      o += `<path id="p_${n.position}" d="${d}" fill="none" stroke="${col}" stroke-opacity="${on ? 0.9 : 0.25}" stroke-width="${on ? 3 : 2}" stroke-linecap="round"/>`;
      if (on) o += `<circle r="4.5" fill="${col}"><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="${(n.direction || p[2]) === 'in' ? '0;1' : '1;0'}" keyTimes="0;1" calcMode="linear"><mpath href="#p_${n.position}"/></animateMotion></circle>`;
    });
    r.querySelector('svg').innerHTML = o;
  }
}

const ECSS = `
:host{display:block;color:#e8eef8;font-family:inherit}
.panel{background:#162033;border:1px solid #26344d;border-radius:20px;padding:18px;display:grid;gap:14px}
h2{margin:0;font-size:15px}p{margin:0;font-size:12px;color:#8a98b3}
.tgl{display:flex;flex-wrap:wrap;gap:8px}
.tg{display:flex;align-items:center;gap:6px;background:#1c2940;border:1px solid #26344d;border-radius:999px;padding:5px 12px 5px 9px}
.tg.cur{border-color:#2dd4bf}.tg.off button{opacity:.5;text-decoration:line-through}
.tg button{background:none;border:0;color:#e8eef8;font:600 12px inherit;font-family:inherit;cursor:pointer;padding:0}
.tg input{accent-color:#2dd4bf;margin:0}
.f{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
label{display:grid;gap:5px;font-size:12px;color:#8a98b3;font-weight:600}
input:not([type=checkbox]),select{background:#1c2940;border:1px solid #26344d;color:#e8eef8;border-radius:10px;padding:9px 10px;font:500 13px inherit;font-family:inherit;min-width:0;width:100%;box-sizing:border-box}
input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid #2dd4bf;outline-offset:2px}
small{font-weight:500;font-size:11px;color:#6f7e9a;min-height:13px}
.sw{display:flex;gap:8px;align-items:center;min-height:36px}.sw button{width:26px;height:26px;border-radius:50%;border:2px solid transparent;cursor:pointer}.sw button.a{border-color:#fff}
.row{display:flex;align-items:center;gap:8px;font-size:12px;color:#8a98b3;font-weight:600}.row input{accent-color:#2dd4bf}
pre{margin:0;background:#0a111d;border:1px solid #26344d;border-radius:12px;padding:12px;font-size:12px;overflow-x:auto;color:#b8c5dd;max-height:240px}
`;

class HausflussEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._sel = 'top_1'; this._c = {}; }
  setConfig(c) { if (this._built && JSON.stringify(c) === JSON.stringify(this._c)) return; this._c = c || {}; this._draw(); }
  set hass(h) { this._h = h; this._dl(); }
  select(p) { this._sel = p; this._draw(); }
  _node(p) { return p === 'hub' ? this._c.hub || {} : (this._c.nodes || []).find((n) => n.position === p) || {}; }
  _clean(o) { const r = {}; for (const k in o) { const v = o[k]; if (v !== '' && v != null && !(Array.isArray(v) && !v.length)) r[k] = v; } return r; }
  _emit() { this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); }
  _top(patch) { this._c = this._clean({ ...this._c, ...patch }); this._emit(); }
  _set(p, patch) {
    const c = { ...this._c };
    if (p === 'hub') c.hub = this._clean({ ...(c.hub || {}), ...patch });
    else { const ns = [...(c.nodes || [])], i = ns.findIndex((n) => n.position === p), n = this._clean({ ...(i < 0 ? { position: p } : ns[i]), ...patch }); if (i < 0) ns.push(n); else ns[i] = n; c.nodes = ns; }
    this._c = c; this._emit();
  }
  _hint(id) { const st = this._h?.states?.[id]; return st ? esc(`${st.attributes.friendly_name || id} · ${st.state} ${st.attributes.unit_of_measurement || ''}`) : ''; }
  _picked(p) { this.dispatchEvent(new CustomEvent('hausfluss-selected', { detail: { position: p }, bubbles: true, composed: true })); }
  _dl() {
    const d = this.shadowRoot.getElementById('hf'); if (!d || !this._h || this._dlDone) return; this._dlDone = true;
    d.innerHTML = Object.keys(this._h.states).sort().map((k) => `<option value="${esc(k)}">${esc(this._h.states[k].attributes.friendly_name || '')}</option>`).join('');
  }
  _chips() {
    const c = this._c, p = this._sel;
    this.shadowRoot.getElementById('tgl').innerHTML = Object.keys(POS).map((k) => {
      const x = (c.nodes || []).find((q) => q.position === k), on = !!x && x.enabled !== false;
      return `<span class="tg${k === p ? ' cur' : ''}${on ? '' : ' off'}"><input type="checkbox" data-k="${k}"${on ? ' checked' : ''} aria-label="${POSNAME[k]} anzeigen"><button data-s="${k}">${esc((x && x.name) || POSNAME[k])}</button></span>`;
    }).join('') + `<span class="tg${p === 'hub' ? ' cur' : ''}"><button data-s="hub">${esc((c.hub && c.hub.name) || 'Haus')} (Mitte)</button></span>`;
    this.shadowRoot.querySelectorAll('[data-k]').forEach((x) => (x.onchange = () => { const k = x.dataset.k; this._set(k, { enabled: x.checked }); this._sel = k; this._draw(); this._picked(k); }));
    this.shadowRoot.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { this._sel = b.dataset.s; this._draw(); this._picked(this._sel); }));
  }
  _yaml() {
    const p = this._sel, n = this._node(p), L = [p === 'hub' ? 'hub:' : `- position: ${p}`];
    Object.entries(n).filter(([k]) => k !== 'position').forEach(([k, v]) => L.push(`  ${k}: ${Array.isArray(v) ? '[' + v.join(', ') + ']' : v}`));
    this.shadowRoot.getElementById('y').textContent = L.join('\n');
  }
  _draw() {
    this._built = true;
    const c = this._c, p = this._sel, hub = p === 'hub', n = this._node(p), col = n.color || (POS[p] || [])[3] || '#2dd4bf';
    const ent = (f, label, val) => `<label>${label}<input list="hf" data-f="${f}" value="${esc(val)}" placeholder="sensor.…" autocomplete="off"><small data-h="${f}">${this._hint(val)}</small></label>`;
    const chips = (n.chips || []);
    this.shadowRoot.innerHTML = `<style>${ECSS}</style><div class="panel"><div><h2>${esc(n.name || (hub ? 'Haus' : POSNAME[p]))}</h2><p>Haken setzen zeigt die Kachel an, Haken entfernen blendet sie aus. Namen antippen zum Bearbeiten.</p></div>
<div class="tgl" id="tgl"></div>
<div class="f"><label>Titel der Karte<input id="ti" value="${esc(c.title || '')}" placeholder="Modul 3 – Energiefluss"></label><label class="row"><input type="checkbox" id="sh"${c.show_hero === false ? '' : ' checked'}>Kopfbereich anzeigen</label></div>
<div class="f"><label>Name<input data-f="name" value="${esc(n.name || '')}"></label><label>Bild (Emoji, Pfad oder mdi:icon)<input data-f="image" value="${esc(n.image || '')}" placeholder="/local/hausfluss/solar.png"></label>
${SIDES.map((s) => ent(s, FL[s], n[s])).join('')}
${hub ? [0, 1, 2].map((i) => ent('chip' + i, 'Chip ' + (i + 1) + ' (Kopfbereich)', chips[i] || '')).join('') : ent('power', 'Fluss-Leistung (optional)', n.power) + `<label>Richtung<select data-f="direction"><option value="in"${(n.direction || POS[p][2]) === 'in' ? ' selected' : ''}>liefert (Quelle)</option><option value="out"${(n.direction || POS[p][2]) === 'out' ? ' selected' : ''}>verbraucht</option></select></label><label>Akzentfarbe<div class="sw">${SW.map((x) => `<button data-c="${x}" style="background:${x}" class="${x === col ? 'a' : ''}" aria-label="Farbe ${x}"></button>`).join('')}</div></label>`}</div>
<pre id="y"></pre><datalist id="hf"></datalist></div>`;
    this._dlDone = false; this._dl(); this._chips(); this._yaml();
    const r = this.shadowRoot;
    r.getElementById('ti').onchange = (e) => this._top({ title: e.target.value.trim() });
    r.getElementById('sh').onchange = (e) => this._top({ show_hero: e.target.checked ? undefined : false });
    r.querySelectorAll('[data-f]').forEach((i) => (i.onchange = () => {
      const f = i.dataset.f, v = i.value.trim();
      if (/^chip\d$/.test(f)) { const cs = [0, 1, 2].map((k) => r.querySelector(`[data-f="chip${k}"]`).value.trim()).filter(Boolean); this._set('hub', { chips: cs }); }
      else this._set(p, { [f]: v });
      const h = r.querySelector(`[data-h="${f}"]`); if (h) h.innerHTML = this._hint(v);
      this._chips(); this._yaml();
    }));
    r.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { this._set(p, { color: b.dataset.c }); this._draw(); }));
  }
}

const DEFAULT_CFG = { title: 'Modul 3 – Energiefluss', hub: { name: 'Haus' }, nodes: [] };
const PCSS = `
:host{display:block;min-height:100%;background:#0e1626;color:#e8eef8;font-family:var(--paper-font-body1_-_font-family,system-ui,sans-serif)}
.bar{display:flex;align-items:center;gap:12px;padding:14px;max-width:780px;margin:0 auto;box-sizing:border-box}
ha-menu-button{color:#e8eef8}
.logo{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#2dd4bf,#0f766e);display:grid;place-items:center;font-size:20px;flex:none}
h1{margin:0;font-size:18px;font-weight:700}.tt p{margin:0;font-size:12px;color:#8a98b3}
.msg{margin-left:auto;font-size:12px;color:#2dd4bf}
button.pill{margin-left:auto;background:#162033;border:1px solid #26344d;color:#e8eef8;border-radius:999px;padding:8px 14px;font:600 12px inherit;font-family:inherit;cursor:pointer}
.msg+button.pill{margin-left:8px}button.pill:hover{border-color:#2dd4bf}button.pill:focus-visible{outline:2px solid #2dd4bf;outline-offset:2px}
.main{display:grid;gap:14px;padding:0 14px 28px;max-width:780px;margin:0 auto;box-sizing:border-box}
.hint{padding:12px 16px;border-radius:14px;background:#162033;border:1px solid #26344d;color:#8a98b3;font-size:13px}`;

class HausflussPanel extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  set hass(h) {
    this._h = h;
    if (this._ed) this._ed.hass = h;
    if (this._card) this._card.hass = h;
    if (this._menu) this._menu.hass = h;
    if (!this._started) { this._started = true; this._start(); }
  }
  set narrow(v) { this._narrow = v; if (this._menu) this._menu.narrow = v; }
  set panel(_) {}

  async _start() {
    try { this._cfg = (await this._h.callWS({ type: 'hausfluss/get_config' })).config || DEFAULT_CFG; }
    catch (e) { this._cfg = DEFAULT_CFG; }
    this._draw();
  }

  _draw() {
    const admin = !!this._h.user?.is_admin, r = this.shadowRoot;
    r.innerHTML = `<style>${PCSS}</style><div class="bar"><ha-menu-button></ha-menu-button><div class="logo">⚡</div><div class="tt"><h1></h1><p>Hausfluss · Version ${VERSION}</p></div><span class="msg" id="m"></span>${admin ? '<button class="pill" id="b">Anpassen</button>' : ''}</div><div class="main"><div class="hint" id="hint" hidden>Noch keine Kachel angelegt. Tippe oben auf „Anpassen“, setze bei einer Kachel den Haken und wähle ihre Entitäten.</div><div id="cw"></div><div id="ed" hidden></div></div>`;
    this._menu = r.querySelector('ha-menu-button'); this._menu.hass = this._h; this._menu.narrow = this._narrow;
    this._card = document.createElement('hausfluss-card'); r.getElementById('cw').appendChild(this._card);
    this._apply();
    if (!admin) return;
    const ed = (this._ed = document.createElement('hausfluss-card-editor')), box = r.getElementById('ed'), b = r.getElementById('b');
    ed.hass = this._h; ed.setConfig(this._cfg); box.appendChild(ed);
    ed.addEventListener('config-changed', (e) => this._save(e.detail.config));
    ed.addEventListener('hausfluss-selected', (e) => this._card.setEdit(!box.hidden, e.detail.position));
    this._card.addEventListener('hausfluss-select', (e) => { ed.select(e.detail.position); this._card.setEdit(true, e.detail.position); });
    b.onclick = () => { box.hidden = !box.hidden; b.textContent = box.hidden ? 'Anpassen' : 'Fertig'; this._card.setEdit(!box.hidden, ed._sel); };
  }

  _apply() {
    const r = this.shadowRoot, c = this._cfg;
    r.querySelector('h1').textContent = c.title || DEFAULT_CFG.title;
    this._card.setConfig({ ...c, hide_header: true }); this._card.hass = this._h;
    r.getElementById('hint').hidden = !(this._h.user?.is_admin && !(c.nodes || []).some((n) => n.enabled !== false));
  }

  _save(cfg) {
    this._cfg = cfg; this._apply(); clearTimeout(this._t);
    this._t = setTimeout(async () => {
      const m = this.shadowRoot.getElementById('m');
      try { await this._h.callWS({ type: 'hausfluss/set_config', config: cfg }); m.textContent = 'Gespeichert'; }
      catch (e) { m.textContent = 'Speichern fehlgeschlagen'; }
      setTimeout(() => (m.textContent = ''), 2500);
    }, 600);
  }
}

[['hausfluss-card', HausflussCard], ['hausfluss-card-editor', HausflussEditor], ['hausfluss-panel', HausflussPanel]].forEach(([n, c]) => { if (!customElements.get(n)) customElements.define(n, c); });
window.customCards = window.customCards || [];
if (!window.customCards.some((x) => x.type === 'hausfluss-card')) window.customCards.push({ type: 'hausfluss-card', name: 'Hausfluss – Modul 3 Energiefluss', description: 'Energiefluss mit wählbaren Kacheln und je vier Entitäten pro Kachel', preview: true });
console.info(`%c HAUSFLUSS %c v${VERSION} `, 'background:#2dd4bf;color:#0e1626;font-weight:700', 'background:#162033;color:#e8eef8');
