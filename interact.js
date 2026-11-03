/* Cardio-Diabetic Brand Desk — animation and interactive tools
   Listens for "cdbd:show" from app.js and adds:
   results entrance, gap finder + benchmark picker, revenue hover sync,
   field-force planner, launch timeline player and the live positioning preview. */
(function () {
  "use strict";
  const BP = window.BrandPlan;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = String(text); return e; };
  const clear = n => { while (n.firstChild) n.removeChild(n.firstChild); };
  const fmt = n => Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ctx = null;

  /* ---------- Number tween ---------- */
  function tween(node, to, opts) {
    opts = opts || {};
    const from = Number(node.dataset.v || 0), pre = opts.pre || "", suf = opts.suf || "";
    node.dataset.v = to;
    if (reduce()) { node.textContent = pre + fmt(to) + suf; return; }
    const t0 = performance.now(), dur = opts.dur || 650;
    cancelAnimationFrame(node._raf);
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = pre + fmt(from + (to - from) * e) + suf;
      if (k < 1) node._raf = requestAnimationFrame(step);
    };
    node._raf = requestAnimationFrame(step);
  }

  /* Filled track on range sliders */
  function fillRange(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%"); }
  document.querySelectorAll('input[type="range"]').forEach(r => { fillRange(r); r.addEventListener("input", () => fillRange(r)); });

  /* ---------- 1. Results entrance ---------- */
  function entrance() {
    const res = $("results");
    res.classList.remove("enter"); void res.offsetWidth; res.classList.add("enter");
    res.querySelectorAll(".tab-on,.tab-off").forEach((t, i) => t.style.setProperty("--i", i));
    res.querySelectorAll(".bar-track span,.share span").forEach((s, i) => s.style.setProperty("--i", i));
    res.querySelectorAll(".stat-v").forEach(v => {
      const m = v.textContent.match(/^(\D*)([\d,]+)(.*)$/);
      if (!m) return;
      v.dataset.v = 0; tween(v, Number(m[2].replace(/,/g, "")), { pre: m[1], suf: m[3], dur: 900 });
    });
  }

  /* ---------- 2. Gap finder and benchmark picker ---------- */
  function insightDefault() {
    const box = $("gapInsight"); clear(box);
    const b = window.CDBD_BENCH;
    box.className = "insight";
    box.append(el("b", "", b ? `Benchmark: ${b}` : "Tip"),
      el("span", "", b ? " Your brand plan will be built against this brand. Click a strength column to check for gaps." : " Click a strength to see who sells it and whether it is an open gap. Click a brand to set it as your benchmark."));
  }
  function wireMatrix() {
    const tbl = $("matrix"), heads = [...tbl.querySelectorAll("th.c-dose")], rows = [...tbl.querySelectorAll("tbody tr")];
    if (!ctx || !rows.length || !heads.length) { insightDefault(); return; }
    const total = ctx.r.length;
    let activeCol = -1;
    const colCells = j => rows.map(tr => tr.querySelectorAll("td.c-dose")[j]).filter(Boolean);

    heads.forEach((th, j) => {
      const label = th.textContent, btn = el("button", "col-btn", label);
      btn.type = "button"; btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `Show who sells ${label}`);
      clear(th); th.appendChild(btn);
      btn.onclick = () => {
        tbl.querySelectorAll(".col-on").forEach(c => c.classList.remove("col-on"));
        heads.forEach(h => h.firstChild.setAttribute("aria-pressed", "false"));
        if (activeCol === j) { activeCol = -1; insightDefault(); return; }
        activeCol = j; btn.setAttribute("aria-pressed", "true"); th.classList.add("col-on");
        colCells(j).forEach(c => c.classList.add("col-on"));
        const sellers = rows.filter(tr => { const c = tr.querySelectorAll("td.c-dose")[j]; return c && c.querySelector(".tab-on"); })
          .map(tr => tr.querySelector(".bname").textContent);
        const pct = sellers.length / total;
        const verdict = pct <= 0.34 ? ["gap", "Open gap", "Few competitors here. Launching this strength gives doctors a reason to start patients on your brand."]
          : pct >= 0.8 ? ["core", "Core strength", "Almost every brand sells this. It is table stakes: you must launch it."]
          : ["mid", "Contested", "Some brands sell it. Worth launching to keep patients on your brand while titrating."];
        const box = $("gapInsight"); clear(box); box.className = "insight insight-" + verdict[0];
        const meter = el("span", "meter"); for (let k = 0; k < total; k++) meter.appendChild(el("i", k < sellers.length ? "on" : ""));
        box.append(el("b", "", `${label}${/mg/i.test(label) ? "" : " mg"}: ${verdict[1]}`), meter,
          el("span", "", ` Sold by ${sellers.length} of ${total} brands${sellers.length ? " (" + sellers.slice(0, 4).join(", ") + (sellers.length > 4 ? "…" : "") + ")" : ""}. ${verdict[2]}`));
      };
    });

    rows.forEach(tr => {
      const name = tr.querySelector(".bname"); if (!name) return;
      const brand = name.textContent;
      tr.tabIndex = 0; tr.classList.add("pickable");
      tr.setAttribute("aria-label", `Set ${brand} as benchmark`);
      if (window.CDBD_BENCH === brand) markBench(tr);
      const pick = () => {
        const was = window.CDBD_BENCH === brand;
        rows.forEach(x => { x.classList.remove("is-bench"); const p = x.querySelector(".bench-pill"); if (p) p.remove(); });
        window.CDBD_BENCH = was ? null : brand;
        if (!was) markBench(tr);
        if (activeCol < 0) insightDefault();
      };
      tr.addEventListener("click", e => { if (!e.target.closest(".col-btn")) pick(); });
      tr.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    insightDefault();
  }
  function markBench(tr) {
    tr.classList.add("is-bench");
    const cell = tr.querySelector(".c-brand"); if (cell && !cell.querySelector(".bench-pill")) cell.querySelector(".bname").appendChild(el("span", "bench-pill", "Benchmark"));
  }

  /* ---------- 3. Revenue hover sync ---------- */
  function wireRevenue() {
    const rows = [...$("revBars").children], segs = [...$("revShare").children], legs = [...$("revLegend").children];
    const groups = [rows, segs, legs];
    const on = i => groups.forEach(g => g.forEach((n, k) => n.classList.toggle("dim", k !== i)));
    const off = () => groups.forEach(g => g.forEach(n => n.classList.remove("dim")));
    groups.forEach(g => g.forEach((n, i) => { n.addEventListener("mouseenter", () => on(i)); n.addEventListener("mouseleave", off); }));
  }

  /* ---------- 4. Field-force planner ---------- */
  const VISITS = { High: 2.5, Medium: 1, Low: 1 };
  function buildPlanner() {
    const box = $("plannerRows"); clear(box);
    const share = BP.effortShare(ctx.C.spec);
    ctx.C.spec.forEach(([s, p], i) => {
      const row = el("div", "p-row"); row.style.setProperty("--c", ctx.PAL[i % ctx.PAL.length]);
      const bar = el("div", "p-bar"), f = el("span"); bar.appendChild(f);
      const docs = el("b", "p-docs", "0"), calls = el("span", "p-calls", "");
      const nm = el("div", "p-name"); nm.append(el("span", "", s), el("small", "", `${share[i]}% of effort, ${p.toLowerCase()} priority`));
      const right = el("div", "p-right"); right.append(docs, calls);
      row.append(nm, bar, right); box.appendChild(row);
    });
    updatePlanner();
  }
  function updatePlanner() {
    if (!ctx) return;
    const reps = +$("reps").value, cpd = +$("cpd").value;
    $("repsOut").textContent = reps; $("cpdOut").textContent = cpd;
    const total = reps * cpd * 22, share = BP.effortShare(ctx.C.spec);
    const docs = ctx.C.spec.map(([, p], i) => Math.round(total * share[i] / 100 / VISITS[p]));
    const maxD = Math.max(1, ...docs);
    tween($("pCalls"), total); tween($("pDocs"), docs.reduce((a, b) => a + b, 0));
    [...$("plannerRows").children].forEach((row, i) => {
      row.querySelector(".p-bar span").style.width = (docs[i] / maxD * 100) + "%";
      tween(row.querySelector(".p-docs"), docs[i]);
      row.querySelector(".p-calls").textContent = `doctors, ${fmt(Math.round(total * share[i] / 100))} calls`;
    });
  }
  ["reps", "cpd"].forEach(id => $(id).addEventListener("input", updatePlanner));

  /* ---------- 5. Launch timeline player ---------- */
  const KIND = { field: ["var(--arterial)", "Field force"], medical: ["var(--insulin)", "Medical and KOL"], trade: ["var(--honey)", "Trade"], patient: ["var(--teal)", "Patient and digital"], review: ["var(--grey)", "Review"] };
  const PHASES = [["Q1", "Launch", "var(--arterial)"], ["Q2", "Advocacy", "var(--insulin)"], ["Q3", "Expand reach", "var(--honey)"], ["Q4", "Consolidate", "var(--teal)"]];
  let ws = [], timer = null;
  function buildTimeline() {
    const plan = BP.buildPlan(ctx.m, ctx.r, { brand: "Our brand", angle: "clinical", benchmark: window.CDBD_BENCH });
    ws = plan.workstreams;
    const g = $("gantt"); clear(g);
    g.appendChild(el("div", "g-corner", "Workstream"));
    PHASES.forEach(([q, f, c], i) => { const ph = el("div", "g-phase", `${q} ${f}`); ph.style.gridColumn = `${2 + i * 3} / span 3`; ph.style.setProperty("--c", c); g.appendChild(ph); });
    g.appendChild(el("div", "g-corner g-sp"));
    for (let mth = 1; mth <= 12; mth++) { const h = el("button", "g-month", "M" + mth); h.type = "button"; h.dataset.m = mth; h.style.gridColumn = String(mth + 1); h.setAttribute("aria-label", "Go to month " + mth); h.onclick = () => setMonth(mth, true); g.appendChild(h); }
    ws.forEach((w, i) => {
      const lab = el("div", "g-label", w.name); lab.style.gridRow = String(i + 3); g.appendChild(lab);
      const bar = el("div", "g-bar"); bar.style.gridRow = String(i + 3); bar.style.gridColumn = `${w.s + 1} / ${w.e + 2}`;
      bar.style.setProperty("--c", KIND[w.k][0]); bar.style.setProperty("--i", i); bar.title = `${w.name}: months ${w.s}–${w.e}`; bar.dataset.i = i;
      g.appendChild(bar);
    });
    g.appendChild(el("div", "g-head"));
    const leg = el("div", "g-legend");
    Object.values(KIND).forEach(([c, l]) => { const s = el("span"), i = el("i"); i.style.background = c; s.append(i, document.createTextNode(l)); leg.appendChild(s); });
    g.appendChild(leg); leg.style.gridRow = String(ws.length + 3);
    stop(); setMonth(1, false);
  }
  function setMonth(mth, user) {
    mth = Math.max(1, Math.min(12, mth));
    $("tlMonth").value = mth; fillRange($("tlMonth"));
    const g = $("gantt");
    g.style.setProperty("--m", mth);
    const ph = PHASES[Math.floor((mth - 1) / 3)];
    $("tlNow").textContent = "Month " + mth; $("tlPhase").textContent = `${ph[0]}, ${ph[1]}`; $("tlPhase").style.setProperty("--c", ph[2]);
    const act = [];
    g.querySelectorAll(".g-bar").forEach(b => { const w = ws[+b.dataset.i], on = mth >= w.s && mth <= w.e; b.classList.toggle("active", on); b.classList.toggle("starting", on && w.s === mth); if (on) act.push(w); });
    g.querySelectorAll(".g-label").forEach((l, i) => l.classList.toggle("active", mth >= ws[i].s && mth <= ws[i].e));
    g.querySelectorAll(".g-month").forEach(h => h.classList.toggle("now", +h.dataset.m === mth));
    const starting = act.filter(w => w.s === mth);
    $("tlActive").textContent = `${act.length} workstreams running` + (starting.length ? `. Starting this month: ${starting.map(w => w.name).join("; ")}.` : ".");
    const wrap = g.parentElement, lw = g.querySelector(".g-label") ? g.querySelector(".g-label").offsetWidth : 0;
    if (wrap.scrollWidth > wrap.clientWidth) {
      const x = lw + (g.scrollWidth - lw) * (mth - 1) / 12, vis = wrap.clientWidth - lw;
      if (x - wrap.scrollLeft > wrap.clientWidth - 40 || x - wrap.scrollLeft < lw) wrap.scrollTo({ left: Math.max(0, x - lw - vis / 3), behavior: reduce() ? "auto" : "smooth" });
    }
    if (user) stop();
  }
  function play() {
    const btn = $("tlPlay");
    if (timer) { stop(); return; }
    if (+$("tlMonth").value >= 12) setMonth(1, false);
    btn.classList.add("playing"); btn.setAttribute("aria-label", "Pause timeline");
    timer = setInterval(() => { const n = +$("tlMonth").value + 1; if (n > 12) { stop(); return; } setMonth(n, false); }, reduce() ? 1400 : 1000);
  }
  function stop() { clearInterval(timer); timer = null; const b = $("tlPlay"); b.classList.remove("playing"); b.setAttribute("aria-label", "Play timeline"); }
  $("tlPlay").addEventListener("click", play);
  $("tlMonth").addEventListener("input", e => setMonth(+e.target.value, true));

  /* ---------- 6. Live positioning preview ---------- */
  function updatePreview() {
    if (!ctx) return;
    const brand = $("fBrand").value.trim() || "Your brand";
    const angle = (document.querySelector('input[name="angle"]:checked') || {}).value || "clinical";
    const plan = BP.buildPlan(ctx.m, ctx.r, { brand, angle, benchmark: $("fBench").value, geo: $("fGeo").value.trim() || "Pan-India" });
    const p = $("prevText"), txt = plan.positioning;
    if (p.textContent === txt) return;
    p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap");
    clear(p);
    const i = txt.indexOf(brand);
    if (i >= 0) { p.append(document.createTextNode(txt.slice(0, i)), el("mark", "", brand), document.createTextNode(txt.slice(i + brand.length))); }
    else p.textContent = txt;
  }
  ["fBrand", "fGeo", "fBench"].forEach(id => { $(id).addEventListener("input", updatePreview); $(id).addEventListener("change", updatePreview); });
  document.querySelectorAll('input[name="angle"]').forEach(r => r.addEventListener("change", updatePreview));
  document.addEventListener("cdbd:plan-open", () => setTimeout(updatePreview, 0));

  /* ---------- Wire up on every search ---------- */
  document.addEventListener("cdbd:show", e => {
    ctx = e.detail;
    if (ctx.st.withRev.length >= 2) wireRevenue();
    wireMatrix();
    buildPlanner();
    buildTimeline();
    entrance();
  });
})();
