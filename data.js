// Comprehensive drug interaction database
const DRUG_INTERACTIONS = [
  {
    drug1: "warfarin", drug2: "amiodarone", severity: "major",
    mechanism: "CYP2C9, CYP3A4, and P-glycoprotein inhibition by amiodarone reduces warfarin clearance",
    clinicalEffect: "Significantly increased anticoagulation effect, risk of bleeding",
    management: "Reduce warfarin dose by 33-50%. Monitor INR closely (every 2-3 days initially). Consider alternative antiarrhythmic.",
    onset: "2-7 days", documentation: "Established"
  },
  {
    drug1: "simvastatin", drug2: "clarithromycin", severity: "major",
    mechanism: "CYP3A4 inhibition by clarithromycin dramatically increases simvastatin levels",
    clinicalEffect: "Increased risk of myopathy, rhabdomyolysis, acute kidney injury",
    management: "Avoid combination. Use azithromycin or temporarily discontinue statin. If unavoidable, use lowest simvastatin dose and monitor CK.",
    onset: "Within days", documentation: "Established"
  },
  {
    drug1: "lithium", drug2: "ibuprofen", severity: "moderate",
    mechanism: "NSAIDs reduce renal lithium clearance via prostaglandin inhibition",
    clinicalEffect: "Increased lithium levels and toxicity risk (tremor, confusion, nephrotoxicity)",
    management: "Avoid chronic NSAID use. If needed, monitor lithium levels weekly, watch for toxicity signs. Consider acetaminophen alternative.",
    onset: "1-2 weeks", documentation: "Probable"
  },
  {
    drug1: "digoxin", drug2: "furosemide", severity: "moderate",
    mechanism: "Furosemide-induced hypokalemia increases digoxin binding and toxicity risk",
    clinicalEffect: "Enhanced digoxin effects, increased risk of arrhythmias",
    management: "Monitor potassium and magnesium levels. Maintain K+ >4.0 mEq/L. Monitor digoxin levels and ECG changes.",
    onset: "Days to weeks", documentation: "Probable"
  },
  {
    drug1: "metformin", drug2: "contrast dye", severity: "major",
    mechanism: "Contrast-induced nephrotoxicity can lead to metformin accumulation and lactic acidosis",
    clinicalEffect: "Risk of lactic acidosis in patients with kidney injury",
    management: "Hold metformin 48 hours before and after contrast. Restart only if kidney function normal (eGFR >30).",
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
    drug1: "metoprolol", drug2: "simvastatin", severity: "minor", 
    mechanism: "No significant interaction",
    clinicalEffect: "Beneficial combination for cardiovascular protection",
    management: "Continue routine monitoring for both medications.",
    onset: "N/A", documentation: "Established"
  },
  {
    drug1: "lithium", drug2: "fluoxetine", severity: "moderate",
    mechanism: "Fluoxetine may increase lithium levels through unknown mechanism",
    clinicalEffect: "Risk of lithium toxicity",
    management: "Monitor lithium levels more frequently. Watch for tremor, confusion, polyuria.",
    onset: "1-2 weeks", documentation: "Probable"
  },
  {
    drug1: "fluoxetine", drug2: "tramadol", severity: "major",
    mechanism: "Both increase serotonin; fluoxetine inhibits tramadol metabolism",
    clinicalEffect: "Increased risk of serotonin syndrome and tramadol toxicity",
    management: "Avoid combination. If unavoidable, use lowest doses and monitor closely for serotonin syndrome.",
    onset: "Hours to days", documentation: "Established"
  },
  {
    drug1: "theophylline", drug2: "clarithromycin", severity: "major",
    mechanism: "CYP3A4 and CYP1A2 inhibition by clarithromycin increases theophylline levels",
    clinicalEffect: "Theophylline toxicity (nausea, vomiting, arrhythmias, seizures)",
    management: "Avoid combination or reduce theophylline dose by 50%. Monitor theophylline levels closely.",
    onset: "2-5 days", documentation: "Established"
  },
  {
    drug1: "theophylline", drug2: "prednisone", severity: "moderate",
    mechanism: "Corticosteroids may alter theophylline clearance",
    clinicalEffect: "Variable effects on theophylline levels",
    management: "Monitor theophylline levels and adjust dose as needed. Watch for toxicity or loss of efficacy.",
    onset: "Days", documentation: "Probable"
  }
];

