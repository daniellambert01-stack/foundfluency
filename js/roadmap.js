/* Sprach-Roadmap: a short company self-assessment that returns an AI strategy
   type, a recommended pilot and a 30/60/90-day plan. */
(function () {
  var cfg = window.NOVA_CONFIG;
  var L = window.L;
  var form = document.getElementById("roadmap");
  var steps = form.querySelectorAll(".form-step");
  var bars = form.querySelectorAll(".progress span");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var errorEl = document.getElementById("form-error");
  var current = 0;
  var lastResult = null;

  function label() {
    var s = steps[current];
    document.getElementById("progress-label").textContent =
      L("Abschnitt ", "Section ") + (current + 1) + L(" von ", " of ") + steps.length + " · " + s.getAttribute("data-" + window.NOVA_LANG);
    next.textContent = current === steps.length - 1 ? L("Roadmap anzeigen →", "Show my Roadmap →") : L("Weiter →", "Continue →");
  }

  function show(i, noScroll) {
    current = i;
    steps.forEach(function (s, j) { s.classList.toggle("active", j === i); });
    bars.forEach(function (b, j) { b.classList.toggle("done", j <= i); });
    prev.hidden = i === 0;
    errorEl.textContent = "";
    label();
    if (!noScroll) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate() {
    var bad = Array.prototype.find.call(steps[current].querySelectorAll("[required]"), function (el) { return !el.checkValidity(); });
    if (bad) { bad.focus(); return L("Bitte füllen Sie alle Pflichtfelder aus.", "Please complete all required fields."); }
    if (current === 0 && !form.querySelector("input[name=dept]:checked")) return L("Bitte wählen Sie mindestens einen Bereich.", "Please choose at least one department.");
    if (current === 1 && !form.querySelector("input[name=lang]:checked")) return L("Bitte wählen Sie mindestens eine Sprache.", "Please choose at least one language.");
    return "";
  }

  prev.addEventListener("click", function () { if (current > 0) show(current - 1); });
  next.addEventListener("click", function () {
    var err = validate();
    if (err) { errorEl.textContent = err; return; }
    if (current < steps.length - 1) show(current + 1); else finish();
  });

  function values(name) {
    return Array.prototype.map.call(form.querySelectorAll("input[name=" + name + "]:checked"), function (x) { return x.value; });
  }

  // Strategy types from the maturity model used in the Found Fluency AI concept
  var TYPES = [
    { id: "pragmatic", de: "Pragmatisch", en: "Pragmatic",
      tde: "Sie starten mit KI. Ein kleiner, klar abgegrenzter Pilot mit schnellem Nutzen schafft Vertrauen und erste Daten.",
      ten: "You are starting out with AI. A small, clearly scoped pilot with quick benefits builds trust and first data." },
    { id: "adaptive", de: "Adaptiv", en: "Adaptive",
      tde: "Erste Piloten laufen, Lerndaten und Skalierung fehlen noch. Ein Pilot mit klaren KPIs liefert genau diese Daten.",
      ten: "First pilots are running; learning data and scaling are still missing. A pilot with clear KPIs provides exactly that data." },
    { id: "activating", de: "Aktivierend", en: "Activating",
      tde: "Ziele und Daten sind da. Jetzt geht es darum, die Nutzung in die Breite zu tragen: Pilot kurz halten, Rollout früh planen.",
      ten: "Goals and data are in place. Now it's about spreading usage: keep the pilot short and plan rollout early." },
    { id: "steady", de: "Stetig", en: "Steady",
      tde: "KI ist bei Ihnen etabliert. Found Fluency AI lässt sich direkt in mehreren Bereichen einführen, mit Fokus auf Qualität und Betreuung.",
      ten: "AI is established in your company. Found Fluency AI can be introduced in several departments directly, focusing on quality and ongoing care." }
  ];
  var DEPT = { sales: ["Vertrieb", "Sales"], eng: ["Engineering", "Engineering"], finance: ["Controlling", "Finance"],
    mgmt: ["Führung", "Management"], service: ["Service", "Service"], purchasing: ["Einkauf", "Purchasing"] };

  function finish() {
    var d = {
      name: form.querySelector("#name").value.trim(), email: form.querySelector("#email").value.trim(),
      company: form.querySelector("#company").value.trim(), role: form.querySelector("#role").value,
      size: Number(form.querySelector("#size").value), depts: values("dept"), langs: values("lang"), pains: values("pain"),
      training: form.querySelector("#training").value, maturity: values("mat"), council: form.querySelector("#council").value,
      start: form.querySelector("#start").value, notes: form.querySelector("#notes").value.trim()
    };
    var m = d.maturity.length;
    d.type = m <= 1 ? 0 : m === 2 ? 1 : m <= 4 ? 2 : 3;
    d.pilotSize = Math.min(12, Math.max(6, Math.round(d.size / 2)));
    lastResult = d;
    render();
    send(d);
  }

  function render() {
    var d = lastResult;
    if (!d) return;
    var t = TYPES[d.type];
    var lang = window.NOVA_LANG;
    document.getElementById("res-title").textContent = L("Roadmap für ", "Roadmap for ") + d.company;
    document.getElementById("res-types").innerHTML = TYPES.map(function (x, i) {
      return '<span class="pill" style="text-align:center;align-self:stretch;background:' + (i === d.type ? "var(--orange)" : "var(--cream-2)") +
        ";color:" + (i === d.type ? "#fff" : "var(--muted)") + '">' + x[lang] + "</span>";
    }).join("");
    document.getElementById("res-type-text").innerHTML = "<b>" + t[lang] + ":</b> " + (lang === "en" ? t.ten : t.tde);

    var first = d.depts.slice(0, 2).map(function (k) { return DEPT[k][lang === "en" ? 1 : 0]; }).join(L(" und ", " and "));
    document.getElementById("res-pilot").innerHTML = L(
      "<b>" + d.pilotSize + " Personen, 6 Monate</b>, beginnend mit <b>" + first + "</b>. Live-Training in der Gruppe plus 1:1 für die Führung, KI-Coach für alle. Einstufungstests in M0, M3 und M6.",
      "<b>" + d.pilotSize + " people, 6 months</b>, starting with <b>" + first + "</b>. Live group training plus 1:1 for management, AI coach for everyone. Placement tests in M0, M3 and M6.");

    var council = d.council !== "no";
    var plan = [
      [L("Erste 30 Tage", "First 30 days"), [
        L("Erstgespräch und Bedarfsanalyse", "First call and needs analysis"),
        L("Stakeholder einbinden: HR/L&D, Führung, Datenschutz, IT", "Involve stakeholders: HR/L&D, management, data protection, IT"),
        council ? L("Betriebsrat früh informieren", "Inform the works council early") : L("Freiwilligkeit und Freigabe-Regeln festlegen", "Set voluntariness and release rules")
      ]],
      [L("Tag 31–60", "Days 31–60"), [
        council ? L("Betriebsvereinbarung abschließen", "Conclude the works agreement") : L("Datenschutz-Folgenabschätzung abschließen", "Complete the data protection impact assessment"),
        L("KI-Plattform nach Kriterien auswählen (EU-Hosting, AVV)", "Select the AI platform against criteria (EU hosting, DPA)"),
        L("Pilotgruppe festlegen, Ziele je Person vorbereiten", "Define the pilot group, prepare goals per person")
      ]],
      [L("Tag 61–90", "Days 61–90"), [
        L("Kick-off & User-Training, Einstufungstest M0", "Kick-off & user training, placement test M0"),
        L("Pilot startet: Live-Training + KI-Coach", "Pilot starts: live training + AI coach"),
        L("Sprechstunde in Monat 1, erste KPIs im Cockpit", "Office hours in month 1, first KPIs in the cockpit")
      ]]
    ];
    document.getElementById("res-plan").innerHTML = plan.map(function (p, i) {
      return '<div class="card card--bar ' + ["c-teal", "c-orange", "c-coral"][i] + '" style="box-shadow:none;background:var(--cream)"><b>' + p[0] +
        '</b><ul style="padding-left:1.1em;margin:10px 0 0">' + p[1].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
    }).join("");

    var body = [
      "Sprach-Roadmap – " + d.company, "",
      "Name: " + d.name, "E-Mail: " + d.email, "Rolle: " + d.role, "Personen: ~" + d.size,
      "Bereiche: " + d.depts.join(", "), "Sprachen: " + d.langs.join(", "), "Herausforderungen: " + (d.pains.join(", ") || "-"),
      "Training heute: " + d.training, "Reifegrad: " + d.maturity.join(", ") + " → " + t.de, "Betriebsrat: " + d.council,
      "Start: " + d.start, "Notizen: " + (d.notes || "-"), "Empfohlener Pilot: " + d.pilotSize + " Personen, 6 Monate"
    ].join("\n");
    document.getElementById("res-email").href = "mailto:" + cfg.email + "?subject=" + encodeURIComponent("Sprach-Roadmap: " + d.company) +
      "&body=" + encodeURIComponent(body);

    document.getElementById("res-price").href = "pricing.html?n=" + d.pilotSize;
    form.hidden = true;
    var res = document.getElementById("results");
    res.hidden = false;
    window.resolveLinks(res);
  }

  function send(d) {
    if (!cfg.formEndpoint) return;
    fetch(cfg.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ _subject: "Sprach-Roadmap: " + d.company, _template: "table", name: d.name, email: d.email,
        company: d.company, role: d.role, size: d.size, departments: d.depts.join(", "), languages: d.langs.join(", "),
        challenges: d.pains.join(", "), training: d.training, maturity: d.maturity.join(", "), type: TYPES[d.type].de,
        works_council: d.council, start: d.start, notes: d.notes || "-" })
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      document.getElementById("res-status").textContent = L("Ihre Angaben wurden an Found Fluency gesendet. Wir melden uns innerhalb eines Werktags.",
        "Your answers have been sent to Found Fluency. We'll get back to you within one working day.");
    }).catch(function () { /* the email button remains as the fallback */ });
  }

  function restart(e) {
    e.preventDefault();
    lastResult = null;
    document.getElementById("results").hidden = true;
    form.hidden = false;
    show(0);
  }
  document.getElementById("restart").addEventListener("click", restart);
  document.getElementById("restart-en").addEventListener("click", restart);

  document.addEventListener("langchange", function () {
    label();
    if (lastResult) render();
  });
  show(0, true);
})();
