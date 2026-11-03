/* Cardio-Diabetic Brand Desk — therapy classes, brand plan rules and PDF output */
(function () {
  "use strict";

  const CLASSES = {
    SGLT2: { label: "SGLT2 inhibitor", seg: "cardio-diabetic", patient: "Adults with type 2 diabetes who also carry cardiovascular or renal risk: obesity, hypertension, heart failure or early CKD.",
      spec: [["Diabetologist", "High", "Largest SGLT2 prescriber base in type 2 diabetes."], ["Consulting Physician (MD Medicine)", "High", "Manages most diabetics with hypertension, CKD and heart failure."], ["Cardiologist", "High", "Heart-failure indication drives cardiac use."], ["Nephrologist", "High", "CKD with or without diabetes is a core indication."], ["Endocrinologist", "Medium", "High-influence KOLs for advocacy and CME."], ["General Practitioner (MBBS)", "Medium", "Continuation prescriptions in tier-2 and tier-3 towns."]] },
    DPP4: { label: "DPP-4 inhibitor", seg: "diabetology", patient: "Adults with type 2 diabetes not at goal on metformin who need a weight-neutral add-on with low hypoglycaemia risk.",
      spec: [["Consulting Physician (MD Medicine)", "High", "Gliptins are core second-line therapy in physician practice."], ["Diabetologist", "High", "High-volume prescribers who set brand preference."], ["General Practitioner (MBBS)", "High", "Gliptin plus metformin is widely continued in GP practice."], ["Endocrinologist", "Medium", "Advocacy and complex-patient use."], ["Nephrologist", "Medium", "Renal-safe options matter in CKD patients."]] },
    SUMET: { label: "Sulfonylurea + biguanide", seg: "diabetology", patient: "Adults with type 2 diabetes needing dependable dual therapy for long-term control.",
      spec: [["General Practitioner (MBBS)", "High", "Highest volume of sulfonylurea plus metformin prescriptions."], ["Consulting Physician (MD Medicine)", "High", "Core first-intensification choice."], ["Diabetologist", "Medium", "Uses with dose titration and influences GPs."]] },
    BIG: { label: "Biguanide", seg: "diabetology", patient: "Adults newly diagnosed with type 2 diabetes or prediabetes.",
      spec: [["General Practitioner (MBBS)", "High", "First-line therapy prescribed everywhere."], ["Consulting Physician (MD Medicine)", "High", "High-volume initiation."], ["Gynaecologist", "Medium", "PCOS use."], ["Diabetologist", "Medium", "Brand preference for SR forms."]] },
    ARB: { label: "Angiotensin receptor blocker", seg: "cardio-diabetic", patient: "Adults with hypertension, especially those with diabetes or proteinuria.",
      spec: [["Consulting Physician (MD Medicine)", "High", "Largest hypertension prescriber base."], ["Cardiologist", "High", "Shapes brand choice and combination use."], ["General Practitioner (MBBS)", "High", "Volume from chronic refills."], ["Diabetologist", "Medium", "Preferred antihypertensive class in diabetics."], ["Nephrologist", "Medium", "Renoprotection in proteinuric CKD."]] },
    CCB: { label: "Calcium channel blocker", seg: "cardiology", patient: "Adults with hypertension needing once-daily control with good tolerability.",
      spec: [["Consulting Physician (MD Medicine)", "High", "Core antihypertensive prescriber."], ["Cardiologist", "High", "Combination therapy decisions."], ["General Practitioner (MBBS)", "High", "Chronic refill volume."], ["Nephrologist", "Medium", "Hypertension in CKD."]] },
    BB: { label: "Beta blocker", seg: "cardiology", patient: "Adults with hypertension, angina, a past heart attack or heart failure.",
      spec: [["Cardiologist", "High", "Post-MI, heart failure and arrhythmia use."], ["Consulting Physician (MD Medicine)", "High", "Hypertension with tachycardia or IHD."], ["General Practitioner (MBBS)", "Medium", "Continuation."]] },
    STATIN: { label: "Statin", seg: "cardiology", patient: "Adults with dyslipidaemia or high ASCVD risk, including most people with diabetes.",
      spec: [["Cardiologist", "High", "Secondary prevention and high-intensity statin use."], ["Consulting Physician (MD Medicine)", "High", "Primary prevention in diabetics and hypertensives."], ["Diabetologist", "Medium", "Most diabetics over 40 are statin candidates."], ["Neurologist", "Medium", "Post-stroke secondary prevention."], ["General Practitioner (MBBS)", "Medium", "Refills."]] },
    ARNI: { label: "ARNI", seg: "cardiology", patient: "Adults with chronic heart failure with reduced ejection fraction.",
      spec: [["Cardiologist", "High", "Initiates heart-failure therapy and owns the treatment pathway."], ["Consulting Physician (MD Medicine)", "Medium", "Continuation and up-titration."], ["Heart-failure clinics", "Low", "Post-discharge patients."]] },
    ANTIPLT: { label: "Antiplatelet", seg: "cardiology", patient: "Adults after acute coronary syndrome or PCI.",
      spec: [["Interventional Cardiologist", "High", "Initiates dual antiplatelet therapy after PCI."], ["Cardiologist", "High", "ACS and secondary prevention."], ["Neurologist", "Medium", "Stroke and TIA prevention."], ["Consulting Physician (MD Medicine)", "Medium", "Continuation."]] },
    GLITAZAR: { label: "Dual PPAR α/γ agonist", seg: "cardio-diabetic", patient: "Adults with diabetic dyslipidaemia or fatty liver disease.",
      spec: [["Diabetologist", "High", "Diabetic dyslipidaemia with high triglycerides."], ["Gastroenterologist / Hepatologist", "High", "NAFLD and MASLD indication."], ["Consulting Physician (MD Medicine)", "Medium", "Metabolic syndrome patients."], ["Endocrinologist", "Medium", "KOL advocacy."]] },
    MRA: { label: "Non-steroidal MRA", seg: "cardio-diabetic", patient: "Adults with CKD associated with type 2 diabetes and albuminuria.",
      spec: [["Nephrologist", "High", "CKD with type 2 diabetes is the core indication."], ["Diabetologist", "High", "Screens and treats diabetic kidney disease."], ["Cardiologist", "Medium", "Cardio-renal outcomes."], ["Consulting Physician (MD Medicine)", "Medium", "Continuation."]] },
    OTHER: { label: "Cardio-metabolic therapy", seg: "cardio-diabetic", patient: "Adults with cardio-metabolic disease.",
      spec: [["Consulting Physician (MD Medicine)", "High", "Broadest cardio-metabolic prescriber base."], ["Diabetologist", "Medium", "Metabolic co-morbidity."], ["Cardiologist", "Medium", "Cardiovascular co-morbidity."], ["General Practitioner (MBBS)", "Medium", "Continuation."]] }
  };

  function guessClass(name) {
    const s = String(name).toLowerCase(), n = s.split("+").length, has = k => s.includes(k);
    if (has("flozin")) return "SGLT2"; if (has("gliptin")) return "DPP4";
    if (has("glimepiride") || has("gliclazide")) return "SUMET"; if (has("metformin")) return "BIG";
    if (has("sacubitril")) return "ARNI"; if (has("sartan")) return "ARB"; if (has("dipine")) return "CCB";
    if (has("olol")) return "BB"; if (has("statin")) return "STATIN"; if (has("grel") || has("aspirin")) return "ANTIPLT";
    if (has("glitazar")) return "GLITAZAR"; if (has("finerenone")) return "MRA"; return "OTHER";
  }

  /* ---------- Brand name ideas ---------- */
  const SUF_C = ["vex", "rex", "lix", "zen", "tra", "nova", "dex", "quil", "ral", "via"];
  const SUF_V = ["ora", "iva", "ent", "ova", "ix", "ica"];
  const isV = c => "aeiou".includes(c);
  function bases(stem) {
    const s = stem.toLowerCase(), out = [s.slice(0, 3)];
    if (isV(s[3] || "")) out.push(s.slice(0, 4));
    return out;
  }
  function nameIdeas(entry, taken, seed) {
    const stems = entry.name.split("+").map(s => s.trim().replace(/[^A-Za-z]/g, "")).filter(Boolean);
    const pool = [];
    const heads = stems.length > 1
      ? bases(stems[0]).map(b => b + stems[1].slice(0, 2).toLowerCase()).concat(bases(stems[0]))
      : bases(stems[0]);
    const maxLen = Math.max(...heads.map(h => h.length));
    for (let i = 0; i < 10; i++) {
      heads.forEach(h => {
        const list = isV(h[h.length - 1]) ? SUF_C : (i % 2 ? SUF_C : SUF_V);
        const suf = list[(i + h.length) % list.length];
        if (isV(h[h.length - 1]) && isV(suf[0])) return;
        let nm = h.charAt(0).toUpperCase() + h.slice(1) + suf;
        if (stems.length === 2 && h.length < maxLen) nm += " Duo";
        if (stems.length >= 3) nm += " Trio";
        const key = nm.toLowerCase().replace(/[^a-z]/g, "");
        if (!taken.has(key) && !pool.includes(nm) && nm.replace(/ .*/, "").length <= 9) pool.push(nm);
      });
    }
    const start = ((seed || 0) * 4) % Math.max(1, pool.length);
    return pool.slice(start, start + 4).concat(pool.slice(0, Math.max(0, start + 4 - pool.length))).slice(0, 4);
  }

  /* ---------- Shared helpers (used by the page and the PDF) ---------- */
  const doseKey = d => String(d).toLowerCase().replace(/\s+/g, "");
  const doseNums = d => (String(d).match(/\d+(\.\d+)?/g) || []).map(Number);
  function sortDoses(list) {
    const seen = new Map();
    list.forEach(d => { const k = doseKey(d); if (!seen.has(k)) seen.set(k, d); });
    return [...seen.values()].sort((a, b) => {
      const xa = /xr|sr|er|xl/i.test(a) ? 1 : 0, xb = /xr|sr|er|xl/i.test(b) ? 1 : 0;
      if (xa !== xb) return xa - xb;
      const na = doseNums(a), nb = doseNums(b);
      for (let i = 0; i < Math.max(na.length, nb.length); i++) { const d = (na[i] || 0) - (nb[i] || 0); if (d) return d; }
      return 0;
    });
  }
  const WEIGHT = { High: 3, Medium: 1.5, Low: 0.5 };
  function effortShare(spec) {
    const tot = spec.reduce((s, x) => s + WEIGHT[x[1]], 0) || 1;
    return spec.map(x => Math.round(WEIGHT[x[1]] / tot * 100));
  }
  function marketStats(ranked) {
    const withRev = ranked.filter(b => b.revenue_cr != null).sort((a, b) => b.revenue_cr - a.revenue_cr);
    return {
      n: ranked.length,
      companies: new Set(ranked.map(b => b.company).filter(Boolean)).size,
      strengths: sortDoses(ranked.flatMap(b => b.doses || [])),
      withRev,
      totalRev: withRev.reduce((s, b) => s + b.revenue_cr, 0),
      periods: [...new Set(withRev.map(b => b.period).filter(Boolean))],
      crowd: ranked.length >= 8 ? "Crowded" : ranked.length >= 4 ? "Competitive" : "Concentrated"
    };
  }

  /* ---------- Plan rules ---------- */
  const ANGLE = { clinical: "Evidence-led", adherence: "Adherence", partnership: "Specialist partner" };

  function buildPlan(entry, ranked, opts) {
    const C = CLASSES[entry.cls] || CLASSES.OTHER;
    const angle = opts.angle || "clinical";
    const bench = ranked.find(b => b.brand === opts.benchmark) || ranked[0] || null;
    const st = marketStats(ranked);
    const ev = (entry.evidence || []).filter(x => !/clinical use|blockade/i.test(x));
    const isFdc = entry.name.includes("+");
    const hi = C.spec.filter(s => s[1] === "High").map(s => plural(s[0]));
    const brand = opts.brand, company = opts.company || "Our company", geo = opts.geo || "Pan-India";
    const benchRank = bench ? ranked.indexOf(bench) + 1 : 0;

    const positioning = {
      clinical: `${brand} is the ${entry.name} brand built on outcome evidence${ev.length ? " (" + ev.slice(0, 2).join(", ") + ")" : ""}: the guideline-aligned choice for ${lc(C.patient)}`,
      adherence: `${brand} keeps patients on ${entry.name} month after month: ${isFdc ? "one tablet in place of " + entry.name.split("+").length + " separate pills" : "simple once-daily dosing"}, backed by a patient support programme.`,
      partnership: `${brand} is the ${entry.name} brand that works alongside ${hi.slice(0, 2).join(" and ")}, with clinic support and education for ${lc(C.patient)}`
    }[angle];

    const summaryCards = [
      { label: "The market", color: COL.insulin, text: `${st.crowd} market with ${st.n} brand${st.n === 1 ? "" : "s"} from ${st.companies} compan${st.companies === 1 ? "y" : "ies"}${bench ? `, led by ${ranked[0].brand}` : ""}${st.totalRev ? `. About Rs ${fmt(st.totalRev)} Cr tracked revenue.` : "."}` },
      { label: "Our play", color: COL.arterial, text: `Launch ${brand} ${geo === "Pan-India" ? "across India" : "in " + geo} with ${ANGLE[angle].toLowerCase()} positioning and ${st.strengths.length ? "all " + st.strengths.length + " strengths" : "the full dose range"}${bench ? `, benchmarked on ${bench.brand}` : ""}.` },
      { label: "Who we target", color: COL.honey, text: `${joinList(hi.slice(0, 3))} first, then medium-priority specialists from month 7.` }
    ];

    const messages = [];
    if (ev.length) messages.push(`Backed by ${ev.slice(0, 3).join(", ")}.`);
    if (entry.usp) messages.push(entry.usp + ".");
    if ((entry.ind || []).length > 1) messages.push(`One brand across ${joinList(entry.ind.slice(0, 3).map(lc))}.`);
    if (angle === "clinical") messages.push("In line with ADA/EASD, RSSDI and ESC/CSI guidance.");
    if (angle === "adherence") messages.push(isFdc ? "Fewer tablets a day, better adherence, better control." : "Once-daily dosing that fits any routine.");
    if (angle === "partnership") messages.push("Clinic tools to track and counsel patients between visits.");
    messages.push(`Start and titrate on one brand: ${st.strengths.length ? st.strengths.slice(0, 4).join(", ") + (st.strengths.length > 4 ? " and more" : "") : "every approved strength"}.`);

    const diff = [
      { t: "Full dose range", d: bench ? `Match ${bench.brand}'s ${(bench.doses || []).length || "full"} strengths so no one switches while titrating.` : "Every approved strength from day one." },
      angle === "adherence"
        ? { t: "Patient programme", d: "Refill reminders, HbA1c and BP card, helpline in regional languages." }
        : { t: "Scientific engagement", d: "Journal clubs, case-based CMEs and a medical query service." },
      { t: "30-day packs", d: "Pack size lines up with the monthly follow-up visit." },
      st.n >= 8 ? { t: "Availability first", d: "Crowded markets are won at the chemist around each core doctor." }
        : { t: "Early KOL advocacy", d: "Build preference while brand choice is still forming." }
    ];

    const share = effortShare(C.spec);
    const specPlan = C.spec.map(([s, p, why], i) => ({ specialty: s, priority: p, why, share: share[i],
      calls: p === "High" ? "2–3" : p === "Medium" ? "1" : "CME", unit: p === "Low" ? "and digital" : "calls a month" }));

    const hasGP = C.spec.some(s => /General Practitioner/.test(s[0]));
    const workstreams = [
      { name: `Launch meetings: ${hi.length ? shortSpec(hi[0]) : "core list"}`, s: 1, e: 2, k: "field" },
      { name: "Stock chemists near core doctors", s: 1, e: 3, k: "trade" },
      { name: "Detailing on positioning and evidence", s: 1, e: 12, k: "field" },
      { name: "Regional CMEs with KOL speakers", s: 4, e: 9, k: "medical" },
      { name: "KOL advisory board (20–30)", s: 4, e: 6, k: "medical" },
      { name: angle === "adherence" ? "Patient support programme" : "Patient education for clinics", s: 4, e: 12, k: "patient" },
      { name: "RCPA tracking of competitor switches", s: 4, e: 12, k: "review" },
      { name: "Extend to medium priority, tier 2/3", s: 7, e: 12, k: "field" },
      { name: hasGP ? "GP continuation programme" : "Hospital formulary listings", s: 7, e: 12, k: "trade" },
      { name: "Approved digital and WhatsApp content", s: 7, e: 12, k: "patient" },
      { name: "Conferences: RSSDI, CSI, API", s: 8, e: 10, k: "medical" },
      { name: "Real-world study with KOL group", s: 10, e: 12, k: "medical" },
      { name: "Year-two plan and line extensions", s: 11, e: 12, k: "review" }
    ];
    const phases = [
      { q: "Q1", focus: "Launch", color: COL.arterial },
      { q: "Q2", focus: "Advocacy", color: COL.insulin },
      { q: "Q3", focus: "Expand reach", color: COL.honey },
      { q: "Q4", focus: "Consolidate", color: COL.teal }
    ];

    const rankTarget = st.n >= 8 ? "Top 5 in molecule" : st.n >= 4 ? "Top 3 in molecule" : "Top 2 in molecule";
    const kpis = [
      ["High-priority prescribers actively prescribing", "80% of core list by month 12", "Monthly"],
      ["Chemist availability in core-doctor clusters", "80%+ by month 3", "Monthly"],
      ["Market rank (AWACS / PharmaTrac)", rankTarget + " by month 12", "Monthly, MAT"],
      ["Prescriptions per prescriber", "Up every quarter", "Monthly"],
      ["RCPA share against top 3 competitors", "Up every quarter", "Quarterly"],
      ["Primary to secondary sales ratio", "Close to 1.0", "Monthly"]
    ];
    const trajectory = {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      series: [
        { name: "Chemist availability", color: COL.honey, v: [40, 65, 80, 82, 84, 85, 86, 87, 88, 89, 90, 90] },
        { name: "Core prescribers prescribing", color: COL.arterial, v: [12, 22, 32, 41, 49, 56, 62, 67, 71, 75, 78, 80] }
      ]
    };

    const risks = [];
    if (bench) risks.push({ t: `Response from ${bench.brand}`, m: `Expect ${bench.company || "the leader"} to step up calls; double call frequency on core doctors for 90 days.`, l: 3, i: 3 });
    if (st.n >= 8) risks.push({ t: "Crowded market", m: "Win on service, availability and patient support, not trade schemes.", l: 3, i: 2 });
    risks.push({ t: "Stock gaps at the chemist", m: "Weekly availability checks in core-doctor clusters.", l: 2, i: 3 });
    risks.push({ t: "Low recall in a long list", m: "Same name, colour and pack across every touchpoint.", l: 2, i: 2 });
    if (/generic|off-patent/i.test(entry.status || "")) risks.push({ t: "Price pressure", m: "Compete on value and service; keep price within DPCO norms.", l: 2, i: 1 });

    return { entry, cls: C, brand, company, geo, angle, bench, benchRank, ranked, stats: st, positioning, patient: C.patient,
      summaryCards, messages: messages.slice(0, 4), diff, specPlan, workstreams, phases, kpis, trajectory, risks: risks.slice(0, 4), date: new Date() };
  }

  function shortSpec(s) { return s.replace(/General Practitioners?/, "GPs").replace(/Consulting Physicians?/, "physicians").replace(/Interventional Cardiologists?/, "interventional cardiologists"); }
  function plural(s) { const t = s.replace(/\s*\(.*?\)/, ""); return /s$/.test(t) ? t : t + "s"; }
  function joinList(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function lc(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function fmt(n) { return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }); }

  /* ---------- PDF ---------- */
  const COL = { ink: [15, 31, 51], arterial: [200, 36, 58], insulin: [47, 91, 211], honey: [233, 168, 59], teal: [18, 140, 126],
    muted: [96, 111, 132], line: [222, 228, 237], pill: [242, 245, 250], white: [255, 255, 255], text: [26, 40, 60] };
  const PALETTE = [COL.arterial, COL.insulin, COL.honey, COL.teal, [124, 77, 196], COL.ink, [150, 160, 175]];
  const KIND = { field: [COL.arterial, "Field force"], medical: [COL.insulin, "Medical and KOL"], trade: [COL.honey, "Trade"], patient: [COL.teal, "Patient and digital"], review: [[150, 160, 175], "Review"] };
  const tint = (c, t) => c.map(v => Math.round(v + (255 - v) * t));
  const clean = s => String(s == null ? "" : s).replace(/₹/g, "Rs ").replace(/[≥]/g, ">=").replace(/[α]/g, "alpha").replace(/[γ]/g, "gamma").replace(/[^\x00-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022]/g, "");

  /* One type scale for the whole document: every piece of text uses one of these. */
  const TYPE = {
    cover: ["bold", 38], title: ["bold", 17], stat: ["bold", 18], lead: ["bold", 12.5],
    h: ["bold", 10], body: ["normal", 9], bodyB: ["bold", 9], small: ["normal", 7.5], smallB: ["bold", 7.5]
  };

  function makePDF(p) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = 595.28, H = 841.89, M = 44, CW = W - M * 2, TOP = 70, BOTTOM = H - 56;
    let y = TOP;

    const fill = c => doc.setFillColor(c[0], c[1], c[2]);
    const stroke = c => doc.setDrawColor(c[0], c[1], c[2]);
    const ink = c => doc.setTextColor(c[0], c[1], c[2]);
    const type = (k, c) => { doc.setFont("helvetica", TYPE[k][0]); doc.setFontSize(TYPE[k][1]); if (c) ink(c); };
    const LH = k => TYPE[k][1] * 1.4;
    const wrap = (t, w, k) => { type(k); return doc.splitTextToSize(clean(t), w); };
    /* Draws text with its top edge at `top`; returns the height used. */
    const block = (t, x, top, w, k, c, opt) => {
      const lines = Array.isArray(t) ? t : wrap(t, w, k); type(k, c);
      lines.forEach((l, i) => doc.text(l, x, top + TYPE[k][1] * 0.8 + i * LH(k), opt));
      return lines.length * LH(k);
    };
    const fit = (t, w, k, min) => { let s = TYPE[k][1]; doc.setFont("helvetica", TYPE[k][0]); doc.setFontSize(s); while (doc.getTextWidth(clean(t)) > w && s > min) { s -= 0.5; doc.setFontSize(s); } return s; };
    const card = (x, top, w, h, c, r) => { fill(c || COL.pill); doc.roundedRect(x, top, w, h, r == null ? 7 : r, r == null ? 7 : r, "F"); };
    const outline = (x, top, w, h, r) => { stroke(COL.line); doc.setLineWidth(0.8); doc.roundedRect(x, top, w, h, r || 7, r || 7, "S"); };

    const newPage = () => { doc.addPage(); y = TOP; };
    const need = h => { if (y + h > BOTTOM) newPage(); };
    const section = (title, keep) => {
      need(40 + (keep || 90));
      fill(COL.arterial); doc.rect(M, y + 2, 4, 16, "F");
      block(title, M + 13, y, CW, "title", COL.ink);
      y += 32;
    };
    const sub = (t, note) => {
      block(t, M, y, CW, "h", COL.ink);
      if (note) { type("small", COL.muted); doc.text(clean(note), M + CW, y + 8, { align: "right" }); }
      y += 18;
    };

    const st = p.stats;

    /* ===== Cover ===== */
    const CH = 520;
    fill(COL.ink); doc.rect(0, 0, W, CH, "F");
    stroke([33, 52, 78]); doc.setLineWidth(0.4);
    for (let gx = 0; gx < W; gx += 22) doc.line(gx, 0, gx, CH);
    for (let gy = 0; gy < CH; gy += 22) doc.line(0, gy, W, gy);
    stroke(COL.arterial); doc.setLineWidth(2.2);
    const tr = [[0, 430], [150, 430], [165, 430], [176, 370], [190, 480], [204, 410], [214, 430], [330, 430], [345, 430], [356, 370], [370, 480], [384, 410], [394, 430], [470, 430], [520, 402], [560, 392], [W, 394]];
    for (let i = 1; i < tr.length; i++) doc.line(tr[i - 1][0], tr[i - 1][1], tr[i][0], tr[i][1]);
    block("Brand plan", M, 96, CW, "h", COL.honey);
    const fs = fit(p.brand, CW, "cover", 22); doc.setTextColor(255, 255, 255); doc.text(clean(p.brand), M, 122 + fs * 0.8);
    let cy = 122 + fs * 1.25;
    cy += block(`${p.entry.name}  /  ${p.cls.label}`, M, cy, CW, "lead", [205, 214, 230]) + 8;
    block(`${p.company}   |   ${p.geo}   |   ${p.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, M, cy, CW, "body", [160, 175, 198]);

    /* At a glance */
    let gy = CH + 40;
    block("At a glance", M, gy, CW, "h", COL.ink); gy += 20;
    const glance = [
      ["Brands in market", String(st.n), COL.insulin],
      ["Benchmark", p.bench ? p.bench.brand : "None set", COL.honey],
      [st.totalRev ? "Tracked revenue" : "Strengths on market", st.totalRev ? `Rs ${fmt(st.totalRev)} Cr` : String(st.strengths.length || "–"), COL.teal],
      ["Positioning", ANGLE[p.angle], COL.arterial]
    ];
    const gw = (CW - 30) / 4;
    glance.forEach(([l, v, c], i) => {
      const x = M + i * (gw + 10);
      card(x, gy, gw, 66, COL.pill); fill(c); doc.rect(x, gy + 14, 3, 18, "F");
      const s = fit(v, gw - 26, "stat", 10); ink(COL.ink); doc.text(clean(v), x + 13, gy + 22 + s * 0.4);
      block(l, x + 13, gy + 42, gw - 20, "small", COL.muted);
    });
    gy += 104;
    block("Inside this plan", M, gy, CW, "h", COL.ink); gy += 22;
    const toc = ["Executive summary", "Market landscape", "Positioning", "Messages and differentiation", "Specialist targeting", "12-month plan", "KPIs and targets", "Risks and mitigation", "Compliance"];
    toc.forEach((t, i) => {
      const col = i % 3, row = Math.floor(i / 3), x = M + col * (CW / 3), ty = gy + row * 24;
      fill(COL.arterial); doc.circle(x + 3, ty + 4, 2.2, "F");
      block(t, x + 12, ty - 1.5, CW / 3 - 14, "body", COL.text);
    });
    fill(COL.arterial); doc.rect(M, H - 62, 32, 3, "F");
    block("Prepared with Cardio-Diabetic Brand Desk. A starting draft for internal planning.", M, H - 52, CW, "small", COL.muted);

    /* ===== Executive summary ===== */
    newPage();
    section("Executive summary", 100);
    {
      const cw = (CW - 20) / 3;
      const bodies = p.summaryCards.map(c => wrap(c.text, cw - 26, "body"));
      const ch = 38 + Math.max(...bodies.map(b => b.length)) * LH("body") + 10;
      p.summaryCards.forEach((c, i) => {
        const x = M + i * (cw + 10);
        card(x, y, cw, ch, COL.pill); fill(c.color); doc.rect(x, y, cw, 3, "F");
        block(c.label, x + 13, y + 14, cw - 26, "h", c.color === COL.honey ? [168, 112, 20] : c.color);
        block(bodies[i], x + 13, y + 32, cw - 26, "body", COL.text);
      });
      y += ch + 26;
    }

    /* ===== Market landscape ===== */
    section("Market landscape", 160);
    {
      const tiles = [["Brands tracked", String(st.n)], ["Companies", String(st.companies)], ["Strengths on market", String(st.strengths.length || "–")]];
      tiles.push(st.totalRev ? ["Tracked revenue", `Rs ${fmt(st.totalRev)} Cr`] : ["Market intensity", st.crowd]);
      const tw = (CW - 30) / 4;
      tiles.forEach(([l, v], i) => {
        const x = M + i * (tw + 10);
        outline(x, y, tw, 54);
        const s = fit(v, tw - 24, "stat", 10); ink(COL.ink); doc.text(clean(v), x + 12, y + 18 + s * 0.45);
        block(l, x + 12, y + 35, tw - 20, "small", COL.muted);
      });
      y += 54 + 22;
    }

    /* Revenue chart: only when two or more brands have revenue (otherwise there is nothing to compare). */
    if (st.withRev.length >= 2) {
      const rows = st.withRev, maxV = rows[0].revenue_cr || 1, lw = 104, vw = 54, bwid = CW - lw - vw;
      need(40 + rows.length * 18 + 70);
      sub("Revenue by brand (Rs Cr)", st.periods.length ? st.periods.join("; ") : "");
      rows.forEach((b, i) => {
        const isB = p.bench && b.brand === p.bench.brand;
        block(b.brand, M, y + 1, lw - 8, isB ? "bodyB" : "body", COL.text);
        fill(COL.pill); doc.roundedRect(M + lw, y + 2, bwid, 10, 3, 3, "F");
        fill(isB ? COL.honey : i === 0 ? COL.arterial : COL.insulin);
        doc.roundedRect(M + lw, y + 2, Math.max(6, bwid * b.revenue_cr / maxV), 10, 3, 3, "F");
        block(fmt(b.revenue_cr), M + CW, y + 1, vw, "bodyB", COL.ink, { align: "right" });
        y += 18;
      });
      y += 10;
      sub("Share of tracked revenue");
      let x = M; const tot = st.totalRev;
      rows.forEach((b, i) => { const w = CW * b.revenue_cr / tot; fill(PALETTE[i % PALETTE.length]); doc.rect(x, y, w, 14, "F"); if (w > 30) block(Math.round(b.revenue_cr / tot * 100) + "%", x + 5, y + 3, w, "smallB", COL.white); x += w; });
      y += 22;
      let lx = M;
      rows.forEach((b, i) => { type("small"); const w = doc.getTextWidth(clean(b.brand)) + 22; if (lx + w > M + CW) { lx = M; y += 13; } fill(PALETTE[i % PALETTE.length]); doc.rect(lx, y + 1, 7, 7, "F"); block(b.brand, lx + 11, y, w, "small", COL.text); lx += w; });
      y += 26;
    }

    /* Strength coverage matrix: every cell is filled, so there are no empty columns. */
    if (p.ranked.length) {
      const cols = st.strengths.slice(0, 10), extra = st.strengths.length - cols.length;
      const allMg = cols.length && cols.every(d => /mg$/i.test(d.trim()));
      const lab = d => allMg ? d.replace(/\s*mg$/i, "") : d;
      const rk = 20, nameW = 150, cntW = 46, dotW = CW - rk - nameW - cntW, colW = cols.length ? dotW / cols.length : dotW;
      const heads = cols.map(d => wrap(lab(d), colW - 4, "smallB"));
      const hh = Math.max(1, ...heads.map(h => h.length)) * LH("smallB") + 12;
      const rowH = 28;
      need(30 + hh + Math.min(p.ranked.length + 1, 6) * rowH);
      sub("Who sells which strengths", allMg ? "Strengths in mg" + (extra > 0 ? `, ${extra} more not shown` : "") : extra > 0 ? `${extra} more strengths not shown` : "");
      const header = () => {
        card(M, y, CW, hh, COL.ink, 5);
        block("Brand", M + rk, y + 6 + (hh - 12 - LH("smallB")) / 2, nameW, "smallB", COL.white);
        heads.forEach((h, i) => block(h, M + rk + nameW + i * colW + colW / 2, y + 6 + (hh - 12 - h.length * LH("smallB")) / 2, colW, "smallB", COL.white, { align: "center" }));
        block("Count", M + CW - 8, y + 6 + (hh - 12 - LH("smallB")) / 2, cntW, "smallB", COL.white, { align: "right" });
        y += hh + 2;
      };
      header();
      const keys = cols.map(doseKey);
      const row = (rank, name, co, have, accent, isOurs) => {
        if (y + rowH > BOTTOM) { newPage(); header(); }
        if (isOurs) { card(M, y, CW, rowH, tint(COL.arterial, 0.9), 5); }
        else if (rank % 2 === 1) { card(M, y, CW, rowH, COL.pill, 5); }
        if (accent) { fill(accent); doc.rect(M, y, 3, rowH, "F"); }
        block(isOurs ? "" : String(rank), M + 8, y + 9, rk, "smallB", COL.muted);
        block(name, M + rk, y + 5, nameW - 8, "bodyB", isOurs ? COL.arterial : COL.ink);
        block(co, M + rk, y + 16, nameW - 8, "small", COL.muted);
        if (!have.size) block("Strengths not listed", M + rk + nameW, y + 9, dotW, "small", COL.muted);
        else keys.forEach((k, i) => {
          const cx = M + rk + nameW + i * colW + colW / 2, cyy = y + rowH / 2;
          if (have.has(k)) { fill(isOurs ? COL.arterial : COL.insulin); doc.circle(cx, cyy, 4, "F"); }
          else { stroke(COL.line); doc.setLineWidth(1); doc.circle(cx, cyy, 3.2, "S"); }
        });
        block(String(have.size), M + CW - 8, y + 9, cntW, "bodyB", COL.ink, { align: "right" });
        y += rowH;
      };
      p.ranked.forEach((b, i) => row(i + 1, b.brand, b.company + (p.bench && b.brand === p.bench.brand ? "  (benchmark)" : ""),
        new Set((b.doses || []).map(doseKey)), p.bench && b.brand === p.bench.brand ? COL.honey : null, false));
      y += 4;
      row(0, p.brand, "Our launch range", new Set(st.strengths.map(doseKey)), COL.arterial, true);
      y += 8;
      block("Filled dot: strength available.", M, y, CW, "small", COL.muted);
      y += 24;
    }

    /* ===== Positioning ===== */
    section("Positioning", 200);
    {
      const pl = wrap(p.positioning, CW - 70, "lead"), ph = pl.length * LH("lead") + 40;
      card(M, y, CW, ph, COL.ink, 9);
      type("cover", COL.honey); doc.text("\u201C", M + 16, y + 44);
      block(pl, M + 50, y + 20, CW - 70, "lead", COL.white);
      y += ph + 12;

      const hw = (CW - 12) / 2;
      const pt = wrap(p.patient, hw - 66, "body");
      const bh = Math.max(84, 34 + pt.length * LH("body") + 14);
      card(M, y, hw, bh, COL.pill);
      fill(tint(COL.insulin, 0.82)); doc.circle(M + 30, y + 34, 17, "F");
      fill(COL.insulin); doc.circle(M + 30, y + 28, 5.5, "F"); doc.roundedRect(M + 21, y + 36, 18, 9, 4, 4, "F");
      block("Target patient", M + 58, y + 14, hw - 66, "h", COL.insulin);
      block(pt, M + 58, y + 32, hw - 66, "body", COL.text);

      const bx = M + hw + 12;
      card(bx, y, hw, bh, COL.pill);
      block("Benchmark to beat", bx + 16, y + 14, hw - 32, "h", [168, 112, 20]);
      if (p.bench) {
        const s = fit(p.bench.brand, hw - 32, "stat", 11); ink(COL.ink); doc.text(clean(p.bench.brand), bx + 16, y + 32 + s * 0.8);
        const chips = [p.bench.company, `Rank ${p.benchRank} of ${st.n}`, `${(p.bench.doses || []).length} strengths`];
        if (p.bench.revenue_cr != null) chips.push(`Rs ${fmt(p.bench.revenue_cr)} Cr`);
        let chx = bx + 16, chy = y + bh - 24;
        chips.filter(Boolean).forEach(t => { type("smallB"); const w = doc.getTextWidth(clean(t)) + 14; if (chx + w > bx + hw - 10) return; card(chx, chy, w, 15, COL.white, 7); block(t, chx + 7, chy + 3.5, w, "smallB", COL.text); chx += w + 5; });
      } else block("No brands in the data yet.", bx + 16, y + 34, hw - 32, "body", COL.muted);
      y += bh + 26;
    }

    /* ===== Messages and differentiation ===== */
    section("Messages and differentiation", 160);
    {
      sub("Key messages");
      const cw = (CW - 12) / 2;
      for (let r = 0; r < p.messages.length; r += 2) {
        const pair = p.messages.slice(r, r + 2), bodies = pair.map(m => wrap(m, cw - 48, "body"));
        const rh = Math.max(40, Math.max(...bodies.map(b => b.length)) * LH("body") + 22);
        need(rh + 10);
        pair.forEach((m, i) => {
          const x = M + i * (cw + 12);
          outline(x, y, cw, rh);
          fill(COL.arterial); doc.circle(x + 20, y + rh / 2, 9, "F");
          block(String(r + i + 1), x + 20, y + rh / 2 - 4.5, 20, "smallB", COL.white, { align: "center" });
          block(bodies[i], x + 38, y + (rh - bodies[i].length * LH("body")) / 2, cw - 48, "body", COL.text);
        });
        y += rh + 8;
      }
      y += 12;
      need(30 + 2 * 66);
      sub("Differentiation levers");
      const icons = [COL.insulin, COL.teal, COL.honey, COL.arterial];
      for (let r = 0; r < p.diff.length; r += 2) {
        const pair = p.diff.slice(r, r + 2), bodies = pair.map(d => wrap(d.d, cw - 58, "body"));
        const rh = Math.max(58, 30 + Math.max(...bodies.map(b => b.length)) * LH("body") + 12);
        need(rh + 10);
        pair.forEach((d, i) => {
          const x = M + i * (cw + 12), c = icons[(r + i) % 4];
          card(x, y, cw, rh, COL.pill);
          fill(tint(c, 0.8)); doc.roundedRect(x + 12, y + 12, 28, 28, 6, 6, "F");
          fill(c); doc.roundedRect(x + 20, y + 20, 12, 12, 3, 3, "F");
          block(d.t, x + 50, y + 13, cw - 58, "bodyB", COL.ink);
          block(bodies[i], x + 50, y + 28, cw - 58, "body", COL.muted);
        });
        y += rh + 8;
      }
      y += 16;
    }

    /* ===== Specialist targeting ===== */
    section("Specialist targeting", 200);
    {
      sub("Share of field effort", "Weighted by priority");
      let x = M;
      p.specPlan.forEach((s, i) => { const w = CW * s.share / 100; fill(PALETTE[i % PALETTE.length]); doc.rect(x, y, w, 20, "F"); if (w > 28) block(s.share + "%", x + 6, y + 6, w, "smallB", COL.white); x += w; });
      y += 34;

      const pc = { High: COL.arterial, Medium: COL.honey, Low: COL.insulin };
      const nameW = 200, barW = 120, maxS = Math.max(...p.specPlan.map(s => s.share));
      p.specPlan.forEach((s, i) => {
        const why = wrap(s.why, nameW - 22, "small");
        const rh = Math.max(46, 26 + why.length * LH("small") + 8);
        need(rh + 6);
        outline(M, y, CW, rh);
        fill(PALETTE[i % PALETTE.length]); doc.rect(M, y + 10, 3, rh - 20, "F");
        block(s.specialty, M + 14, y + 9, nameW, "bodyB", COL.ink);
        block(why, M + 14, y + 23, nameW - 22, "small", COL.muted);
        const px = M + 14 + nameW;
        card(px, y + rh / 2 - 8, 52, 16, pc[s.priority], 8);
        block(s.priority, px + 26, y + rh / 2 - 4, 52, "smallB", s.priority === "Medium" ? COL.ink : COL.white, { align: "center" });
        const bx = px + 68;
        fill(COL.pill); doc.roundedRect(bx, y + rh / 2 - 4, barW, 8, 3, 3, "F");
        fill(PALETTE[i % PALETTE.length]); doc.roundedRect(bx, y + rh / 2 - 4, Math.max(5, barW * s.share / maxS), 8, 3, 3, "F");
        block(s.share + "%", bx + barW + 6, y + rh / 2 - 5, 30, "smallB", COL.ink);
        block(s.calls, M + CW - 12, y + rh / 2 - 11, 60, "bodyB", COL.ink, { align: "right" });
        block(s.unit, M + CW - 12, y + rh / 2 + 1, 70, "small", COL.muted, { align: "right" });
        y += rh + 6;
      });
      y += 22;
    }

    /* ===== 12-month plan (Gantt) ===== */
    section("12-month plan", 360);
    {
      const lw = 178, gw = CW - lw, mw = gw / 12, rowH = 19;
      p.phases.forEach((ph, i) => {
        const x = M + lw + i * 3 * mw;
        fill(ph.color); doc.roundedRect(x + 1, y, 3 * mw - 2, 22, 4, 4, "F");
        block(`${ph.q}  ${ph.focus}`, x + 3 * mw / 2, y + 7, 3 * mw, "smallB", ph.color === COL.honey ? COL.ink : COL.white, { align: "center" });
      });
      block("Workstream", M, y + 7, lw, "smallB", COL.muted);
      y += 28;
      for (let m = 0; m < 12; m++) block("M" + (m + 1), M + lw + m * mw + mw / 2, y, mw, "small", COL.muted, { align: "center" });
      y += 14;
      const top = y;
      p.workstreams.forEach((w, i) => {
        if (i % 2 === 0) card(M, y, CW, rowH, COL.pill, 3);
        block(w.name, M + 8, y + 5, lw - 12, "body", COL.text);
        const c = KIND[w.k][0];
        fill(c); doc.roundedRect(M + lw + (w.s - 1) * mw + 2, y + 5, (w.e - w.s + 1) * mw - 4, 9, 4, 4, "F");
        y += rowH;
      });
      stroke(COL.line); doc.setLineWidth(0.5);
      [3, 6, 9].forEach(q => doc.line(M + lw + q * mw, top - 2, M + lw + q * mw, y));
      y += 12;
      let lx = M + lw;
      Object.values(KIND).forEach(([c, l]) => { type("small"); const w = doc.getTextWidth(l) + 24; fill(c); doc.roundedRect(lx, y + 1, 12, 6, 3, 3, "F"); block(l, lx + 16, y - 0.5, w, "small", COL.muted); lx += w + 4; });
      y += 30;
    }

    /* ===== KPIs and targets ===== */
    section("KPIs and targets", 240);
    {
      sub("Target trajectory, % of goal", "Plan targets, not forecasts");
      const ch = 112, lx = M + 26, cw = CW - 26 - 110, ty = y + 6;
      type("small", COL.muted);
      [0, 25, 50, 75, 100].forEach(v => {
        const yy = ty + ch - ch * v / 100;
        stroke(COL.line); doc.setLineWidth(0.5); doc.line(lx, yy, lx + cw, yy);
        doc.text(String(v), lx - 6, yy + 2.5, { align: "right" });
      });
      const xs = i => lx + cw * i / 11;
      p.trajectory.months.forEach((m, i) => { if (i % 2 === 0 || i === 11) doc.text("M" + m, xs(i), ty + ch + 12, { align: "center" }); });
      p.trajectory.series.forEach(s => {
        stroke(s.color); doc.setLineWidth(2);
        for (let i = 1; i < s.v.length; i++) doc.line(xs(i - 1), ty + ch - ch * s.v[i - 1] / 100, xs(i), ty + ch - ch * s.v[i] / 100);
        fill(s.color); s.v.forEach((v, i) => { if (i === 2 || i === 11) doc.circle(xs(i), ty + ch - ch * v / 100, 3, "F"); });
      });
      let ly = ty + 20;
      p.trajectory.series.forEach(s => {
        fill(s.color); doc.roundedRect(lx + cw + 18, ly + 2, 14, 4, 2, 2, "F");
        ly += block(s.name, lx + cw + 36, ly - 2, 74, "small", COL.text) + 2;
        ly += block(`${s.v[11]}% by M12`, lx + cw + 36, ly - 2, 74, "smallB", COL.ink) + 12;
      });
      y = ty + ch + 34;

      need(18 + 22 + p.kpis.length * 24);
      sub("What we track");
      const c1 = CW * 0.5, c2 = CW * 0.32;
      card(M, y, CW, 20, COL.ink, 5);
      block("KPI", M + 10, y + 6, c1, "smallB", COL.white);
      block("Target", M + 10 + c1, y + 6, c2, "smallB", COL.white);
      block("Review", M + CW - 10, y + 6, CW - c1 - c2, "smallB", COL.white, { align: "right" });
      y += 22;
      p.kpis.forEach(([k, t, f], i) => {
        const kl = wrap(k, c1 - 16, "body"), rh = Math.max(22, kl.length * LH("body") + 10);
        need(rh);
        if (i % 2 === 1) card(M, y, CW, rh, COL.pill, 4);
        block(kl, M + 10, y + 5, c1 - 16, "body", COL.text);
        block(t, M + 10 + c1, y + 5, c2 - 8, "bodyB", COL.ink);
        block(f, M + CW - 10, y + 5, CW - c1 - c2, "body", COL.muted, { align: "right" });
        y += rh;
      });
      y += 26;
    }

    /* ===== Risks ===== */
    section("Risks and mitigation", 160);
    {
      const sz = 120, gx = M + 22, top = y;
      const cell = sz / 3;
      for (let li = 0; li < 3; li++) for (let ii = 0; ii < 3; ii++) {
        const sev = li + ii; fill(sev >= 3 ? tint(COL.arterial, 0.75) : sev >= 2 ? tint(COL.honey, 0.7) : tint(COL.teal, 0.82));
        doc.rect(gx + ii * cell + 1, top + (2 - li) * cell + 1, cell - 2, cell - 2, "F");
      }
      type("small", COL.muted);
      doc.text("Impact", gx + sz / 2, top + sz + 13, { align: "center" });
      doc.text("Likelihood", gx - 8, top + sz / 2, { angle: 90, align: "center" });
      const placed = {};
      p.risks.forEach((r, i) => {
        const key = r.l + "-" + r.i, k = placed[key] = (placed[key] || 0) + 1;
        const cx = gx + (r.i - 1) * cell + cell / 2 + (k - 1) * 14 - (k > 1 ? 7 : 0), cyy = top + (3 - r.l) * cell + cell / 2;
        fill(COL.ink); doc.circle(cx, cyy, 8, "F");
        block(String(i + 1), cx, cyy - 4.5, 16, "smallB", COL.white, { align: "center" });
      });
      let ry = top, rx = gx + sz + 26, rw = M + CW - rx;
      p.risks.forEach((r, i) => {
        fill(COL.ink); doc.circle(rx + 8, ry + 7, 8, "F");
        block(String(i + 1), rx + 8, ry + 2.5, 16, "smallB", COL.white, { align: "center" });
        block(r.t, rx + 24, ry, rw - 24, "bodyB", COL.ink);
        ry += 14 + block(r.m, rx + 24, ry + 13, rw - 24, "body", COL.muted) + 8;
      });
      y = Math.max(top + sz + 22, ry) + 20;
    }

    /* ===== Compliance ===== */
    section("Compliance", 50);
    {
      const t = wrap("All promotion follows UCPMP 2024: no gifts, travel or hospitality to healthcare professionals; CMEs in approved settings with full disclosure; claims limited to approved prescribing information.", CW - 30, "body");
      const h = t.length * LH("body") + 20;
      card(M, y, CW, h, tint(COL.teal, 0.88)); fill(COL.teal); doc.rect(M, y, 3, h, "F");
      block(t, M + 16, y + 10, CW - 30, "body", COL.text);
      y += h;
    }

    /* Headers and footers */
    const pages = doc.getNumberOfPages();
    for (let i = 2; i <= pages; i++) {
      doc.setPage(i);
      fill(COL.ink); doc.rect(0, 0, W, 5, "F");
      block(p.brand, M, 28, CW / 2, "bodyB", COL.ink);
      block(p.entry.name, W - M, 28, CW / 2, "small", COL.muted, { align: "right" });
      stroke(COL.line); doc.setLineWidth(0.6); doc.line(M, 46, W - M, 46); doc.line(M, H - 38, W - M, H - 38);
      block(`${p.company}, confidential draft`, M, H - 30, CW / 2, "small", COL.muted);
      block(`Page ${i} of ${pages}`, W - M, H - 30, CW / 2, "small", COL.muted, { align: "right" });
    }
    return doc;
  }

  function savePDF(p) { makePDF(p).save(`${p.brand.replace(/[^A-Za-z0-9]+/g, "-")}-brand-plan.pdf`); }

  window.BrandPlan = { CLASSES, guessClass, nameIdeas, buildPlan, makePDF, savePDF, sortDoses, doseKey, effortShare, marketStats };
})();