// Drug information database
const DRUG_DATABASE = {
  "warfarin": {
    genericName: "Warfarin",
    brandNames: ["Coumadin", "Jantoven"],
    drugClass: "Vitamin K Antagonist",
    indications: ["Atrial fibrillation", "DVT/PE treatment and prevention", "Mechanical heart valves"],
    mechanism: "Inhibits vitamin K-dependent coagulation factors (II, VII, IX, X)",
    dosing: {
      adult: "Initial: 2.5-10mg daily, adjust based on INR",
      elderly: "Start with lower doses (2.5-5mg daily)",
      renal: "No dose adjustment needed",
      hepatic: "Use with caution, may need dose reduction"
    },
    monitoring: "INR every 2-3 days initially, then weekly, then monthly when stable",
    contraindications: ["Active bleeding", "Pregnancy", "Severe liver disease"],
    warnings: ["Black box: Bleeding risk", "Multiple drug interactions", "Dietary vitamin K interactions"],
    adverseEffects: ["Bleeding", "Skin necrosis (rare)", "Purple toe syndrome"],
    counseling: [
      "Take at same time daily",
      "Consistent vitamin K intake",
      "Regular INR monitoring required",
      "Report bleeding, bruising",
      "Avoid alcohol excess"
    ]
  },
  "metformin": {
    genericName: "Metformin",
    brandNames: ["Glucophage", "Fortamet", "Glumetza"],
    drugClass: "Biguanide",
    indications: ["Type 2 diabetes", "Polycystic ovary syndrome (off-label)"],
    mechanism: "Decreases hepatic glucose production, increases insulin sensitivity",
    dosing: {
      adult: "Initial: 500mg BID or 850mg daily with meals. Max: 2550mg/day",
      elderly: "Use cautiously, monitor renal function",
      renal: "eGFR 30-45: Max 1000mg/day. eGFR <30: Contraindicated",
      hepatic: "Use with caution"
    },
    monitoring: "HbA1c, renal function, vitamin B12 levels",
    contraindications: ["eGFR <30", "Metabolic acidosis", "Acute heart failure"],
    warnings: ["Lactic acidosis (rare but serious)", "Hold before contrast procedures"],
    adverseEffects: ["GI upset", "Metallic taste", "Vitamin B12 deficiency", "Lactic acidosis"],
    counseling: [
      "Take with meals to reduce GI upset",
      "May cause initial stomach upset",
      "Do not crush extended-release tablets",
      "Report persistent nausea, vomiting"
    ]
  },
  "amiodarone": {
    genericName: "Amiodarone",
    brandNames: ["Cordarone", "Pacerone"],
    drugClass: "Class III Antiarrhythmic",
    indications: ["Life-threatening ventricular arrhythmias", "Atrial fibrillation"],
    mechanism: "Blocks potassium channels, prolongs action potential duration",
    dosing: {
      adult: "Load: 800-1600mg daily x 1-3 weeks, then 600-800mg daily x 4 weeks, then 400mg daily maintenance",
      elderly: "Use lower maintenance doses",
      renal: "No adjustment needed",
      hepatic: "Use with caution"
    },
    monitoring: "Thyroid function, liver function, pulmonary function, ECG, eye exams",
    contraindications: ["Severe sinus node dysfunction", "2nd/3rd degree AV block"],
    warnings: ["Black box: Pulmonary toxicity", "Thyroid dysfunction", "Liver toxicity"],
    adverseEffects: ["Pulmonary toxicity", "Thyroid dysfunction", "Hepatotoxicity", "Blue-gray skin"],
    counseling: [
      "Take with food",
      "Use sunscreen (photosensitivity)",
      "Regular monitoring required",
      "Report shortness of breath, cough"
    ]
  },
  "lithium": {
    genericName: "Lithium",
    brandNames: ["Lithobid", "Eskalith"],
    drugClass: "Mood Stabilizer",
    indications: ["Bipolar disorder", "Depression (augmentation)"],
    mechanism: "Unknown; affects neurotransmitter function and cell signaling",
    dosing: {
      adult: "Initial: 300mg BID-TID, adjust based on levels. Target: 0.6-1.2 mEq/L",
      elderly: "Lower doses, more frequent monitoring",
      renal: "Reduce dose if CrCl <50 mL/min",
      hepatic: "No adjustment needed"
    },
    monitoring: "Lithium levels, kidney function, thyroid function, CBC",
    contraindications: ["Severe renal disease", "Severe cardiovascular disease"],
    warnings: ["Narrow therapeutic index", "Renal toxicity", "Thyroid effects"],
    adverseEffects: ["Tremor", "Polyuria", "Weight gain", "Hypothyroidism"],
    counseling: [
      "Take with food or milk",
      "Maintain adequate salt and fluid intake",
      "Regular lab monitoring required",
      "Report tremor, excessive urination"
    ]
  },
  "simvastatin": {
    genericName: "Simvastatin",
    brandNames: ["Zocor"],
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    indications: ["Hyperlipidemia", "Cardiovascular disease prevention"],
    mechanism: "Inhibits HMG-CoA reductase, reduces cholesterol synthesis",
    dosing: {
      adult: "Initial: 10-20mg daily in evening. Max: 40mg daily",
      elderly: "Start with 5-10mg daily",
      renal: "No adjustment for mild-moderate impairment",
      hepatic: "Contraindicated in active liver disease"
    },
    monitoring: "Lipid panel, liver function tests, CK if symptoms",
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
    warnings: ["Myopathy risk", "Drug interactions via CYP3A4"],
    adverseEffects: ["Muscle pain", "Headache", "GI upset", "Elevated LFTs"],
    counseling: [
      "Take in evening with or without food",
      "Report muscle pain or weakness",
      "Avoid grapefruit juice",
      "Regular lab monitoring needed"
    ]
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
