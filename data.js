/*
  Cardio-Diabetic Brand Desk — market data
  -----------------------------------------
  Edit this file on GitHub to update the site for everyone.

  For each brand:
    doses       available strengths, shown next to the brand name
    revenue_cr  last-year revenue in ₹ crore (MAT from AWACS / PharmaTrac / Pharmarack). Leave null if unknown.
    period      the period the revenue refers to, e.g. "MAT Mar 2026"

  Brands are ranked by revenue_cr (highest first). Brands without revenue
  are listed after them, in the order written here.

  Built-in revenue is filled only where a public source exists.
  Everything else is left for you to add from your audit data.
*/
window.CDBD_DATA = {
  version: "2026.11",
  molecules: [
    {
      name: "Dapagliflozin", cls: "SGLT2", aliases: ["dapa"],
      ind: ["Type 2 diabetes", "Heart failure", "Chronic kidney disease"],
      evidence: ["DECLARE-TIMI 58", "DAPA-HF", "DAPA-CKD", "DELIVER"],
      status: "Off-patent; many generic brands since 2022",
      brands: [
        { brand: "Forxiga", company: "AstraZeneca", doses: ["5 mg", "10 mg"], revenue_cr: null, period: "" },
        { brand: "Oxra", company: "Sun Pharma", doses: ["5 mg", "10 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Empagliflozin", cls: "SGLT2", aliases: ["empa"],
      ind: ["Type 2 diabetes", "Heart failure", "Chronic kidney disease"],
      evidence: ["EMPA-REG OUTCOME", "EMPEROR-Reduced", "EMPEROR-Preserved", "EMPA-KIDNEY"],
      status: "Off-patent since 2025; wave of generic launches",
      brands: [
        { brand: "Jardiance", company: "Boehringer Ingelheim", doses: ["10 mg", "25 mg"], revenue_cr: null, period: "" },
        { brand: "Gibtulio", company: "Lupin", doses: ["10 mg", "25 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Empagliflozin + Linagliptin", cls: "SGLT2", aliases: ["empa lina"],
      ind: ["Type 2 diabetes"],
      evidence: ["EMPA-REG OUTCOME", "CARMELINA"],
      status: "Generic entry following empagliflozin patent expiry",
      brands: [
        { brand: "Glyxambi", company: "Boehringer Ingelheim", doses: ["10/5 mg", "25/5 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Sitagliptin", cls: "DPP4", aliases: ["sita"],
      ind: ["Type 2 diabetes"],
      evidence: ["TECOS"],
      status: "Off-patent since 2022; heavily genericised",
      brands: [
        { brand: "Januvia", company: "MSD", doses: ["25 mg", "50 mg", "100 mg"], revenue_cr: null, period: "" },
        { brand: "Istavel", company: "Sun Pharma", doses: ["25 mg", "50 mg", "100 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Sitagliptin + Metformin", cls: "DPP4", aliases: ["sita met"],
      ind: ["Type 2 diabetes"],
      evidence: ["TECOS"],
      status: "Off-patent; large, competitive FDC market",
      brands: [
        { brand: "Janumet", company: "MSD", doses: ["50/500 mg", "50/1000 mg", "XR 100/1000 mg"], revenue_cr: null, period: "" },
        { brand: "Istamet", company: "Sun Pharma", doses: ["50/500 mg", "50/1000 mg", "XR 100/1000 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Vildagliptin + Metformin", cls: "DPP4", aliases: ["vilda met"],
      ind: ["Type 2 diabetes"],
      evidence: ["VERIFY"],
      status: "Off-patent",
      brands: [
        { brand: "Galvus Met", company: "Novartis", doses: ["50/500 mg", "50/850 mg", "50/1000 mg"], revenue_cr: null, period: "" },
        { brand: "Jalra-M", company: "USV", doses: ["50/500 mg", "50/850 mg", "50/1000 mg"], revenue_cr: null, period: "" },
        { brand: "Zomelis Met", company: "Sun Pharma", doses: ["50/500 mg", "50/850 mg", "50/1000 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Linagliptin", cls: "DPP4", aliases: ["lina"],
      ind: ["Type 2 diabetes"],
      evidence: ["CARMELINA", "CAROLINA"],
      usp: "No dose adjustment in renal impairment",
      status: "Check current generic status",
      brands: [
        { brand: "Trajenta", company: "Boehringer Ingelheim", doses: ["5 mg"], revenue_cr: null, period: "" },
        { brand: "Ondero", company: "Lupin", doses: ["5 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Glimepiride + Metformin", cls: "SUMET", aliases: ["glim met", "glimepiride metformin"],
      ind: ["Type 2 diabetes"],
      evidence: ["Decades of clinical use"],
      status: "Mature, high-volume generic market",
      brands: [
        { brand: "Glycomet-GP", company: "USV", doses: ["0.5/500 mg", "1/500 mg", "2/500 mg", "1/1000 mg", "2/1000 mg"], revenue_cr: 828, period: "MAT Aug 2025 (public industry report)" },
        { brand: "Amaryl M", company: "Sanofi", doses: ["1/500 mg", "2/500 mg"], revenue_cr: null, period: "" },
        { brand: "Gemer", company: "Sun Pharma", doses: ["1/500 mg", "2/500 mg"], revenue_cr: null, period: "" },
        { brand: "Zoryl-M", company: "Intas", doses: ["1/500 mg", "2/500 mg"], revenue_cr: null, period: "" },
        { brand: "Glimisave-M", company: "Eris", doses: ["1/500 mg", "2/500 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Metformin", cls: "BIG", aliases: [],
      ind: ["Type 2 diabetes", "Prediabetes", "PCOS"],
      evidence: ["UKPDS"],
      status: "Mature generic",
      brands: [
        { brand: "Glycomet", company: "USV", doses: ["250 mg", "500 mg", "850 mg", "SR 500 mg", "SR 1000 mg"], revenue_cr: null, period: "" },
        { brand: "Glyciphage", company: "Franco-Indian", doses: ["500 mg", "850 mg", "SR 1000 mg"], revenue_cr: null, period: "" },
        { brand: "Obimet", company: "Abbott", doses: ["500 mg", "850 mg", "SR 1000 mg"], revenue_cr: null, period: "" },
        { brand: "Cetapin", company: "Sanofi", doses: ["XR 500 mg", "XR 1000 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Telmisartan", cls: "ARB", aliases: ["telmi"],
      ind: ["Hypertension", "Cardiovascular risk reduction"],
      evidence: ["ONTARGET"],
      status: "Mature generic",
      brands: [
        { brand: "Telma", company: "Glenmark", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Telsartan", company: "Dr. Reddy's", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Tazloc", company: "USV", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Telmikind", company: "Mankind", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Cresar", company: "Cipla", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Telvas", company: "Aristo", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Telmisartan + Amlodipine", cls: "ARB", aliases: ["telmi amlo"],
      ind: ["Hypertension"],
      evidence: ["ONTARGET (telmisartan)", "ALLHAT (amlodipine)"],
      status: "Mature generic FDC",
      brands: [
        { brand: "Telma-AM", company: "Glenmark", doses: ["40/5 mg", "80/5 mg"], revenue_cr: null, period: "" },
        { brand: "Telsartan-AM", company: "Dr. Reddy's", doses: ["40/5 mg"], revenue_cr: null, period: "" },
        { brand: "Tazloc-AM", company: "USV", doses: ["40/5 mg"], revenue_cr: null, period: "" },
        { brand: "Telmikind-AM", company: "Mankind", doses: ["40/5 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Rosuvastatin", cls: "STATIN", aliases: ["rosu"],
      ind: ["Dyslipidaemia", "ASCVD prevention"],
      evidence: ["JUPITER", "HOPE-3"],
      status: "Mature generic",
      brands: [
        { brand: "Rosuvas", company: "Sun Pharma", doses: ["5 mg", "10 mg", "20 mg", "40 mg"], revenue_cr: null, period: "" },
        { brand: "Rozavel", company: "Sun Pharma", doses: ["5 mg", "10 mg", "20 mg"], revenue_cr: null, period: "" },
        { brand: "Rozucor", company: "Torrent", doses: ["5 mg", "10 mg", "20 mg", "40 mg"], revenue_cr: null, period: "" },
        { brand: "Crestor", company: "AstraZeneca", doses: ["5 mg", "10 mg", "20 mg"], revenue_cr: null, period: "" },
        { brand: "Rozat", company: "Lupin", doses: ["5 mg", "10 mg", "20 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Atorvastatin", cls: "STATIN", aliases: ["atorva"],
      ind: ["Dyslipidaemia", "ASCVD prevention"],
      evidence: ["ASCOT-LLA", "CARDS", "TNT"],
      status: "Mature generic",
      brands: [
        { brand: "Atorva", company: "Zydus", doses: ["10 mg", "20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Storvas", company: "Sun Pharma", doses: ["10 mg", "20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" },
        { brand: "Tonact", company: "Lupin", doses: ["10 mg", "20 mg", "40 mg"], revenue_cr: null, period: "" },
        { brand: "Lipvas", company: "Cipla", doses: ["10 mg", "20 mg", "40 mg"], revenue_cr: null, period: "" },
        { brand: "Atocor", company: "Dr. Reddy's", doses: ["10 mg", "20 mg", "40 mg"], revenue_cr: null, period: "" },
        { brand: "Aztor", company: "Sun Pharma", doses: ["10 mg", "20 mg", "40 mg", "80 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Sacubitril + Valsartan", cls: "ARNI", aliases: ["arni", "sacu val"],
      ind: ["Heart failure with reduced ejection fraction"],
      evidence: ["PARADIGM-HF", "PIONEER-HF"],
      status: "Check current patent and generic status",
      brands: [
        { brand: "Vymada", company: "Novartis", doses: ["24/26 mg", "49/51 mg", "97/103 mg"], revenue_cr: null, period: "" },
        { brand: "Azmarda", company: "Lupin", doses: ["24/26 mg", "49/51 mg", "97/103 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Ticagrelor", cls: "ANTIPLT", aliases: ["ticag"],
      ind: ["Acute coronary syndrome", "After PCI"],
      evidence: ["PLATO", "PEGASUS-TIMI 54"],
      status: "Generic",
      brands: [
        { brand: "Brilinta", company: "AstraZeneca", doses: ["60 mg", "90 mg"], revenue_cr: null, period: "" },
        { brand: "Axcer", company: "Sun Pharma", doses: ["90 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Metoprolol Succinate", cls: "BB", aliases: ["metoprolol", "meto"],
      ind: ["Hypertension", "Heart failure", "Angina"],
      evidence: ["MERIT-HF"],
      status: "Mature generic",
      brands: [
        { brand: "Metolar XR", company: "Cipla", doses: ["12.5 mg", "25 mg", "50 mg"], revenue_cr: null, period: "" },
        { brand: "Prolomet XL", company: "Sun Pharma", doses: ["25 mg", "50 mg", "100 mg"], revenue_cr: null, period: "" },
        { brand: "Seloken XL", company: "AstraZeneca", doses: ["25 mg", "50 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Cilnidipine", cls: "CCB", aliases: ["cilni"],
      ind: ["Hypertension"],
      evidence: ["L/N-type calcium channel blockade"],
      usp: "Less pedal oedema than amlodipine",
      status: "Generic",
      brands: [
        { brand: "Cilacar", company: "J B Chemicals", doses: ["5 mg", "10 mg", "20 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Saroglitazar", cls: "GLITAZAR", aliases: ["saro"],
      ind: ["Diabetic dyslipidaemia", "NAFLD / MASLD"],
      evidence: ["PRESS V", "PRESS VI", "EVIDENCES trials"],
      status: "Innovator brands (Zydus)",
      brands: [
        { brand: "Lipaglyn", company: "Zydus", doses: ["4 mg"], revenue_cr: null, period: "" },
        { brand: "Bilypsa", company: "Zydus", doses: ["4 mg"], revenue_cr: null, period: "" }
      ]
    },
    {
      name: "Finerenone", cls: "MRA", aliases: ["fine"],
      ind: ["CKD with type 2 diabetes"],
      evidence: ["FIDELIO-DKD", "FIGARO-DKD"],
      status: "Check current patent status",
      brands: [
        { brand: "Kerendia", company: "Bayer", doses: ["10 mg", "20 mg"], revenue_cr: null, period: "" }
      ]
    }
  ]
};
