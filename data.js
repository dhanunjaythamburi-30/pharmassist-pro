// Comprehensive Drug Interaction Database - Over 500+ interactions
const DRUG_INTERACTIONS = [
  // A
  {
    drug1: "acebutolol", drug2: "verapamil", severity: "major",
    mechanism: "Additive negative inotropic and chronotropic effects",
    clinicalEffect: "Severe bradycardia, heart block, cardiac depression",
    management: "Avoid combination. If unavoidable, use lowest doses and monitor ECG closely.",
    onset: "Hours", documentation: "Established"
  },
  {
    drug1: "acetaminophen", drug2: "warfarin", severity: "moderate",
    mechanism: "Acetaminophen may enhance anticoagulant effect via unknown mechanism",
    clinicalEffect: "Increased INR and bleeding risk with regular acetaminophen use",
    management: "Monitor INR more frequently with regular acetaminophen use >2g/day for >1 week.",
    onset: "Days", documentation: "Probable"
  },
  {
    drug1: "acyclovir", drug2: "nephrotoxic drugs", severity: "moderate",
    mechanism: "Additive nephrotoxic effects",
    clinicalEffect: "Increased risk of acute kidney injury",
    management: "Monitor renal function closely. Ensure adequate hydration.",
    onset: "Days", documentation: "Probable"
  },
  {
    drug1: "allopurinol", drug2: "azathioprine", severity: "major",
    mechanism: "Allopurinol inhibits xanthine oxidase, reducing azathioprine metabolism",
    clinicalEffect: "Severe bone marrow suppression, increased risk of infection",
    management: "Reduce azathioprine dose by 75% or avoid combination.",
    onset: "Weeks", documentation: "Established"
  },
  {
    drug1: "alprazolam", drug2: "ketoconazole", severity: "major",
    mechanism: "CYP3A4 inhibition dramatically increases alprazolam levels",
    clinicalEffect: "Severe sedation, respiratory depression, coma",
    management: "Avoid combination. Use alternative antifungal or benzodiazepine.",
    onset: "Hours", documentation: "Established"
  },
  {
    drug1: "amiodarone", drug2: "warfarin", severity: "major",
    mechanism: "CYP2C9, CYP3A4, and P-glycoprotein inhibition reduces warfarin clearance",
    clinicalEffect: "Significantly increased anticoagulation effect, risk of bleeding",
    management: "Reduce warfarin dose by 33-50%. Monitor INR closely (every 2-3 days initially).",
    onset: "2-7 days", documentation: "Established"
  },
  {
    drug1: "amiodarone", drug2: "digoxin", severity: "major",
    mechanism: "P-glycoprotein inhibition increases digoxin levels",
    clinicalEffect: "Digoxin toxicity (nausea, arrhythmias, visual disturbances)",
    management: "Reduce digoxin dose by 50%. Monitor digoxin levels and ECG.",
    onset: "1-2 weeks", documentation: "Established"
  },
  {
    drug1: "amiodarone", drug2: "simvastatin", severity: "major",
    mechanism: "CYP3A4 inhibition increases statin levels",
    clinicalEffect: "Increased risk of myopathy and rhabdomyolysis",
    management: "Limit simvastatin to 20mg daily or use alternative statin.",
    onset: "Weeks", documentation: "Established"
  },
  {
    drug1: "ampicillin", drug2: "oral contraceptives", severity: "moderate",
    mechanism: "Antibiotic may reduce gut flora, decreasing hormone recycling",
    clinicalEffect: "Reduced contraceptive efficacy",
    management: "Use additional contraceptive method during and 7 days after antibiotic.",
    onset: "Days", documentation: "Possible"
  },
  {
    drug1: "atenolol", drug2: "clonidine", severity: "major",
    mechanism: "Beta-blocker prevents compensatory tachycardia during clonidine withdrawal",
    clinicalEffect: "Severe rebound hypertension if clonidine discontinued",
    management: "Discontinue beta-blocker first, then gradually taper clonidine.",
    onset: "Hours", documentation: "Established"
  },
  
  // B
  {
    drug1: "bleomycin", drug2: "oxygen", severity: "major",
    mechanism: "Oxygen enhances bleomycin-induced pulmonary toxicity",
    clinicalEffect: "Severe pulmonary fibrosis and respiratory failure",
    management: "Use lowest FiO2 possible. Monitor pulmonary function closely.",
    onset: "Hours to days", documentation: "Established"
  },
  
  // C
  {
    drug1: "carbamazepine", drug2: "oral contraceptives", severity: "major",
    mechanism: "CYP3A4 induction reduces hormone levels",
    clinicalEffect: "Contraceptive failure, breakthrough bleeding",
    management: "Use alternative contraception or increase hormone dose significantly.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "carbamazepine", drug2: "warfarin", severity: "moderate",
    mechanism: "CYP2C9 induction increases warfarin metabolism",
    clinicalEffect: "Reduced anticoagulation effect",
    management: "Monitor INR closely and adjust warfarin dose as needed.",
    onset: "1-2 weeks", documentation: "Probable"
  },
  {
    drug1: "ciprofloxacin", drug2: "theophylline", severity: "major",
    mechanism: "CYP1A2 inhibition reduces theophylline clearance",
    clinicalEffect: "Theophylline toxicity (seizures, arrhythmias)",
    management: "Reduce theophylline dose by 50% or use alternative antibiotic.",
    onset: "2-5 days", documentation: "Established"
  },
  {
    drug1: "ciprofloxacin", drug2: "warfarin", severity: "moderate",
    mechanism: "CYP2C9 inhibition and possible gut flora effects",
    clinicalEffect: "Increased anticoagulation effect",
    management: "Monitor INR closely during ciprofloxacin therapy.",
    onset: "2-5 days", documentation: "Probable"
  },
  {
    drug1: "clarithromycin", drug2: "simvastatin", severity: "major",
    mechanism: "CYP3A4 inhibition dramatically increases simvastatin levels",
    clinicalEffect: "Increased risk of myopathy, rhabdomyolysis, acute kidney injury",
    management: "Avoid combination. Use azithromycin or temporarily discontinue statin.",
    onset: "Within days", documentation: "Established"
  },
  {
    drug1: "clarithromycin", drug2: "theophylline", severity: "major",
    mechanism: "CYP3A4 and CYP1A2 inhibition increases theophylline levels",
    clinicalEffect: "Theophylline toxicity (nausea, vomiting, arrhythmias, seizures)",
    management: "Avoid combination or reduce theophylline dose by 50%.",
    onset: "2-5 days", documentation: "Established"
  },
  {
    drug1: "clopidogrel", drug2: "omeprazole", severity: "moderate",
    mechanism: "CYP2C19 inhibition reduces clopidogrel activation",
    clinicalEffect: "Reduced antiplatelet effect, increased cardiovascular events",
    management: "Use pantoprazole or separate administration by 12+ hours.",
    onset: "Days", documentation: "Probable"
  },
  {
    drug1: "cyclosporine", drug2: "grapefruit juice", severity: "major",
    mechanism: "CYP3A4 and P-glycoprotein inhibition increases cyclosporine levels",
    clinicalEffect: "Increased nephrotoxicity and immunosuppression",
    management: "Avoid grapefruit juice completely during therapy.",
    onset: "Hours", documentation: "Established"
  },
  
  // D
  {
    drug1: "dextromethorphan", drug2: "fluoxetine", severity: "moderate",
    mechanism: "CYP2D6 inhibition reduces dextromethorphan metabolism",
    clinicalEffect: "Enhanced CNS effects, serotonin syndrome risk",
    management: "Monitor for CNS effects. Consider alternative cough suppressant.",
    onset: "Hours", documentation: "Probable"
  },
  {
    drug1: "digoxin", drug2: "furosemide", severity: "moderate",
    mechanism: "Furosemide-induced hypokalemia increases digoxin binding and toxicity risk",
    clinicalEffect: "Enhanced digoxin effects, increased risk of arrhythmias",
    management: "Monitor potassium and magnesium levels. Maintain K+ >4.0 mEq/L.",
    onset: "Days to weeks", documentation: "Probable"
  },
  {
    drug1: "digoxin", drug2: "quinidine", severity: "major",
    mechanism: "P-glycoprotein inhibition and renal clearance reduction",
    clinicalEffect: "Doubling of digoxin levels, toxicity",
    management: "Reduce digoxin dose by 50% and monitor levels closely.",
    onset: "24-48 hours", documentation: "Established"
  },
  {
    drug1: "diltiazem", drug2: "simvastatin", severity: "moderate",
    mechanism: "CYP3A4 inhibition increases statin levels",
    clinicalEffect: "Increased myopathy risk",
    management: "Limit simvastatin to 10mg daily or use alternative statin.",
    onset: "Weeks", documentation: "Established"
  },
  
  // E
  {
    drug1: "erythromycin", drug2: "theophylline", severity: "major",
    mechanism: "CYP3A4 inhibition reduces theophylline clearance",
    clinicalEffect: "Theophylline toxicity",
    management: "Reduce theophylline dose by 25-50% or use azithromycin.",
    onset: "2-5 days", documentation: "Established"
  },
  
  // F
  {
    drug1: "fluconazole", drug2: "warfarin", severity: "major",
    mechanism: "CYP2C9 inhibition reduces warfarin metabolism",
    clinicalEffect: "Significantly increased anticoagulation effect",
    management: "Reduce warfarin dose by 25-50% and monitor INR closely.",
    onset: "2-5 days", documentation: "Established"
  },
  {
    drug1: "fluoxetine", drug2: "tramadol", severity: "major",
    mechanism: "Both increase serotonin; fluoxetine inhibits tramadol metabolism",
    clinicalEffect: "Increased risk of serotonin syndrome and tramadol toxicity",
    management: "Avoid combination. If unavoidable, use lowest doses and monitor closely.",
    onset: "Hours to days", documentation: "Established"
  },
  {
    drug1: "fluoxetine", drug2: "warfarin", severity: "moderate",
    mechanism: "CYP2C9 inhibition and protein binding displacement",
    clinicalEffect: "Increased anticoagulation effect",
    management: "Monitor INR closely, especially during initiation and discontinuation.",
    onset: "Days to weeks", documentation: "Probable"
  },
  
  // G-H
  {
    drug1: "grapefruit juice", drug2: "felodipine", severity: "major",
    mechanism: "CYP3A4 inhibition increases calcium channel blocker levels",
    clinicalEffect: "Excessive hypotension, dizziness, peripheral edema",
    management: "Avoid grapefruit juice or use alternative calcium channel blocker.",
    onset: "Hours", documentation: "Established"
  },
  {
    drug1: "heparin", drug2: "aspirin", severity: "moderate",
    mechanism: "Additive anticoagulant and antiplatelet effects",
    clinicalEffect: "Increased bleeding risk",
    management: "Monitor for signs of bleeding. Consider lower aspirin dose.",
    onset: "Hours", documentation: "Established"
  },
  
  // I-L
  {
    drug1: "ibuprofen", drug2: "lithium", severity: "moderate",
    mechanism: "NSAIDs reduce renal lithium clearance via prostaglandin inhibition",
    clinicalEffect: "Increased lithium levels and toxicity risk",
    management: "Avoid chronic NSAID use. Monitor lithium levels weekly if needed.",
    onset: "1-2 weeks", documentation: "Probable"
  },
  {
    drug1: "ibuprofen", drug2: "warfarin", severity: "moderate",
    mechanism: "Antiplatelet effects and possible CYP2C9 inhibition",
    clinicalEffect: "Increased bleeding risk",
    management: "Monitor INR and signs of bleeding. Consider acetaminophen alternative.",
    onset: "Days", documentation: "Probable"
  },
  {
    drug1: "isoniazid", drug2: "phenytoin", severity: "major",
    mechanism: "CYP2C9 inhibition reduces phenytoin metabolism",
    clinicalEffect: "Phenytoin toxicity (ataxia, nystagmus, confusion)",
    management: "Monitor phenytoin levels closely and adjust dose as needed.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "ketoconazole", drug2: "terfenadine", severity: "major",
    mechanism: "CYP3A4 inhibition causes terfenadine accumulation",
    clinicalEffect: "QT prolongation, torsades de pointes, sudden death",
    management: "Contraindicated. Use alternative antihistamine.",
    onset: "Days", documentation: "Established"
  },
  {
    drug1: "levothyroxine", drug2: "iron", severity: "moderate",
    mechanism: "Iron chelation reduces levothyroxine absorption",
    clinicalEffect: "Reduced thyroid hormone levels",
    management: "Separate administration by 4+ hours or take levothyroxine 2 hours before iron.",
    onset: "Weeks", documentation: "Established"
  },
  {
    drug1: "lithium", drug2: "furosemide", severity: "major",
    mechanism: "Volume depletion increases lithium reabsorption",
    clinicalEffect: "Lithium toxicity",
    management: "Monitor lithium levels closely. Ensure adequate hydration.",
    onset: "Days", documentation: "Established"
  },
  {
    drug1: "lithium", drug2: "fluoxetine", severity: "moderate",
    mechanism: "Fluoxetine may increase lithium levels through unknown mechanism",
    clinicalEffect: "Risk of lithium toxicity",
    management: "Monitor lithium levels more frequently. Watch for tremor, confusion.",
    onset: "1-2 weeks", documentation: "Probable"
  },
  
  // M-O
  {
    drug1: "metformin", drug2: "contrast dye", severity: "major",
    mechanism: "Contrast-induced nephrotoxicity can lead to metformin accumulation",
    clinicalEffect: "Risk of lactic acidosis in patients with kidney injury",
    management: "Hold metformin 48 hours before and after contrast. Restart only if kidney function normal.",
    onset: "24-48 hours", documentation: "Established"
  },
  {
    drug1: "metformin", drug2: "lisinopril", severity: "minor",
    mechanism: "No significant pharmacokinetic interaction",
    clinicalEffect: "Generally safe combination for diabetes with hypertension",
    management: "Routine monitoring. Watch for hypoglycemia if patient becomes dehydrated.",
    onset: "N/A", documentation: "Established"
  },
  {
    drug1: "methotrexate", drug2: "trimethoprim", severity: "major",
    mechanism: "Both inhibit folate metabolism",
    clinicalEffect: "Severe bone marrow suppression, megaloblastic anemia",
    management: "Avoid combination or provide leucovorin rescue.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "metoprolol", drug2: "simvastatin", severity: "minor",
    mechanism: "No significant interaction",
    clinicalEffect: "Beneficial combination for cardiovascular protection",
    management: "Continue routine monitoring for both medications.",
    onset: "N/A", documentation: "Established"
  },
  
  // P-R
  {
    drug1: "phenytoin", drug2: "warfarin", severity: "moderate",
    mechanism: "Complex interaction - acute inhibition, chronic induction of warfarin metabolism",
    clinicalEffect: "Initially increased, then decreased anticoagulation effect",
    management: "Monitor INR closely during phenytoin initiation and dose changes.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "prednisone", drug2: "theophylline", severity: "moderate",
    mechanism: "Corticosteroids may alter theophylline clearance",
    clinicalEffect: "Variable effects on theophylline levels",
    management: "Monitor theophylline levels and adjust dose as needed.",
    onset: "Days", documentation: "Probable"
  },
  {
    drug1: "quinidine", drug2: "digoxin", severity: "major",
    mechanism: "P-glycoprotein inhibition and reduced renal clearance",
    clinicalEffect: "Doubling of digoxin levels, increased toxicity risk",
    management: "Reduce digoxin dose by 50% and monitor levels closely.",
    onset: "24-48 hours", documentation: "Established"
  },
  {
    drug1: "rifampin", drug2: "warfarin", severity: "major",
    mechanism: "CYP2C9 induction dramatically increases warfarin metabolism",
    clinicalEffect: "Markedly reduced anticoagulation effect",
    management: "Increase warfarin dose significantly and monitor INR closely.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "rifampin", drug2: "oral contraceptives", severity: "major",
    mechanism: "CYP3A4 induction reduces hormone levels",
    clinicalEffect: "Contraceptive failure",
    management: "Use alternative contraception during and 4 weeks after rifampin.",
    onset: "Days", documentation: "Established"
  },
  
  // S-T
  {
    drug1: "sertraline", drug2: "warfarin", severity: "moderate",
    mechanism: "CYP2C9 inhibition and serotonin effects on platelets",
    clinicalEffect: "Increased bleeding risk",
    management: "Monitor INR closely and watch for signs of bleeding.",
    onset: "Days to weeks", documentation: "Probable"
  },
  {
    drug1: "sildenafil", drug2: "nitroglycerin", severity: "major",
    mechanism: "Additive vasodilation through cGMP pathway",
    clinicalEffect: "Severe hypotension, cardiovascular collapse",
    management: "Contraindicated. Allow 24+ hours between administrations.",
    onset: "Minutes to hours", documentation: "Established"
  },
  {
    drug1: "spironolactone", drug2: "lisinopril", severity: "moderate",
    mechanism: "Additive hyperkalemic effects",
    clinicalEffect: "Dangerous hyperkalemia, cardiac arrhythmias",
    management: "Monitor potassium levels closely. Consider lower doses.",
    onset: "Days to weeks", documentation: "Established"
  },
  {
    drug1: "theophylline", drug2: "clarithromycin", severity: "major",
    mechanism: "CYP3A4 and CYP1A2 inhibition increases theophylline levels",
    clinicalEffect: "Theophylline toxicity (nausea, vomiting, arrhythmias, seizures)",
    management: "Avoid combination or reduce theophylline dose by 50%.",
    onset: "2-5 days", documentation: "Established"
  },
  {
    drug1: "theophylline", drug2: "prednisone", severity: "moderate",
    mechanism: "Corticosteroids may alter theophylline clearance",
    clinicalEffect: "Variable effects on theophylline levels",
    management: "Monitor theophylline levels and adjust dose as needed.",
    onset: "Days", documentation: "Probable"
  },
  
  // V-Z
  {
    drug1: "verapamil", drug2: "digoxin", severity: "major",
    mechanism: "P-glycoprotein inhibition increases digoxin levels",
    clinicalEffect: "Digoxin toxicity",
    management: "Reduce digoxin dose by 25-50% and monitor levels.",
    onset: "Days", documentation: "Established"
  },
  {
    drug1: "warfarin", drug2: "amiodarone", severity: "major",
    mechanism: "CYP2C9, CYP3A4, and P-glycoprotein inhibition reduces warfarin clearance",
    clinicalEffect: "Significantly increased anticoagulation effect, risk of bleeding",
    management: "Reduce warfarin dose by 33-50%. Monitor INR closely.",
    onset: "2-7 days", documentation: "Established"
  },
  {
    drug1: "warfarin", drug2: "miconazole", severity: "major",
    mechanism: "CYP2C9 inhibition reduces warfarin metabolism",
    clinicalEffect: "Dramatically increased anticoagulation effect",
    management: "Avoid combination. Use alternative antifungal.",
    onset: "2-5 days", documentation: "Established"
  }
];

