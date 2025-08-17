class PharmAssistApp {
  constructor() {
    this.currentTab = 'interactions';
    this.drugSuggestions = Object.keys(DRUG_DATABASE);
    this.drugCounter = 0;
    this.currentMode = 'two';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadResourcesContent();
    this.setupDrugSuggestions();
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.closest('.nav-btn').dataset.tab;
        this.switchTab(tab);
      });
    });

    // Mode toggle - Check if elements exist first
    const twoModeBtn = document.getElementById('twoModeBtn');
    const multiModeBtn = document.getElementById('multiModeBtn');
    
    if (twoModeBtn) {
      twoModeBtn.addEventListener('click', () => {
        this.switchMode('two');
      });
    }

    if (multiModeBtn) {
      multiModeBtn.addEventListener('click', () => {
        this.switchMode('multi');
      });
    }

    // Original interaction checker
    const checkInteractionBtn = document.getElementById('checkInteraction');
    if (checkInteractionBtn) {
      checkInteractionBtn.addEventListener('click', () => {
        this.checkInteraction();
      });
    }

    // Multi-drug functionality
    const addDrugBtn = document.getElementById('addDrugBtn');
    if (addDrugBtn) {
      addDrugBtn.addEventListener('click', () => {
        this.addDrugInput();
      });
    }

    const checkAllBtn = document.getElementById('checkAllInteractions');
    if (checkAllBtn) {
      checkAllBtn.addEventListener('click', () => {
        this.checkAllInteractions();
      });
    }

    const clearAllBtn = document.getElementById('clearAllDrugs');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.clearAllDrugs();
      });
    }

    // Quick interaction checks
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.dataset.combo) {
          // 2-drug combo
          const [drug1, drug2] = e.target.dataset.combo.split(',');
          this.switchMode('two');
          document.getElementById('drug1').value = drug1;
          document.getElementById('drug2').value = drug2;
          this.checkInteraction();
        } else if (e.target.dataset.regimen) {
          // Multi-drug regimen
          const regimen = e.target.dataset.regimen.split(',');
          this.switchMode('multi');
          this.loadRegimen(regimen);
        }
      });
    });

    // Drug search
    const searchBtn = document.getElementById('searchDrug');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.searchDrugInfo();
      });
    }

    const drugSearchInput = document.getElementById('drugSearch');
    if (drugSearchInput) {
      drugSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.searchDrugInfo();
        }
      });
    }
  }

  switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedBtn) selectedBtn.classList.add('active');
    
    this.currentTab = tabName;
  }

  switchMode(mode) {
    console.log('Switching to mode:', mode); // Debug log
    this.currentMode = mode;
    
    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-interface').forEach(interface => interface.classList.remove('active'));
    
    if (mode === 'two') {
      const twoBtn = document.getElementById('twoModeBtn');
      const twoInterface = document.getElementById('twoModeInterface');
      
      if (twoBtn) twoBtn.classList.add('active');
      if (twoInterface) twoInterface.classList.add('active');
      
      this.setupDrugSuggestions();
    } else {
      const multiBtn = document.getElementById('multiModeBtn');
      const multiInterface = document.getElementById('multiModeInterface');
      
      if (multiBtn) multiBtn.classList.add('active');
      if (multiInterface) multiInterface.classList.add('active');
      
      // Add initial drugs if none exist
      if (this.drugCounter === 0) {
        this.addDrugInput();
        this.addDrugInput();
      }
    }
  }

  addDrugInput() {
    this.drugCounter++;
    const drugList = document.getElementById('drugList');
    
    if (!drugList) {
      console.error('Drug list container not found');
      return;
    }
    
    const drugItem = document.createElement('div');
    drugItem.className = 'drug-item';
    drugItem.dataset.drugId = this.drugCounter;
    
    drugItem.innerHTML = `
      <div class="drug-number">${this.drugCounter}</div>
      <div class="input-group">
        <input type="text" 
               placeholder="Enter drug name..." 
               id="multiDrug_${this.drugCounter}"
               autocomplete="off">
        <div class="suggestions" id="multiSuggestions_${this.drugCounter}"></div>
      </div>
      <button class="remove-drug" onclick="app.removeDrugInput(${this.drugCounter})">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    drugList.appendChild(drugItem);
    this.setupMultiSuggestions(`multiDrug_${this.drugCounter}`, `multiSuggestions_${this.drugCounter}`);
  }

  removeDrugInput(drugId) {
    const drugItem = document.querySelector(`[data-drug-id="${drugId}"]`);
    if (drugItem) {
      drugItem.remove();
    }
    this.renumberDrugs();
  }

  renumberDrugs() {
    const drugItems = document.querySelectorAll('.drug-item');
    drugItems.forEach((item, index) => {
      const number = index + 1;
      const numberDiv = item.querySelector('.drug-number');
      if (numberDiv) numberDiv.textContent = number;
    });
  }

  clearAllDrugs() {
    const drugList = document.getElementById('drugList');
    const resultsContainer = document.getElementById('multiInteractionResults');
    const summary = document.getElementById('resultsSummary');
    
    if (drugList) drugList.innerHTML = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (summary) summary.style.display = 'none';
    
    this.drugCounter = 0;
    this.addDrugInput();
    this.addDrugInput();
  }

  loadRegimen(drugs) {
    this.clearAllDrugs();
    
    drugs.forEach(drug => {
      this.addDrugInput();
      const inputs = document.querySelectorAll('#drugList input');
      const lastInput = inputs[inputs.length - 1];
      if (lastInput) lastInput.value = drug.trim();
    });
  }

  getAllDrugs() {
    const inputs = document.querySelectorAll('#drugList input');
    const drugs = [];
    
    inputs.forEach(input => {
      const value = input.value.trim().toLowerCase();
      if (value) {
        drugs.push(value);
      }
    });
    
    return drugs;
  }

  checkInteraction() {
    const drug1Input = document.getElementById('drug1');
    const drug2Input = document.getElementById('drug2');
    const resultsContainer = document.getElementById('interactionResults');

    if (!drug1Input || !drug2Input) {
      console.error('Drug input elements not found');
      return;
    }

    const drug1 = drug1Input.value.trim().toLowerCase();
    const drug2 = drug2Input.value.trim().toLowerCase();

    if (!drug1 || !drug2) {
      this.showError('Please enter both drugs');
      return;
    }

    if (drug1 === drug2) {
      this.showError('Please enter two different drugs');
      return;
    }

    this.showLoading();

    setTimeout(() => {
      const interaction = this.findInteraction(drug1, drug2);
      this.hideLoading();
      this.displayInteractionResults(interaction, drug1, drug2);
      if (resultsContainer) resultsContainer.style.display = 'block';
    }, 1000);
  }

  checkAllInteractions() {
    const drugs = this.getAllDrugs();
    
    if (drugs.length < 2) {
      this.showError('Please enter at least 2 drugs');
      return;
    }

    const uniqueDrugs = [...new Set(drugs)];
    if (uniqueDrugs.length < drugs.length) {
      this.showError('Please remove duplicate drugs');
      return;
    }

    this.showLoading();

    setTimeout(() => {
      const interactions = this.findAllInteractions(uniqueDrugs);
      this.hideLoading();
      this.displayMultiResults(interactions, uniqueDrugs);
    }, 1500);
  }

  findInteraction(drug1, drug2) {
    return DRUG_INTERACTIONS.find(interaction => 
      (interaction.drug1 === drug1 && interaction.drug2 === drug2) ||
      (interaction.drug1 === drug2 && interaction.drug2 === drug1)
    );
  }

  findAllInteractions(drugs) {
    const interactions = [];
    
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const interaction = this.findInteraction(drugs[i], drugs[j]);
        if (interaction) {
          interactions.push({
            ...interaction,
            drug1Display: this.capitalize(drugs[i]),
            drug2Display: this.capitalize(drugs[j])
          });
        }
      }
    }
    
    return interactions.sort((a, b) => {
      const severityOrder = { major: 3, moderate: 2, minor: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  displayInteractionResults(interaction, drug1, drug2) {
    const resultsContainer = document.getElementById('interactionResults');
    
    if (!resultsContainer) return;
    
    if (!interaction) {
      resultsContainer.innerHTML = `
        <div class="interaction-result">
          <div class="severity-badge minor">No Known Interaction</div>
          <h3>${this.capitalize(drug1)} + ${this.capitalize(drug2)}</h3>
          <p>No major interaction found in our database. However, always consult comprehensive resources and monitor patients for unexpected effects.</p>
          <p><strong>Recommendation:</strong> Continue routine monitoring and patient assessment.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="interaction-result ${interaction.severity}">
        <div class="severity-badge ${interaction.severity}">${interaction.severity.toUpperCase()}</div>
        <h3>${this.capitalize(interaction.drug1)} + ${this.capitalize(interaction.drug2)}</h3>
        
        <div style="margin: 1.5rem 0;">
          <h4><i class="fas fa-cogs"></i> Mechanism:</h4>
          <p>${interaction.mechanism}</p>
        </div>

        <div style="margin: 1.5rem 0;">
          <h4><i class="fas fa-exclamation-triangle"></i> Clinical Effect:</h4>
          <p>${interaction.clinicalEffect}</p>
        </div>

        <div style="margin: 1.5rem 0;">
          <h4><i class="fas fa-user-md"></i> Management:</h4>
          <p>${interaction.management}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; font-size: 0.9rem; color: #666;">
          <div><strong>Onset:</strong> ${interaction.onset}</div>
          <div><strong>Documentation:</strong> ${interaction.documentation}</div>
        </div>
      </div>
    `;
  }

  displayMultiResults(interactions, drugs) {
    const resultsContainer = document.getElementById('multiInteractionResults');
    const resultsSummary = document.getElementById('resultsSummary');
    
    if (!resultsContainer || !resultsSummary) return;
    
    const majorCount = interactions.filter(i => i.severity === 'major').length;
    
    const totalDrugsEl = document.getElementById('totalDrugs');
    const totalInteractionsEl = document.getElementById('totalInteractions');
    const majorInteractionsEl = document.getElementById('majorInteractions');
    
    if (totalDrugsEl) totalDrugsEl.textContent = drugs.length;
    if (totalInteractionsEl) totalInteractionsEl.textContent = interactions.length;
    if (majorInteractionsEl) majorInteractionsEl.textContent = majorCount;
    
    resultsSummary.style.display = 'block';
    
    if (interactions.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-interactions">
          <i class="fas fa-check-circle"></i>
          <h3>No Significant Interactions Found</h3>
          <p>No major interactions detected between the ${drugs.length} medications.</p>
          <p><em>Continue routine monitoring and patient assessment.</em></p>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = interactions.map(interaction => `
        <div class="interaction-pair ${interaction.severity}">
          <div class="pair-header">
            <div class="drug-pair">
              ${interaction.drug1Display} <i class="fas fa-exchange-alt" style="color: var(--primary);"></i> ${interaction.drug2Display}
            </div>
            <div class="severity-badge ${interaction.severity}">${interaction.severity.toUpperCase()}</div>
          </div>
          
          <div class="interaction-details">
            <h4><i class="fas fa-cogs"></i> Mechanism</h4>
            <p>${interaction.mechanism}</p>
          </div>

          <div class="interaction-details">
            <h4><i class="fas fa-exclamation-triangle"></i> Clinical Effect</h4>
            <p>${interaction.clinicalEffect}</p>
          </div>

          <div class="interaction-details">
            <h4><i class="fas fa-user-md"></i> Management</h4>
            <p>${interaction.management}</p>
          </div>

          <div class="interaction-meta">
            <div><strong>Onset:</strong> ${interaction.onset}</div>
            <div><strong>Documentation:</strong> ${interaction.documentation}</div>
          </div>
        </div>
      `).join('');
    }
    
    resultsContainer.style.display = 'block';
    resultsSummary.scrollIntoView({ behavior: 'smooth' });
  }

  setupDrugSuggestions() {
    const setupSuggestion = (inputId, suggestionId) => {
      const input = document.getElementById(inputId);
      const suggestionDiv = document.getElementById(suggestionId);

      if (!input || !suggestionDiv) return;

      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
          suggestionDiv.style.display = 'none';
          return;
        }

        const matches = this.drugSuggestions.filter(drug => 
          drug.toLowerCase().includes(query)
        ).slice(0, 5);

        if (matches.length > 0) {
          suggestionDiv.innerHTML = matches.map(drug => 
            `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${drug}')">${drug}</div>`
          ).join('');
          suggestionDiv.style.display = 'block';
        } else {
          suggestionDiv.style.display = 'none';
        }
      });

      // Hide suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-group')) {
          suggestionDiv.style.display = 'none';
        }
      });
    };

    setupSuggestion('drug1', 'suggestions1');
    setupSuggestion('drug2', 'suggestions2');
  }

  setupMultiSuggestions(inputId, suggestionId) {
    const input = document.getElementById(inputId);
    const suggestionDiv = document.getElementById(suggestionId);

    if (!input || !suggestionDiv) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) {
        suggestionDiv.style.display = 'none';
        return;
      }

      const matches = this.drugSuggestions.filter(drug => 
        drug.toLowerCase().includes(query)
      ).slice(0, 5);

      if (matches.length > 0) {
        suggestionDiv.innerHTML = matches.map(drug => 
          `<div class="suggestion-item" onclick="selectMultiSuggestion('${inputId}', '${drug}')">${drug}</div>`
        ).join('');
        suggestionDiv.style.display = 'block';
      } else {
        suggestionDiv.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest(`#${inputId}`) && !e.target.closest(`#${suggestionId}`)) {
        suggestionDiv.style.display = 'none';
      }
    });
  }

  searchDrugInfo() {
    const queryInput = document.getElementById('drugSearch');
    const resultsContainer = document.getElementById('drugInfoResults');

    if (!queryInput) return;

    const query = queryInput.value.trim().toLowerCase();

    if (!query) {
      this.showError('Please enter a drug name');
      return;
    }

    this.showLoading();

    setTimeout(() => {
      const drugInfo = DRUG_DATABASE[query];
      this.hideLoading();
      this.displayDrugInfo(drugInfo, query);
    }, 800);
  }

  displayDrugInfo(drugInfo, query) {
    const resultsContainer = document.getElementById('drugInfoResults');

    if (!resultsContainer) return;

    if (!drugInfo) {
      resultsContainer.innerHTML = `
        <div class="interaction-result">
          <h3>Drug information not found</h3>
          <p>Information for "${this.capitalize(query)}" is not available in our current database. Please consult comprehensive drug references.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="drug-info-card" style="background: white; padding: 2rem; border-radius: 16px; box-shadow: var(--shadow-lg);">
        <div class="drug-header" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
          <h2 style="color: var(--primary); margin-bottom: 0.5rem;">${drugInfo.genericName}</h2>
          <div class="brand-names" style="margin-bottom: 0.5rem;">
            <strong>Brand Names:</strong> ${drugInfo.brandNames.join(', ')}
          </div>
          <div class="drug-class">
            <strong>Class:</strong> ${drugInfo.drugClass}
          </div>
        </div>

        <div class="drug-content">
          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-clipboard-list"></i> Indications</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.indications.map(indication => `<li>${indication}</li>`).join('')}
            </ul>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-cog"></i> Mechanism of Action</h3>
            <p>${drugInfo.mechanism}</p>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-pills"></i> Dosing</h3>
            <div class="dosing-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div><strong>Adult:</strong> ${drugInfo.dosing.adult}</div>
              <div><strong>Elderly:</strong> ${drugInfo.dosing.elderly}</div>
              <div><strong>Renal:</strong> ${drugInfo.dosing.renal}</div>
              <div><strong>Hepatic:</strong> ${drugInfo.dosing.hepatic}</div>
            </div>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-chart-line"></i> Monitoring</h3>
            <p>${drugInfo.monitoring}</p>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-ban"></i> Contraindications</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.contraindications.map(ci => `<li>${ci}</li>`).join('')}
            </ul>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Warnings & Precautions</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.warnings.map(warning => `<li>${warning}</li>`).join('')}
            </ul>
          </div>

          <div class="drug-section" style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-sad-tear"></i> Adverse Effects</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.adverseEffects.map(ae => `<li>${ae}</li>`).join('')}
            </ul>
          </div>

          <div class="drug-section">
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-comments"></i> Patient Counseling</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.counseling.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  loadResourcesContent() {
    // Emergency drugs
    const emergencyEl = document.getElementById('emergencyDrugs');
    if (emergencyEl) {
      emergencyEl.innerHTML = EMERGENCY_DRUGS.map(drug => `
        <div class="resource-item" style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
          <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${drug.drug}</h4>
          <p><strong>Indication:</strong> ${drug.indication}</p>
          <p><strong>Dose:</strong> ${drug.dose}</p>
          <p><strong>Route:</strong> ${drug.route}</p>
          <p><strong>Notes:</strong> ${drug.notes}</p>
        </div>
      `).join('');
    }

    // Controlled substances
    const controlledEl = document.getElementById('controlledSubstances');
    if (controlledEl) {
      controlledEl.innerHTML = Object.entries(CONTROLLED_SUBSTANCES).map(([schedule, info]) => `
        <div class="resource-item" style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
          <h4 style="color: var(--primary); margin-bottom: 0.5rem;">Schedule ${schedule}</h4>
          <p>${info.description}</p>
          <p><strong>Examples:</strong> ${info.examples.join(', ')}</p>
          <p><strong>Prescribing:</strong> ${info.prescribing}</p>
        </div>
      `).join('');
    }

    // Black box warnings
    const blackBoxEl = document.getElementById('blackBoxWarnings');
    if (blackBoxEl) {
      blackBoxEl.innerHTML = BLACK_BOX_WARNINGS.map(item => `
        <div class="resource-item" style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
          <h4 style="color: var(--danger); margin-bottom: 0.5rem;">${item.drug}</h4>
          <p><strong>${item.warning}</strong></p>
          <p>${item.description}</p>
        </div>
      `).join('');
    }

    // Vaccine schedule
    const vaccineEl = document.getElementById('vaccineSchedule');
    if (vaccineEl) {
      vaccineEl.innerHTML = `
        <div class="resource-item" style="padding: 1rem; background: var(--light); border-radius: 8px;">
          <h4 style="color: var(--primary); margin-bottom: 1rem;">Adult Routine Vaccinations</h4>
          <ul style="margin-left: 1rem; line-height: 1.6;">
            <li><strong>Influenza:</strong> Annual for all adults ≥6 months</li>
            <li><strong>Td/Tdap:</strong> Every 10 years</li>
            <li><strong>MMR:</strong> If no evidence of immunity</li>
            <li><strong>Varicella:</strong> If no evidence of immunity</li>
            <li><strong>Zoster:</strong> ≥50 years (Shingrix preferred)</li>
            <li><strong>Pneumococcal:</strong> ≥65 years or high-risk conditions</li>
            <li><strong>HPV:</strong> Through age 26 (catch-up to 45)</li>
            <li><strong>Hepatitis B:</strong> High-risk adults</li>
          </ul>
        </div>
      `;
    }
  }

  showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.classList.add('show');
  }

  hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.classList.remove('show');
  }

  showError(message) {
    alert(message);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Calculation functions
function calculateCrCl() {
  const age = parseFloat(document.getElementById('age').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const serum_cr = parseFloat(document.getElementById('serum_cr').value);
  const gender = document.getElementById('gender').value;

  if (!age || !weight || !serum_cr) {
    alert('Please fill in all fields');
    return;
  }

  let crcl = ((140 - age) * weight) / (72 * serum_cr);
  if (gender === 'female') {
    crcl *= 0.85;
  }

  const result = document.getElementById('crclResult');
  result.innerHTML = `
    <strong>Creatinine Clearance: ${crcl.toFixed(1)} mL/min</strong><br>
    <em>Normal: >90 mL/min (young adult)</em><br>
    <small>Formula: Cockcroft-Gault equation</small>
  `;
  result.classList.add('show');
}

function convertDose() {
  const dose = parseFloat(document.getElementById('dose').value);
  const fromUnit = document.getElementById('fromUnit').value;
  const toUnit = document.getElementById('toUnit').value;

  if (!dose) {
    alert('Please enter a dose');
    return;
  }

  const conversions = {
    'mg': 1,
    'g': 1000,
    'mcg': 0.001,
    'mEq': 1
  };

  const baseValue = dose * conversions[fromUnit];
  const convertedValue = baseValue / conversions[toUnit];

  const result = document.getElementById('conversionResult');
  result.innerHTML = `
    <strong>${dose} ${fromUnit} = ${convertedValue} ${toUnit}</strong>
  `;
  result.classList.add('show');
}

function calculateFlowRate() {
  const volume = parseFloat(document.getElementById('volume').value);
  const time = parseFloat(document.getElementById('time').value);
  const dropFactor = parseFloat(document.getElementById('dropFactor').value);

  if (!volume || !time || !dropFactor) {
    alert('Please fill in all fields');
    return;
  }

  const mlPerHour = volume / time;
  const dropsPerMinute = (mlPerHour * dropFactor) / 60;

  const result = document.getElementById('flowRateResult');
  result.innerHTML = `
    <strong>Flow Rate:</strong><br>
    ${mlPerHour.toFixed(1)} mL/hr<br>
    ${dropsPerMinute.toFixed(0)} drops/min
  `;
  result.classList.add('show');
}

function calculateBusiness() {
  const strength = parseFloat(document.getElementById('strength').value);
  const quantity = parseFloat(document.getElementById('quantity').value);
  const desired = parseFloat(document.getElementById('desired').value);

  if (!strength || !quantity || !desired) {
    alert('Please fill in all fields');
    return;
  }

  const stockNeeded = (desired * quantity) / strength;

  const result = document.getElementById('businessResult');
  result.innerHTML = `
    <strong>Stock Solution Needed: ${stockNeeded.toFixed(2)} mL</strong><br>
    <small>To make ${quantity} mL of ${desired}% solution</small>
  `;
  result.classList.add('show');
}

// Global functions for suggestions
function selectSuggestion(inputId, drugName) {
  const input = document.getElementById(inputId);
  if (input) input.value = drugName;
  
  const suggestionId = inputId.replace('drug', 'suggestions');
  const suggestionDiv = document.getElementById(suggestionId);
  if (suggestionDiv) suggestionDiv.style.display = 'none';
}

function selectMultiSuggestion(inputId, drugName) {
  const input = document.getElementById(inputId);
  if (input) input.value = drugName;
  
  const suggestionId = inputId.replace('multiDrug_', 'multiSuggestions_');
  const suggestionDiv = document.getElementById(suggestionId);
  if (suggestionDiv) suggestionDiv.style.display = 'none';
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  app = new PharmAssistApp();
  console.log('App initialized:', app);
});

// Add debugging
window.addEventListener('load', () => {
  console.log('Window loaded');
  console.log('DRUG_DATABASE available:', typeof DRUG_DATABASE !== 'undefined');
  console.log('DRUG_INTERACTIONS available:', typeof DRUG_INTERACTIONS !== 'undefined');
});
