// PharmAssist Pro — RxNav + openFDA powered Drug Info and Interactions
// Live autocomplete/normalization via RxNav; interactions via RxNav; labeling via openFDA.
// RxNav docs: https://rxnav.nlm.nih.gov/REST/  | openFDA: https://api.fda.gov/drug/label/

console.log('🚀 PharmAssist Pro (RxNav + openFDA) loading...');

const RXNAV = {
  suggest: async (query) => {
    const q = encodeURIComponent(query.trim());
    const url1 = `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${q}`;
    const url2 = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${q}`;
    try {
      const [sugRes, drugRes] = await Promise.all([fetch(url1), fetch(url2)]);
      const sugJson = await sugRes.json();
      const drugJson = await drugRes.json();
      const sugList = (sugJson.suggestionGroup?.suggestionList?.suggestion || []);
      const drugConcepts = (drugJson?.drugGroup?.conceptGroup || [])
        .flatMap(g => g?.conceptProperties || [])
        .map(c => c.name)
        .filter(Boolean);
      const merged = [...new Set([...sugList, ...drugConcepts])];
      return merged.slice(0, 25);
    } catch (e) {
      console.error('Suggest error:', e);
      return [];
    }
  },

  normalize: async (name) => {
    const q = encodeURIComponent(name.trim());
    const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${q}&maxEntries=5`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const candidates = json.approximateGroup?.candidate || [];
      if (!candidates.length) return null;
      const best = candidates.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))[0];
      const rxcui = best.rxcui;
      const nameRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}.json`);
      const nameJson = await nameRes.json();
      const props = nameJson.idGroup || {};
      return { rxcui, name: props.name || name };
    } catch (e) {
      console.error('Normalize error:', e);
      return null;
    }
  },

  interactionsForList: async (rxcuis) => {
    const list = encodeURIComponent(rxcuis.join('+'));
    const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${list}`;
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      console.error('Interaction error:', e);
      return null;
    }
  },

  properties: async (rxcui) => {
    try {
      const url = `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`;
      const res = await fetch(url);
      const json = await res.json();
      return json?.properties || null;
    } catch (e) {
      console.error('Properties error:', e);
      return null;
    }
  }
};

