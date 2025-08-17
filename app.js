// PharmAssist Pro — RxNav + openFDA with Debug Panel
// Debug build: adds on-page logs for suggestions, normalization, interactions, labeling, and errors.

/////////////////////////////
// Debug UI utilities
/////////////////////////////
const DebugPanel = (() => {
  let panel, body, btn, visible = false;

  function ensure() {
    if (panel) return;
    panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
      position: fixed; right: 16px; bottom: 16px; width: 420px; max-height: 60vh;
      background: #0b1220; color: #d1d5db; border: 1px solid #334155; border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,.4); display: none; z-index: 99999; overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size: 12px;
    `;
    const header = document.createElement('div');
    header.style.cssText = `
      display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:#111827; border-bottom:1px solid #374151;
    `;
    const title = document.createElement('div');
    title.textContent = 'Debug Panel';
    title.style.cssText = 'font-weight:700; color:#93c5fd;';
    const actions = document.createElement('div');

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = actionBtnCss();
    clearBtn.onclick = () => { if (body) body.innerHTML = ''; };

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.cssText = actionBtnCss();
    copyBtn.onclick = () => {
      const text = body ? body.innerText : '';
      navigator.clipboard.writeText(text).then(() => toast('Copied logs to clipboard'));
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = actionBtnCss();
    closeBtn.onclick = toggle;

    actions.append(clearBtn, copyBtn, closeBtn);
    header.append(title, actions);

    body = document.createElement('pre');
    body.style.cssText = 'margin:0; padding:10px; overflow:auto; max-height:calc(60vh - 40px); white-space:pre-wrap;';

    panel.append(header, body);
    document.body.appendChild(panel);

    // Toggle Button
    btn = document.createElement('button');
    btn.textContent = 'Debug';
    btn.style.cssText = `
      position: fixed; right: 16px; bottom: 16px; z-index: 99998;
      background: #2563eb; color: #fff; border:none; border-radius:20px;
      padding:8px 12px; box-shadow:0 8px 20px rgba(37,99,235,.35); cursor:pointer; font-weight:600;
    `;
    btn.onclick = toggle;
    document.body.appendChild(btn);
  }

  function actionBtnCss() {
    return `
      background:#1f2937; color:#d1d5db; border:1px solid #374151; border-radius:6px; padding:4px 8px;
      cursor:pointer; margin-left:6px;
    `;
  }

  function toggle() {
    visible = !visible;
    panel.style.display = visible ? 'block' : 'none';
    btn.style.display = visible ? 'none' : 'block';
  }

  function log(label, data) {
    ensure();
    const time = new Date().toLocaleTimeString();
    const line = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    body.innerHTML += `[${time}] ${label}\n${line}\n\n`;
    body.scrollTop = body.scrollHeight;
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position: fixed; right: 16px; bottom: ${visible ? 'calc(16px + 60vh + 8px)' : '56px'}; z-index: 99997;
      background: #111827; color: #e5e7eb; border:1px solid #374151; padding:8px 12px; border-radius:8px;
      box-shadow:0 8px 24px rgba(0,0,0,.35);
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  return { log, toast, ensure };
})();

/////////////////////////////
// Safe fetch with logging
/////////////////////////////
async function safeFetch(url, options = {}, label = 'fetch') {
  const started = performance.now();
  try {
    DebugPanel.log('REQUEST', { label, url, options });
    const res = await fetch(url, options);
    const elapsed = (performance.now() - started).toFixed(0) + 'ms';
    DebugPanel.log('RESPONSE', { label, url, status: res.status, ok: res.ok, elapsed });
    return res;
  } catch (err) {
    const elapsed = (performance.now() - started).toFixed(0) + 'ms';
    DebugPanel.log('ERROR', { label, url, error: String(err), elapsed });
    DebugPanel.toast('Network blocked or failed. Try disabling extensions or retry.');
    throw err;
  }
}

/////////////////////////////
// Providers (RxNav / openFDA)
/////////////////////////////
const RXNAV = {
  suggest: async (query) => {
    const q = encodeURIComponent(query.trim());
    const url1 = `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${q}`;
    const url2 = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${q}`;
    const [sugRes, drugRes] = await Promise.all([
      safeFetch(url1, {}, 'rxnav:suggestions'),
      safeFetch(url2, {}, 'rxnav:drugs')
    ]);
    const sugJson = await sugRes.json().catch(() => ({}));
    const drugJson = await drugRes.json().catch(() => ({}));
    DebugPanel.log('DATA rxnav:suggestions', sugJson);
    DebugPanel.log('DATA rxnav:drugs', drugJson);

    const sugList = (sugJson.suggestionGroup?.suggestionList?.suggestion || []);
    const drugConcepts = (drugJson?.drugGroup?.conceptGroup || [])
      .flatMap(g => g?.conceptProperties || [])
      .map(c => c.name)
      .filter(Boolean);

    const merged = [...new Set([...sugList, ...drugConcepts])];
    return merged.slice(0, 25);
  },

  normalize: async (name) => {
    const q = encodeURIComponent(name.trim());
    const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${q}&maxEntries=5`;
    const res = await safeFetch(url, {}, 'rxnav:approximateTerm');
    const json = await res.json().catch(() => ({}));
    DebugPanel.log('DATA rxnav:approximateTerm', json);

    const candidates = json.approximateGroup?.candidate || [];
    if (!candidates.length) return null;

    const best = candidates.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))[0];
    const rxcui = best.rxcui;

    const nameRes = await safeFetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}.json`, {}, 'rxnav:rxcuiProps');
    const nameJson = await nameRes.json().catch(() => ({}));
    DebugPanel.log('DATA rxnav:rxcuiProps', nameJson);

    const props = nameJson.idGroup || {};
    return { rxcui, name: props.name || name };
  },

  interactionsForList: async (rxcuis) => {
    const list = encodeURIComponent(rxcuis.join('+'));
    const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${list}`;
    const res = await safeFetch(url, {}, 'rxnav:interactionList');
    const json = await res.json().catch(() => ({}));
    DebugPanel.log('DATA rxnav:interactionList', json);
    return json;
  },

  properties: async (rxcui) => {
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`;
    const res = await safeFetch(url, {}, 'rxnav:properties');
    const json = await res.json().catch(() => ({}));
    DebugPanel.log('DATA rxnav:properties', json);
    return json?.properties || null;
  }
};

