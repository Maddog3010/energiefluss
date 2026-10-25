/* Hausfluss – Modul 3 Energiefluss · Version 0.0.2 */
const VERSION = '0.0.2';
const POS = {
  top_1: [2, 1, 'in', '#facc15'], top_2: [3, 1, 'in', '#fbbf24'],
  left_1: [1, 2, 'out', '#f97316'], left_2: [1, 3, 'out', '#38bdf8'], left_3: [1, 4, 'out', '#a78bfa'],
  right_1: [4, 2, 'out', '#38bdf8'], right_2: [4, 3, 'out', '#2dd4bf'], right_3: [4, 4, 'out', '#f472b6'],
  bottom: [2, 5, 'out', '#4ade80'],
};
const POSNAME = { top_1: 'Oben 1', top_2: 'Oben 2', left_1: 'Links 1', left_2: 'Links 2', left_3: 'Links 3', right_1: 'Rechts 1', right_2: 'Rechts 2', right_3: 'Rechts 3', bottom: 'Unten', hub: 'Haus (Mitte)' };
const SIDES = ['top', 'bottom', 'left', 'right'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const img = (v) => /^(\/|https?:)/.test(v) ? `<img src="${esc(v)}" alt="">` : /^mdi:/.test(v) ? `<ha-icon icon="${esc(v)}"></ha-icon>` : esc(v);

const CSS = `
:host{display:block}
ha-card{display:block;background:#162033;color:#e8eef8;border:1px solid #26344d;border-radius:20px;padding:16px;font-family:inherit}
.head{display:flex;align-items:center;gap:10px;margin:0 2px 14px;font-size:17px;font-weight:700}
.head i{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#2dd4bf,#0f766e);display:grid;place-items:center;font-style:normal}
.board{position:relative}
.grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;z-index:1}
svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:visible}
.cell{display:flex;justify-content:center;align-items:center}.span2{grid-column:2/4}.span2 .node{width:calc(50% - 6px)}
.node{--c:#2dd4bf;container-type:inline-size;width:100%;aspect-ratio:1;position:relative;border-radius:20px;background:#1c2940;border:1.5px solid color-mix(in srgb,var(--c) 45%,transparent);transition:border-color .2s,box-shadow .2s}
.node.on{border-color:var(--c);box-shadow:0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent),0 8px 28px -10px var(--c)}
.img{position:absolute;left:50%;top:50%;width:30%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;font-size:14cqw;overflow:hidden;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c) 38%,transparent),color-mix(in srgb,var(--c) 10%,#1c2940) 75%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent)}
.img img{width:100%;height:100%;object-fit:cover}.img ha-icon{--mdc-icon-size:14cqw}
.node:not(.on) .img{filter:saturate(.45) brightness(.8)}
.s{position:absolute;font-size:8.5cqw;font-weight:700;color:#8a98b3;white-space:nowrap;line-height:1.15;text-align:center;cursor:pointer}
.node.on .s{color:#e8eef8}.s i{display:block;font-style:normal;font-size:.72em;font-weight:500;color:#8a98b3}
.s.t{top:8%;left:50%;transform:translateX(-50%)}.s.b{bottom:8%;left:50%;transform:translateX(-50%)}
.s.l{left:3%;top:50%;transform:translateY(-50%);width:28%}.s.r{right:3%;top:50%;transform:translateY(-50%);width:28%}
.hub .s.t{font-size:10cqw}.hub .s.b{font-size:9cqw}
`;

class HausflussCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static getConfigElement() { return document.createElement('hausfluss-card-editor'); }
  static getStubConfig() { return { title: 'Modul 3 – Energiefluss', hub: { name: 'Haus' }, nodes: [{ position: 'top_1', name: 'PV Dach', image: '☀️' }] }; }
  getCardSize() { return 9; }
  setConfig(c) { if (!c) throw new Error('Konfiguration fehlt'); this._c = { nodes: [], ...c }; this._build(); }
  set hass(h) { this._h = h; this._upd(); }
  connectedCallback() { this._ro = new ResizeObserver(() => this._lines()); const b = this.shadowRoot.querySelector('.board'); if (b) this._ro.observe(b); }
  disconnectedCallback() { this._ro && this._ro.disconnect(); }

  _build() {
    const c = this._c, hub = { ...c.hub, position: 'hub' };
    const ns = (c.nodes || []).filter((n) => POS[n.position] && n.enabled !== false);
    this._map = { hub }; ns.forEach((n) => (this._map[n.position] = n));
    const node = (n) => {
      const col = n.color || (POS[n.position] || [])[3] || '#2dd4bf';
      return `<div class="node${n.position === 'hub' ? ' hub on' : ''}" data-p="${n.position}" style="--c:${col}">${SIDES.map((s) => `<div class="s ${s[0]}" data-e="${esc(n[s])}" data-s="${s}"></div>`).join('')}<div class="img">${img(n.image || (n.position === 'hub' ? '🏠' : '⚡'))}</div></div>`;
    };
    const cells = ns.map((n) => { const p = POS[n.position]; const b = n.position === 'bottom'; return `<div class="cell${b ? ' span2' : ''}" style="grid-column:${b ? '2/4' : p[0]};grid-row:${p[1]}">${node(n)}</div>`; }).join('');
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card>${c.hide_header ? '' : `<div class="head"><i>⚡</i>${esc(c.title || 'Modul 3 – Energiefluss')}</div>`}<div class="board"><svg></svg><div class="grid">${cells}<div class="cell span2" style="grid-row:3">${node(hub)}</div></div></div></ha-card>`;
    this.shadowRoot.querySelectorAll('.s').forEach((el) => (el.onclick = () => el.dataset.e && this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: el.dataset.e }, bubbles: true, composed: true }))));
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
    r.querySelectorAll('.s').forEach((el) => {
      const id = el.dataset.e; let html = '';
      if (id) { const [v, u, l] = this._fmt(id); html = /[lr]/.test(el.className.split(' ')[1]) ? `${v}<i>${esc(u)}</i>` : `${v} ${esc(u)}<i>${esc(l)}</i>`; el.title = (h.states[id]?.attributes.friendly_name) || id; }
      if (el._v !== html) { el._v = html; el.innerHTML = html; }
    });
    let sig = '';
    r.querySelectorAll('.node[data-p]').forEach((el) => {
      const n = this._map[el.dataset.p], pe = n.power || n.bottom, v = pe && h.states[pe] ? parseFloat(h.states[pe].state) : 0;
      const on = el.dataset.p === 'hub' || Math.abs(v) > 5; el.classList.toggle('on', on); sig += el.dataset.p + (on ? 1 : 0);
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

const LABEL = { title: 'Titel', enabled: 'Kachel anzeigen', name: 'Name', image: 'Bild (Pfad, Emoji oder mdi:icon)', color: 'Akzentfarbe (z. B. #2dd4bf)', direction: 'Richtung', top: 'Oben', bottom: 'Unten', left: 'Links', right: 'Rechts', power: 'Fluss-Leistung (optional, sonst „Unten“)' };
const ENT = (name) => ({ name, selector: { entity: {} } });

class HausflussEditor extends HTMLElement {
  setConfig(c) { this._c = c; this._forms ? this._sync() : this._draw(); }
  set hass(h) { this._h = h; (this._forms ? Object.values(this._forms) : []).forEach((f) => (f.hass = h)); }
  _draw() {
    this._forms = {};
    const mk = (key, schema, header) => {
      const f = document.createElement('ha-form'); f.schema = schema; f.computeLabel = (s) => LABEL[s.name] || s.name; f.hass = this._h;
      f.addEventListener('value-changed', (e) => this._chg(key, e.detail.value)); this._forms[key] = f;
      if (!header) return f;
      const p = document.createElement('ha-expansion-panel'); p.header = header; p.outlined = true; p.appendChild(f); return p;
    };
    const nodeSchema = [{ name: 'enabled', selector: { boolean: {} } }, { name: 'name', selector: { text: {} } }, { name: 'image', selector: { text: {} } }, { name: 'color', selector: { text: {} } },
      { name: 'direction', selector: { select: { options: [{ value: 'in', label: 'liefert (Quelle)' }, { value: 'out', label: 'verbraucht' }] } } }, ENT('top'), ENT('bottom'), ENT('left'), ENT('right'), ENT('power')];
    const hubSchema = [{ name: 'name', selector: { text: {} } }, { name: 'image', selector: { text: {} } }, ENT('top'), ENT('bottom'), ENT('left'), ENT('right')];
    this.innerHTML = ''; const box = document.createElement('div'); box.style.cssText = 'display:grid;gap:10px';
    box.appendChild(mk('title', [{ name: 'title', selector: { text: {} } }]));
    box.appendChild(mk('hub', hubSchema, POSNAME.hub));
    Object.keys(POS).forEach((k) => box.appendChild(mk(k, nodeSchema, POSNAME[k])));
    this.appendChild(box); this._sync();
  }
  _sync() {
    const c = this._c, f = this._forms;
    f.title.data = { title: c.title || '' }; f.hub.data = c.hub || {};
    Object.keys(POS).forEach((k) => { const n = (c.nodes || []).find((x) => x.position === k); f[k].data = { enabled: false, direction: POS[k][2], ...(n || {}) }; });
  }
  _chg(key, val) {
    let c = { ...this._c };
    if (key === 'title') c.title = val.title; else if (key === 'hub') c.hub = val;
    else {
      const nodes = [...(c.nodes || [])], i = nodes.findIndex((n) => n.position === key), n = { ...val, position: key };
      if (i < 0) nodes.push(n); else nodes[i] = n; c.nodes = nodes;
    }
    this._c = c; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
  }
}

const DEFAULT_CFG = { title: 'Modul 3 – Energiefluss', hub: { name: 'Haus' }, nodes: [] };
const PCSS = `
:host{display:block;min-height:100%;background:var(--primary-background-color)}
.bar{display:flex;align-items:center;gap:8px;height:56px;padding:0 12px;background:var(--app-header-background-color,#03a9f4);color:var(--app-header-text-color,#fff);position:sticky;top:0;z-index:2}
.t{flex:1;font-size:20px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
button{background:transparent;border:1px solid currentColor;color:inherit;border-radius:999px;padding:7px 16px;font:500 14px inherit;font-family:inherit;cursor:pointer}
button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.main{display:flex;gap:16px;padding:16px;align-items:flex-start;max-width:1400px;margin:0 auto;box-sizing:border-box}
.cw{flex:1;min-width:0;max-width:820px;margin:0 auto}.ed{width:380px;flex:none}
.hint{margin:0 0 12px;padding:12px 16px;border-radius:12px;background:var(--card-background-color);color:var(--secondary-text-color);font-size:14px}
.msg{font-size:13px;opacity:.9}
@media(max-width:900px){.main{flex-direction:column}.ed{width:100%}}`;

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
    try { // Editor-Bausteine von Home Assistant nachladen (ha-form, Entitätsauswahl)
      const ch = await window.loadCardHelpers?.();
      const c = await ch?.createCardElement({ type: 'entities', entities: [] });
      await c?.constructor?.getConfigElement?.();
    } catch (e) { /* optional */ }
    try { this._cfg = (await this._h.callWS({ type: 'hausfluss/get_config' })).config || DEFAULT_CFG; }
    catch (e) { this._cfg = DEFAULT_CFG; }
    this._draw();
  }

  _draw() {
    const admin = !!this._h.user?.is_admin, r = this.shadowRoot;
    r.innerHTML = `<style>${PCSS}</style><div class="bar"><ha-menu-button></ha-menu-button><div class="t"></div><span class="msg" id="m"></span>${admin ? '<button id="b">Anpassen</button>' : ''}</div><div class="main"><div class="cw"><div class="hint" id="hint" hidden>Noch keine Kachel angelegt. Tippe oben auf „Anpassen“, schalte Kacheln ein und wähle ihre Entitäten.</div></div><div class="ed" id="ed" hidden></div></div>`;
    this._menu = r.querySelector('ha-menu-button'); this._menu.hass = this._h; this._menu.narrow = this._narrow;
    this._card = document.createElement('hausfluss-card'); r.querySelector('.cw').appendChild(this._card);
    this._apply();
    if (admin) {
      const ed = (this._ed = document.createElement('hausfluss-card-editor'));
      ed.hass = this._h; ed.setConfig(this._cfg);
      ed.addEventListener('config-changed', (e) => this._save(e.detail.config));
      r.getElementById('ed').appendChild(ed);
      r.getElementById('b').onclick = () => { const e = r.getElementById('ed'); e.hidden = !e.hidden; r.getElementById('b').textContent = e.hidden ? 'Anpassen' : 'Fertig'; };
    }
  }

  _apply() {
    const r = this.shadowRoot, c = this._cfg;
    r.querySelector('.t').textContent = c.title || DEFAULT_CFG.title;
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
window.customCards.push({ type: 'hausfluss-card', name: 'Hausfluss – Modul 3 Energiefluss', description: 'Energiefluss mit wählbaren Kacheln und je vier Entitäten pro Kachel', preview: true });
console.info(`%c HAUSFLUSS %c v${VERSION} `, 'background:#2dd4bf;color:#0e1626;font-weight:700', 'background:#162033;color:#e8eef8');