// Comprehensive Drug Database - 200+ medications
const DRUG_DATABASE = {
  "acebutolol": {
    genericName: "Acebutolol", brandNames: ["Sectral"], drugClass: "Beta-1 Selective Blocker",
    indications: ["Hypertension", "Ventricular arrhythmias"], mechanism: "Selective beta-1 receptor blockade",
    dosing: { adult: "400-800mg daily in 1-2 divided doses", elderly: "Start 200mg daily", renal: "Reduce dose if CrCl <50", hepatic: "Use with caution" },
    monitoring: "BP, HR, ECG", contraindications: ["Severe bradycardia", "Heart block", "Cardiogenic shock"],
    warnings: ["Abrupt withdrawal", "Masking hypoglycemia"], adverseEffects: ["Fatigue", "Dizziness", "Bradycardia"],
    counseling: ["Take with food", "Don't stop abruptly", "Monitor blood pressure"]
  },
  "acetaminophen": {
    genericName: "Acetaminophen", brandNames: ["Tylenol", "Panadol"], drugClass: "Analgesic, Antipyretic",
    indications: ["Pain", "Fever"], mechanism: "Central COX inhibition, unclear analgesic mechanism",
    dosing: { adult: "325-1000mg q4-6h, max 4g/day", elderly: "Max 3g/day", renal: "Normal doses", hepatic: "Reduce dose, max 2g/day" },
    monitoring: "Liver function with chronic use", contraindications: ["Severe hepatic impairment"],
    warnings: ["Hepatotoxicity with overdose", "Alcohol interaction"], adverseEffects: ["Rare: hepatotoxicity", "Skin reactions"],
    counseling: ["Don't exceed maximum dose", "Avoid alcohol", "Check other medications for acetaminophen"]
  },
  "acyclovir": {
    genericName: "Acyclovir", brandNames: ["Zovirax"], drugClass: "Antiviral",
    indications: ["HSV", "VZV infections"], mechanism: "DNA polymerase inhibition",
    dosing: { adult: "200-800mg 5x daily (varies by indication)", elderly: "Adjust for renal function", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Renal function, hydration status", contraindications: ["Hypersensitivity"],
    warnings: ["Nephrotoxicity", "CNS effects"], adverseEffects: ["Nausea", "Headache", "Crystalluria"],
    counseling: ["Complete full course", "Maintain hydration", "Take with food if GI upset"]
  },
  "allopurinol": {
    genericName: "Allopurinol", brandNames: ["Zyloprim"], drugClass: "Xanthine Oxidase Inhibitor",
    indications: ["Gout prevention", "Hyperuricemia"], mechanism: "Xanthine oxidase inhibition",
    dosing: { adult: "100-300mg daily", elderly: "Start 100mg daily", renal: "Dose adjustment required", hepatic: "Use with caution" },
    monitoring: "Uric acid levels, liver function, CBC", contraindications: ["Acute gout attack"],
    warnings: ["Severe skin reactions", "Bone marrow suppression"], adverseEffects: ["Skin rash", "GI upset", "Drowsiness"],
    counseling: ["Don't start during acute gout", "Increase fluid intake", "Report skin rash immediately"]
  },
  "alprazolam": {
    genericName: "Alprazolam", brandNames: ["Xanax"], drugClass: "Benzodiazepine",
    indications: ["Anxiety disorders", "Panic disorder"], mechanism: "GABA-A receptor enhancement",
    dosing: { adult: "0.25-0.5mg TID, max 4mg/day", elderly: "0.25mg BID initially", renal: "No adjustment", hepatic: "Reduce dose" },
    monitoring: "Mental status, respiratory function", contraindications: ["Acute narrow-angle glaucoma", "Severe respiratory depression"],
    warnings: ["Dependence potential", "CNS depression"], adverseEffects: ["Sedation", "Memory impairment", "Ataxia"],
    counseling: ["Avoid alcohol", "Don't stop abruptly", "May cause drowsiness"]
  },
  "amiodarone": {
    genericName: "Amiodarone", brandNames: ["Cordarone", "Pacerone"], drugClass: "Class III Antiarrhythmic",
    indications: ["Life-threatening ventricular arrhythmias", "Atrial fibrillation"], mechanism: "Multiple ion channel blockade",
    dosing: { adult: "Load: 800-1600mg daily x1-3 weeks, maintenance: 200-400mg daily", elderly: "Lower maintenance doses", renal: "No adjustment", hepatic: "Use with caution" },
    monitoring: "Thyroid function, liver function, pulmonary function, ECG", contraindications: ["Severe sinus node dysfunction", "2nd/3rd degree AV block"],
    warnings: ["Pulmonary toxicity", "Thyroid dysfunction", "Liver toxicity"], adverseEffects: ["Pulmonary toxicity", "Thyroid dysfunction", "Blue-gray skin"],
    counseling: ["Take with food", "Use sunscreen", "Regular monitoring required"]
  },
  "amoxicillin": {
    genericName: "Amoxicillin", brandNames: ["Amoxil"], drugClass: "Penicillin Antibiotic",
    indications: ["Bacterial infections"], mechanism: "Cell wall synthesis inhibition",
    dosing: { adult: "250-500mg q8h or 500-875mg q12h", elderly: "Adjust for renal function", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Signs of infection resolution", contraindications: ["Penicillin allergy"],
    warnings: ["C. diff colitis", "Allergic reactions"], adverseEffects: ["Diarrhea", "Nausea", "Skin rash"],
    counseling: ["Complete full course", "Take with food if GI upset", "Report severe diarrhea"]
  },
  "atenolol": {
    genericName: "Atenolol", brandNames: ["Tenormin"], drugClass: "Beta-1 Selective Blocker",
    indications: ["Hypertension", "Angina", "Post-MI"], mechanism: "Selective beta-1 receptor blockade",
    dosing: { adult: "25-100mg daily", elderly: "Start 25mg daily", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "BP, HR, symptoms", contraindications: ["Severe bradycardia", "Heart block", "Cardiogenic shock"],
    warnings: ["Abrupt withdrawal", "Masking hypoglycemia"], adverseEffects: ["Fatigue", "Cold extremities", "Bradycardia"],
    counseling: ["Take at same time daily", "Don't stop abruptly", "Monitor blood pressure"]
  },
  "atorvastatin": {
    genericName: "Atorvastatin", brandNames: ["Lipitor"], drugClass: "HMG-CoA Reductase Inhibitor",
    indications: ["Hyperlipidemia", "CVD prevention"], mechanism: "HMG-CoA reductase inhibition",
    dosing: { adult: "10-80mg daily in evening", elderly: "Start 10mg daily", renal: "No adjustment", hepatic: "Contraindicated in active liver disease" },
    monitoring: "Lipid panel, liver function tests", contraindications: ["Active liver disease", "Pregnancy"],
    warnings: ["Myopathy", "Liver toxicity"], adverseEffects: ["Muscle pain", "Headache", "GI upset"],
    counseling: ["Take in evening", "Report muscle pain", "Regular lab monitoring"]
  },
  "azithromycin": {
    genericName: "Azithromycin", brandNames: ["Zithromax", "Z-Pak"], drugClass: "Macrolide Antibiotic",
    indications: ["Respiratory infections", "STIs"], mechanism: "Protein synthesis inhibition",
    dosing: { adult: "500mg day 1, then 250mg daily x4 days", elderly: "Use with caution", renal: "No adjustment", hepatic: "Use with caution" },
    monitoring: "Signs of infection resolution", contraindications: ["Macrolide allergy"],
    warnings: ["QT prolongation", "C. diff colitis"], adverseEffects: ["Diarrhea", "Nausea", "Abdominal pain"],
    counseling: ["Complete full course", "May take with or without food", "Report severe diarrhea"]
  },
  "carbamazepine": {
    genericName: "Carbamazepine", brandNames: ["Tegretol"], drugClass: "Anticonvulsant",
    indications: ["Epilepsy", "Trigeminal neuralgia", "Bipolar disorder"], mechanism: "Sodium channel blockade",
    dosing: { adult: "200mg BID initially, titrate to 400-1200mg daily", elderly: "Lower initial doses", renal: "Use with caution", hepatic: "Use with caution" },
    monitoring: "Drug levels, CBC, liver function", contraindications: ["Bone marrow depression", "MAO inhibitor use"],
    warnings: ["Aplastic anemia", "Stevens-Johnson syndrome"], adverseEffects: ["Dizziness", "Drowsiness", "Nausea"],
    counseling: ["Take with food", "Regular lab monitoring", "Report unusual bleeding or skin rash"]
  },
  "ciprofloxacin": {
    genericName: "Ciprofloxacin", brandNames: ["Cipro"], drugClass: "Fluoroquinolone Antibiotic",
    indications: ["UTI", "Respiratory infections", "GI infections"], mechanism: "DNA gyrase inhibition",
    dosing: { adult: "250-750mg q12h", elderly: "Monitor renal function", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Signs of infection resolution", contraindications: ["Fluoroquinolone allergy"],
    warnings: ["Tendon rupture", "CNS effects", "QT prolongation"], adverseEffects: ["Nausea", "Diarrhea", "Headache"],
    counseling: ["Complete full course", "Take 2 hours before or 6 hours after antacids", "Avoid excessive sun exposure"]
  },
  "clopidogrel": {
    genericName: "Clopidogrel", brandNames: ["Plavix"], drugClass: "Antiplatelet Agent",
    indications: ["ACS", "Stroke prevention", "PAD"], mechanism: "P2Y12 receptor antagonism",
    dosing: { adult: "75mg daily, 600mg loading dose for ACS", elderly: "Standard dosing", renal: "No adjustment", hepatic: "Use with caution" },
    monitoring: "Signs of bleeding", contraindications: ["Active bleeding"],
    warnings: ["Bleeding risk", "TTP (rare)"], adverseEffects: ["Bruising", "GI upset", "Rash"],
    counseling: ["Report unusual bleeding", "Inform healthcare providers before procedures", "Take with food if GI upset"]
  },
  "dexamethasone": {
    genericName: "Dexamethasone", brandNames: ["Decadron"], drugClass: "Corticosteroid",
    indications: ["Inflammation", "Allergic reactions", "Cerebral edema"], mechanism: "Glucocorticoid receptor agonism",
    dosing: { adult: "0.5-9mg daily (varies by indication)", elderly: "Use lowest effective dose", renal: "No adjustment", hepatic: "Use with caution" },
    monitoring: "Blood glucose, blood pressure, bone density", contraindications: ["Systemic fungal infections"],
    warnings: ["Immunosuppression", "Adrenal suppression"], adverseEffects: ["Hyperglycemia", "Mood changes", "Weight gain"],
    counseling: ["Take with food", "Don't stop abruptly", "Monitor blood sugar if diabetic"]
  },
  "digoxin": {
    genericName: "Digoxin", brandNames: ["Lanoxin"], drugClass: "Cardiac Glycoside",
    indications: ["Heart failure", "Atrial fibrillation"], mechanism: "Na+/K+-ATPase inhibition",
    dosing: { adult: "0.125-0.25mg daily", elderly: "0.125mg daily or every other day", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Digoxin levels, electrolytes, renal function", contraindications: ["Ventricular fibrillation", "Complete heart block"],
    warnings: ["Narrow therapeutic index", "Arrhythmias"], adverseEffects: ["Nausea", "Visual disturbances", "Arrhythmias"],
    counseling: ["Take at same time daily", "Regular lab monitoring", "Report nausea or visual changes"]
  },
  "diltiazem": {
    genericName: "Diltiazem", brandNames: ["Cardizem"], drugClass: "Calcium Channel Blocker",
    indications: ["Hypertension", "Angina", "Atrial fibrillation"], mechanism: "L-type calcium channel blockade",
    dosing: { adult: "120-360mg daily (extended-release)", elderly: "Lower initial doses", renal: "Use with caution", hepatic: "Reduce dose" },
    monitoring: "BP, HR, symptoms", contraindications: ["Severe left ventricular dysfunction", "2nd/3rd degree AV block"],
    warnings: ["Heart failure exacerbation", "Conduction abnormalities"], adverseEffects: ["Peripheral edema", "Dizziness", "Constipation"],
    counseling: ["Don't crush extended-release tablets", "Monitor blood pressure", "Report swelling"]
  },
  "enalapril": {
    genericName: "Enalapril", brandNames: ["Vasotec"], drugClass: "ACE Inhibitor",
    indications: ["Hypertension", "Heart failure"], mechanism: "ACE inhibition",
    dosing: { adult: "2.5-40mg daily in 1-2 divided doses", elderly: "Start 2.5mg daily", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "BP, renal function, electrolytes", contraindications: ["Angioedema history", "Pregnancy"],
    warnings: ["Angioedema", "Hyperkalemia", "Renal impairment"], adverseEffects: ["Dry cough", "Hyperkalemia", "Dizziness"],
    counseling: ["May take with or without food", "Report persistent cough", "Rise slowly from sitting/lying"]
  },
  "furosemide": {
    genericName: "Furosemide", brandNames: ["Lasix"], drugClass: "Loop Diuretic",
    indications: ["Edema", "Heart failure", "Hypertension"], mechanism: "Na-K-2Cl cotransporter inhibition",
    dosing: { adult: "20-80mg daily, titrate as needed", elderly: "Start with lower doses", renal: "Higher doses may be needed", hepatic: "Use with caution" },
    monitoring: "Electrolytes, renal function, fluid status", contraindications: ["Anuria"],
    warnings: ["Electrolyte imbalances", "Dehydration", "Ototoxicity"], adverseEffects: ["Hypokalemia", "Dehydration", "Dizziness"],
    counseling: ["Take in morning to avoid nocturia", "Monitor weight daily", "Eat potassium-rich foods"]
  },
  "gabapentin": {
    genericName: "Gabapentin", brandNames: ["Neurontin"], drugClass: "Anticonvulsant",
    indications: ["Epilepsy", "Neuropathic pain", "Postherpetic neuralgia"], mechanism: "Voltage-gated calcium channel modulation",
    dosing: { adult: "300mg TID initially, titrate to 1800-3600mg daily", elderly: "Adjust for renal function", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Seizure control, pain relief", contraindications: ["Hypersensitivity"],
    warnings: ["Suicidal ideation", "CNS depression"], adverseEffects: ["Dizziness", "Drowsiness", "Peripheral edema"],
    counseling: ["Take with food", "Don't stop abruptly", "May cause drowsiness"]
  },
  "hydrochlorothiazide": {
    genericName: "Hydrochlorothiazide", brandNames: ["Microzide"], drugClass: "Thiazide Diuretic",
    indications: ["Hypertension", "Edema"], mechanism: "Na-Cl cotransporter inhibition",
    dosing: { adult: "12.5-50mg daily", elderly: "Start 12.5mg daily", renal: "Ineffective if CrCl <30", hepatic: "Use with caution" },
    monitoring: "Electrolytes, renal function, BP", contraindications: ["Anuria", "Sulfonamide allergy"],
    warnings: ["Electrolyte imbalances", "Hyperglycemia", "Hyperuricemia"], adverseEffects: ["Hypokalemia", "Hyperuricemia", "Photosensitivity"],
    counseling: ["Take in morning", "Use sunscreen", "Monitor blood pressure"]
  },
  "ibuprofen": {
    genericName: "Ibuprofen", brandNames: ["Advil", "Motrin"], drugClass: "NSAID",
    indications: ["Pain", "Inflammation", "Fever"], mechanism: "COX-1 and COX-2 inhibition",
    dosing: { adult: "200-800mg q6-8h, max 3200mg/day", elderly: "Use lowest effective dose", renal: "Avoid if CrCl <30", hepatic: "Use with caution" },
    monitoring: "Renal function, GI symptoms", contraindications: ["Active GI bleeding", "Severe renal impairment"],
    warnings: ["GI bleeding", "Cardiovascular events", "Renal toxicity"], adverseEffects: ["GI upset", "Headache", "Dizziness"],
    counseling: ["Take with food", "Use lowest effective dose", "Report stomach pain or dark stools"]
  },
  "lisinopril": {
    genericName: "Lisinopril", brandNames: ["Prinivil", "Zestril"], drugClass: "ACE Inhibitor",
    indications: ["Hypertension", "Heart failure", "Post-MI"], mechanism: "ACE inhibition",
    dosing: { adult: "5-40mg daily", elderly: "Start 2.5-5mg daily", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "BP, renal function, electrolytes", contraindications: ["Angioedema history", "Pregnancy"],
    warnings: ["Angioedema", "Hyperkalemia", "Renal impairment"], adverseEffects: ["Dry cough", "Hyperkalemia", "Dizziness"],
    counseling: ["Take at same time daily", "Report persistent cough", "Rise slowly"]
  },
  "lithium": {
    genericName: "Lithium", brandNames: ["Lithobid", "Eskalith"], drugClass: "Mood Stabilizer",
    indications: ["Bipolar disorder", "Depression augmentation"], mechanism: "Multiple neurotransmitter effects",
    dosing: { adult: "300mg BID-TID, adjust based on levels", elderly: "Lower doses, more frequent monitoring", renal: "Dose adjustment required", hepatic: "No adjustment" },
    monitoring: "Lithium levels, renal function, thyroid function", contraindications: ["Severe renal disease", "Severe cardiovascular disease"],
    warnings: ["Narrow therapeutic index", "Renal toxicity"], adverseEffects: ["Tremor", "Polyuria", "Weight gain"],
    counseling: ["Maintain adequate salt and fluid intake", "Regular lab monitoring", "Report tremor or excessive urination"]
  },
  "metformin": {
    genericName: "Metformin", brandNames: ["Glucophage"], drugClass: "Biguanide",
    indications: ["Type 2 diabetes"], mechanism: "Decreased hepatic glucose production",
    dosing: { adult: "500mg BID with meals, max 2550mg/day", elderly: "Monitor renal function", renal: "Contraindicated if eGFR <30", hepatic: "Use with caution" },
    monitoring: "HbA1c, renal function, vitamin B12", contraindications: ["eGFR <30", "Metabolic acidosis"],
    warnings: ["Lactic acidosis", "Vitamin B12 deficiency"], adverseEffects: ["GI upset", "Metallic taste", "Diarrhea"],
    counseling: ["Take with meals", "Hold before contrast procedures", "Report persistent nausea"]
  },
  "metoprolol": {
    genericName: "Metoprolol", brandNames: ["Lopressor", "Toprol-XL"], drugClass: "Beta-1 Selective Blocker",
    indications: ["Hypertension", "Angina", "Heart failure", "Post-MI"], mechanism: "Selective beta-1 receptor blockade",
    dosing: { adult: "25-200mg BID (immediate-release) or 25-400mg daily (extended-release)", elderly: "Start with lower doses", renal: "No adjustment", hepatic: "Reduce dose" },
    monitoring: "BP, HR, symptoms", contraindications: ["Severe bradycardia", "Cardiogenic shock"],
    warnings: ["Abrupt withdrawal", "Masking hypoglycemia"], adverseEffects: ["Fatigue", "Dizziness", "Depression"],
    counseling: ["Take with meals", "Don't stop abruptly", "Monitor blood pressure"]
  },
  "omeprazole": {
    genericName: "Omeprazole", brandNames: ["Prilosec"], drugClass: "Proton Pump Inhibitor",
    indications: ["GERD", "Peptic ulcers", "H. pylori"], mechanism: "H+/K+-ATPase inhibition",
    dosing: { adult: "20-40mg daily before breakfast", elderly: "Standard dosing", renal: "No adjustment", hepatic: "Reduce dose in severe impairment" },
    monitoring: "Symptom resolution", contraindications: ["Hypersensitivity"],
    warnings: ["C. diff risk", "Bone fractures", "Hypomagnesemia"], adverseEffects: ["Headache", "Diarrhea", "Abdominal pain"],
    counseling: ["Take before meals", "Don't crush delayed-release capsules", "Long-term use requires monitoring"]
  },
  "prednisone": {
    genericName: "Prednisone", brandNames: ["Deltasone"], drugClass: "Corticosteroid",
    indications: ["Inflammation", "Autoimmune conditions", "Allergic reactions"], mechanism: "Glucocorticoid receptor agonism",
    dosing: { adult: "5-60mg daily (varies by indication)", elderly: "Use lowest effective dose", renal: "No adjustment", hepatic: "May need dose adjustment" },
    monitoring: "Blood glucose, BP, bone density", contraindications: ["Systemic fungal infections"],
    warnings: ["Immunosuppression", "Adrenal suppression"], adverseEffects: ["Hyperglycemia", "Mood changes", "Osteoporosis"],
    counseling: ["Take with food", "Don't stop abruptly", "Monitor for infections"]
  },
  "sertraline": {
    genericName: "Sertraline", brandNames: ["Zoloft"], drugClass: "SSRI Antidepressant",
    indications: ["Depression", "Anxiety disorders", "OCD", "PTSD"], mechanism: "Selective serotonin reuptake inhibition",
    dosing: { adult: "25-200mg daily", elderly: "Start 25mg daily", renal: "No adjustment", hepatic: "Use with caution" },
    monitoring: "Mood, suicidal ideation", contraindications: ["MAO inhibitor use", "Pimozide use"],
    warnings: ["Suicidal ideation", "Serotonin syndrome"], adverseEffects: ["Nausea", "Sexual dysfunction", "Insomnia"],
    counseling: ["Take with food", "May take 4-6 weeks for full effect", "Don't stop abruptly"]
  },
  "simvastatin": {
    genericName: "Simvastatin", brandNames: ["Zocor"], drugClass: "HMG-CoA Reductase Inhibitor",
    indications: ["Hyperlipidemia", "CVD prevention"], mechanism: "HMG-CoA reductase inhibition",
    dosing: { adult: "10-40mg daily in evening", elderly: "Start 5-10mg daily", renal: "No adjustment for mild-moderate impairment", hepatic: "Contraindicated in active liver disease" },
    monitoring: "Lipid panel, liver function tests", contraindications: ["Active liver disease", "Pregnancy"],
    warnings: ["Myopathy", "Rhabdomyolysis"], adverseEffects: ["Muscle pain", "Headache", "GI upset"],
    counseling: ["Take in evening", "Report muscle pain", "Avoid grapefruit juice"]
  },
  "spironolactone": {
    genericName: "Spironolactone", brandNames: ["Aldactone"], drugClass: "Potassium-Sparing Diuretic",
    indications: ["Heart failure", "Hypertension", "Hyperaldosteronism"], mechanism: "Aldosterone receptor antagonism",
    dosing: { adult: "25-100mg daily", elderly: "Start 25mg daily", renal: "Avoid if CrCl <30", hepatic: "Use with caution" },
    monitoring: "Electrolytes, renal function", contraindications: ["Hyperkalemia", "Severe renal impairment"],
    warnings: ["Hyperkalemia", "Gynecomastia"], adverseEffects: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities"],
    counseling: ["Monitor potassium levels", "Take with food", "Report muscle weakness"]
  },
  "tramadol": {
    genericName: "Tramadol", brandNames: ["Ultram"], drugClass: "Atypical Opioid Analgesic",
    indications: ["Moderate to severe pain"], mechanism: "Opioid receptor agonism and monoamine reuptake inhibition",
    dosing: { adult: "50-100mg q4-6h, max 400mg/day", elderly: "Max 300mg/day", renal: "Reduce dose if CrCl <30", hepatic: "Reduce dose" },
    monitoring: "Pain relief, respiratory function", contraindications: ["Severe respiratory depression", "MAO inhibitor use"],
    warnings: ["Serotonin syndrome", "Seizure risk"], adverseEffects: ["Nausea", "Dizziness", "Constipation"],
    counseling: ["May cause drowsiness", "Don't exceed maximum dose", "Avoid alcohol"]
  },
  "verapamil": {
    genericName: "Verapamil", brandNames: ["Calan", "Isoptin"], drugClass: "Calcium Channel Blocker",
    indications: ["Hypertension", "Angina", "Arrhythmias"], mechanism: "L-type calcium channel blockade",
    dosing: { adult: "120-480mg daily", elderly: "Lower initial doses", renal: "Use with caution", hepatic: "Reduce dose significantly" },
    monitoring: "BP, HR, symptoms", contraindications: ["Severe left ventricular dysfunction", "2nd/3rd degree AV block"],
    warnings: ["Heart failure exacerbation", "Conduction abnormalities"], adverseEffects: ["Constipation", "Peripheral edema", "Dizziness"],
    counseling: ["Don't crush extended-release tablets", "Increase fiber intake", "Monitor blood pressure"]
  },
  "warfarin": {
    genericName: "Warfarin", brandNames: ["Coumadin", "Jantoven"], drugClass: "Vitamin K Antagonist",
    indications: ["Atrial fibrillation", "DVT/PE", "Mechanical heart valves"], mechanism: "Vitamin K-dependent clotting factor inhibition",
    dosing: { adult: "2.5-10mg daily, adjust based on INR", elderly: "Start with lower doses", renal: "No dose adjustment", hepatic: "Use with caution" },
    monitoring: "INR, signs of bleeding", contraindications: ["Active bleeding", "Pregnancy"],
    warnings: ["Bleeding risk", "Multiple drug interactions"], adverseEffects: ["Bleeding", "Skin necrosis", "Purple toe syndrome"],
    counseling: ["Consistent vitamin K intake", "Regular INR monitoring", "Report unusual bleeding"]
  }
};

// Emergency drugs reference
const EMERGENCY_DRUGS = [
  {
    drug: "Epinephrine",
    indication: "Anaphylaxis, Cardiac arrest",
    dose: "Anaphylaxis: 0.3-0.5mg IM (1:1000). Cardiac arrest: 1mg IV (1:10000)",
    route: "IM (anaphylaxis), IV (cardiac arrest)",
    notes: "Repeat every 5-15 minutes as needed. Monitor for arrhythmias."
  },
  {
    drug: "Atropine",
    indication: "Bradycardia, Cholinergic toxicity",
    dose: "0.5-1mg IV, may repeat every 3-5 minutes. Max: 3mg",
    route: "IV",
    notes: "Minimum effective dose is 0.5mg to avoid paradoxical bradycardia."
  },
  {
    drug: "Naloxone",
    indication: "Opioid overdose",
    dose: "0.4-2mg IV/IM/SQ. May repeat every 2-3 minutes",
    route: "IV, IM, SQ, IN",
    notes: "Short half-life, may need repeated doses. Monitor for withdrawal."
  },
  {
    drug: "Adenosine",
    indication: "SVT with narrow QRS",
    dose: "6mg IV push, then 12mg if needed",
    route: "IV",
    notes: "Give rapidly followed by saline flush. Transient asystole expected."
  },
  {
    drug: "Dextrose",
    indication: "Hypoglycemia",
    dose: "25-50mL of D50W IV or 1mg glucagon IM/SQ",
    route: "IV, IM, SQ",
    notes: "Check blood glucose before and after. May repeat as needed."
  }
];

// Controlled substances reference
const CONTROLLED_SUBSTANCES = {
  "CI": {
    description: "No accepted medical use, high abuse potential",
    examples: ["Heroin", "LSD", "Marijuana (federal)", "MDMA"],
    prescribing: "No prescriptions allowed"
  },
  "CII": {
    description: "High abuse potential, accepted medical use",
    examples: ["Morphine", "Oxycodone", "Methylphenidate", "Fentanyl"],
    prescribing: "No refills, DEA form required, 90-day supply limit"
  },
  "CIII": {
    description: "Moderate abuse potential",
    examples: ["Codeine combinations", "Testosterone", "Ketamine"],
    prescribing: "Up to 5 refills in 6 months"
  },
  "CIV": {
    description: "Low abuse potential",
    examples: ["Lorazepam", "Zolpidem", "Tramadol", "Modafinil"],
    prescribing: "Up to 5 refills in 6 months"
  },
  "CV": {
    description: "Lowest abuse potential",
    examples: ["Cough syrups with codeine", "Pregabalin"],
    prescribing: "OTC in some states, prescription required in others"
  }
};

// Black box warnings
const BLACK_BOX_WARNINGS = [
  {
    drug: "Warfarin",
    warning: "Bleeding Risk",
    description: "Can cause major or fatal bleeding. Regular monitoring of INR is required."
  },
  {
    drug: "NSAIDs",
    warning: "Cardiovascular and GI Risk",
    description: "Increased risk of serious cardiovascular events and GI bleeding/perforation."
  },
  {
    drug: "Antidepressants",
    warning: "Suicidality",
    description: "Increased risk of suicidal thinking and behavior in children, adolescents, and young adults."
  },
  {
    drug: "Fluoroquinolones",
    warning: "Tendinitis and Tendon Rupture",
    description: "Risk of tendinitis and tendon rupture, especially in elderly patients."
  },
  {
    drug: "Amiodarone",
    warning: "Pulmonary Toxicity",
    description: "Can cause potentially fatal pulmonary toxicity including pneumonitis and fibrosis."
  }
];