const OpenFDA = {
  async fetchLabel(displayName) {
    const q = displayName.trim();
    const limit = 1;
    const queries = [
      `brand_name:"${escapeFDA(q)}"`,
      `substance_name:"${escapeFDA(q)}"`,
      q
    ];
    for (const term of queries) {
      const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(term)}&limit=${limit}`;
      try {
        const res = await safeFetch(url, {}, 'openfda:label');
        if (!res.ok) continue;
        const json = await res.json();
        DebugPanel.log('DATA openfda:label', { term, json });
        if (json?.results?.length) return json.results[0];
      } catch (e) {
        // Continue
      }
    }
    return null;
  },

  pickSections(rec) {
    const pick = (key) => {
      const v = rec?.[key];
      if (!v) return null;
      if (Array.isArray(v)) return v.join('\n\n');
      return String(v);
    };
    return {
      boxed_warning: pick('boxed_warning') || pick('boxed_warning_section'),
      indications: pick('indications_and_usage'),
      dosage: pick('dosage_and_administration'),
      contraindications: pick('contraindications'),
      warnings: pick('warnings') || pick('warnings_and_precautions') || pick('warnings_and_cautions'),
      adverse_reactions: pick('adverse_reactions'),
      patient_counseling: pick('information_for_patients') || pick('patient_counseling_information')
    };
  }
};

/////////////////////////////
// Helpers
/////////////////////////////
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function escapeFDA(str) {
  return String(str).replace(/([+\-!(){}\[\]^"~*?:\\/])/g, '\\$1');
}
function toast(msg) { DebugPanel.toast(msg); }

/////////////////////////////
// Main App
/////////////////////////////
class PharmAssistApp {
  constructor() {
    this.currentTab = 'interactions';
    this.currentMode = 'two';
    this.drugCounter = 0;
    this.twoDrug = { a: null, b: null };
    this.multiDrugs = [];
    this.suggestionCache = new Map();
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    DebugPanel.ensure();
    DebugPanel.log('INIT', 'RxNav + openFDA debug build initialized');
    this.setupTabs();
    this.setupModeToggle();
    this.setupTwoDrugUI();
    this.setupMultiDrugUI();
    this.setupSearchUI();
  }

  setupTabs() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
        e.currentTarget.classList.add('active');
        this.currentTab = tab;
        DebugPanel.log('TAB', `Switched to ${tab}`);
      });
    });
  }

  setupModeToggle() {
    document.getElementById('twoModeBtn').addEventListener('click', () => this.switchMode('two'));
    document.getElementById('multiModeBtn').addEventListener('click', () => this.switchMode('multi'));
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mode-interface').forEach(i => i.classList.remove('active'));
    if (mode === 'two') {
      document.getElementById('twoModeBtn').classList.add('active');
      document.getElementById('twoModeInterface').classList.add('active');
    } else {
      document.getElementById('multiModeBtn').classList.add('active');
      document.getElementById('multiModeInterface').classList.add('active');
      if (this.multiDrugs.length === 0) {
        this.addDrugInput();
        this.addDrugInput();
      }
    }
    DebugPanel.log('MODE', `Now in ${mode} mode`);
  }

  setupTwoDrugUI() {
    this.setupSuggestInput('drug1', 'suggestions1', (choice) => { this.twoDrug.a = choice; DebugPanel.log('SELECT A', choice); });
    this.setupSuggestInput('drug2', 'suggestions2', (choice) => { this.twoDrug.b = choice; DebugPanel.log('SELECT B', choice); });

    document.getElementById('checkInteraction').addEventListener('click', async () => {
      DebugPanel.log('ACTION', 'Check Interaction clicked');
      await this.checkTwoDrugInteraction();
    });
  }

  async checkTwoDrugInteraction() {
    const aVal = document.getElementById('drug1').value.trim();
    const bVal = document.getElementById('drug2').value.trim();
    if (!aVal || !bVal) return toast('Please enter both drugs.');

    const a = (this.twoDrug.a && this.twoDrug.a.name.toLowerCase() === aVal.toLowerCase())
      ? this.twoDrug.a : await RXNAV.normalize(aVal);
    const b = (this.twoDrug.b && this.twoDrug.b.name.toLowerCase() === bVal.toLowerCase())
      ? this.twoDrug.b : await RXNAV.normalize(bVal);

    DebugPanel.log('NORMALIZE', { aVal, normA: a, bVal, normB: b });

    if (!a || !b) return toast('Could not resolve one or both drugs. Pick from suggestions.');

    const json = await RXNAV.interactionsForList([a.rxcui, b.rxcui]);
    this.renderTwoDrugResults(json, a, b);
  }

  mapSeverity(raw) {
    if (!raw) return 'unknown';
    const r = raw.toLowerCase();
    if (r.includes('high') || r.includes('contra')) return 'major';
    if (r.includes('moder')) return 'moderate';
    if (r.includes('minor') || r.includes('low')) return 'minor';
    return 'unknown';
  }

  renderTwoDrugResults(json, a, b) {
    const container = document.getElementById('interactionResults');
    if (!json || !json.fullInteractionTypeGroup) {
      container.innerHTML = this.noInteractionHTML(a.name, b.name);
      container.style.display = 'block';
      DebugPanel.log('RESULT', 'No interaction data returned');
      return;
    }
    const interactions = [];
    for (const group of json.fullInteractionTypeGroup) {
      for (const fit of group.fullInteractionType || []) {
        for (const pair of fit.interactionPair || []) {
          const desc = pair.description || '';
          const severity = (pair.severity || '').toLowerCase();
          const sources = (pair.source || []).map(s => s?.name).filter(Boolean);
          interactions.push({ severity: this.mapSeverity(severity), description: desc, sources });
        }
      }
    }
    DebugPanel.log('RESULT', { interactionsCount: interactions.length });

    if (!interactions.length) {
      container.innerHTML = this.noInteractionHTML(a.name, b.name);
    } else {
      const order = { major: 3, moderate: 2, minor: 1, unknown: 0 };
      interactions.sort((x, y) => order[y.severity] - order[x.severity]);
      container.innerHTML = interactions.map(i => `
        <div class="interaction-result ${i.severity}">
          <div class="severity-badge ${i.severity}">${i.severity.toUpperCase()}</div>
          <h3>${escapeHTML(a.name)} + ${escapeHTML(b.name)}</h3>
          <div style="margin-top: 0.75rem;"><p>${escapeHTML(i.description)}</p></div>
          ${i.sources?.length ? `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #555;">Sources: ${i.sources.join(', ')}</div>` : ''}
        </div>
      `).join('');
    }
    container.style.display = 'block';
  }

  noInteractionHTML(a, b) {
    return `
      <div class="interaction-result">
        <div class="severity-badge minor">NO KNOWN MAJOR INTERACTION</div>
        <h3>${escapeHTML(a)} + ${escapeHTML(b)}</h3>
        <p>No major interaction found via RxNav dataset. Verify with clinical resources.</p>
      </div>
    `;
  }

  setupMultiDrugUI() {
    document.getElementById('addDrugBtn').addEventListener('click', () => this.addDrugInput());
    document.getElementById('checkAllInteractions').addEventListener('click', () => this.checkAllInteractions());
    document.getElementById('clearAllDrugs').addEventListener('click', () => this.clearAllDrugs());
  }

  addDrugInput() {
    this.drugCounter++;
    const list = document.getElementById('drugList');
    const id = this.drugCounter;
    const row = document.createElement('div');
    row.className = 'drug-item';
    row.dataset.drugId = id;
    row.innerHTML = `
      <div class="drug-number">${id}</div>
      <div class="input-group">
        <input type="text" id="multiDrug_${id}" placeholder="Enter drug name..." autocomplete="off">
        <div class="suggestions" id="multiSuggestions_${id}"></div>
      </div>
      <button class="remove-drug" aria-label="remove" title="Remove" onclick="app.removeDrugInput(${id})">
        <i class="fas fa-times"></i>
      </button>
    `;
    list.appendChild(row);
    this.setupSuggestInput(`multiDrug_${id}`, `multiSuggestions_${id}`, (choice) => {
      const idx = this.multiDrugs.findIndex(x => x.inputId === `multiDrug_${id}`);
      const record = { inputId: `multiDrug_${id}`, rxcui: choice.rxcui, name: choice.name };
      if (idx >= 0) this.multiDrugs[idx] = record; else this.multiDrugs.push(record);
      DebugPanel.log('SELECT MULTI', record);
    });
  }

  removeDrugInput(id) {
    const el = document.querySelector(`[data-drug-id="${id}"]`);
    if (el) el.remove();
    this.multiDrugs = this.multiDrugs.filter(x => x.inputId !== `multiDrug_${id}`);
    document.querySelectorAll('#drugList .drug-item').forEach((item, i) => {
      const num = item.querySelector('.drug-number');
      if (num) num.textContent = (i + 1).toString();
    });
    DebugPanel.log('REMOVE MULTI', { id });
  }

  clearAllDrugs() {
    document.getElementById('drugList').innerHTML = '';
    document.getElementById('multiInteractionResults').innerHTML = '';
    document.getElementById('resultsSummary').style.display = 'none';
    this.drugCounter = 0;
    this.multiDrugs = [];
    this.addDrugInput();
    this.addDrugInput();
    DebugPanel.log('CLEAR MULTI', 'Reset multi-drug list');
  }

  async checkAllInteractions() {
    const inputs = Array.from(document.querySelectorAll('#drugList input'));
    const selected = [];
    for (const input of inputs) {
      const val = input.value.trim();
      if (!val) continue;
      const existing = this.multiDrugs.find(x => x.inputId === input.id && x.name.toLowerCase() === val.toLowerCase());
      if (existing) selected.push({ rxcui: existing.rxcui, name: existing.name });
      else {
        const norm = await RXNAV.normalize(val);
        if (norm) selected.push(norm);
      }
    }
    DebugPanel.log('MULTI NORMALIZE', selected);

    // Dedupe by rxcui
    const seen = new Set(); const uniq = [];
    for (const s of selected) { if (!seen.has(s.rxcui)) { seen.add(s.rxcui); uniq.push(s); } }
    if (uniq.length < 2) return toast('Please enter at least 2 distinct drugs.');

    const json = await RXNAV.interactionsForList(uniq.map(x => x.rxcui));
    this.renderMultiResults(json, uniq);
  }

  renderMultiResults(json, drugs) {
    const resultsContainer = document.getElementById('multiInteractionResults');
    const resultsSummary = document.getElementById('resultsSummary');

    if (!json || !json.fullInteractionTypeGroup) {
      resultsContainer.innerHTML = this.multiNoInteractionsHTML(drugs);
      resultsSummary.style.display = 'block';
      document.getElementById('totalDrugs').textContent = String(drugs.length);
      document.getElementById('totalInteractions').textContent = '0';
      document.getElementById('majorInteractions').textContent = '0';
      DebugPanel.log('RESULT MULTI', 'No interactions returned');
      return;
    }

    const nameByCUI = new Map(drugs.map(d => [d.rxcui, d.name]));
    const order = { major: 3, moderate: 2, minor: 1, unknown: 0 };
    const cards = [];
    let totalInteractions = 0;
    let majorCount = 0;

    for (const group of json.fullInteractionTypeGroup) {
      for (const fit of group.fullInteractionType || []) {
        const items = fit?.minConcept || [];
        if (items.length < 2) continue;
        const d1 = items[0]?.rxcui; const d2 = items[1]?.rxcui;
        const name1 = nameByCUI.get(d1) || items?.name || d1;
        const name2 = nameByCUI.get(d2) || items[1]?.name || d2;

        for (const p of (fit.interactionPair || [])) {
          totalInteractions++;
          const sev = this.mapSeverity((p.severity || '').toLowerCase());
          if (sev === 'major') majorCount++;
          cards.push({ sev, html: `
            <div class="interaction-pair ${sev}">
              <div class="pair-header">
                <div class="drug-pair">${escapeHTML(name1)} <i class="fas fa-exchange-alt" style="color: var(--primary);"></i> ${escapeHTML(name2)}</div>
                <div class="severity-badge ${sev}">${sev.toUpperCase()}</div>
              </div>
              <div class="interaction-details">
                <h4><i class="fas fa-exclamation-triangle"></i> Details</h4>
                <p>${escapeHTML(p.description || 'No description provided by source')}</p>
              </div>
              ${p.source?.length ? `<div class="interaction-meta"><div><strong>Sources:</strong> ${p.source.map(s => s.name).join(', ')}</div></div>` : ``}
            </div>
          `});
        }
      }
    }
    cards.sort((a, b) => order[b.sev] - order[a.sev]);
    resultsContainer.innerHTML = cards.length ? cards.map(c => c.html).join('') : this.multiNoInteractionsHTML(drugs);

    resultsSummary.style.display = 'block';
    document.getElementById('totalDrugs').textContent = String(drugs.length);
    document.getElementById('totalInteractions').textContent = String(totalInteractions);
    document.getElementById('majorInteractions').textContent = String(majorCount);
    resultsSummary.scrollIntoView({ behavior: 'smooth' });
    DebugPanel.log('RESULT MULTI', { totalInteractions, majorCount });
  }

  multiNoInteractionsHTML(drugs) {
    const names = drugs.map(d => d.name).join(', ');
    return `
      <div class="no-interactions">
        <i class="fas fa-check-circle"></i>
        <h3>No Interactions Found</h3>
        <p>No interactions returned by RxNav for: ${escapeHTML(names)}</p>
        <p><em>Always verify with updated clinical resources.</em></p>
      </div>
    `;
  }

  setupSearchUI() {
    document.getElementById('searchDrug').addEventListener('click', () => this.searchDrugInfo());
    document.getElementById('drugSearch').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchDrugInfo();
    });
  }

  async searchDrugInfo() {
    const q = document.getElementById('drugSearch').value.trim();
    if (!q) return toast('Enter a drug name');

    DebugPanel.log('DRUG INFO', { query: q });

    let norm = null, props = null, label = null;
    try {
      norm = await RXNAV.normalize(q);
      DebugPanel.log('DRUG INFO normalize', norm);
      if (norm) props = await RXNAV.properties(norm.rxcui);
      if (props?.name || norm?.name) {
        label = await OpenFDA.fetchLabel(props?.name || norm?.name || q) || await OpenFDA.fetchLabel(q);
      }
    } catch (e) {
      DebugPanel.log('DRUG INFO error', String(e));
    }

    const container = document.getElementById('drugInfoResults');
    if (!norm) {
      container.innerHTML = `
        <div class="interaction-result">
          <h3>Drug not found</h3>
          <p>Could not resolve "${escapeHTML(q)}" via RxNorm. Try another spelling or pick from suggestions.</p>
        </div>
      `;
      return;
    }

    const sections = label ? OpenFDA.pickSections(label) : null;

    container.innerHTML = `
      <div class="drug-info-card" style="background: white; padding: 2rem; border-radius: 16px; box-shadow: var(--shadow-lg);">
        <div class="drug-header" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
          <h2 style="color: var(--primary); margin-bottom: 0.25rem;">${escapeHTML(norm.name)}</h2>
          <div style="font-size: 0.95rem; color: #555;">RxCUI: ${escapeHTML(norm.rxcui)}</div>
        </div>

        ${props ? `
        <div class="drug-content" style="line-height:1.6; margin-bottom:1rem;">
          <p><strong>RxNorm Name:</strong> ${escapeHTML(props.name || norm.name)}</p>
          <p><strong>TTY:</strong> ${escapeHTML(props.tty || 'N/A')}</p>
          ${props.synonym ? `<p><strong>Synonyms:</strong> ${escapeHTML(props.synonym)}</p>` : ``}
        </div>` : ``}

        ${sections ? `
        <div class="drug-sections" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap:1rem;">
          ${sections.boxed_warning ? sectionCard('Boxed Warning', sections.boxed_warning, 'danger') : ``}
          ${sections.indications ? sectionCard('Indications & Usage', sections.indications) : ``}
          ${sections.dosage ? sectionCard('Dosage & Administration', sections.dosage) : ``}
          ${sections.contraindications ? sectionCard('Contraindications', sections.contraindications, 'warning') : ``}
          ${sections.warnings ? sectionCard('Warnings & Precautions', sections.warnings, 'warning') : ``}
          ${sections.adverse_reactions ? sectionCard('Adverse Reactions', sections.adverse_reactions) : ``}
          ${sections.patient_counseling ? sectionCard('Patient Counseling', sections.patient_counseling) : ``}
        </div>
        <p style="margin-top:1rem; font-size:0.85rem; color:#666;">
          Sources: RxNav/RxNorm (identifiers) and openFDA (labeling). Educational use only; verify with official product labeling.
        </p>` : `
        <div class="interaction-result">
          <h3>Labeling not found</h3>
          <p>openFDA labeling was not available. Try alternate brand/generic names.</p>
        </div>`}
      </div>
    `;
  }

  setupSuggestInput(inputId, suggestBoxId, onChoice) {
    const input = document.getElementById(inputId);
    const box = document.getElementById(suggestBoxId);
    if (!input || !box) return;

    let timer;
    const fetchSuggestions = async (q) => {
      if (!q) return [];
      const key = q.toLowerCase();
      if (this.suggestionCache.has(key)) return this.suggestionCache.get(key);
      const list = await RXNAV.suggest(q);
      this.suggestionCache.set(key, list);
      return list;
    };

    input.addEventListener('input', async (e) => {
      const q = e.target.value.trim();
      if (q.length < 1) { box.style.display = 'none'; return; }
      clearTimeout(timer);
      timer = setTimeout(async () => {
        let suggestions = [];
        try {
          suggestions = await fetchSuggestions(q);
        } catch (e) {
          DebugPanel.log('SUGGEST ERROR', String(e));
          toast('Suggestions blocked. Try disabling extensions.');
        }
        const lower = q.toLowerCase();
        const filtered = suggestions
          .filter(s => s.toLowerCase().includes(lower))
          .sort((a, b) => {
            const as = a.toLowerCase().startsWith(lower);
            const bs = b.toLowerCase().startsWith(lower);
            if (as && !bs) return -1;
            if (!as && bs) return 1;
            return a.localeCompare(b);
          })
          .slice(0, 12);

        if (!filtered.length) { box.style.display = 'none'; return; }

        box.innerHTML = filtered.map(name => `<div class="suggestion-item" data-name="${escapeHTML(name)}">${escapeHTML(name)}</div>`).join('');
        box.style.display = 'block';

        box.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', async () => {
            const name = item.getAttribute('data-name');
            input.value = name;
            box.style.display = 'none';
            try {
              const norm = await RXNAV.normalize(name);
              if (norm && onChoice) onChoice(norm);
            } catch (e) {
              DebugPanel.log('NORMALIZE ERROR', String(e));
              toast('Normalize blocked. Try disabling extensions.');
            }
          });
        });
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.input-group')) box.style.display = 'none';
    });
  }
}

// UI helpers
function sectionCard(title, text, tone) {
  const color = tone === 'danger' ? 'var(--danger)' : tone === 'warning' ? 'var(--warning)' : 'var(--primary)';
  const bg = tone === 'danger' ? '#fef2f2' : tone === 'warning' ? '#fffbeb' : '#f8fafc';
  return `
    <div style="background:${bg}; border-left:4px solid ${color}; padding:1rem; border-radius:8px;">
      <h4 style="margin-bottom:0.5rem; color:${color};">${escapeHTML(title)}</h4>
      <div style="white-space:pre-wrap; color:#1f2937; font-size:0.95rem; line-height:1.5;">${escapeHTML(truncate(text, 2000))}</div>
    </div>
  `;
}
function truncate(s, max) { if (!s) return ''; return s.length > max ? s.slice(0, max) + '\n…' : s; }

/////////////////////////////
// Bootstrap
/////////////////////////////
window.app = new PharmAssistApp();
DebugPanel.log('BOOT', 'Script loaded');
