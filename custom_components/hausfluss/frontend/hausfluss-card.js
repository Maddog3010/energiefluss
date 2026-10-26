/* Hausfluss – Modul 3 Energiefluss · Version 0.0.5 */
const VERSION = '0.0.5';
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
const IMGS = [
  { id: 'sonne', n: 'Sonne', k: 'solar pv sonne photovoltaik erzeugung', s: '<circle cx="32" cy="32" r="11" fill="#fbbf24"/><path d="M32 6v7M32 51v7M6 32h7M51 32h7M13.6 13.6l5 5M45.4 45.4l5 5M13.6 50.4l5-5M45.4 18.6l5-5" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>' },
  { id: 'solar', n: 'Solarmodul', k: 'solar pv modul dach photovoltaik erzeugung', s: '<path d="M9 40l8-24h38l-8 24z" fill="#2563eb"/><path d="M13.5 28h39M25 16l-5 24M37 16l-3 24M49 16l-2 24" stroke="#bfdbfe" stroke-width="1.8"/><path d="M32 40v11M22 53h20" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>' },
  { id: 'haus', n: 'Haus', k: 'haus gebäude zuhause verbrauch', s: '<path d="M8 31L32 11l24 20" fill="none" stroke="#f1f5f9" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><rect x="14" y="31" width="36" height="24" rx="4" fill="#7dd3fc"/><rect x="27" y="39" width="10" height="16" rx="2" fill="#0f172a"/>' },
  { id: 'akku', n: 'Akku', k: 'batterie speicher akku ladestand', s: '<rect x="7" y="19" width="45" height="27" rx="6" fill="none" stroke="#4ade80" stroke-width="4"/><rect x="53" y="28" width="5" height="10" rx="2" fill="#4ade80"/><rect x="13" y="25" width="8" height="15" rx="2" fill="#4ade80"/><rect x="24" y="25" width="8" height="15" rx="2" fill="#4ade80"/><rect x="35" y="25" width="8" height="15" rx="2" fill="#4ade80" opacity=".35"/>' },
  { id: 'auto', n: 'Auto', k: 'auto elektroauto fahrzeug laden', s: '<path d="M7 40l5-13c1-3 3-4 6-4h28c3 0 5 1 6 4l5 13v10H7z" fill="#f472b6"/><path d="M16 28h32l3 9H13z" fill="#fde7f3"/><circle cx="19" cy="50" r="6" fill="#0f172a"/><circle cx="45" cy="50" r="6" fill="#0f172a"/>' },
  { id: 'wallbox', n: 'Wallbox', k: 'wallbox ladestation auto laden', s: '<rect x="17" y="7" width="30" height="46" rx="9" fill="#e2e8f0"/><path d="M34 15l-7 11h6l-3 9 9-13h-6z" fill="#2dd4bf"/><path d="M32 53v6" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>' },
  { id: 'steckdose', n: 'Steckdose', k: 'steckdose stecker strom verbraucher', s: '<rect x="9" y="9" width="46" height="46" rx="13" fill="#f1f5f9"/><circle cx="32" cy="32" r="17" fill="#e2e8f0"/><circle cx="25.5" cy="32" r="3" fill="#0f172a"/><circle cx="38.5" cy="32" r="3" fill="#0f172a"/>' },
  { id: 'waschmaschine', n: 'Waschmaschine', k: 'waschmaschine wäsche waschen', s: '<rect x="12" y="7" width="40" height="50" rx="6" fill="#e2e8f0"/><circle cx="32" cy="36" r="14" fill="#38bdf8"/><circle cx="32" cy="36" r="8.5" fill="#bae6fd"/><circle cx="19" cy="15" r="2.5" fill="#64748b"/><rect x="26" y="13" width="20" height="4" rx="2" fill="#94a3b8"/>' },
  { id: 'trockner', n: 'Trockner', k: 'trockner wäsche trocknen', s: '<rect x="12" y="7" width="40" height="50" rx="6" fill="#e2e8f0"/><circle cx="32" cy="36" r="14" fill="#a78bfa"/><path d="M24 36a8 8 0 0 1 16 0" stroke="#ede9fe" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="19" cy="15" r="2.5" fill="#64748b"/><rect x="26" y="13" width="20" height="4" rx="2" fill="#94a3b8"/>' },
  { id: 'kuehlschrank', n: 'Kühlschrank', k: 'kühlschrank gefrierschrank kühlen', s: '<rect x="16" y="6" width="32" height="53" rx="6" fill="#e0f2fe"/><path d="M16 27h32" stroke="#7dd3fc" stroke-width="3"/><rect x="22" y="12" width="3.5" height="10" rx="1.7" fill="#64748b"/><rect x="22" y="32" width="3.5" height="15" rx="1.7" fill="#64748b"/>' },
  { id: 'wasser', n: 'Wasser', k: 'wasser tropfen wasserzähler durchfluss', s: '<path d="M32 7C22 21 16 30 16 38a16 16 0 0 0 32 0c0-8-6-17-16-31z" fill="#38bdf8"/><path d="M24 40a8 8 0 0 0 8 8" stroke="#e0f2fe" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { id: 'blitz', n: 'Blitz', k: 'blitz strom leistung energie', s: '<path d="M37 5L14 36h14l-4 23 26-33H36z" fill="#facc15"/>' },
  { id: 'heizung', n: 'Heizkörper', k: 'heizung heizkörper wärme wärmepumpe', s: '<rect x="8" y="14" width="48" height="34" rx="7" fill="#f1f5f9"/><g fill="#14b8a6"><rect x="15" y="21" width="5" height="20" rx="2.5"/><rect x="24" y="21" width="5" height="20" rx="2.5"/><rect x="33" y="21" width="5" height="20" rx="2.5"/><rect x="42" y="21" width="5" height="20" rx="2.5"/></g><circle cx="50" cy="53" r="4.5" fill="#f59e0b"/>' },
  { id: 'netz', n: 'Stromnetz', k: 'netz strommast netzbezug einspeisung zähler', s: '<path d="M32 6L20 58M32 6l12 52M25 24h14M22 38h20M12 17h40" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round" fill="none"/>' },
  { id: 'lampe', n: 'Lampe', k: 'lampe licht beleuchtung glühbirne', s: '<path d="M32 7a17 17 0 0 0-9 31v7h18v-7a17 17 0 0 0-9-31z" fill="#fde047"/><rect x="25" y="48" width="14" height="5.5" rx="2.7" fill="#94a3b8"/>' },
];
const EMO = [
  ['☀️', 'Sonne', 'solar'], ['🌤️', 'Wolkig', 'sonne wolke wetter'], ['🔌', 'Stecker', 'steckdose strom'], ['🫧', 'Seifenblasen', 'waschmaschine wäsche'], ['🌀', 'Wirbel', 'trockner'],
  ['🧊', 'Eiswürfel', 'kühlschrank kühlen'], ['🚰', 'Wasserhahn', 'wasser'], ['🚗', 'Auto', 'fahrzeug'], ['🔋', 'Batterie', 'akku speicher'], ['🏠', 'Haus', 'gebäude'],
  ['⚡', 'Blitz', 'strom energie'], ['💡', 'Glühbirne', 'lampe licht'], ['🔥', 'Feuer', 'heizung gas flamme'], ['❄️', 'Schneeflocke', 'kälte klima kühlen'], ['🌡️', 'Thermometer', 'temperatur'],
  ['💧', 'Tropfen', 'wasser'], ['🍳', 'Pfanne', 'herd kochen'], ['🍽️', 'Teller', 'spülmaschine geschirr'], ['🧺', 'Wäschekorb', 'wäsche'], ['📺', 'Fernseher', 'tv'],
  ['💻', 'Laptop', 'computer büro'], ['🖥️', 'Monitor', 'computer pc'], ['🎮', 'Spielkonsole', 'gaming'], ['🛁', 'Badewanne', 'bad'], ['🚿', 'Dusche', 'bad warmwasser'],
  ['🪟', 'Fenster', ''], ['🚪', 'Tür', ''], ['🛏️', 'Bett', 'schlafzimmer'], ['🛋️', 'Sofa', 'wohnzimmer'], ['🌱', 'Pflanze', 'garten bewässerung'],
  ['🏊', 'Schwimmbad', 'pool pumpe'], ['🚲', 'Fahrrad', 'ebike'], ['🌬️', 'Wind', 'lüftung ventilator'], ['🔆', 'Helligkeit', 'licht'], ['🏭', 'Fabrik', 'industrie werkstatt'],
];
const HERO_SVG = '<svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg"><path d="M18 66L79 20l61 46" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><rect x="28" y="60" width="102" height="70" rx="14" fill="#fff"/><rect x="38" y="70" width="82" height="50" rx="8" fill="#0e3b45"/><rect x="44" y="76" width="32" height="38" rx="3" fill="#bfe8e4"/><path d="M60 76v38M44 95h32" stroke="#0e3b45" stroke-width="2.5"/><path d="M82 78l32-5v46l-32-5z" fill="#d9f3ef"/><rect x="40" y="138" width="78" height="30" rx="12" fill="#fff"/><g fill="#0f766e"><rect x="49" y="146" width="7" height="14" rx="3.5"/><rect x="63" y="146" width="7" height="14" rx="3.5"/><rect x="77" y="146" width="7" height="14" rx="3.5"/><rect x="91" y="146" width="7" height="14" rx="3.5"/><rect x="105" y="146" width="7" height="14" rx="3.5"/></g><path d="M172 14l-21 33h14l-7 27 28-38h-15z" fill="#f59e0b"/><path d="M172 14l-8 24" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/><path d="M150 94l36 31" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/><circle cx="174" cy="158" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/></svg>';
const svgTag = (id) => { const i = IMGS.find((x) => x.id === id); return i ? `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${i.s}</svg>` : ''; };
const img = (v) => /^svg:/.test(v) ? svgTag(v.slice(4)) : /^(\/|https?:)/.test(v) ? `<img src="${esc(v)}" alt="">` : /^mdi:/.test(v) ? `<ha-icon icon="${esc(v)}"></ha-icon>` : esc(v);
const flowOf = (n) => n.flow || (n.direction ? (n.direction === 'in' ? 'supply' : 'consume') : POS[n.position] && POS[n.position][2] === 'in' ? 'supply' : 'consume');
const toW = (st) => { const v = parseFloat(st?.state); return isNaN(v) ? NaN : /^kW$/i.test(st.attributes.unit_of_measurement || '') ? v * 1000 : v; };

const CSS = `
:host{display:block}
ha-card{display:block;background:none;box-shadow:none;border:none;color:#e8eef8;font-family:inherit}
.wrap{display:grid;gap:14px}
.head{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:700}
.head i{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#2dd4bf,#0f766e);display:grid;place-items:center;font-style:normal}
.hero{container-type:inline-size;min-height:150px;border-radius:20px;padding:20px 22px;background:linear-gradient(120deg,#14b8a6 0%,#0f766e 45%,#0b3b45 100%);position:relative;overflow:hidden;color:#fff}
.hero::after{content:"";position:absolute;right:-40px;top:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.2),transparent 70%)}
.hero small{font-size:12px;opacity:.85}.big{font-size:44px;font-weight:800;line-height:1.1;letter-spacing:-.02em}
.big span{font-size:18px;font-weight:500;margin-left:4px;opacity:.9}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;position:relative;z-index:1;max-width:calc(100% - 230px)}.chip{background:rgba(255,255,255,.14);border-radius:999px;padding:6px 12px;font-size:12px}
.art{position:absolute;right:26px;top:50%;transform:translateY(-50%);height:150px;aspect-ratio:200/190;pointer-events:none}.art svg,.art img{width:100%;height:100%;object-fit:contain}
@container (max-width:560px){.art{height:84px;right:14px;top:16px;transform:none}.chips{max-width:none}}
.board{background:#162033;border:1px solid #26344d;border-radius:20px;padding:18px;position:relative}
.grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;z-index:1}
svg.lines{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:visible}
.cell{display:flex;justify-content:center;align-items:center}.span2{grid-column:2/4}.span2 .node{width:calc(50% - 6px)}
.node{--c:#2dd4bf;container-type:inline-size;width:100%;aspect-ratio:1;position:relative;border-radius:20px;background:#1c2940;border:1.5px solid color-mix(in srgb,var(--c) 45%,transparent);transition:border-color .2s,box-shadow .2s}
.node.on{border-color:var(--c);box-shadow:0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent),0 8px 28px -10px var(--c)}
.edit .node{cursor:pointer}.node.sel{outline:2px solid #fff;outline-offset:3px}
.img{position:absolute;left:50%;top:50%;width:30%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;font-size:14cqw;overflow:hidden;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c) 38%,transparent),color-mix(in srgb,var(--c) 10%,#1c2940) 75%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent)}
.img svg{width:64%;height:64%}.img img{width:100%;height:100%;object-fit:cover}.img ha-icon{--mdc-icon-size:14cqw}
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
    const hi = c.hero_image, art = hi === 'none' || hi === false ? '' : `<div class="art">${hi && hi !== 'svg:hero' ? img(hi) : HERO_SVG}</div>`;
    const hero = c.show_hero === false ? '' : `<div class="hero">${art}<small id="hl">Hausverbrauch jetzt</small><div class="big"><b id="hv">–</b><span>W</span></div><div class="chips" id="hc"></div></div>`;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap" id="w">${head}${hero}<div class="board"><svg class="lines"></svg><div class="grid">${cells}<div class="cell span2" style="grid-row:3">${node(hub)}</div></div></div></div></ha-card>`;
    this.shadowRoot.querySelectorAll('.s').forEach((el) => (el.onclick = () => !this._edit && el.dataset.e && this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: el.dataset.e }, bubbles: true, composed: true }))));
    this.shadowRoot.querySelectorAll('.node[data-p]').forEach((el) => (el.onclick = () => this._edit && this.dispatchEvent(new CustomEvent('hausfluss-select', { detail: { position: el.dataset.p }, bubbles: true, composed: true }))));
    this._sig = null; this._ro && this._ro.disconnect();
    this._ro = new ResizeObserver(() => this._lines()); this._ro.observe(this.shadowRoot.querySelector('.board'));
    this._upd();
  }

  _pid(n) { const b = n.bottom && this._h.states[n.bottom]; return n.power || (b && /^k?W$/i.test(b.attributes.unit_of_measurement || '') ? n.bottom : ''); }
  _w(n) {
    const h = this._h, g = (id) => (id && h.states[id] ? toW(h.states[id]) : NaN), f = flowOf(n);
    if (f === 'split') { const a = g(n.power_to_node), b = g(n.power_to_house); return (isNaN(a) ? 0 : Math.abs(a)) - (isNaN(b) ? 0 : Math.abs(b)); }
    const v = g(this._pid(n)); if (isNaN(v)) return 0;
    return f === 'supply' ? -Math.abs(v) : f === 'consume' ? Math.abs(v) : n.invert ? -v : v;
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
        if (n.position === 'hub' || flowOf(n) !== 'supply') return;
        const e = this._pid(n); if (e && h.states[e] && !isNaN(toW(h.states[e]))) { sol += -this._w(n); has = true; }
      });
      if (has) ch.push(`Solar ${Math.round(sol).toLocaleString(lang)} W`);
      if (hb.top && h.states[hb.top]) { const [v, u] = this._fmt(hb.top); ch.push(`Hausverbrauch heute ${v} ${u}`); }
      (hb.chips || []).forEach((id) => { if (h.states[id]) { const [v, u] = this._fmt(id); ch.push(`${h.states[id].attributes.friendly_name || id} ${v} ${u}`); } });
      const html = ch.map((t) => `<div class="chip">${esc(t)}</div>`).join(''), hc = r.getElementById('hc');
      if (hc._v !== html) { hc._v = html; hc.innerHTML = html; }
    }
    let sig = '';
    r.querySelectorAll('.node[data-p]').forEach((el) => {
      const hubn = el.dataset.p === 'hub', w = hubn ? 0 : this._w(this._map[el.dataset.p]); el._w = w;
      const on = hubn || Math.abs(w) > 5; el.classList.toggle('on', on); sig += el.dataset.p + (on ? (w > 0 ? 1 : 2) : 0);
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
      if (on) o += `<circle r="4.5" fill="${col}"><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="${el._w > 0 ? '0;1' : '1;0'}" keyTimes="0;1" calcMode="linear"><mpath href="#p_${n.position}"/></animateMotion></circle>`;
    });
    r.querySelector('svg.lines').innerHTML = o;
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
.f{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
label,.fld{display:grid;gap:5px;font-size:12px;color:#8a98b3;font-weight:600;align-content:start}
input:not([type=checkbox]),select{background:#1c2940;border:1px solid #26344d;color:#e8eef8;border-radius:10px;padding:9px 10px;font:500 13px inherit;font-family:inherit;min-width:0;width:100%;box-sizing:border-box}
input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid #2dd4bf;outline-offset:2px}
.pk{position:relative}
.pkb{display:flex;align-items:center;gap:10px;width:100%;min-height:42px;text-align:left;background:#1c2940;border:1px solid #26344d;color:#e8eef8;border-radius:10px;padding:6px 10px;font:500 13px inherit;font-family:inherit;cursor:pointer}
.pkb::after{content:"▾";margin-left:auto;color:#8a98b3}.pkb:hover{border-color:#2dd4bf}
.ph{color:#6f7e9a}
.pop{position:absolute;left:0;top:calc(100% + 4px);z-index:30;width:max(100%,300px);max-width:86vw;background:#101a2c;border:1px solid #2dd4bf88;border-radius:12px;box-shadow:0 14px 34px #000a;padding:8px}
.pop .q{margin-bottom:6px}.list{max-height:270px;overflow:auto;display:grid;gap:2px}
.opt{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:8px;cursor:pointer;color:#e8eef8;font-size:13px;font-weight:500}
.opt.act,.opt:hover{background:#1c2940}.none{padding:10px;color:#6f7e9a;font-size:12px}
.tx{flex:1;min-width:0}.tx b,.tx i{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tx b{font-weight:600}.tx i{font-style:normal;font-size:11px;color:#6f7e9a}
.opt em{font-style:normal;font-size:12px;color:#2dd4bf;white-space:nowrap;font-weight:600}
.th{width:30px;height:30px;flex:none;display:grid;place-items:center;font-size:22px}.th svg,.th img{width:100%;height:100%;object-fit:contain}
.sw{display:flex;gap:8px;align-items:center;min-height:36px}.sw button{width:26px;height:26px;border-radius:50%;border:2px solid transparent;cursor:pointer}.sw button.a{border-color:#fff}
.row{display:flex;align-items:center;gap:8px;font-size:12px;color:#8a98b3;font-weight:600}.row input{accent-color:#2dd4bf}
pre{margin:0;background:#0a111d;border:1px solid #26344d;border-radius:12px;padding:12px;font-size:12px;overflow-x:auto;color:#b8c5dd;max-height:240px}
`;

class HausflussEditor extends HTMLElement {
  constructor() {
    super(); this.attachShadow({ mode: 'open' }); this._sel = 'top_1'; this._c = {};
    this._out = (e) => { if (!e.composedPath().includes(this)) this._closeAll(); };
    this.shadowRoot.addEventListener('pointerdown', (e) => { if (!e.target.closest('.pk')) this._closeAll(); });
  }
  connectedCallback() { document.addEventListener('pointerdown', this._out); }
  disconnectedCallback() { document.removeEventListener('pointerdown', this._out); }
  setConfig(c) { if (this._built && JSON.stringify(c) === JSON.stringify(this._c)) return; this._c = c || {}; this._draw(); }
  set hass(h) { this._h = h; }
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
  _picked(p) { this.dispatchEvent(new CustomEvent('hausfluss-selected', { detail: { position: p }, bubbles: true, composed: true })); }
  _closeAll() { this.shadowRoot.querySelectorAll('.pop').forEach((p) => (p.hidden = true)); }

  _entLabel(id) {
    if (!id) return '<span class="ph">Entität wählen …</span>';
    const st = this._h?.states?.[id];
    return `<span class="tx"><b>${esc(st?.attributes.friendly_name || id)}</b><i>${esc(id)}${st ? ' · ' + esc(st.state + ' ' + (st.attributes.unit_of_measurement || '')) : ' · nicht gefunden'}</i></span>`;
  }
  _imgFind(v) {
    if (v.startsWith('svg:')) { const i = IMGS.find((x) => 'svg:' + x.id === v); return i && { n: i.n, t: 'Illustration' }; }
    const e = EMO.find((x) => x[0] === v); return e && { n: e[1], t: 'Emoji' };
  }
  _imgLabel(v) {
    if (!v) return '<span class="ph">– Standard –</span>';
    if (v === 'none') return '<span class="ph">Kein Bild</span>';
    const it = this._imgFind(v);
    return `<span class="th">${img(v)}</span><span class="tx"><b>${esc(it ? it.n : v)}</b><i>${it ? it.t : 'Eigenes Bild'}</i></span>`;
  }
  _fld(kind, f, label, val) {
    return `<div class="fld"><span>${label}</span><div class="pk" data-k="${kind}" data-f="${f}"><button type="button" class="pkb" aria-haspopup="listbox">${kind === 'entity' ? this._entLabel(val) : this._imgLabel(val)}</button><div class="pop" hidden><input class="q" placeholder="${kind === 'entity' ? 'Suchen …' : 'Suchen oder mdi:icon / Pfad eingeben'}" autocomplete="off" aria-label="Suchen"><div class="list" role="listbox"></div></div></div></div>`;
  }
  _ents(t) {
    const S = this._h?.states || {};
    let a = Object.keys(S).map((id) => ({ id, n: S[id].attributes.friendly_name || id, s: S[id] })).filter((e) => t.every((w) => (e.id + ' ' + e.n).toLowerCase().includes(w)));
    a.sort((x, y) => x.n.localeCompare(y.n, 'de')); const more = a.length > 80; a = a.slice(0, 80);
    const o = [{ v: '', h: '<span class="tx"><b>– leer –</b></span>' }].concat(a.map((e) => ({ v: e.id, h: `<span class="tx"><b>${esc(e.n)}</b><i>${esc(e.id)}</i></span><em>${esc(e.s.state + ' ' + (e.s.attributes.unit_of_measurement || ''))}</em>` })));
    if (more) o.push({ v: null, h: '<span class="tx"><i>… weitere: Suche eingrenzen</i></span>' });
    return o;
  }
  _imgs(raw, t, f) {
    const m = (s) => t.every((w) => s.toLowerCase().includes(w)), o = [], th = (v, n, s) => `<span class="th">${img(v)}</span><span class="tx"><b>${esc(n)}</b><i>${s}</i></span>`;
    if (!t.length) o.push({ v: '', h: '<span class="tx"><b>– Standard –</b></span>' });
    if (f === 'hero_image' && m('kein bild none ohne')) o.push({ v: 'none', h: '<span class="tx"><b>Kein Bild</b></span>' });
    if (raw && (/^(mdi:|\/|https?:)/.test(raw) || !/^[\p{L}\p{N} ]+$/u.test(raw))) o.push({ v: raw, h: `<span class="th">${img(raw)}</span><span class="tx"><b>Verwenden</b><i>${esc(raw)}</i></span>` });
    IMGS.filter((i) => m(i.n + ' ' + i.k)).forEach((i) => o.push({ v: 'svg:' + i.id, h: th('svg:' + i.id, i.n, 'Illustration') }));
    EMO.filter((e) => m(e[1] + ' ' + e[2])).forEach((e) => o.push({ v: e[0], h: th(e[0], e[1], 'Emoji') }));
    return o;
  }
  _wire(pk) {
    const btn = pk.querySelector('.pkb'), pop = pk.querySelector('.pop'), q = pk.querySelector('.q'), list = pk.querySelector('.list'), kind = pk.dataset.k, f = pk.dataset.f;
    let items = [], idx = 0;
    const render = () => {
      list.innerHTML = items.map((it, i) => `<div class="opt${i === idx ? ' act' : ''}" data-i="${i}" role="option">${it.h}</div>`).join('') || '<div class="none">Keine Treffer</div>';
      const a = list.querySelector('.act'); if (a) a.scrollIntoView({ block: 'nearest' });
    };
    const build = () => { const raw = q.value.trim(), t = raw.toLowerCase().split(/\s+/).filter(Boolean); items = kind === 'entity' ? this._ents(t) : this._imgs(raw, t, f); idx = 0; render(); };
    const pick = (it) => { if (!it || it.v === null) return; this._closeAll(); this._pick(pk, it.v); btn.focus(); };
    btn.onclick = () => { const was = pop.hidden; this._closeAll(); if (was) { pop.hidden = false; q.value = ''; build(); q.focus(); } };
    q.oninput = build;
    q.onkeydown = (e) => {
      if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, items.length - 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); render(); e.preventDefault(); }
      else if (e.key === 'Enter') { pick(items[idx]); e.preventDefault(); }
      else if (e.key === 'Escape') { pop.hidden = true; btn.focus(); }
    };
    list.onclick = (e) => { const o = e.target.closest('.opt'); if (o) pick(items[+o.dataset.i]); };
  }
  _pick(pk, v) {
    const f = pk.dataset.f, k = pk.dataset.k, p = this._sel;
    if (/^chip\d$/.test(f)) { const cur = this._node('hub').chips || []; this._set('hub', { chips: [0, 1, 2].map((i) => (i === +f[4] ? v : cur[i] || '')).filter(Boolean) }); this._draw(); return; }
    if (f === 'hero_image') this._top({ hero_image: v || undefined }); else this._set(p, { [f]: v });
    pk.querySelector('.pkb').innerHTML = k === 'entity' ? this._entLabel(v) : this._imgLabel(v);
    this._chips(); this._yaml();
  }
  _flowUi(n, fl) {
    const o = (v, t) => `<option value="${v}"${fl === v ? ' selected' : ''}>${t}</option>`;
    const hints = {
      consume: 'Die Punkte laufen vom Haus zur Kachel, sobald der Sensor Leistung zeigt.',
      supply: 'Die Punkte laufen von der Kachel ins Haus, sobald der Sensor Leistung zeigt.',
      both: 'Ein Sensor für beide Richtungen, z. B. Netz oder Akku: positiver Wert = zur Kachel, negativer Wert = ins Haus. Liefert dein Sensor es umgekehrt, setze „Vorzeichen umkehren“.',
      split: 'Zwei Sensoren, z. B. Netz (Einspeisung / Bezug) oder Akku (Laden / Entladen). Der größere Wert bestimmt die Richtung.',
    };
    let f;
    if (fl === 'split') f = this._fld('entity', 'power_to_node', 'Sensor zur Kachel (z. B. Einspeisung, Laden)', n.power_to_node) + this._fld('entity', 'power_to_house', 'Sensor ins Haus (z. B. Bezug, Entladen)', n.power_to_house);
    else if (fl === 'both') f = this._fld('entity', 'power', 'Sensor (positiv = zur Kachel)', n.power) + `<label class="row"><input type="checkbox" data-inv${n.invert ? ' checked' : ''}>Vorzeichen umkehren (positiv = ins Haus)</label>`;
    else f = this._fld('entity', 'power', 'Fluss-Leistung (optional, sonst „Unten“)', n.power);
    return `<label>Flussart<select data-fl>${o('consume', 'Verbraucht (Energie fließt zur Kachel)')}${o('supply', 'Liefert (Energie fließt ins Haus)')}${o('both', 'Beides – ein Sensor mit Vorzeichen')}${o('split', 'Beides – zwei Sensoren')}</select></label>${f}<p style="grid-column:1/-1">${hints[fl]}</p>`;
  }
  _chips() {
    const c = this._c, p = this._sel;
    this.shadowRoot.getElementById('tgl').innerHTML = Object.keys(POS).map((k) => {
      const x = (c.nodes || []).find((q) => q.position === k), on = !!x && x.enabled !== false;
      return `<span class="tg${k === p ? ' cur' : ''}${on ? '' : ' off'}"><input type="checkbox" data-k="${k}"${on ? ' checked' : ''} aria-label="${POSNAME[k]} anzeigen"><button data-s="${k}">${esc((x && x.name) || POSNAME[k])}</button></span>`;
    }).join('') + `<span class="tg${p === 'hub' ? ' cur' : ''}"><button data-s="hub">${esc((c.hub && c.hub.name) || 'Haus')} (Mitte)</button></span>`;
    this.shadowRoot.querySelectorAll('[data-k]').forEach((x) => { if (x.type === 'checkbox') x.onchange = () => { const k = x.dataset.k; this._set(k, { enabled: x.checked }); this._sel = k; this._draw(); this._picked(k); }; });
    this.shadowRoot.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { this._sel = b.dataset.s; this._draw(); this._picked(this._sel); }));
  }
  _yaml() {
    const p = this._sel, n = this._node(p), L = [p === 'hub' ? 'hub:' : `- position: ${p}`];
    Object.entries(n).filter(([k]) => k !== 'position').forEach(([k, v]) => L.push(`  ${k}: ${Array.isArray(v) ? '[' + v.join(', ') + ']' : v}`));
    this.shadowRoot.getElementById('y').textContent = L.join('\n');
  }
  _draw() {
    this._built = true;
    const c = this._c, p = this._sel, hub = p === 'hub', n = this._node(p), col = n.color || (POS[p] || [])[3] || '#2dd4bf', chips = n.chips || [], fl = hub ? '' : flowOf({ ...n, position: p });
    this.shadowRoot.innerHTML = `<style>${ECSS}</style><div class="panel"><div><h2>${esc(n.name || (hub ? 'Haus' : POSNAME[p]))}</h2><p>Haken setzen zeigt die Kachel an, Haken entfernen blendet sie aus. Namen antippen zum Bearbeiten.</p></div>
<div class="tgl" id="tgl"></div>
<div class="f"><label>Titel der Karte<input id="ti" value="${esc(c.title || '')}" placeholder="Modul 3 – Energiefluss"></label><label class="row"><input type="checkbox" id="sh"${c.show_hero === false ? '' : ' checked'}>Kopfbereich anzeigen</label>${this._fld('image', 'hero_image', 'Bild im Kopfbereich', c.hero_image)}</div>
<div class="f"><label>Name<input data-f="name" value="${esc(n.name || '')}"></label>${this._fld('image', 'image', 'Bild der Kachel', n.image)}
${SIDES.map((s) => this._fld('entity', s, FL[s], n[s])).join('')}
${hub ? [0, 1, 2].map((i) => this._fld('entity', 'chip' + i, 'Chip ' + (i + 1) + ' (Kopfbereich)', chips[i] || '')).join('') : this._flowUi(n, fl) + `<div class="fld"><span>Akzentfarbe</span><div class="sw">${SW.map((x) => `<button data-c="${x}" style="background:${x}" class="${x === col ? 'a' : ''}" aria-label="Farbe ${x}"></button>`).join('')}</div></div>`}</div>
<pre id="y"></pre></div>`;
    this._chips(); this._yaml();
    const r = this.shadowRoot;
    r.getElementById('ti').onchange = (e) => this._top({ title: e.target.value.trim() });
    r.getElementById('sh').onchange = (e) => this._top({ show_hero: e.target.checked ? undefined : false });
    r.querySelectorAll('.pk').forEach((pk) => this._wire(pk));
    r.querySelectorAll('input[data-f],select[data-f]').forEach((i) => (i.onchange = () => { this._set(p, { [i.dataset.f]: i.value.trim() }); this._chips(); this._yaml(); }));
    const fs = r.querySelector('[data-fl]');
    if (fs) fs.onchange = () => { const v = fs.value; this._set(p, { flow: v, direction: '', ...(v !== 'split' ? { power_to_node: '', power_to_house: '' } : {}), ...(v !== 'both' ? { invert: '' } : {}) }); this._draw(); };
    const iv = r.querySelector('[data-inv]');
    if (iv) iv.onchange = () => { this._set(p, { invert: iv.checked ? true : '' }); this._yaml(); };
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