// openFDA helper
const OpenFDA = {
  // Try multiple queries to maximize hit rate:
  // 1) exact brand name
  // 2) exact substance (ingredient)
  // 3) free-text search across fields
  // Returns first matching labeling record
  fetchLabel: async (displayName) => {
    const q = displayName.trim();
    const limit = 1;

    const queries = [
      // brand_name exact phrase
      `brand_name:"${escapeFDA(q)}"`,
      // generic/ingredient search by substance_name
      `substance_name:"${escapeFDA(q)}"`,
      // open text search
      q
    ];

    for (const term of queries) {
      const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(term)}&limit=${limit}`;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        if (json?.results?.length) {
          return json.results[0];
        }
      } catch (e) {
        // Continue to next query
      }
    }
    return null;
  },

  // Extract key sections safely
  pickSections: (rec) => {
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
      warnings: pick('warnings') || pick('warnings_and_cautions') || pick('warnings_and_precautions'),
      adverse_reactions: pick('adverse_reactions'),
      patient_counseling: pick('information_for_patients') || pick('patient_counseling_information')
    };
  }
};

// Utility escaping
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function escapeFDA(str) {
  // openFDA Lucene-like query escaping (basic)
  return String(str).replace(/([+\-!(){}\[\]^"~*?:\\/])/g, '\\$1');
}

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
    this.setupTabs();
    this.setupModeToggle();
    this.setupTwoDrugUI();
    this.setupMultiDrugUI();
    this.setupSearchUI();
    console.log('✅ RxNav + openFDA initialized');
  }

  // Tabs
  setupTabs() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
        e.currentTarget.classList.add('active');
        this.currentTab = tab;
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
  }

  // Two-drug UI
  setupTwoDrugUI() {
    this.setupSuggestInput('drug1', 'suggestions1', (choice) => { this.twoDrug.a = choice; });
    this.setupSuggestInput('drug2', 'suggestions2', (choice) => { this.twoDrug.b = choice; });
    document.getElementById('checkInteraction').addEventListener('click', async () => {
      await this.checkTwoDrugInteraction();
    });
  }

  async checkTwoDrugInteraction() {
    const aVal = document.getElementById('drug1').value.trim();
    const bVal = document.getElementById('drug2').value.trim();
    if (!aVal || !bVal) return alert('Please enter both drugs.');

    const a = this.twoDrug.a?.name?.toLowerCase() === aVal.toLowerCase() ? this.twoDrug.a : await RXNAV.normalize(aVal);
    const b = this.twoDrug.b?.name?.toLowerCase() === bVal.toLowerCase() ? this.twoDrug.b : await RXNAV.normalize(bVal);
    if (!a || !b) return alert('Could not resolve one or both drugs. Please select from suggestions.');

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
    if (!interactions.length) {
      container.innerHTML = this.noInteractionHTML(a.name, b.name);
    } else {
      const order = { major: 3, moderate: 2, minor: 1, unknown: 0 };
      interactions.sort((x, y) => order[y.severity] - order[x.severity]);
      const cards = interactions.map(i => `
        <div class="interaction-result ${i.severity}">
          <div class="severity-badge ${i.severity}">${i.severity.toUpperCase()}</div>
          <h3>${escapeHTML(a.name)} + ${escapeHTML(b.name)}</h3>
          <div style="margin-top: 0.75rem;"><p>${escapeHTML(i.description)}</p></div>
          ${i.sources?.length ? `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #555;">Sources: ${i.sources.join(', ')}</div>` : ''}
        </div>
      `).join('');
      container.innerHTML = cards;
    }
    container.style.display = 'block';
  }

  noInteractionHTML(a, b) {
    return `
      <div class="interaction-result">
        <div class="severity-badge minor">NO KNOWN MAJOR INTERACTION</div>
        <h3>${escapeHTML(a)} + ${escapeHTML(b)}</h3>
        <p>No major interaction found via RxNav dataset. Always verify with current clinical resources.</p>
      </div>
    `;
  }

  // Multi-drug
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
  }

  clearAllDrugs() {
    document.getElementById('drugList').innerHTML = '';
    document.getElementById('multiInteractionResults').innerHTML = '';
    document.getElementById('resultsSummary').style.display = 'none';
    this.drugCounter = 0;
    this.multiDrugs = [];
    this.addDrugInput();
    this.addDrugInput();
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
    const uniqByCui = [];
    const seen = new Set();
    for (const s of selected) {
      if (!seen.has(s.rxcui)) { seen.add(s.rxcui); uniqByCui.push(s); }
    }
    if (uniqByCui.length < 2) return alert('Please enter at least 2 distinct drugs.');

    this.showLoading();
    const json = await RXNAV.interactionsForList(uniqByCui.map(x => x.rxcui));
    this.hideLoading();
    this.renderMultiResults(json, uniqByCui);
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
              ${p.source?.length ? `
              <div class="interaction-meta">
                <div><strong>Sources:</strong> ${p.source.map(s => s.name).join(', ')}</div>
              </div>` : ``}
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

  // Drug Info (RxNav + openFDA)
  setupSearchUI() {
    document.getElementById('searchDrug').addEventListener('click', () => this.searchDrugInfo());
    document.getElementById('drugSearch').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchDrugInfo();
    });
  }

  async searchDrugInfo() {
    const q = document.getElementById('drugSearch').value.trim();
    if (!q) return alert('Enter a drug name');

    this.showLoading();
    const norm = await RXNAV.normalize(q);
    let props = null;
    let label = null;

    if (norm) {
      props = await RXNAV.properties(norm.rxcui);
      // Try openFDA with RxNav preferred name first; fallback to user input
      label = await OpenFDA.fetchLabel(props?.name || norm.name || q) || await OpenFDA.fetchLabel(q);
    }
    this.hideLoading();

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
          <p>openFDA labeling was not available for this term. Try alternative brand or generic names.</p>
        </div>`}
      </div>
    `;
  }

  // Generic suggestion input
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
      if (q.length < 1) {
        box.style.display = 'none';
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const suggestions = await fetchSuggestions(q);
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

        if (!filtered.length) {
          box.style.display = 'none';
          return;
        }

        box.innerHTML = filtered.map(name => `<div class="suggestion-item" data-name="${escapeHTML(name)}">${escapeHTML(name)}</div>`).join('');
        box.style.display = 'block';

        box.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', async () => {
            const name = item.getAttribute('data-name');
            input.value = name;
            box.style.display = 'none';
            const norm = await RXNAV.normalize(name);
            if (norm && onChoice) onChoice(norm);
          });
        });
      }, 150);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.input-group')) box.style.display = 'none';
    });
  }

  showLoading() { document.getElementById('loadingOverlay')?.classList.add('show'); }
  hideLoading() { document.getElementById('loadingOverlay')?.classList.remove('show'); }
}

// Section card helper for labeling blocks
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

function truncate(s, max) {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + '\n…' : s;
}

// Expose for remove button
window.app = new PharmAssistApp();
