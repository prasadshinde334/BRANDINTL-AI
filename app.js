/* Cardio-Diabetic Brand Desk — page logic */
(function () {
  "use strict";
  const BP = window.BrandPlan;
  const BASE = (window.CDBD_DATA && window.CDBD_DATA.molecules) || [];
  const KEY = "cdbd-imported-v2";
  const $ = id => document.getElementById(id);
  const norm = s => String(s || "").toLowerCase().replace(/hydrochloride|hcl|succinate|\(.*?\)/g, " ").replace(/[^a-z0-9+]+/g, " ").replace(/\s*\+\s*/g, "+").replace(/\s+/g, " ").trim();
  const partsKey = s => norm(s).split("+").map(x => x.trim()).filter(Boolean).sort().join("+");
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = String(text); return e; };
  const clear = n => { while (n.firstChild) n.removeChild(n.firstChild); };
  const num = x => { if (x == null || x === "") return null; const v = Number(String(x).replace(/[₹,\s]/g, "")); return isFinite(v) ? v : null; };
  const fmt = n => Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* ---------- Data (built-in + imported) ---------- */
  function loadImported() { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch (e) { return []; } }
  function saveImported(rows) { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { } }
  let imported = loadImported();

  function buildDB() {
    const db = JSON.parse(JSON.stringify(BASE));
    imported.forEach(r => {
      let m = db.find(x => partsKey(x.name) === partsKey(r.molecule));
      if (!m) { m = { name: r.molecule, cls: BP.guessClass(r.molecule), aliases: [], ind: [], evidence: [], status: "", brands: [] }; db.push(m); }
      let b = m.brands.find(x => norm(x.brand) === norm(r.brand));
      if (!b) { b = { brand: r.brand, company: r.company || "", doses: [], revenue_cr: null, period: "" }; m.brands.push(b); }
      if (r.company) b.company = r.company;
      if (r.doses && r.doses.length) b.doses = r.doses;
      if (r.revenue_cr != null) b.revenue_cr = r.revenue_cr;
      if (r.period) b.period = r.period;
    });
    return db;
  }
  let DB = buildDB();

  function ranked(m) {
    return m.brands.map((b, i) => Object.assign({ _i: i }, b))
      .sort((a, b) => ((b.revenue_cr ?? -1) - (a.revenue_cr ?? -1)) || (a._i - b._i))
      .slice(0, 10);
  }
  function find(q) {
    const n = norm(q), k = partsKey(q); if (!n) return null;
    return DB.find(m => partsKey(m.name) === k)
      || DB.find(m => (m.aliases || []).some(a => norm(a) === n))
      || DB.find(m => m.brands.some(b => norm(b.brand) === n || norm(b.brand).replace(/ /g, "") === n.replace(/ /g, "")))
      || DB.find(m => norm(m.name).startsWith(n) || m.brands.some(b => norm(b.brand).startsWith(n)));
  }

  /* ---------- Shelf ---------- */
  const GROUPS = [
    { title: "Diabetology", color: "var(--insulin)", test: c => ["DPP4", "SUMET", "BIG"].includes(c) },
    { title: "Cardio-diabetic", color: "var(--honey)", test: c => ["SGLT2", "GLITAZAR", "MRA"].includes(c) },
    { title: "Cardiology", color: "var(--arterial)", test: c => !["DPP4", "SUMET", "BIG", "SGLT2", "GLITAZAR", "MRA"].includes(c) }
  ];
  function renderShelf() {
    const g = $("shelfGroups"); clear(g);
    GROUPS.forEach(gr => {
      const items = DB.filter(m => gr.test(m.cls)).sort((a, b) => a.name.localeCompare(b.name));
      if (!items.length) return;
      const box = el("div", "shelf-group"), h = el("h3");
      box.style.setProperty("--c", gr.color);
      h.append(document.createTextNode(gr.title), el("span", "shelf-count", items.length));
      const chips = el("div", "shelf-chips");
      items.forEach(m => { const c = el("button", "chip"); c.append(el("i", "cap"), document.createTextNode(m.name)); c.type = "button"; c.dataset.name = m.name; c.setAttribute("aria-pressed", "false"); c.onclick = () => { $("q").value = m.name; show(m); }; chips.appendChild(c); });
      box.append(h, chips); g.appendChild(box);
    });
    const dl = $("molList"); clear(dl);
    DB.forEach(m => { const o = el("option"); o.value = m.name; dl.appendChild(o); m.brands.forEach(b => { const ob = el("option"); ob.value = b.brand; dl.appendChild(ob); }); });
    const nb = DB.reduce((s, m) => s + m.brands.length, 0), nr = DB.reduce((s, m) => s + m.brands.filter(b => b.revenue_cr != null).length, 0);
    $("dataStat").textContent = `${DB.length} molecules, ${nb} brands, ${nr} with revenue${imported.length ? `, ${imported.length} imported rows in this browser` : ""}`;
    countUp($("monMol"), DB.length); countUp($("monBrands"), nb);
    $("monVer").textContent = "Data " + ((window.CDBD_DATA && window.CDBD_DATA.version) || "");
  }

  function countUp(node, to) {
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.requestAnimationFrame) { node.textContent = to; return; }
    const t0 = performance.now(), dur = 900;
    const step = now => { const k = Math.min(1, (now - t0) / dur); node.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- Results ---------- */
  let current = null;
  $("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    const q = $("q").value.trim();
    if (!q) { $("searchMsg").textContent = "Type a molecule, combination or brand name."; return; }
    const m = find(q);
    if (!m) { $("searchMsg").textContent = `“${q}” isn’t in the data yet. Add it to assets/js/data.js or import a CSV that includes it.`; return; }
    show(m);
  });

  function show(m) {
    if (!current || current.name !== m.name) window.CDBD_BENCH = null;
    current = m; $("searchMsg").textContent = "";
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.name === m.name)));
    const C = BP.CLASSES[m.cls] || BP.CLASSES.OTHER;
    const grp = GROUPS.find(g => g.test(m.cls)) || GROUPS[2];
    $("results").style.setProperty("--seg", grp.color);
    const mc = $("molClass"); clear(mc);
    mc.append(el("span", "tag tag-seg", grp.title), el("span", "tag", C.label), el("span", "tag", m.name.includes("+") ? "Fixed-dose combination" : "Single molecule"));
    $("molName").textContent = m.name;
    $("molStatus").textContent = m.status || "";
    const ind = $("molInd"); clear(ind); (m.ind || []).forEach(t => ind.appendChild(el("li", "", t)));
    const ev = $("molEvidence"); clear(ev); (m.evidence || []).forEach(t => ev.appendChild(el("li", "", t)));
    if (!(m.evidence || []).length) ev.appendChild(el("li", "", "Add evidence in data.js"));

    const r = ranked(m), st = BP.marketStats(r);
    const PAL = ["var(--arterial)", "var(--insulin)", "var(--honey)", "var(--teal)", "var(--violet)", "var(--ink-soft)", "var(--grey)"];

    /* Stat strip */
    const stats = $("molStats"); clear(stats);
    [["Brands tracked", st.n], ["Companies", st.companies], ["Strengths on market", st.strengths.length || "–"],
     st.totalRev ? ["Tracked revenue", "₹" + fmt(st.totalRev) + " Cr"] : ["Market intensity", st.crowd]]
      .forEach(([l, v]) => { const d = el("div", "stat"); d.append(el("div", "stat-v", v), el("div", "stat-l", l)); stats.appendChild(d); });

    /* Revenue chart: only when there is something to compare */
    const showRev = st.withRev.length >= 2;
    $("revBlock").hidden = !showRev;
    if (showRev) {
      const bars = $("revBars"), share = $("revShare"), leg = $("revLegend"); clear(bars); clear(share); clear(leg);
      $("revPeriod").textContent = st.periods.length ? "₹ Cr, " + st.periods.join("; ") : "₹ Cr";
      const max = st.withRev[0].revenue_cr || 1;
      st.withRev.forEach((b, i) => {
        const row = el("div", "bar-row"), track = el("div", "bar-track"), f = el("span");
        f.style.width = Math.max(2, b.revenue_cr / max * 100) + "%"; f.style.background = i === 0 ? "var(--arterial)" : "var(--insulin)";
        track.appendChild(f); row.append(el("div", "bar-name", b.brand), track, el("div", "bar-val", fmt(b.revenue_cr))); bars.appendChild(row);
        const pct = b.revenue_cr / st.totalRev * 100, seg = el("span", "", pct >= 7 ? Math.round(pct) + "%" : "");
        seg.style.width = pct + "%"; seg.style.background = PAL[i % PAL.length]; seg.title = `${b.brand}: ${Math.round(pct)}%`; share.appendChild(seg);
        const li = el("span", "leg"), sw = el("i"); sw.style.background = PAL[i % PAL.length]; li.append(sw, document.createTextNode(b.brand)); leg.appendChild(li);
      });
    }

    /* Strength matrix: every cell has a value, so no empty columns */
    const tbl = $("matrix"); clear(tbl);
    const cols = st.strengths, allMg = cols.length && cols.every(d => /mg$/i.test(d.trim()));
    $("matrixUnit").textContent = allMg ? "strengths in mg" : "";
    const thead = el("thead"), hr = el("tr");
    hr.append(el("th", "c-rank", "#"), el("th", "c-brand", "Brand"));
    cols.forEach(d => hr.appendChild(el("th", "c-dose", allMg ? d.replace(/\s*mg$/i, "") : d)));
    hr.appendChild(el("th", "c-count", "Count")); thead.appendChild(hr); tbl.appendChild(thead);
    const tb = el("tbody"), keys = cols.map(BP.doseKey);
    r.forEach((b, i) => {
      const have = new Set((b.doses || []).map(BP.doseKey)), tr = el("tr");
      const bc = el("td", "c-brand"); bc.append(el("div", "bname", b.brand), el("div", "bco", b.company));
      tr.append(el("td", "c-rank", i + 1), bc);
      keys.forEach((k, j) => { const td = el("td", "c-dose"); const dot = el("span", have.has(k) ? "tab tab-on" : "tab tab-off"); dot.setAttribute("aria-label", cols[j] + (have.has(k) ? " available" : " not offered")); td.appendChild(dot); tr.appendChild(td); });
      tr.appendChild(el("td", "c-count", have.size)); tb.appendChild(tr);
    });
    if (!r.length) { const tr = el("tr"), td = el("td", "empty", "No brands added for this molecule yet."); td.colSpan = cols.length + 3; tr.appendChild(td); tb.appendChild(tr); }
    tbl.appendChild(tb);

    $("brandsSub").textContent = !st.withRev.length ? `Top ${r.length} brands. Add last-year revenue to rank them and see the revenue chart.` : st.withRev.length === r.length ? `Top ${r.length} brands, ranked by last-year revenue.` : `Top ${r.length} brands. ${st.withRev.length} ranked by revenue, the rest in listed order.`;
    const note = $("dataNote"), gaps = [];
    if (r.length < 10) gaps.push(`${r.length} of 10 brands added`);
    if (st.withRev.length < r.length) gaps.push(`${r.length - st.withRev.length} without revenue`);
    note.hidden = !gaps.length;
    note.textContent = gaps.length ? `Data to add: ${gaps.join(", ")}. Use your AWACS or PharmaTrac MAT report, in data.js or by CSV import.` : "";

    /* Specialists: effort split + rows */
    const share = BP.effortShare(C.spec), ss = $("specShare"), sl = $("specList"); clear(ss); clear(sl);
    const maxS = Math.max(...share);
    C.spec.forEach(([s, p, why], i) => {
      const seg = el("span", "", share[i] >= 9 ? share[i] + "%" : ""); seg.style.width = share[i] + "%"; seg.style.background = PAL[i % PAL.length]; seg.title = `${s}: ${share[i]}%`; ss.appendChild(seg);
      const row = el("div", "spec-row"); row.style.setProperty("--c", PAL[i % PAL.length]);
      const who = el("div", "spec-who"); who.append(el("div", "spec-name", s), el("p", "spec-why", why));
      const eff = el("div", "spec-eff"), track = el("div", "bar-track"), f = el("span");
      f.style.width = (share[i] / maxS * 100) + "%"; f.style.background = PAL[i % PAL.length]; track.appendChild(f);
      eff.append(track, el("b", "", share[i] + "%"));
      const calls = el("div", "spec-calls"); calls.append(el("b", "", p === "High" ? "2–3" : p === "Medium" ? "1" : "CME"), el("small", "", p === "Low" ? "and digital" : "calls a month"));
      row.append(who, el("span", "pri pri-" + p, p), eff, calls); sl.appendChild(row);
    });

    $("results").hidden = false;
    $("results").scrollIntoView({ block: "start" });
    document.dispatchEvent(new CustomEvent("cdbd:show", { detail: { m, r, st, C, grp, PAL } }));
  }
  $("planTop").onclick = () => openPlan(window.CDBD_BENCH || null);
  $("planBottom").onclick = () => openPlan(window.CDBD_BENCH || null);

  /* ---------- Plan modal ---------- */
  const modal = $("planModal");
  let ideaSeed = 0;
  function takenNames() { return new Set(DB.flatMap(m => m.brands.map(b => b.brand.toLowerCase().replace(/[^a-z]/g, "")))); }
  function fillIdeas() {
    const box = $("nameIdeas"); clear(box);
    BP.nameIdeas(current, takenNames(), ideaSeed).forEach(n => { const b = el("button", "", n); b.type = "button"; b.onclick = () => { $("fBrand").value = n; $("fBrand").dispatchEvent(new Event("input")); }; box.appendChild(b); });
    const more = el("button", "", "More ideas"); more.type = "button"; more.style.borderStyle = "solid"; more.onclick = () => { ideaSeed++; fillIdeas(); }; box.appendChild(more);
  }
  function openPlan(benchBrand) {
    if (!current) return;
    $("modalMolecule").textContent = current.name;
    const sel = $("fBench"); clear(sel);
    const r = ranked(current);
    r.forEach(b => { const o = el("option", "", `${b.brand} (${b.company})`); o.value = b.brand; sel.appendChild(o); });
    if (!r.length) { const o = el("option", "", "No brands yet"); o.value = ""; sel.appendChild(o); }
    sel.value = benchBrand || (r[0] && r[0].brand) || "";
    ideaSeed = 0; fillIdeas();
    if (!$("fBrand").value || !$("fBrand").dataset.molecule || $("fBrand").dataset.molecule !== current.name) {
      $("fBrand").value = BP.nameIdeas(current, takenNames(), 0)[0] || ""; $("fBrand").dataset.molecule = current.name;
    }
    $("modalMsg").textContent = "";
    try { const c = localStorage.getItem("cdbd-company"); if (c && !$("fCompany").value) $("fCompany").value = c; } catch (e) { }
    document.dispatchEvent(new CustomEvent("cdbd:plan-open"));
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  $("makePdf").onclick = () => {
    const brand = $("fBrand").value.trim();
    if (!brand) { $("modalMsg").textContent = "Enter a brand name, or pick one of the ideas."; $("fBrand").focus(); return; }
    if (!window.jspdf) { $("modalMsg").textContent = "The PDF library didn’t load. Check that assets/vendor/jspdf.umd.min.js is in the repository."; return; }
    const company = $("fCompany").value.trim();
    try { if (company) localStorage.setItem("cdbd-company", company); } catch (e) { }
    const angle = (document.querySelector('input[name="angle"]:checked') || {}).value || "clinical";
    $("modalMsg").textContent = "Building your PDF…";
    setTimeout(() => {
      try {
        const plan = BP.buildPlan(current, ranked(current), { brand, company, angle, benchmark: $("fBench").value, geo: $("fGeo").value.trim() || "Pan-India" });
        BP.savePDF(plan);
        $("modalMsg").textContent = "Brand plan downloaded.";
      } catch (err) { console.error(err); $("modalMsg").textContent = "The PDF couldn’t be built: " + err.message; }
    }, 30);
  };

  /* ---------- CSV import ---------- */
  function parseCSV(text) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    const ne = rows.filter(r => r.some(x => x.trim())); if (!ne.length) return [];
    const head = ne[0].map(h => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
    return ne.slice(1).map(r => { const o = {}; head.forEach((h, i) => o[h] = (r[i] || "").trim()); return o; });
  }
  $("fileCsv").addEventListener("change", function () {
    const file = this.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      const rows = parseCSV(String(rd.result)).filter(r => r.molecule && r.brand);
      if (!rows.length) { alert("No rows found. The CSV needs at least the columns molecule and brand."); return; }
      const clean = rows.map(r => ({ molecule: r.molecule, brand: r.brand, company: r.company || "", doses: (r.doses || "").split(/[;|]/).map(s => s.trim()).filter(Boolean), revenue_cr: num(r.revenue_cr), period: r.period || "" }));
      imported = imported.concat(clean); saveImported(imported); DB = buildDB(); renderShelf();
      if (current) { const m = find(current.name); if (m) show(m); }
      alert(`Imported ${clean.length} brand rows.`);
    };
    rd.readAsText(file); this.value = "";
  });
  $("resetData").onclick = () => {
    if (!imported.length) return;
    if (!confirm("Remove the data you imported in this browser?")) return;
    imported = []; saveImported(imported); DB = buildDB(); renderShelf();
    if (current) { const m = find(current.name); if (m) show(m); else $("results").hidden = true; }
  };

  renderShelf();
})();
