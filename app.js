// Enhanced PharmAssist App with Working Autocomplete
console.log('🚀 Loading Enhanced PharmAssist App...');

class PharmAssistApp {
  constructor() {
    console.log('📱 PharmAssist constructor called');
    this.currentTab = 'interactions';
    this.drugSuggestions = window.DRUG_DATABASE ? Object.keys(window.DRUG_DATABASE) : [];
    this.drugCounter = 0;
    this.currentMode = 'two';
    
    setTimeout(() => {
      this.init();
    }, 100);
  }

  init() {
    console.log('🔧 Initializing app...');
    this.setupEventListeners();
    this.loadResourcesContent();
    this.setupDrugSuggestions();
    console.log('✅ App initialized successfully!');
    console.log('📊 Loaded', this.drugSuggestions.length, 'drugs in database');
  }

  setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.closest('.nav-btn').dataset.tab;
        this.switchTab(tab);
      });
    });

    // Mode toggle buttons
    const twoModeBtn = document.getElementById('twoModeBtn');
    const multiModeBtn = document.getElementById('multiModeBtn');
    
    if (twoModeBtn) {
      twoModeBtn.addEventListener('click', () => {
        console.log('🔵 Two mode clicked!');
        this.switchMode('two');
      });
    }

    if (multiModeBtn) {
      multiModeBtn.addEventListener('click', () => {
        console.log('🟢 Multi mode clicked!');
        this.switchMode('multi');
      });
    }

    // Other buttons
    const checkBtn = document.getElementById('checkInteraction');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => this.checkInteraction());
    }

    const addBtn = document.getElementById('addDrugBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addDrugInput());
    }

    const checkAllBtn = document.getElementById('checkAllInteractions');
    if (checkAllBtn) {
      checkAllBtn.addEventListener('click', () => this.checkAllInteractions());
    }

    const clearBtn = document.getElementById('clearAllDrugs');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllDrugs());
    }

    // Quick buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.dataset.combo) {
          const [drug1, drug2] = e.target.dataset.combo.split(',');
          this.switchMode('two');
          setTimeout(() => {
            const d1 = document.getElementById('drug1');
            const d2 = document.getElementById('drug2');
            if (d1) d1.value = drug1;
            if (d2) d2.value = drug2;
            this.checkInteraction();
          }, 100);
        } else if (e.target.dataset.regimen) {
          const regimen = e.target.dataset.regimen.split(',');
          this.switchMode('multi');
          setTimeout(() => {
            this.loadRegimen(regimen);
          }, 100);
        }
      });
    });

    const searchBtn = document.getElementById('searchDrug');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.searchDrugInfo());
    }

    const drugSearchInput = document.getElementById('drugSearch');
    if (drugSearchInput) {
      drugSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchDrugInfo();
      });
    }
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabName);
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedBtn) selectedBtn.classList.add('active');
    
    this.currentTab = tabName;
  }

  switchMode(mode) {
    console.log('🔄 SWITCHING MODE TO:', mode);
    this.currentMode = mode;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.mode-interface').forEach(interfaceEl => {
      interfaceEl.classList.remove('active');
    });
    
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
      
      if (this.drugCounter === 0) {
        this.addDrugInput();
        this.addDrugInput();
      }
    }
  }

  // FIXED: Enhanced drug suggestions with proper autocomplete
  setupDrugSuggestions() {
    const setupSuggestion = (inputId, suggestionId) => {
      const input = document.getElementById(inputId);
      const suggestionDiv = document.getElementById(suggestionId);

      if (!input || !suggestionDiv) return;

      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 1) {
          suggestionDiv.style.display = 'none';
          return;
        }

        // Smart matching: starts with query OR contains query
        const matches = this.drugSuggestions.filter(drug => {
          const drugLower = drug.toLowerCase();
          return drugLower.startsWith(query) || drugLower.includes(query);
        }).sort((a, b) => {
          // Prioritize starts-with matches
          const aStarts = a.toLowerCase().startsWith(query);
          const bStarts = b.toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        }).slice(0, 8);

        if (matches.length > 0) {
          suggestionDiv.innerHTML = matches.map(drug => 
            `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${drug}')">${drug}</div>`
          ).join('');
          suggestionDiv.style.display = 'block';
        } else {
          suggestionDiv.style.display = 'none';
        }
      });

      input.addEventListener('focus', (e) => {
        if (e.target.value.length >= 1) {
          e.target.dispatchEvent(new Event('input'));
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

  addDrugInput() {
    this.drugCounter++;
    const drugList = document.getElementById('drugList');
    
    if (!drugList) return;
    
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

  setupMultiSuggestions(inputId, suggestionId) {
    const input = document.getElementById(inputId);
    const suggestionDiv = document.getElementById(suggestionId);

    if (!input || !suggestionDiv) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 1) {
        suggestionDiv.style.display = 'none';
        return;
      }

      const matches = this.drugSuggestions.filter(drug => {
        const drugLower = drug.toLowerCase();
        return drugLower.startsWith(query) || drugLower.includes(query);
      }).sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      }).slice(0, 8);

      if (matches.length > 0) {
        suggestionDiv.innerHTML = matches.map(drug => 
          `<div class="suggestion-item" onclick="selectMultiSuggestion('${inputId}', '${drug}')">${drug}</div>`
        ).join('');
        suggestionDiv.style.display = 'block';
      } else {
        suggestionDiv.style.display = 'none';
      }
    });

    input.addEventListener('focus', (e) => {
      if (e.target.value.length >= 1) {
        e.target.dispatchEvent(new Event('input'));
      }
    });
  }

  // FIXED: Case-insensitive interaction finding
  findInteraction(drug1, drug2) {
    if (!window.DRUG_INTERACTIONS) return null;
    
    const drug1Lower = drug1.toLowerCase();
    const drug2Lower = drug2.toLowerCase();
    
    return window.DRUG_INTERACTIONS.find(interaction => 
      (interaction.drug1.toLowerCase() === drug1Lower && interaction.drug2.toLowerCase() === drug2Lower) ||
      (interaction.drug1.toLowerCase() === drug2Lower && interaction.drug2.toLowerCase() === drug1Lower)
    );
  }

  // Enhanced search with better drug info display
  searchDrugInfo() {
    const queryInput = document.getElementById('drugSearch');
    if (!queryInput) return;

    const query = queryInput.value.trim().toLowerCase();
    if (!query) {
      alert('Please enter a drug name');
      return;
    }

    this.showLoading();
    setTimeout(() => {
      const drugInfo = window.DRUG_DATABASE ? window.DRUG_DATABASE[query] : null;
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
          <p>Information for "${this.capitalize(query)}" is not available in our current database.</p>
          <p><strong>Available drugs include:</strong> ${this.drugSuggestions.slice(0, 10).join(', ')}, and many more...</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: var(--shadow-lg);">
        <div style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
          <h2 style="color: var(--primary); margin-bottom: 0.5rem;">${drugInfo.genericName}</h2>
          <div style="margin-bottom: 0.5rem;">
            <strong>Brand Names:</strong> ${drugInfo.brandNames.join(', ')}
          </div>
          <div>
            <strong>Class:</strong> ${drugInfo.drugClass}
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div>
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-clipboard-list"></i> Indications</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.indications.map(indication => `<li>${indication}</li>`).join('')}
            </ul>
          </div>
          
          <div>
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-cog"></i> Mechanism</h3>
            <p>${drugInfo.mechanism}</p>
          </div>
          
          <div>
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-pills"></i> Dosing</h3>
            <p><strong>Adult:</strong> ${drugInfo.dosing.adult}</p>
            <p><strong>Elderly:</strong> ${drugInfo.dosing.elderly}</p>
          </div>
          
          <div>
            <h3 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Warnings</h3>
            <ul style="margin-left: 1rem;">
              ${drugInfo.warnings.map(warning => `<li>${warning}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  loadResourcesContent() {
    console.log('📚 Loading resources...');
    
    // Emergency drugs
    const emergencyEl = document.getElementById('emergencyDrugs');
    if (emergencyEl && window.EMERGENCY_DRUGS) {
      emergencyEl.innerHTML = window.EMERGENCY_DRUGS.map(drug => `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
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
    if (controlledEl && window.CONTROLLED_SUBSTANCES) {
      controlledEl.innerHTML = Object.entries(window.CONTROLLED_SUBSTANCES).map(([schedule, info]) => `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
          <h4 style="color: var(--primary); margin-bottom: 0.5rem;">Schedule ${schedule}</h4>
          <p>${info.description}</p>
          <p><strong>Examples:</strong> ${info.examples.join(', ')}</p>
          <p><strong>Prescribing:</strong> ${info.prescribing}</p>
        </div>
      `).join('');
    }

    // Black box warnings
    const blackBoxEl = document.getElementById('blackBoxWarnings');
    if (blackBoxEl && window.BLACK_BOX_WARNINGS) {
      blackBoxEl.innerHTML = window.BLACK_BOX_WARNINGS.map(item => `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--light); border-radius: 8px;">
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
        <div style="padding: 1rem; background: var(--light); border-radius: 8px;">
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

  // Rest of the methods remain the same...
  removeDrugInput(drugId) {
    const drugItem = document.querySelector(`[data-drug-id="${drugId}"]`);
    if (drugItem) drugItem.remove();
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
      if (value) drugs.push(value);
    });
    
    return drugs;
  }

  checkInteraction() {
    const drug1Input = document.getElementById('drug1');
    const drug2Input = document.getElementById('drug2');
    const resultsContainer = document.getElementById('interactionResults');

    if (!drug1Input || !drug2Input) return;

    const drug1 = drug1Input.value.trim().toLowerCase();
    const drug2 = drug2Input.value.trim().toLowerCase();

    if (!drug1 || !drug2) {
      alert('Please enter both drugs');
      return;
    }

    if (drug1 === drug2) {
      alert('Please enter two different drugs');
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
      alert('Please enter at least 2 drugs');
      return;
    }

    const uniqueDrugs = [...new Set(drugs)];
    if (uniqueDrugs.length < drugs.length) {
      alert('Please remove duplicate drugs');
      return;
    }

    this.showLoading();

    setTimeout(() => {
      const interactions = this.findAllInteractions(uniqueDrugs);
      this.hideLoading();
      this.displayMultiResults(interactions, uniqueDrugs);
    }, 1500);
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
          <p>No major interactions detected between the ${drugs.length} medications in our database.</p>
          <p><em>Continue routine monitoring and patient assessment. Always verify with current clinical resources.</em></p>
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

  showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.classList.add('show');
  }

  hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.classList.remove('show');
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Calculation functions (keep existing)
function calculateCrCl() {
  const age = parse
