/* Plan calculator: one-time start-up costs plus running costs that depend on
   the plan. Rates come from NOVA_CONFIG.PRICING. */
(function () {
  var cfg = window.NOVA_CONFIG, P = cfg.PRICING, L = window.L;
  var form = document.getElementById("calc");
  var $ = function (id) { return document.getElementById(id); };

  var PRESETS = {
    one: { format: "online", group: 0, groupSessions: 0, one: 1, oneType: "std", oneSessions: 4, length: 1, months: 3, ai: 1, evaluation: false, checkins: false },
    exec: { format: "hybrid", group: 0, groupSessions: 0, one: 1, oneType: "exec", oneSessions: 6, length: 1, months: 3, ai: 1, evaluation: false, checkins: false, onsite: 2 },
    group: { format: "online", oneType: "std", group: 6, groupSessions: 4, one: 0, oneSessions: 0, length: 2, months: 6, ai: 6, evaluation: true, checkins: false },
    pilot: { format: "hybrid", oneType: "exec", group: 10, groupSessions: 8, one: 2, oneSessions: 4, length: 1, months: 6, ai: 12, evaluation: true, checkins: true, onsite: 2 }
  };

  function eur(n) {
    return n.toLocaleString(window.NOVA_LANG === "en" ? "en-GB" : "de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  }
  function num(id, max) { var v = Math.max(0, Math.round(Number($(id).value) || 0)); return Math.min(v, max || v); }

  function apply(p) {
    form.querySelector('input[name=format][value="' + p.format + '"]').checked = true;
    ["group", "groupSessions", "one", "oneSessions", "months", "ai"].forEach(function (k) { $(k).value = p[k]; });
    $("length").value = String(p.length);
    $("oneType").value = p.oneType || "std";
    $("evaluation").checked = p.evaluation; $("checkins").checked = p.checkins;
    $("onsite").value = p.onsite || 0;
    calc();
  }

  function line(label, value) {
    return '<div class="sum-line"><span>' + label + "</span><span>" + eur(value) + "</span></div>";
  }

  function calc() {
    var format = form.querySelector("input[name=format]:checked").value;
    $("onsite").disabled = format === "online";
    var g = num("group", 15), gs = num("groupSessions", 16), o = num("one", 20), os = num("oneSessions", 16);
    var len = Number($("length").value), months = Math.max(1, num("months", 24)), ai = num("ai", 200);
    var allSessions = (g > 0 ? gs : 0) + o * os;
    var onsite = format === "online" ? 0 : format === "onsite" ? allSessions : Math.min(num("onsite", 32), allSessions);
    if (format === "onsite") $("onsite").value = allSessions;

    var groupCost = g > 0 ? gs * len * (P.groupBase + P.groupPerExtra * (g - 1)) : 0;
    var exec = $("oneType").value === "exec";
    var oneCost = o * os * len * (exec ? P.oneToOneExec : P.oneToOne);
    var aiCost = ai * P.aiLicence;
    var evalCost = $("evaluation").checked ? P.evaluation : 0;
    var checkCost = $("checkins").checked ? P.checkIns : 0;
    var travelCost = onsite * P.travel;
    var monthly = groupCost + oneCost + aiCost + evalCost + checkCost + travelCost;

    var setup = ai >= P.setupFrom ? P.setup : 0;
    var once = ai > 0 ? P.kickoff + setup : 0;
    var total = once + monthly * months;
    var people = Math.max(g + o, ai, 1);

    var len45 = len === 1 ? "45" : "90";
    $("once-lines").innerHTML = ai > 0
      ? line(L("Kick-off &amp; User-Training (KI-Coach)", "Kick-off &amp; user training (AI coach)"), P.kickoff) + (setup ? line(L("Einrichtung KI-Plattform", "AI platform set-up"), setup) : "")
      : '<div class="sum-line"><span>' + L("Nur Unterricht ohne KI-Coach: keine Startkosten", "Lessons only, without the AI coach: no start-up costs") + "</span><span>" + eur(0) + "</span></div>";
    $("once").textContent = eur(once);
    $("month-lines").innerHTML =
      (groupCost ? line(L("Gruppe: " + g + " Pers. · " + gs + " × " + len45 + " Min.", "Group: " + g + " people · " + gs + " × " + len45 + " min"), groupCost) : "") +
      (oneCost ? line((exec ? "Executive " : "") + "1:1: " + o + " × " + os + " × " + len45 + L(" Min.", " min"), oneCost) : "") +
      (aiCost ? line(L("KI-Coach: " + ai + " Lizenzen", "AI coach: " + ai + " licences"), aiCost) : "") +
      (evalCost ? line(L("Trainer-Auswertung", "Trainer evaluation"), evalCost) : "") +
      (checkCost ? line(L("Begleittermine", "Check-ins"), checkCost) : "") +
      (onsite ? (P.travel ? line(L("Anfahrt: " + onsite + " Termine vor Ort", "Travel: " + onsite + " on-site sessions"), travelCost)
        : '<div class="sum-line"><span>' + L(onsite + " Termine vor Ort: Anfahrt nach Aufwand", onsite + " on-site sessions: travel by arrangement") + "</span><span>–</span></div>") : "");
    $("monthly").textContent = eur(monthly);
    $("total-label").textContent = L("Gesamt für " + months + " Monate", "Total for " + months + " months");
    $("total").textContent = eur(total);
    $("pp").textContent = eur(total / (people * months));

    var summary = [
      "Plan-Rechner Found Fluency", "",
      "Format: " + format, "Gruppe: " + g + " Personen, " + gs + " Termine/Monat", "1:1" + (exec ? " (Executive)" : "") + ": " + o + " Personen, " + os + " Termine/Monat",
      "Dauer je Termin: " + len45 + " Min.", "KI-Lizenzen: " + ai, "Laufzeit: " + months + " Monate",
      "Einmalig: " + eur(once), "Pro Monat: " + eur(monthly), "Gesamt: " + eur(total)
    ].join("\n");
    $("request").href = "mailto:" + cfg.email + "?subject=" + encodeURIComponent(L("Angebotsanfrage", "Quote request") + " – Found Fluency AI") +
      "&body=" + encodeURIComponent(summary);
  }

  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  document.querySelectorAll("#presets [data-preset]").forEach(function (b) {
    b.addEventListener("click", function () { apply(PRESETS[b.getAttribute("data-preset")]); });
  });
  document.addEventListener("langchange", calc);

  var q = new URLSearchParams(location.search);
  if (PRESETS[q.get("preset")]) apply(PRESETS[q.get("preset")]);
  else if (q.get("n")) { var n = Math.max(1, Number(q.get("n")) || 12); apply(Object.assign({}, PRESETS.pilot, { group: Math.max(0, n - 2), ai: n })); }
  else calc();
})();
