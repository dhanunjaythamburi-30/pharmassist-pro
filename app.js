// Fixed version without syntax errors
console.log('Loading PharmAssist App...');

let app;

class PharmAssistApp {
  constructor() {
    console.log('PharmAssist constructor called');
    this.currentTab = 'interactions';
    this.drugSuggestions = window.DRUG_DATABASE ? Object.keys(window.DRUG_DATABASE) : ['warfarin', 'amiodarone', 'simvastatin', 'lithium'];
    this.drugCounter = 0;
    this.currentMode = 'two';
    
    setTimeout(() => {
      this.init();
    }, 100);
  }

  init() {
    console.log('Initializing app...');
    this.setupEventListeners();
    this.loadResourcesContent();
    console.log('App initialized successfully!');
  }

  setupEventListeners() {
    console.log('Setting up event listeners...');
    
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
        console.log('Two mode clicked!');
        this.switchMode('two');
      });
    }

    if (multiModeBtn) {
      multiModeBtn.addEventListener('click', () => {
        console.log('Multi mode clicked!');
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
    console.log('SWITCHING MODE TO:', mode);
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
    
    console.log('Mode switch complete:', mode);
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
      </div>
      <button class="remove-drug" onclick="app.removeDrugInput(${this.drugCounter})">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    drugList.appendChild(drugItem);
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
    if (drugList) drugList.innerHTML = '';
    
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

  checkInteraction() {
    alert('Checking interaction... (demo)');
  }

  checkAllInteractions() {
    alert('Checking all interactions... (demo)');
  }

  searchDrugInfo() {
    alert('Searching drug info... (demo)');
  }

  loadResourcesContent() {
    console.log('Loading resources...');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating app...');
  app = new PharmAssistApp();
});

// Calculation functions
function calculateCrCl() {
  alert('Creatinine clearance calculation (demo)');
}

function convertDose() {
  alert('Dose conversion (demo)');
}

function calculateFlowRate() {
  alert('Flow rate calculation (demo)');
}

function calculateBusiness() {
  alert('Business formula calculation (demo)');
}
